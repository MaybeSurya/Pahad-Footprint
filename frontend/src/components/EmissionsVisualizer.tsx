'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  PieChart as PieChartIcon,
  TableProperties,
  Hotel,
  MountainSnow,
  Leaf,
  Scale,
  TrendingUp,
} from 'lucide-react';
import { VehicleIconByType, PrivateVehicleIcon } from './VehicleIcons';
import { CalculationOutput, CalculationInput } from '../types';
import { useTranslation } from '../contexts/TranslationContext';

interface EmissionsVisualizerProps {
  result: CalculationOutput;
  input: CalculationInput;
}

type ChartViewMode = 'bars' | 'pie' | 'table';
type MetricScope = 'perPerson' | 'wholeTrip';

export const EmissionsVisualizer: React.FC<EmissionsVisualizerProps> = ({ result, input }) => {
  const { t, language } = useTranslation();
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
      label: t('visualizer.transitLabel'),
      val: transportVal,
      pct: transportPct,
      color: '#496951', // Alpine Green
      hoverColor: '#304B38',
      icon: PrivateVehicleIcon,
      desc: `${input.distanceKm} km · ${input.transportMode.toUpperCase()}`,
    },
    {
      id: 'stay',
      label: t('visualizer.stayLabel'),
      val: stayVal,
      pct: stayPct,
      color: '#B3834D', // Muted Amber
      hoverColor: '#8A5D2E',
      icon: Hotel,
      desc: `${input.nights} ${language === 'HI' ? 'रातें' : 'nights'} · ${input.accommodationType.toUpperCase()}`,
    },
  ];

  return (
    <div className="p-5 space-y-4" style={{ backgroundColor: 'var(--paper-card)' }}>
      {/* Header with View Controls & Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-2.5 pb-3 border-b" style={{ borderColor: 'var(--line)' }}>
        <div>
          <h4 className="text-[13.5px] font-bold text-[#242722] flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#496951]" />
            {t('visualizer.title')}
          </h4>
          <p className="text-[11px] text-[#777C72] font-mono">
            {t('visualizer.subtitle')}
          </p>
        </div>

        {/* View Switcher Tabs (Bar Graph, Donut/Pie, Table) */}
        <div
          className="flex items-center bg-[#F0EEE6] p-0.5 rounded border"
          style={{ borderColor: 'var(--line)' }}
          role="tablist"
          aria-label="Emissions chart visual view modes"
        >
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'bars'}
            onClick={() => setViewMode('bars')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded text-[10.5px] sm:text-[11.5px] font-semibold transition-all ${
              viewMode === 'bars'
                ? 'bg-white text-[#242722] shadow-xs font-bold'
                : 'text-[#51554D] hover:text-[#242722]'
            }`}
          >
            <BarChart3 className="w-3 h-3 text-[#496951]" />
            <span>{t('visualizer.tabBars')}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'pie'}
            onClick={() => setViewMode('pie')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded text-[10.5px] sm:text-[11.5px] font-semibold transition-all ${
              viewMode === 'pie'
                ? 'bg-white text-[#242722] shadow-xs font-bold'
                : 'text-[#51554D] hover:text-[#242722]'
            }`}
          >
            <PieChartIcon className="w-3 h-3 text-[#B3834D]" />
            <span>{t('visualizer.tabDonut')}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'table'}
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded text-[10.5px] sm:text-[11.5px] font-semibold transition-all ${
              viewMode === 'table'
                ? 'bg-white text-[#242722] shadow-xs font-bold'
                : 'text-[#51554D] hover:text-[#242722]'
            }`}
          >
            <TableProperties className="w-3 h-3 text-[#51554D]" />
            <span>{t('visualizer.tabFormula')}</span>
          </button>
        </div>
      </div>

      {/* Scope Selector: Per Person vs Whole Convoy */}
      <div
        className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 text-[11.5px] px-3 py-2 rounded border"
        style={{ backgroundColor: 'var(--paper-deep)', borderColor: 'var(--line)' }}
      >
        <span className="font-mono text-[10.5px] sm:text-[11px] text-[#51554D]">{t('visualizer.scopeLabel')}</span>
        <div className="flex items-center gap-1 bg-white p-0.5 rounded border" style={{ borderColor: 'var(--line)' }}>
          <button
            type="button"
            onClick={() => setMetricScope('perPerson')}
            className={`px-2 sm:px-2.5 py-0.5 rounded text-[10.5px] sm:text-[11px] font-semibold transition-colors flex items-center gap-1 ${
              isPerPerson
                ? 'bg-[#E8EDE5] text-[#304B38] font-bold'
                : 'text-[#777C72] hover:text-[#242722]'
            }`}
          >
            <Scale className="w-3 h-3 text-[#496951]" />
            {t('visualizer.perPerson')}
          </button>
          <button
            type="button"
            onClick={() => setMetricScope('wholeTrip')}
            className={`px-2 sm:px-2.5 py-0.5 rounded text-[10.5px] sm:text-[11px] font-semibold transition-colors flex items-center gap-1 ${
              !isPerPerson
                ? 'bg-[#F1EADD] text-[#8A5D2E] font-bold'
                : 'text-[#777C72] hover:text-[#242722]'
            }`}
          >
            <TrendingUp className="w-3 h-3 text-[#B3834D]" />
            {t('visualizer.wholeParty')} ({input.passengers})
          </button>
        </div>
      </div>

      {/* Content Rendering based on ViewMode */}
      <AnimatePresence mode="wait">
        {/* VIEW 1: COMPARATIVE BARS */}
        {viewMode === 'bars' && (
          <motion.div
            key="bars"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="space-y-4 pt-1"
          >
            {/* Bar 1: Transport */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[12px]">
                <span className="font-semibold text-[#242722] flex items-center gap-1.5">
                  <VehicleIconByType type={input.transportMode} className="w-3.5 h-3.5 text-[#496951]" />
                  {t('visualizer.transitLabel')}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#242722]">{transportVal.toFixed(1)} kg</span>
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#E8EDE5] text-[#304B38] border border-[#496951]/20">
                    {transportPct}%
                  </span>
                </div>
              </div>
              <div className="h-2.5 bg-[#F0EEE6] rounded-full overflow-hidden border" style={{ borderColor: 'var(--line)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, Math.max(6, transportPct))}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="h-full bg-[#496951] rounded-full"
                />
              </div>
              <p className="text-[10.5px] text-[#777C72] font-mono">
                {input.distanceKm} km · {breakdown.transportRateLabel}
              </p>
            </div>

            {/* Bar 2: Accommodation */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[12px]">
                <span className="font-semibold text-[#242722] flex items-center gap-1.5">
                  <Hotel className="w-3.5 h-3.5 text-[#B3834D]" />
                  {t('visualizer.stayLabel')}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#242722]">{stayVal.toFixed(1)} kg</span>
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#F1EADD] text-[#8A5D2E] border border-[#B3834D]/25">
                    {stayPct}%
                  </span>
                </div>
              </div>
              <div className="h-2.5 bg-[#F0EEE6] rounded-full overflow-hidden border" style={{ borderColor: 'var(--line)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, Math.max(6, stayPct))}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="h-full bg-[#B3834D] rounded-full"
                />
              </div>
              <p className="text-[10.5px] text-[#777C72] font-mono">
                {input.nights} {language === 'HI' ? 'रातें' : 'nights'} · {input.accommodationType}
              </p>
            </div>

            {/* Secondary Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div className="bg-[#FAF9F5] border rounded p-2.5" style={{ borderColor: 'var(--line)' }}>
                <div className="flex items-center justify-between text-[11px] font-semibold text-[#51554D] mb-1">
                  <span className="flex items-center gap-1 text-[#304B38]">
                    <MountainSnow className="w-3 h-3" />
                    {t('visualizer.climbLabel')}
                  </span>
                  <span className="font-mono font-bold text-[#242722]">+{uphillVal.toFixed(1)} kg</span>
                </div>
                <p className="text-[10px] text-[#777C72]">
                  {terrainAdjustment.multiplier.toFixed(2)}× {t('visualizer.climbDesc')}
                </p>
              </div>

              {habitVal > 0 ? (
                <div className="bg-[#E8EDE5]/50 border border-[#496951]/30 rounded p-2.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-[#304B38] mb-1">
                    <span className="flex items-center gap-1">
                      <Leaf className="w-3 h-3 text-[#496951]" />
                      {t('visualizer.habitCredits')}
                    </span>
                    <span className="font-mono font-bold text-[#304B38]">−{habitVal.toFixed(1)} kg</span>
                  </div>
                  <p className="text-[10px] text-[#496951]">
                    {t('visualizer.habitActive')}
                  </p>
                </div>
              ) : (
                <div className="bg-[#FAF9F5] border rounded p-2.5" style={{ borderColor: 'var(--line)' }}>
                  <div className="flex items-center justify-between text-[11px] font-medium text-[#777C72] mb-1">
                    <span className="flex items-center gap-1">
                      <Leaf className="w-3 h-3 text-[#777C72]" />
                      {t('visualizer.habitCredits')}
                    </span>
                    <span className="font-mono font-bold">0.0 kg</span>
                  </div>
                  <p className="text-[10px] text-[#777C72]">
                    {t('visualizer.habitNone')}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* VIEW 2: INTERACTIVE SVG PIE / DONUT */}
        {viewMode === 'pie' && (
          <motion.div
            key="pie"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2"
          >
            {/* SVG Donut Graphic */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg
                viewBox="0 0 160 160"
                className="w-full h-full -rotate-90"
                role="img"
                aria-label={`Donut chart showing ${transportPct}% transit and ${stayPct}% lodging`}
              >
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke="#F0EEE6"
                  strokeWidth="18"
                />
                {/* Transport Arc */}
                <motion.circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke="#496951"
                  strokeWidth={hoveredSlice === 'transport' ? '22' : '18'}
                  strokeDasharray={`${transportDash} ${circumference}`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredSlice('transport')}
                  onMouseLeave={() => setHoveredSlice(null)}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
                {/* Stay Arc */}
                <motion.circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke="#B3834D"
                  strokeWidth={hoveredSlice === 'stay' ? '22' : '18'}
                  strokeDasharray={`${stayDash} ${circumference}`}
                  strokeDashoffset={`-${transportDash}`}
                  strokeLinecap="round"
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredSlice('stay')}
                  onMouseLeave={() => setHoveredSlice(null)}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: -transportDash }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </svg>

              {/* Central Hole Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#777C72]">
                  {t('visualizer.netCarbon')}
                </span>
                <span className="font-mono text-[20px] font-bold text-[#242722] leading-tight">
                  {netVal.toFixed(1)}
                </span>
                <span className="font-mono text-[10px] text-[#777C72]">kg CO₂e</span>
              </div>
            </div>

            {/* Interactive Legend */}
            <div className="flex-1 space-y-2.5 w-full">
              {slices.map((slice) => {
                const IconComponent = slice.icon;
                const isHovered = hoveredSlice === slice.id;
                return (
                  <div
                    key={slice.id}
                    onMouseEnter={() => setHoveredSlice(slice.id)}
                    onMouseLeave={() => setHoveredSlice(null)}
                    className={`p-2.5 rounded border transition-all cursor-pointer ${
                      isHovered
                        ? 'border-[#242722] bg-[#FAF9F5]'
                        : 'border-[#2D322B29] bg-white hover:border-[#242722]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: slice.color }}
                        />
                        <span className="text-[12px] font-bold text-[#242722] flex items-center gap-1.5">
                          <IconComponent className="w-3.5 h-3.5 text-[#777C72]" />
                          {slice.label}
                        </span>
                      </div>
                      <span className="font-mono text-[11.5px] font-bold text-[#242722]">
                        {slice.val.toFixed(1)} kg
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10.5px] text-[#777C72] font-mono">
                      <span>{slice.desc}</span>
                      <span className="font-bold" style={{ color: slice.color }}>
                        {slice.pct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* VIEW 3: FORMULA BREAKDOWN */}
        {viewMode === 'table' && (
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="space-y-2.5 pt-1 text-[12px]"
          >
            <div className="bg-[#FAF9F5] border rounded p-3 space-y-1.5" style={{ borderColor: 'var(--line)' }}>
              <div className="flex items-center justify-between font-semibold text-[#242722]">
                <span className="flex items-center gap-1.5">
                  <VehicleIconByType type={input.transportMode} className="w-3.5 h-3.5 text-[#496951]" />
                  {t('visualizer.transitFormula')}
                </span>
                <span className="font-mono text-[#304B38] font-bold">
                  {breakdown.transportPerPerson.toFixed(1)} kg/p
                </span>
              </div>
              <p className="font-mono text-[11px] text-[#51554D] bg-white p-2 rounded border break-words overflow-x-auto" style={{ borderColor: 'var(--line)' }}>
                {input.distanceKm} km × {breakdown.transportRateLabel || '180 g/vkm'} × {terrainAdjustment.multiplier.toFixed(2)}x Incline {input.transportCategory === 'transit' ? '' : `÷ ${input.passengers} pax `}= {breakdown.transportPerPerson.toFixed(1)} kg CO₂e
              </p>
              {breakdown.vehicleAgeMultiplier && breakdown.vehicleAgeMultiplier > 1 && (
                <p className="text-[10.5px] text-[#8A5D2E] font-medium">
                  {language === 'HI'
                    ? `⚠️ पुराने वाहन का प्रभाव: ${input.registrationYear || breakdown.registrationYear} मॉडल की वजह से ${breakdown.vehicleAgeMultiplier.toFixed(2)}× (+${Math.round((breakdown.vehicleAgeMultiplier - 1) * 100)}%) अधिक उत्सर्जन`
                    : `⚠️ Older vehicle adjustment: ${input.registrationYear || breakdown.registrationYear} registration adds ${breakdown.vehicleAgeMultiplier.toFixed(2)}× (+${Math.round((breakdown.vehicleAgeMultiplier - 1) * 100)}%) higher CO₂ emissions`}
                </p>
              )}
            </div>

            <div className="bg-[#FAF9F5] border rounded p-3 space-y-1.5" style={{ borderColor: 'var(--line)' }}>
              <div className="flex items-center justify-between font-semibold text-[#242722]">
                <span className="flex items-center gap-1.5">
                  <Hotel className="w-3.5 h-3.5 text-[#B3834D]" />
                  {t('visualizer.stayFormula')}
                </span>
                <span className="font-mono text-[#8A5D2E] font-bold">
                  {breakdown.accommodationPerPerson.toFixed(1)} kg/p
                </span>
              </div>
              <p className="font-mono text-[11px] text-[#51554D] bg-white p-2 rounded border break-words overflow-x-auto" style={{ borderColor: 'var(--line)' }}>
                {input.nights} nights × {input.accommodationType === 'luxury' ? '24.0 kg' : input.accommodationType === 'hotel' ? '9.0 kg' : input.accommodationType === 'homestay' ? '6.0 kg' : '3.5 kg'} = {breakdown.accommodationPerPerson.toFixed(1)} kg CO₂e
              </p>
            </div>

            {breakdown.habitDeductionsPerPerson > 0 && (
              <div className="bg-[#E8EDE5]/70 border border-[#496951]/30 rounded p-2.5 flex items-center justify-between font-semibold text-[#304B38]">
                <span className="flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-[#496951]" />
                  {t('visualizer.habitFormula')}
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
