'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from './components/Navbar';
import FeaturedCrmDemoSection from './components/ui/featured-crm-demo-section';
import ProductStockTrend from './components/ui/product-stock-trend';
import DailyProfitLossBar from './components/ui/daily-profit-loss-bar';
import Footer from './components/Footer';

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
      <div className="min-h-screen flex items-center justify-center">
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
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-6 md:px-8 lg:px-12 py-8 pt-20">{/**/}
        {/* Featured CRM Demo Section */}
        <div className="mb-8">
          <FeaturedCrmDemoSection stats={{
            totalProducts: stats?.totalProducts || 0,
            totalInventoryValue: stats?.totalInventoryValue || '0.00',
            totalStockQuantity: stats?.totalStockQuantity || 0,
            lowStockCount: stats?.lowStockCount || 0
          }} />
        </div>

        {/* Daily Profit & Loss Bar Graph */}
        <div className="mb-8">
          <DailyProfitLossBar />
        </div>

        {/* Product Stock Trend Graph */}
        <div className="mb-8">
          <ProductStockTrend />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Products by Warehouse with Enhanced Glass Effect */}
          <div className="relative bg-white/40 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-transparent"></div>
            <div className="relative px-6 py-4 border-b border-gray-200/30 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Products by Warehouse</h2>
              </div>
            </div>
            <div className="relative p-6">
              {stats?.productsByWarehouse && stats.productsByWarehouse.length > 0 ? (
                <div className="space-y-3">
                  {stats.productsByWarehouse.map((warehouse: any, idx: number) => (
                    <Link key={warehouse.warehouseId} href="/products" className="group relative overflow-hidden block cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/5 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-center justify-between p-4 bg-white/50 hover:bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/30 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg">
                            {idx + 1}
                          </div>
                          <span className="font-semibold text-gray-900">{warehouse.warehouseName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-sm font-bold shadow-md group-hover:shadow-lg transition-shadow">
                            {warehouse._count.products}
                          </div>
                          <span className="text-xs text-gray-600 font-medium">items</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8 font-medium">No warehouses found</p>
              )}
            </div>
          </div>

          {/* Low Stock Alert with Enhanced UI */}
          <div className="relative bg-white/40 backdrop-blur-md border border-red-200/50 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-red-50/40 via-orange-50/20 to-transparent"></div>
            <div className="relative px-6 py-4 border-b border-red-200/30 bg-gradient-to-r from-red-500/5 to-orange-500/5">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-red-500/10 rounded-lg animate-pulse">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Low Stock Alert</h2>
                  <p className="text-xs text-gray-500">Critical inventory levels</p>
                </div>
              </div>
            </div>
            <div className="relative p-6">
              {stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  {stats.lowStockProducts.map((product: any) => (
                    <Link key={product.productId} href={`/products/${product.productId}`} className="group relative overflow-hidden block cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-400/0 via-red-400/5 to-red-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-center justify-between p-4 bg-gradient-to-r from-red-50/80 to-orange-50/60 hover:from-red-100/90 hover:to-orange-100/70 backdrop-blur-sm rounded-xl border border-red-200/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="p-2 bg-red-500/10 rounded-lg">
                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{product.productName}</p>
                            <p className="text-xs text-gray-600 mt-0.5">SKU: {product.sku}</p>
                            <div className="flex gap-3 mt-1 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                Min: {product.minimumQuantity}
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                Max: {product.maximumQuantity}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-sm font-bold shadow-md animate-pulse">
                            {product.quantity}
                          </div>
                          <span className="text-xs text-red-700 font-medium">remaining</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 font-medium">All products have sufficient stock</p>
                  <p className="text-sm text-gray-500 mt-1">Great job maintaining inventory levels!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
