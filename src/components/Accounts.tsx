import React, { useState } from 'react';
import Account from '../types/Account';

interface AccountsProps {
    accounts: Account[];
    setAccounts: React.Dispatch<React.SetStateAction<Account[]>>;
}

export default function Accounts({ accounts, setAccounts }: AccountsProps) {
    const [accountName, setAccountName] = useState('');
    const [accountType, setAccountType] = useState('');
    const [balance, setBalance] = useState<number | ''>('');
    const [error, setError] = useState('');

    const handleAddAccount = () => {
        if (!accountName || !accountType || balance === '') {
            setError("All fields are required.");
            return;
        }

        const newAccount: Account = {
            id: Date.now().toString(),
            name: accountName,
            type: accountType,
            balance: Number(balance),
        };

        setAccounts([...accounts, newAccount]);
        setAccountName('');
        setAccountType('');
        setBalance('');
        setError('');
    };

    const handleDeleteAccount = (id: string) => {
        setAccounts(accounts.filter(account => account.id !== id));
    };

  return (
    <div className="p-6 bg-chatbg min-h-screen text-chattext">
      <h2 className="text-3xl font-semibold mb-6">Accounts</h2>

      {/* Form to add new accounts */}
      <div className="mb-8 p-4 bg-chatbg-dark rounded-lg shadow-lg">
        <h3 className="text-2xl font-medium mb-4">Add New Account</h3>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={(e) => { e.preventDefault(); handleAddAccount(); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-chattext-muted mb-1">Account Name</label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="w-full px-4 py-2 bg-chatbg text-chattext border border-chatbg rounded-md focus:outline-none focus:ring-2 focus:ring-chataccent"
              placeholder="e.g., Bank of America"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-chattext-muted mb-1">Account Type</label>
            <input
              type="text"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              className="w-full px-4 py-2 bg-chatbg text-chattext border border-chatbg rounded-md focus:outline-none focus:ring-2 focus:ring-chataccent"
              placeholder="e.g., Checking, Savings"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-chattext-muted mb-1">Balance</label>
            <input
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.valueAsNumber)}
              className="w-full px-4 py-2 bg-chatbg text-chattext border border-chatbg rounded-md focus:outline-none focus:ring-2 focus:ring-chataccent"
              placeholder="e.g., 1000.00"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-chataccent hover:bg-chataccent-hover text-white font-medium rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-chataccent transition duration-200"
          >
            Add Account
          </button>
        </form>
      </div>

      {/* List of accounts */}
      <div className="p-4 bg-chatbg-dark rounded-lg shadow-lg">
        <h3 className="text-2xl font-medium mb-4">Your Accounts</h3>
        {accounts.length === 0 ? (
          <p className="text-chattext-muted">No accounts added yet.</p>
        ) : (
          <ul className="space-y-4">
            {accounts.map(account => (
              <li key={account.id} className="flex justify-between items-center p-4 bg-chatbg-dark rounded-md">
                <div>
                  <p className="font-semibold text-lg">{account.name}</p>
                  <p className="text-chattext-muted">{account.type}</p>
                  <p className="text-chattext-muted">Balance: ${account.balance.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => handleDeleteAccount(account.id)}
                  className="text-red-500 hover:text-red-700 font-medium"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}