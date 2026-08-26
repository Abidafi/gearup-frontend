'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { api } from '@/lib/axios';
import { toast } from 'sonner';

export default function PaymentPage() {
  const { id } = useParams(); // This is the rentalOrderId
  const [loading, setLoading] = useState(false);

  const handleStripeCheckout = async () => {
    try {
      setLoading(true);

      // Call your backend endpoint that initializes the Stripe checkout session
      const res = await api.post('/payments/create', { 
        rentalOrderId: id 
      });

      // Assuming your backend returns the Stripe checkout URL or session URL
      const checkoutUrl = res.data.url || res.data.paymentUrl || res.data.data?.url;

      if (checkoutUrl) {
        toast.success('Redirecting to secure checkout...');
        window.location.href = checkoutUrl; // Redirect to live Stripe Checkout
      } else {
        throw new Error('Stripe checkout URL not returned from backend.');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to initialize Stripe payment. Please try again.';
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow border text-center">
        <h1 className="text-2xl font-bold text-black mb-2">Complete Your Payment 💳</h1>
        <p className="text-gray-600 text-sm mb-6">Secure checkout powered by Stripe.</p>

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