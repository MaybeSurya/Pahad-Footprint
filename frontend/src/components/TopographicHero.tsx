'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MountainSnow, Compass, ShieldCheck, TreePine, ArrowDown } from 'lucide-react';
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
          {/* Eyebrow Pill */}
          <div className="eyebrow-pill mb-4 sm:mb-5">
            <span className="text-[#304B38]">★</span>
            <span>{t('hero.eyebrow')}</span>
          </div>

          {/* Editorial Headline */}
          <h1
            className="text-[30px] xs:text-[36px] sm:text-[46px] lg:text-[54px] xl:text-[58px] 2xl:text-[64px] 3xl:text-[72px] font-semibold leading-[1.08] tracking-[-0.035em] mb-4 sm:mb-5"
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
          <div className="flex flex-wrap items-center gap-3.5 sm:gap-5 mb-7 sm:mb-9">
            <a
              href="#calculator"
              className="btn-primary"
            >
              <span>{t('hero.ctaConfigure')}</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </a>
            <a
              href="/methodology"
              className="text-link text-[13px] sm:text-[14px]"
            >
              {t('hero.ctaMethodology')}
            </a>
          </div>

          {/* Field Note Index Line */}
          <div
            className="flex items-center gap-3 text-[11px] font-mono tracking-wider pt-2"
            style={{ color: 'var(--ink-faint)' }}
          >
            <span>{t('hero.fig01')}</span>
            <span
              className="flex-1 max-w-[120px] h-[1px]"
              style={{ backgroundColor: 'var(--line)' }}
            />
            <span className="hidden sm:inline">30.0869° N, 78.2676° E</span>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: Monochromatic Etched Himalayan Mountain Plate */}
        <div
          ref={mountainVisualRef}
          className="relative flex items-center justify-center min-h-[320px] sm:min-h-[380px] select-none"
        >
          {/* Concentric Contour Rings */}
          <div className="hero-contour hero-contour-one" />
          <div className="hero-contour hero-contour-two" />

          {/* Archival Field-Guide Etched Plate */}
          <div className="relative z-10 w-full max-w-[500px] 2xl:max-w-[580px] 3xl:max-w-[640px]">
            <div
              className="relative rounded-lg overflow-hidden border shadow-sm"
              style={{
                borderColor: 'var(--line-strong)',
                backgroundColor: 'var(--paper-card)',
              }}
            >
              {/* Corner crosshairs */}
              <span className="absolute top-2 left-2 z-20 font-mono text-[10px] leading-none select-none text-[#777C72]">+</span>
              <span className="absolute top-2 right-2 z-20 font-mono text-[10px] leading-none select-none text-[#777C72]">+</span>
              <span className="absolute bottom-2 left-2 z-20 font-mono text-[10px] leading-none select-none text-[#777C72]">+</span>
              <span className="absolute bottom-2 right-2 z-20 font-mono text-[10px] leading-none select-none text-[#777C72]">+</span>

              {/* Elevation Altitude Callout Tag */}
              <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F7F6F0]/95 backdrop-blur-xs border border-[#2D322B29] shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#496951]" />
                <span className="font-mono text-[10.5px] font-semibold text-[#304B38]">
                  {t('hero.nandaDeviAltitude')}
                </span>
              </div>

              {/* Monochromatic Etched Mountain WebP Image */}
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/11]">
                <Image
                  src="/images/hero_mountain.webp"
                  alt="Monochromatic woodblock etching of Himalayan peak sanctuary in Uttarakhand"
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

              {/* Archival Field Caption Bar */}
              <div
                className="px-3.5 py-2 border-t flex items-center justify-between text-[10.5px] font-mono tracking-wider"
                style={{
                  backgroundColor: 'var(--paper-subtle)',
                  borderColor: 'var(--line)',
                  color: 'var(--ink-faint)',
                }}
              >
                <span>{t('hero.fig01Survey')}</span>
                <span className="text-[#496951] font-semibold">{t('hero.plate04')}</span>
              </div>
            </div>

            {/* Coordinates Sub-caption */}
            <div
              className="flex items-center justify-between mt-2 px-1 text-[10px] font-mono tracking-wider"
              style={{ color: 'var(--ink-faint)' }}
            >
              <span>{t('hero.alpineCrest')}</span>
              <span>{t('hero.copperplate')}</span>
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
