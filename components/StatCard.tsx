import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change: string;
  isPositive: boolean;
}

export const StatCard = ({ title, value, icon: Icon, change, isPositive }: StatCardProps) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
        <p className={`text-sm mt-1 ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
          {change ?? '—'}
        </p>
      </div>
      <div className="p-3 bg-emerald-50 rounded-full">
        <Icon className={`h-6 w-6 ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`} />
      </div>
    </div>
  </div>
); 