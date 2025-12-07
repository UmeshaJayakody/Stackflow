import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activityLogger';

// PUT update warehouse
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get('x-user-id');
    const { id } = await params;
    const warehouseId = parseInt(id);
    const body = await request.json();
    const { warehouseName, location } = body;

    if (!warehouseName) {
      return NextResponse.json(
        { error: 'Warehouse name is required' },
        { status: 400 }
      );
    }

    const warehouse = await prisma.warehouse.update({
      where: { warehouseId },
      data: {
        warehouseName,
        location: location || null,
      },
    });

    // Log activity
    if (userId) {
      await logActivity({
        userId: parseInt(userId),
        action: 'UPDATE',
        entityType: 'WAREHOUSE',
        entityId: warehouseId,
        details: `Updated warehouse: ${warehouseName}`
      });
    }

    return NextResponse.json({ 
      success: true, 
      data: warehouse 
    });
  } catch (error: any) {
    console.error('Error updating warehouse:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update warehouse', message: error.message },
      { status: 500 }
    );
  }
}

// DELETE warehouse
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get('x-user-id');
    const { id } = await params;
    const warehouseId = parseInt(id);

    // Check if warehouse has products
    const warehouse = await prisma.warehouse.findUnique({
      where: { warehouseId },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    if (!warehouse) {
      return NextResponse.json(
        { error: 'Warehouse not found' },
        { status: 404 }
      );
    }

    if (warehouse._count.products > 0) {
      return NextResponse.json(
        { error: `Cannot delete warehouse with ${warehouse._count.products} products. Please move or delete all products first.` },
        { status: 400 }
      );
    }

    await prisma.warehouse.delete({
      where: { warehouseId },
    });

    // Log activity
    if (userId) {
      await logActivity({
        userId: parseInt(userId),
        action: 'DELETE',
        entityType: 'WAREHOUSE',
        entityId: warehouseId,
        details: `Deleted warehouse: ${warehouse.warehouseName}`
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Warehouse deleted successfully' 
    });
  } catch (error: any) {
    console.error('Error deleting warehouse:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete warehouse', message: error.message },
      { status: 500 }
    );
  }
}
