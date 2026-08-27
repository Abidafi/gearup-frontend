'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { toast } from 'sonner';

interface Order {
  id: string;
  gearName: string;
  renterName: string;
  startDate: string;
  endDate: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  totalPrice: number;
}

export default function ProviderOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/provider/orders');
      setOrders(res.data.orders || res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch incoming orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/provider/orders/${id}`, { status: newStatus });
      toast.success(`Order status updated to ${newStatus.toLowerCase()}`);
      fetchOrders();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error updating order status');
    }
  };

  if (loading) return <div className="p-10 text-center text-black">Loading incoming orders...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-black">Manage Incoming Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No incoming rental orders found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gear</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Renter</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-black text-sm">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">#{order.id.slice(-6)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{order.gearName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{order.renterName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {order.startDate} to {order.endDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">${order.totalPrice}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    {order.status === 'PENDING' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'CONFIRMED')}
                        className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded border border-green-200"
                      >
                        Confirm
                      </button>
                    )}
                    {order.status === 'CONFIRMED' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'COMPLETED')}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded border border-blue-200"
                      >
                        Complete
                      </button>
                    )}
                    {order.status !== 'CANCELLED' && order.status !== 'COMPLETED' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'CANCELLED')}
                        className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded border border-red-200"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}