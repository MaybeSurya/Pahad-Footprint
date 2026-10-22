'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  MountainSnow,
  TrendingUp,
  Trees,
  ShieldCheck,
  Scale,
  CarFront,
  Hotel,
  Leaf,
} from 'lucide-react';
import { CalculationOutput, CalculationInput } from '../types';

interface CalculationResultsProps {
  result: CalculationOutput;
  input: CalculationInput;
}

export const CalculationResults: React.FC<CalculationResultsProps> = ({ result, input }) => {
  const { perPersonCo2e, totalCo2e, breakdown, terrainAdjustment, impactSeverity } = result;

  const severityBadge = {
    low: {
      bg: 'bg-[#C1ECD4]/80 text-[#002114] border-[#A3CCA9]',
      label: '✓ Low Mountain Impact (<30 kg)',
      dot: 'bg-[#10B981]',
    },
    moderate: {
      bg: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]',
      label: '⚠ Moderate Mountain Impact (30–75 kg)',
      dot: 'bg-[#F59E0B]',
    },
    high: {
      bg: 'bg-[#FFDAD6] text-[#BA1A1A] border-[#FECACA]',
      label: '⛰ High Mountain Impact (>75 kg)',
      dot: 'bg-[#EF4444]',
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
      className="bg-[#EDF6F0] border border-[#D8E8DF] rounded-2xl p-5 shadow-card"
    >
      {/* Header & Impact Severity Badge */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <span className="text-[12px] font-bold text-[#4B5563] uppercase tracking-wider flex items-center gap-1.5">
          <BarChart3 className="w-4 h-4 text-[#1B4332]" strokeWidth={2} />
          Estimated Carbon Footprint
        </span>
        <motion.span
          key={impactSeverity}
          initial={{ scale: 0.95, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px] font-bold border backdrop-blur-sm ${severityBadge.bg}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${severityBadge.dot}`} />
          {severityBadge.label}
        </motion.span>
      </div>

      {/* Dual Metric Display Containers */}
      <div className="grid grid-cols-2 gap-4 bg-white border border-[#D8E8DF] rounded-2xl p-5 mb-4 shadow-sm">
        <div>
          <p className="text-[12px] font-semibold text-[#4B5563] flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-[#1B4332]" />
            Per Person
          </p>
          <div className="flex items-baseline gap-1 mt-1.5">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={perPersonCo2e.toFixed(1)}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2 }}
                className="text-[34px] sm:text-[38px] font-extrabold text-[#111827] tracking-tight leading-none"
              >
                {perPersonCo2e.toFixed(1)}
              </motion.span>
            </AnimatePresence>
            <span className="text-[13px] font-semibold text-[#4B5563]">kg CO₂e</span>
          </div>
          <p className="text-[11.5px] text-[#4B5563] mt-1">Normalized individual burden</p>
        </div>

        <div className="pl-4 border-l border-[#D8E8DF]">
          <p className="text-[12px] font-semibold text-[#4B5563] flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-[#C85A32]" />
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
                className="text-[28px] sm:text-[30px] font-bold text-[#111827] tracking-tight leading-none"
              >
                {totalCo2e.toFixed(1)}
              </motion.span>
            </AnimatePresence>
            <span className="text-[13px] font-semibold text-[#4B5563]">kg CO₂e</span>
          </div>
          <p className="text-[11.5px] text-[#4B5563] mt-1">Gross convoy footprint</p>
        </div>
      </div>

      {/* Terrain Elevation Multiplier Chip */}
      <div className="bg-white border border-[#D8E8DF] rounded-xl p-3.5 mb-4 flex items-start gap-2.5 text-[12px] text-[#4B5563] shadow-sm">
        <MountainSnow className="w-4 h-4 text-[#1B4332] flex-shrink-0 mt-0.5" strokeWidth={2} />
        <span className="leading-relaxed">
          Includes <strong className="text-[#111827]">+{terrainAdjustment.uphillDeltaPerPerson.toFixed(1)} kg/person</strong> (+{terrainAdjustment.uphillDeltaTotal.toFixed(1)} kg total) from the{' '}
          <strong className="text-[#1B4332] font-semibold">{terrainAdjustment.multiplier.toFixed(2)}× {terrainName}</strong> gradient fuel adjustment.
        </span>
      </div>

      {/* Emissions Distribution Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-[11.5px] font-semibold text-[#4B5563] mb-1.5">
          <span>Emissions Distribution</span>
          <span>{breakdown.transportPercent}% Transit | {breakdown.accommodationPercent}% Stay</span>
        </div>
        <div className="h-6 rounded-full overflow-hidden flex bg-[#E2ECE5] shadow-inner p-0.5" role="img" aria-label="Distribution bar">
          <motion.div
            className="bg-[#1B4332] text-white text-[10.5px] font-bold flex items-center justify-center rounded-l-full min-w-[34px] overflow-hidden whitespace-nowrap px-1"
            initial={false}
            animate={{ width: `${breakdown.transportPercent}%` }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            Transit
          </motion.div>
          <motion.div
            className="bg-[#C85A32] text-white text-[10.5px] font-bold flex items-center justify-center rounded-r-full min-w-[34px] overflow-hidden whitespace-nowrap px-1"
            initial={false}
            animate={{ width: `${breakdown.accommodationPercent}%` }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            Stay
          </motion.div>
        </div>
      </div>

      {/* Deterministic Mathematical Formula Breakdown */}
      <div className="bg-white border border-[#D8E8DF] rounded-xl p-4 text-[12.5px] space-y-2.5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-[#111827] flex items-center gap-2">
            <CarFront className="w-3.5 h-3.5 text-[#1B4332]" />
            Transport Component
          </span>
          <span className="font-mono font-bold text-[#111827]">{breakdown.transportPerPerson.toFixed(1)} kg/p</span>
        </div>
        <p className="text-[11px] text-[#4B5563] pl-5 font-mono">
          {input.distanceKm} km × {input.transportMode === 'bus' ? '30g' : input.transportMode === 'suv' ? '180g' : input.transportMode === 'sedan' ? '140g' : '45g'} × {terrainAdjustment.multiplier.toFixed(2)}x ÷ {input.passengers} pax = {breakdown.transportPerPerson.toFixed(1)} kg CO₂e
        </p>

        <div className="border-t border-[#D8E8DF] my-1.5" />

        <div className="flex items-center justify-between">
          <span className="font-semibold text-[#111827] flex items-center gap-2">
            <Hotel className="w-3.5 h-3.5 text-[#C85A32]" />
            Accommodation Component
          </span>
          <span className="font-mono font-bold text-[#111827]">{breakdown.accommodationPerPerson.toFixed(1)} kg/p</span>
        </div>
        <p className="text-[11px] text-[#4B5563] pl-5 font-mono">
          {input.nights} nights × {input.accommodationType === 'luxury' ? '24.0kg' : input.accommodationType === 'hotel' ? '9.0kg' : input.accommodationType === 'homestay' ? '6.0kg' : '3.5kg'} = {breakdown.accommodationPerPerson.toFixed(1)} kg CO₂e
        </p>

        {breakdown.habitDeductionsPerPerson > 0 && (
          <>
            <div className="border-t border-[#D8E8DF] my-1.5" />
            <div className="flex items-center justify-between text-[#1B4332] font-semibold">
              <span className="flex items-center gap-2">
                <Leaf className="w-3.5 h-3.5 text-[#2D6A4F]" />
                Eco-Habit Deductions
              </span>
              <span className="font-mono font-bold">−{breakdown.habitDeductionsPerPerson.toFixed(1)} kg/p</span>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};
