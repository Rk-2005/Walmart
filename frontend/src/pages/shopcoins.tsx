import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ShopCoins() {
  const navigate = useNavigate();
  const [userCoins, setUserCoins] = useState(1000);
  const [redeemedCoupons, setRedeemedCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch user coins and redeemed coupons
    const token=localStorage.getItem("token");
    const fetchData = async () => {
      try {
        // In a real app, you would call your API here
         const response = await axios.get('https://walmart-o6e8.onrender.com/api/user/coins', {
          headers: {
            'Authorization': `${token}`
          }
        });
        setUserCoins(response.data.user.coinsw);
        // setRedeemedCoupons(response.data.redeemedCoupons);
        
        // Simulating API delay
        setTimeout(() => {
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const coupons = [
    {
      id: 1,
      title: "Amazon ₹100 Gift Card",
      coinsRequired: 1000,
      image: "https://1000logos.net/wp-content/uploads/2016/10/Amazon-Logo-2000.png",
      description: "Redeemable on Amazon India website",
      code: "AMZN100"
    },
    {
      id: 2,
      title: "Zomato ₹150 Voucher",
      coinsRequired: 1200,
      image: "https://b.zmtcdn.com/web_assets/b40b97e677bc7b2ca77c58c61db266fe1603954218.png",
      description: "Valid on orders above ₹300",
      code: "ZOM150"
    },
    {
      id: 3,
      title: "Swiggy ₹200 Discount",
      coinsRequired: 1500,
      image: "https://bsmedia.business-standard.com/_media/bs/img/article/2023-07/17/full/1689574606-2001.png",
      description: "No minimum order value",
      code: "SWIG200"
    },
    {
      id: 4,
      title: "Flipkart ₹250 Voucher",
      coinsRequired: 1800,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS34W3iJVgg2AUGzA8UJII8W0dAE0pbE5A8vQ&s",
      description: "Applicable on all products",
      code: "FLIP250"
    },
    {
      id: 5,
      title: "Netflix 1 Month Subscription",
      coinsRequired: 2500,
      image: "https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.png",
      description: "Basic plan (1 month)",
      code: "NETF1M"
    },
    {
      id: 6,
      title: "Uber ₹100 Ride Credit",
      coinsRequired: 800,
      image: "https://d1a3f4spazzrp4.cloudfront.net/uber-com/1.3.8/d1a3f4spazzrp4.cloudfront.net/illustrations/app-store-google-4d63c31a3e.svg",
      description: "Valid on all rides",
      code: "UBER100"
    }
  ];

  const handleRedeem = (couponId, coinsRequired) => {
    if (userCoins >= coinsRequired) {
      // In a real app, you would call your API here
      // await axios.post('/api/redeem', { couponId });
      setUserCoins(userCoins - coinsRequired);
      const coupon = coupons.find(c => c.id === couponId);
      setRedeemedCoupons([...redeemedCoupons, coupon]);
      alert(`Coupon redeemed successfully! Your code: ${coupon.code}`);
    } else {
      alert("You don't have enough coins to redeem this coupon");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      {/* Coin Balance */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-700">Your Coin Balance</h2>
              <p className="text-2xl font-bold text-gray-900">{userCoins.toLocaleString()} coins</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/how-to-earn')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
          >
            How to earn more
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Redeemed Coupons Section */}
      {redeemedCoupons.length > 0 && (
        <div className="max-w-6xl mx-auto mb-10">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Your Redeemed Coupons</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {redeemedCoupons.map((coupon, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden border border-green-200">
                <div className="p-4">
                  <div className="flex items-start">
                    <img 
                      src={coupon.image} 
                      alt={coupon.title}
                      className="w-16 h-16 object-contain mr-4"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{coupon.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{coupon.description}</p>
                      <div className="mt-3">
                        <p className="text-xs font-mono bg-gray-100 p-2 rounded">{coupon.code}</p>
                        <p className="text-xs text-green-600 mt-1">Redeemed successfully</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Coupons */}
      <div className="max-w-6xl mx-auto">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Available Rewards</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-200">
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <img 
                    src={coupon.image} 
                    alt={coupon.title}
                    className="h-12 object-contain"
                  />
                  <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">{coupon.coinsRequired.toLocaleString()} coins</span>
                  </div>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-1">{coupon.title}</h4>
                <p className="text-sm text-gray-500 mb-4">{coupon.description}</p>
                <button
                  onClick={() => handleRedeem(coupon.id, coupon.coinsRequired)}
                  disabled={userCoins < coupon.coinsRequired}
                  className={`w-full py-2 px-4 rounded-lg font-medium flex items-center justify-center ${
                    userCoins >= coupon.coinsRequired
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {userCoins >= coupon.coinsRequired ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Redeem Now
                    </>
                  ) : (
                    'Not enough coins'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works section */}
      <div className="max-w-6xl mx-auto mt-12 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">How it works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start">
            <div className="bg-blue-100 p-2 rounded-full mr-4">
              <span className="text-blue-600 font-bold">1</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Earn coins</h4>
              <p className="text-sm text-gray-500 mt-1">Write reviews, refer friends, and complete activities to earn coins</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-blue-100 p-2 rounded-full mr-4">
              <span className="text-blue-600 font-bold">2</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Redeem rewards</h4>
              <p className="text-sm text-gray-500 mt-1">Choose from various gift cards and vouchers</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-blue-100 p-2 rounded-full mr-4">
              <span className="text-blue-600 font-bold">3</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Use your rewards</h4>
              <p className="text-sm text-gray-500 mt-1">Apply coupon codes at checkout on partner websites</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShopCoins;