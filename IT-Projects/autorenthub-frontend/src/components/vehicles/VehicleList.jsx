import React, { useState, useEffect } from 'react';
import VehicleCard from './VehicleCard';
import VehicleFilters from './VehicleFilters';
import VehicleSearch from './VehicleSearch';
import LoadingSpinner from '../common/LoadingSpinner';
import { vehicleService } from '../../services/vehicleService';

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchVehicles();
  }, [filters, searchTerm]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        ...(searchTerm && { search: searchTerm })
      };
      
      const response = await vehicleService.getVehicles(params);
      
      if (response.success) {
        setVehicles(response.data);
        setPagination(response.pagination || {});
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...newFilters, page: 1 });
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setFilters({ ...filters, page: 1 });
  };

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    setSearchTerm('');
  };

  const handlePageChange = (page) => {
    setFilters({ ...filters, page });
  };

  if (loading && vehicles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent mb-3">
            Available Vehicles
          </h1>
          <p className="text-gray-600 text-lg">
            Find the perfect vehicle for your journey
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <VehicleSearch onSearch={handleSearch} loading={loading} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <VehicleFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
              />
            </div>
          </div>

          {/* Vehicle Grid */}
          <div className="lg:col-span-3">
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 text-red-800 px-6 py-4 rounded-xl mb-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚠️</span>
                  <p className="font-medium">{error}</p>
                </div>
              </div>
            )}

            {vehicles.length === 0 && !loading ? (
              <div className="text-center py-20 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-sm border border-gray-100">
                <div className="max-w-md mx-auto px-4">
                  {/* Icon */}
                  <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center shadow-inner">
                    <span className="text-7xl">🚗</span>
                  </div>
                  
                  {/* Message */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    No vehicles found
                  </h3>
                  <p className="text-gray-600 text-base">
                    Try adjusting your search criteria or filters to see more results
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Results Header */}
                <div className="flex justify-between items-center mb-6 bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-gray-700 font-semibold">
                      {pagination.total || 0} vehicles available
                    </p>
                  </div>
                  {loading && vehicles.length > 0 && (
                    <LoadingSpinner size="sm" />
                  )}
                </div>

                {/* Vehicle Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {vehicles.map((vehicle) => (
                    <VehicleCard key={vehicle._id} vehicle={vehicle} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-10 flex justify-center">
                    <nav className="flex items-center gap-2 bg-white px-4 py-3 rounded-2xl shadow-md border border-gray-100">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={!pagination.hasPrevPage}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 font-semibold hover:from-gray-100 hover:to-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 border border-gray-200 hover:shadow-md disabled:hover:shadow-none"
                      >
                        ← Previous
                      </button>
                      
                      <div className="flex gap-2 mx-2">
                        {[...Array(pagination.totalPages)].map((_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            className={`w-11 h-11 rounded-xl font-semibold transition-all duration-300 transform hover:scale-110 ${
                              pagination.page === i + 1
                                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
                      
                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={!pagination.hasNextPage}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 font-semibold hover:from-gray-100 hover:to-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 border border-gray-200 hover:shadow-md disabled:hover:shadow-none"
                      >
                        Next →
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleList;