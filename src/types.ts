export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
}

export type SortField = 'date' | 'description' | 'category' | 'amount';
export type SortOrder = 'asc' | 'desc';