import React, { useState, useMemo } from 'react';
import { Transaction } from '../types';

interface BudgetOverviewProps {
  transactions: Transaction[];
}

interface CategoryBudget {
  name: string;
  budget: number;
  color: string;
}

const categoryBudgets: CategoryBudget[] = [
  { name: 'Housing', budget: 2000, color: 'bg-blue-500' },
  { name: 'Transportation', budget: 400, color: 'bg-green-500' },
  { name: 'Food', budget: 600, color: 'bg-yellow-500' },
  { name: 'Utilities', budget: 300, color: 'bg-purple-500' },
  { name: 'Entertainment', budget: 200, color: 'bg-pink-500' },
];

export default function BudgetOverview({ transactions }: BudgetOverviewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categorySpending = useMemo(() => {
    const spending = new Map<string, number>();
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const current = spending.get(t.category) || 0;
        spending.set(t.category, current + Math.abs(t.amount));
      });
    
    return categoryBudgets.map(cat => ({
      ...cat,
      spent: spending.get(cat.name) || 0,
      percentage: Math.min(((spending.get(cat.name) || 0) / cat.budget) * 100, 100)
    }));
  }, [transactions]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-slate-800">Budget Overview</h2>
        <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
          View All
        </button>
      </div>
      <div className="space-y-4">
        {categorySpending.map((category) => (
          <div 
            key={category.name}
            onClick={() => setSelectedCategory(category.name)}
            className="cursor-pointer transition-all duration-200 hover:bg-slate-50 p-2 rounded-lg"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-700">{category.name}</span>
              <span className="text-sm text-slate-600">
                ${category.spent.toLocaleString('en-CA', { minimumFractionDigits: 2 })} / 
                ${category.budget.toLocaleString('en-CA', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${category.color} transition-all duration-300`}
                style={{ 
                  width: `${category.percentage}%`,
                  opacity: selectedCategory === category.name ? '1' : '0.8'
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}