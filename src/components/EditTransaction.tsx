import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Transaction } from '../types';
import { useTransactions } from '../context/TransactionContext';

interface EditTransactionProps {
  transaction: Transaction;
  onClose: () => void;
}

export default function EditTransaction({ transaction, onClose }: EditTransactionProps) {
  const { editTransaction } = useTransactions();
  const [editedTransaction, setEditedTransaction] = useState(transaction);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editTransaction(editedTransaction);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800">Edit Transaction</h2>
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
            <select
              value={editedTransaction.type}
              onChange={(e) => setEditedTransaction({
                ...editedTransaction,
                type: e.target.value as 'expense' | 'income'
              })}
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
              value={editedTransaction.date}
              onChange={(e) => setEditedTransaction({
                ...editedTransaction,
                date: e.target.value
              })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
            <input
              type="number"
              value={Math.abs(editedTransaction.amount)}
              onChange={(e) => setEditedTransaction({
                ...editedTransaction,
                amount: editedTransaction.type === 'expense' 
                  ? -Math.abs(parseFloat(e.target.value))
                  : Math.abs(parseFloat(e.target.value))
              })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              step="0.01"
              min="0"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select
              value={editedTransaction.category}
              onChange={(e) => setEditedTransaction({
                ...editedTransaction,
                category: e.target.value
              })}
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
              value={editedTransaction.description}
              onChange={(e) => setEditedTransaction({
                ...editedTransaction,
                description: e.target.value
              })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              required
            />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="flex-1 btn btn-primary">
              Save Changes
            </button>
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 btn bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}