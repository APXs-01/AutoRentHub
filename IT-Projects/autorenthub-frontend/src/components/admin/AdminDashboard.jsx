import React, { useState, useEffect, useRef } from 'react';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../common/LoadingSpinner';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import ComplaintsManagement from './ComplaintsManagement';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Import SweetAlert2
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Initialize Swal
const MySwal = withReactContent(Swal);

// Utility function to format date
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // STATE: Filter for the Recent Bookings table in the PDF report section
  const [recentBookingStatusFilter, setRecentBookingStatusFilter] = useState('all');

  // Ref for the Monthly Revenue Chart container and report section
  const revenueChartRef = useRef(null);
  const reportSectionRef = useRef(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(''); // Clear previous errors

      // Assume adminService.getDashboardStats() fetches the data
      const response = await adminService.getDashboardStats();
      
      // Normalize payload whether API returns { success, data } or plain object
      const payload = response?.data ?? response;
      
      // Set the fetched data. 
      setDashboardData(payload);

    } catch (err) {
      setError('Failed to fetch dashboard data. Please check the network connection and server.');
      console.error('Dashboard error:', err);
      // Ensure dashboardData is cleared in case of an error to prevent showing stale data
      setDashboardData(null); 
    } finally {
      setLoading(false);
    }
  };

  // Handler for PDF download with Report structure
  const handleDownloadPdf = () => {
    // Prevent download if no data is loaded
    if (!dashboardData) {
        MySwal.fire('Info', 'Cannot generate report. Dashboard data is not yet loaded.', 'info');
        return;
    }
      
    MySwal.fire({
      title: 'Download Report? 📥',
      text: "Do you want to download the Admin Dashboard Summary Report (including filtered Recent Bookings) as a PDF?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, download it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const input = reportSectionRef.current;
        if (!input) {
            MySwal.fire('Error', 'Report element not found for download.', 'error');
            return;
        }

        html2canvas(input, { 
            scale: 2,
            backgroundColor: '#ffffff' 
        })
        .then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth(); 
            const pdfHeight = pdf.internal.pageSize.getHeight(); 
            
            const margin = 15; 
            const contentMaxWidth = pdfWidth - (2 * margin); 
            
            const imgHeight = (canvas.height * contentMaxWidth) / canvas.width;
            
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', margin, position, contentMaxWidth, imgHeight);
            heightLeft -= pdfHeight;

            while (heightLeft > 0) {
              position = heightLeft - imgHeight;
              pdf.addPage();
              pdf.addImage(imgData, 'PNG', margin, position, contentMaxWidth, imgHeight);
              heightLeft -= pdfHeight;
            }

            pdf.save('admin-dashboard-report.pdf');
            
            MySwal.fire(
              'Downloaded! 🎉',
              'Your dashboard report has been successfully downloaded.',
              'success'
            )
        })
        .catch(error => {
            console.error('PDF Download Error:', error);
            MySwal.fire('Error', 'Could not generate PDF report.', 'error');
        });
      }
    });
  };
  
  // Filter the recent bookings based on the status filter state
  const getFilteredRecentBookings = (bookings) => {
    if (!bookings) return [];
    if (recentBookingStatusFilter === 'all') {
      return bookings.slice(0, 10); // Show top 10 for report simplicity
    }
    // Filter logic updated to include 'confirmed' and 'cancelled'
    return bookings.filter(b => b.bookingStatus === recentBookingStatusFilter).slice(0, 10);
  };
  
  if (loading) return <LoadingSpinner />;
  
  if (error && !dashboardData) return <div className="text-red-500 text-center p-4">{error || 'No data available'}</div>;

  const { stats, recentBookings } = dashboardData || {};
  
  if (!dashboardData || !stats) return <div className="text-gray-500 text-center p-8 border-2 border-dashed border-gray-300 m-6 rounded-lg">No dashboard statistics available. Check API endpoint.</div>;
  
  // Get filtered list for the PDF section
  const filteredBookingsForReport = getFilteredRecentBookings(recentBookings);

  // --- Chart configurations (unchanged) ---
  const revenueChartData = {
    labels: stats?.monthlyRevenue?.map(item => `${item._id.month}/${item._id.year}`) || [],
    datasets: [
      {
        label: 'Monthly Revenue',
        data: stats?.monthlyRevenue?.map(item => item.revenue) || [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      }
    ]
  };

  const userStatsData = {
    labels: ['Customers', 'Staff', 'Admins'],
    datasets: [
      {
        data: [
          stats?.users?.customer || 0,
          stats?.users?.staff || 0,
          stats?.users?.admin || 0
        ],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      }
    ]
  };

  const vehicleStatsData = {
    labels: ['Available', 'Booked', 'Maintenance', 'Out of Service'],
    datasets: [
      {
        data: [
          stats?.vehicles?.available || 0,
          stats?.vehicles?.booked || 0,
          stats?.vehicles?.maintenance || 0,
          stats?.vehicles?.out_of_service || 0
        ],
        backgroundColor: ['#4CAF50', '#FF9800', '#F44336', '#9E9E9E']
      }
    ]
  };

  // --- JSX Rendering ---
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of Auto Rent Hub system</p>
        </div>

        {/* Stats Cards (unchanged) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Total Users</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {(stats.users?.customer || 0) + (stats.users?.staff || 0) + (stats.users?.admin || 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Total Vehicles</h3>
                <p className="text-2xl font-bold text-green-600">
                  {Object.values(stats.vehicles || {}).reduce((sum, count) => sum + count, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-full">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Total Bookings</h3>
                <p className="text-2xl font-bold text-yellow-600">
                  {Object.values(stats.bookings || {}).reduce((sum, booking) => sum + (booking.count || 0), 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Total Revenue</h3>
                <p className="text-2xl font-bold text-purple-600">
                  ${stats.payments?.totalRevenue?.toFixed(2) || '0.00'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Monthly Revenue Report</h3>
              <button
                onClick={handleDownloadPdf}
                className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center space-x-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                <span>Download PDF</span>
              </button>
            </div>
            
            {/* START: Report Section for PDF Capture */}
            <div ref={reportSectionRef} className="bg-white p-4">
              
              {/* Report Header */}
              <div className="mb-6 pb-4 border-b-2 border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin Dashboard Summary Report</h2>
                <p className="text-sm text-gray-600">Date Generated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="text-sm text-gray-600">Source: Auto Rent Hub Dashboard Data</p>
              </div>
              
              {/* Monthly Revenue Chart */}
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Monthly Revenue Trend</h3>
              <div ref={revenueChartRef} className="mb-6">
                <Line data={revenueChartData} />
              </div>
              <p className="text-xs italic text-gray-500 mb-6">This chart illustrates the total monthly revenue over the last few periods.</p>

              {/* START: Recent Bookings Table (Updated with Date and Filter) */}
              <div className="mt-6 page-break-before">
                
                {/* Filter and Title */}
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-semibold text-gray-800">Recent Booking Summary</h3>
                    <div className="flex items-center space-x-2">
                        <label className="text-sm text-gray-700">Filter by Status:</label>
                        <select
                            value={recentBookingStatusFilter}
                            onChange={(e) => setRecentBookingStatusFilter(e.target.value)}
                            className="p-1 border border-gray-300 rounded-md text-sm"
                        >
                            <option value="all">All</option>
                            <option value="confirmed">Confirmed</option> {/* Updated filter option */}
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option> {/* Added filter option */}
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-300">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">ID</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">Date</th> 
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">Customer</th>
                        <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700 border-b">Amount</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {/* Use filteredBookingsForReport which respects the status filter */}
                      {filteredBookingsForReport.length > 0 ? (
                        filteredBookingsForReport.map((booking) => (
                          // Note: Assuming 'startDate' is the relevant booking date field
                          <tr key={booking._id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 text-sm text-gray-700 border-b">{booking.bookingId}</td>
                            <td className="px-4 py-2 text-sm text-gray-700 border-b">{formatDate(booking.startDate || booking.bookingDate)}</td>
                            <td className="px-4 py-2 text-sm text-gray-700 border-b">{booking.userId?.name || 'N/A'}</td>
                            <td className="px-4 py-2 text-sm font-medium text-gray-900 border-b text-right">${booking.totalAmount.toFixed(2)}</td>
                            <td className="px-4 py-2 text-sm text-gray-700 border-b">
                              <span className={`inline-flex px-2 py-1 text-xs rounded-full capitalize ${
                                // Styling updated to match new statuses
                                booking.bookingStatus === 'completed' ? 'bg-green-100 text-green-800' :
                                booking.bookingStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                booking.bookingStatus === 'confirmed' ? 'bg-blue-100 text-blue-800' : // 'confirmed'
                                booking.bookingStatus === 'cancelled' ? 'bg-red-100 text-red-800' : // 'cancelled'
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {booking.bookingStatus}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                            <td colSpan="5" className="px-4 py-4 text-center text-sm text-gray-500 border-b">No recent bookings matching the filter status.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* END: Recent Bookings Table */}

            </div>
            {/* END: Report Section for PDF Capture */}

          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">User Distribution</h3>
            <Doughnut data={userStatsData} />
          </div>
        </div>

        {/* Complaints Management */}
        <div className="mb-8">
          <ComplaintsManagement />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Vehicle Status</h3>
            <Bar data={vehicleStatsData} />
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Bookings (Dashboard View)</h3>
            <div className="space-y-3">
              {/* Dashboard view remains unfiltered for simplicity, but styles updated */}
              {recentBookings?.slice(0, 5).map((booking) => (
                <div key={booking._id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{booking.bookingId}</p>
                    <p className="text-sm text-gray-600">{booking.userId?.name || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${booking.totalAmount.toFixed(2)}</p>
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full capitalize ${
                      booking.bookingStatus === 'completed' ? 'bg-green-100 text-green-800' :
                      booking.bookingStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      // Updated status mapping for dashboard view
                      booking.bookingStatus === 'confirmed' ? 'bg-blue-100 text-blue-800' : 
                      booking.bookingStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.bookingStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;