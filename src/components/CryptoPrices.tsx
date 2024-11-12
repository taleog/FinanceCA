import React, { useEffect, useState } from 'react';

const CryptoPrices: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,litecoin&vs_currencies=cad');
        const data = await response.json();
        setCryptoData(data);
      } catch (error) {
        console.error('Error fetching crypto data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCryptoData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-chatbg-dark p-6 rounded-xl shadow-sm border border-slate-200 dark:border-black">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Cryptocurrency Prices</h2>
        <p className="text-slate-600 dark:text-chattext-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-chatbg-dark p-6 rounded-xl shadow-sm border border-slate-200 dark:border-black">
      <h2 className="text-lg font-bold text-slate-800 dark:text-white">Cryptocurrency Prices</h2>
      <ul className="space-y-2">
        {Object.entries(cryptoData).map(([key, value]) => (
          <li key={key} className="flex justify-between text-slate-800 dark:text-chattext">
            <span className="capitalize">{key}:</span>
            <span className="font-semibold">${value.cad.toLocaleString('en-CA', { minimumFractionDigits: 2 })}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CryptoPrices;
