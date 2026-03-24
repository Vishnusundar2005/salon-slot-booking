'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, Scissors, LayoutDashboard, Calendar, LogOut, ChevronRight, Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-[100] border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo & Desktop Nav */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group" onClick={closeMenu}>
              <div className="bg-indigo-600 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                <Scissors className="text-white h-6 w-6" />
              </div>
              <span className="text-2xl font-black tracking-tight text-gray-900 dark:text-white font-outfit">
                Slotify
              </span>
            </Link>

            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 px-1 pt-1 text-sm font-bold transition-colors">
                Home
              </Link>
              <Link href="/services/" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 px-1 pt-1 text-sm font-bold transition-colors">
                Services
              </Link>
              {user && user.role === 'customer' && (
                <Link href="/my-bookings/" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 px-1 pt-1 text-sm font-bold transition-colors">
                  My Bookings
                </Link>
              )}
            </div>
          </div>
          
          {/* Desktop Right Actions */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{user.role}</span>
                  <span className="text-sm font-black text-gray-900 dark:text-gray-100">Hi, {user.name.split(' ')[0]}</span>
                </div>
                {user.role === 'admin' && (
                  <Link 
                    href="/admin/dashboard/" 
                    className="flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-colors"
                  >
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login/" className="text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-4">
                  Login
                </Link>
                <Link
                  href="/register/"
                  className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-black shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-95"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 border border-gray-100 dark:border-gray-700"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 inset-x-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-xl z-50 animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <div className="flex justify-end p-2">
              <button
                onClick={toggleTheme}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold border border-gray-100 dark:border-gray-700"
              >
                {theme === 'light' ? <><Moon size={18} /><span>Dark Mode</span></> : <><Sun size={18} /><span>Light Mode</span></>}
              </button>
            </div>
            <Link
              href="/"
              onClick={closeMenu}
              className="flex items-center justify-between px-4 py-4 rounded-2xl text-base font-bold text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 active:bg-indigo-50 dark:active:bg-indigo-900/30 active:text-indigo-600"
            >
              <span>Home</span>
              <ChevronRight size={18} className="text-gray-400" />
            </Link>
            <Link
              href="/services/"
              onClick={closeMenu}
              className="flex items-center justify-between px-4 py-4 rounded-2xl text-base font-bold text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 active:bg-indigo-50 dark:active:bg-indigo-900/30 active:text-indigo-600"
            >
              <span>Services</span>
              <ChevronRight size={18} className="text-gray-400" />
            </Link>
            {user && user.role === 'customer' && (
              <Link
                href="/my-bookings/"
                onClick={closeMenu}
                className="flex items-center justify-between px-4 py-4 rounded-2xl text-base font-bold text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 active:bg-indigo-50 dark:active:bg-indigo-900/30 active:text-indigo-600"
              >
                <span>My Bookings</span>
                <ChevronRight size={18} className="text-gray-400" />
              </Link>
            )}
            
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 mt-4">
              {user ? (
                <div className="space-y-4">
                  <div className="px-4">
                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">{user.role}</p>
                    <p className="text-lg font-black text-gray-900 dark:text-white">Hi, {user.name}</p>
                  </div>
                  {user.role === 'admin' && (
                    <Link
                      href="/admin/dashboard/"
                      onClick={closeMenu}
                      className="flex items-center space-x-3 w-full px-4 py-4 rounded-2xl bg-indigo-600 text-white font-bold"
                    >
                      <LayoutDashboard size={20} />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                  <button
                    onClick={() => { logout(); closeMenu(); }}
                    className="flex items-center space-x-3 w-full px-4 py-4 rounded-2xl bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 font-bold"
                  >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 px-2">
                  <Link
                    href="/login/"
                    onClick={closeMenu}
                    className="flex items-center justify-center py-4 rounded-2xl font-bold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register/"
                    onClick={closeMenu}
                    className="flex items-center justify-center py-4 rounded-2xl font-bold bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
