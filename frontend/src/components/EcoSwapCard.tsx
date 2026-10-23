'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingDown, Info, ArrowRight } from 'lucide-react';
import { CalculationOutput } from '../types';
import { useTranslation } from '../contexts/TranslationContext';

interface EcoSwapCardProps {
  ecoSwap: CalculationOutput['ecoSwap'];
  currentPerPerson: number;
}

export const EcoSwapCard: React.FC<EcoSwapCardProps> = ({ ecoSwap, currentPerPerson }) => {
  const { t } = useTranslation();

  const impactReductionText = t('ecoSwap.impactReduction').replace(
    '{percent}',
    ecoSwap.percentageReduction.toString()
  );

  const reducesFromToText = t('ecoSwap.reducesFromTo')
    .replace('{from}', currentPerPerson.toFixed(1))
    .replace('{to}', ecoSwap.newPerPersonCo2e.toFixed(1));

  const summaryBodyText = t('ecoSwap.summaryBody')
    .replace('{transport}', ecoSwap.recommendedTransport.split('(')[0].trim())
    .replace('{stay}', ecoSwap.recommendedStay.split('(')[0].trim())
    .replace('{perPerson}', ecoSwap.newPerPersonCo2e.toFixed(1))
    .replace('{total}', ecoSwap.newTotalCo2e.toFixed(1))
    .replace('{saved}', ecoSwap.savingsPerPerson.toFixed(1));

  const greenCessBodyText = t('ecoSwap.greenCessBody').replace(
    '{amount}',
    ecoSwap.greenCessAmountInr.toString()
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.08 }}
      className="journal-card relative overflow-hidden"
    >
      {/* Accent left hairline */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ backgroundColor: 'var(--green)' }}
      />

      <div className="pl-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded border flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: 'var(--green-pale)',
                borderColor: 'rgba(73, 105, 81, 0.25)',
                color: 'var(--green-deep)',
              }}
            >
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="section-kicker">
                <span>{t('ecoSwap.badge')}</span>
              </div>
              <h4 className="text-[14.5px] font-bold text-[#242722] tracking-tight">
                {t('ecoSwap.title')}
              </h4>
            </div>
          </div>

          <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#E8EDE5] text-[#304B38] border border-[#496951]/25">
            {impactReductionText}
          </span>
        </div>

        {/* Savings description box */}
        <div
          className="rounded p-3.5 mb-3 border"
          style={{
            backgroundColor: 'var(--green-pale)',
            borderColor: 'rgba(73, 105, 81, 0.25)',
          }}
        >
          <div className="flex items-center gap-1.5 mb-1 text-[13px] font-bold text-[#304B38]">
            <TrendingDown className="w-4 h-4" />
            <span>{reducesFromToText}</span>
          </div>
          <p className="text-[12px] text-[#51554D] leading-relaxed">
            {summaryBodyText}
          </p>
        </div>

        {/* Green Cess note */}
        <div
          className="rounded p-3 flex items-start gap-2.5 border"
          style={{
            backgroundColor: 'var(--paper-deep)',
            borderColor: 'var(--line)',
          }}
        >
          <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-[#777C72]" />
          <p className="text-[11px] text-[#51554D] leading-relaxed">
            <strong className="text-[#242722]">{t('ecoSwap.greenCessTitle')}</strong>{' '}
            {greenCessBodyText}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
