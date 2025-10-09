import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import DateTimePicker from './DateTimePicker';
import {bookingService} from '../../services/bookingService';
import { vehicleService } from '../../services/vehicleService'
import LoadingSpinner from '../common/LoadingSpinner';
import Button from '../common/Button';

const BookingForm = ({ vehicleId, onBookingSuccess, onCancel }) => {
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      rentalType: 'daily',
    }
  });

  const rentalType = watch('rentalType', 'daily');

  // --- RHF SYNC FIX ---
  useEffect(() => {
    // Sync local Date state (from DatePicker) with react-hook-form state for validation/submission
    if (startDate) {
      setValue('startDate', startDate, { shouldValidate: true, shouldDirty: true });
    } else {
      setValue('startDate', null, { shouldValidate: true, shouldDirty: true });
    }

    if (endDate) {
      setValue('endDate', endDate, { shouldValidate: true, shouldDirty: true });
    } else {
      setValue('endDate', null, { shouldValidate: true, shouldDirty: true });
    }
  }, [startDate, endDate, setValue]); 
  // --- END RHF SYNC FIX ---


  useEffect(() => {
    if (vehicleId) {
      fetchVehicleDetails();
    }
  }, [vehicleId]);

  useEffect(() => {
    if (startDate && endDate && vehicle) {
      calculateTotal();
      checkAvailability();
    }
    if (!startDate || !endDate) {
        setAvailability(null);
        setTotalAmount(0);
    }
  }, [startDate, endDate, rentalType, vehicle]);

  const fetchVehicleDetails = async () => {
    try {
      setLoading(true);
      const response = await vehicleService.getVehicle(vehicleId);
      setVehicle(response.data.vehicle);
    } catch (error) {
      toast.error('Failed to fetch vehicle details');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!startDate || !endDate || !vehicle) return;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();

    if (diffTime <= 0) {
        setTotalAmount(0);
        return;
    }

    let duration, rate, total;

    if (rentalType === 'hourly') {
      duration = Math.ceil(diffTime / (1000 * 60 * 60)); 
      rate = vehicle.pricePerHour;
      total = duration * rate;
    } else { // daily
      duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      rate = vehicle.pricePerDay;
      total = duration * rate;
    }

    setTotalAmount(total);
  };

  const checkAvailability = async () => {
    if (!startDate || !endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      setAvailability(null);
      return;
    }
    
    try {
      const response = await bookingService.checkAvailability(
        vehicleId,
        startDate.toISOString(),
        endDate.toISOString()
      );
      setAvailability(response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to check availability';
      toast.error(errorMessage);
      setAvailability({ available: false }); 
    }
  };

  const onSubmit = async (data) => {
    if (!data.startDate || !data.endDate) {
        toast.error('Please select valid pickup and return dates/times.');
        return;
    }
    
    if (!availability?.available) {
      toast.error('Vehicle is not available for the selected dates');
      return;
    }
    
    if (totalAmount <= 0) {
        toast.error('Total amount must be greater than zero.');
        return;
    }

    try {
      setLoading(true);
      const bookingData = {
        vehicleId,
        startDate: data.startDate.toISOString(), 
        endDate: data.endDate.toISOString(),
        pickupLocation: data.pickupLocation,
        returnLocation: data.returnLocation,
        rentalType,
        notes: data.notes
      };

      const response = await bookingService.createBooking(bookingData);
      toast.success('Booking created successfully!');
      onBookingSuccess(response.data.booking); 
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create booking';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !vehicle) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-8">
        Book Vehicle
      </h2>
      
      {vehicle && (
        <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
          <h3 className="font-bold text-xl text-gray-900 mb-2">
            {vehicle.brand} {vehicle.model} ({vehicle.year})
          </h3>
          <p className="text-gray-600 mb-3 flex items-center gap-2">
            <span className="font-medium">{vehicle.vehicleType}</span>
            <span className="text-gray-400">•</span>
            <span className="font-medium">{vehicle.fuelType}</span>
            <span className="text-gray-400">•</span>
            <span className="font-medium">{vehicle.transmission}</span>
          </p>
          <div className="flex items-center gap-4">
            <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              ${vehicle.pricePerDay}/day
            </p>
            <span className="text-gray-400">•</span>
            <p className="text-lg font-semibold text-gray-600">
              ${vehicle.pricePerHour}/hour
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Rental Type */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">
            Rental Type
          </label>
          <div className="flex gap-4">
            <label className="flex-1 relative">
              <input
                type="radio"
                value="daily"
                {...register('rentalType')}
                className="peer sr-only"
              />
              <div className="flex items-center justify-center px-6 py-4 border-2 border-gray-200 rounded-xl cursor-pointer transition-all duration-300 peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:shadow-md hover:border-gray-300">
                <span className="font-semibold text-gray-700 peer-checked:text-blue-600">
                  📅 Daily Rental
                </span>
              </div>
            </label>
            <label className="flex-1 relative">
              <input
                type="radio"
                value="hourly"
                {...register('rentalType')}
                className="peer sr-only"
              />
              <div className="flex items-center justify-center px-6 py-4 border-2 border-gray-200 rounded-xl cursor-pointer transition-all duration-300 peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:shadow-md hover:border-gray-300">
                <span className="font-semibold text-gray-700 peer-checked:text-blue-600">
                  ⏰ Hourly Rental 
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Date and Time Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Pickup Date & Time */}
          <div>
            <DateTimePicker
              label="Pickup Date & Time"
              selected={startDate}
              onChange={setStartDate}
              minDate={new Date()}
              showTimeSelect={true}
              placeholderText="Select pickup date and time"
              error={errors.startDate?.message} 
            />
            <input 
              type="hidden"
              {...register('startDate', {
                required: 'Pickup date and time is required',
              })}
            />
          </div>
          
          {/* Return Date & Time */}
          <div>
            <DateTimePicker
              label="Return Date & Time"
              selected={endDate}
              onChange={setEndDate}
              minDate={startDate || new Date()}
              showTimeSelect={true}
              placeholderText="Select return date and time"
              error={errors.endDate?.message}
            />
            <input 
              type="hidden"
              {...register('endDate', {
                required: 'Return date and time is required',
                validate: value => 
                  !startDate || new Date(value) > new Date(startDate) || 'Return date must be after pickup date',
              })}
            />
          </div>
        </div>

        {/* Availability Status */}
        {availability && (
          <div className={`p-4 rounded-xl font-semibold flex items-center gap-3 ${
            availability.available 
              ? 'bg-green-50 text-green-700 border-2 border-green-200' 
              : 'bg-red-50 text-red-700 border-2 border-red-200'
          }`}>
            <span className="text-2xl">
              {availability.available ? '✓' : '✕'}
            </span>
            <span>
              {availability.available 
                ? 'Vehicle is available for the selected dates'
                : 'Vehicle is not available for the selected dates'
              }
            </span>
          </div>
        )}

        {/* Locations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              📍 Pickup Location
            </label>
            <input
              type="text"
              {...register('pickupLocation', { 
                required: 'Pickup location is required' 
              })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white font-medium"
              placeholder="Enter pickup location"
            />
            {errors.pickupLocation && (
              <p className="mt-2 text-sm text-red-600 font-medium">
                {errors.pickupLocation.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              📍 Return Location
            </label>
            <input
              type="text"
              {...register('returnLocation', { 
                required: 'Return location is required' 
              })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white font-medium"
              placeholder="Enter return location"
            />
            {errors.returnLocation && (
              <p className="mt-2 text-sm text-red-600 font-medium">
                {errors.returnLocation.message}
              </p>
            )}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            📝 Additional Notes (Optional)
          </label>
          <textarea
            {...register('notes')}
            rows={4}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white font-medium resize-none"
            placeholder="Any special requirements or notes..."
          />
        </div>

        {/* Total Amount */}
        {totalAmount > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border-2 border-blue-200 shadow-md">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-700">Total Amount:</span>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            disabled={loading || !availability?.available || !startDate || !endDate}
            className="flex-1"
            loading={loading}
          >
            Book Now
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;