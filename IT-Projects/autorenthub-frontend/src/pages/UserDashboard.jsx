import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../components/user/Dashboard';
// ✅ CORRECTED PATH: Changed 'components-user' to 'components/user'
import Profile from '../components/user/Profile'; 
import MyBookings from './MyBookings';
import Navbar from '../components/common/Navbar';

const UserDashboard = () => {
  return ( 
    <div className="min-h-screen bg-gray-50 flex flex-col"> 
      <Navbar />

      <main className="flex-1 p-6">
        <Routes> 
          <Route index element={<Dashboard />} /> 
          <Route path="profile" element={<Profile />} /> 
          <Route path="bookings" element={<MyBookings />} /> 
          <Route path="reviews" element={<div>My Reviews Component</div>} /> 
        </Routes> 
      </main>
    </div> 
  ); 
}; 

export default UserDashboard;