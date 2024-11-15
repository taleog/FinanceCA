import React from 'react';
import { Moon, Sun } from 'lucide-react';
import useDarkMode from '../hooks/useDarkMode';

export default function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-chattext-muted dark:hover:bg-chatbg transition-colors"
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}