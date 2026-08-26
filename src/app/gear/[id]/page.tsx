'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { GearItem as Gear } from '@/types';
import Image from 'next/image';
import { toast } from 'sonner';

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
          setGear(res.data.gear || res.data);
          setLoading(false);
        })
        .catch((err: any) => {
          toast.error('Failed to load gear details.');
          setLoading(false);
        });
    }
  }, [id]);

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

  if (loading) return <div className="p-10 text-center text-black">Loading gear details...</div>;
  if (!gear) return <div className="p-10 text-center text-black">Gear equipment not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border grid grid-cols-1 md:grid-cols-2">
        <div className="relative h-72 md:h-full bg-gray-200">
          <Image src={gear.images?.[0] || '/placeholder.png'} alt={gear.title} fill className="object-cover" />
        </div>
        <div className="p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase text-blue-600">
              {typeof gear.category === 'object' ? (gear.category as any)?.name : gear.category}
            </span>
            <h1 className="text-3xl font-bold text-black mt-1">{gear.title}</h1>
            <p className="text-2xl font-extrabold text-blue-600 mt-2">
              ${gear.pricePerDay} <span className="text-sm font-normal text-gray-500">/ day</span>
            </p>
            <p className="text-gray-600 mt-4 text-sm">{gear.description}</p>
          </div>

          <div className="mt-6 border-t pt-4 space-y-3">
            <h3 className="font-semibold text-black">Select Rental Dates</h3>
            <div>
              <label className="block text-xs text-gray-600">Start Date</label>
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
                className="w-full border p-2 rounded text-black" 
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600">End Date</label>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
                className="w-full border p-2 rounded text-black" 
              />
            </div>
            <button 
              onClick={handleRentNow} 
              disabled={submitting}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {submitting ? 'Processing Rental...' : 'Rent Now & Proceed'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}