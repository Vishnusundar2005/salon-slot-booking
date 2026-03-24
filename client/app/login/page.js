'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { Scissors, Mail, Lock, ChevronRight, User } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data, data.token);
      toast.success('Welcome back!');
      router.push('/services/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-0 animate-in fade-in zoom-in-95 duration-500">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
           <div className="inline-flex bg-indigo-600 p-4 rounded-3xl shadow-xl shadow-indigo-100 dark:shadow-none mb-6 group hover:rotate-12 transition-transform duration-300">
              <Scissors className="text-white h-8 w-8" />
           </div>
           <h2 className="text-4xl font-black text-gray-900 dark:text-white font-outfit tracking-tight">Welcome Back</h2>
           <p className="mt-3 text-gray-500 dark:text-gray-400 font-medium">Continue your grooming journey with Slotify</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-10 rounded-[40px] shadow-2xl shadow-gray-100 dark:shadow-none border border-gray-100 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                 <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600" size={20} />
                 <input
                   type="email"
                   required
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   className="w-full pl-16 pr-6 py-5 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 text-sm font-bold text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 transition-all"
                   placeholder="you@example.com"
                 />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                 <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600" size={20} />
                 <input
                   type="password"
                   required
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="w-full pl-16 pr-6 py-5 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 text-sm font-bold text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 transition-all"
                   placeholder="••••••••"
                 />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-indigo-600 text-white rounded-[24px] font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-3 group"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Login</span>
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm font-bold text-gray-400">
              Don't have an account?{' '}
              <Link href="/register/" className="text-indigo-600 hover:text-indigo-700 underline underline-offset-4">
                Sign Up Now
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/admin/login/" className="inline-flex items-center space-x-2 text-xs font-black text-gray-300 dark:text-gray-600 uppercase tracking-widest hover:text-indigo-400 transition-colors">
            <User size={14} />
            <span>Switch to Admin Portal</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
