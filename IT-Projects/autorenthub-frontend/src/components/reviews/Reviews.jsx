import React, { useState, useEffect } from 'react';
import { reviewService } from '../../services/reviewService';
import { bookingService } from '../../services/bookingService';
import { toast } from 'react-toastify';
import ReviewCard from './ReviewCard';
import StarRating from './StarRating';
import LoadingSpinner from '../common/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import ReviewForm from './ReviewForm';

const Reviews = ({ vehicleId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewableBookingId, setReviewableBookingId] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCounts, setRatingCounts] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchReviews();
      if (user) {
        await checkIfUserCanReview();
      }
      setLoading(false);
    };

    if (vehicleId) {
      loadData();
    }
  }, [vehicleId, user]);

  const fetchReviews = async () => {
    try {
      const response = await reviewService.getVehicleReviews(vehicleId);
      if (response.success) {
        setReviews(response.data);
        calculateStats(response.data); // Calculate stats with the fetched data
      }
    } catch (error) {
      toast.error('Failed to fetch reviews.');
      console.error("Fetch reviews error:", error.response || error);
    }
  };

  const checkIfUserCanReview = async () => {
    try {
      const bookingResponse = await bookingService.getUserBookings();
      if (bookingResponse.success) {
        const myBookings = bookingResponse.data;
        const bookingToReview = myBookings.find(booking => 
          booking.vehicleId?._id === vehicleId &&
          booking.bookingStatus === 'completed' &&
          !booking.hasReview
        );
        if (bookingToReview) {
          setReviewableBookingId(bookingToReview._id);
        }
      }
    } catch (error) {
      console.error("Could not check for reviewable bookings", error);
    }
  };

  const calculateStats = (reviews) => {
    if (reviews.length === 0) {
      setAverageRating(0);
      setRatingCounts({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
      return;
    }
    const total = reviews.reduce((acc, review) => acc + review.rating, 0);
    setAverageRating((total / reviews.length).toFixed(1)); // Set the average rating
    
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => { 
      if (counts[review.rating] !== undefined) {
        counts[review.rating]++;
      }
    });
    setRatingCounts(counts);
  };

  const getPercentage = (count) => {
    if (reviews.length === 0) return 0;
    return (count / reviews.length) * 100;
  };

  const handleReviewSuccess = () => {
    setShowReviewForm(false);
    fetchReviews();
    setReviewableBookingId(null);
  };

  if (loading) {
    return <div className="flex justify-center mt-8"><LoadingSpinner /></div>;
  }

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Ratings & Reviews</h2>
        {user && reviewableBookingId && !showReviewForm && (
          <button 
            onClick={() => setShowReviewForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Write a Review
          </button>
        )}
      </div>

      {showReviewForm && (
        <ReviewForm 
          vehicleId={vehicleId} 
          bookingId={reviewableBookingId}
          onSuccess={handleReviewSuccess}
          onCancel={() => setShowReviewForm(false)}
        />
      )}

      {/* This is the section that displays the overall rating */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-8 p-6 bg-gray-50 rounded-lg">
        <div className="flex flex-col items-center">
          {/* This 'p' tag will now show the real average rating */}
          <p className="text-5xl font-bold text-gray-800">{averageRating}</p>
          <StarRating rating={Math.round(averageRating)} readonly size="large" />
          <p className="text-sm text-gray-500 mt-2">{reviews.length} Ratings</p>
        </div>
        <div className="flex-1 w-full max-w-md">
          {[5, 4, 3, 2, 1].map(star => (
            <div key={star} className="flex items-center space-x-2 mt-1">
              <span className="text-sm font-medium text-gray-600 w-12">{star} star</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${getPercentage(ratingCounts[star])}%` }}></div>
              </div>
              <span className="text-sm text-gray-600 w-8 text-right">{ratingCounts[star]}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map(review => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No reviews yet for this vehicle.</p>
        )}
      </div>
    </div>
  );
};

export default Reviews;