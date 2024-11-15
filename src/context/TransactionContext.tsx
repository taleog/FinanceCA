// src/context/TransactionContext.tsx
import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { Transaction } from '../types';
import { auth } from '../firebaseConfig';
import {
  addTransactionToFirestore,
  getTransactionsFromFirestore,
  updateTransactionInFirestore,
  deleteTransactionFromFirestore,
} from '../services/transactionService';

interface TransactionState {
  transactions: Transaction[];
}

type TransactionAction =
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string };

const initialState: TransactionState = {
  transactions: [],
};

const TransactionContext = createContext<{
  state: TransactionState;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'userId'>) => Promise<void>;
  updateTransaction: (transaction: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
} | null>(null);

function transactionReducer(state: TransactionState, action: TransactionAction): TransactionState {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };
    default:
      return state;
  }
}

export const TransactionProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  useEffect(() => {
    const fetchTransactions = async () => {
      const user = auth.currentUser;
      if (user) {
        const transactions = await getTransactionsFromFirestore(user.uid);
        dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });
      }
    };
    fetchTransactions();
  }, []);

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'userId'>) => {
    const user = auth.currentUser;
    if (user) {
      const newTransaction = await addTransactionToFirestore({
        ...transaction,
        userId: user.uid,
      });
      dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
    }
  };

  const updateTransaction = async (transaction: Transaction) => {
    await updateTransactionInFirestore(transaction);
    dispatch({ type: 'UPDATE_TRANSACTION', payload: transaction });
  };

  const deleteTransaction = async (id: string) => {
    await deleteTransactionFromFirestore(id);
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  };

  return (
    <TransactionContext.Provider
      value={{ state, addTransaction, updateTransaction, deleteTransaction }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};