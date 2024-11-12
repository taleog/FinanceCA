import React from 'react';
import { useTransactions } from '../context/TransactionContext';

const ImportTransactions: React.FC = () => {
    const { addTransaction } = useTransactions();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                parseCSV(text);
            };
            reader.readAsText(file);
        }
    };

    const parseCSV = (text: string) => {
        const rows = text.split('\n');
        rows.forEach((row) => {
            const [date, description, amount, category, type] = row.split(',');
            if (date && description && amount && category && type) {
                addTransaction({
                    id: crypto.randomUUID(),
                    date,
                    description,
                    amount: type === 'expense' ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount)),
                    category,
                    type: type.trim() as 'expense' | 'income',
                });
            }
        });
    };

    return (
        <div className="mb-4">
            <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="p-2 border bg-slate-200 border-black rounded-lg"
            />
        </div>
    );
};

export default ImportTransactions;
