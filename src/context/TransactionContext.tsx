import React, { createContext, useContext, useReducer } from 'react';
import { Transaction } from '../types';

interface TransactionState {
  transactions: Transaction[];
}

type TransactionAction = 
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'EDIT_TRANSACTION'; payload: Transaction };

interface TransactionContextType {
  state: TransactionState;
  addTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  editTransaction: (transaction: Transaction) => void;
}

const initialTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-03-15',
    description: 'Monthly Rent',
    category: 'Housing',
    amount: -2000,
    type: 'expense'
  },
  {
    id: '2',
    date: '2024-03-14',
    description: 'Salary Deposit',
    category: 'Income',
    amount: 4500,
    type: 'income'
  },
  {
    id: '3',
    date: '2024-03-13',
    description: 'Grocery Shopping',
    category: 'Food',
    amount: -156.78,
    type: 'expense'
  },
  {
    id: '4',
    date: '2024-03-12',
    description: 'Uber Ride',
    category: 'Transportation',
    amount: -25.50,
    type: 'expense'
  },
  {
    id: '5',
    date: '2024-03-11',
    description: 'Freelance Payment',
    category: 'Income',
    amount: 850,
    type: 'income'
  }
];

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

function transactionReducer(state: TransactionState, action: TransactionAction): TransactionState {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions]
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload)
      };
    case 'EDIT_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t => 
          t.id === action.payload.id ? action.payload : t
        )
      };
    default:
      return state;
  }
}

export function TransactionProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(transactionReducer, {
    transactions: initialTransactions
  });

  const addTransaction = (transaction: Transaction) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID()
    };
    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
  };

  const deleteTransaction = (id: string) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  };

  const editTransaction = (updatedTransaction: Transaction) => {
    dispatch({ type: 'EDIT_TRANSACTION', payload: updatedTransaction });
  };

  return (
    <TransactionContext.Provider value={{ state, addTransaction, deleteTransaction, editTransaction }}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
}