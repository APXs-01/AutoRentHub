import React, { useState } from 'react';

const VehicleSearch = ({ onSearch, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 mb-6">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1 relative">
          {/* Search Icon */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
            🔍
          </div>
          
          <input
            type="text"
            placeholder="Search vehicles by brand, model, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white font-medium text-gray-700 placeholder-gray-400"
          />
          
          {/* Clear Button */}
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                onSearch('');
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
            >
              ✕
            </button>
          )}
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-3.5 rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:hover:translate-y-0 min-w-[130px]"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Searching
            </span>
          ) : (
            'Search'
          )}
        </button>
      </form>
    </div>
  );
};

export default VehicleSearch;