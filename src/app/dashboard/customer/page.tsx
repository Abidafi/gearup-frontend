'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { RentalOrder } from '@/types';
import Link from 'next/link';

export default function CustomerDashboard() {
  const [orders, setOrders] = useState<RentalOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get('/rentals')
      .then((res) => {
        setOrders(res.data.rentals || res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch rentals:', err);
        setError('Failed to load your rental history. Please try again later.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-10 text-center text-black">Loading your rentals...</div>;
  }

  if (error) {
    return <div className="p-10 text-center text-red-600 font-medium">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-black mb-6">Customer Dashboard - Order History</h1>
      
      {orders.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center text-gray-500 border">
          You don&apos;t have any rental orders yet.
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden border">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b text-gray-700 text-sm">
                <th className="p-4">Order ID</th>
                <th className="p-4">Dates</th>
                <th className="p-4">Total Price</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y text-black text-sm">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="p-4 font-mono text-xs">{order.id}</td>
                  <td className="p-4">{order.startDate} to {order.endDate}</td>
                  <td className="p-4">${order.totalPrice}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded text-xs font-bold bg-blue-100 text-blue-800">
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {order.status === 'CONFIRMED' && (
                      <Link 
                        href={`/dashboard/customer/orders/${order.id}/pay`} 
                        className="bg-purple-600 text-white px-3 py-1 rounded text-xs hover:bg-purple-700 inline-block"
                      >
                        Pay Now
                      </Link>
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