'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import SlotCard from '../../components/SlotCard';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { format, addDays } from 'date-fns';
import { ArrowLeft, Calendar, Clock, Edit3, CheckCircle, ChevronRight, Scissors } from 'lucide-react';

function BookSlotContent() {
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('serviceId');
  const router = useRouter();

  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [slotsData, setSlotsData] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [notes, setNotes] = useState('');
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Generate an array of the next 7 days for the date picker
  const upcomingDays = Array.from({ length: 7 }).map((_, i) => {
    const d = addDays(new Date(), i);
    return {
      value: format(d, 'yyyy-MM-dd'),
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : format(d, 'EEE'),
      dayNum: format(d, 'd'),
      month: format(d, 'MMM'),
    };
  });

  useEffect(() => {
    if (!serviceId) {
      toast.error('No service selected');
      router.push('/services');
      return;
    }
    
    const fetchSlots = async () => {
      setLoadingConfig(true);
      try {
        const { data } = await api.get(`/bookings/slots?date=${date}&serviceId=${serviceId}`);
        setSlotsData(data);
        setSelectedSlot(null);
      } catch (error) {
        toast.error('Failed to load available slots');
      } finally {
        setLoadingConfig(false);
      }
    };

    fetchSlots();
  }, [date, serviceId, router]);

  const handleBooking = async () => {
    if (!selectedSlot) {
      toast.error('Please select a time slot');
      return;
    }

    setBookingLoading(true);
    try {
      await api.post('/bookings', {
        serviceId,
        date,
        slotTime: selectedSlot.time,
        notes,
      });
      toast.success('🎉 Booking confirmed!');
      // Wait for a moment to let the user see the success message
      setTimeout(() => {
        router.push('/my-bookings');
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b-2 border-gray-100 dark:border-gray-800">
         <div className="space-y-4">
            <button 
              onClick={() => router.back()} 
              className="inline-flex items-center space-x-2 text-gray-500 hover:text-indigo-600 transition-colors font-bold text-sm"
            >
              <ArrowLeft size={18} />
              <span>Back to Services</span>
            </button>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white font-outfit tracking-tight">Book Your <span className="text-indigo-600 dark:text-indigo-400">Session</span></h1>
            <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               <p className="font-medium">Scheduling for <span className="font-bold text-gray-800 dark:text-gray-200">{slotsData?.service}</span></p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Date & Slot Selection */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Step 1: Date */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
               <div className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-xs">1</div>
               <h3 className="text-xl font-black text-gray-900 dark:text-white font-outfit">Select Date</h3>
            </div>
            
            <div className="flex overflow-x-auto pb-4 gap-3 hide-scrollbar">
              {upcomingDays.map((day) => (
                <button
                  key={day.value}
                  onClick={() => setDate(day.value)}
                  className={`flex-shrink-0 w-24 h-28 rounded-3xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                    date === day.value 
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 shadow-lg shadow-indigo-50 dark:shadow-none' 
                      : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:border-indigo-200 dark:hover:border-indigo-800 hover:text-gray-600 dark:hover:text-gray-300'
                  }`}
                >
                  <span className="text-[10px] font-black uppercase tracking-widest">{day.label}</span>
                  <span className="text-2xl font-black tracking-tight">{day.dayNum}</span>
                  <span className="text-[10px] font-bold uppercase">{day.month}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Time Slots */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
               <div className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-xs">2</div>
               <h3 className="text-xl font-black text-gray-900 dark:text-white font-outfit">Select Time</h3>
            </div>
            
            {loadingConfig ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl"></div>
                ))}
              </div>
            ) : slotsData?.slots?.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {slotsData.slots.map((slot) => {
                  // Check if slot has expired
                  const today = format(new Date(), 'yyyy-MM-dd');
                  let isExpired = false;
                  
                  if (date === today) {
                    const [slotHours, slotMins] = slot.time.split(':').map(Number);
                    const now = new Date();
                    const currentHours = now.getHours();
                    const currentMins = now.getMinutes();
                    
                    if (slotHours < currentHours || (slotHours === currentHours && slotMins <= currentMins)) {
                      isExpired = true;
                    }
                  }

                  return (
                    <SlotCard 
                      key={slot.time} 
                      slot={slot} 
                      selected={selectedSlot?.time === slot.time}
                      onSelect={setSelectedSlot}
                      isExpired={isExpired}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-[32px] border-2 border-dashed border-gray-200 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400 font-medium">No slots available for this day.</p>
              </div>
            )}
          </div>

          {/* Step 3: Notes */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
               <div className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-xs">3</div>
               <h3 className="text-xl font-black text-gray-900 dark:text-white font-outfit">Additional Notes</h3>
            </div>
            <div className="relative">
               <Edit3 className="absolute left-6 top-6 text-gray-300 pointer-events-none" size={20} />
               <textarea
                 rows="4"
                 className="w-full pl-16 pr-6 py-6 bg-white border-2 border-gray-100 rounded-[32px] focus:border-indigo-500 focus:ring-0 text-sm font-medium text-gray-700 placeholder:text-gray-300 transition-all"
                 placeholder="Tell us about any specific styling preference or instructions..."
                 value={notes}
                 onChange={(e) => setNotes(e.target.value)}
               ></textarea>
            </div>
          </div>
        </div>

        {/* Right Column: Summary & Confirmation */}
        <div className="relative">
          <div className="sticky top-28 bg-gray-900 dark:bg-gray-800/80 backdrop-blur-md rounded-[50px] p-8 md:p-10 text-white shadow-2xl overflow-hidden group border border-gray-800 dark:border-indigo-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent"></div>
            
            <div className="relative z-10 space-y-10">
               <h3 className="text-2xl font-black font-outfit flex items-center gap-3">
                  <CheckCircle size={24} className="text-indigo-400" />
                  <span>Summary</span>
               </h3>

               <div className="space-y-6">
                  <div className="flex justify-between items-start pt-6 border-t border-gray-800">
                     <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">Service</span>
                     <span className="text-right font-black text-lg max-w-[150px]">{slotsData?.service}</span>
                  </div>
                  <div className="flex justify-between items-center py-6 border-y border-gray-800">
                     <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">Date & Time</span>
                     <div className="text-right">
                        <p className="font-black text-lg">{selectedSlot ? selectedSlot.time : '--:--'}</p>
                        <p className="font-bold text-xs text-indigo-400">{format(new Date(date), 'EEEE, MMM do')}</p>
                     </div>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">Total Cost</span>
                     <span className="text-right font-black text-3xl text-white tracking-tight">₹{slotsData?.service ? (slotsData.slots?.[0]?.price || '---') : '---'}</span>
                  </div>
               </div>

               <button
                 onClick={handleBooking}
                 disabled={!selectedSlot || bookingLoading}
                 className="w-full py-6 mt-4 bg-white text-gray-900 rounded-3xl font-black text-lg shadow-xl shadow-white/5 hover:bg-indigo-50 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center justify-center space-x-3"
               >
                 {bookingLoading ? (
                   <>
                     <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                     <span>Processing...</span>
                   </>
                 ) : (
                   <>
                     <span>Confirm Booking</span>
                     <ChevronRight size={20} />
                   </>
                 )}
               </button>
               <p className="text-center text-[10px] text-gray-500 font-medium uppercase tracking-widest">Secure checkout enabled</p>
            </div>
            
            {/* Decoration */}
            <Scissors className="absolute -bottom-10 -right-10 w-48 h-48 text-white/[0.03] -rotate-12 transition-transform group-hover:rotate-0 duration-700" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookSlot() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div className="p-20 text-center text-gray-500 dark:text-gray-400 font-black animate-pulse">Initializing Premium Flow...</div>}>
        <BookSlotContent />
      </Suspense>
    </ProtectedRoute>
  );
}
