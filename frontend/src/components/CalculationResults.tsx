'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  MountainSnow,
  TrendingUp,
  Scale,
} from 'lucide-react';
import { CalculationOutput, CalculationInput } from '../types';
import { EmissionsVisualizer } from './EmissionsVisualizer';

interface CalculationResultsProps {
  result: CalculationOutput;
  input: CalculationInput;
}

export const CalculationResults: React.FC<CalculationResultsProps> = ({ result, input }) => {
  const { perPersonCo2e, totalCo2e, terrainAdjustment, impactSeverity } = result;

  const severityBadge = {
    low: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      label: '✓ Low Mountain Impact (<30 kg)',
      dot: 'bg-emerald-500',
    },
    moderate: {
      bg: 'bg-amber-50 text-amber-900 border-amber-200',
      label: '⚠ Moderate Mountain Impact (30–75 kg)',
      dot: 'bg-amber-500',
    },
    high: {
      bg: 'bg-rose-50 text-rose-800 border-rose-200',
      label: '⛰ High Mountain Impact (>75 kg)',
      dot: 'bg-rose-500',
    },
  }[impactSeverity];

  const terrainName =
    input.terrainZone === 'foothills'
      ? 'Foothills'
      : input.terrainZone === 'mid_hills'
      ? 'Mid-Hills'
      : 'High Altitude';

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5"
    >
      {/* Header & Impact Severity Badge */}
      <div className="flex items-center justify-between flex-wrap gap-2.5 pb-2 border-b border-slate-100">
        <div>
          <span className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-emerald-600" strokeWidth={2} />
            Verified Impact Assessment
          </span>
          <h3 className="text-[17px] font-bold text-slate-900 mt-0.5">
            Carbon Footprint Summary
          </h3>
        </div>

        <motion.span
          key={impactSeverity}
          initial={{ scale: 0.95, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px] font-semibold border ${severityBadge.bg}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${severityBadge.dot}`} />
          {severityBadge.label}
        </motion.span>
      </div>

      {/* Dual Metric Display Containers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl p-5">
        <div>
          <p className="text-[12px] font-semibold text-slate-600 flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-emerald-600" />
            Per Person Burden
          </p>
          <div className="flex items-baseline gap-1 mt-1.5">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={perPersonCo2e.toFixed(1)}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2 }}
                className="text-[34px] sm:text-[38px] font-extrabold text-slate-900 tracking-tight leading-none"
              >
                {perPersonCo2e.toFixed(1)}
              </motion.span>
            </AnimatePresence>
            <span className="text-[13px] font-bold text-slate-500">kg CO₂e</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Normalized individual passenger allocation</p>
        </div>

        <div className="sm:pl-4 sm:border-l border-slate-200 pt-3 sm:pt-0 border-t sm:border-t-0">
          <p className="text-[12px] font-semibold text-slate-600 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
            Whole Trip ({input.passengers} {input.passengers === 1 ? 'Traveler' : 'Travelers'})
          </p>
          <div className="flex items-baseline gap-1 mt-1.5">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={totalCo2e.toFixed(1)}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2 }}
                className="text-[30px] sm:text-[32px] font-bold text-slate-900 tracking-tight leading-none"
              >
                {totalCo2e.toFixed(1)}
              </motion.span>
            </AnimatePresence>
            <span className="text-[13px] font-bold text-slate-500">kg CO₂e</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Cumulative convoy emissions total</p>
        </div>
      </div>

      {/* Terrain Elevation Multiplier Chip */}
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3.5 flex items-start gap-2.5 text-[12px] text-slate-700">
        <MountainSnow className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
        <span className="leading-relaxed">
          Includes <strong className="text-slate-900">+{terrainAdjustment.uphillDeltaPerPerson.toFixed(1)} kg/person</strong> (+{terrainAdjustment.uphillDeltaTotal.toFixed(1)} kg total) from the{' '}
          <strong className="text-blue-800 font-semibold">{terrainAdjustment.multiplier.toFixed(2)}× {terrainName}</strong> gradient fuel adjustment.
        </span>
      </div>

      {/* Interactive Visual Element: Bar Graph & Pie Chart Switcher */}
      <EmissionsVisualizer result={result} input={input} />
    </motion.div>
  );
};
