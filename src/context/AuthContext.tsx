// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';

interface AuthContextType {
  userUid: string | null;
  user: User | null;
}

const AuthContext = createContext<AuthContextType>({ userUid: null, user: null });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  // We set `userUid` to `user.uid` only if `user` is available, otherwise it remains null
  const userUid = user ? user.uid : null;

  return (
    <AuthContext.Provider value={{ userUid, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
