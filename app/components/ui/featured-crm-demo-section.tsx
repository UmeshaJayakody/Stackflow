'use client';

import { TrendingUp, TrendingDown, Package, DollarSign, Archive, AlertTriangle } from 'lucide-react';

interface DashboardStats {
  totalProducts: number;
  totalInventoryValue: string;
  totalStockQuantity: number;
  lowStockCount: number;
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  trendDirection?: 'up' | 'down';
  color: 'blue' | 'green' | 'purple' | 'red';
}

function StatCard({ title, value, icon, trend, trendDirection, color }: StatCardProps) {
  const colorClasses = {
    blue: 'from-blue-50/50 shadow-blue-200/50 text-blue-600',
    green: 'from-green-50/50 shadow-green-200/50 text-green-600',
    purple: 'from-purple-50/50 shadow-purple-200/50 text-purple-600',
    red: 'from-red-50/50 shadow-red-200/50 text-red-600',
  };

  return (
    <div className={`group relative bg-white/40 backdrop-blur-md border border-gray-200/50 rounded-2xl p-6 hover:bg-white/60 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50`}>
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${colorClasses[color].split(' ')[0]} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          {trend && trendDirection && (
            <div className={`flex items-center gap-1 text-sm font-semibold ${
              trendDirection === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trendDirection === 'up' ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {trend}
            </div>
          )}
        </div>
        
        <div className="flex items-end justify-between">
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <div className={`${colorClasses[color].split(' ').slice(1).join(' ')} p-3 rounded-full bg-gradient-to-br ${color === 'blue' ? 'from-blue-100 to-blue-50' : color === 'green' ? 'from-green-100 to-green-50' : color === 'purple' ? 'from-purple-100 to-purple-50' : 'from-red-100 to-red-50'} shadow-lg`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedCrmDemoSection({ stats }: { stats: DashboardStats }) {
  const statCards: StatCardProps[] = [
    {
      title: 'Total Products',
      value: stats.totalProducts.toString(),
      icon: <Package className="w-6 h-6" />,
      color: 'blue'
    },
    {
      title: 'Inventory Value',
      value: `$${stats.totalInventoryValue}`,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'green'
    },
    {
      title: 'Total Stock',
      value: stats.totalStockQuantity.toString(),
      icon: <Archive className="w-6 h-6" />,
      color: 'purple'
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockCount.toString(),
      icon: <AlertTriangle className="w-6 h-6" />,
      color: 'red'
    }
  ];

  return (
    <div className="w-full">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Chart Section */}
      <div className="relative bg-white/40 backdrop-blur-md border border-gray-200/50 rounded-2xl p-8 hover:bg-white/60 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/50 to-transparent opacity-50"></div>
        
        <div className="relative">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Total leads</h3>
              <p className="text-sm text-gray-600">
                Total for the last <span className="underline decoration-dotted">3 months</span>
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white/60 hover:bg-white/80 rounded-lg border border-gray-200/50 transition-all">
                Last 3 months
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-white/60 rounded-lg transition-all">
                Last year
              </button>
            </div>
          </div>

          {/* Chart Placeholder */}
          <div className="relative h-64 bg-gradient-to-b from-gray-100/50 to-transparent rounded-xl overflow-hidden">
            <div className="absolute inset-0 flex items-end justify-around p-4">
              {/* Simulated chart bars/area */}
              <div className="flex-1 space-y-1">
                <div className="w-full space-y-px">
                  {[60, 45, 70, 55, 80, 50, 65, 75, 40, 85, 60, 70].map((height, i) => (
                    <div
                      key={i}
                      className="relative"
                      style={{ height: `${height}%` }}
                    >
                      <div className="absolute bottom-0 w-full bg-gradient-to-t from-gray-400/40 to-gray-300/20 rounded-t-sm"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* X-axis labels */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-between px-4 text-xs text-gray-500">
              <span>Apr 6</span>
              <span>Apr 12</span>
              <span>Apr 18</span>
              <span>Apr 24</span>
              <span>Apr 30</span>
              <span>May 6</span>
              <span>May 12</span>
              <span>May 18</span>
              <span>May 24</span>
              <span>May 30</span>
              <span>Jun 5</span>
              <span>Jun 11</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
