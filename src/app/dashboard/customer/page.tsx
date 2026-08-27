'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/axios';
import { toast } from 'sonner';

export default function CustomerDashboard() {
  const [rentals, setRentals] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewData, setReviewData] = useState({ gearId: '', rating: 5, comment: '' });
  const [activeTab, setActiveTab] = useState<'orders' | 'payments'>('orders');

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const [rentalsRes, paymentsRes] = await Promise.all([
          api.get('/rentals'),
          api.get('/payments'),
        ]);
        setRentals(rentalsRes.data.rentals || rentalsRes.data);
        setPayments(paymentsRes.data.payments || paymentsRes.data);
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to load customer data.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, []);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/reviews', reviewData);
      toast.success('Review submitted successfully!');
      setReviewData({ gearId: '', rating: 5, comment: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit review.');
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-black">Loading customer dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-black">Customer Dashboard 🎒</h1>
            <p className="text-gray-500 text-sm mt-1">Track your active rentals, order history, and payments</p>
          </div>
          <div className="flex gap-2 bg-white p-1 rounded-lg border shadow-sm">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition ${activeTab === 'orders' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-black'}`}
            >
              Rental Orders
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition ${activeTab === 'payments' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-black'}`}
            >
              Payment History
            </button>
          </div>
        </div>

        {/* Orders Tab Content */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Your Rental Orders</h2>
            </div>
            {rentals.length === 0 ? (
              <div className="p-8 text-center text-gray-500">You have no rental orders yet. Browse gear and start renting!</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Dates</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-sm text-black">
                    {rentals.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50/50">
                        <td className="p-4 font-medium">#{order.id.slice(-6)}</td>
                        <td className="p-4 text-gray-600">{order.startDate} to {order.endDate}</td>
                        <td className="p-4">${order.totalPrice}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                            order.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                            order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {order.status === 'PENDING' && (
                            <Link
                              href={`/dashboard/customer/orders/${order.id}/pay`}
                              className="bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded hover:bg-blue-700 transition"
                            >
                              Pay Now
                            </Link>
                          )}
                          <Link
                            href={`/dashboard/customer/orders/${order.id}`}
                            className="border border-gray-300 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded hover:bg-gray-50 transition"
                          >
                            Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Payments Tab Content */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Payment History</h2>
            </div>
            {payments.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No payment records found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                      <th className="p-4">Payment ID</th>
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-sm text-black">
                    {payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50/50">
                        <td className="p-4 font-medium">#{payment.id.slice(-6)}</td>
                        <td className="p-4 text-gray-600">#{payment.orderId?.slice(-6)}</td>
                        <td className="p-4">${payment.amount}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-700">
                            {payment.status || 'SUCCESS'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <Link
                            href={`/payment/receipt/${payment.id}`}
                            className="text-blue-600 hover:underline text-xs font-semibold"
                          >
                            View Receipt
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Review Submission Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Leave a Review for Returned Gear</h2>
          <form onSubmit={handleReviewSubmit} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gear ID</label>
              <input
                type="text"
                required
                value={reviewData.gearId}
                onChange={(e) => setReviewData({ ...reviewData, gearId: e.target.value })}
                placeholder="Enter Gear ID"
                className="w-full border rounded-lg p-2.5 text-sm text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
              <select
                value={reviewData.rating}
                onChange={(e) => setReviewData({ ...reviewData, rating: Number(e.target.value) })}
                className="w-full border rounded-lg p-2.5 text-sm text-black"
              >
                <option value={5}>5 - Excellent</option>
                <option value={4}>4 - Good</option>
                <option value={3}>3 - Average</option>
                <option value={2}>2 - Poor</option>
                <option value={1}>1 - Terrible</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
              <textarea
                rows={3}
                required
                value={reviewData.comment}
                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                placeholder="How was your experience with the gear?"
                className="w-full border rounded-lg p-2.5 text-sm text-black"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
            >
              Submit Review
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}