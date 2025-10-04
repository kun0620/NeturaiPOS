import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import StatCard from '../components/UI/StatCard';
import { StatCard as StatCardType } from '../types';

export default function Dashboard() {
  const [stats, setStats] = useState<StatCardType[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch transactions
      const { data: transactionsData } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch products for low stock count
      const { data: productsData } = await supabase
        .from('products')
        .select('*');

      const totalRevenue = transactionsData?.reduce((sum, t) => sum + parseFloat(t.total_amount), 0) || 0;
      const totalOrders = transactionsData?.length || 0;
      const lowStockItems = productsData?.filter(p => p.stock < 20).length || 0;
      const totalProducts = productsData?.reduce((sum, p) => sum + p.stock, 0) || 0;

      setStats([
        { label: 'Total Revenue', value: `฿${totalRevenue.toFixed(2)}`, change: '+12.5%', trend: 'up' },
        { label: 'Total Orders', value: totalOrders.toString(), change: '+8.2%', trend: 'up' },
        { label: 'Products Sold', value: totalProducts.toString(), change: '+15.3%', trend: 'up' },
        { label: 'Low Stock Items', value: lowStockItems.toString(), change: '-5', trend: 'down' },
      ]);

      setTransactions(transactionsData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Sales Overview</h3>
          <div className="h-80 flex items-center justify-center">
            <p className="text-slate-500">Sales chart will be implemented with real data</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Sales by Category</h3>
          <div className="h-64 flex items-center justify-center">
            <p className="text-slate-500">Category breakdown will be implemented with real data</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Transaction ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Date & Time</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Payment</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Total</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{transaction.transaction_number}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(transaction.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 capitalize">{transaction.payment_method}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">฿{parseFloat(transaction.total_amount).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        transaction.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : transaction.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
