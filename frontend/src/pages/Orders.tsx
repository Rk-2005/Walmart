import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/navbar';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('Authentication required');
        }

        const response = await axios.get('http://localhost:3000/api/orders/', {
          headers: {
            'Authorization': `${token}`
          }
        });
        
        // Add delivery status to orders (mock data - replace with actual status from API if available)
        const ordersWithStatus = response.data.result.map(order => ({
          ...order,
          status: order.status,
          deliveryDate: new Date(Date.now() + Math.random() * 10 * 24 * 60 * 60 * 1000)
        }));
        
        setOrders(ordersWithStatus);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 p-4 text-center">
          <h2 className="text-xl font-bold text-red-600">Error loading orders</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 p-4 text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-700">No Orders Found</h2>
          <p className="text-gray-600 max-w-md">You haven't placed any orders yet. Start shopping to see your orders here.</p>
          <button 
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm flex items-center gap-2"
            onClick={() => navigate('/products')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Your Orders</h1>
          <div className="text-sm text-gray-500">
            {orders.length} {orders.length === 1 ? 'order' : 'orders'} placed
          </div>
        </div>
        
        <div className="space-y-6">
          {orders.map((order, index) => (
           
            <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-100">
              <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b">
                <div>
               {/* {JSON.stringify(order)}*/}
                  
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-700">Order #{index + 1}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'Shipped' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}

                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Placed on {new Date().toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                {order.status === 'Delivered' && (
                  <p className="text-sm text-gray-500">
                    Delivered on {order.deliveryDate.toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                )}
              </div>
              
              <div className="p-4 sm:p-6 flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-40 h-40 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={order.product.imageUrl} 
                    alt={order.product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/images/placeholder-product.png';
                      e.target.className = 'w-full h-full object-contain p-4';
                    }}
                  />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">{order.product.name}</h3>
                  <p className="text-gray-600 mt-1">{order.product.description}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-4">
                    <div>
                      <span className="text-lg font-bold text-gray-900">${order.product.price.toFixed(2)}</span>
                    </div>
                    <div className="h-4 border-l border-gray-200"></div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                      Quantity: 1
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 sm:p-6 border-t bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  {order.status === 'delivered' ? (
                    <button 
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2"
                      onClick={() => navigate(`/addreview/${order.product.id}`)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      Rate Product
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Expected delivery: {order.deliveryDate.toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <button 
                    className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors shadow-sm flex items-center gap-2"
                    onClick={() => alert('Tracking not implemented yet')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Track Order
                  </button>
                  <button 
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
                    onClick={() => alert('Buy again functionality')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Buy Again
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Orders;