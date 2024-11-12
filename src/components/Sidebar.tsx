import React from 'react';
import { Wallet, PieChart, TrendingUp, DollarSign, CreditCard, Settings, LogOut, Menu } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
}

const menuItems = [
  { icon: DollarSign, label: 'Overview', view: 'Overview' },
  { icon: Wallet, label: 'Accounts', view: 'Accounts' },
  { icon: PieChart, label: 'Investments', view: 'Investments' },
  { icon: CreditCard, label: 'Transactions', view: 'Transactions' },
  { icon: Settings, label: 'Settings', view: 'Settings' },
];

export default function Sidebar({ activeView, onViewChange, setIsLoggedIn, toggleSidebar }: SidebarProps) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <aside className="w-64 h-full bg-white dark:bg-chatbg-dark border-r border-slate-200 dark:border-chatbg flex flex-col">
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet className="h-8 w-8 text-chataccent" />
          <h1 className="text-2xl font-bold text-slate-800 dark:text-chattext">FinanceCA</h1>
        </div>
        <button onClick={toggleSidebar} className="text-slate-600 dark:text-chattext-muted">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <nav className="mt-6 flex-1">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => onViewChange(item.label)}
            className={`w-full flex items-center gap-3 px-6 py-3 transition-colors ${
              activeView === item.label
                ? 'bg-chataccent/10 dark:bg-chataccent/10 text-chataccent dark:text-chataccent'
                : 'text-slate-600 dark:text-chattext-muted hover:bg-slate-50 dark:hover:bg-chatbg hover:text-chataccent dark:hover:text-chataccent'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-200 dark:border-chatbg">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
