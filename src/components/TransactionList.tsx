import React, { useState } from 'react';
import { Search, ArrowUpDown } from 'lucide-react';
import TransactionRow from './TransactionRow';
import { SortField, SortOrder } from '../types';
import { useTransactions } from '../context/TransactionContext';

export default function TransactionList() {
  const { state } = useTransactions();
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
          className="px-4 py-2 border border-slate-200 rounded-lg bg-white"
        >
          <option value="all">All Transactions</option>
          <option value="income">Income Only</option>
          <option value="expense">Expenses Only</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="grid grid-cols-5 gap-4 p-4 border-b border-slate-200 bg-slate-50">
          <button
            onClick={() => handleSort('date')}
            className="flex items-center gap-2 text-sm font-medium text-slate-600"
          >
            Date
            <ArrowUpDown className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleSort('description')}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 col-span-2"
          >
            Description
            <ArrowUpDown className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleSort('category')}
            className="flex items-center gap-2 text-sm font-medium text-slate-600"
          >
            Category
            <ArrowUpDown className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleSort('amount')}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 justify-end"
          >
            Amount
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
        <div className="divide-y divide-slate-200">
          {filteredTransactions.map(transaction => (
            <TransactionRow key={transaction.id} transaction={transaction} />
          ))}
        </div>
      </div>
    </div>
  );
}