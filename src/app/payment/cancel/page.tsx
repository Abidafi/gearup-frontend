'use client';

import Link from 'next/link';

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-red-50 p-6 text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Payment Cancelled ⚠️</h1>
      <p className="text-gray-700 mb-6">Your payment session was aborted. No charges were made.</p>
      <Link href="/gear" className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700">
        Return to Gear Catalog
      </Link>
    </div>
  );
}