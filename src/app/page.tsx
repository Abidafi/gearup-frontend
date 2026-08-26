import Link from 'next/link';
import { ShieldCheck, Truck, Clock, ArrowRight, Dumbbell } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative grow flex items-center justify-center bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 px-4 py-20 sm:py-32 text-center overflow-hidden">
        {/* Background glow effect */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-125 h-125 bg-blue-600 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-950/80 border border-blue-800/60 text-blue-300 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide shadow-inner">
            <Dumbbell className="h-4 w-4" /> Premium Fitness & Outdoor Rentals
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Rent Sports & Outdoor Gear <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-500">Instantly 🏋️</span>
          </h1>
          
          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Explore high-quality gear from trusted local providers. Book securely, track your rentals, and start your fitness adventure today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/gear"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-bold text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
            >
              Browse Gear Catalog <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/auth/register"
              className="w-full sm:w-auto flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 px-8 py-4 font-bold text-slate-200 border border-slate-700 transition-all"
            >
              Join as Provider / Customer
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="bg-slate-950 py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-3">
            <div className="bg-blue-600/10 border border-blue-500/20 w-12 h-12 rounded-xl flex items-center justify-center text-blue-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Verified Local Providers</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Every gear item is listed and maintained by trusted providers with transparent ratings and reviews.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-3">
            <div className="bg-blue-600/10 border border-blue-500/20 w-12 h-12 rounded-xl flex items-center justify-center text-blue-400">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Flexible Rental Periods</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Rent gear for a single day, a weekend, or a full month with automated date calculations and secure checkout.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-3">
            <div className="bg-blue-600/10 border border-blue-500/20 w-12 h-12 rounded-xl flex items-center justify-center text-blue-400">
              <Truck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Seamless Stripe Payments</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Instant payment processing with secure gateway redirection, instant confirmations, and live rental status updates.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}