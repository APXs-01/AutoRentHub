import React from 'react';

const VehicleFilters = ({ filters, onFilterChange, onReset }) => {
  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
        <h3 className="text-xl font-bold text-gray-900">Filters</h3>
        <button
          onClick={onReset}
          className="text-blue-600 hover:text-blue-700 text-sm font-semibold hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all duration-300"
        >
          Reset All
        </button>
      </div>

      <div className="space-y-5">
        {/* Vehicle Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2.5">
            🚗 Vehicle Type
          </label>
          <select
            value={filters.vehicleType || ''}
            onChange={(e) => handleChange('vehicleType', e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white font-medium text-gray-700"
          >
            <option value="">All Types</option>
            <option value="car">Car</option>
            <option value="bike">Bike</option>
            <option value="scooter">Scooter</option>
          </select>
        </div>

        {/* Fuel Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2.5">
            ⛽ Fuel Type
          </label>
          <select
            value={filters.fuelType || ''}
            onChange={(e) => handleChange('fuelType', e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white font-medium text-gray-700"
          >
            <option value="">All Fuel Types</option>
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="electric">Electric</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        {/* Transmission */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2.5">
            ⚙️ Transmission
          </label>
          <select
            value={filters.transmission || ''}
            onChange={(e) => handleChange('transmission', e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white font-medium text-gray-700"
          >
            <option value="">All Transmissions</option>
            <option value="manual">Manual</option>
            <option value="automatic">Automatic</option>
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2.5">
            💰 Price Range (per day)
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={(e) => handleChange('minPrice', e.target.value)}
              className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white font-medium text-gray-700"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={(e) => handleChange('maxPrice', e.target.value)}
              className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white font-medium text-gray-700"
            />
          </div>
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2.5">
            📍 City
          </label>
          <input
            type="text"
            placeholder="Enter city"
            value={filters.city || ''}
            onChange={(e) => handleChange('city', e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white font-medium text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2.5">
            🔄 Sort By
          </label>
          <select
            value={filters.sortBy || 'createdAt'}
            onChange={(e) => handleChange('sortBy', e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white font-medium text-gray-700"
          >
            <option value="createdAt">Newest First</option>
            <option value="pricePerDay">Price: Low to High</option>
            <option value="-pricePerDay">Price: High to Low</option>
            <option value="rating.average">Rating</option>
            <option value="brand">Brand</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default VehicleFilters;