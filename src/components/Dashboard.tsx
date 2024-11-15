import React, { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { auth } from '../firebaseConfig';
import { TrendingUp, TrendingDown, DollarSign, X } from 'lucide-react';
import SpendingChart from './SpendingChart';
import BudgetOverview from './BudgetOverview';
import CryptoPrices from './CryptoPrices';
import { useTransactions } from '../context/TransactionContext';
import ImportTransactions from './ImportTransactions';
import { Transaction } from '../types';

const timeRanges = {
  WEEK: 'Past Week',
  MONTH: 'Past Month',
  YEAR: 'Past Year',
  ALL: 'All Time',
};

interface AccountType {
  id: string;
  name: string;
}

interface DashboardProps {
  showAddTransaction: boolean;
  setShowAddTransaction: Dispatch<SetStateAction<boolean>>;
  accounts: AccountType[];
}

export default function Dashboard({
  showAddTransaction,
  setShowAddTransaction,
  accounts,
}: DashboardProps) {
  const { addTransaction, state } = useTransactions();
  const [displayName, setDisplayName] = useState('');
  const [newTransaction, setNewTransaction] = useState<Omit<Transaction, 'id' | 'userId'>>({
    type: 'expense',
    amount: 0,
    category: '',
    description: '',
    date: new Date(),
    paymentMethod: '',
  });
  const [timeRange, setTimeRange] = useState(timeRanges.MONTH);

  useEffect(() => {
    // Get the current user's display name from Firebase
    const user = auth.currentUser;
    if (user && user.displayName) {
      setDisplayName(user.displayName);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      console.error('User not logged in');
      return;
    }

    const transaction: Transaction = {
      ...newTransaction,
      userId: user.uid,
    };

    try {
      await addTransaction(transaction);
      setNewTransaction({
        type: 'expense',
        amount: 0,
        category: '',
        description: '',
        date: new Date(),
        paymentMethod: '',
      });
      setShowAddTransaction(false);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const filterTransactions = (transactions: Transaction[], range: string) => {
    const now = new Date();
    let filteredTransactions = transactions;

    switch (range) {
      case timeRanges.WEEK:
        filteredTransactions = transactions.filter(transaction => {
          const transactionDate = new Date(transaction.date);
          return (now.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24) <= 7;
        });
        break;
      case timeRanges.MONTH:
        filteredTransactions = transactions.filter(transaction => {
          const transactionDate = new Date(transaction.date);
          return (now.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24) <= 30;
        });
        break;
      case timeRanges.YEAR:
        filteredTransactions = transactions.filter(transaction => {
          const transactionDate = new Date(transaction.date);
          return (now.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24) <= 365;
        });
        break;
      case timeRanges.ALL:
      default:
        break;
    }

    return filteredTransactions;
  };

  const filteredTransactions = filterTransactions(state.transactions, timeRange);

  const calculateIncome = (transactions: Transaction[]) => {
    return transactions
      .filter(transaction => transaction.type === 'income')
      .reduce((acc, transaction) => acc + transaction.amount, 0);
  };
  
  const calculateExpenses = (transactions: Transaction[]) => {
    return transactions
      .filter(transaction => transaction.type === 'expense')
      .reduce((acc, transaction) => acc + transaction.amount, 0);
  };

  const income = calculateIncome(filteredTransactions);
  const expenses = calculateExpenses(filteredTransactions);

  const totalBalance = state.transactions.reduce((sum, t) => sum + t.amount, 0);
  const monthlyIncome = state.transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpenses = Math.abs(state.transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0));

  // Ensure your component handles the case when transactions are not yet loaded
  if (!state.transactions) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Welcome back, {displayName || 'User'}!</h1>
          <p className="text-slate-600 dark:text-chattext-muted">Here's your financial overview</p>
        </div>
        <button 
          onClick={() => setShowAddTransaction(true)}
          className="btn btn-primary"
        >
          Add Transaction
        </button>
      </header>

      <ImportTransactions />

      {showAddTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-chatbg rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Add Transaction</h2>
              <button 
                onClick={() => setShowAddTransaction(false)}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
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
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-lg"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                <input
                  type="date"
                  value={newTransaction.date.toISOString().split('T')[0]}
                  onChange={(e) => setNewTransaction({...newTransaction, date: new Date(e.target.value)})}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount</label>
                <input
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({...newTransaction, amount: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-lg"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-lg"
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
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <input
                  type="text"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-lg"
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
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-chattext-muted">Total Balance</p>
                <p className="text-xl font-bold text-slate-800 dark:text-chattext">
                  ${totalBalance.toLocaleString('en-CA', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
            {totalBalance > 0 && (
              <TrendingUp className="w-5 h-5 text-green-500 dark:text-green-400" />
            )}
            {totalBalance < 0 && (
              <TrendingDown className="w-5 h-5 text-red-500 dark:text-red-400" />
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-chatbg-dark p-6 rounded-xl shadow-sm border border-slate-200 dark:border-black">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-chattext-muted">Monthly Income</p>
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
                <p className="text-sm text-slate-600 dark:text-chattext-muted">Monthly Expenses</p>
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