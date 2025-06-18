
import { useLocation, useNavigate } from 'react-router-dom';

function ReviewSubmitted() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { coinsEarned = 0, product } = state || {};

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-green-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Review Submitted!</h1>
          <p className="text-center text-gray-600 mb-6">Thank you for your valuable feedback.</p>
          
          {product && (
            <div className="flex items-center mb-8 p-4 bg-gray-50 rounded-lg">
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-16 h-16 object-contain rounded border border-gray-200 mr-4"
              />
              <div>
                <h3 className="font-medium text-gray-800">{product.name}</h3>
                <p className="text-gray-500 text-sm">You earned {coinsEarned} coins</p>
              </div>
            </div>
          )}
          
          <div className="bg-blue-50 p-4 rounded-lg mb-8">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Future Review Opportunities</h3>
            <p className="text-xs text-blue-700 mb-2">Come back after 3 months to earn 30 more coins!</p>
            <p className="text-xs text-blue-700">After 6 months, you can earn 50 additional coins!</p>
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={() => navigate('/orders')}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to My Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewSubmitted;