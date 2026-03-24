'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import { LayoutDashboard, CalendarDays, Scissors, CreditCard, BarChart3 } from 'lucide-react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard/', icon: LayoutDashboard },
    { name: 'All Bookings', href: '/admin/bookings/', icon: CalendarDays },
    { name: 'Services', href: '/admin/services/', icon: Scissors },
    { name: 'Payments', href: '/admin/payments/', icon: CreditCard },
    { name: 'Revenue', href: '/admin/revenue/', icon: BarChart3 },
  ];

  // Don't wrap login page in ProtectedRoute or Sidebar
  // Using startsWith to handle trailing slashes or sub-paths
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
          </div>
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
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
                </Link>
              );
            })}
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
