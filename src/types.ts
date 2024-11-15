// src/types.ts

export interface Transaction {
  id?: string;
  userId: string;
  type: 'expense' | 'income' | 'transfer';
  amount: number;
  category: string;
  description: string;
  date: Date;
  paymentMethod: string;
}

export type SortField = 'date' | 'description' | 'category' | 'amount';
export type SortOrder = 'asc' | 'desc';