import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

interface User {
  uid: string;
  displayName: string;
  email: string;
}

// Function to add a new user
export const addUser = async (userData: User) => {
  try {
    const usersCollection = collection(db, 'users');
    await addDoc(usersCollection, userData);
    console.log('User added successfully');
  } catch (error) {
    console.error('Error adding user: ', error);
  }
};

// Function to get user by UID
export const getUserByUID = async (uid: string) => {
  try {
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      console.log('User found:', querySnapshot.docs[0].data());
      return querySnapshot.docs[0].data();
    } else {
      console.log('No user found');
      return null;
    }
  } catch (error) {
    console.error('Error getting user: ', error);
  }
};
