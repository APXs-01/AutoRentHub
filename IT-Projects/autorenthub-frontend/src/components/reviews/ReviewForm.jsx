import React, { useState } from 'react';
import { reviewService } from '../../services/reviewService';
import { toast } from 'react-toastify';
import StarRating from './StarRating';
import Button from '../common/Button';

const ReviewForm = ({ vehicleId, bookingId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    rating: 0,
    comment: '',
    categories: {
      cleanliness: 0,
      comfort: 0,
      performance: 0,
      value: 0
    }
  });
  const [loading, setLoading] = useState(false);

  const handleRatingChange = (field, rating) => {
    if (field === 'rating') {
      setFormData(prev => ({ ...prev, rating }));
    } else {
      setFormData(prev => ({
        ...prev,
        categories: {
          ...prev.categories,
          [field]: rating
        }
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.rating === 0) {
      toast.error('Please provide an overall rating');
      return;
    }

    if (formData.comment.trim().length < 10) {
      toast.error('Please provide a detailed comment (at least 10 characters)');
      return;
    }

    setLoading(true);
    try {
      await reviewService.createReview({
        vehicleId,
        bookingId,
        ...formData
      });
      toast.success('Review submitted successfully!');
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Write a Review</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Overall Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Overall Rating *
          </label>
          <StarRating
            rating={formData.rating}
            onRatingChange={(rating) => handleRatingChange('rating', rating)}
            size="large"
          />
        </div>

        {/* Category Ratings */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cleanliness
            </label>
            <StarRating
              rating={formData.categories.cleanliness}
              onRatingChange={(rating) => handleRatingChange('cleanliness', rating)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comfort
            </label>
            <StarRating
              rating={formData.categories.comfort}
              onRatingChange={(rating) => handleRatingChange('comfort', rating)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Performance
            </label>
            <StarRating
              rating={formData.categories.performance}
              onRatingChange={(rating) => handleRatingChange('performance', rating)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Value for Money
            </label>
            <StarRating
              rating={formData.categories.value}
              onRatingChange={(rating) => handleRatingChange('value', rating)}
            />
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review *
          </label>
          <textarea
            value={formData.comment}
            onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Share your experience with this vehicle..."
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Minimum 10 characters ({formData.comment.length}/500)
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Submit Review
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;