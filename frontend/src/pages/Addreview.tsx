import  { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/navbar';

function AddReview() {
  const navigate = useNavigate();
  const location = useLocation();
  const { order } = location.state || {};
  const productid=useParams();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [reviewType, setReviewType] = useState('text'); // 'text', 'image', 'video', 'mixed'

  // Coin rewards that match your backend
  const coinRewards:any = {
    text: 5,
    image: 10,
    video: 20,
    mixed: 15
  };

  const handleMediaUpload = (e:any) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type and size based on review type
    if (reviewType === 'image' || (reviewType === 'mixed' && file.type.startsWith('image/'))) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
    } else if (reviewType === 'video' || (reviewType === 'mixed' && file.type.startsWith('video/'))) {
      if (file.size > 50 * 1024 * 1024) {
        setError('Video size should be less than 50MB');
        return;
      }
    }

    setMedia(file);
    setError('');
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a star rating');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try{
    
      const formData = new FormData();
      //@ts-ignore
      formData.append('productId', (productid.id));
      formData.append('rating', rating.toString());
      formData.append('type', reviewType);
      
      if (content) formData.append('content', content);
      if (media) formData.append('file', media);

      const token = localStorage.getItem('token');
      const response = await axios.post('https://walmart-o6e8.onrender.com/api/reviews/add', formData, {
        headers: {
          'Authorization': `${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response)
      // Calculate coins earned based on type
      const coinsEarned = coinRewards[reviewType] || 0;
      console.log(coinsEarned)
      console.log(coinsEarned)
      navigate('/review-submitted', { 
        state: { 
          coinsEarned,
        } 
      });
    } finally {
      setIsSubmitting(false);
    }
    
  };

  const getMediaAccept = () => {
    switch(reviewType) {
      case 'image': return 'image/*';
      case 'video': return 'video/*';
      case 'mixed': return 'image/*,video/*';
      default: return '';
    }
  };

  return (
    <>
    <Navbar></Navbar>
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      
      {JSON.stringify(productid)}
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 mb-6 hover:text-blue-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Orders
        </button>

        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
            <h1 className="text-2xl font-bold text-gray-800">Write a Review</h1>
            <p className="text-gray-600 mt-1">Share your experience with {order?.product?.name || 'this product'}</p>
          </div>

          <div className="p-6">
            {order && (
              <div className="flex items-start mb-8 p-4 bg-gray-50 rounded-lg">
                <img 
                  src={order.product.imageUrl} 
                  alt={order.product.name}
                  className="w-20 h-20 object-contain rounded-lg border border-gray-200 mr-4"
                />
                <div>
                  <h3 className="font-medium text-gray-800">{order.product.name}</h3>
                  <p className="text-gray-500 text-sm">Order placed on {new Date().toLocaleDateString()}</p>
                  <div className="mt-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block">
                    Earn up to {coinRewards.video} coins for this review
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Review Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['text', 'image', 'video', 'mixed'].map((type) => (
                    <button
                      type="button"
                      key={type}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        reviewType === type 
                          ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => {
                        setReviewType(type);
                        setMedia(null);
                      }}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)} 
                      <span className="ml-1 text-xs text-gray-500">(+{coinRewards[type]} coins)</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Star Rating */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overall rating <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center">
                  {[...Array(5)].map((_, index) => {
                    const ratingValue = index + 1;
                    return (
                      <button
                        type="button"
                        key={index}
                        className={`text-3xl ${ratingValue <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'} transition-colors`}
                        onClick={() => setRating(ratingValue)}
                        onMouseEnter={() => setHover(ratingValue)}
                        onMouseLeave={() => setHover(0)}
                      >
                        ★
                      </button>
                    );
                  })}
                  <span className="ml-3 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                    {rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : 'Not rated'}
                  </span>
                </div>
              </div>

              {/* Text Review */}
              {reviewType !== 'video' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Write your review
                    <span className="ml-1 text-xs text-gray-500">
                      ({reviewType === 'text' ? 'Required' : 'Optional'} - Earn {coinRewards.text} coins)
                    </span>
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Share your thoughts about this product..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required={reviewType === 'text'}
                  />
                </div>
              )}

              {/* Media Upload */}
              {(reviewType === 'image' || reviewType === 'video' || reviewType === 'mixed') && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {reviewType === 'image' ? 'Upload Image' : reviewType === 'video' ? 'Upload Video' : 'Upload Media'}
                    <span className="ml-1 text-xs text-gray-500">
                      (Required - Earn {coinRewards[reviewType] - coinRewards.text} additional coins)
                    </span>
                  </label>
                  <div className="mt-1 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-colors">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 mr-2" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        {reviewType === 'image' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        ) : reviewType === 'video' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        ) : (
                          <>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                          </>
                        )}
                      </svg>
                      {reviewType === 'image' ? 'Choose Image' : reviewType === 'video' ? 'Choose Video' : 'Choose File'}
                      <input 
                        type="file" 
                        className="hidden" 
                        accept={getMediaAccept()}
                        onChange={handleMediaUpload}
                        required
                      />
                    </label>
                    <span className="text-sm text-gray-500">
                      {reviewType === 'image' ? 'JPEG, PNG (max 5MB)' : 
                       reviewType === 'video' ? 'MP4, MOV (max 50MB)' : 
                       'Images or Videos'}
                    </span>
                  </div>

                  {media && (
                    <div className="mt-4 relative">
                      
                      {(media as any).type.startsWith('image/') ? (
                        <div className="relative">
                          <img
                            src={URL.createObjectURL(media)}
                            alt="Preview"
                            className="max-w-full h-auto max-h-64 rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => setMedia(null)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div className="relative">
                          <video controls className="max-w-full rounded-lg border border-gray-200">
                            <source src={URL.createObjectURL(media)} type={(media as any).type} />
                          </video>
                          <button
                            type="button"
                            onClick={() => setMedia(null)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-sm text-gray-500">
                  Total coins to earn: <span className="font-medium text-gray-700">
                    {coinRewards[reviewType]} coins
                  </span>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      Submit Review
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default AddReview;