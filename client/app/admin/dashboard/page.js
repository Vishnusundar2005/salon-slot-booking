'use client';
import { useState, useEffect } from 'react';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import { formatDate, formatTime } from '../../../utils/dateFormatter';
import { Calendar, Users, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [todayBookings, setTodayBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch today's bookings
      const { data: bookings } = await api.get('/bookings/today');
      setTodayBookings(bookings);

      // Fetch today's revenue report for quick stats
      const today = new Date().toISOString().split('T')[0];
      const { data: report } = await api.get(`/reports/daily?date=${today}`);
      setStats(report);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Today's Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-indigo-600">Today's Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">₹{stats?.totalRevenue || 0}</h3>
            </div>
            <TrendingUp className="text-indigo-400 h-6 w-6" />
          </div>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-emerald-600">Total Bookings Today</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats?.totalBookings || 0}</h3>
            </div>
            <Calendar className="text-emerald-400 h-6 w-6" />
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-amber-600">Pending Treatments</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {todayBookings.filter(b => b.status === 'confirmed').length}
              </h3>
            </div>
            <Users className="text-amber-400 h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <h2 className="text-lg font-bold text-gray-900 mb-4">Today's Schedule</h2>
      
      {todayBookings.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-gray-500">No bookings scheduled for today.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {todayBookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatTime(booking.slotTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{booking.user?.name}</div>
                    <div className="text-sm text-gray-500">{booking.user?.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{booking.service?.name}</div>
                    <div className="text-xs text-gray-500">₹{booking.service?.price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${booking.status === 'confirmed' ? 'bg-amber-100 text-amber-800' : 
                        booking.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                        'bg-gray-100 text-gray-800'}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
