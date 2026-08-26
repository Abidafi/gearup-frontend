'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function PaymentCancelPage() {
  useEffect(() => {
    toast.error('Payment was cancelled. No charges were made.');
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-red-50 p-6 text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Payment Cancelled ⚠️</h1>
      <p className="text-gray-700 mb-6">Your payment session was aborted. No charges were made.</p>
      
      <div className="flex gap-4">
        <Link 
          href="/dashboard/customer" 
          className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition"
        >
          Go to Dashboard
        </Link>
        <Link 
          href="/gear" 
          className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
        >
          Return to Gear Catalog
        </Link>
      </div>
    </div>
  );
}