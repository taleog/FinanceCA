import React, { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import Papa from 'papaparse';

export default function ImportTransactions() {
  const [file, setFile] = useState<File | null>(null);
  const { addTransaction } = useTransactions();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const csvData = e.target?.result;
        if (typeof csvData === 'string') {
          Papa.parse(csvData, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
              results.data.forEach((row: any) => {
                const amount = parseFloat(row['Amount']);
                const transaction = {
                  id: '',
                  date: row['Date'],
                  description: `${row['Payee']} - ${row['Notes']}`,
                  amount: amount,
                  category: row['Category'],
                  type: amount >= 0 ? ('income' as const) : ('expense' as const),
                };
                addTransaction(transaction);
              });
            },
          });
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-chatbg-dark rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-chattext mb-4">
        Import Transactions
      </h2>
      <div className="mb-4">
        <label className="block mb-2 text-gray-700 dark:text-chattext">
          Choose a CSV file to import:
        </label>
        <div className="flex items-center">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            id="file-input"
          />
          <label
            htmlFor="file-input"
            className="px-4 py-2 bg-chataccent text-white rounded-md cursor-pointer hover:bg-chataccent-hover dark:bg-chataccent dark:hover:bg-chataccent-hover"
          >
            Choose File
          </label>
          {file && (
            <span className="ml-4 text-gray-700 dark:text-chattext">
              {file.name}
            </span>
          )}
        </div>
      </div>
      <button
        onClick={handleImport}
        className="px-4 py-2 bg-chataccent text-white rounded-md hover:bg-chataccent-hover dark:bg-chataccent dark:hover:bg-chataccent-hover"
        disabled={!file}
      >
        Import
      </button>
    </div>
  );
}
