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
      setError('All fields are required.');
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
    setAccounts(accounts.filter((account) => account.id !== id));
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 text-gray-900 dark:bg-chatbg dark:text-chattext">
      <h2 className="text-3xl font-semibold mb-6">Accounts</h2>

      {/* Form to add new accounts */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow-lg dark:bg-chatbg-dark">
        {error && (
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        )}
        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            placeholder="Account Name"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md dark:bg-chatbg dark:border-gray-700 dark:text-chattext"
          />
          <input
            type="text"
            placeholder="Account Type"
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md dark:bg-chatbg dark:border-gray-700 dark:text-chattext"
          />
          <input
            type="number"
            placeholder="Balance"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md dark:bg-chatbg dark:border-gray-700 dark:text-chattext"
          />
        </div>
        <button
          onClick={handleAddAccount}
          className="mt-4 px-4 py-2 bg-chataccent text-white rounded-md hover:bg-chataccent-hover dark:bg-chataccent dark:hover:bg-chataccent-hover"
        >
          Add Account
        </button>
      </div>

      {/* List of accounts */}
      <div className="p-4 bg-white rounded-lg shadow-lg dark:bg-chatbg-dark">
        <h3 className="text-2xl font-medium mb-4">Your Accounts</h3>
        {accounts.length === 0 ? (
          <p className="text-gray-600 dark:text-chattext-muted">
            No accounts added yet.
          </p>
        ) : (
          <ul className="space-y-4">
            {accounts.map((account) => (
              <li
                key={account.id}
                className="flex justify-between items-center p-4 bg-gray-100 rounded-md shadow-sm dark:bg-chatbg"
              >
                <div>
                  <p className="font-semibold text-lg">
                    {account.name}
                  </p>
                  <p className="text-gray-600 dark:text-chattext-muted">
                    {account.type}
                  </p>
                  <p className="text-gray-600 dark:text-chattext-muted">
                    Balance: ${account.balance.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteAccount(account.id)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-500 font-medium"
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