import React from 'react';
import { User, Bell, Shield, LogOut } from 'lucide-react';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';

// Define the prop types for Settings
interface SettingsProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Settings({ setIsLoggedIn }: SettingsProps) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-chattext">Settings</h1>
        <p className="text-slate-600 dark:text-chattext-muted">Manage your account settings and preferences</p>
      </header>
      
      {/* Other settings items */}
      
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500"
      >
        <LogOut className="w-5 h-5" />
        <span>Sign Out</span>
      </button>
    </div>
  );
}
