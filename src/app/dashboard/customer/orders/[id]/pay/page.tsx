'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { api } from '@/lib/axios';

export default function PaymentPage() {
  const { id } = useParams(); // This is the rentalOrderId
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStripeCheckout = async () => {
    try {
      setLoading(true);
      setError('');

      // Call your backend endpoint that initializes the Stripe checkout session
      const res = await api.post('/payments/create', { 
        rentalOrderId: id 
      });

      // Assuming your backend returns the Stripe checkout URL or session URL
      const checkoutUrl = res.data.url || res.data.paymentUrl || res.data.data?.url;

      if (checkoutUrl) {
        window.location.href = checkoutUrl; // Redirect to live Stripe Checkout
      } else {
        throw new Error('Stripe checkout URL not returned from backend.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to initialize Stripe payment. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow border text-center">
        <h1 className="text-2xl font-bold text-black mb-2">Complete Your Payment 💳</h1>
        <p className="text-gray-600 text-sm mb-6">Secure checkout powered by Stripe.</p>

        {error && (
          <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <button
          onClick={handleStripeCheckout}
          disabled={loading}
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
        >
          {loading ? 'Redirecting to Stripe...' : 'Pay Securely with Stripe'}
        </button>
      </div>
    </div>
  );
}