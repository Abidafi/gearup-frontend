'use client';

import { useState, use, useEffect } from 'react';
import { api } from '@/lib/axios';
import { toast } from 'sonner';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

function CheckoutForm({ orderId }: { orderId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success?orderId=${orderId}`,
      },
    });

    if (result.error) {
      toast.error(result.error.message || 'Payment failed.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? 'Processing Payment...' : 'Pay Now'}
      </button>
    </form>
  );
}

export default function PaymentInitiationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!stripeKey) {
      toast.error('Stripe publishable key is missing in environment variables.');
    }

    api.post('/payments/create', { rentalOrderId: orderId })
      .then((res) => {
        const secret = res.data?.data?.clientSecret || res.data?.clientSecret;
        if (secret) {
          setClientSecret(secret);
        } else {
          toast.error('Client secret not received.');
        }
        setLoading(false);
      })
      .catch((err: any) => {
        toast.error(err.response?.data?.message || 'Failed to initialize payment intent.');
        setLoading(false);
      });
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-xl shadow-sm border max-w-md w-full space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-black">Complete Your Payment 💳</h1>
          <p className="text-gray-500 text-sm mt-1">Secure checkout via Stripe for Order #{orderId.slice(-6)}</p>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Initializing secure payment...</div>
        ) : clientSecret && stripePromise ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm orderId={orderId} />
          </Elements>
        ) : (
          <div className="text-center py-8 text-red-500">Could not load payment gateway. Check configuration keys.</div>
        )}
      </div>
    </div>
  );
}