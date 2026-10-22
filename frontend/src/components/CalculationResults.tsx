'use client';

import React from 'react';
import { CalculationOutput, CalculationInput } from '../types';

interface CalculationResultsProps {
  result: CalculationOutput;
  input: CalculationInput;
}

export const CalculationResults: React.FC<CalculationResultsProps> = ({ result, input }) => {
  const { perPersonCo2e, totalCo2e, breakdown, terrainAdjustment, impactSeverity } = result;

  const severityBadge = {
    low: {
      bg: 'bg-[#C1ECD4]',
      text: 'text-[#002114]',
      border: 'border-[#A3CCA9]',
      label: '✓ Low Mountain Impact (<30 kg)',
    },
    moderate: {
      bg: 'bg-[#FEF3C7]',
      text: 'text-[#92400E]',
      border: 'border-[#FDE68A]',
      label: '⚠ Moderate Mountain Impact (30–75 kg)',
    },
    high: {
      bg: 'bg-[#FFDAD6]',
      text: 'text-[#BA1A1A]',
      border: 'border-[#FECACA]',
      label: '⛰ High Mountain Impact (>75 kg)',
    },
  }[impactSeverity];

  const terrainName =
    input.terrainZone === 'foothills'
      ? 'Foothills'
      : input.terrainZone === 'mid_hills'
      ? 'Mid-Hills'
      : 'High Altitude';

  return (
    <div className="bg-[#EDF6F0] border border-[#D8E8DF] rounded-card p-5 shadow-card animate-fadeIn">
      {/* Header & Impact Severity Badge */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <span className="text-[11.5px] font-bold text-[#4B5563] uppercase tracking-wider flex items-center gap-1.5">
          <svg className="w-4 h-4 text-[#1B4332]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Estimated Carbon Footprint
        </span>
        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${severityBadge.bg} ${severityBadge.text} ${severityBadge.border}`}>
          {severityBadge.label}
        </span>
      </div>

      {/* Dual Metric Display Containers */}
      <div className="grid grid-cols-2 gap-4 bg-white border border-[#D8E8DF] rounded-xl p-4 mb-3.5 shadow-sm">
        <div>
          <p className="text-[13px] font-semibold text-[#4B5563]">Per Person</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-[32px] sm:text-[36px] font-extrabold text-[#111827] tracking-tight">
              {perPersonCo2e.toFixed(1)}
            </span>
            <span className="text-[13px] font-semibold text-[#4B5563]">kg CO₂e</span>
          </div>
          <p className="text-[11.5px] text-[#4B5563] mt-0.5">Normalized individual burden</p>
        </div>

        <div className="pl-4 border-l border-[#D8E8DF]">
          <p className="text-[13px] font-semibold text-[#4B5563]">
            Whole Trip ({input.passengers} {input.passengers === 1 ? 'Traveler' : 'Travelers'})
          </p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-[26px] sm:text-[28px] font-bold text-[#111827] tracking-tight">
              {totalCo2e.toFixed(1)}
            </span>
            <span className="text-[13px] font-semibold text-[#4B5563]">kg CO₂e</span>
          </div>
          <p className="text-[11.5px] text-[#4B5563] mt-0.5">Gross convoy footprint</p>
        </div>
      </div>

      {/* Terrain Elevation Multiplier Chip */}
      <div className="bg-white border border-[#D8E8DF] rounded-lg p-3 mb-3.5 flex items-start gap-2 text-[12px] text-[#4B5563] shadow-sm">
        <svg className="w-4 h-4 text-[#1B4332] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        <span>
          Includes <strong className="text-[#111827]">+{terrainAdjustment.uphillDeltaPerPerson.toFixed(1)} kg/person</strong> (+{terrainAdjustment.uphillDeltaTotal.toFixed(1)} kg total) from the{' '}
          <strong className="text-[#1B4332]">{terrainAdjustment.multiplier.toFixed(2)}× {terrainName}</strong> gradient fuel adjustment.
        </span>
      </div>

      {/* Emissions Distribution Progress Bar */}
      <div className="mb-3.5">
        <div className="flex items-center justify-between text-[11.5px] font-semibold text-[#4B5563] mb-1.5">
          <span>Emissions Distribution</span>
          <span>{breakdown.transportPercent}% Transit | {breakdown.accommodationPercent}% Stay</span>
        </div>
        <div className="h-6 rounded-full overflow-hidden flex bg-[#E2ECE5] shadow-inner" role="img" aria-label="Distribution bar">
          <div
            className="bg-[#1B4332] text-white text-[11px] font-bold flex items-center justify-center transition-all duration-500 min-w-[30px]"
            style={{ width: `${breakdown.transportPercent}%` }}
          >
            Transit
          </div>
          <div
            className="bg-[#C85A32] text-white text-[11px] font-bold flex items-center justify-center transition-all duration-500 min-w-[30px]"
            style={{ width: `${breakdown.accommodationPercent}%` }}
          >
            Stay
          </div>
        </div>
      </div>

      {/* Deterministic Mathematical Formula Breakdown */}
      <div className="bg-white border border-[#D8E8DF] rounded-lg p-3.5 text-[12.5px] space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-[#111827] flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1B4332]" />
            Transport Component
          </span>
          <span className="font-mono font-bold text-[#111827]">{breakdown.transportPerPerson.toFixed(1)} kg/p</span>
        </div>
        <p className="text-[11px] text-[#4B5563] pl-4 font-mono">
          {input.distanceKm} km × {input.transportMode === 'bus' ? '30g' : input.transportMode === 'suv' ? '180g' : input.transportMode === 'sedan' ? '140g' : '45g'} × {terrainAdjustment.multiplier.toFixed(2)}x ÷ {input.passengers} pax = {breakdown.transportPerPerson.toFixed(1)} kg CO₂e
        </p>

        <div className="border-t border-[#D8E8DF] my-1" />

        <div className="flex items-center justify-between">
          <span className="font-semibold text-[#111827] flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C85A32]" />
            Accommodation Component
          </span>
          <span className="font-mono font-bold text-[#111827]">{breakdown.accommodationPerPerson.toFixed(1)} kg/p</span>
        </div>
        <p className="text-[11px] text-[#4B5563] pl-4 font-mono">
          {input.nights} nights × {input.accommodationType === 'luxury' ? '24.0kg' : input.accommodationType === 'hotel' ? '9.0kg' : input.accommodationType === 'homestay' ? '6.0kg' : '3.5kg'} = {breakdown.accommodationPerPerson.toFixed(1)} kg CO₂e
        </p>

        {breakdown.habitDeductionsPerPerson > 0 && (
          <>
            <div className="border-t border-[#D8E8DF] my-1" />
            <div className="flex items-center justify-between text-[#1B4332] font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2D6A4F]" />
                Eco-Habit Deductions
              </span>
              <span className="font-mono font-bold">−{breakdown.habitDeductionsPerPerson.toFixed(1)} kg/p</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
