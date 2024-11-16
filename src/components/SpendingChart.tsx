import React, { useState, useMemo } from 'react';
import { Transaction } from '../types';

interface SpendingChartProps {
  transactions: Transaction[];
}

function SpendingChart({ transactions }: SpendingChartProps) {
  const [timeRange, setTimeRange] = useState('7');
  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    return date.toISOString().split('T')[0];
  });

  const spendingData = useMemo(() => {
    const days = parseInt(timeRange);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Ensure the end date includes the entire day
    const start = new Date(end);
    start.setDate(end.getDate() - days + 2);
    start.setHours(0, 0, 0, 0); // Ensure the start date includes the entire day
    const dailyTotals = Array(days).fill(0);
    const labels = Array(days).fill('').map((_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return date;
    });

    transactions.forEach(t => {
      const tDate = new Date(t.date);
      const diffDays = Math.floor((tDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      const index = diffDays;
      if (index >= 0 && index < days) {
        dailyTotals[index] += Math.abs(t.amount);
      }
    });

    const maxAmount = Math.max(...dailyTotals, 0.001);
    const percentages = dailyTotals.map(amount => (amount / maxAmount) * 100);

    return {
      dailyTotals,
      labels,
      percentages,
      maxAmount,
    };
  }, [transactions, timeRange, endDate]);

  return (
    <div className="bg-white dark:bg-chatbg-dark p-6 rounded-xl shadow-sm border border-slate-200 dark:border-black">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-chattext">Spending Overview</h2>
          <p className="text-sm text-slate-600 dark:text-chattext-muted">
            Max daily spend: ${spendingData.maxAmount.toLocaleString('en-CA', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="flex gap-2">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-chatbg-dark border border-slate-200 dark:border-chatbg rounded-lg text-sm dark:text-chattext-muted"
          >
            <option value="7">7 days</option>
            <option value="14">14 days</option>
            <option value="30">30 days</option>
          </select>
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
            className="px-3 py-1.5 bg-slate-50 dark:bg-chatbg-dark border border-slate-200 dark:border-chatbg rounded-lg text-sm dark:text-chattext-muted"
          />
        </div>
      </div>
      
      <div className="h-64 flex items-end justify-between gap-1">
        {spendingData.dailyTotals.map((total, index) => (
          <div 
            key={index} 
            className="relative group w-full"
          >
            <div
              className="bg-chataccent dark:bg-chataccent rounded-t w-full transition-all duration-300 hover:bg-chataccent-hover dark:hover:bg-chataccent-hover"
              style={{ 
                height: spendingData.dailyTotals[index]/spendingData.maxAmount * 275,
                minHeight: '2px',
                maxHeight: '275px'
              }}
            />
            <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-chatbg-dark dark:bg-chatbg text-chattext text-xs rounded px-2 py-1 whitespace-nowrap z-10">
              ${total.toLocaleString('en-CA', { minimumFractionDigits: 2 })}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-4 text-xs text-slate-600 dark:text-chattext-muted">
        {spendingData.labels.map((date, i) => (
          <span key={i} className="text-center">
            {date.toLocaleDateString('en-CA', {
              weekday: parseInt(timeRange) <= 7 ? 'short' : undefined,
              month: parseInt(timeRange) > 7 ? 'short' : undefined,
              day: 'numeric'
            })}
          </span>
        ))}
      </div>
    </div>
  );
}

export default SpendingChart;