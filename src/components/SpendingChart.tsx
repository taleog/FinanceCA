import React, { useState, useMemo } from 'react';
import { Transaction } from '../types';

interface SpendingChartProps {
  transactions: Transaction[];
}

export default function SpendingChart({ transactions }: SpendingChartProps) {
  const [timeRange, setTimeRange] = useState('7');
  
  const dailyTotals = useMemo(() => {
    const days = parseInt(timeRange);
    const today = new Date();
    const dailyData = new Array(7).fill(0);
    
    transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        const diffTime = Math.abs(today.getTime() - transactionDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= days && t.type === 'expense';
      })
      .forEach(t => {
        const transactionDate = new Date(t.date);
        const diffTime = Math.abs(today.getTime() - transactionDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 7) {
          dailyData[6 - diffDays] += Math.abs(t.amount);
        }
      });

    const maxAmount = Math.max(...dailyData);
    return dailyData.map(amount => maxAmount ? (amount / maxAmount) * 100 : 0);
  }, [transactions, timeRange]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-slate-800">Spending Overview</h2>
        <select 
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>
      <div className="h-64 flex items-end justify-between gap-2">
        {dailyTotals.map((height, index) => (
          <div key={index} className="w-full">
            <div
              className="bg-indigo-600 rounded-t-lg transition-all duration-300 hover:bg-indigo-700 cursor-pointer"
              style={{ height: `${height}%` }}
            ></div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-4 text-sm text-slate-600">
        {Array.from({ length: 7 }).map((_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          return (
            <span key={i}>
              {date.toLocaleDateString('en-CA', { weekday: 'short' })}
            </span>
          );
        })}
      </div>
    </div>
  );
}