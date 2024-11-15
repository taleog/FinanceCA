import React, { useState } from 'react';
import { Search, ArrowUpDown } from 'lucide-react';
import TransactionRow from './TransactionRow';
import { SortField, SortOrder } from '../types';
import { useTransactions } from '../context/TransactionContext';

interface TransactionListProps {
  showAddTransaction: boolean;
  setShowAddTransaction: (show: boolean) => void;
}

export default function TransactionList({ showAddTransaction, setShowAddTransaction }: TransactionListProps) {
  const { state } = useTransactions();
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense' | 'transfer'>('all');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const filteredTransactions = state.transactions
    .filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(search.toLowerCase()) ||
                            transaction.category.toLowerCase().includes(search.toLowerCase());
      const matchesType = filterType === 'all' || transaction.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      const order = sortOrder === 'asc' ? 1 : -1;
      if (sortField === 'date') {
        return (new Date(a.date).getTime() - new Date(b.date).getTime()) * order;
      }
      if (sortField === 'amount') {
        return (Math.abs(a.amount) - Math.abs(b.amount)) * order;
      }
      return a[sortField].localeCompare(b[sortField]) * order;
    });

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-chattext">Transactions</h1>
          <p className="text-slate-600 dark:text-chattext-muted">View and manage your transactions</p>
        </div>
        <button 
          onClick={() => setShowAddTransaction(true)}
          className="btn btn-primary"
        >
          Add Transaction
        </button>
      </header>
      
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-chatbg dark:bg-chatbg-dark dark:text-chattext rounded-lg focus:outline-none focus:ring-2 focus:ring-chataccent dark:focus:ring-chataccent"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
            className="px-4 py-2 border border-slate-200 dark:border-chatbg rounded-lg bg-white dark:bg-chatbg-dark dark:text-chattext"
          >
            <option value="all">All Transactions</option>
            <option value="income">Income Only</option>
            <option value="expense">Expenses Only</option>
          </select>
        </div>

        <div className="bg-white dark:bg-chatbg-dark rounded-xl shadow-sm border border-slate-200 dark:border-black overflow-hidden">
          <div className="grid grid-cols-5 gap-4 p-4 border-b border-slate-200 dark:border-chatbg bg-slate-50 dark:bg-chatbg">
            <button
              onClick={() => handleSort('date')}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-chattext-muted"
            >
              Date
              <ArrowUpDown className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleSort('description')}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-chattext-muted col-span-2"
            >
              Description
              <ArrowUpDown className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleSort('category')}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-chattext-muted"
            >
              Category
              <ArrowUpDown className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleSort('amount')}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-chattext-muted justify-end"
            >
              Amount
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {filteredTransactions.map(transaction => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}