import React, { useState } from 'react';
import { Wallet, Menu } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import TransactionList from './components/TransactionList';
import Login from './components/Login';
import Settings from './components/Settings';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeView, setActiveView] = useState('Overview');
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  // Render the login screen if the user is not logged in
  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-chatbg">
      {/* Sidebar with fixed width */}
      {isSidebarVisible && (
        <div className="w-64">
          <Sidebar
            activeView={activeView}
            onViewChange={setActiveView}
            setIsLoggedIn={setIsLoggedIn}
            toggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)}
          />
        </div>
      )}
      
      {/* Main content area */}
      <div className={`flex-1 transition-all ${isSidebarVisible ? 'pl-0' : 'pl-16'}`}>
        {!isSidebarVisible && (
          <button
            onClick={() => setIsSidebarVisible(true)}
            className="fixed top-4 left-4 bg-gray-200 dark:bg-gray-700 p-2 rounded-full shadow-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            <Menu className="w-6 h-6 text-gray-800 dark:text-gray-200" />
          </button>
        )}
        
        <main className="main-content p-6">
          {activeView === 'Overview' ? (
            <Dashboard
              showAddTransaction={showAddTransaction}
              setShowAddTransaction={setShowAddTransaction}
            />
          ) : activeView === 'Transactions' ? (
            <TransactionList
              showAddTransaction={showAddTransaction}
              setShowAddTransaction={setShowAddTransaction}
            />
          ) : activeView === 'Settings' ? (
            <Settings setIsLoggedIn={setIsLoggedIn} />
          ) : (
            <div className="coming-soon">Coming soon...</div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
