'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';
import LoadingDots from '../LoadingDots';

interface DailyProfit {
  date: string;
  revenue: number;
  profit: number;
  sales: number;
}

interface ProfitLossStats {
  totalRevenue: string;
  totalProfit: string;
  dailyData: DailyProfit[];
}

export default function DailyProfitLossBar() {
  const [data, setData] = useState<ProfitLossStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    fetchProfitData();
  }, [timeRange]);

  const fetchProfitData = async () => {
    setLoading(true);
    try {
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const response = await fetch(`/api/reports/profit-loss?days=${days}`);
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Error fetching profit data:', error);
    } finally {
      setLoading(false);
    }
  };

  const dailyData = data?.dailyData || [];
  const maxValue = Math.max(...dailyData.map(d => Math.max(d.revenue, Math.abs(d.profit))), 1); // At least 1 to avoid division by zero
  const totalRevenue = parseFloat(data?.totalRevenue || '0');
  const totalProfit = parseFloat(data?.totalProfit || '0');
  const profitMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : '0.0';
  const hasData = dailyData.some(d => d.revenue > 0 || d.profit !== 0);

  return (
    <div className="relative bg-white/40 backdrop-blur-md border border-gray-200/50 rounded-2xl p-4 sm:p-6 shadow-2xl hover:shadow-3xl overflow-hidden transition-shadow duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent"></div>
      
      <div className="relative">
        {/* Header with Stats */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3 sm:gap-0 mb-4">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Daily Profit & Loss Analysis</h3>
              <p className="text-xs sm:text-sm text-gray-600">Revenue and profit trends over time</p>
            </div>
            
            {/* Time Range Selector */}
            <div className="flex gap-1.5 sm:gap-2 w-full sm:w-auto">
              {(['7d', '30d', '90d'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`flex-1 sm:flex-none px-2 sm:px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                    timeRange === range
                      ? 'bg-gray-900 text-white shadow-lg'
                      : 'bg-white/60 text-gray-700 hover:bg-white/80'
                  }`}
                >
                  {range === '7d' ? '7d' : range === '30d' ? '30d' : '90d'}
                </button>
              ))}
            </div>
          </div>

          {/* Summary Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
            {/* Total Revenue */}
            <div className="relative bg-gradient-to-br from-blue-50/80 to-blue-100/40 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-blue-200/50 overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-400/10 rounded-full -mr-10 -mt-10"></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 sm:p-2 bg-blue-500/20 rounded-lg">
                    <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                  </div>
                  <p className="text-xs font-medium text-blue-900">Total Revenue</p>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-blue-900">${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p className="text-xs text-blue-700 mt-1">
                  {dailyData.reduce((sum, d) => sum + d.sales, 0)} total sales
                </p>
              </div>
            </div>

            {/* Total Profit */}
            <div className={`relative bg-gradient-to-br ${totalProfit >= 0 ? 'from-green-50/80 to-green-100/40' : 'from-red-50/80 to-red-100/40'} backdrop-blur-sm rounded-xl p-3 sm:p-4 border ${totalProfit >= 0 ? 'border-green-200/50' : 'border-red-200/50'} overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300`}>
              <div className={`absolute top-0 right-0 w-20 h-20 ${totalProfit >= 0 ? 'bg-green-400/10' : 'bg-red-400/10'} rounded-full -mr-10 -mt-10`}></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 sm:p-2 ${totalProfit >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'} rounded-lg`}>
                    <Wallet className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                  </div>
                  <p className={`text-xs font-medium ${totalProfit >= 0 ? 'text-green-900' : 'text-red-900'}`}>Total Profit</p>
                </div>
                <p className={`text-xl sm:text-2xl font-bold ${totalProfit >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                  {totalProfit >= 0 ? '+' : ''}${Math.abs(totalProfit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {totalProfit >= 0 ? (
                    <TrendingUp className="w-3 h-3 text-green-600" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-600" />
                  )}
                  <p className={`text-xs ${totalProfit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {profitMargin}% margin
                  </p>
                </div>
              </div>
            </div>

            {/* Average Daily Profit */}
            <div className="relative bg-gradient-to-br from-purple-50/80 to-purple-100/40 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-purple-200/50 overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-400/10 rounded-full -mr-10 -mt-10"></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 sm:p-2 bg-purple-500/20 rounded-lg">
                    <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" />
                  </div>
                  <p className="text-xs font-medium text-purple-900">Avg Daily Profit</p>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-purple-900">
                  ${dailyData.length > 0 ? (totalProfit / dailyData.length).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                </p>
                <p className="text-xs text-purple-700 mt-1">
                  Over {dailyData.length} days
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        {loading ? (
          <div className="h-80 flex items-center justify-center">
            <LoadingDots />
          </div>
        ) : hasData ? (
          <div className="relative bg-white/20 rounded-xl p-3 sm:p-6">
            {/* Legend */}
            <div className="flex items-center justify-center gap-3 sm:gap-6 mb-3 sm:mb-4 flex-wrap">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded"></div>
                <span className="text-[10px] sm:text-xs font-medium text-gray-700">Revenue</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-green-500 to-green-600 rounded"></div>
                <span className="text-[10px] sm:text-xs font-medium text-gray-700">Profit</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-red-500 to-red-600 rounded"></div>
                <span className="text-[10px] sm:text-xs font-medium text-gray-700">Loss</span>
              </div>
            </div>

            {/* Bar Chart Container */}
            <div className="relative h-48 sm:h-64 flex items-end gap-0.5 sm:gap-1 overflow-x-auto pl-8 sm:pl-12 pr-1 sm:pr-2">
              {dailyData.map((day, index) => {
                const revenueHeight = Math.min((day.revenue / maxValue) * 100, 100);
                const profitHeight = Math.min((Math.abs(day.profit) / maxValue) * 100, 100);
                const isProfitable = day.profit >= 0;

                return (
                  <div key={index} className="flex-1 flex flex-col-reverse items-center gap-1 group h-full justify-end">
                    {/* Date Label */}
                    <div className="text-[9px] text-gray-600 font-medium whitespace-nowrap mb-1">
                      {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>

                    {/* Bars Container */}
                    <div className="w-full flex flex-col-reverse items-center gap-0.5 relative flex-1">
                      {/* Profit/Loss Bar */}
                      <div className="w-full relative flex items-end" style={{ height: `${profitHeight}%` }}>
                        <div
                          className={`w-full bg-gradient-to-t ${
                            isProfitable 
                              ? 'from-green-500 to-green-400 hover:from-green-600 hover:to-green-500' 
                              : 'from-red-500 to-red-400 hover:from-red-600 hover:to-red-500'
                          } rounded-t transition-all duration-300 cursor-pointer relative group/bar h-full min-h-[2px]`}
                        >
                          {/* Tooltip for Profit/Loss */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap z-10 pointer-events-none">
                            {isProfitable ? 'Profit' : 'Loss'}: ${Math.abs(day.profit).toFixed(2)}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </div>

                      {/* Revenue Bar */}
                      <div className="w-full relative flex items-end" style={{ height: `${revenueHeight}%` }}>
                        <div
                          className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all duration-300 hover:from-blue-600 hover:to-blue-500 cursor-pointer relative group/bar h-full min-h-[2px]"
                        >
                          {/* Tooltip for Revenue */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap z-10 pointer-events-none">
                            Revenue: ${day.revenue.toFixed(2)}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Y-axis Scale */}
            <div className="absolute left-0 top-10 bottom-8 flex flex-col justify-between text-xs text-gray-600">
              <span>${maxValue.toFixed(0)}</span>
              <span>${(maxValue * 0.75).toFixed(0)}</span>
              <span>${(maxValue * 0.5).toFixed(0)}</span>
              <span>${(maxValue * 0.25).toFixed(0)}</span>
              <span>$0</span>
            </div>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            No profit/loss data available for the selected period
          </div>
        )}
      </div>
    </div>
  );
}
