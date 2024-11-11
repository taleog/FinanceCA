import React, { useState } from 'react';
import { Wallet } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import TransactionList from './components/TransactionList';

function App() {
  const [activeView, setActiveView] = useState('Overview');
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <main className="flex-1 p-8">
        {activeView === 'Overview' ? (
          <Dashboard 
            showAddTransaction={showAddTransaction}
            setShowAddTransaction={setShowAddTransaction}
          />
        ) : activeView === 'Transactions' ? (
          <div className="space-y-6">
            <header className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Transactions</h1>
                <p className="text-slate-600">View and manage your transactions</p>
              </div>
              <button 
                onClick={() => setShowAddTransaction(true)}
                className="btn btn-primary"
              >
                Add Transaction
              </button>
            </header>
            <TransactionList />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-600">Coming soon...</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;