'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { User } from '@/types';

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/users').then((res) => {
      setUsers(res.data.users || res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-10 text-center text-black">Loading administration metrics...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-black mb-6">Admin Platform Dashboard 🛡️</h1>
      <div className="bg-white shadow rounded-lg overflow-hidden border">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b text-gray-700 text-sm">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y text-black text-sm">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="p-4 font-semibold">{u.name}</td>
                <td className="p-4">{u.email}</td>
                <td className="p-4">{u.role}</td>
                <td className="p-4">{(u as any).status || 'ACTIVE'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}