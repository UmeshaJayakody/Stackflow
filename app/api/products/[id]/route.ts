import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activityLogger';

// GET single product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { productId: parseInt(id) },
      include: {
        warehouse: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product', message: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      productName,
      sku,
      unitPrice,
      quantity,
      minimumQuantity,
      maximumQuantity,
      warehouseId,
    } = body;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { productId: parseInt(id) },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if SKU is being changed and if it conflicts with another product
    if (sku && sku !== existingProduct.sku) {
      const skuConflict = await prisma.product.findUnique({
        where: { sku },
      });

      if (skuConflict) {
        return NextResponse.json(
          { success: false, error: 'Product with this SKU already exists' },
          { status: 409 }
        );
      }
    }

    const product = await prisma.product.update({
      where: { productId: parseInt(id) },
      data: {
        ...(productName && { productName }),
        ...(sku && { sku }),
        ...(unitPrice && { unitPrice: parseFloat(unitPrice) }),
        ...(quantity !== undefined && { quantity: parseInt(quantity) }),
        ...(minimumQuantity !== undefined && { minimumQuantity: parseInt(minimumQuantity) }),
        ...(maximumQuantity !== undefined && { maximumQuantity: parseInt(maximumQuantity) }),
        ...(warehouseId !== undefined && { warehouseId: warehouseId ? parseInt(warehouseId) : null }),
      },
      include: {
        warehouse: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product', message: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = request.headers.get('x-user-id');

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { productId: parseInt(id) },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    await prisma.product.delete({
      where: { productId: parseInt(id) },
    });

    // Log activity
    await logActivity({
      userId: userId ? parseInt(userId) : null,
      action: 'DELETE',
      entityType: 'PRODUCT',
      entityId: parseInt(id),
      entityName: existingProduct.productName,
      details: `Deleted product: ${existingProduct.productName} (SKU: ${existingProduct.sku})`,
    });

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product', message: error.message },
      { status: 500 }
    );
  }
}
