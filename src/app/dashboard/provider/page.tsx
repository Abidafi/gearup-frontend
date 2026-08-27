'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/axios';
import { toast } from 'sonner';

export default function ProviderDashboard() {
  const [gearList, setGearList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        const res = await api.get('/provider/gear');
        setGearList(res.data.gear || res.data);
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to load your inventory.');
      } finally {
        setLoading(false);
      }
    };

    fetchProviderData();
  }, []);

  const handleDelete = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this gear listing?')) return;

    try {
      await api.delete(`/provider/gear/${id}`);
      setGearList((prev) => prev.filter((item) => item.id !== id));
      toast.success('Gear listing deleted successfully.');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete gear listing.');
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-black">Loading provider dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-black">Provider Dashboard 🏪</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your gear listings and track performance</p>
          </div>
          <div className="flex gap-3">
            <Link 
              href="/dashboard/provider/orders" 
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Manage Orders
            </Link>
            <Link 
              href="/dashboard/provider/gear/new" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              + Add New Gear
            </Link>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-gray-500 text-sm font-semibold">Total Inventory Listed</h3>
            <p className="text-3xl font-bold text-black mt-2">{gearList.length}</p>
          </div>
          <Link href="/dashboard/provider/orders" className="bg-white p-6 rounded-lg shadow-sm border block hover:border-blue-500 transition">
            <h3 className="text-gray-500 text-sm font-semibold">Incoming Orders</h3>
            <p className="text-3xl font-bold text-black mt-2">View Orders &rarr;</p>
          </Link>
        </div>

        {/* Inventory Section */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Your Gear Listings</h2>
          </div>

          {gearList.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              You haven&apos;t added any gear listings yet. Click &quot;+ Add New Gear&quot; to get started!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                    <th className="p-4">Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price / Day</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm text-black">
                  {gearList.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="p-4 font-medium">{item.title}</td>
                      <td className="p-4 text-gray-600">{item.category}</td>
                      <td className="p-4">${item.pricePerDay}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-700">
                          {item.status || 'AVAILABLE'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-800 font-medium text-xs px-2.5 py-1 rounded border border-red-200 hover:bg-red-50 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}