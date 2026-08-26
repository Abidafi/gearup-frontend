'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '@/lib/validations/auth';
import { api } from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const res = await api.post('/auth/register', data);
      
      // If your backend returns a token upon registration, we can set it and auto-login:
      if (res.data?.token) {
        const token = res.data.token;
        localStorage.setItem('token', token);
        document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
        
        if (res.data?.user) {
          localStorage.setItem('user', JSON.stringify(res.data.user));
          const role = res.data.user.role;
          toast.success('Registration successful! Welcome.');
          
          if (role === 'ADMIN') router.push('/dashboard/admin');
          else if (role === 'PROVIDER') router.push('/dashboard/provider');
          else router.push('/dashboard/customer');
          return;
        }
      }

      // Fallback if backend requires explicit login after register
      toast.success('Registration successful! Please login to continue.');
      router.push('/auth/login');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-900">Create an Account 🏋️</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input {...register('name')} type="text" className="mt-1 w-full rounded-md border p-2 text-black" />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input {...register('email')} type="email" className="mt-1 w-full rounded-md border p-2 text-black" />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input {...register('password')} type="password" className="mt-1 w-full rounded-md border p-2 text-black" />
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select {...register('role')} className="mt-1 w-full rounded-md border p-2 text-black bg-white">
              <option value="CUSTOMER">Customer</option>
              <option value="PROVIDER">Provider</option>
              <option value="ADMIN">Admin</option>
            </select>
            {errors.role && <p className="text-xs text-red-500">{errors.role.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full rounded-md bg-blue-600 py-2 text-white font-semibold hover:bg-blue-700">
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}