import React, { useState } from 'react';
import { Pencil, Trash2, X } from 'lucide-react';
import { Transaction } from '../types';
import { useTransactions } from '../context/TransactionContext';
import EditTransaction from './EditTransaction';

interface TransactionRowProps {
  transaction: Transaction;
}

export default function TransactionRow({ transaction }: TransactionRowProps) {
  const { deleteTransaction } = useTransactions();
  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formattedDate = new Date(transaction.date).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const amount = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD'
  }).format(Math.abs(transaction.amount));

  return (
    <>
      <div className="grid grid-cols-5 gap-4 p-4 hover:bg-slate-50 dark:hover:bg-chatbg transition-colors">
        <div className="text-sm text-slate-600 dark:text-chattext-muted">{formattedDate}</div>
        <div className="col-span-2">
          <p className="text-sm font-medium text-slate-700 dark:text-chattext">{transaction.description}</p>
        </div>
        <div className="text-sm text-slate-600 dark:text-chattext-muted">{transaction.category}</div>
        <div className="flex items-center justify-end gap-3">
          <span className={`text-sm font-medium ${
            transaction.type === 'income' 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {transaction.type === 'income' ? '+' : '-'}{amount}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setShowEdit(true)}
              className="p-1 text-slate-400 hover:text-chataccent dark:text-chattext-muted dark:hover:text-chataccent transition-colors"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-1 text-slate-400 hover:text-red-600 dark:text-chattext-muted dark:hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-chatbg-dark rounded-xl p-6 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-800 dark:text-chattext">Confirm Delete</h2>
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="text-slate-500 dark:text-chattext-muted hover:text-slate-700 dark:hover:text-chattext"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-slate-600 dark:text-chattext-muted mb-6">
              Are you sure you want to delete this transaction? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  deleteTransaction(transaction.id);
                  setShowDeleteConfirm(false);
                }}
                className="flex-1 btn bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
              >
                Delete
              </button>
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 btn bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-chatbg dark:text-chattext dark:hover:bg-chatbg-dark"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showEdit && <EditTransaction transaction={transaction} onClose={() => setShowEdit(false)} />}
    </>
  );
}