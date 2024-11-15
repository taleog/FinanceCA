// src/services/transactionService.ts
import { db } from '../firebaseConfig';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { Transaction } from '../types';

export const addTransactionToFirestore = async (
  transaction: Omit<Transaction, 'id'>
): Promise<Transaction> => {
  const docRef = await addDoc(collection(db, 'transactions'), {
    ...transaction,
    date: Timestamp.fromDate(transaction.date),
  });
  return { ...transaction, id: docRef.id };
};

export const getTransactionsFromFirestore = async (
  userId: string
): Promise<Transaction[]> => {
  const q = query(collection(db, 'transactions'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  const transactions: Transaction[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    transactions.push({
      id: doc.id,
      ...data,
      date: data.date.toDate(),
    } as Transaction);
  });
  return transactions;
};

// Implement update and delete functions as needed
export const updateTransactionInFirestore = async (transaction: Transaction): Promise<void> => {
  const docRef = doc(db, 'transactions', transaction.id!);
  await updateDoc(docRef, {
    ...transaction,
    date: Timestamp.fromDate(transaction.date),
  });
};

// src/services/transactionService.ts
export const deleteTransactionFromFirestore = async (id: string): Promise<void> => {
  const docRef = doc(db, 'transactions', id);
  await deleteDoc(docRef);
};