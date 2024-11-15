import React from 'react';
import CryptoPrices from '../components/CryptoPrices';

const CryptoPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-chattext mb-4 ">Crypto Portfolio</h1>
      <CryptoPrices />
    </div>
  );
};

export default CryptoPage;