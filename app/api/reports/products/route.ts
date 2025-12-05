import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        warehouse: true,
        creator: {
          select: {
            fullName: true,
          },
        },
      },
      orderBy: { productName: 'asc' },
    });

    const data = products.map((product) => ({
      'Product ID': product.productId,
      'Product Name': product.productName,
      'SKU': product.sku,
      'Unit Price': parseFloat(product.unitPrice.toString()),
      'Quantity': product.quantity,
      'Minimum Quantity': product.minimumQuantity,
      'Maximum Quantity': product.maximumQuantity,
      'Warehouse': product.warehouse?.warehouseName || 'N/A',
      'Recorded By': product.creator?.fullName || 'System',
      'Created At': new Date(product.createdAt).toLocaleString(),
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching products report:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products report' },
      { status: 500 }
    );
  }
}
