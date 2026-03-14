'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in -> redirect based on requirement
        router.push(requireAdmin ? '/admin/login' : '/login');
      } else if (requireAdmin && user.role !== 'admin') {
        // Logged in but not admin -> redirect to home
        router.push('/');
      } else if (!requireAdmin && user.role === 'admin') {
         // Admin trying to access customer routes (optional protection)
         // Maybe let them, or redirect to dashboard
      }
    }
  }, [user, loading, router, requireAdmin]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  // Render children only if user requirements are met
  if (!user || (requireAdmin && user.role !== 'admin')) {
    return null; // Will redirect in useEffect
  }

  return children;
}
