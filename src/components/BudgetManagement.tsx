import React, { useState } from 'react';

interface Budget {
  category: string;
  amount: number;
}

const BudgetManagement: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');

  const handleAddBudget = () => {
    if (category && amount) {
      setBudgets([...budgets, { category, amount: parseFloat(amount) }]);
      setCategory('');
      setAmount('');
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-chatbg-dark rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-chattext mb-4">Manage Budgets</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-lg"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-lg"
        />
        <button onClick={handleAddBudget} className="btn btn-primary w-full">
          Add Budget
        </button>
      </div>
      <ul>
        {budgets.map((budget, index) => (
          <li key={index} className="flex justify-between mb-2">
            <span>{budget.category}</span>
            <span>${budget.amount.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BudgetManagement;