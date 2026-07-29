'use client';

import Link from 'next/link';

export default function ProviderDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-black">Provider Dashboard 🏪</h1>
        <Link href="/dashboard/provider/gear/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">
          + Add New Gear
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-gray-500 text-sm font-semibold">Inventory Listed</h3>
          <p className="text-3xl font-bold text-black mt-2">Active</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-gray-500 text-sm font-semibold">Incoming Orders</h3>
          <p className="text-3xl font-bold text-black mt-2">Manage</p>
        </div>
      </div>
    </div>
  );
}