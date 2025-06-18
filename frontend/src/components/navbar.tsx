import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  FiSearch, FiUser, FiShoppingCart, FiChevronDown,
  FiPackage, FiHeart, FiGift, FiCreditCard, FiLogOut
} from 'react-icons/fi';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile]: any = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    if (token) {
      setUserProfile({ name: 'Ronak', email: 'john@example.com' });
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (!event.target.closest('.user-dropdown')) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.get('/api/search', {
        params: { query: searchQuery }
      });
      console.log('Search results:', response.data);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  async function addToCart(itemId: any) {
    try {
      await axios.post('/api/cart', { itemId });
      setCartCount(prev => prev + 1);
    } catch (error) {
      console.error('Add to cart error:', error);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserProfile(null);
    setIsUserDropdownOpen(false);
    navigate('/');
  };

  const handleMenuClick = (path: any) => {
    setIsUserDropdownOpen(false);
    navigate(path);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="text-2xl font-bold text-blue-600">
              ShopSwift
            </a>
          </div>

          {/* Search Bar */}
          <div className="flex-1 mx-6 max-w-xl">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search for products, brands, and categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 px-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
              >
                <FiSearch size={20} />
              </button>
            </form>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6">
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium text-sm">
              Deals
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium text-sm">
              New
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium text-sm">
              Categories
            </a>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* User Dropdown */}
            <div className="relative user-dropdown">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center text-sm text-gray-700 hover:text-blue-600 transition-colors bg-blue-600 text-white px-4 py-2 rounded font-medium"
              >
                <FiUser className="mr-1" size={16} />
                {isLoggedIn ? (userProfile as any)?.name?.split(' ')[0] || 'Profile' : 'Login'}
                <FiChevronDown className="ml-1" size={14} />
              </button>

              {isUserDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-md shadow-lg z-10 border">
                  {!isLoggedIn ? (
                    <>
                      <div className="px-4 py-3 border-b">
                        <p className="text-sm text-gray-600">New customer?</p>
                        <button
                          onClick={() => handleMenuClick('/signup')}
                          className="text-blue-600 font-medium text-sm hover:underline"
                        >
                          Sign Up
                        </button>
                      </div>
                      <button
                        onClick={() => handleMenuClick('/login')}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center"
                      >
                        <FiUser className="mr-3" size={16} />
                        Login
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleMenuClick('/profile')}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center border-b"
                      >
                        <FiUser className="mr-3" size={16} />
                        My Profile
                      </button>
                      <button
                        onClick={() => handleMenuClick('/mycoins')}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center"
                      >
                        <div className="w-4 h-4 mr-3 bg-yellow-400 rounded flex items-center justify-center">
                          <span className="text-xs font-bold text-white">+</span>
                        </div>
                        WalmartCoins
                      </button>
                      <button
                        onClick={() => handleMenuClick('/orders')}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center"
                      >
                        <FiPackage className="mr-3" size={16} />
                        Orders
                      </button>
                      <button
                        onClick={() => handleMenuClick('/wishlist')}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center"
                      >
                        <FiHeart className="mr-3" size={16} />
                        Wishlist
                      </button>
                      <button
                        onClick={() => handleMenuClick('/rewards')}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center"
                      >
                        <FiGift className="mr-3" size={16} />
                        Rewards
                      </button>
                      <button
                        onClick={() => handleMenuClick('/gift-cards')}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center"
                      >
                        <FiCreditCard className="mr-3" size={16} />
                        Gift Cards
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center border-t text-red-600"
                      >
                        <FiLogOut className="mr-3" size={16} />
                        Logout
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <button
              onClick={() => navigate('/my-cart')}
              className="p-2 text-gray-700 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-colors relative"
            >
              <FiShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
