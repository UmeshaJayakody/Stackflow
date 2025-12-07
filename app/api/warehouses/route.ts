import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activityLogger';

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
      orderBy: {
        warehouseName: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      data: warehouses
    });
  } catch (error: any) {
    console.error('Error fetching warehouses:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch warehouses', message: error.message },
      { status: 500 }
    );
  }
}

// POST create new warehouse
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const body = await request.json();
    const { warehouseName, location } = body;

    if (!warehouseName) {
      return NextResponse.json(
        { error: 'Warehouse name is required' },
        { status: 400 }
      );
    }

    const warehouse = await prisma.warehouse.create({
      data: {
        warehouseName,
        location: location || null,
      },
    });

    // Log activity
    if (userId) {
      await logActivity({
        userId: parseInt(userId),
        action: 'CREATE',
        entityType: 'WAREHOUSE',
        entityId: warehouse.warehouseId,
        details: `Created warehouse: ${warehouseName}`
      });
    }

    return NextResponse.json({ 
      success: true, 
      data: warehouse 
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating warehouse:', error);
    return NextResponse.json(
      { error: 'Failed to create warehouse', message: error.message },
      { status: 500 }
    );
  }
}

