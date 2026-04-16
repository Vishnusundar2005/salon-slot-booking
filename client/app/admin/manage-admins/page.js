'use client';
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';
import api from '../../../services/api';
import { ShieldCheck, Trash2, Plus, X, Eye, EyeOff } from 'lucide-react';

export default function ManageAdminsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [admins, setAdmins] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  // Guard: only superadmin can access this page
  useEffect(() => {
    if (!loading && user?.role !== 'superadmin') {
      window.location.href = '/slotify/admin/dashboard/';
    }
  }, [user, loading]);

  const fetchAdmins = async () => {
    try {
      setFetching(true);
      const { data } = await api.get('/admin/admins');
      setAdmins(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load admins');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'superadmin') {
      fetchAdmins();
    }
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      await api.post('/admin/admins', form);
      setSuccess('Admin created successfully!');
      setForm({ name: '', email: '', phone: '', password: '' });
      setShowForm(false);
      fetchAdmins();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create admin');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setError('');
    setSuccess('');
    try {
      await api.delete(`/admin/admins/${id}`);
      setSuccess('Admin deleted successfully!');
      setDeleteConfirm(null);
      fetchAdmins();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete admin');
    }
  };

  if (loading || user?.role !== 'superadmin') {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-purple-600" />
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Manage Admins</h1>
            <p className="text-sm text-gray-500 mt-0.5">Create and remove admin accounts</p>
          </div>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setError(''); setSuccess(''); }}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? 'Cancel' : 'Add Admin'}
        </button>
      </div>

      {/* Feedback messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl">
          {success}
        </div>
      )}

      {/* Create Admin Form */}
      {showForm && (
        <div className="mb-8 p-6 bg-purple-50 border border-purple-100 rounded-2xl">
          <h2 className="text-lg font-bold text-purple-900 mb-4">New Admin Account</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Rajan Kumar"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
              <input
                type="email"
                required
                placeholder="admin@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Phone</label>
              <input
                type="text"
                required
                placeholder="10-digit or +91XXXXXXXXXX"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
              >
                {submitting ? 'Creating...' : 'Create Admin'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Admin List */}
      {fetching ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      ) : admins.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <ShieldCheck className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No admin accounts found. Create one above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {admins.map((admin) => (
            <div
              key={admin._id}
              className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                  {admin.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{admin.name}</p>
                  <p className="text-xs text-gray-500">{admin.email}</p>
                  <p className="text-xs text-gray-400">{admin.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full font-medium">
                  Admin
                </span>
                {deleteConfirm === admin._id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-red-600 font-medium">Confirm delete?</span>
                    <button
                      onClick={() => handleDelete(admin._id)}
                      className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg font-medium transition-colors"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg font-medium transition-colors"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(admin._id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    title="Delete admin"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
