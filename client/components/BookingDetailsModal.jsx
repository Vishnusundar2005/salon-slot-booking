'use client';

import { X, Calendar, Clock, Scissors, CheckCircle2, XCircle, AlertCircle, MapPin, Receipt, Info } from 'lucide-react';
import { formatDate, formatTime } from '../utils/dateFormatter';

export default function BookingDetailsModal({ booking, isOpen, onClose, onCancel }) {
  if (!isOpen || !booking) return null;

  const getStatusConfig = (status) => {
    switch (status) {
      case 'confirmed': return { color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock, label: 'Upcoming' };
      case 'completed': return { color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2, label: 'Completed' };
      case 'cancelled': return { color: 'text-red-600', bg: 'bg-red-50', icon: XCircle, label: 'Cancelled' };
      case 'expired': return { color: 'text-gray-500', bg: 'bg-gray-100', icon: AlertCircle, label: 'Expired' };
      default: return { color: 'text-gray-600', bg: 'bg-gray-50', icon: AlertCircle, label: status };
    }
  };

  const config = getStatusConfig(booking.status);
  const StatusIcon = config.icon;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-[32px] sm:rounded-[40px] shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 border border-gray-100 dark:border-gray-700">
        {/* Header */}
        <div className="p-6 sm:p-8 pb-0 flex justify-between items-start shrink-0">
          <div className="flex items-center space-x-4">
            <div className={`p-2 sm:p-3 rounded-2xl ${config.bg} ${config.color} dark:bg-opacity-10`}>
              <StatusIcon size={20} className="sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className={`text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] ${config.color}`}>
                {config.label}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white font-outfit">Booking Details</h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 sm:p-3 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6 sm:space-y-8 overflow-y-auto">
          {/* Main Info Card */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-[32px] p-8 border border-gray-100 dark:border-gray-700/50">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Service</span>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white">{booking.service?.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Professional service at Slotify Salon</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Amount</span>
                  <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400">₹{booking.service?.price}</div>
                </div>
             </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-4 p-5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center">
                <Calendar size={22} />
              </div>
              <div>
                <div className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Date</div>
                <div className="font-bold text-gray-900 dark:text-gray-100">{formatDate(booking.date, 'MMMM do, yyyy')}</div>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl">
              <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center">
                <Clock size={22} />
              </div>
              <div>
                <div className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Time Slot</div>
                <div className="font-bold text-gray-900 dark:text-gray-100">{formatTime(booking.slotTime)}</div>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center">
                <Scissors size={22} />
              </div>
              <div>
                <div className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Duration</div>
                <div className="font-bold text-gray-900 dark:text-gray-100">{booking.service?.duration} Minutes</div>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center">
                <Info size={22} />
              </div>
              <div>
                <div className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Booking ID</div>
                <div className="font-bold text-gray-900 dark:text-gray-100 text-xs">#{booking._id.slice(-8).toUpperCase()}</div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {booking.notes && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-gray-400 dark:text-gray-500 px-2">
                <Receipt size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Additional Notes</span>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm font-medium">
                {booking.notes}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            {booking.status === 'confirmed' && (
              <button 
                onClick={() => {
                  onCancel(booking._id);
                  onClose();
                }}
                className="flex-1 py-5 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-[24px] font-black text-sm hover:bg-red-100 dark:hover:bg-red-900/20 transition-all active:scale-95"
              >
                Cancel Session
              </button>
            )}
            <button 
              onClick={onClose}
              className="flex-1 py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-[24px] font-black text-sm hover:bg-gray-800 dark:hover:bg-gray-50 transition-all active:scale-95 shadow-xl shadow-gray-200 dark:shadow-none"
            >
              Close Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
