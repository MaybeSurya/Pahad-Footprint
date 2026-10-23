'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '../contexts/TranslationContext';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer
      className="border-t mt-auto overflow-hidden relative"
      style={{
        backgroundColor: 'var(--paper-deep)',
        borderColor: 'var(--line)',
      }}
    >
      {/* Panoramic Etched Mountain Ridge Horizon */}
      <div className="relative w-full h-24 sm:h-32 md:h-40 overflow-hidden border-b select-none" style={{ borderColor: 'var(--line)' }}>
        <Image
          src="/images/footer_panorama.webp"
          alt="Panoramic mountain ridge of Garhwal and Kumaon"
          fill
          className="object-cover object-bottom opacity-75 mix-blend-multiply"
          sizes="100vw"
        />
        {/* Subtle top & bottom paper blend gradients */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, var(--paper-deep) 0%, transparent 20%, transparent 80%, var(--paper-deep) 100%)',
          }}
        />
        {/* Elevation gradient badge overlay */}
        <div
          className="absolute bottom-2 right-4 sm:right-8 px-2.5 py-1 rounded border font-mono text-[10px] hidden sm:flex items-center gap-2"
          style={{
            backgroundColor: 'rgba(247, 246, 240, 0.92)',
            borderColor: 'var(--line)',
            color: 'var(--ink-soft)',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--green)' }} />
          <span>HIMALAYAN HORIZON · NANDA DEVI (7,816m)</span>
        </div>
      </div>

      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t" style={{ borderColor: 'var(--line)' }}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Brand Lockup */}
          <div className="flex items-center gap-3.5">
            <div
              className="w-10 h-10 rounded border flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: 'var(--paper-card)',
                borderColor: 'var(--line)',
                color: 'var(--green-deep)',
              }}
              aria-hidden="true"
            >
              <svg className="w-5 h-5" viewBox="0 0 42 42" fill="none">
                <path d="M4 31 15.2 14l6.1 8.5 4.1-6.1L38 31H4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="m15.2 14 3.1 4.4-3.9-1.2M25.4 16.4l2.3 3.3-3.4-1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M8 35h26" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <span className="font-bold tracking-tight text-[15px] block leading-snug" style={{ color: 'var(--ink)' }}>
                {t('home.title')}
              </span>
              <span className="font-mono text-[10.5px] block" style={{ color: 'var(--ink-faint)' }}>
                {t('footer.coordinates')}
              </span>
            </div>
          </div>

          {/* Coordinates and Methodology link */}
          <div className="flex flex-wrap items-center gap-6 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
            <span className="font-mono text-[11px] px-2.5 py-1 rounded border" style={{ borderColor: 'var(--line)', backgroundColor: 'var(--paper-card)' }}>
              {t('footer.elevationGradient')}
            </span>
            <Link href="/methodology" className="text-link">
              {t('footer.methodologyLink')}
            </Link>
            <Link href="/restoration" className="text-link">
              {t('footer.restorationLink')}
            </Link>
          </div>
        </div>

        {/* Bottom note */}
        <div
          className="mt-6 pt-4 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11.5px]"
          style={{ borderColor: 'var(--line)', color: 'var(--ink-faint)' }}
        >
          <p>
            {t('footer.copyright')}
          </p>
          <span className="font-mono text-[10.5px]">
            {t('footer.version')}
          </span>
        </div>
      </div>
    </footer>
  );
};
