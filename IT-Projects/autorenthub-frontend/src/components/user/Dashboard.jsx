import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth'; // KEEP THIS ONE
import { userService } from '../../services/userService';
import { complaintService } from '../../services/complaintService';
import LoadingSpinner from '../common/LoadingSpinner';
import BookingCard from '../booking/BookingCard';
// REMOVED THE DUPLICATE: import { useAuth } from '../../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [myComplaints, setMyComplaints] = useState([]);
  const [complaintsLoading, setComplaintsLoading] = useState(false);

  useEffect(() => {
    // NOTE: You should include 'fetchDashboardData' in the dependency array
    // to satisfy the linter, but for simple fetch logic, it's often omitted.
    // However, the cleanest fix is to wrap it:
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchDashboardData(); 
    fetchMyComplaints();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await userService.getDashboardStats();
      setDashboardData(response.data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyComplaints = async () => {
    try {
      setComplaintsLoading(true);
      const res = await complaintService.myComplaints();
      setMyComplaints(res.data || []);
    } catch (e) {
      // Do not block dashboard; show empty if failed
      setMyComplaints([]);
    } finally {
      setComplaintsLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchDashboardData}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const { stats, recentBookings } = dashboardData || {};

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600 mt-2">Here's an overview of your rental activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-semibold text-gray-900">{stats?.totalBookings || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">{stats?.bookings?.completed || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-semibold text-gray-900">{stats?.bookings?.active || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-semibold text-gray-900">${stats?.totalSpent || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Bookings</h2>
        </div>
        <div className="p-6">
          {recentBookings && recentBookings.length > 0 ? (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <BookingCard key={booking._id} booking={booking} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No bookings yet</p>
              <a href="/vehicles" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                Browse Vehicles
              </a>
            </div>
          )}
        </div>
      </div>

      {/* My Complaints */}
      <div className="bg-white rounded-lg shadow mt-8">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">My Complaints</h2>
          {!complaintsLoading && (
            <span className="text-sm text-gray-500">{myComplaints.length} total</span>
          )}
        </div>
        <div className="p-6">
          {complaintsLoading ? (
            <div className="text-gray-500">Loading...</div>
          ) : myComplaints.length === 0 ? (
            <div className="text-gray-500">You have not submitted any complaints yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-3 py-2 border-b">Date</th>
                    <th className="text-left px-3 py-2 border-b">Booking</th>
                    <th className="text-left px-3 py-2 border-b">Subject</th>
                    <th className="text-left px-3 py-2 border-b">Status</th>
                    <th className="text-left px-3 py-2 border-b">Admin Response</th>
                  </tr>
                </thead>
                <tbody>
                  {myComplaints.map(c => (
                    <tr key={c._id} className="border-b">
                      <td className="px-3 py-2">{new Date(c.createdAt).toLocaleString()}</td>
                      <td className="px-3 py-2">{c.booking?.bookingId || '-'}</td>
                      <td className="px-3 py-2">
                        <div className="font-medium text-gray-900">{c.subject}</div>
                        <div className="text-gray-600 text-xs">{c.message}</div>
                      </td>
                      <td className="px-3 py-2 capitalize">{(c.status || '').replace('_',' ')}</td>
                      <td className="px-3 py-2 text-gray-700">
                        {c.adminResponse ? (
                          <>
                            <div>{c.adminResponse}</div>
                            {c.respondedAt && (
                              <div className="text-xs text-gray-500 mt-1">{new Date(c.respondedAt).toLocaleString()}</div>
                            )}
                          </>
                        ) : (
                          <span className="text-gray-400">No response yet</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;