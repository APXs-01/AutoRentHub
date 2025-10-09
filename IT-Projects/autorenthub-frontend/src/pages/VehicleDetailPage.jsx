import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { vehicleService } from '../services/vehicleService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import NotFound from './NotFound';
import Reviews from '../components/reviews/Reviews'; // Import the main Reviews component

const VehicleDetailPage = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchVehicle();
    }
  }, [id]);

  const fetchVehicle = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await vehicleService.getVehicle(id);
      
      if (response.success && response.data.vehicle) {
        setVehicle(response.data.vehicle);
      } else {
        setError('Vehicle not found');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch vehicle details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !vehicle) {
    return <NotFound message={error || 'Vehicle could not be found.'} />;
  }

  return (
    <div className="container mx-auto p-4 md:p-8 lg:p-12">
      {/* Vehicle Details Section */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden lg:flex">
        <div className="lg:w-1/2">
          <img
            src={vehicle.images?.[0]?.url || 'https://via.placeholder.com/800x600'}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="lg:w-1/2 p-8 flex flex-col">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{vehicle.brand} {vehicle.model}</h1>
            <p className="text-gray-600 text-lg mb-6">{vehicle.year} &middot; {vehicle.location?.city}</p>

            <div className="mb-6">
              <span className="text-4xl font-extrabold text-blue-600">${vehicle.pricePerDay}</span>
              <span className="text-gray-500 text-lg">/day</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-gray-700 mb-6">
              <div className="flex items-center space-x-2">
                <span>🚗</span>
                <span className="capitalize">{vehicle.vehicleType}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>⛽</span>
                <span className="capitalize">{vehicle.fuelType}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>⚙️</span>
                <span className="capitalize">{vehicle.transmission}</span>
              </div>
              {vehicle.seatingCapacity && (
                <div className="flex items-center space-x-2">
                  <span>👥</span>
                  <span>{vehicle.seatingCapacity} Seats</span>
                </div>
              )}
            </div>

            <p className="text-gray-600 mb-6">{vehicle.vehicleDescription}</p>

            {vehicle.features && vehicle.features.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3">Features</h3>
                <ul className="flex flex-wrap gap-2">
                  {vehicle.features.map((feature, index) => (
                    <li key={index} className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="mt-auto">
            <Link
              to={`/booking/${vehicle._id}`}
              className="w-full text-center bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 inline-block"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <Reviews vehicleId={id} />
      </div>
    </div>
  );
};

export default VehicleDetailPage;