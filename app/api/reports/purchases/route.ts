import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const purchases = await prisma.purchase.findMany({
      include: {
        product: true,
        supplier: true,
        user: {
          select: {
            fullName: true,
          },
        },
      },
      orderBy: { purchaseDate: 'desc' },
    });

    const data = purchases.map((purchase) => ({
      'Purchase ID': purchase.purchaseId,
      'Product': purchase.product.productName,
      'SKU': purchase.product.sku,
      'Supplier': purchase.supplier.supplierName,
      'Quantity': purchase.purchasedQuantity,
      'Purchase Price': parseFloat(purchase.purchasePrice.toString()),
      'Total Cost': purchase.purchasedQuantity * parseFloat(purchase.purchasePrice.toString()),
      'Recorded By': purchase.user?.fullName || 'System',
      'Purchase Date': new Date(purchase.purchaseDate).toLocaleString(),
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching purchases report:', error);
    return NextResponse.json(
      { error: 'Failed to fetch purchases report' },
      { status: 500 }
    );
  }
}
