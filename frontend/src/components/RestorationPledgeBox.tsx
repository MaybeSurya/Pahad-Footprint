'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Trees, ShieldCheck, CheckCircle2, Leaf, ArrowRight } from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext';

interface RestorationPledgeBoxProps {
  saplings: {
    perPerson: number;
    total: number;
  };
  onPledgeSuccess?: () => void;
}

export const RestorationPledgeBox: React.FC<RestorationPledgeBoxProps> = ({
  saplings,
  onPledgeSuccess,
}) => {
  const { t } = useTranslation();
  const [pledged, setPledged] = useState(false);

  const handlePledge = () => {
    setPledged(true);
    if (onPledgeSuccess) onPledgeSuccess();
  };

  const suggestedText = t('pledge.suggested')
    .replace('{perPerson}', saplings.perPerson.toString())
    .replace('{total}', saplings.total.toString());

  const buttonText = t('pledge.pledgeButton').replace(
    '{total}',
    saplings.total.toString()
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.12 }}
      className="journal-card space-y-4"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded border flex items-center justify-center flex-shrink-0"
          style={{
            backgroundColor: 'var(--green-pale)',
            borderColor: 'rgba(73, 105, 81, 0.25)',
            color: 'var(--green-deep)',
          }}
        >
          <Trees className="w-4 h-4" />
        </div>
        <div>
          <div className="section-kicker">
            <span>{t('pledge.kicker')}</span>
          </div>
          <h4 className="text-[14.5px] font-bold text-[#242722] tracking-tight">
            {t('pledge.title')}
          </h4>
          <p className="text-[12px] text-[#51554D] mt-1 leading-relaxed">
            {suggestedText}
          </p>
        </div>
      </div>

      {/* Indigenous Species Card */}
      <div
        className="rounded p-3.5 flex items-center gap-3 border"
        style={{
          backgroundColor: 'var(--ink)',
          borderColor: 'var(--ink)',
          color: '#FFFFFF',
        }}
      >
        <div
          className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'rgba(232, 237, 229, 0.15)' }}
        >
          <Leaf className="w-4 h-4 text-[#E8EDE5]" />
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-[13px] font-bold text-white">
              {t('pledge.speciesTitle')}
            </span>
            <span className="text-[11px] italic text-[#CFCABF]">
              {t('pledge.speciesLatin')}
            </span>
          </div>
          <p className="text-[11px] text-[#CFCABF] mt-0.5 leading-snug">
            {t('pledge.speciesDesc')}
          </p>
        </div>
      </div>

      {/* Community Caveat Notice */}
      <div
        className="rounded p-3 text-[11px] leading-relaxed border"
        style={{
          backgroundColor: 'var(--paper-deep)',
          borderColor: 'var(--line)',
          color: 'var(--ink-soft)',
        }}
      >
        <strong className="text-[#242722]">{t('pledge.fieldNoteTitle')}</strong>{' '}
        {t('pledge.fieldNoteBody')}
      </div>

      {/* Action Button & Confirmation */}
      <div className="pt-1 space-y-2">
        <AnimatePresence mode="wait">
          {pledged ? (
            <motion.div
              key="pledged"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 rounded text-center font-semibold flex items-center justify-center gap-2 border text-[12.5px]"
              style={{
                backgroundColor: 'var(--green-pale)',
                borderColor: 'rgba(73, 105, 81, 0.3)',
                color: 'var(--green-deep)',
              }}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('pledge.pledgeThankYou')}</span>
            </motion.div>
          ) : (
            <motion.button
              key="unpledged"
              type="button"
              whileTap={{ scale: 0.99 }}
              onClick={handlePledge}
              className="btn-accent w-full justify-center py-3 text-[13px]"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{buttonText}</span>
            </motion.button>
          )}
        </AnimatePresence>

        <div className="text-center">
          <Link
            href="/methodology"
            className="text-link text-[11.5px]"
          >
            {t('pledge.methodologyLink')}
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
