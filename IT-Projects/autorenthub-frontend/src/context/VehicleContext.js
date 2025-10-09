import React, { createContext, useContext, useReducer } from 'react';

const VehicleContext = createContext();

const initialState = {
  vehicles: [],
  currentVehicle: null,
  loading: false,
  error: null,
  filters: {
    vehicleType: 'all',
    fuelType: 'all',
    transmission: 'all',
    minPrice: '',
    maxPrice: '',
    search: '',
    page: 1,
    limit: 12
  },
  pagination: {
    page: 1,
    totalPages: 1,
    total: 0,
    hasNextPage: false,
    hasPrevPage: false
  }
};

const vehicleReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_VEHICLES':
      return { 
        ...state, 
        vehicles: action.payload.data, 
        pagination: action.payload.pagination,
        loading: false, 
        error: null 
      };
    case 'SET_CURRENT_VEHICLE':
      return { ...state, currentVehicle: action.payload };
    case 'ADD_VEHICLE':
      return { ...state, vehicles: [action.payload, ...state.vehicles] };
    case 'UPDATE_VEHICLE':
      return {
        ...state,
        vehicles: state.vehicles.map(vehicle =>
          vehicle._id === action.payload._id ? action.payload : vehicle
        ),
        currentVehicle: state.currentVehicle?._id === action.payload._id ? action.payload : state.currentVehicle
      };
    case 'DELETE_VEHICLE':
      return {
        ...state,
        vehicles: state.vehicles.filter(vehicle => vehicle._id !== action.payload)
      };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'CLEAR_FILTERS':
      return { ...state, filters: initialState.filters };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const VehicleProvider = ({ children }) => {
  const [state, dispatch] = useReducer(vehicleReducer, initialState);

  const setLoading = (loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const setVehicles = (data) => {
    dispatch({ type: 'SET_VEHICLES', payload: data });
  };

  const setCurrentVehicle = (vehicle) => {
    dispatch({ type: 'SET_CURRENT_VEHICLE', payload: vehicle });
  };

  const addVehicle = (vehicle) => {
    dispatch({ type: 'ADD_VEHICLE', payload: vehicle });
  };

  const updateVehicle = (vehicle) => {
    dispatch({ type: 'UPDATE_VEHICLE', payload: vehicle });
  };

  const deleteVehicle = (vehicleId) => {
    dispatch({ type: 'DELETE_VEHICLE', payload: vehicleId });
  };

  const setFilters = (filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const clearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    setLoading,
    setError,
    setVehicles,
    setCurrentVehicle,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    setFilters,
    clearFilters,
    clearError
  };

  return (
    <VehicleContext.Provider value={value}>
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicle = () => {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error('useVehicle must be used within a VehicleProvider');
  }
  return context;
};
