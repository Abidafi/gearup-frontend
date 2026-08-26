'use client';

import { useForm } from 'react-hook-form';
import { api } from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function AddGearPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  const onSubmit = async (data: any) => {
    try {
      await api.post('/provider/gear', data);
      toast.success('Gear listing added successfully!');
      router.push('/dashboard/provider');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to add gear listing. Please try again.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto bg-white shadow rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-6 text-black">Add New Gear Listing</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-black">Title</label>
          <input {...register('title')} required className="w-full border p-2 rounded text-black" />
        </div>
        <div>
          <label className="block text-sm font-medium text-black">Category</label>
          <input {...register('category')} required className="w-full border p-2 rounded text-black" />
        </div>
        <div>
          <label className="block text-sm font-medium text-black">Price Per Day ($)</label>
          <input {...register('pricePerDay')} type="number" required className="w-full border p-2 rounded text-black" />
        </div>
        <div>
          <label className="block text-sm font-medium text-black">Image URL</label>
          <input {...register('imageUrl')} required className="w-full border p-2 rounded text-black" />
        </div>
        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {isSubmitting ? 'Submitting listing...' : 'Submit Listing'}
        </button>
      </form>
    </div>
  );
}