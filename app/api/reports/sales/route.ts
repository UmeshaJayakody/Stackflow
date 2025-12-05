import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        product: true,
        customer: true,
        user: {
          select: {
            fullName: true,
          },
        },
      },
      orderBy: { saleDate: 'desc' },
    });

    const data = sales.map((sale) => {
      const costOfGoodsSold = sale.costOfGoodsSold ? parseFloat(sale.costOfGoodsSold.toString()) : 0;
      const revenue = sale.soldQuantity * parseFloat(sale.salePrice.toString());
      const profit = revenue - costOfGoodsSold;

      return {
        'Sale ID': sale.saleId,
        'Product': sale.product.productName,
        'SKU': sale.product.sku,
        'Customer': sale.customer.customerName,
        'Quantity': sale.soldQuantity,
        'Sale Price': parseFloat(sale.salePrice.toString()),
        'Revenue': revenue,
        'Cost of Goods Sold': costOfGoodsSold,
        'Profit/Loss': profit,
        'Recorded By': sale.user?.fullName || 'System',
        'Sale Date': new Date(sale.saleDate).toLocaleString(),
      };
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching sales report:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sales report' },
      { status: 500 }
    );
  }
}
