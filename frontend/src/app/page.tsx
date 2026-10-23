'use client';

import React from 'react';
import { TripCalculatorForm } from '../components/TripCalculatorForm';
import { TopographicHero } from '../components/TopographicHero';
import { useTranslation } from '../contexts/TranslationContext';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-10">
      {/* Editorial Field-Guide Hero */}
      <TopographicHero />

      {/* Main Calculator Anchor & Section Heading */}
      <section id="calculator" className="scroll-mt-24 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b" style={{ borderColor: 'var(--line)' }}>
          <div>
            <div className="section-kicker mb-2">
              <span>// {t('navigation.calculator')}</span>
              <span className="text-[#8C9186]">·</span>
              <span>{t('home.elevationAware')}</span>
            </div>
            <h2
              className="text-[26px] sm:text-[34px] font-semibold tracking-[-0.035em] leading-tight"
              style={{ color: 'var(--ink)' }}
            >
              {t('calculator.pageHeader')}
            </h2>
            <p
              className="text-[14px] sm:text-[15px] mt-1.5 max-w-2xl leading-relaxed"
              style={{ color: 'var(--ink-soft)' }}
            >
              {t('calculator.pageSubtitle')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="font-mono text-[11px] px-3 py-1.5 rounded border inline-flex items-center gap-2"
              style={{
                backgroundColor: 'var(--paper-deep)',
                borderColor: 'var(--line)',
                color: 'var(--green-deep)',
              }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse-dot" style={{ backgroundColor: 'var(--green)' }} />
              {t('home.sourceBadge')}
            </span>
          </div>
        </div>

        {/* Complete Existing Trip Calculator Form */}
        <TripCalculatorForm />
      </section>
    </div>
  );
}
