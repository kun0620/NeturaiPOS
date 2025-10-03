import { Download, TrendingUp, DollarSign, ShoppingBag, Users as UsersIcon } from 'lucide-react';
import { chartData, mockTransactions } from '../data/mockData';
import Button from '../components/UI/Button';

export default function Reports() {
  const totalRevenue = mockTransactions.reduce((sum, t) => sum + t.total, 0);
  const avgOrderValue = totalRevenue / mockTransactions.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Analytics & Reports</h3>
          <p className="text-sm text-slate-600 mt-1">Comprehensive business insights and metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>This Year</option>
          </select>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 opacity-80" />
            <span className="text-sm font-medium opacity-90">Revenue</span>
          </div>
          <p className="text-3xl font-bold">${totalRevenue.toFixed(2)}</p>
          <div className="flex items-center gap-1 mt-2 text-sm opacity-90">
            <TrendingUp className="w-4 h-4" />
            <span>+12.5% from last period</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <ShoppingBag className="w-8 h-8 opacity-80" />
            <span className="text-sm font-medium opacity-90">Orders</span>
          </div>
          <p className="text-3xl font-bold">{mockTransactions.length}</p>
          <div className="flex items-center gap-1 mt-2 text-sm opacity-90">
            <TrendingUp className="w-4 h-4" />
            <span>+8.2% from last period</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 opacity-80" />
            <span className="text-sm font-medium opacity-90">Avg Order</span>
          </div>
          <p className="text-3xl font-bold">${avgOrderValue.toFixed(2)}</p>
          <div className="flex items-center gap-1 mt-2 text-sm opacity-90">
            <TrendingUp className="w-4 h-4" />
            <span>+5.1% from last period</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <UsersIcon className="w-8 h-8 opacity-80" />
            <span className="text-sm font-medium opacity-90">Customers</span>
          </div>
          <p className="text-3xl font-bold">1,234</p>
          <div className="flex items-center gap-1 mt-2 text-sm opacity-90">
            <TrendingUp className="w-4 h-4" />
            <span>+15.3% from last period</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Sales Trend</h3>
            <select className="px-3 py-1 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
          <div className="h-80 flex items-end justify-between gap-3">
            {chartData.sales.map((value, index) => {
              const maxValue = Math.max(...chartData.sales);
              const height = (value / maxValue) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg relative group cursor-pointer hover:from-blue-600 hover:to-blue-500 transition-all"
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      ${value.toLocaleString()}
                    </div>
                  </div>
                  <span className="text-xs font-medium text-slate-600">{chartData.labels[index]}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Order Volume</h3>
            <select className="px-3 py-1 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
          <div className="h-80 flex items-end justify-between gap-3">
            {chartData.orders.map((value, index) => {
              const maxValue = Math.max(...chartData.orders);
              const height = (value / maxValue) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg relative group cursor-pointer hover:from-green-600 hover:to-green-500 transition-all"
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {value} orders
                    </div>
                  </div>
                  <span className="text-xs font-medium text-slate-600">{chartData.labels[index]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Top Products</h3>
          <div className="space-y-4">
            {[
              { name: 'Wireless Headphones', sales: 156, revenue: 12468.44 },
              { name: 'Smart Watch', sales: 89, revenue: 17799.11 },
              { name: 'Coffee Maker', sales: 67, revenue: 6029.33 },
              { name: 'Yoga Mat', sales: 134, revenue: 4018.66 },
              { name: 'Desk Lamp', sales: 78, revenue: 3119.22 },
            ].map((product, index) => (
              <div key={index} className="flex items-center justify-between pb-4 border-b border-slate-100 last:border-0">
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{product.name}</p>
                  <p className="text-sm text-slate-600">{product.sales} units sold</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">${product.revenue.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Performance Metrics</h3>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Conversion Rate</span>
                <span className="text-sm font-bold text-slate-900">3.2%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '32%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Customer Retention</span>
                <span className="text-sm font-bold text-slate-900">68%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Cart Abandonment</span>
                <span className="text-sm font-bold text-slate-900">45%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-orange-600 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Customer Satisfaction</span>
                <span className="text-sm font-bold text-slate-900">92%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
