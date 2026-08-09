import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getErrorMessage } from '@/lib/utils';

// GET dashboard statistics
export async function GET() {
  try {
    // Get total products count
    const totalProducts = await prisma.product.count();

    // Get all products to calculate inventory value
    const products = await prisma.product.findMany({
      select: {
        quantity: true,
        unitPrice: true,
      },
    });

    // Calculate total inventory value
    const totalInventoryValue = products.reduce((sum, product) => {
      return sum + product.quantity * Number(product.unitPrice);
    }, 0);

    // Get low stock products (quantity <= minimum + 10% of (max - min))
    // Formula: current stock <= min + ((max - min) * 0.10)
    const allProducts = await prisma.product.findMany({
      select: {
        productId: true,
        productName: true,
        sku: true,
        quantity: true,
        minimumQuantity: true,
        maximumQuantity: true,
        unitPrice: true,
        warehouse: true,
      },
    });

    const lowStockProducts = allProducts.filter(product => {
      const threshold = product.minimumQuantity + ((product.maximumQuantity - product.minimumQuantity) * 0.10);
      return product.quantity <= threshold;
    });

    // Get products by warehouse
    const productsByWarehouse = await prisma.warehouse.findMany({
      select: {
        warehouseId: true,
        warehouseName: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    // Get total stock quantity
    const totalStockQuantity = products.reduce((sum, product) => {
      return sum + product.quantity;
    }, 0);

    // Recent stock movements
    const recentStockMovements = await prisma.stockMovement.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        product: true,
      },
    });

    // Calculate profit/loss for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentSales = await prisma.sale.findMany({
      where: {
        saleDate: { gte: thirtyDaysAgo },
      },
      include: {
        product: true,
      },
      orderBy: { saleDate: 'asc' },
    });

    // Calculate profit using stored cost of goods sold
    const profitData = recentSales.map((sale) => {
      const costOfGoodsSold = sale.costOfGoodsSold ? parseFloat(sale.costOfGoodsSold.toString()) : 0;
      const revenue = sale.soldQuantity * parseFloat(sale.salePrice.toString());
      const profit = revenue - costOfGoodsSold;

      return {
        date: sale.saleDate.toISOString().split('T')[0],
        profit,
        sales: sale.soldQuantity,
        revenue,
      };
    });

    // Group by date and sum profits
    const dailyProfitMap = new Map();
    profitData.forEach(item => {
      if (dailyProfitMap.has(item.date)) {
        const existing = dailyProfitMap.get(item.date);
        existing.profit += item.profit;
        existing.sales += item.sales;
        existing.revenue += item.revenue;
      } else {
        dailyProfitMap.set(item.date, { ...item });
      }
    });

    const dailyProfitData = Array.from(dailyProfitMap.values());
    const totalProfit = dailyProfitData.reduce((sum, d) => sum + d.profit, 0);
    const totalRevenue = dailyProfitData.reduce((sum, d) => sum + d.revenue, 0);

    return NextResponse.json({
      success: true,
      data: {
        totalProducts,
        totalInventoryValue: totalInventoryValue.toFixed(2),
        totalStockQuantity,
        lowStockCount: lowStockProducts.length,
        lowStockProducts,
        productsByWarehouse,
        recentStockMovements,
        profitData: dailyProfitData,
        totalProfit: totalProfit.toFixed(2),
        totalRevenue: totalRevenue.toFixed(2),
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard statistics', message: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
