'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from './components/Navbar';

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <header className="bg-white shadow-sm pt-16">
        <div className="container mx-auto px-4 py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Overview of your inventory</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalProducts || 0}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inventory Value</p>
                <p className="text-3xl font-bold text-green-600 mt-2">${stats?.totalInventoryValue || '0.00'}</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Stock</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalStockQuantity || 0}</p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{stats?.lowStockCount || 0}</p>
              </div>
              <div className="bg-red-100 rounded-full p-3">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Profit/Loss Graph */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
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
          <div className="p-6">
            {stats?.profitData && stats.profitData.length > 0 ? (
              <div className="space-y-4">
                {/* Line Graph */}
                <div className="relative h-64 border-l-2 border-b-2 border-gray-300">
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
                
                {/* Legend and Summary */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Profitable Days</p>
                    <p className="text-2xl font-bold text-green-600">
                      {stats.profitData.filter((d: any) => d.profit > 0).length}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Loss Days</p>
                    <p className="text-2xl font-bold text-red-600">
                      {stats.profitData.filter((d: any) => d.profit < 0).length}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Total Sales</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {stats.profitData.reduce((sum: number, d: any) => sum + d.sales, 0)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No sales data available for the last 30 days</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Products by Warehouse */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Products by Warehouse</h2>
            </div>
            <div className="p-6">
              {stats?.productsByWarehouse && stats.productsByWarehouse.length > 0 ? (
                <div className="space-y-4">
                  {stats.productsByWarehouse.map((warehouse: any) => (
                    <div key={warehouse.warehouseId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">{warehouse.warehouseName}</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                        {warehouse._count.products} products
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No warehouses found</p>
              )}
            </div>
          </div>

          {/* Low Stock Products */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Low Stock Alert</h2>
              <p className="text-xs text-gray-500 mt-1">Items at or below min + 10% of stock range</p>
            </div>
            <div className="p-6">
              {stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {stats.lowStockProducts.map((product: any) => (
                    <div key={product.productId} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
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
