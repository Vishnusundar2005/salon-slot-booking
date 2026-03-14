'use client';

import { CheckCircle2 } from 'lucide-react';

export default function SlotCard({ slot, onSelect, selected, isExpired }) {
  if (slot.isBooked || isExpired) {
    const statusLabel = slot.isBooked ? 'Booked' : 'Expired';
    return (
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-300 dark:text-gray-600 rounded-2xl p-4 text-center cursor-not-allowed flex flex-col items-center justify-center space-y-1">
        <span className="block font-black text-sm tracking-tight">{slot.time}</span>
        <span className="text-[10px] uppercase font-black tracking-widest opacity-50">{statusLabel}</span>
      </div>
    );
  }

  return (
    <div 
      onClick={() => onSelect(slot)}
      className={`relative group border-2 rounded-2xl p-4 text-center cursor-pointer transition-all duration-300 ${
        selected 
          ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none scale-105' 
          : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10'
      }`}
    >
      <span className="block font-black text-sm tracking-tight mb-0.5">{slot.time}</span>
      {slot.price && (
        <span className={`block font-bold text-xs mb-1 ${selected ? 'text-indigo-200' : 'text-indigo-600 dark:text-indigo-400'}`}>
          ₹{slot.price}
        </span>
      )}
      <span className={`text-[10px] uppercase font-black tracking-widest ${selected ? 'text-indigo-100' : 'text-gray-400 dark:text-gray-500 group-hover:text-indigo-500'}`}>
        {selected ? 'Selected' : 'Available'}
      </span>
      
      {selected && (
        <div className="absolute -top-2 -right-2 bg-white dark:bg-gray-900 text-indigo-600 dark:text-white rounded-full p-0.5 border-2 border-indigo-600 dark:border-indigo-400 shadow-sm animate-in zoom-in duration-300">
           <CheckCircle2 size={16} fill="currentColor" className="text-white dark:text-indigo-600" />
        </div>
      )}
    </div>
  );
}
