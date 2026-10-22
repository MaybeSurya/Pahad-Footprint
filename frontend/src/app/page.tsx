import React from 'react';
import { TripCalculatorForm } from '../components/TripCalculatorForm';
import { TopographicHero } from '../components/TopographicHero';

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Topographic Alpine Hero with Parallax & Stats */}
      <TopographicHero />
      {/* Context Banner */}
      <div className="bg-white border border-slate-200/90 shadow-xs rounded-xl py-3 px-5 flex items-center justify-between flex-wrap gap-2 text-[12.5px]">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-slate-900">
            Uttarakhand Eco-Carbon Accounting Calculator
          </span>
          <span className="text-slate-500 hidden sm:inline">| Live Analytical Engine • Model v1.2-2026</span>
        </div>
        <span className="text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 text-[11.5px]">
          ARAI &amp; IPCC Mountain Data
        </span>
      </div>

      {/* Page Title & Instruction */}
      <div>
        <h1 className="text-[26px] sm:text-[30px] font-extrabold text-slate-900 tracking-tight">
          Configure Your Mountain Itinerary
        </h1>
        <p className="text-[14px] text-slate-600 mt-1.5 max-w-2xl leading-relaxed">
          Results recalculate live as you adjust route corridors, altitudinal fuel burn gradients, vehicle body types, and lodging profiles.
        </p>
      </div>

      {/* Main Interactive Form & Results Grid */}
      <TripCalculatorForm />
    </div>
  );
}
