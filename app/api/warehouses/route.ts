import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all warehouses
export async function GET() {
  try {
    const warehouses = await prisma.warehouse.findMany({
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: warehouses,
    });
  } catch (error: any) {
    console.error('Error fetching warehouses:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch warehouses', message: error.message },
      { status: 500 }
    );
  }
}
