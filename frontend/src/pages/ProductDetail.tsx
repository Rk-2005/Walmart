import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  FiShoppingCart, 
  FiChevronLeft, 
  FiHeart, 
  FiShare2, 
  FiTruck, 
  FiShield, 
  FiRefreshCw,
  FiStar,
  FiMinus,
  FiPlus,
  FiZap,
  FiPlay,
  FiImage,
  FiX,
  FiChevronRight,
  FiChevronLeft as FiChevronLeftIcon
} from "react-icons/fi";
import axios from "axios";
import Navbar from "../components/navbar";
import { jwtDecode } from "jwt-decode";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [reviews, setReviews] = useState([]);
  
  // Modal states for media viewing
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMedia, setModalMedia] = useState(null);
  const [modalType, setModalType] = useState(''); // 'image' or 'video'

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/products/${id}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        const productData = res.data.result;
        setProduct(productData);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/reviews/${id}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        // Access the reviews from the results array
        if (res.data.results && Array.isArray(res.data.results) && res.data.results.length > 0) {
          setReviews(res.data.results[0].reviews || []);
        } else {
          setReviews([]);
        }
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
        setReviews([]);
      }
    };

    const fetchData = async () => {
      await Promise.all([fetchProduct(), fetchReviews()]);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  // Modal functions
  const openModal = (mediaUrl, type) => {
    setModalMedia(mediaUrl);
    setModalType(type);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMedia(null);
    setModalType('');
    document.body.style.overflow = 'unset'; // Restore scroll
  };

  // Close modal when clicking outside or pressing escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isModalOpen]);

  const handleAddToCart = () => {
    console.log("Added to cart:", {
      productId: product.id,
      quantity,
      price: product.price,
    });
    // Add your cart logic here
  };

  const handleBuyNow = () => {
    const token = localStorage.getItem("token");

    const decoded = jwtDecode(token);
    const userId = decoded.userid; // ✅ Only if your token payload has `userid`
    console.log(userId);

    console.log("Buy now:", {
      productId: product.id,
      quantity,
      price: product.price,
      total: product.price * quantity
    });
    const res = axios.post("http://localhost:3000/api/orders/add", {
      userId,
      productId: product.id,
      status: "delivered"
    }, {
      headers: {
        Authorization: token
      }
    });
    // Add your buy now logic here (redirect to checkout)
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // Add wishlist logic here
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Calculate review statistics from actual reviews
  const getReviewStats = () => {
    if (!reviews || reviews.length === 0) {
      return { average: 0, count: 0 };
    }
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const average = totalRating / reviews.length;
    
    return {
      average: parseFloat(average.toFixed(1)),
      count: reviews.length
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl text-gray-300 mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link 
            to="/products" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiChevronLeft className="mr-2" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  // Mock data for demonstration - replace with actual product data
  const mockImages = [
    product.imageUrl,
    product.imageUrl,
    product.imageUrl,
    product.imageUrl
  ];

  const reviewStats = getReviewStats();

const ReviewItem = ({ review }) => {
  const userName = review.user?.name || `User ${review.user?.id || 'Unknown'}`;
  const reviewDate = new Date(review.createdAt).toLocaleDateString();

  // Get original mediaUrl
  let mediaUrl = review.mediaUrl || "";

  // Format the media URL properly
  if (mediaUrl && !mediaUrl.startsWith("http")) {
    mediaUrl = `https://res.cloudinary.com/dtqueeebi/image/upload/${mediaUrl}`;
  }

  // Check if mediaUrl is video or image
  const isVideo = /\.(mp4|webm|avi)$/i.test(mediaUrl);
  const isImage = mediaUrl && !isVideo;

  return (
    <div className="border-b border-gray-100 pb-6 mb-6 last:border-b-0">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {userName.charAt(0).toUpperCase()}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="font-medium text-gray-900">{userName}</h4>
            {review.user?.coins && (
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full flex items-center">
                🪙 {review.user.coins} coins
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={`w-4 h-4 ${
                    i < review.rating
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">{reviewDate}</span>
          </div>

          <p className="text-gray-700 text-sm mb-3">{review.content}</p>

         {/* Image Display */}
{isImage && (
  <div className="mb-3">
    <div
      onClick={() => openModal(mediaUrl, "image")}
      className="w-28 h-28 cursor-pointer flex flex-col items-center justify-center border-2 border-blue-300 bg-blue-50 rounded-xl hover:scale-105 transition-transform shadow-sm"
    >
      <FiImage size={28} className="text-blue-600 mb-1" />
      <span className="text-xs text-blue-700 font-medium">View Image</span>
    </div>
  </div>
)}

{/* Video Display */}
{isVideo && (
  <div className="mb-3">
    <div
      onClick={() => openModal(mediaUrl, "video")}
      className="w-28 h-28 cursor-pointer flex flex-col items-center justify-center border-2 border-purple-300 bg-purple-50 rounded-xl hover:scale-105 transition-transform shadow-sm"
    >
      <FiPlay size={28} className="text-purple-600 mb-1" />
      <span className="text-xs text-purple-700 font-medium">View Video</span>
    </div>
  </div>
)}

        </div>
      </div>
    </div>
  );
};

  // Fixed Media Modal Component
  const MediaModal = () => {
    if (!isModalOpen) return null;

    return (
      <div 
        className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
        onClick={closeModal}
      >
        <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center">
          {/* Close button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-60 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
          >
            <FiX size={20} />
          </button>

          {/* Media content */}
          <div 
            className="relative max-w-full max-h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {modalType === 'image' && (
              <img
                src={modalMedia}
                alt="Review image enlarged"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
            )}
            
            {modalType === 'video' && (
              <video
                src={modalMedia}
                controls
                autoPlay
                className="max-w-full max-h-full rounded-lg shadow-2xl"
                style={{ maxHeight: '80vh' }}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar></Navbar>
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Product Images - Reduced Size */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3 max-w-md mx-auto">
                <img
                  src={mockImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              {/* Thumbnail Images - Smaller */}
              <div className="flex space-x-2 justify-center overflow-x-auto">
                {mockImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-12 h-12 rounded-md overflow-hidden border-2 transition-colors ${
                      selectedImage === index 
                        ? 'border-blue-600' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-contain bg-gray-50"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Info - Compact */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-5 shadow-sm">
              {/* Product Title & Rating */}
              <div className="mb-4">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                
                <div className="flex items-center space-x-3 mb-3">
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(reviewStats.average)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {reviewStats.count > 0 
                        ? `${reviewStats.average} (${reviewStats.count} reviews)`
                        : 'No reviews yet'
                      }
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-base text-gray-500 line-through">
                    ${(product.price * 1.2).toFixed(2)}
                  </span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                    17% OFF
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 mb-4">
                <button
                  onClick={handleWishlist}
                  className={`p-2 rounded-lg border transition-colors ${
                    isWishlisted
                      ? 'bg-red-50 border-red-200 text-red-600'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <FiHeart className={isWishlisted ? 'fill-current' : ''} size={18} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <FiShare2 size={18} />
                </button>
              </div>

              {/* Quantity Selector - Compact */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-l-md transition-colors"
                    >
                      <FiMinus size={14} />
                    </button>
                    <span className="px-3 py-1.5 border-x border-gray-300 font-medium min-w-[2.5rem] text-center text-sm">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-r-md transition-colors"
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>
                  <span className="text-xs text-gray-500">
                    {quantity > 10 && 'Bulk discount available!'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 mb-4">
                <button
                  onClick={handleBuyNow}
                  className="w-full flex items-center justify-center py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-orange-200 shadow-md"
                >
                  <FiZap className="mr-2" size={18} />
                  Buy Now - ${(product.price * quantity).toFixed(2)}
                </button>
                
                <button
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-blue-200 shadow-md"
                >
                  <FiShoppingCart className="mr-2" size={18} />
                  Add to Cart
                </button>
              </div>

              {/* Features - Compact */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <FiTruck className="text-green-600" size={14} />
                  <span>Free Delivery</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <FiRefreshCw className="text-blue-600" size={14} />
                  <span>30-Day Returns</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <FiShield className="text-purple-600" size={14} />
                  <span>2-Year Warranty</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs - Full Width */}
        <div className="mt-6 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {['description', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 text-sm font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                  {tab === 'reviews' && (
                    <span className="ml-1 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
                      {reviewStats.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="p-5">
            {activeTab === 'description' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Product Description
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}
            
            {activeTab === 'specifications' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Specifications
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Brand</span>
                    <span className="font-medium">Premium Brand</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Model</span>
                    <span className="font-medium">Latest 2024</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Warranty</span>
                    <span className="font-medium">2 Years</span>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Customer Reviews
                  </h3>
                  {reviewStats.count > 0 && (
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(reviewStats.average)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {reviewStats.average} out of 5 ({reviewStats.count} reviews)
                      </span>
                    </div>
                  )}
                </div>
                
                {reviews.length > 0 ? (
                  <div className="max-h-96 overflow-y-auto">
                    {reviews.map((review, index) => (
                      <ReviewItem key={index} review={review} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl text-gray-300 mb-3">💬</div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h4>
                    <p className="text-gray-600">Be the first to review this product!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Media Modal */}
      <MediaModal />
    </div>
  );
};

export default ProductDetail;