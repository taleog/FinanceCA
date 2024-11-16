// src/utils/authUtils.ts
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export const getAuthenticatedUser = (): Promise<User> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(user);
        unsubscribe(); // Unsubscribe once the user is authenticated
      } else {
        reject(new Error("User is not authenticated"));
      }
    });
  });
};
