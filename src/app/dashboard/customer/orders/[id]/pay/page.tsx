'use client';

import { useState, use } from 'react';
import { api } from '@/lib/axios';
import { toast } from 'sonner';

export default function PaymentInitiationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;
  const [loading, setLoading] = useState(false);

  const handleStripeCheckout = async () => {
    try {
      setLoading(true);
      const res = await api.post('/payments/create', { orderId });
      
      // Redirect to Stripe Checkout session URL or payment gateway URL returned by backend
      const checkoutUrl = res.data.url || res.data.checkoutUrl;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        toast.error('Payment gateway session URL not received.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to initiate payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-xl shadow-sm border max-w-md w-full text-center space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-black">Complete Your Payment 💳</h1>
          <p className="text-gray-500 text-sm mt-1">Secure checkout via Stripe for Order #{orderId.slice(-6)}</p>
        </div>

        <div className="border-t border-b py-4 text-left space-y-2">
          <div className="flex justify-between text-sm text-black">
            <span className="text-gray-600">Order Reference:</span>
            <span className="font-semibold">#{orderId}</span>
          </div>
          <div className="flex justify-between text-sm text-black">
            <span className="text-gray-600">Gateway Provider:</span>
            <span className="font-semibold">Stripe Checkout</span>
          </div>
        </div>

        <button
          onClick={handleStripeCheckout}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Redirecting to Checkout...' : 'Proceed to Stripe Payment'}
        </button>
      </div>
    </div>
  );
}