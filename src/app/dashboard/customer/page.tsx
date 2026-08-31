'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';

interface RentalOrder {
  id: string;
  gearItem?: {
    title?: string;
    name?: string;
  };
  gearName?: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'PLACED' | 'CONFIRMED' | 'PAID' | 'PICKED_UP' | 'RETURNED' | 'CANCELLED';
}

export default function CustomerDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<RentalOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomerOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/rentals');
      const responseData = res.data.data || res.data.orders || res.data;
      const ordersArray = Array.isArray(responseData) ? responseData : [];
      setOrders(ordersArray);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to load your orders.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600 animate-pulse font-medium">Loading Customer Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Rental Dashboard 🎒</h1>
            <p className="text-gray-500 mt-1 text-sm">Track your gear rentals, process payments, and leave reviews</p>
          </div>
        </div>

        {/* Orders Table Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">Rental Orders</h2>
            <p className="text-sm text-gray-500 mt-0.5">Overview of all your active and past gear requests</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Gear Item</th>
                  <th className="p-4">Rental Dates</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-black">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      You haven't placed any rental orders yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition">
                      <td className="p-4 font-medium">#{order.id.slice(-6)}</td>
                      <td className="p-4 text-gray-900 font-semibold">{order.gearItem?.title || order.gearItem?.name || order.gearName || 'N/A'}</td>
                      <td className="p-4 text-gray-600">
                        {order.startDate.split('T')[0]} to {order.endDate.split('T')[0]}
                      </td>
                      <td className="p-4 font-medium">${order.totalPrice}</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                            order.status === 'PLACED' ? 'bg-amber-100 text-amber-800' :
                            order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'PAID' ? 'bg-purple-100 text-purple-800' :
                            order.status === 'PICKED_UP' ? 'bg-green-100 text-green-800' :
                            order.status === 'RETURNED' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {order.status === 'CONFIRMED' && (
                          <Link
                            href={`/dashboard/customer/orders/${order.id}/pay`}
                            className="inline-block bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded hover:bg-blue-700 transition"
                          >
                            Pay Now
                          </Link>
                        )}
                        {order.status === 'RETURNED' && (
                          <Link
                            href={`/dashboard/customer/orders/${order.id}/review`}
                            className="inline-block bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded hover:bg-black transition"
                          >
                            Leave Review
                          </Link>
                        )}
                        <Link
                          href={`/dashboard/customer/orders/${order.id}`}
                          className="inline-block border border-gray-300 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded hover:bg-gray-50 transition"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}