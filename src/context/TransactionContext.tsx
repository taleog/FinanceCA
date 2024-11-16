import React, { createContext, useReducer, useContext, useEffect, useCallback } from 'react';
import { Transaction } from '../types';
import { getAuthenticatedUser } from '../utils/authUtils';
import {
  addTransactionToFirestore,
  getTransactionsFromFirestore,
  updateTransactionInFirestore,
  deleteTransactionFromFirestore,
} from '../services/transactionService';

interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

type TransactionAction =
  | { type: 'SET_LOADING' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string };

const initialState: TransactionState = {
  transactions: [],
  loading: false,
  error: null,
};

const TransactionContext = createContext<{
  state: TransactionState;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'userId'>) => Promise<void>;
  updateTransaction: (transaction: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  refreshTransactions: () => Promise<void>;
} | null>(null);

function transactionReducer(state: TransactionState, action: TransactionAction): TransactionState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: true, error: null };
    case 'SET_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload, loading: false, error: null };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions], loading: false, error: null };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map((t) => (t.id === action.payload.id ? action.payload : t)),
        loading: false,
        error: null,
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
        loading: false,
        error: null,
      };
    default:
      return state;
  }
}

export function TransactionProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  const refreshTransactions = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const user = await getAuthenticatedUser();
      const transactions = await getTransactionsFromFirestore(user.uid);
      dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });
    } catch (error: any) {
      console.error('Error getting transactions:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error?.code === 'failed-precondition' 
          ? 'Initializing transaction system...' 
          : 'Failed to load transactions'
      });
      
      // Retry after a short delay if it's a failed-precondition error
      if (error?.code === 'failed-precondition') {
        setTimeout(refreshTransactions, 2000);
      }
    }
  }, []);

  useEffect(() => {
    refreshTransactions();
  }, [refreshTransactions]);

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'userId'>): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const user = await getAuthenticatedUser();
      const newTransaction = await addTransactionToFirestore({ ...transaction, userId: user.uid });
      dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
      await refreshTransactions(); // Refresh the list after adding
    } catch (error) {
      console.error('Error adding transaction:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add transaction' });
      throw error;
    }
  };

  const updateTransaction = async (transaction: Transaction): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING' });
      await updateTransactionInFirestore(transaction);
      dispatch({ type: 'UPDATE_TRANSACTION', payload: transaction });
      await refreshTransactions(); // Refresh the list after updating
    } catch (error) {
      console.error('Error updating transaction:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update transaction' });
      throw error;
    }
  };

  const deleteTransaction = async (id: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING' });
      await deleteTransactionFromFirestore(id);
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
      await refreshTransactions(); // Refresh the list after deleting
    } catch (error) {
      console.error('Error deleting transaction:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete transaction' });
      throw error;
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        state,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        refreshTransactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
}