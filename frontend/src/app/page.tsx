import React from 'react';
import { TripCalculatorForm } from '../components/TripCalculatorForm';

export default function HomePage() {
  return (
    <div className="space-y-6">
      {/* Context Banner */}
      <div className="bg-[#EDF6F0] border border-[#D8E8DF] rounded-card py-3 px-5 flex items-center justify-between flex-wrap gap-2 text-[12.5px]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
          <span className="font-bold text-[#1B4332]">
            Uttarakhand Eco-Carbon Accounting Calculator
          </span>
          <span className="text-[#4B5563]">| Live Analytical Engine • Model v1.2-2026</span>
        </div>
        <span className="text-[#1B4332] font-semibold">
          Grounded in ARAI &amp; IPCC Mountain Data
        </span>
      </div>

      {/* Page Title */}
      <div>
        <h1 className="text-[24px] sm:text-[28px] font-bold text-[#111827] tracking-tight">
          Configure Your Mountain Itinerary
        </h1>
        <p className="text-[14px] text-[#4B5563] mt-1">
          Results recalculate live as you adjust route, altitude gradients, vehicle mode, and lodging profiles.
        </p>
      </div>

      {/* Main Interactive Form & Results Grid */}
      <TripCalculatorForm />
    </div>
  );
}
