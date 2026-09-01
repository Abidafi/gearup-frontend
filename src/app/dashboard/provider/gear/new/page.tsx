'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function AddGearPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        // Handle different possible response structures safely
        const rawData = res.data.categories || res.data.data || res.data;
        setCategories(Array.isArray(rawData) ? rawData : []);
      } catch (err) {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      const imageList = typeof data.images === 'string' 
        ? [data.images] 
        : Array.isArray(data.images) ? data.images : [data.imageUrl].filter(Boolean);

      const payload = {
        title: data.title,
        description: data.description,
        brand: data.brand,
        pricePerDay: Number(data.pricePerDay),
        stock: Number(data.stock),
        categoryId: data.categoryId,
        images: imageList,
      };

      await api.post('/provider/gear', payload);
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
          <label className="block text-sm font-medium text-black mb-1">Title</label>
          <input {...register('title')} required placeholder="e.g., Inflatable Stand-Up Paddleboard" className="w-full border p-2 rounded text-black" />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">Category</label>
          <select {...register('categoryId')} required className="w-full border p-2 rounded text-black bg-white">
            <option value="">Select a category</option>
            {Array.isArray(categories) && categories.map((cat) => (
              <option key={cat.id || cat} value={cat.id || cat}>
                {cat.name || cat}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Price Per Day ($)</label>
            <input {...register('pricePerDay')} type="number" step="0.01" required placeholder="30" className="w-full border p-2 rounded text-black" />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">Stock</label>
            <input {...register('stock')} type="number" defaultValue={1} required className="w-full border p-2 rounded text-black" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">Brand</label>
          <input {...register('brand')} required placeholder="e.g., iRocker" className="w-full border p-2 rounded text-black" />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">Description</label>
          <textarea {...register('description')} rows={3} required placeholder="Wide-stance stable SUP kit..." className="w-full border p-2 rounded text-black"></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">Image URL</label>
          <input {...register('images')} required placeholder="https://images.unsplash.com/photo-..." className="w-full border p-2 rounded text-black" />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {isSubmitting ? 'Submitting listing...' : 'Submit Listing'}
        </button>
      </form>
    </div>
  );
}