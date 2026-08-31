'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { toast } from 'sonner';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paymentIntentId = searchParams.get('payment_intent');
  const orderId = searchParams.get('orderId');
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!paymentIntentId || !orderId) {
      setLoading(false);
      return;
    }

    api.post('/payments/confirm', {
      transactionId: paymentIntentId,
      rentalOrderId: orderId,
    })
      .then(() => {
        setConfirmed(true);
        setLoading(false);
        toast.success('Payment confirmed successfully!');
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.response?.data?.message || 'Failed to confirm payment record.');
        setLoading(false);
      });
  }, [paymentIntentId, orderId]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-xl shadow-sm border max-w-md w-full text-center space-y-4">
        {loading ? (
          <div className="py-8 text-gray-500">Verifying your payment...</div>
        ) : confirmed ? (
          <>
            <div className="text-5xl">🎉</div>
            <h1 className="text-2xl font-bold text-black">Payment Successful!</h1>
            <p className="text-gray-500 text-sm">Your rental order has been paid and confirmed successfully.</p>
            <button
              onClick={() => router.push('/dashboard/customer')}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mt-4"
            >
              View My Orders
            </button>
          </>
        ) : (
          <>
            <div className="text-5xl">⚠️</div>
            <h1 className="text-2xl font-bold text-black">Verification Issue</h1>
            <p className="text-gray-500 text-sm">We couldn't verify the payment details automatically.</p>
            <button
              onClick={() => router.push('/dashboard/customer/orders')}
              className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition mt-4"
            >
              Go to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}