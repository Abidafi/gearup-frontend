'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { GearItem } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { SkeletonLoader } from '@/components/SkeletonLoader'; // <-- Import skeleton
import { toast } from 'sonner'; // <-- Import toast

export default function GearCatalogPage() {
  const [gearList, setGearList] = useState<GearItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/gear').then((res) => {
      setGearList(res.data.gear || res.data);
      setLoading(false);
      toast.success('Gear catalog loaded successfully!'); // <-- Success toast notification
    }).catch(() => {
      setLoading(false);
      toast.error('Failed to fetch available gear items.'); // <-- Error toast notification
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-3xl font-bold mb-6 text-black">Available Sports & Outdoor Gear</h1>
        <SkeletonLoader /> {/* <-- Render professional loading skeleton */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6 text-black">Available Sports & Outdoor Gear</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {gearList.map((gear) => (
          <div key={gear.id} className="bg-white rounded-lg shadow-md overflow-hidden border">
            <div className="relative h-48 w-full bg-gray-200">
              <Image src={gear.images?.[0] || '/placeholder.png'} alt={gear.title} fill className="object-cover" />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-black">{gear.title}</h3>
              <p className="text-gray-600 text-sm mt-1">${gear.pricePerDay} / day</p>
              <Link href={`/gear/${gear.id}`} className="mt-4 block text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                View Details & Rent
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}