'use client';
import { useState, useEffect } from 'react';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import { formatDate, formatTime } from '../../../utils/dateFormatter';
import { Search, Filter, CheckCircle, CreditCard, XCircle, Edit3, Calendar, Plus } from 'lucide-react';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Payment Recording State
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [referenceId, setReferenceId] = useState('');
  const [recording, setRecording] = useState(false);

  // Edit Booking State
  const [editingBooking, setEditingBooking] = useState(null);
  const [editForm, setEditForm] = useState({
    serviceId: '',
    date: '',
    slotTime: '',
    status: '',
    notes: ''
  });

  // Block Slot State
  const [blockingSlot, setBlockingSlot] = useState(false);
  const [blockForm, setBlockForm] = useState({
    date: new Date().toISOString().split('T')[0],
    slotTime: '09:00',
    notes: 'Holiday / Blocked'
  });

  useEffect(() => {
    fetchBookings();
    fetchServices();
  }, [filterDate, filterStatus]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      let url = '/bookings?';
      if (filterDate) url += `date=${filterDate}&`;
      if (filterStatus) url += `status=${filterStatus}`;
      const { data } = await api.get(url);
      setBookings(data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const { data } = await api.get('/services');
      setServices(data.filter(s => s.isActive));
    } catch (error) {
      console.error('Failed to fetch services');
    }
  };

  const handleRecordPayment = async () => {
    if (!selectedBooking) return;
    setRecording(true);
    try {
      await api.post(`/payments`, {
        bookingId: selectedBooking._id,
        method: paymentMethod,
        amount: selectedBooking.service?.price,
        reference: referenceId
      });
      toast.success('Payment recorded and booking completed!');
      setSelectedBooking(null);
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to record payment');
    } finally {
      setRecording(false);
    }
  };

  const cancelBooking = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await api.put(`/bookings/${id}/cancel`);
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to cancel');
    }
  };

  const handleEditClick = (booking) => {
    setEditingBooking(booking);
    setEditForm({
      serviceId: booking.service?._id || '',
      date: booking.date,
      slotTime: booking.slotTime,
      status: booking.status,
      notes: booking.notes || ''
    });
  };

  const handleUpdateBooking = async () => {
    try {
      await api.put(`/bookings/${editingBooking._id}`, editForm);
      toast.success('Booking updated successfully');
      setEditingBooking(null);
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update booking');
    }
  };

  const handleBlockSlot = async () => {
    try {
      await api.post('/bookings/block', blockForm);
      toast.success('Slot blocked successfully');
      setBlockingSlot(false);
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to block slot');
    }
  };

  return (
    <div className="pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Bookings</h1>
          <p className="text-sm text-gray-500">View and manage all appointments</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setBlockingSlot(true)}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white text-sm font-bold rounded-xl hover:bg-rose-700 transition shadow-lg shadow-rose-100"
          >
            <Calendar size={18} />
            Block Slot / Holiday
          </button>

          <div className="h-10 w-[1px] bg-gray-200 hidden md:block"></div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
            >
              <option value="">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="expired">Expired</option>
              <option value="blocked">Blocked (Holiday)</option>
            </select>
            <button 
              onClick={() => { setFilterDate(''); setFilterStatus(''); }}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No bookings found</h3>
          <p className="text-gray-500">Try adjusting your filters or check back later.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Date/Time</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Service</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{formatDate(booking.date, 'MMM do, yyyy')}</div>
                      <div className="text-xs text-indigo-600 font-medium">{formatTime(booking.slotTime)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        {booking.status === 'blocked' ? '--- BLOCKED ---' : (booking.user?.name || 'Unknown')}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">{booking.user?.phone || 'No Phone'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-bold">{booking.service?.name || 'Blocked Slot'}</div>
                      <div className="text-xs text-gray-500">₹{booking.service?.price || 0}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 text-[10px] font-black rounded-lg uppercase tracking-wider
                        ${booking.status === 'confirmed' ? 'bg-amber-50 text-amber-700' : 
                          booking.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 
                          booking.status === 'cancelled' ? 'bg-rose-50 text-rose-700' : 
                          booking.status === 'blocked' ? 'bg-gray-900 text-white' :
                          'bg-gray-50 text-gray-600'}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-2">
                        {['confirmed', 'blocked'].includes(booking.status) && (
                          <button 
                            onClick={() => handleEditClick(booking)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition"
                            title="Edit Slot"
                          >
                            <Edit3 size={18} />
                          </button>
                        )}
                        
                        {booking.status === 'confirmed' && (
                          <>
                            <button 
                              onClick={() => setSelectedBooking(booking)}
                              className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-100 transition"
                              title="Complete & Pay"
                            >
                              <CreditCard size={18} />
                            </button>
                            <button 
                              onClick={() => cancelBooking(booking._id)}
                              className="text-rose-600 hover:bg-rose-50 p-2 rounded-xl transition"
                              title="Cancel"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}

                        {booking.status === 'blocked' && (
                          <button 
                            onClick={() => cancelBooking(booking._id)}
                            className="text-rose-600 hover:bg-rose-50 p-2 rounded-xl transition"
                            title="Unblock"
                          >
                            <XCircle size={18} />
                          </button>
                        )}
                        
                        {booking.status === 'completed' && <CheckCircle size={20} className="text-emerald-500 mr-2" />}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Booking Modal */}
      {editingBooking && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] max-w-md w-full p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-black text-gray-900 mb-2">Edit Appointment</h3>
            <p className="text-sm text-gray-500 mb-8 font-medium">Modify the booking details for {editingBooking.user?.name || 'Blocked Slot'}</p>

            <div className="space-y-5 mb-8">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Service</label>
                <select
                  value={editForm.serviceId}
                  onChange={(e) => setEditForm({ ...editForm, serviceId: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all text-sm font-bold appearance-none bg-no-repeat bg-[right_1rem_center]"
                >
                  {services.map(s => <option key={s._id} value={s._id}>{s.name} - ₹{s.price}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Date</label>
                  <input
                    type="date"
                    value={editForm.date}
                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Slot Time</label>
                  <input
                    type="time"
                    value={editForm.slotTime}
                    onChange={(e) => setEditForm({ ...editForm, slotTime: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all text-sm font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Admin Notes</label>
                <textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  placeholder="Internal notes..."
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all text-sm font-bold min-h-[100px]"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setEditingBooking(null)}
                className="flex-1 py-4 font-bold text-gray-500 hover:bg-gray-100 rounded-2xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateBooking}
                className="flex-[2] py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Block Slot Modal */}
      {blockingSlot && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] max-w-md w-full p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-black text-gray-900 mb-2">Block Time Slot</h3>
            <p className="text-sm text-gray-500 mb-8 font-medium">Prevent customers from booking this time.</p>

            <div className="space-y-5 mb-8">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Date</label>
                  <input
                    type="date"
                    value={blockForm.date}
                    onChange={(e) => setBlockForm({ ...blockForm, date: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Starts At</label>
                  <input
                    type="time"
                    value={blockForm.slotTime}
                    step="1800"
                    onChange={(e) => setBlockForm({ ...blockForm, slotTime: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all text-sm font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Reason</label>
                <input
                  type="text"
                  value={blockForm.notes}
                  onChange={(e) => setBlockForm({ ...blockForm, notes: e.target.value })}
                  placeholder="e.g. Lunch Break, Staff Meeting"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all text-sm font-bold"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setBlockingSlot(false)}
                className="flex-1 py-4 font-bold text-gray-500 hover:bg-gray-100 rounded-2xl transition"
              >
                Back
              </button>
              <button
                onClick={handleBlockSlot}
                className="flex-[2] py-4 bg-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-rose-100 hover:bg-rose-700 transition"
              >
                Block this Slot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Recording Modal (Keep as is but update styles if needed) */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] max-w-md w-full p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-black text-gray-900 mb-2">Record Payment</h3>
            <p className="text-sm text-gray-500 mb-8 font-medium">
              Completing booking for <span className="font-bold text-gray-800">{selectedBooking.user?.name}</span>
            </p>

            <div className="space-y-6 mb-8">
              <div className="p-6 bg-indigo-50 rounded-2xl border-2 border-indigo-100">
                <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Total Amount</label>
                <div className="text-4xl font-black text-indigo-700">₹{selectedBooking.service?.price}</div>
              </div>
              
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Payment Method</label>
                <div className="grid grid-cols-3 gap-3">
                  {['cash', 'upi', 'card'].map((method) => (
                    <button
                      key={method}
                      onClick={() => {
                        setPaymentMethod(method);
                        if (method !== 'upi') setReferenceId('');
                      }}
                      className={`py-4 rounded-2xl border-2 font-bold transition-all capitalize text-sm ${
                        paymentMethod === method 
                          ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                          : 'border-gray-50 bg-gray-50 text-gray-500 hover:border-gray-100'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {paymentMethod === 'upi' && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Reference ID</label>
                  <input
                    type="text"
                    value={referenceId}
                    onChange={(e) => setReferenceId(e.target.value)}
                    placeholder="XYZ12345678"
                    className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all text-sm font-bold"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedBooking(null)}
                className="flex-1 py-4 font-bold text-gray-500 hover:bg-gray-100 rounded-2xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRecordPayment}
                disabled={recording}
                className="flex-[2] py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition disabled:opacity-50"
              >
                {recording ? 'Processing...' : 'Complete & Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
