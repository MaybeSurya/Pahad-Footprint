'use client';

import React from 'react';
import { CalculationOutput } from '../types';

interface EcoSwapCardProps {
  ecoSwap: CalculationOutput['ecoSwap'];
  currentPerPerson: number;
}

export const EcoSwapCard: React.FC<EcoSwapCardProps> = ({ ecoSwap, currentPerPerson }) => {
  return (
    <div className="relative overflow-hidden bg-white border border-[#D8E8DF] rounded-card p-5 shadow-card">
      {/* Decorative Forest Accent Strip */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#1B4332]" />

      <div className="pl-2">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-btn bg-[#1B4332]/10 flex items-center justify-center text-[#1B4332] flex-shrink-0">
            <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-[#111827]">Verified Eco-Swap Alternative</h3>
            <p className="text-[11px] font-bold text-[#1B4332] uppercase tracking-wider">
              {ecoSwap.recommendedTransport.split('(')[0]} + {ecoSwap.recommendedStay.split('(')[0]}
            </p>
          </div>
        </div>

        {/* Primary Savings Box */}
        <div className="bg-[#EDF6F0] rounded-lg p-3.5 mb-3 border border-[#D8E8DF]">
          <p className="text-[14px] font-bold text-[#1B4332] mb-1">
            Emissions drop from {currentPerPerson.toFixed(1)} kg to {ecoSwap.newPerPersonCo2e.toFixed(1)} kg CO₂e/person (−{ecoSwap.percentageReduction}%)
          </p>
          <p className="text-[12px] text-[#4B5563] leading-relaxed">
            Switching to public transport and an eco-homestay lowers your emissions to{' '}
            <strong className="text-[#111827]">{ecoSwap.newPerPersonCo2e.toFixed(1)} kg CO₂e/person</strong> ({ecoSwap.newTotalCo2e.toFixed(1)} kg whole trip) — saving{' '}
            <strong className="text-[#1B4332]">{ecoSwap.savingsPerPerson.toFixed(1)} kg CO₂e</strong> per person, achieving a {ecoSwap.percentageReduction}% net reduction.
          </p>
        </div>

        {/* Uttarakhand Green Cess Note */}
        <div className="bg-[#EDF6F0] rounded-lg p-3 flex items-start gap-2.5 border border-[#D8E8DF]">
          <svg className="w-4 h-4 text-[#C85A32] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-[11.5px] text-[#4B5563] leading-relaxed">
            <strong className="text-[#111827]">Potential Travel-Cost Saving:</strong> Switching from an eligible out-of-state private vehicle to shared public transit avoids the{' '}
            <strong className="text-[#1B4332]">₹{ecoSwap.greenCessAmountInr} vehicle-entry Green Cess</strong> (under Uttarakhand Transport Dept. May 2025 notification; subject to notified exemptions).
          </p>
        </div>
      </div>
    </div>
  );
};
