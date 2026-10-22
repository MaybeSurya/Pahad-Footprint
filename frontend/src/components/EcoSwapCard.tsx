'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingDown, Info } from 'lucide-react';
import { CalculationOutput } from '../types';

interface EcoSwapCardProps {
  ecoSwap: CalculationOutput['ecoSwap'];
  currentPerPerson: number;
}

export const EcoSwapCard: React.FC<EcoSwapCardProps> = ({ ecoSwap, currentPerPerson }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
    >
      {/* Decorative Emerald Accent Strip */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-600" />

      <div className="pl-2">
        <div className="flex items-center gap-3 mb-3.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 flex-shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-slate-900">Verified Eco-Swap Alternative</h3>
            <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              {ecoSwap.recommendedTransport.split('(')[0]} + {ecoSwap.recommendedStay.split('(')[0]}
            </p>
          </div>
        </div>

        {/* Primary Savings Box */}
        <div className="bg-emerald-50/60 rounded-xl p-4 mb-3 border border-emerald-200/80">
          <div className="flex items-center gap-1.5 text-[14px] font-bold text-emerald-800 mb-1">
            <TrendingDown className="w-4 h-4 text-emerald-600" />
            <span>
              Emissions drop from {currentPerPerson.toFixed(1)} kg to {ecoSwap.newPerPersonCo2e.toFixed(1)} kg CO₂e/person (−{ecoSwap.percentageReduction}%)
            </span>
          </div>
          <p className="text-[12.5px] text-slate-600 leading-relaxed">
            Switching to public transport and an eco-homestay lowers your emissions to{' '}
            <strong className="text-slate-900">{ecoSwap.newPerPersonCo2e.toFixed(1)} kg CO₂e/person</strong> ({ecoSwap.newTotalCo2e.toFixed(1)} kg whole trip) — saving{' '}
            <strong className="text-emerald-700 font-semibold">{ecoSwap.savingsPerPerson.toFixed(1)} kg CO₂e</strong> per person, achieving a {ecoSwap.percentageReduction}% net reduction.
          </p>
        </div>

        {/* Uttarakhand Green Cess Note */}
        <div className="bg-amber-50/60 rounded-xl p-3.5 flex items-start gap-2.5 border border-amber-200/80">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-[11.5px] text-slate-600 leading-relaxed">
            <strong className="text-slate-900">Potential Travel-Cost Saving:</strong> Switching from an eligible out-of-state private vehicle to shared public transit avoids the{' '}
            <strong className="text-amber-800 font-semibold">₹{ecoSwap.greenCessAmountInr} vehicle-entry Green Cess</strong> (under Uttarakhand Transport Dept. May 2025 notification; subject to notified exemptions).
          </p>
        </div>
      </div>
    </motion.div>
  );
};
