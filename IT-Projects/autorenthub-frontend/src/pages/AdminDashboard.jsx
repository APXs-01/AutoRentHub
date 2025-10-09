import React, { useState } from 'react';
// ✅ Get both user and logout from the useAuth hook
import { useAuth } from '../hooks/useAuth'; 
import AdminDashboard from '../components/admin/AdminDashboard';
import UserManagement from '../components/admin/UserManagement';
import VehicleManagement from '../components/admin/VehicleManagement';
import BookingManagement from '../components/admin/BookingManagement';

const AdminDashboardPage = () => {
  // ✅ Destructure user and logout here
  const { user, logout } = useAuth(); 
  const [activeTab, setActiveTab] = useState('dashboard');

  if (user?.userType !== 'admin' && user?.userType !== 'staff') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'users', name: 'Users', icon: '👥' },
    { id: 'vehicles', name: 'Vehicles', icon: '🚗' },
    { id: 'bookings', name: 'Bookings', icon: '📋' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'users':
        return <UserManagement />;
      case 'vehicles':
        return <VehicleManagement />;
      case 'bookings':
        return <BookingManagement />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ✅ START: New Header Section */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-20">
        <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600 text-sm">
            Welcome, <span className="font-semibold text-blue-600">{user?.name || 'Admin'}</span>
          </span>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md text-sm transition-colors"
          >
            Logout
          </button>
        </div>
      </header>
      {/* ✅ END: New Header Section */}

      {/* Navigation Tabs */}
      <div className="bg-white shadow sticky top-[73px] z-10"> {/* Adjusted sticky position */}
        <div className="max-w-7xl mx-auto">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboardPage;