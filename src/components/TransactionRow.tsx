import React from 'react';
import { Transaction } from '../types';

interface TransactionRowProps {
  transaction: Transaction;
}

export default function TransactionRow({ transaction }: TransactionRowProps) {
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
    <div className="grid grid-cols-5 gap-4 p-4 hover:bg-slate-50 transition-colors">
      <div className="text-sm text-slate-600">{formattedDate}</div>
      <div className="col-span-2">
        <p className="text-sm font-medium text-slate-700">{transaction.description}</p>
      </div>
      <div className="text-sm text-slate-600">{transaction.category}</div>
      <div className={`text-sm font-medium text-right ${
        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
      }`}>
        {transaction.type === 'income' ? '+' : '-'}{amount}
      </div>
    </div>
  );
}