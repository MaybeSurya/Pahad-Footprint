'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  PieChart as PieChartIcon,
  TableProperties,
  CarFront,
  Hotel,
  MountainSnow,
  Leaf,
  Info,
  Scale,
  TrendingUp,
} from 'lucide-react';
import { CalculationOutput, CalculationInput } from '../types';

interface EmissionsVisualizerProps {
  result: CalculationOutput;
  input: CalculationInput;
}

type ChartViewMode = 'bars' | 'pie' | 'table';
type MetricScope = 'perPerson' | 'wholeTrip';

export const EmissionsVisualizer: React.FC<EmissionsVisualizerProps> = ({ result, input }) => {
  const [viewMode, setViewMode] = useState<ChartViewMode>('bars');
  const [metricScope, setMetricScope] = useState<MetricScope>('perPerson');
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  const { breakdown, terrainAdjustment, perPersonCo2e, totalCo2e } = result;

  const isPerPerson = metricScope === 'perPerson';
  const multiplier = isPerPerson ? 1 : input.passengers;

  // Emissions values based on scope
  const transportVal = breakdown.transportPerPerson * multiplier;
  const stayVal = breakdown.accommodationPerPerson * multiplier;
  const uphillVal = terrainAdjustment.uphillDeltaPerPerson * multiplier;
  const habitVal = breakdown.habitDeductionsPerPerson * multiplier;
  const netVal = isPerPerson ? perPersonCo2e : totalCo2e;

  // Chart slices
  const totalPositive = Math.max(0.1, transportVal + stayVal);
  const transportPct = Math.round((transportVal / totalPositive) * 100);
  const stayPct = Math.max(0, 100 - transportPct);

  // SVG Donut calculation
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const transportDash = (transportPct / 100) * circumference;
  const stayDash = (stayPct / 100) * circumference;

  const slices = [
    {
      id: 'transport',
      label: 'Transit & Transit Multiplier',
      val: transportVal,
      pct: transportPct,
      color: '#059669', // Emerald
      hoverColor: '#047857',
      icon: CarFront,
      desc: `${input.distanceKm} km via ${input.transportMode.toUpperCase()}`,
    },
    {
      id: 'stay',
      label: 'Accommodation & Energy',
      val: stayVal,
      pct: stayPct,
      color: '#EA580C', // Terracotta
      hoverColor: '#C2410C',
      icon: Hotel,
      desc: `${input.nights} nights @ ${input.accommodationType.toUpperCase()}`,
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Header with View Controls & Accessibility Tablist */}
      <div className="flex items-center justify-between flex-wrap gap-2.5 pb-3 border-b border-slate-100">
        <div>
          <h4 className="text-[14px] font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            Emissions Distribution Analysis
          </h4>
          <p className="text-[11.5px] text-slate-500">
            Interactive breakdown of mountain transit, lodging, and elevation strain
          </p>
        </div>

        {/* View Switcher Tabs (Bar Graph, Donut/Pie, Table) */}
        <div
          className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200"
          role="tablist"
          aria-label="Emissions chart visual view modes"
        >
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'bars'}
            onClick={() => setViewMode('bars')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
              viewMode === 'bars'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Bar Graph</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'pie'}
            onClick={() => setViewMode('pie')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
              viewMode === 'pie'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PieChartIcon className="w-3.5 h-3.5 text-amber-600" />
            <span>Pie Chart</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'table'}
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
              viewMode === 'table'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TableProperties className="w-3.5 h-3.5 text-blue-600" />
            <span>Formula</span>
          </button>
        </div>
      </div>

      {/* Scope Selector: Per Person vs Whole Convoy */}
      <div className="flex items-center justify-between text-[12px] bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/80">
        <span className="font-medium text-slate-600">Metric Calculation Scope:</span>
        <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setMetricScope('perPerson')}
            className={`px-2.5 py-1 rounded text-[11.5px] font-semibold transition-colors flex items-center gap-1 ${
              isPerPerson ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scale className="w-3 h-3 text-emerald-700" />
            Per Person
          </button>
          <button
            type="button"
            onClick={() => setMetricScope('wholeTrip')}
            className={`px-2.5 py-1 rounded text-[11.5px] font-semibold transition-colors flex items-center gap-1 ${
              !isPerPerson ? 'bg-amber-50 text-amber-900 border border-amber-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3 h-3 text-amber-700" />
            Total ({input.passengers} Pax)
          </button>
        </div>
      </div>

      {/* Content Rendering based on ViewMode */}
      <AnimatePresence mode="wait">
        {/* VIEW 1: BAR GRAPH VIEW */}
        {viewMode === 'bars' && (
          <motion.div
            key="bars"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="space-y-4 pt-1"
          >
            {/* Horizontal Comparative Bar 1: Transport */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[12.5px]">
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <CarFront className="w-4 h-4 text-emerald-600" />
                  Mountain Road / Air Transit
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900">{transportVal.toFixed(1)} kg</span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {transportPct}%
                  </span>
                </div>
              </div>
              <div className="h-4 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/80">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, Math.max(6, transportPct))}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-full"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                {input.distanceKm} km round-trip distance × {breakdown.transportRateLabel} with gradient factor
              </p>
            </div>

            {/* Horizontal Comparative Bar 2: Accommodation */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[12.5px]">
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Hotel className="w-4 h-4 text-amber-600" />
                  Lodging &amp; Heating Strain
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900">{stayVal.toFixed(1)} kg</span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    {stayPct}%
                  </span>
                </div>
              </div>
              <div className="h-4 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/80">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, Math.max(6, stayPct))}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-amber-600 to-amber-500 rounded-full"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                {input.nights} guest nights at {input.accommodationType} rating
              </p>
            </div>

            {/* Secondary Bars: Altitude Penalty & Eco Deductions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <div className="flex items-center justify-between text-[11.5px] font-semibold text-slate-700 mb-1">
                  <span className="flex items-center gap-1.5 text-blue-700">
                    <MountainSnow className="w-3.5 h-3.5" />
                    Altitude Incline Burn
                  </span>
                  <span className="font-mono font-bold text-slate-900">+{uphillVal.toFixed(1)} kg</span>
                </div>
                <p className="text-[10.5px] text-slate-500">
                  {terrainAdjustment.multiplier.toFixed(2)}× slope multiplier applied to engine fuel load
                </p>
              </div>

              {habitVal > 0 ? (
                <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3">
                  <div className="flex items-center justify-between text-[11.5px] font-semibold text-emerald-800 mb-1">
                    <span className="flex items-center gap-1.5">
                      <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                      Eco-Habit Savings
                    </span>
                    <span className="font-mono font-bold text-emerald-800">−{habitVal.toFixed(1)} kg</span>
                  </div>
                  <p className="text-[10.5px] text-emerald-700">
                    Water refill &amp; local seasonal food deductions credited
                  </p>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <div className="flex items-center justify-between text-[11.5px] font-medium text-slate-500 mb-1">
                    <span className="flex items-center gap-1.5">
                      <Leaf className="w-3.5 h-3.5 text-slate-400" />
                      Eco-Habit Credits
                    </span>
                    <span className="font-mono font-bold text-slate-400">0.0 kg</span>
                  </div>
                  <p className="text-[10.5px] text-slate-400">
                    Check eco-habit boxes to deduct up to 5.0 kg/person
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* VIEW 2: INTERACTIVE SVG PIE / DONUT CHART */}
        {viewMode === 'pie' && (
          <motion.div
            key="pie"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2"
          >
            {/* SVG Donut Graphic */}
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg
                viewBox="0 0 160 160"
                className="w-full h-full -rotate-90 drop-shadow-xs"
                role="img"
                aria-label={`Donut chart showing ${transportPct}% transit emissions and ${stayPct}% accommodation emissions`}
              >
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke="#F1F5F9"
                  strokeWidth="20"
                />
                {/* Transport Arc */}
                <motion.circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke="#059669"
                  strokeWidth={hoveredSlice === 'transport' ? '24' : '20'}
                  strokeDasharray={`${transportDash} ${circumference}`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredSlice('transport')}
                  onMouseLeave={() => setHoveredSlice(null)}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
                {/* Stay Arc */}
                <motion.circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke="#EA580C"
                  strokeWidth={hoveredSlice === 'stay' ? '24' : '20'}
                  strokeDasharray={`${stayDash} ${circumference}`}
                  strokeDashoffset={`-${transportDash}`}
                  strokeLinecap="round"
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredSlice('stay')}
                  onMouseLeave={() => setHoveredSlice(null)}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: -transportDash }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </svg>

              {/* Central Hole Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Net Carbon</span>
                <span className="text-[22px] font-extrabold text-slate-900 tracking-tight leading-tight">
                  {netVal.toFixed(1)}
                </span>
                <span className="text-[10.5px] font-semibold text-slate-500">kg CO₂e</span>
              </div>
            </div>

            {/* Interactive Chart Legend */}
            <div className="flex-1 space-y-3 w-full">
              {slices.map((slice) => {
                const IconComponent = slice.icon;
                const isHovered = hoveredSlice === slice.id;
                return (
                  <div
                    key={slice.id}
                    onMouseEnter={() => setHoveredSlice(slice.id)}
                    onMouseLeave={() => setHoveredSlice(null)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isHovered
                        ? 'border-slate-300 bg-slate-50 shadow-xs'
                        : 'border-slate-200/80 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: slice.color }}
                        />
                        <span className="text-[13px] font-bold text-slate-900 flex items-center gap-1.5">
                          <IconComponent className="w-3.5 h-3.5 text-slate-500" />
                          {slice.label}
                        </span>
                      </div>
                      <span className="text-[12px] font-bold font-mono text-slate-900">
                        {slice.val.toFixed(1)} kg
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{slice.desc}</span>
                      <span className="font-semibold" style={{ color: slice.color }}>
                        {slice.pct}% Contribution
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* VIEW 3: FORMULA & MATHEMATICAL FACTOR BREAKDOWN */}
        {viewMode === 'table' && (
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="space-y-3 pt-1 text-[12.5px]"
          >
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between font-semibold text-slate-900">
                <span className="flex items-center gap-1.5">
                  <CarFront className="w-3.5 h-3.5 text-emerald-600" />
                  Transit Equation
                </span>
                <span className="font-mono text-emerald-700 font-bold">
                  {breakdown.transportPerPerson.toFixed(1)} kg/p
                </span>
              </div>
              <p className="font-mono text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
                {input.distanceKm} km × {breakdown.transportRateLabel || '180 g/vkm'} × {terrainAdjustment.multiplier.toFixed(2)}x Incline {input.transportCategory === 'transit' ? '' : `÷ ${input.passengers} pax `}= {breakdown.transportPerPerson.toFixed(1)} kg CO₂e
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between font-semibold text-slate-900">
                <span className="flex items-center gap-1.5">
                  <Hotel className="w-3.5 h-3.5 text-amber-600" />
                  Accommodation Equation
                </span>
                <span className="font-mono text-amber-700 font-bold">
                  {breakdown.accommodationPerPerson.toFixed(1)} kg/p
                </span>
              </div>
              <p className="font-mono text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
                {input.nights} nights × {input.accommodationType === 'luxury' ? '24.0 kg' : input.accommodationType === 'hotel' ? '9.0 kg' : input.accommodationType === 'homestay' ? '6.0 kg' : '3.5 kg'} = {breakdown.accommodationPerPerson.toFixed(1)} kg CO₂e
              </p>
            </div>

            {breakdown.habitDeductionsPerPerson > 0 && (
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between font-semibold text-emerald-800">
                <span className="flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                  Eco-Habit Deductions
                </span>
                <span className="font-mono font-bold">−{breakdown.habitDeductionsPerPerson.toFixed(1)} kg/p</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
