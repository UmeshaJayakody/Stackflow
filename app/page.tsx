'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from './components/Navbar';
import FeaturedCrmDemoSection from './components/ui/featured-crm-demo-section';
import ProductStockTrend from './components/ui/product-stock-trend';
import DailyProfitLossBar from './components/ui/daily-profit-loss-bar';

interface DashboardStats {
  totalProducts: number;
  totalInventoryValue: string;
  totalStockQuantity: number;
  lowStockCount: number;
  lowStockProducts: any[];
  productsByWarehouse: any[];
  recentStockMovements: any[];
  profitData: any[];
  totalProfit: string;
  totalRevenue: string;
}

export default function Home() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/dashboard');
      const result = await response.json();
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-gray-900 mx-auto"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/50 to-transparent blur-xl"></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <Navbar />

      {/* Header with Glass Effect */}
      <header className="bg-white/60 backdrop-blur-lg border-b border-gray-200/50 shadow-sm pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-gray-200/50 to-gray-100/50 rounded-lg blur opacity-25"></div>
            <div className="relative">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Overview of your inventory performance</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Featured CRM Demo Section */}
        <div className="mb-12">
          <FeaturedCrmDemoSection stats={{
            totalProducts: stats?.totalProducts || 0,
            totalInventoryValue: stats?.totalInventoryValue || '0.00',
            totalStockQuantity: stats?.totalStockQuantity || 0,
            lowStockCount: stats?.lowStockCount || 0
          }} />
        </div>

        {/* Product Stock Trend Graph */}
        <div className="mb-8">
          <ProductStockTrend />
        </div>

        {/* Daily Profit & Loss Bar Graph */}
        <div className="mb-8">
          <DailyProfitLossBar />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Products by Warehouse with Glass Effect */}
          <div className="relative bg-white/40 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent"></div>
            <div className="relative px-6 py-4 border-b border-gray-200/30">
              <h2 className="text-lg font-semibold text-gray-900">Products by Warehouse</h2>
            </div>
            <div className="relative p-6">
              {stats?.productsByWarehouse && stats.productsByWarehouse.length > 0 ? (
                <div className="space-y-3">
                  {stats.productsByWarehouse.map((warehouse: any) => (
                    <div key={warehouse.warehouseId} className="group flex items-center justify-between p-4 bg-white/50 hover:bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/30 transition-all duration-300 hover:shadow-md">
                      <span className="font-medium text-gray-900">{warehouse.warehouseName}</span>
                      <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 rounded-full text-sm font-semibold shadow-sm">
                        {warehouse._count.products} products
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4 font-medium">No warehouses found</p>
              )}
            </div>
          </div>

          {/* Low Stock Products with Glass Effect */}
          <div className="relative bg-white/40 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-50/30 to-transparent"></div>
            <div className="relative px-6 py-4 border-b border-gray-200/30">
              <h2 className="text-lg font-semibold text-gray-900">Low Stock Alert</h2>
              <p className="text-xs text-gray-500 mt-1">Items at or below min + 10% of stock range</p>
            </div>
            <div className="relative p-6">
              {stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  {stats.lowStockProducts.map((product: any) => (
                    <div key={product.productId} className="group flex items-center justify-between p-4 bg-red-50/60 hover:bg-red-50/80 backdrop-blur-sm rounded-xl border border-red-200/50 transition-all duration-300 hover:shadow-md">
                      <div>
                        <p className="font-medium text-gray-900">{product.productName}</p>
                        <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Min: {product.minimumQuantity} | Max: {product.maximumQuantity}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm font-semibold">
                        {product.quantity} left
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">All products have sufficient stock</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/products"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              View All Products
            </Link>
            <Link
              href="/products/new"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Add New Product
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
