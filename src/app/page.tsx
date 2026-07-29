import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-white p-6">
      <h1 className="text-5xl font-extrabold mb-4 text-center">Rent Sports & Outdoor Gear Instantly 🏋️</h1>
      <p className="text-lg text-slate-300 mb-8 text-center max-w-xl">
        Explore high-quality gear from trusted local providers. Book securely and start your adventure today.
      </p>
      <div className="flex gap-4">
        <Link href="/gear" className="rounded-lg bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500">
          Browse Gear
        </Link>
        <Link href="/auth/login" className="rounded-lg bg-slate-700 px-6 py-3 font-semibold hover:bg-slate-600">
          Login / Register
        </Link>
      </div>
    </div>
  );
}