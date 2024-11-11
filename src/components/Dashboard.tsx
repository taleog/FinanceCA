import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, X } from 'lucide-react';
import SpendingChart from './SpendingChart';
import BudgetOverview from './BudgetOverview';
import { useTransactions } from '../context/TransactionContext';

interface DashboardProps {
  showAddTransaction: boolean;
  setShowAddTransaction: (show: boolean) => void;
}

export default function Dashboard({ showAddTransaction, setShowAddTransaction }: DashboardProps) {
  const { addTransaction, state } = useTransactions();
  const [newTransaction, setNewTransaction] = useState({
    type: 'expense' as const,
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTransaction({
      ...newTransaction,
      amount: newTransaction.type === 'expense' 
        ? -Math.abs(parseFloat(newTransaction.amount))
        : Math.abs(parseFloat(newTransaction.amount))
    });
    setShowAddTransaction(false);
    setNewTransaction({
      type: 'expense',
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const totalBalance = state.transactions.reduce((sum, t) => sum + t.amount, 0);
  const monthlyIncome = state.transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpenses = Math.abs(state.transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0));

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome back, Alex</h1>
          <p className="text-slate-600">Here's your financial overview</p>
        </div>
        <button 
          onClick={() => setShowAddTransaction(true)}
          className="btn btn-primary"
        >
          Add Transaction
        </button>
      </header>

      {showAddTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-800">Add Transaction</h2>
              <button 
                onClick={() => setShowAddTransaction(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select
                  value={newTransaction.type}
                  onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value as 'expense' | 'income'})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                <input
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  required
                >
                  <option value="">Select category</option>
                  <option value="Housing">Housing</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Food">Food</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Income">Income</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="Enter description"
                  required
                />
              </div>
              <button type="submit" className="w-full btn btn-primary">
                Add Transaction
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Balance</p>
                <p className="text-xl font-bold text-slate-800">
                  ${totalBalance.toLocaleString('en-CA', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Monthly Income</p>
                <p className="text-xl font-bold text-slate-800">
                  ${monthlyIncome.toLocaleString('en-CA', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Monthly Expenses</p>
                <p className="text-xl font-bold text-slate-800">
                  ${monthlyExpenses.toLocaleString('en-CA', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
            <TrendingDown className="w-5 h-5 text-red-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingChart transactions={state.transactions} />
        <BudgetOverview transactions={state.transactions} />
      </div>
    </div>
  );
}