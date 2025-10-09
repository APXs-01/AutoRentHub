// src/context/AuthContext.js

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';
import { useLocalStorage } from '../hooks/useLocalStorage'; // Assuming this hook exists

const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
  loading: true, // Start true, as we need to check localStorage
  error: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: null
      };
    case 'UPDATE_USER':
      // Ensure local storage is updated by the caller (or service) before this
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [storedToken, setStoredToken, removeStoredToken] = useLocalStorage('autorenthub_token', null);
const [storedUser, setStoredUser, removeStoredUser] = useLocalStorage('autorenthub_user', null);

  // Initialize auth state from localStorage and validate token
  useEffect(() => {
  let isMounted = true;

  const initializeAuth = async () => {
    console.log('%c[Auth] 1. Initializing auth...', 'color: blue;');

    if (storedToken && storedUser) {
      console.log('%c[Auth] 2. Found token in storage. Validating...', 'color: green;', storedToken);
      authService.setAuthToken(storedToken);
      
      try {
        const response = await authService.getCurrentUser();
        console.log('%c[Auth] 3. Token validation SUCCESS.', 'color: green;', response);
        
        if (isMounted) {
          dispatch({
            type: 'LOGIN_SUCCESS',
            // INSIDE THE 'try' BLOCK of your useEffect

// This is the correct line
payload: { user: response.data.user, token: storedToken }
          });
        }
      } catch (error) {
        // THIS IS THE MOST LIKELY PLACE THE ERROR IS HAPPENING
        console.error('%c[Auth] 3. Token validation FAILED.', 'color: red;', error.response || error);
        
        if (isMounted) {
          authService.logout();
          dispatch({ type: 'LOGOUT' });
        }
      }
    } else {
      console.log('%c[Auth] 2. No token found. Setting loading to false.', 'color: orange;');
      if (isMounted) {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }
  };

  initializeAuth();

  return () => {
    isMounted = false;
  };
}, [storedToken, storedUser]);

  const login = async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      // 🔑 Call the service, which returns the data object { user, token }
      const response = await authService.login({ email, password });
      
      // 🔑 Correctly destructure user and token from the returned data object
      const { user, token } = response; 

      // Store in localStorage (handled by service in the past, but ensuring it here)
      setStoredToken(token);
      setStoredUser(user);

      // Set token for future API calls
      authService.setAuthToken(token);

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token }
      });

      // 🔑 CRITICAL FIX: Return the user object for the component to use for role-based navigation
      return user; 
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const response = await authService.register(userData);
      const { user, token } = response; // Assuming register returns { data: { user, token } }

      setStoredToken(token);
      setStoredUser(user);

      authService.setAuthToken(token);

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token }
      });

      return user; 
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const logout = () => {
    // Clear localStorage
    removeStoredToken();
    removeStoredUser();

    // Clear auth token from API calls
    authService.clearAuthToken();

    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (userData) => {
    // Assuming authService handles the API update and localStorage update
    setStoredUser({ ...storedUser, ...userData });
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext };