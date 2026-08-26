'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { GearItem as Gear } from '@/types';
import Image from 'next/image';
import { toast } from 'sonner';
import { Calendar, Tag, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function GearDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [gear, setGear] = useState<Gear | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      api.get(`/gear/${id}`)
        .then((res) => {
          // Robustly unwrap various possible backend response wrappers
          const responseData = res.data?.data || res.data?.gear || res.data?.item || res.data;
          setGear(responseData);
          setLoading(false);
        })
        .catch((err: any) => {
          toast.error('Failed to load gear details.');
          setLoading(false);
        });
    }
  }, [id]);

  // Helper to safely resolve category whether it's a string or an object with a name (matching catalog page)
  const getCategoryName = (gearItem: any) => {
    const cat = gearItem?.category;
    if (!cat) return 'EQUIPMENT';
    if (typeof cat === 'object') return cat.name || cat.title || 'EQUIPMENT';
    return String(cat);
  };

  const handleRentNow = async () => {
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/rentals', {
        gearId: id,
        startDate,
        endDate,
      });
      const rentalId = res.data.rental?.id || res.data.id;
      toast.success('Rental order created successfully!');
      router.push(`/dashboard/customer/orders/${rentalId}/pay`);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to place rental order. Please ensure dates are valid and you are logged in.';
      toast.error(errorMessage);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <span className="font-medium">Loading gear details...</span>
        </div>
      </div>
    );
  }

  if (!gear) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-6 space-y-4">
        <h2 className="text-2xl font-bold">Gear equipment not found.</h2>
        <Link href="/gear" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-semibold transition-all">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const gearTitle = (gear as any).title || (gear as any).name || 'Unnamed Gear';
  const gearImage = 
    (gear as any).images?.[0] || 
    (gear as any).imageUrl || 
    (gear as any).image || 
    '/placeholder.png';
  const pricePerDay = (gear as any).pricePerDay || (gear as any).price || 0;
  const description = (gear as any).description || 'High-performance equipment maintained and verified for safe rentals.';
  const categoryLabel = getCategoryName(gear);

  return (
    <div className="min-h-screen bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Back Link */}
        <Link href="/gear" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-semibold transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Browse Gear
        </Link>

        {/* Main Details Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
          
          {/* Image Container with Robust Fallback */}
          <div className="relative h-80 lg:h-full w-full bg-slate-900">
            <Image 
              src={gearImage} 
              alt={gearTitle} 
              fill 
              className="object-cover" 
              priority
            />
            <div className="absolute top-4 left-4 bg-slate-950/85 backdrop-blur-md border border-slate-800 text-blue-400 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
              <Tag className="h-3.5 w-3.5" /> {categoryLabel}
            </div>
          </div>

          {/* Details & Rental Form Panel */}
          <div className="p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{gearTitle}</h1>
              
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-blue-400">${pricePerDay}</span>
                <span className="text-sm font-medium text-slate-400">/ day</span>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed">
                {description}
              </p>
            </div>

            {/* Date Selection and Actions */}
            <div className="border-t border-slate-900 pt-6 space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" /> Select Rental Dates
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400">Start Date</label>
                  <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)} 
                    className="w-full bg-slate-500 border border-slate-400 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-blue-600 transition-colors" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400">End Date</label>
                  <input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)} 
                    className="w-full bg-slate-500 border border-slate-400 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-blue-600 transition-colors" 
                  />
                </div>
              </div>

              <button 
                onClick={handleRentNow} 
                disabled={submitting}
                className="w-full mt-2 bg-blue-600 hover:bg-blue-500 text-white py-3.5 px-4 rounded-xl font-semibold shadow-lg shadow-blue-600/30 transition-all text-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing Rental...
                  </>
                ) : (
                  'Rent Now & Proceed'
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" /> Verified Equipment & Secure Checkout
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}