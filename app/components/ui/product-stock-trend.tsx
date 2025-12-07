'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, ChevronDown } from 'lucide-react';
import LoadingDots from '../LoadingDots';

interface Product {
  productId: number;
  productName: string;
  sku: string;
}

interface StockMovement {
  date: string;
  quantity: number;
  type: 'purchase' | 'sale';
  runningTotal: number;
}

export default function ProductStockTrend() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [stockData, setStockData] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      fetchStockTrend(selectedProduct);
    }
  }, [selectedProduct, timeRange]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const result = await response.json();
      if (result.success && result.data.length > 0) {
        setProducts(result.data);
        setSelectedProduct(result.data[0].productId);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchStockTrend = async (productId: number) => {
    setLoading(true);
    try {
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const response = await fetch(`/api/products/${productId}/stock-trend?days=${days}`);
      const result = await response.json();
      if (result.success) {
        setStockData(result.data);
      }
    } catch (error) {
      console.error('Error fetching stock trend:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedProductData = products.find(p => p.productId === selectedProduct);
  const maxStock = Math.max(...stockData.map(d => d.runningTotal), 0);
  const minStock = Math.min(...stockData.map(d => d.runningTotal), 0);
  const currentStock = stockData.length > 0 ? stockData[stockData.length - 1].runningTotal : 0;
  const previousStock = stockData.length > 1 ? stockData[0].runningTotal : currentStock;
  const stockChange = currentStock - previousStock;
  const stockChangePercent = previousStock !== 0 ? ((stockChange / previousStock) * 100).toFixed(1) : '0.0';

  return (
    <div className="relative bg-white/40 backdrop-blur-md border border-gray-200/50 rounded-2xl p-4 sm:p-6 shadow-2xl hover:shadow-3xl overflow-hidden transition-shadow duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent"></div>
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Stock Trend Analysis</h3>
            <p className="text-sm text-gray-600">Track daily inventory movements</p>
          </div>
          
          {/* Product Selector */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-white/60 hover:bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl transition-all duration-200 min-w-[200px]"
            >
              <span className="text-sm font-medium text-gray-900 truncate">
                {selectedProductData?.productName || 'Select Product'}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/50 max-h-64 overflow-y-auto z-10 custom-scrollbar">
                {products.map((product) => (
                  <button
                    key={product.productId}
                    onClick={() => {
                      setSelectedProduct(product.productId);
                      setShowDropdown(false);
                    }}
                    className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-100/70 transition-all duration-200 ${
                      selectedProduct === product.productId ? 'bg-blue-50/70 text-blue-900 font-medium' : 'text-gray-700'
                    }`}
                  >
                    <div className="font-medium">{product.productName}</div>
                    <div className="text-xs text-gray-500">SKU: {product.sku}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-gray-200/30">
            <p className="text-xs text-gray-600 font-medium mb-1">Current Stock</p>
            <p className="text-2xl font-bold text-gray-900">{currentStock}</p>
          </div>
          <div className="bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-gray-200/30">
            <p className="text-xs text-gray-600 font-medium mb-1">Change</p>
            <div className="flex items-center gap-2">
              <p className={`text-2xl font-bold ${stockChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stockChange >= 0 ? '+' : ''}{stockChange}
              </p>
              {stockChange >= 0 ? (
                <TrendingUp className="w-5 h-5 text-green-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-600" />
              )}
            </div>
          </div>
          <div className="bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-gray-200/30">
            <p className="text-xs text-gray-600 font-medium mb-1">Trend</p>
            <p className={`text-2xl font-bold ${parseFloat(stockChangePercent) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stockChangePercent}%
            </p>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2 mb-6">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                timeRange === range
                  ? 'bg-gray-900 text-white shadow-lg'
                  : 'bg-white/60 text-gray-700 hover:bg-white/80'
              }`}
            >
              {range === '7d' ? 'Last 7 days' : range === '30d' ? 'Last 30 days' : 'Last 90 days'}
            </button>
          ))}
        </div>

        {/* Chart */}
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <LoadingDots />
          </div>
        ) : stockData.length > 0 ? (
          <div className="relative h-64 bg-white/20 rounded-xl p-4">
            <svg className="w-full h-full" viewBox="0 0 1000 250" preserveAspectRatio="none">
              <defs>
                <linearGradient id="stockGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map((i) => (
                <line
                  key={i}
                  x1="0"
                  y1={i * 62.5}
                  x2="1000"
                  y2={i * 62.5}
                  stroke="#E5E7EB"
                  strokeWidth="1"
                  strokeDasharray="4"
                />
              ))}

              {/* Area under curve */}
              <path
                d={`M 0 250 ${stockData.map((point, i) => {
                  const x = (i / (stockData.length - 1)) * 1000;
                  const y = 250 - ((point.runningTotal - minStock) / (maxStock - minStock || 1)) * 250;
                  return `L ${x} ${y}`;
                }).join(' ')} L 1000 250 Z`}
                fill="url(#stockGradient)"
              />

              {/* Line */}
              <path
                d={`M ${stockData.map((point, i) => {
                  const x = (i / (stockData.length - 1)) * 1000;
                  const y = 250 - ((point.runningTotal - minStock) / (maxStock - minStock || 1)) * 250;
                  return `${x} ${y}`;
                }).join(' L ')}`}
                fill="none"
                stroke="#3B82F6"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {stockData.map((point, i) => {
                const x = (i / (stockData.length - 1)) * 1000;
                const y = 250 - ((point.runningTotal - minStock) / (maxStock - minStock || 1)) * 250;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#3B82F6"
                    className="hover:r-6 transition-all cursor-pointer"
                  >
                    <title>{`${new Date(point.date).toLocaleDateString()}: ${point.runningTotal} units`}</title>
                  </circle>
                );
              })}
            </svg>

            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-600 pr-2">
              <span>{Math.round(maxStock)}</span>
              <span>{Math.round((maxStock + minStock) / 2)}</span>
              <span>{Math.round(minStock)}</span>
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between mt-2 text-xs text-gray-600">
              {stockData.length > 0 && (
                <>
                  <span>{new Date(stockData[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  {stockData.length > 2 && (
                    <span>{new Date(stockData[Math.floor(stockData.length / 2)].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  )}
                  <span>{new Date(stockData[stockData.length - 1].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            No stock movement data available
          </div>
        )}
      </div>
    </div>
  );
}
