'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from './components/Navbar';
import FeaturedCrmDemoSection from './components/ui/featured-crm-demo-section';
import ProductStockTrend from './components/ui/product-stock-trend';

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

        {/* Profit/Loss Graph with Glass Effect */}
        <div className="relative bg-white/40 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-xl mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent"></div>
          <div className="relative px-6 py-4 border-b border-gray-200/30">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Daily Profit & Loss Trend (FIFO)</h2>
                <p className="text-sm text-gray-500 mt-1">Last 30 days performance using First-In-First-Out costing</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-blue-600">${stats?.totalRevenue || '0.00'}</p>
                <p className="text-sm text-gray-600 mt-2">Total Profit</p>
                <p className={`text-2xl font-bold ${parseFloat(stats?.totalProfit || '0') >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${stats?.totalProfit || '0.00'}
                </p>
              </div>
            </div>
          </div>
          <div className="relative p-6">
            {stats?.profitData && stats.profitData.length > 0 ? (
              <div className="space-y-4">
                {/* Line Graph with Glass Container */}
                <div className="relative h-64 border-l-2 border-b-2 border-gray-300/50 bg-white/20 rounded-lg p-4">
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 bottom-0 w-16 flex flex-col justify-between text-xs text-gray-600 pr-2 text-right pb-6">
                    {(() => {
                      const maxProfit = Math.max(...stats.profitData.map((d: any) => d.profit), 0);
                      const minProfit = Math.min(...stats.profitData.map((d: any) => d.profit), 0);
                      const range = maxProfit - minProfit;
                      const step = range / 4;
                      return [maxProfit, maxProfit - step, maxProfit - 2 * step, maxProfit - 3 * step, minProfit].map((val, i) => (
                        <span key={i}>${val.toFixed(0)}</span>
                      ));
                    })()}
                  </div>
                  
                  {/* Graph area */}
                  <div className="absolute left-16 right-0 top-0 bottom-6 ml-4">
                    <svg className="w-full h-full" preserveAspectRatio="none">
                      {(() => {
                        const data = stats.profitData;
                        const maxProfit = Math.max(...data.map((d: any) => d.profit), 0);
                        const minProfit = Math.min(...data.map((d: any) => d.profit), 0);
                        const range = maxProfit - minProfit || 1;
                        
                        // Calculate points for the line
                        const points = data.map((item: any, index: number) => {
                          const x = (index / (data.length - 1)) * 100;
                          const y = ((maxProfit - item.profit) / range) * 100;
                          return `${x},${y}`;
                        }).join(' ');
                        
                        // Create path for area under the curve
                        const areaPoints = `0,100 ${points} ${((data.length - 1) / (data.length - 1)) * 100},100`;
                        
                        return (
                          <>
                            {/* Zero line */}
                            {minProfit < 0 && maxProfit > 0 && (
                              <line
                                x1="0%"
                                y1={`${((maxProfit - 0) / range) * 100}%`}
                                x2="100%"
                                y2={`${((maxProfit - 0) / range) * 100}%`}
                                stroke="#9CA3AF"
                                strokeWidth="1"
                                strokeDasharray="4"
                              />
                            )}
                            
                            {/* Area under curve */}
                            <polygon
                              points={areaPoints}
                              fill="url(#gradient)"
                              opacity="0.3"
                            />
                            
                            {/* Line */}
                            <polyline
                              points={points}
                              fill="none"
                              stroke="#10B981"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            
                            {/* Data points */}
                            {data.map((item: any, index: number) => {
                              const x = (index / (data.length - 1)) * 100;
                              const y = ((maxProfit - item.profit) / range) * 100;
                              return (
                                <circle
                                  key={index}
                                  cx={`${x}%`}
                                  cy={`${y}%`}
                                  r="4"
                                  fill={item.profit >= 0 ? '#10B981' : '#EF4444'}
                                  stroke="white"
                                  strokeWidth="2"
                                />
                              );
                            })}
                            
                            {/* Gradient definition */}
                            <defs>
                              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#10B981" stopOpacity="0.1" />
                              </linearGradient>
                            </defs>
                          </>
                        );
                      })()}
                    </svg>
                  </div>
                  
                  {/* X-axis labels */}
                  <div className="absolute left-16 right-0 bottom-0 ml-4 flex justify-between text-xs text-gray-600">
                    {stats.profitData.length > 0 && (
                      <>
                        <span>{new Date(stats.profitData[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        {stats.profitData.length > 2 && (
                          <span>{new Date(stats.profitData[Math.floor(stats.profitData.length / 2)].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        )}
                        <span>{new Date(stats.profitData[stats.profitData.length - 1].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Legend and Summary with Glass Cards */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-200/30">
                  <div className="text-center bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-green-200/30">
                    <p className="text-sm text-gray-600 font-medium">Profitable Days</p>
                    <p className="text-2xl font-bold text-green-600 mt-2">
                      {stats.profitData.filter((d: any) => d.profit > 0).length}
                    </p>
                  </div>
                  <div className="text-center bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-red-200/30">
                    <p className="text-sm text-gray-600 font-medium">Loss Days</p>
                    <p className="text-2xl font-bold text-red-600 mt-2">
                      {stats.profitData.filter((d: any) => d.profit < 0).length}
                    </p>
                  </div>
                  <div className="text-center bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-blue-200/30">
                    <p className="text-sm text-gray-600 font-medium">Total Sales</p>
                    <p className="text-2xl font-bold text-blue-600 mt-2">
                      {stats.profitData.reduce((sum: number, d: any) => sum + d.sales, 0)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8 font-medium">No sales data available for the last 30 days</p>
            )}
          </div>
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
