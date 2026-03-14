'use client';
import { useState, useEffect } from 'react';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import { BarChart3, TrendingUp, PieChart, Info } from 'lucide-react';

export default function AdminRevenue() {
  const [report, setReport] = useState(null);
  const [popularServices, setPopularServices] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, [date]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const { data: daily } = await api.get(`/reports/daily?date=${date}`);
      setReport(daily);

      const { data: popular } = await api.get('/reports/popular-services');
      setPopularServices(popular);
    } catch (error) {
      toast.error('Failed to load revenue reports');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Revenue Reports</h1>
          <p className="text-sm text-gray-500">Track your salon's financial performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <label className="text-sm font-medium text-gray-700">Select Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Daily Summary */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 mr-3">
              <TrendingUp size={20} />
            </div>
            <h2 className="text-lg font-bold">Daily Summary</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Revenue</p>
              <p className="text-4xl font-black text-indigo-600">₹{report?.totalRevenue || 0}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Bookings</p>
              <p className="text-4xl font-black text-gray-700">{report?.totalBookings || 0}</p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-xl flex items-start">
            <Info size={18} className="text-indigo-400 mr-3 mt-0.5" />
            <p className="text-sm text-gray-600 italic">
              "This summary reflects all confirmed and completed bookings for the selected date."
            </p>
          </div>
        </div>

        {/* Popular Services */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600 mr-3">
              <PieChart size={20} />
            </div>
            <h2 className="text-lg font-bold">Most Popular Services</h2>
          </div>

          <div className="space-y-4">
            {popularServices.length === 0 ? (
              <p className="text-center py-8 text-gray-400">No data available yet.</p>
            ) : (
              popularServices.slice(0, 5).map((service, index) => (
                <div key={service._id} className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <span className="w-6 text-sm font-bold text-gray-300 mr-2">0{index + 1}</span>
                    <span className="text-sm font-medium text-gray-700">{service.name}</span>
                  </div>
                  <div className="w-48 bg-gray-100 h-2 rounded-full overflow-hidden mx-4">
                    <div 
                      className="bg-indigo-500 h-full rounded-full" 
                      style={{ width: `${(service.count / popularServices[0].count) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-bold text-gray-500">{service.count}</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Placeholder for future charts */}
      <div className="mt-8 bg-indigo-900 rounded-3xl p-10 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-2">Unlock Growth Insights</h3>
          <p className="text-indigo-200 max-w-sm">
            Automatic tracking of your most profitable days and busy hours is coming soon.
          </p>
        </div>
        <BarChart3 className="absolute right-[-20px] bottom-[-20px] w-64 h-64 text-indigo-800 opacity-50 rotate-12" />
      </div>
    </div>
  );
}
