import React from 'react';
import StarRating from './StarRating';

const ReviewCard = ({ review }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-medium">
              {review.userId?.name?.charAt(0)?.toUpperCase() || 'A'}
            </span>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{review.userId?.name || 'Anonymous'}</h4>
            <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
          </div>
        </div>
        <StarRating rating={review.rating} readonly size="small" />
      </div>

      <div className="mb-4">
        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
      </div>

      {/* ✅ START: CATEGORY RATINGS SECTION */}
      {review.categories && (
        <div className="border-t pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            {Object.entries(review.categories).map(([category, rating]) => (
              rating > 0 && (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">{category}</span>
                  <StarRating rating={rating} readonly size="small" />
                </div>
              )
            ))}
          </div>
        </div>
      )}
      {/* ✅ END: CATEGORY RATINGS SECTION */}
      
      {review.adminResponse && (
        <div className="mt-4 p-3 bg-blue-50 rounded">
          <h6 className="text-sm font-medium text-blue-900 mb-1">Response from Auto Rent Hub</h6>
          <p className="text-sm text-blue-800">{review.adminResponse}</p>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;