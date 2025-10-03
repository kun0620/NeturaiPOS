import { TrendingUp, TrendingDown } from 'lucide-react';
import { StatCard as StatCardType } from '../../types';

interface StatCardProps {
  stat: StatCardType;
}

export default function StatCard({ stat }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{stat.label}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
        </div>
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium ${
            stat.trend === 'up'
              ? 'bg-green-100 text-green-700'
              : stat.trend === 'down'
              ? 'bg-red-100 text-red-700'
              : 'bg-slate-100 text-slate-700'
          }`}
        >
          {stat.trend === 'up' ? (
            <TrendingUp className="w-4 h-4" />
          ) : stat.trend === 'down' ? (
            <TrendingDown className="w-4 h-4" />
          ) : null}
          <span>{stat.change}</span>
        </div>
      </div>
    </div>
  );
}
