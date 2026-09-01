'use client';

import { useState, use, useEffect } from 'react';
import { api } from '@/lib/axios';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Loader2, Star, ShieldCheck, Calendar, Quote, Tag } from 'lucide-react';

interface ReviewData {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  gearItem?: {
    title?: string;
    name?: string;
    images?: string[];
    imageUrl?: string;
    image?: string;
    pricePerDay?: number;
    price?: number;
    category?: any;
  };
}

export default function ReviewDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const [review, setReview] = useState<ReviewData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (orderId) {
      api.get(`/reviews/order/${orderId}`)
        .then((res) => {
          setReview(res.data?.data || res.data);
          setLoading(false);
        })
        .catch((err: any) => {
          toast.error(err.response?.data?.message || 'Failed to load review details.');
          setLoading(false);
        });
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <span className="font-medium">Loading review details...</span>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center space-y-4">
        <p className="text-slate-400">Review not found or not yet submitted.</p>
        <Link href="/dashboard/customer" className="text-blue-400 hover:underline text-sm font-semibold">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const gear = review.gearItem || {};
  const gearTitle = gear.title || gear.name || 'Rental Item';
  const gearImage = gear.images?.[0] || gear.imageUrl || gear.image || '/placeholder.png';
  const formattedDate = new Date(review.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <Link 
          href="/dashboard/customer" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-semibold transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <div className="bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-8">
          
          {/* Header & Product Summary */}
          <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-slate-800 pb-6">
            <div className="relative h-28 w-28 shrink-0 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800">
              <Image src={gearImage} alt={gearTitle} fill className="object-cover" />
            </div>
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-semibold text-slate-400">Order #{orderId.slice(-6)}</span>
              <h1 className="text-2xl font-extrabold text-white">{gearTitle}</h1>
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-400">
                <Calendar className="h-3.5 w-3.5 text-blue-400" /> Submitted on {formattedDate}
              </div>
            </div>
          </div>

          {/* Rating Display */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Your Rating</span>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 ${
                    star <= review.rating
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-700 fill-slate-800'
                  }`}
                />
              ))}
              <span className="ml-2 text-lg font-bold text-white">{review.rating} / 5</span>
            </div>
          </div>

          {/* Review Comment Box */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Your Feedback</span>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative">
              <Quote className="h-8 w-8 text-slate-800 absolute top-4 right-4" />
              <p className="text-slate-200 text-sm leading-relaxed relative z-10 whitespace-pre-line">
                {review.comment}
              </p>
            </div>
          </div>

          {/* Footer Badge */}
          <div className="flex items-center justify-between border-t border-slate-900 pt-6">
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="h-4 w-4" /> Verified Rental Review
            </div>
            <Link
              href={`/dashboard/customer/orders/${orderId}`}
              className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              View Order Details →
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}