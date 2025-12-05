import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH - Update stock quantity (add or remove stock)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { quantity, type } = body; // type: 'add' or 'remove'

    if (!quantity || !type) {
      return NextResponse.json(
        { success: false, error: 'Quantity and type (add/remove) are required' },
        { status: 400 }
      );
    }

    const quantityNum = parseInt(quantity);

    if (quantityNum <= 0) {
      return NextResponse.json(
        { success: false, error: 'Quantity must be greater than 0' },
        { status: 400 }
      );
    }

    // Get current product
    const product = await prisma.product.findUnique({
      where: { productId: parseInt(id) },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    let newQuantity = product.quantity;

    if (type === 'add') {
      newQuantity += quantityNum;
    } else if (type === 'remove') {
      if (product.quantity < quantityNum) {
        return NextResponse.json(
          { success: false, error: 'Insufficient stock quantity' },
          { status: 400 }
        );
      }
      newQuantity -= quantityNum;
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid type. Use "add" or "remove"' },
        { status: 400 }
      );
    }

    // Update product quantity and create stock movement
    const [updatedProduct] = await prisma.$transaction([
      prisma.product.update({
        where: { productId: parseInt(id) },
        data: { quantity: newQuantity },
        include: { warehouse: true },
      }),
      prisma.stockMovement.create({
        data: {
          productId: parseInt(id),
          quantity: quantityNum,
          type: type === 'add' ? 'IN' : 'OUT',
          reference: `Manual ${type === 'add' ? 'addition' : 'removal'}`,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: `Stock ${type === 'add' ? 'added' : 'removed'} successfully`,
    });
  } catch (error: any) {
    console.error('Error updating stock:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update stock', message: error.message },
      { status: 500 }
    );
  }
}
