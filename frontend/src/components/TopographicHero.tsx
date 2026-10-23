'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { MountainSnow, Compass, ShieldCheck, TreePine, ArrowRight } from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const TopographicHero: React.FC = () => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const mountainVisualRef = useRef<HTMLDivElement>(null);

  // GSAP subtle parallax effect on mountain visual
  useEffect(() => {
    if (!mountainVisualRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(mountainVisualRef.current, {
        y: 28,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="section-grid relative border-b overflow-hidden py-10 sm:py-16 mb-8"
      style={{
        borderColor: 'var(--line)',
        backgroundColor: 'var(--paper)',
      }}
      aria-label="Himalayan Eco-Carbon Accounting Overview"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)] 2xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)] items-center gap-8 sm:gap-10 lg:gap-14">
        {/* LEFT COLUMN: Editorial Field-Guide Copy */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10"
        >
          {/* Editorial Headline */}
          <h1
            className="text-[32px] xs:text-[38px] sm:text-[46px] lg:text-[54px] xl:text-[58px] 2xl:text-[64px] font-semibold leading-[1.08] tracking-[-0.035em] mb-4 sm:mb-5"
            style={{ color: 'var(--ink)' }}
          >
            {t('hero.headline')}{' '}
            <span style={{ color: 'var(--green)' }}>{t('hero.headlineAccent')}</span>
          </h1>

          {/* Description */}
          <p
            className="text-[14px] xs:text-[15px] sm:text-[16.5px] 3xl:text-[18px] leading-relaxed max-w-[580px] 3xl:max-w-[700px] mb-6 sm:mb-7"
            style={{ color: 'var(--ink-soft)' }}
          >
            {t('hero.description')}
          </p>

          {/* CTA Actions */}
          <div className="flex flex-wrap items-center gap-3.5 sm:gap-5">
            <Link
              href="/calculator/route"
              className="btn-primary"
            >
              <span>{t('hero.ctaConfigure')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/methodology"
              className="text-link text-[13px] sm:text-[14px]"
            >
              {t('hero.ctaMethodology')}
            </Link>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: Himalayan Mountain Plate */}
        <div
          ref={mountainVisualRef}
          className="relative flex items-center justify-center min-h-[320px] sm:min-h-[380px] select-none"
        >
          {/* Concentric Contour Rings */}
          <div className="hero-contour hero-contour-one" />
          <div className="hero-contour hero-contour-two" />

          {/* Clean Mountain Plate */}
          <div className="relative z-10 w-full max-w-[500px] 2xl:max-w-[580px] 3xl:max-w-[640px]">
            <div
              className="relative rounded-lg overflow-hidden border shadow-sm"
              style={{
                borderColor: 'var(--line-strong)',
                backgroundColor: 'var(--paper-card)',
              }}
            >
              {/* Mountain Name Tag */}
              <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F7F6F0]/95 backdrop-blur-xs border border-[#2D322B29] shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#496951]" />
                <span className="text-[11px] font-medium text-[#304B38]">
                  Garhwal &amp; Kumaon Himalayas
                </span>
              </div>

              {/* Mountain Image */}
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/11]">
                <Image
                  src="/images/hero_mountain.webp"
                  alt="Mountain ridge in Uttarakhand"
                  fill
                  priority
                  className="object-cover mix-blend-multiply opacity-90 transition-transform duration-700 hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
                {/* Paper texture overlay tint */}
                <div
                  className="absolute inset-0 pointer-events-none mix-blend-color"
                  style={{ backgroundColor: 'rgba(247, 246, 240, 0.12)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* BOTTOMLINE: Proof Points from Editorial Reference */}
      <div
        className="mt-8 pt-5 border-t grid grid-cols-1 sm:grid-cols-3 gap-4"
        style={{ borderColor: 'var(--line)' }}
      >
        <div className="flex items-start gap-3">
          <span className="font-mono text-[11px] font-bold text-[#496951] mt-0.5">{t('hero.proof01Number')}</span>
          <div>
            <h2 className="text-[13px] font-bold" style={{ color: 'var(--ink)' }}>{t('hero.proof01Title')}</h2>
            <p className="text-[12px] leading-relaxed mt-0.5" style={{ color: 'var(--ink-soft)' }}>
              {t('hero.proof01Text')}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span className="font-mono text-[11px] font-bold text-[#496951] mt-0.5">{t('hero.proof02Number')}</span>
          <div>
            <h2 className="text-[13px] font-bold" style={{ color: 'var(--ink)' }}>{t('hero.proof02Title')}</h2>
            <p className="text-[12px] leading-relaxed mt-0.5" style={{ color: 'var(--ink-soft)' }}>
              {t('hero.proof02Text')}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span className="font-mono text-[11px] font-bold text-[#496951] mt-0.5">{t('hero.proof03Number')}</span>
          <div>
            <h2 className="text-[13px] font-bold" style={{ color: 'var(--ink)' }}>{t('hero.proof03Title')}</h2>
            <p className="text-[12px] leading-relaxed mt-0.5" style={{ color: 'var(--ink-soft)' }}>
              {t('hero.proof03Text')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
