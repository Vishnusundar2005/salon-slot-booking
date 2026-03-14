'use client';

import { useState, useEffect } from 'react';
import api from '../../services/api';
import ServiceCard from '../../components/ServiceCard';
import { Search, SlidersHorizontal, Scissors } from 'lucide-react';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data } = await api.get('/services');
      setServices(data.filter(s => s.isActive));
    } catch (error) {
      console.error('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-500">
      {/* Header section */}
      <div className="relative bg-indigo-900 dark:bg-gray-800/50 rounded-[50px] p-10 md:p-20 text-center overflow-hidden shadow-2xl">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-500/30 via-transparent to-transparent"></div>
         
         <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center space-x-2 bg-indigo-800/50 dark:bg-indigo-900/50 text-indigo-200 dark:text-indigo-300 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-700/50 dark:border-indigo-800/50">
              <Scissors size={14} />
              <span>Professional Grooming</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white font-outfit tracking-tight">
               Our Signature <span className="text-indigo-400">Services</span>
            </h1>
            <p className="text-indigo-100/70 dark:text-gray-400 font-medium text-lg">
               Choose from our curated selection of premium treatments designed to make you look and feel your absolute best.
            </p>
         </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search for a service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-16 pr-6 py-5 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 text-sm font-bold text-gray-900 dark:text-white placeholder:text-gray-400 transition-all"
          />
        </div>
        <button className="flex items-center space-x-2 px-8 py-5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-2xl font-black text-sm hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors w-full md:w-auto">
          <SlidersHorizontal size={20} />
          <span>Filters</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-[400px] bg-gray-100 dark:bg-gray-800 rounded-[32px] animate-pulse"></div>
          ))}
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="text-center py-32 bg-white dark:bg-gray-800 rounded-[40px] border border-dashed border-gray-200 dark:border-gray-700">
           <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300 dark:text-gray-600">
              <Search size={40} />
           </div>
           <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">No services found</h3>
           <p className="text-gray-500 dark:text-gray-400">Try a different search term or browse all categories.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}
