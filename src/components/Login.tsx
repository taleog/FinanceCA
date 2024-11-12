import React, { useState, useEffect } from 'react';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, setPersistence, browserLocalPersistence, onAuthStateChanged } from 'firebase/auth';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch(error => {
      console.error("Error setting persistence:", error);
      setError("Failed to set persistence. Please try again.");
    });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        onLogin();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [onLogin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin();
    } catch (error) {
      setError('Failed to log in. Please check your credentials.');
      console.error('Login error:', error);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onLogin();
    } catch (error) {
      setError('Failed to register. Please try again.');
      console.error('Registration error:', error);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-chatbg-dark text-chattext-muted text-2xl">Loading...</div>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-chatbg-dark">
      <div className="w-full max-w-md p-8 space-y-6 bg-chatbg text-chattext rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-chattext">{isRegistering ? 'Register' : 'Login'}</h2>
        {error && <p className="text-center text-red-500">{error}</p>}
        
        <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-6">
          {isRegistering && (
            <div>
              <label className="block text-sm font-medium text-chattext-muted mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-chatbg-dark text-chattext border border-chatbg rounded-md focus:outline-none focus:ring-2 focus:ring-chataccent"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-chattext-muted mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-chatbg-dark text-chattext border border-chatbg rounded-md focus:outline-none focus:ring-2 focus:ring-chataccent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-chattext-muted mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-chatbg-dark text-chattext border border-chatbg rounded-md focus:outline-none focus:ring-2 focus:ring-chataccent"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-chataccent hover:bg-chataccent-hover text-white font-medium rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-chataccent transition duration-200"
          >
            {isRegistering ? 'Register' : 'Sign In'}
          </button>
        </form>
        
        <p className="text-center text-chattext-muted">
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-chataccent hover:underline"
          >
            {isRegistering ? 'Log In' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
}
