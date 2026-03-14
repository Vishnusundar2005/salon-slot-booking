'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { formatDate, formatTime } from '../../utils/dateFormatter';
import { Calendar, Clock, Scissors, XCircle, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import BookingDetailsModal from '../../components/BookingDetailsModal';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings/my');
      setBookings(data);
    } catch (error) {
      toast.error('Failed to load your bookings');
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      await api.put(`/bookings/${id}/cancel`);
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel');
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'confirmed': return { color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock };
      case 'completed': return { color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2 };
      case 'cancelled': return { color: 'text-red-600', bg: 'bg-red-50', icon: XCircle };
      default: return { color: 'text-gray-600', bg: 'bg-gray-50', icon: AlertCircle };
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-12 w-48 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-48 bg-gray-100 dark:bg-gray-800 rounded-[32px]"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto space-y-12 pb-20 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white font-outfit tracking-tight">Your <span className="text-indigo-600 dark:text-indigo-400">Appointments</span></h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Manage your signature grooming sessions and history.</p>
          </div>
          <Link 
            href="/services" 
            className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all hover:-translate-y-1 active:scale-95"
          >
            <span>Book New Service</span>
            <ArrowRight size={18} />
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-32 bg-white dark:bg-gray-800 rounded-[40px] border border-dashed border-gray-200 dark:border-gray-700">
            <div className="w-24 h-24 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-200 dark:text-gray-700">
               <Calendar size={48} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 font-outfit">No sessions found</h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium max-w-xs mx-auto mb-10">You haven't booked any services with Slotify yet.</p>
            <Link 
              href="/services" 
              className="px-10 py-5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-2xl font-black text-sm hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
            >
              Browse Services
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {bookings.map((booking) => {
              const config = getStatusConfig(booking.status);
              const StatusIcon = config.icon;
              const isConfirmed = booking.status === 'confirmed';

              return (
                <div key={booking._id} className="group relative bg-white dark:bg-gray-800 rounded-[40px] p-8 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-2xl hover:shadow-indigo-50 dark:hover:shadow-none transition-all duration-500">
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center space-x-4">
                       <div className={`p-4 rounded-2xl ${config.bg} ${config.color} dark:bg-opacity-10`}>
                          <StatusIcon size={24} />
                       </div>
                       <div>
                          <div className={`text-xs font-black uppercase tracking-widest ${config.color} mb-1`}>
                            {booking.status}
                          </div>
                          <h3 className="text-2xl font-black text-gray-900 dark:text-white font-outfit">{booking.service?.name}</h3>
                       </div>
                    </div>
                    <div className="text-xl font-black text-gray-900 dark:text-white">₹{booking.service?.price}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 p-6 bg-gray-50/50 dark:bg-gray-900/50 rounded-3xl mb-8">
                    <div className="flex items-center space-x-3">
                      <Calendar className="text-gray-400 dark:text-gray-500" size={18} />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none mb-1">Date</span>
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{formatDate(booking.date, 'MMM do, yyyy')}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="text-gray-400 dark:text-gray-500" size={18} />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none mb-1">Time</span>
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{formatTime(booking.slotTime)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {isConfirmed && (
                      <button
                        onClick={() => cancelBooking(booking._id)}
                        className="w-full py-4 text-sm font-black text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                      >
                        Cancel Session
                      </button>
                    )}
                     <button 
                       onClick={() => {
                         setSelectedBooking(booking);
                         setIsModalOpen(true);
                       }}
                       className="w-full py-4 text-sm font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl hover:bg-indigo-100 dark:hover:bg-indigo-900/20 transition-colors"
                     >
                       View Details
                     </button>
                   </div>
                 </div>
               );
             })}
           </div>
         )}

         <BookingDetailsModal 
           isOpen={isModalOpen}
           onClose={() => setIsModalOpen(false)}
           booking={selectedBooking}
           onCancel={cancelBooking}
         />
       </div>
    </ProtectedRoute>
  );
}
