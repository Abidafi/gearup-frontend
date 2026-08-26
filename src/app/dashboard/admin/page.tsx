'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status?: string; 
}

interface Stats {
  totalUsers: number;
  activeGear: number;
  totalRentals: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, activeGear: 0, totalRentals: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const usersRes = await api.get('/admin/users', { headers });
      setUsers(usersRes.data.users || usersRes.data);
      
      setStats({
        totalUsers: (usersRes.data.users || usersRes.data).length,
        activeGear: 12, // Replace with actual API call if available
        totalRentals: 25 // Replace with actual API call if available
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Suspend / Activate user action
  const handleStatusToggle = async (userId: string, currentStatus?: string) => {
    const newStatus = currentStatus === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
    try {
      const token = localStorage.getItem('token');
      await api.patch(
        `/admin/users/${userId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`User successfully ${newStatus.toLowerCase()}!`);
      // Update local state to instantly reflect changes
      setUsers(prev =>
        prev.map(u => (u.id === userId ? { ...u, status: newStatus } : u))
      );
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update user status.');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600 animate-pulse">Loading Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard 🛡️</h1>
            <p className="text-gray-500 mt-1">Platform moderation and global overview</p>
          </div>
          <button
            onClick={() => {
              localStorage.clear();
              router.push('/auth/login');
              toast.success('Logged out successfully');
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        {/* Global Platform Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500">Total Users</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500">Active Gear Listings</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeGear}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500">Total Rentals Processed</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalRentals}</p>
          </div>
        </div>

        {/* User Management Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">User Management</h2>
            <p className="text-sm text-gray-500 mt-0.5">View and manage platform accounts</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => {
                    const status = user.status || 'ACTIVE';
                    return (
                      <tr key={user.id} className="hover:bg-gray-50/50 transition">
                        <td className="p-4 font-medium text-gray-900">{user.name}</td>
                        <td className="p-4 text-gray-600">{user.email}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700">
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                              status === 'SUSPENDED'
                                ? 'bg-red-50 text-red-700'
                                : 'bg-green-50 text-green-700'
                            }`}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleStatusToggle(user.id, status)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                              status === 'SUSPENDED'
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                          >
                            {status === 'SUSPENDED' ? 'Activate' : 'Suspend'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}