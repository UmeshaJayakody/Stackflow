import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get('days') || '30');

    // Calculate start date - going back 'days' number of days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    // Get all sales within the date range
    const sales = await prisma.sale.findMany({
      where: {
        saleDate: {
          gte: startDate,
          lte: endDate
        }
      },
      select: {
        saleId: true,
        saleDate: true,
        salePrice: true,
        soldQuantity: true,
        costOfGoodsSold: true
      },
      orderBy: {
        saleDate: 'asc'
      }
    });

    // Group sales by date and calculate daily metrics
    const dailyData = new Map<string, { revenue: number; profit: number; sales: number }>();

    sales.forEach(sale => {
      // Use local date to avoid timezone issues
      const localDate = new Date(sale.saleDate);
      const year = localDate.getFullYear();
      const month = String(localDate.getMonth() + 1).padStart(2, '0');
      const day = String(localDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      if (!dailyData.has(dateStr)) {
        dailyData.set(dateStr, { revenue: 0, profit: 0, sales: 0 });
      }

      const dayRecord = dailyData.get(dateStr)!;
      const revenue = parseFloat(sale.salePrice.toString()) * sale.soldQuantity;
      const cost = sale.costOfGoodsSold ? parseFloat(sale.costOfGoodsSold.toString()) : 0;
      const profit = revenue - cost;

      dayRecord.revenue += revenue;
      dayRecord.profit += profit;
      dayRecord.sales += 1;
    });

    // Create array with all dates in range (including today)
    const result = [];
    let totalRevenue = 0;
    let totalProfit = 0;

    for (let i = 0; i <= days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      const dayData = dailyData.get(dateStr);
      const revenue = dayData?.revenue || 0;
      const profit = dayData?.profit || 0;
      const salesCount = dayData?.sales || 0;

      totalRevenue += revenue;
      totalProfit += profit;

      result.push({
        date: dateStr,
        revenue: parseFloat(revenue.toFixed(2)),
        profit: parseFloat(profit.toFixed(2)),
        sales: salesCount
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        totalRevenue: totalRevenue.toFixed(2),
        totalProfit: totalProfit.toFixed(2),
        dailyData: result
      }
    });

  } catch (error) {
    console.error('Error fetching profit/loss data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profit/loss data' },
      { status: 500 }
    );
  }
}
