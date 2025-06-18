import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiShoppingCart } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('featured');
  const [loading, setLoading] = useState(true);
 

  useEffect(() => {
    const token=localStorage.getItem("token")
    const fetchProducts = async () => {
      try {
        const res = await axios.get('https://walmart-o6e8.onrender.com/api/products/all',{
          headers:{
            Authorization:token
          }
        });
        setProducts(res.data.result);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = (products ?? []).filter(product =>
  (product as any).name.toLowerCase().includes(searchTerm.toLowerCase())
);


  const sortedProducts = [...filteredProducts].sort((a:any, b:any) => {
    switch (sortOption ) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      default: return a.id - b.id; // featured
    }
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          {/* Search Bar */}
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Sort Option */}
          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="text-center text-gray-600 py-10">Loading products...</div>
        )  : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product:any) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Product Image */}
                <div className="relative">
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-48 object-contain"
                    />
                  </Link>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <Link to={`/product/${product.id}`} className="block">
                    <h3 className="text-md font-medium text-gray-900 mb-1 hover:text-blue-600">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="text-sm text-gray-600 mb-2">{product.description}</p>

                  <div className="flex items-baseline mb-2">
                    <span className="text-lg font-bold text-gray-900 mr-2">
                      ${product.price}
                    </span>
                  </div>

                  <button className="mt-3 w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                    <FiShoppingCart className="mr-2" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
