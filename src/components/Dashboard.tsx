import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import SpendingChart from './SpendingChart';
import BudgetOverview from './BudgetOverview';
import { useTransactions } from '../context/TransactionContext';
import { auth } from '../firebaseConfig';
import CryptoPrices from './CryptoPrices';
import ImportTransactions from './ImportTransactions';
import Account from '../types/Account';
import AddTransaction from './AddTransaction';
import { getUserByUID } from '../services/userService';

interface DashboardProps {
  showAddTransaction: boolean;
  setShowAddTransaction: (show: boolean) => void;
  accounts: Account[];
}

const timeRanges = {
  WEEK: 'Past Week',
  MONTH: 'Past Month',
  YEAR: 'Past Year',
  ALL: 'All Time',
};

export default function Dashboard({
  showAddTransaction,
  setShowAddTransaction,
  accounts,
}: DashboardProps) {
  const { state, refreshTransactions } = useTransactions();
  const [timeRange, setTimeRange] = useState(timeRanges.MONTH);
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      if (user.displayName) {
        setDisplayName(user.displayName);
      } else {
        getUserByUID(user.uid).then((userData) => {
          if (userData && userData.displayName) {
            console.log('User display name from database:', userData.displayName);
            setDisplayName(userData.displayName);
          } else {
            console.log('No display name found, setting to "User"');
            setDisplayName('User');
          }
        });
      }
      refreshTransactions();
    }
  }, [refreshTransactions]);

  const filterTransactions = (range: string) => {
    if (!state.transactions) return [];
    
    const now = new Date();
    let filtered = [...state.transactions];

    switch (range) {
      case timeRanges.WEEK:
        filtered = filtered.filter(t => {
          const transactionDate = new Date(t.date);
          return (now.getTime() - transactionDate.getTime()) <= 7 * 24 * 60 * 60 * 1000;
        });
        break;
      case timeRanges.MONTH:
        filtered = filtered.filter(t => {
          const transactionDate = new Date(t.date);
          return (now.getTime() - transactionDate.getTime()) <= 30 * 24 * 60 * 60 * 1000;
        });
        break;
      case timeRanges.YEAR:
        filtered = filtered.filter(t => {
          const transactionDate = new Date(t.date);
          return (now.getTime() - transactionDate.getTime()) <= 365 * 24 * 60 * 60 * 1000;
        });
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredTransactions = filterTransactions(timeRange);

  const calculateTotal = (type: 'income' | 'expense') => {
    return filteredTransactions
      .filter(t => t.type === type)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  };

  const income = calculateTotal('income');
  const expenses = calculateTotal('expense');
  const balance = income - expenses;

  if (state.loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  if (state.error) {
    return <div className="text-red-500">{state.error}</div>;
  }

  return (
    <div className="space-y-6">
      {showAddTransaction && (
        <AddTransaction onClose={() => setShowAddTransaction(false)} />
      )}
      
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            Welcome back, {displayName}!
          </h1>
          <p className="text-slate-600 dark:text-chattext-muted">
            Here's your financial overview
          </p>
        </div>
        <button 
          onClick={() => setShowAddTransaction(true)}
          className="btn btn-primary"
        >
          Add Transaction
        </button>
      </header>

      <ImportTransactions />

      <div className="mb-4">
        <div className="flex gap-2">
          {Object.values(timeRanges).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-md ${
                timeRange === range
                  ? 'bg-chataccent text-white'
                  : 'bg-gray-200 dark:bg-chatbg-dark text-gray-800 dark:text-chattext'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-chatbg-dark p-6 rounded-xl shadow-sm border border-slate-200 dark:border-black">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-chattext-muted">Balance</p>
                <p className="text-xl font-bold text-slate-800 dark:text-chattext">
                  ${balance.toLocaleString('en-CA', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
            {balance >= 0 ? (
              <TrendingUp className="w-5 h-5 text-green-500 dark:text-green-400" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-500 dark:text-red-400" />
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-chatbg-dark p-6 rounded-xl shadow-sm border border-slate-200 dark:border-black">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-chattext-muted">Income</p>
                <p className="text-xl font-bold text-slate-800 dark:text-chattext">
                  ${income.toLocaleString('en-CA', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
            <TrendingUp className="w-5 h-5 text-green-500 dark:text-green-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-chatbg-dark p-6 rounded-xl shadow-sm border border-slate-200 dark:border-black">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-chattext-muted">Expenses</p>
                <p className="text-xl font-bold text-slate-800 dark:text-chattext">
                  ${expenses.toLocaleString('en-CA', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
            <TrendingDown className="w-5 h-5 text-red-500 dark:text-red-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingChart transactions={filteredTransactions} />
        <BudgetOverview transactions={filteredTransactions} />
        <CryptoPrices />
      </div>
    </div>
  );
}