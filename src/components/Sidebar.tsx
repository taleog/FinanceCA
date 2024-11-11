import React from 'react';
import { Wallet, PieChart, TrendingUp, DollarSign, CreditCard, Settings } from 'lucide-react';

const menuItems = [
  { icon: DollarSign, label: 'Overview' },
  { icon: Wallet, label: 'Accounts' },
  { icon: PieChart, label: 'Budget' },
  { icon: TrendingUp, label: 'Investments' },
  { icon: CreditCard, label: 'Transactions' },
  { icon: Settings, label: 'Settings' },
];

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-slate-200">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Wallet className="w-8 h-8 text-indigo-600" />
          FinanceCA
        </h1>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => onViewChange(item.label)}
            className={`w-full flex items-center gap-3 px-6 py-3 transition-colors ${
              activeView === item.label
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}