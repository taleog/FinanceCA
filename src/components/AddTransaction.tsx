// src/components/AddTransaction.tsx

import React, { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { Transaction } from '../types';

export default function AddTransaction({ onClose }: { onClose: () => void }) {
  const { addTransaction } = useTransactions();
  const [newTransaction, setNewTransaction] = useState<Omit<Transaction, 'id' | 'userId'>>({
    type: 'expense',
    amount: 0,
    category: '',
    description: '',
    date: new Date(),
    paymentMethod: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addTransaction(newTransaction);
    setNewTransaction({
      type: 'expense',
      amount: 0,
      category: '',
      description: '',
      date: new Date(),
      paymentMethod: '',
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
        <select
          value={newTransaction.type}
          onChange={(e) =>
            setNewTransaction({ ...newTransaction, type: e.target.value as 'expense' | 'income' })
          }
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
          value={newTransaction.date.toISOString().split('T')[0]}
          onChange={(e) =>
            setNewTransaction({ ...newTransaction, date: new Date(e.target.value) })
          }
          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
        <input
          type="number"
          value={newTransaction.amount}
          onChange={(e) =>
            setNewTransaction({ ...newTransaction, amount: parseFloat(e.target.value) || 0 })
          }
          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
          placeholder="0.00"
          step="0.01"
          min="0"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
        <input
          type="text"
          value={newTransaction.category}
          onChange={(e) =>
            setNewTransaction({ ...newTransaction, category: e.target.value })
          }
          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <input
          type="text"
          value={newTransaction.description}
          onChange={(e) =>
            setNewTransaction({ ...newTransaction, description: e.target.value })
          }
          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Add Transaction
      </button>
    </form>
  );
}