'use client';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading } = useAuth();

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in -> redirect using window.location for reliability on static hosts
        window.location.href = requireAdmin ? '/slotify/admin/login/' : '/slotify/login/';
      } else if (requireAdmin && !isAdmin) {
        // Logged in but not admin/superadmin -> redirect to home
        window.location.href = '/slotify/';
      }
    }
  }, [user, loading, requireAdmin, isAdmin]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  // Render children only if user requirements are met
  if (!user || (requireAdmin && !isAdmin)) {
    return null; // Will redirect in useEffect
  }

  return children;
}
