'use client';

import Link from 'next/link';
import { Clock, Scissors, ChevronRight, Zap } from 'lucide-react';

export default function ServiceCard({ service }) {
  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'hair': return <Scissors size={20} />;
      case 'beard': return <Zap size={20} />;
      default: return <Scissors size={20} />;
    }
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-[32px] overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-2xl hover:shadow-indigo-100 dark:hover:shadow-none transition-all duration-500 hover:-translate-y-2">
      {/* Category Badge */}
      <div className="absolute top-6 left-6 z-10">
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center space-x-2">
          <div className="text-indigo-600 dark:text-indigo-400">
            {getCategoryIcon(service.category)}
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-gray-100">
            {service.category || 'Premium'}
          </span>
        </div>
      </div>

      <div className="p-8 pt-20 flex flex-col h-full">
        <div>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 font-outfit group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {service.name}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 font-medium mb-8 line-clamp-2 text-sm leading-relaxed">
            {service.description || 'Professional grooming service tailored to your personal style and preferences.'}
          </p>
        </div>

        <div className="mt-auto space-y-6">
          <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-gray-700">
            <div className="flex items-center space-x-2 text-gray-400 dark:text-gray-500">
              <Clock size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">{service.duration} mins</span>
            </div>
            <div className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              ₹{service.price}
            </div>
          </div>

          <Link
            href={`/book-slot?serviceId=${service._id}`}
            className="w-full py-4 bg-gray-900 dark:bg-indigo-600 text-white rounded-2xl font-black text-sm flex items-center justify-center space-x-2 group-hover:bg-indigo-600 dark:group-hover:bg-indigo-700 transition-all shadow-lg shadow-gray-200 dark:shadow-none group-hover:shadow-indigo-200"
          >
            <span>Book Now</span>
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
      
      {/* Decoration */}
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-tl-full -mr-16 -mb-16 group-hover:scale-150 transition-transform duration-700"></div>
    </div>
  );
}
