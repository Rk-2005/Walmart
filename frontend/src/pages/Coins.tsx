import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/navbar';

function Coins() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    coins: 0,
    transactions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://walmart-o6e8.onrender.com/api/user/coins', {
          headers: {
            'Authorization': `${token}`
          }
        });

        const coins = response.data.user.coins || 0;
        const transactions = response.data.user.transactions?.length
          ? response.data.user.transactions
          : [
              {
                description: 'Welcome Bonus',
                type: 'earn',
                amount: 20,
                date: new Date().toISOString()
              },
              {
                description: 'Reviewed Product: Headphones',
                type: 'earn',
                amount: 10,
                date: new Date(Date.now() - 86400000).toISOString() // 1 day ago
              },
              {
                description: 'Redeemed Coins on Purchase',
                type: 'spend',
                amount: 15,
                date: new Date(Date.now() - 2 * 86400000).toISOString()
              },
              {
                description: 'Reviewed Product: T-Shirt',
                type: 'earn',
                amount: 5,
                date: new Date(Date.now() - 3 * 86400000).toISOString()
              },
              {
                description: 'Referral Bonus',
                type: 'earn',
                amount: 100,
                date: new Date(Date.now() - 5 * 86400000).toISOString()
              },
              {
                description: 'Follow-up Review Bonus',
                type: 'earn',
                amount: 50,
                date: new Date(Date.now() - 10 * 86400000).toISOString()
              }
            ];

        setUserData({ coins, transactions });

      } catch (error) {
        console.error('Error fetching coin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
    <Navbar></Navbar>
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      
      <div className="max-w-3xl mx-auto">

        {/* Coin Balance Card */}
    {/* Coin Balance Card */}
<div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl shadow-lg overflow-hidden mb-8">
  <div className="p-6 text-white">
    <div className="flex justify-between items-start">
      <div>
        <h2 className="text-lg font-medium">Your Coin Balance</h2>
        <p className="text-sm opacity-80">Available coins to spend</p>
      </div>
      <div className="bg-white bg-opacity-20 rounded-full p-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    </div>
    <div className="mt-6">
      <p className="text-4xl font-bold">{userData.coins}</p>
      <p className="text-sm opacity-90 mt-1">coins</p>
    </div>
    <div className="mt-4">
      <button
        onClick={() => navigate('/shopcoins')}
        className="mt-2 px-4 py-2 bg-white text-yellow-600 font-semibold rounded-md shadow hover:bg-yellow-100 transition"
      >
        Use Coins
      </button>
    </div>
  </div>
</div>

        {/* Transaction History */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Transaction History</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {userData.transactions.length > 0 ? (
              userData.transactions.map((transaction, index) => (
                <div key={index} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className={`font-medium ${transaction.type === 'earn' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'earn' ? '+' : '-'}{transaction.amount} coins
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                No transactions yet
              </div>
            )}
          </div>
        </div>

        {/* Ways to Earn More */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Ways to Earn More Coins</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Write product reviews</p>
                  <p className="text-sm text-gray-500">Earn 5-20 coins per review depending on content</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-purple-100 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Follow-up reviews</p>
                  <p className="text-sm text-gray-500">Earn 30 coins after 3 months, 50 coins after 6 months</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-green-100 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Refer friends</p>
                  <p className="text-sm text-gray-500">Get 100 coins for each friend who signs up and makes a purchase</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => navigate('/products')}
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Start Shopping to Earn Coins
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Coins;
