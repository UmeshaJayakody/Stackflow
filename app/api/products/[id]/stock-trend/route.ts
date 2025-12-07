import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);
    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get('days') || '30');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get purchases for this product
    const purchases = await prisma.purchase.findMany({
      where: {
        productId,
        purchaseDate: {
          gte: startDate
        }
      },
      select: {
        purchasedQuantity: true,
        purchaseDate: true
      },
      orderBy: {
        purchaseDate: 'asc'
      }
    });

    // Get sales for this product
    const sales = await prisma.sale.findMany({
      where: {
        productId,
        saleDate: {
          gte: startDate
        }
      },
      select: {
        soldQuantity: true,
        saleDate: true
      },
      orderBy: {
        saleDate: 'asc'
      }
    });

    // Get initial stock (stock before the start date)
    const initialPurchases = await prisma.purchase.aggregate({
      where: {
        productId,
        purchaseDate: {
          lt: startDate
        }
      },
      _sum: {
        purchasedQuantity: true
      }
    });

    const initialSales = await prisma.sale.aggregate({
      where: {
        productId,
        saleDate: {
          lt: startDate
        }
      },
      _sum: {
        soldQuantity: true
      }
    });

    const initialStock = (initialPurchases._sum?.purchasedQuantity || 0) - (initialSales._sum?.soldQuantity || 0);

    // Combine and process movements
    const movements = [
      ...purchases.map(p => ({
        date: p.purchaseDate.toISOString().split('T')[0],
        quantity: p.purchasedQuantity,
        type: 'purchase' as const
      })),
      ...sales.map(s => ({
        date: s.saleDate.toISOString().split('T')[0],
        quantity: -s.soldQuantity,
        type: 'sale' as const
      }))
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Group by date and calculate running total
    const dailyData = new Map<string, { purchases: number; sales: number }>();
    
    movements.forEach(m => {
      if (!dailyData.has(m.date)) {
        dailyData.set(m.date, { purchases: 0, sales: 0 });
      }
      const day = dailyData.get(m.date)!;
      if (m.type === 'purchase') {
        day.purchases += m.quantity;
      } else {
        day.sales += Math.abs(m.quantity);
      }
    });

    // Create array with all dates in range (including today)
    const result = [];
    let runningTotal = initialStock;
    
    for (let i = 0; i <= days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayData = dailyData.get(dateStr);
      if (dayData) {
        runningTotal += dayData.purchases - dayData.sales;
      }
      
      result.push({
        date: dateStr,
        quantity: dayData ? dayData.purchases - dayData.sales : 0,
        type: dayData ? (dayData.purchases > dayData.sales ? 'purchase' : 'sale') : 'purchase',
        runningTotal
      });
    }

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error fetching stock trend:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stock trend' },
      { status: 500 }
    );
  }
}
