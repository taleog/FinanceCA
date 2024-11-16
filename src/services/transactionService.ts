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
  orderBy,
  QueryConstraint,
} from 'firebase/firestore';
import { Transaction } from '../types';
import { getAuthenticatedUser } from '../utils/authUtils';

// Add a test transaction (for testing purposes)
export const addTestTransaction = async (): Promise<string> => {
  try {
    const user = await getAuthenticatedUser();
    const docRef = await addDoc(collection(db, 'transactions'), {
      amount: 100,
      category: 'Test Category',
      date: Timestamp.fromDate(new Date()),
      description: 'Test transaction',
      paymentMethod: 'Credit Card',
      type: 'expense',
      userId: user.uid,
    });
    console.log('Test transaction added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding test transaction:', error);
    throw error;
  }
};

// Add a new transaction
export const addTransactionToFirestore = async (
  transaction: Omit<Transaction, 'id'>
): Promise<Transaction> => {
  try {
    const user = await getAuthenticatedUser();
    const docRef = await addDoc(collection(db, 'transactions'), {
      amount: transaction.type === 'expense' ? -Math.abs(transaction.amount) : Math.abs(transaction.amount),
      category: transaction.category,
      date: Timestamp.fromDate(new Date(transaction.date)),
      description: transaction.description,
      paymentMethod: transaction.paymentMethod || 'Credit Card',
      type: transaction.type,
      userId: user.uid,
    });
    return {
      ...transaction,
      id: docRef.id,
      amount: transaction.type === 'expense' ? -Math.abs(transaction.amount) : Math.abs(transaction.amount),
    };
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
};

// Fetch all transactions for the authenticated user
export const getTransactionsFromFirestore = async (userId: string): Promise<Transaction[]> => {
  try {
    // Create an array of query constraints
    const constraints: QueryConstraint[] = [
      where('userId', '==', userId),
    ];

    // Add orderBy only if we have the necessary index
    try {
      constraints.push(orderBy('date', 'desc'));
    } catch (error) {
      console.warn('Date ordering not available, falling back to default order');
    }

    const q = query(collection(db, 'transactions'), ...constraints);
    const querySnapshot = await getDocs(q);
    
    // Sort the results in memory if Firestore ordering fails
    let transactions = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      amount: doc.data().amount,
      category: doc.data().category,
      date: doc.data().date.toDate(),
      description: doc.data().description,
      paymentMethod: doc.data().paymentMethod || 'Credit Card',
      type: doc.data().type,
      userId: doc.data().userId,
    })) as Transaction[];

    // Sort by date in memory if Firestore ordering wasn't possible
    if (constraints.length === 1) {
      transactions = transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
    }

    return transactions;
  } catch (error: any) {
    if (error?.code === 'failed-precondition') {
      // If the error is due to missing index, try without ordering
      const q = query(
        collection(db, 'transactions'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      const transactions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        amount: doc.data().amount,
        category: doc.data().category,
        date: doc.data().date.toDate(),
        description: doc.data().description,
        paymentMethod: doc.data().paymentMethod || 'Credit Card',
        type: doc.data().type,
        userId: doc.data().userId,
      })) as Transaction[];

      // Sort in memory instead
      return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
    }
    console.error('Error getting transactions:', error);
    throw error;
  }
};

// Update an existing transaction
export const updateTransactionInFirestore = async (transaction: Transaction): Promise<void> => {
  try {
    const user = await getAuthenticatedUser();
    if (!transaction.id) throw new Error('Transaction ID is required');
    const docRef = doc(db, 'transactions', transaction.id);
    await updateDoc(docRef, {
      amount: transaction.type === 'expense' ? -Math.abs(transaction.amount) : Math.abs(transaction.amount),
      category: transaction.category,
      date: Timestamp.fromDate(new Date(transaction.date)),
      description: transaction.description,
      paymentMethod: transaction.paymentMethod || 'Credit Card',
      type: transaction.type,
      userId: user.uid,
    });
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
};

// Delete a transaction by ID
export const deleteTransactionFromFirestore = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'transactions', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};