import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activityLogger';

// GET all products with optional search and filter
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const warehouseId = searchParams.get('warehouseId');
    const supplierId = searchParams.get('supplierId');

    const where: any = {};

    // Search by name or SKU
    if (search) {
      where.OR = [
        { productName: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Filter by category
    if (category) {
      where.category = category;
    }

    // Filter by warehouse
    if (warehouseId) {
      where.warehouseId = parseInt(warehouseId);
    }

    // Filter by supplier
    if (supplierId) {
      where.supplierId = parseInt(supplierId);
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        warehouse: true,
        supplier: true,
        creator: {
          select: {
            userId: true,
            fullName: true,
          },
        },
      },
      orderBy: {
        productId: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products', message: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      productName,
      sku,
      category,
      unitPrice,
      quantity,
      minimumQuantity,
      maximumQuantity,
      warehouseId,
      supplierId,
      createdBy,
    } = body;

    // Validation
    if (!productName || !sku || !unitPrice) {
      return NextResponse.json(
        { success: false, error: 'Product name, SKU, and price are required' },
        { status: 400 }
      );
    }

    // Check if SKU already exists
    const existingProduct = await prisma.product.findUnique({
      where: { sku },
    });

    if (existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product with this SKU already exists' },
        { status: 409 }
      );
    }

    const product = await prisma.product.create({
      data: {
        productName,
        sku,
        category: category || null,
        unitPrice: parseFloat(unitPrice),
        quantity: parseInt(quantity || 0),
        minimumQuantity: parseInt(minimumQuantity || 0),
        maximumQuantity: parseInt(maximumQuantity || 0),
        warehouseId: warehouseId ? parseInt(warehouseId) : null,
        supplierId: supplierId ? parseInt(supplierId) : null,
        createdBy: createdBy ? parseInt(createdBy) : null,
      },
      include: {
        warehouse: true,
        supplier: true,
        creator: {
          select: {
            userId: true,
            fullName: true,
          },
        },
      },
    });

    // Log activity
    await logActivity({
      userId: createdBy ? parseInt(createdBy) : null,
      action: 'CREATE',
      entityType: 'PRODUCT',
      entityId: product.productId,
      entityName: product.productName,
      details: `Created product: ${product.productName} (SKU: ${product.sku})`,
    });

    return NextResponse.json(
      { success: true, data: product, message: 'Product created successfully' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product', message: error.message },
      { status: 500 }
    );
  }
}
