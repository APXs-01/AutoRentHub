import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const VehicleDetail = ({ vehicle, loading, error }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center">
            <span className="text-5xl">⚠️</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">Error</h1>
          <p className="text-gray-600 mb-6 text-lg">{error}</p>
          <Link 
            to="/vehicles" 
            className="inline-block bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-blue-600 font-semibold shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Back to Vehicles
          </Link>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center">
            <span className="text-5xl">🚗</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">Vehicle Not Found</h1>
          <p className="text-gray-600 mb-6 text-lg">The vehicle you're looking for doesn't exist.</p>
          <Link 
            to="/vehicles" 
            className="inline-block bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-blue-600 font-semibold shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Back to Vehicles
          </Link>
        </div>
      </div>
    );
  }

  const handleBookNow = () => {
    if (isAuthenticated) {
      navigate(`/booking/${vehicle._id}`);
    } else {
      navigate('/login', { state: { from: { pathname: `/vehicles/${vehicle._id}` } } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100">
          <ol className="flex items-center space-x-3 text-sm">
            <li><Link to="/" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">Home</Link></li>
            <li className="text-gray-300">/</li>
            <li><Link to="/vehicles" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">Vehicles</Link></li>
            <li className="text-gray-300">/</li>
            <li className="text-gray-900 font-semibold">{vehicle.brand} {vehicle.model}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div>
            <div className="mb-4">
              <div className="aspect-w-16 aspect-h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                {vehicle.images && vehicle.images.length > 0 ? (
                  <img
                    src={vehicle.images[selectedImageIndex]?.url}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="w-full h-96 object-cover"
                  />
                ) : (
                  <div className="w-full h-96 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                    <span className="text-8xl opacity-40">🚗</span>
                  </div>
                )}
              </div>
            </div>

            {/* Image Thumbnails */}
            {vehicle.images && vehicle.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {vehicle.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-w-16 aspect-h-12 rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 ${
                      selectedImageIndex === index 
                        ? 'ring-4 ring-blue-500 shadow-lg' 
                        : 'ring-2 ring-gray-200 hover:ring-gray-300'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${vehicle.brand} ${vehicle.model} ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Vehicle Information */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              {/* Header */}
              <div className="mb-8">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-4xl font-bold text-gray-900">
                    {vehicle.brand} {vehicle.model}
                  </h1>
                  <div className="text-right">
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                      ${vehicle.pricePerDay}
                    </div>
                    <div className="text-xs text-gray-500 font-medium">per day</div>
                    <div className="text-lg text-gray-600 mt-1">
                      ${vehicle.pricePerHour}/hour
                    </div>
                  </div>
                </div>

                {/* Status and Rating */}
                <div className="flex items-center space-x-4">
                  <span className={`px-4 py-2 rounded-xl text-sm font-semibold shadow-sm ${
                    vehicle.vehicleStatus === 'available' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {vehicle.vehicleStatus}
                  </span>

                  {vehicle.rating?.count > 0 && (
                    <div className="flex items-center bg-amber-50 px-4 py-2 rounded-xl">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-lg ${
                              i < Math.floor(vehicle.rating.average)
                                ? 'text-amber-400'
                                : 'text-gray-300'
                            }`}
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                      <span className="ml-2 text-sm font-semibold text-gray-700">
                        {vehicle.rating.average.toFixed(1)} ({vehicle.rating.count})
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Vehicle Specifications */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center bg-gray-50 px-4 py-3 rounded-xl">
                    <span className="text-xl mr-3">📅</span>
                    <span className="font-medium text-gray-700">Year: {vehicle.year}</span>
                  </div>
                  <div className="flex items-center bg-gray-50 px-4 py-3 rounded-xl">
                    <span className="text-xl mr-3">🚗</span>
                    <span className="font-medium text-gray-700">Type: {vehicle.vehicleType}</span>
                  </div>
                  <div className="flex items-center bg-gray-50 px-4 py-3 rounded-xl">
                    <span className="text-xl mr-3">⛽</span>
                    <span className="font-medium text-gray-700">Fuel: {vehicle.fuelType}</span>
                  </div>
                  <div className="flex items-center bg-gray-50 px-4 py-3 rounded-xl">
                    <span className="text-xl mr-3">⚙️</span>
                    <span className="font-medium text-gray-700">{vehicle.transmission}</span>
                  </div>
                  {vehicle.seatingCapacity && (
                    <div className="flex items-center bg-gray-50 px-4 py-3 rounded-xl">
                      <span className="text-xl mr-3">👥</span>
                      <span className="font-medium text-gray-700">{vehicle.seatingCapacity} seats</span>
                    </div>
                  )}
                  {vehicle.color && (
                    <div className="flex items-center bg-gray-50 px-4 py-3 rounded-xl">
                      <span className="text-xl mr-3">🎨</span>
                      <span className="font-medium text-gray-700">{vehicle.color}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              {vehicle.vehicleDescription && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Description</h3>
                  <p className="text-gray-600 leading-relaxed bg-gray-50 p-5 rounded-xl">
                    {vehicle.vehicleDescription}
                  </p>
                </div>
              )}

              {/* Features */}
              {vehicle.features && vehicle.features.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Features</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {vehicle.features.map((feature, index) => (
                      <div key={index} className="flex items-center bg-green-50 px-4 py-3 rounded-xl">
                        <span className="text-green-600 mr-2 text-lg font-bold">✓</span>
                        <span className="text-sm font-medium text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Location */}
              {vehicle.location && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Location</h3>
                  <div className="bg-blue-50 p-5 rounded-xl space-y-2">
                    <p className="flex items-center text-gray-700 font-medium">
                      <span className="text-xl mr-3">📍</span>
                      {vehicle.location.address}
                    </p>
                    <p className="flex items-center text-gray-700 font-medium">
                      <span className="text-xl mr-3">🏙️</span>
                      {vehicle.location.city}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                {vehicle.vehicleStatus === 'available' ? (
                  <button
                    onClick={handleBookNow}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {isAuthenticated ? 'Book Now' : 'Login to Book'}
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-400 text-white py-4 px-6 rounded-xl font-bold text-lg cursor-not-allowed opacity-60"
                  >
                    Currently Unavailable
                  </button>
                )}

                <Link
                  to="/vehicles"
                  className="w-full border-2 border-gray-200 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 text-center block"
                >
                  Back to Vehicles
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section - Placeholder */}
        <div className="mt-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h3>
            <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-dashed border-gray-200">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center">
                <span className="text-4xl">💬</span>
              </div>
              <p className="text-gray-500 text-lg">Reviews will be displayed here once the review system is implemented.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetail;