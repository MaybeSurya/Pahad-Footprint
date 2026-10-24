import React from 'react';
import Link from 'next/link';
import { Mountain, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-12">
      <div className="w-16 h-16 rounded-2xl bg-[#304B38]/10 text-[#304B38] flex items-center justify-center mb-6 border border-[#304B38]/20">
        <Mountain className="w-8 h-8" />
      </div>

      <span className="font-mono text-xs uppercase tracking-wider text-[#B3834D] mb-2 font-semibold">
        Trail Not Found — 404
      </span>

      <h1 className="text-2xl sm:text-3xl font-bold text-[#242722] mb-3 font-serif">
        Beyond the Surveyed Ridge
      </h1>

      <p className="max-w-md text-sm text-[#51554D] leading-relaxed mb-8">
        The route or ridge coordinate you requested does not exist in our Uttarakhand field index. Return to the main expedition portal to recalculate your journey.
      </p>

      <Link
        href="/"
        className="button-primary px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm"
      >
        <Compass className="w-4 h-4" />
        <span>Return to Field Calculator</span>
      </Link>
    </div>
  );
}
