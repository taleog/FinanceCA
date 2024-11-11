import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { TransactionProvider } from './context/TransactionContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TransactionProvider>
      <App />
    </TransactionProvider>
  </StrictMode>
);