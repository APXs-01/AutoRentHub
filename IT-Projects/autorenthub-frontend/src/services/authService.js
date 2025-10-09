// src/services/authService.js

import api from './api'; // Assuming 'api' is your Axios instance

class AuthService {
  // Set auth token in axios headers and localStorage
  setAuthToken(token) {
    if (token) {
        localStorage.setItem('autorenthub_token', token);
        // 🔑 MUST BE IMMEDIATELY SET ON THE AXIOS INSTANCE:
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`; 
    } else {
      localStorage.removeItem('autorenthub_token');
      delete api.defaults.headers.common['Authorization'];
    }
  }

  // 🔑 NEW: Explicitly clear token from headers
  clearAuthToken() {
    delete api.defaults.headers.common['Authorization'];
  }

  // Get stored token
  getToken() {
    return localStorage.getItem('autorenthub_token');
  }

  // Get stored user
  getUser() {
    const user = localStorage.getItem('autorenthub_user');
    return user ? JSON.parse(user) : null;
  }

  // Store user data
  setUser(userData) {
    localStorage.setItem('autorenthub_user', JSON.stringify(userData));
  }

  // Login
  async login({ email, password }) {
    try { // <-- Added missing 'try' block
      const response = await api.post('/auth/login', { email, password });
      
      // Assuming response.data is { success: true, data: { user, token } }
      const { data } = response.data;
      
      // 1. Ensure user and token are destructured from the 'data' object
      const { user, token } = data;
      
      // 2. Set the token and user data immediately
      this.setAuthToken(token);
      this.setUser(user);
      
      // 3. Return the data object to AuthContext
      return data; 
      
    } catch (error) { // <-- Added 'catch' block
      throw error;
    }
  }
  
  // Register
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      const { data } = response.data;
      
      if (data.token) {
        this.setAuthToken(data.token);
        this.setUser(data.user);
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Logout
  logout() {
    this.setAuthToken(null);
    localStorage.removeItem('autorenthub_user');
    window.location.href = '/login';
  }

  // Get current user profile
  async getCurrentUser() {
    try {
      // 🔑 This is the token validation endpoint
      const response = await api.get('/auth/profile');
      // Assuming this endpoint returns a response body like { success: true, user: {...} }
      return response.data; 
    } catch (error) {
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  }

  isAdmin() {
    const user = this.getUser();
    return user && user.userType === 'admin';
  }

  isStaff() {
    const user = this.getUser();
    return user && (user.userType === 'staff' || user.userType === 'admin');
  }
}

export const authService = new AuthService();
export default authService;