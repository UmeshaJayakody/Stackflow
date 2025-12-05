import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activityLogger';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get('productId');

    const where = productId ? { productId: parseInt(productId) } : {};

    const sales = await prisma.sale.findMany({
      where,
      include: {
        product: true,
        customer: true,
        user: {
          select: {
            userId: true,
            fullName: true,
          },
        },
      },
      orderBy: { saleDate: 'desc' },
    });

    // Calculate profit using stored cost of goods sold
    const salesWithProfit = sales.map((sale) => {
      const costOfGoodsSold = sale.costOfGoodsSold ? parseFloat(sale.costOfGoodsSold.toString()) : 0;
      const revenue = sale.soldQuantity * parseFloat(sale.salePrice.toString());
      const profit = revenue - costOfGoodsSold;

      return {
        ...sale,
        profit,
        costOfGoodsSold,
      };
    });

    return NextResponse.json(salesWithProfit);
  } catch (error) {
    console.error('Error fetching sales:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sales' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerId,
      productId,
      soldQuantity,
      salePrice,
      createdBy,
    } = body;

    // Validation
    if (!customerId || !productId || !soldQuantity || !salePrice) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (soldQuantity <= 0) {
      return NextResponse.json(
        { error: 'Quantity must be greater than 0' },
        { status: 400 }
      );
    }

    // Check if product has enough stock
    const product = await prisma.product.findUnique({
      where: { productId: parseInt(productId) },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (product.quantity < soldQuantity) {
      return NextResponse.json(
        { error: `Insufficient stock. Available: ${product.quantity}` },
        { status: 400 }
      );
    }

    // Create sale and update product stock in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Get stock batches ordered by FIFO (oldest first)
      const stockBatches = await tx.stockBatch.findMany({
        where: {
          productId: parseInt(productId),
          quantityRemaining: { gt: 0 },
        },
        orderBy: { batchDate: 'asc' },
      });

      // Calculate cost using FIFO and update batches
      let remainingQty = parseInt(soldQuantity);
      let totalCost = 0;

      for (const batch of stockBatches) {
        if (remainingQty <= 0) break;

        const qtyToConsume = Math.min(remainingQty, batch.quantityRemaining);
        totalCost += qtyToConsume * parseFloat(batch.purchasePrice.toString());
        remainingQty -= qtyToConsume;

        // Update batch quantity
        await tx.stockBatch.update({
          where: { batchId: batch.batchId },
          data: {
            quantityRemaining: batch.quantityRemaining - qtyToConsume,
          },
        });
      }

      if (remainingQty > 0) {
        throw new Error('Insufficient stock batches available');
      }

      // Calculate profit
      const revenue = parseInt(soldQuantity) * parseFloat(salePrice);
      const profit = revenue - totalCost;

      // Create sale record with cost of goods sold
      const sale = await tx.sale.create({
        data: {
          customerId: parseInt(customerId),
          productId: parseInt(productId),
          soldQuantity: parseInt(soldQuantity),
          salePrice: parseFloat(salePrice),
          costOfGoodsSold: totalCost,
          createdBy: createdBy ? parseInt(createdBy) : null,
        },
        include: {
          product: true,
          customer: true,
        },
      });

      // Update product stock quantity
      await tx.product.update({
        where: { productId: parseInt(productId) },
        data: {
          quantity: {
            decrement: parseInt(soldQuantity),
          },
        },
      });

      // Create stock movement record
      await tx.stockMovement.create({
        data: {
          productId: parseInt(productId),
          quantity: -parseInt(soldQuantity),
          type: 'OUT',
          reference: `Sale #${sale.saleId}`,
          userId: createdBy ? parseInt(createdBy) : null,
        },
      });

      return {
        ...sale,
        profit,
        costOfGoodsSold: totalCost,
      };
    });

    // Log activity
    await logActivity({
      userId: createdBy ? parseInt(createdBy) : null,
      action: 'CREATE',
      entityType: 'SALE',
      entityId: result.saleId,
      entityName: `${result.product.productName} to ${result.customer.customerName}`,
      details: `Recorded sale: ${soldQuantity} units of ${result.product.productName} to ${result.customer.customerName} at $${salePrice}/unit (Profit: $${result.profit.toFixed(2)})`,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating sale:', error);
    return NextResponse.json(
      { error: 'Failed to create sale' },
      { status: 500 }
    );
  }
}
