'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { toast } from 'sonner';

export default function LeaveReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;
  const router = useRouter();

  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post('/reviews', {
        orderId,
        rating,
        comment,
      });
      toast.success('Thank you! Your review has been submitted successfully.');
      router.push('/dashboard/customer');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-xl shadow-sm border max-w-lg w-full space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-black">Leave a Review ⭐</h1>
          <p className="text-gray-500 text-sm mt-1">Share your experience for order #{orderId.slice(-6)}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1 to 5 Stars)</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full border rounded-lg p-2.5 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>⭐⭐⭐⭐⭐ (5 - Excellent)</option>
              <option value={4}>⭐⭐⭐⭐ (4 - Good)</option>
              <option value={3}>⭐⭐⭐ (3 - Average)</option>
              <option value={2}>⭐⭐ (2 - Poor)</option>
              <option value={1}>⭐ (1 - Terrible)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Feedback</label>
            <textarea
              rows={4}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How was the gear condition, pickup, and overall rental process?"
              className="w-full border rounded-lg p-2.5 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Submitting Review...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
}