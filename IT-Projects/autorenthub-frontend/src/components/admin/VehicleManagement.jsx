import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../common/LoadingSpinner';
import Modal from '../common/Modal';
import { toast } from 'react-toastify';

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicleImages, setVehicleImages] = useState([]);
  const [formData, setFormData] = useState({
    model: '',
    brand: '',
    year: '',
    vehicleType: 'car',
    fuelType: 'petrol',
    transmission: 'manual',
    seatingCapacity: '',
    color: '',
    plateNumber: '',
    vehicleDescription: '',
    features: '', 
    pricePerDay: '',
    pricePerHour: '',
    mileage: '',
    location: {
      address: '',
      city: '',
      latitude: '',
      longitude: ''
    }
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllVehicles();
      setVehicles(response.data);
    } catch (error) {
      toast.error('Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSubmit = new FormData();

    // Append all form fields, handling empty number fields
    for (const key in formData) {
      if (key === 'location') {
        dataToSubmit.append('location[address]', formData.location.address);
        dataToSubmit.append('location[city]', formData.location.city);
        if (formData.location.latitude) dataToSubmit.append('location[coordinates][latitude]', formData.location.latitude);
        if (formData.location.longitude) dataToSubmit.append('location[coordinates][longitude]', formData.location.longitude);
      } else if (key === 'features') {
        const featuresArray = formData.features.split(',').map(item => item.trim()).filter(item => item);
        featuresArray.forEach((feature, index) => {
          dataToSubmit.append(`features[${index}]`, feature);
        });
      } else if (key === 'seatingCapacity' || key === 'mileage') {
        if (formData[key]) { // Only append if the field is not empty
          dataToSubmit.append(key, formData[key]);
        }
      } else {
        dataToSubmit.append(key, formData[key]);
      }
    }

    if (vehicleImages.length > 0) {
      for (let i = 0; i < vehicleImages.length; i++) {
        dataToSubmit.append('images', vehicleImages[i]);
      }
    }

    try {
      if (selectedVehicle) {
        await adminService.updateVehicle(selectedVehicle._id, dataToSubmit);
        toast.success('Vehicle updated successfully');
      } else {
        await adminService.createVehicle(dataToSubmit);
        toast.success('Vehicle created successfully');
      }
      setShowAddModal(false);
      setSelectedVehicle(null);
      resetForm();
      fetchVehicles();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to save vehicle';
      toast.error(errorMessage);
      console.error("Save vehicle error:", error.response?.data || error);
    }
  };

  const handleEdit = (vehicle) => {
    setSelectedVehicle(vehicle);
    setFormData({
      model: vehicle.model,
      brand: vehicle.brand,
      year: vehicle.year,
      vehicleType: vehicle.vehicleType,
      fuelType: vehicle.fuelType,
      transmission: vehicle.transmission,
      seatingCapacity: vehicle.seatingCapacity || '',
      color: vehicle.color || '',
      plateNumber: vehicle.plateNumber,
      vehicleDescription: vehicle.vehicleDescription || '',
      features: vehicle.features ? vehicle.features.join(', ') : '',
      pricePerDay: vehicle.pricePerDay,
      pricePerHour: vehicle.pricePerHour,
      mileage: vehicle.mileage || '',
      location: {
        address: vehicle.location?.address || '',
        city: vehicle.location?.city || '',
        latitude: vehicle.location?.coordinates?.latitude || '',
        longitude: vehicle.location?.coordinates?.longitude || ''
      }
    });
    setShowAddModal(true);
  };

  const handleDelete = async (vehicleId) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await adminService.deleteVehicle(vehicleId);
        toast.success('Vehicle deleted successfully');
        fetchVehicles();
      } catch (error) {
        toast.error('Failed to delete vehicle');
      }
    }
  };

  const handleStatusUpdate = async (vehicleId, status) => {
    try {
      await adminService.updateVehicleStatus(vehicleId, status);
      toast.success('Vehicle status updated successfully');
      fetchVehicles();
    } catch (error) {
      toast.error('Failed to update vehicle status');
    }
  };

  const resetForm = () => {
    setVehicleImages([]);
    setFormData({
      model: '',
      brand: '',
      year: '',
      vehicleType: 'car',
      fuelType: 'petrol',
      transmission: 'manual',
      seatingCapacity: '',
      color: '',
      plateNumber: '',
      vehicleDescription: '',
      features: '',
      pricePerDay: '',
      pricePerHour: '',
      mileage: '',
      location: {
        address: '',
        city: '',
        latitude: '',
        longitude: ''
      }
    });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vehicle Management</h1>
            <p className="text-gray-600">Manage your fleet of vehicles</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setSelectedVehicle(null);
              setShowAddModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add New Vehicle
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div key={vehicle._id} className="bg-white rounded-lg shadow overflow-hidden">
              <img 
                src={vehicle.images?.[0]?.url || 'https://via.placeholder.com/400x300'} 
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {vehicle.brand} {vehicle.model}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    vehicle.vehicleStatus === 'available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {vehicle.vehicleStatus}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-gray-600"><span className="font-medium">Plate:</span> {vehicle.plateNumber}</p>
                  <p className="text-gray-600"><span className="font-medium">Price:</span> ${vehicle.pricePerDay}/day</p>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => handleEdit(vehicle)} className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700">Edit</button>
                  <select value={vehicle.vehicleStatus} onChange={(e) => handleStatusUpdate(vehicle._id, e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm">
                    <option value="available">Available</option>
                    <option value="booked">Booked</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="out_of_service">Out of Service</option>
                  </select>
                  <button onClick={() => handleDelete(vehicle._id)} className="px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Modal isOpen={showAddModal} onClose={() => { setShowAddModal(false); setSelectedVehicle(null); resetForm(); }} title={selectedVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Form fields */}
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Brand</label><input type="text" name="brand" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Model</label><input type="text" name="model" value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Year</label><input type="number" name="year" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label><select name="vehicleType" value={formData.vehicleType} onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md"><option value="car">Car</option><option value="bike">Bike</option><option value="scooter">Scooter</option></select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label><select name="fuelType" value={formData.fuelType} onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md"><option value="petrol">Petrol</option><option value="diesel">Diesel</option><option value="electric">Electric</option><option value="hybrid">Hybrid</option></select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label><select name="transmission" value={formData.transmission} onChange={(e) => setFormData({ ...formData, transmission: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md"><option value="manual">Manual</option><option value="automatic">Automatic</option></select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Plate Number</label><input type="text" name="plateNumber" value={formData.plateNumber} onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" required /></div>
              {formData.vehicleType === 'car' && (<div><label className="block text-sm font-medium text-gray-700 mb-1">Seating Capacity</label><input type="number" name="seatingCapacity" value={formData.seatingCapacity} onChange={(e) => setFormData({ ...formData, seatingCapacity: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" required /></div>)}
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Color</label><input type="text" name="color" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Price per Day</label><input type="number" name="pricePerDay" value={formData.pricePerDay} onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Price per Hour</label><input type="number" name="pricePerHour" value={formData.pricePerHour} onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Mileage</label><input type="number" name="mileage" value={formData.mileage} onChange={(e) => setFormData({ ...formData, mileage: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">City</label><input type="text" name="city" value={formData.location.city} onChange={(e) => setFormData({ ...formData, location: { ...formData.location, city: e.target.value } })} className="w-full px-3 py-2 border border-gray-300 rounded-md" /></div>
              <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Address</label><input type="text" name="address" value={formData.location.address} onChange={(e) => setFormData({ ...formData, location: { ...formData.location, address: e.target.value } })} className="w-full px-3 py-2 border border-gray-300 rounded-md" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label><input type="number" step="any" name="latitude" value={formData.location.latitude} onChange={(e) => setFormData({ ...formData, location: { ...formData.location, latitude: e.target.value } })} className="w-full px-3 py-2 border border-gray-300 rounded-md" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label><input type="number" step="any" name="longitude" value={formData.location.longitude} onChange={(e) => setFormData({ ...formData, location: { ...formData.location, longitude: e.target.value } })} className="w-full px-3 py-2 border border-gray-300 rounded-md" /></div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Features (comma-separated)</label>
              <input type="text" name="features" value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., GPS, Sunroof, Bluetooth" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Images</label>
              <input type="file" name="images" multiple onChange={(e) => setVehicleImages(Array.from(e.target.files))} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="vehicleDescription" value={formData.vehicleDescription} onChange={(e) => setFormData({ ...formData, vehicleDescription: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={() => { setShowAddModal(false); setSelectedVehicle(null); resetForm(); }} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{selectedVehicle ? 'Update Vehicle' : 'Add Vehicle'}</button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default VehicleManagement;