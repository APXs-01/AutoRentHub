import React from 'react';
import { Link } from 'react-router-dom';

const VehicleCard = ({ vehicle }) => {
  const mainImage = vehicle.images?.find(img => img.isMain) || vehicle.images?.[0];

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100">
      {/* Vehicle Image with Overlay */}
      <div className="h-56 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
        {mainImage ? (
          <img
            src={mainImage.url}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
            <span className="text-6xl opacity-40">🚗</span>
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Vehicle Type Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md shadow-lg ${
            vehicle.vehicleType === 'car' 
              ? 'bg-blue-500/90 text-white' 
              : 'bg-emerald-500/90 text-white'
          }`}>
            {vehicle.vehicleType}
          </span>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md shadow-lg ${
            vehicle.vehicleStatus === 'available' 
              ? 'bg-green-500/90 text-white' 
              : 'bg-red-500/90 text-white'
          }`}>
            {vehicle.vehicleStatus}
          </span>
        </div>
      </div>

      {/* Vehicle Details */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
            {vehicle.brand} {vehicle.model}
          </h3>
          <div className="text-right">
            <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              ${vehicle.pricePerDay}
            </div>
            <div className="text-xs text-gray-500 font-medium">
              per day
            </div>
            <div className="text-sm text-gray-400 mt-0.5">
              ${vehicle.pricePerHour}/hr
            </div>
          </div>
        </div>

        {/* Vehicle Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
            <span className="text-base">📅</span>
            <span className="font-medium">{vehicle.year}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
            <span className="text-base">⛽</span>
            <span className="font-medium">{vehicle.fuelType}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
            <span className="text-base">⚙️</span>
            <span className="font-medium">{vehicle.transmission}</span>
          </div>
          {vehicle.seatingCapacity && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
              <span className="text-base">👥</span>
              <span className="font-medium">{vehicle.seatingCapacity} seats</span>
            </div>
          )}
        </div>

        {/* Rating */}
        {vehicle.rating?.count > 0 && (
          <div className="flex items-center mb-4 bg-amber-50 rounded-lg px-3 py-2">
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
            <span className="ml-2 text-sm font-medium text-gray-700">
              {vehicle.rating.average.toFixed(1)}
            </span>
            <span className="ml-1 text-xs text-gray-500">
              ({vehicle.rating.count})
            </span>
          </div>
        )}

        {/* Location */}
        {vehicle.location?.city && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 bg-gray-50 rounded-lg px-3 py-2">
            <span className="text-base">📍</span>
            <span className="font-medium">{vehicle.location.city}</span>
          </div>
        )}

        {/* Action Button */}
        <Link
          to={`/vehicles/${vehicle._id}`}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-300 text-center block font-semibold shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default VehicleCard;