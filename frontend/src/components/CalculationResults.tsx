'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, MountainSnow, TrendingUp, Scale, ArrowRight, ShieldCheck } from 'lucide-react';
import { CalculationOutput, CalculationInput } from '../types';
import { useTranslation } from '../contexts/TranslationContext';
import { EmissionsVisualizer } from './EmissionsVisualizer';

interface CalculationResultsProps {
  result: CalculationOutput;
  input: CalculationInput;
}

export const CalculationResults: React.FC<CalculationResultsProps> = ({ result, input }) => {
  const { t, language } = useTranslation();
  const { perPersonCo2e, totalCo2e, terrainAdjustment, impactSeverity, breakdown } = result;

  const terrainName =
    input.terrainZone === 'foothills'
      ? t('calculator.terrainFoothills')
      : input.terrainZone === 'mid_hills'
      ? t('calculator.terrainMidHills')
      : t('calculator.terrainHighAltitude');

  // Severity config in nature-journal palette
  const severityBadge = {
    low: {
      text: t('results.lowImpact'),
      className: 'badge-accent',
    },
    moderate: {
      text: t('results.moderateImpact'),
      className: 'badge-mono',
    },
    high: {
      text: t('results.highImpact'),
      className: 'badge-amber',
    },
  }[impactSeverity];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4"
    >
      {/* Header Row */}
      <div className="journal-card p-5 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-[18px] font-bold text-[#242722] tracking-tight">
            {t('results.title')}
          </h3>
        </div>

        <motion.span
          key={impactSeverity}
          initial={{ scale: 0.95, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          className={severityBadge.className}
        >
          {severityBadge.text}
        </motion.span>
      </div>

      {/* Main Impact Panel: Primary Big Number & Whole-Party View */}
      <div className="journal-card p-6 relative overflow-hidden space-y-6">
        {/* Subtle Pen-and-ink contour lines in background */}
        <div
          className="absolute -bottom-8 -right-8 w-44 h-44 rounded-full border pointer-events-none opacity-20"
          style={{ borderColor: 'var(--green)' }}
          aria-hidden="true"
        />

        {/* Top: Per-Person Primary Metric */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-[#777C72] mb-1.5">
              <Scale className="w-3.5 h-3.5 text-[#496951]" />
              <span>{t('results.perPersonTitle')}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={perPersonCo2e.toFixed(1)}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.2 }}
                  className="font-mono text-[42px] sm:text-[48px] font-bold text-[#242722] leading-none"
                >
                  {perPersonCo2e.toFixed(1)}
                </motion.span>
              </AnimatePresence>
              <span className="font-mono font-bold text-[16px] text-[#777C72]">
                {t('results.kgUnit')}
              </span>
            </div>
            <p className="text-[12px] text-[#777C72] mt-1 font-mono">
              {t('results.perPersonSub')}
            </p>
          </div>

          {/* Whole Trip Convoy Total */}
          <div className="sm:text-right pt-3 sm:pt-0 border-t sm:border-t-0" style={{ borderColor: 'var(--line)' }}>
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#777C72] block mb-1">
              {t('results.wholeTripTitle')} ({input.passengers} {input.passengers === 1 ? t('results.travelerSingle') : t('results.travelerPlural')})
            </span>
            <div className="flex items-baseline sm:justify-end gap-1.5">
              <span className="font-mono font-bold text-[24px] text-[#51554D] leading-none">
                {totalCo2e.toFixed(1)}
              </span>
              <span className="font-mono text-[13px] font-semibold text-[#777C72]">
                {t('results.kgUnit')}
              </span>
            </div>
            <span className="text-[11px] text-[#777C72]">{t('results.wholeTripSub')}</span>
          </div>
        </div>

        {/* Breakdown Progress Bars (Editorial Nature-Journal Style) */}
        <div className="pt-4 border-t space-y-3.5" style={{ borderColor: 'var(--line)' }}>
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#777C72] block">
            {t('results.breakdownTitle')}
          </span>

          {/* Transit bar */}
          <div className="breakdown-row">
            <div className="breakdown-label-line">
              <span className="font-medium text-[12.5px] text-[#242722]">
                {t('results.transit')} ({input.distanceKm} km · {input.transportMode.toUpperCase()}{breakdown.vehicleAgeMultiplier && breakdown.vehicleAgeMultiplier > 1 ? ` · ${input.registrationYear || breakdown.registrationYear || ''} [+${Math.round((breakdown.vehicleAgeMultiplier - 1) * 100)}% vehicle age factor]` : ''})
              </span>
              <span className="font-mono text-[12px] font-semibold text-[#242722]">
                {breakdown.transportPerPerson.toFixed(1)} kg
              </span>
            </div>
            <div className="breakdown-track">
              <div
                className="breakdown-fill tone-ink"
                style={{
                  width: `${Math.min(100, Math.max(5, (breakdown.transportPerPerson / Math.max(0.1, perPersonCo2e + breakdown.habitDeductionsPerPerson)) * 100))}%`,
                }}
              />
            </div>
          </div>

          {/* Older Vehicle Notice if applicable */}
          {breakdown.vehicleAgeMultiplier && breakdown.vehicleAgeMultiplier > 1 && (
            <div className="p-2.5 rounded bg-[#FFF9F0] border border-[#B3834D]/30 flex items-center justify-between text-[11.5px]">
              <span className="text-[#8A5D2E]">
                {language === 'HI'
                  ? `पुराने वाहन की वजह से: ${input.registrationYear || breakdown.registrationYear} मॉडल पर +${Math.round((breakdown.vehicleAgeMultiplier - 1) * 100)}% अतिरिक्त CO₂ जुड़ा है`
                  : `Older vehicle factor: Year ${input.registrationYear || breakdown.registrationYear} adds +${Math.round((breakdown.vehicleAgeMultiplier - 1) * 100)}% CO₂ release due to engine age`}
              </span>
              <span className="font-mono text-[#8A5D2E] font-bold">
                {breakdown.vehicleAgeMultiplier.toFixed(2)}×
              </span>
            </div>
          )}

          {/* Elevation incline penalty bar */}
          <div className="breakdown-row">
            <div className="breakdown-label-line">
              <span className="font-medium text-[12.5px] text-[#8A5D2E]">
                {t('results.climbPenalty')} ({terrainAdjustment.multiplier.toFixed(2)}× {terrainName})
              </span>
              <span className="font-mono text-[12px] font-semibold text-[#8A5D2E]">
                +{terrainAdjustment.uphillDeltaPerPerson.toFixed(1)} kg
              </span>
            </div>
            <div className="breakdown-track">
              <div
                className="breakdown-fill tone-amber"
                style={{
                  width: `${Math.min(100, Math.max(5, (terrainAdjustment.uphillDeltaPerPerson / Math.max(0.1, perPersonCo2e + breakdown.habitDeductionsPerPerson)) * 100))}%`,
                }}
              />
            </div>
          </div>

          {/* Lodging bar */}
          <div className="breakdown-row">
            <div className="breakdown-label-line">
              <span className="font-medium text-[12.5px] text-[#242722]">
                {t('results.stay')} ({input.nights} {language === 'HI' ? 'रातें' : 'nights'} · {input.accommodationType.toUpperCase()})
              </span>
              <span className="font-mono text-[12px] font-semibold text-[#242722]">
                {breakdown.accommodationPerPerson.toFixed(1)} kg
              </span>
            </div>
            <div className="breakdown-track">
              <div
                className="breakdown-fill tone-ink"
                style={{
                  width: `${Math.min(100, Math.max(5, (breakdown.accommodationPerPerson / Math.max(0.1, perPersonCo2e + breakdown.habitDeductionsPerPerson)) * 100))}%`,
                }}
              />
            </div>
          </div>

          {/* Habit deduction credit */}
          {breakdown.habitDeductionsPerPerson > 0 && (
            <div className="breakdown-row">
              <div className="breakdown-label-line">
                <span className="font-medium text-[12.5px] text-[#304B38]">
                  {t('results.habitSavings')} ({t('results.habitSavingsNote')})
                </span>
                <span className="font-mono text-[12px] font-semibold text-[#304B38]">
                  −{breakdown.habitDeductionsPerPerson.toFixed(1)} kg
                </span>
              </div>
              <div className="breakdown-track">
                <div
                  className="breakdown-fill tone-green"
                  style={{
                    width: `${Math.min(100, Math.max(5, (breakdown.habitDeductionsPerPerson / Math.max(0.1, perPersonCo2e + breakdown.habitDeductionsPerPerson)) * 100))}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Visualizer Embed (Bars / Pie / Table) */}
      <div className="journal-card p-0 overflow-hidden">
        <EmissionsVisualizer result={result} input={input} />
      </div>
    </motion.div>
  );
};
