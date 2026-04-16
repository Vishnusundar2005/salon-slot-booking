'use client';
import { useContext } from 'react';
import { usePathname } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../hooks/useAuth';
import { LayoutDashboard, CalendarDays, Scissors, CreditCard, BarChart3, ShieldCheck } from 'lucide-react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/slotify/admin/dashboard/', icon: LayoutDashboard },
    { name: 'All Bookings', href: '/slotify/admin/bookings/', icon: CalendarDays },
    { name: 'Services', href: '/slotify/admin/services/', icon: Scissors },
    { name: 'Payments', href: '/slotify/admin/payments/', icon: CreditCard },
    { name: 'Revenue', href: '/slotify/admin/revenue/', icon: BarChart3 },
  ];

  // Don't wrap login page in ProtectedRoute or Sidebar
  if (pathname.startsWith('/admin/login')) {
    return <>{children}</>;
  }

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="flex flex-col md:flex-row gap-6 min-h-[70vh]">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white shadow-sm border border-gray-100 rounded-2xl p-4 h-fit">
          <div className="mb-6 px-4">
            <h2 className="text-xl font-extrabold text-indigo-900">Admin Portal</h2>
            {user?.role === 'superadmin' && (
              <span className="inline-block mt-1 text-xs font-semibold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                Super Admin
              </span>
            )}
          </div>
          <nav className="space-y-1">
            {navigation.map((item) => {
              // Check active using the full path including basePath
              const isActive = typeof window !== 'undefined'
                ? window.location.pathname === item.href || window.location.pathname === item.href.replace(/\/$/, '')
                : pathname === item.href.replace('/slotify', '');
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                  {item.name}
                </a>
              );
            })}

            {/* Super Admin exclusive: Manage Admins */}
            {user?.role === 'superadmin' && (() => {
              const href = '/slotify/admin/manage-admins/';
              const isActive = typeof window !== 'undefined'
                ? window.location.pathname === href || window.location.pathname === href.replace(/\/$/, '')
                : pathname === href.replace('/slotify', '');
              return (
                <a
                  href={href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                    isActive
                      ? 'bg-purple-50 text-purple-700'
                      : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                  }`}
                >
                  <ShieldCheck className={`mr-3 h-5 w-5 ${isActive ? 'text-purple-600' : 'text-gray-400'}`} />
                  Manage Admins
                </a>
              );
            })()}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-white shadow-sm border border-gray-100 rounded-2xl p-6 lg:p-8">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
