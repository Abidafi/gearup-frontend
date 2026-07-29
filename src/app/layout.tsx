'use client';

import './globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Toaster } from 'sonner'; // <-- Import Sonner toaster

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/auth/login');
  };

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <Toaster richColors position="top-right" /> {/* <-- Added Toaster component */}
          <nav className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
            <Link href="/" className="text-xl font-bold tracking-wider">GearUp 🏋️</Link>
            <div className="flex gap-4 items-center">
              <Link href="/gear" className="hover:text-blue-400">Browse Gear</Link>
              {user ? (
                <>
                  <Link href={`/dashboard/${user.role.toLowerCase()}`} className="hover:text-blue-400">
                    Dashboard ({user.role})
                  </Link>
                  <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded text-sm hover:bg-red-700 font-semibold">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="hover:text-blue-400">Login</Link>
                  <Link href="/auth/register" className="bg-blue-600 px-4 py-2 rounded font-semibold hover:bg-blue-500">Register</Link>
                </>
              )}
            </div>
          </nav>
          <main>{children}</main>
        </QueryClientProvider>
      </body>
    </html>
  );
}