import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const stockBatches = await prisma.stockBatch.findMany({
      where: {
        productId: parseInt(productId),
      },
      include: {
        purchase: {
          include: {
            supplier: true,
          },
        },
      },
      orderBy: { batchDate: 'desc' },
    });

    return NextResponse.json(stockBatches);
  } catch (error) {
    console.error('Error fetching stock batches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock batches' },
      { status: 500 }
    );
  }
}
