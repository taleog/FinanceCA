import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';

interface AddTransactionProps {
  onClose: () => void;
}

export default function AddTransaction({ onClose }: AddTransactionProps) {
  const { addTransaction } = useTransactions();
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const [year, month, day] = date.split('-').map(Number);
      const transactionDate = new Date(year, month - 1, day, 12, 0, 0); // Set time to noon to avoid timezone issues
      await addTransaction({
        type,
        amount: parseFloat(amount),
        category,
        description,
        date: transactionDate,
        paymentMethod,
      });
      onClose();
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-chatbg-dark rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-chattext">Add Transaction</h2>
          <button onClick={onClose} className="text-slate-500 dark:text-chattext-muted hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-chattext-muted mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'expense' | 'income')}
              className="w-full px-3 py-2 bg-white dark:bg-chatbg border border-slate-300 dark:border-chatbg rounded-lg"
              required
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-chattext-muted mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-chatbg border border-slate-300 dark:border-chatbg rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-chattext-muted mb-1">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-chatbg border border-slate-300 dark:border-chatbg rounded-lg"
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-chattext-muted mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-chatbg border border-slate-300 dark:border-chatbg rounded-lg"
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
            <label className="block text-sm font-medium text-slate-700 dark:text-chattext-muted mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-chatbg border border-slate-300 dark:border-chatbg rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-chattext-muted mb-1">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-chatbg border border-slate-300 dark:border-chatbg rounded-lg"
              required
            >
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="flex-1 btn btn-primary">
              Add Transaction
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-chatbg dark:text-chattext dark:hover:bg-chatbg-dark"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}