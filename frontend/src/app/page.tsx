'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  MapPin,
  Navigation2,
  Home as HomeIcon,
  Leaf,
  BarChart3,
  Sparkles,
  MountainSnow,
  TreePine,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { TopographicHero } from '../components/TopographicHero';
import { TripCalculatorForm } from '../components/TripCalculatorForm';
import { useTranslation } from '../contexts/TranslationContext';

export default function HomePage() {
  const { t, language } = useTranslation();
  const [showSinglePageForm, setShowSinglePageForm] = useState(false);

  const onboardingSteps = [
    {
      num: '01',
      path: '/calculator/route',
      titleEn: 'Route & Distance',
      titleHi: 'मार्ग एवं दूरी',
      descEn: 'Pick any of Uttarakhand’s 13 districts for your start and destination.',
      descHi: 'उत्तराखंड के सभी १३ जिलों में से प्रस्थान और गंतव्य चुनें।',
      icon: MapPin,
    },
    {
      num: '02',
      path: '/calculator/transport',
      titleEn: 'Vehicle & Two-Wheelers',
      titleHi: 'वाहन एवं दोपहिया',
      descEn: 'Choose bicycle, motorcycle, scooty, car, or state bus.',
      descHi: 'साइकिल, मोटरसाइकिल, स्कूटी, कार अथवा बस में से चुनें।',
      icon: Navigation2,
    },
    {
      num: '03',
      path: '/calculator/stay',
      titleEn: 'Where You Stay',
      titleHi: 'पहाड़ी ठहराव व होमस्टे',
      descEn: 'Choose homestays, nature camps, or hotels for each night.',
      descHi: 'होमस्टे, ईको-कैंप अथवा होटलों की रातों की संख्या चुनें।',
      icon: HomeIcon,
    },
    {
      num: '04',
      path: '/calculator/habits',
      titleEn: 'Green Travel Choices',
      titleHi: 'ईको आदतें एवं बचत',
      descEn: 'Save fuel and plastic with reusable water bottles and local mountain food.',
      descHi: 'पुन: प्रयोज्य पानी की बोतल और स्थानीय पहाड़ी भोजन से होने वाली बचत।',
      icon: Leaf,
    },
    {
      num: '05',
      path: '/calculator/results',
      titleEn: 'Results & Trees',
      titleHi: 'परिणाम व पौधारोपण',
      descEn: 'See your travel footprint and plant trees or support local village councils.',
      descHi: 'अपना यात्रा परिणाम देखें और पेड़ लगाएं अथवा स्थानीय वन पंचायतों को दान दें।',
      icon: BarChart3,
    },
  ];

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Editorial Field-Guide Hero */}
      <TopographicHero />

      {/* Onboarding Flow Callout & Bento Grid */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b" style={{ borderColor: 'var(--line)' }}>
          <div>
            <h2
              className="text-[26px] sm:text-[34px] font-semibold tracking-[-0.035em] leading-tight"
              style={{ color: 'var(--ink)' }}
            >
              {language === 'HI' ? '५ आसान चरणों में अपनी यात्रा की योजना बनाएं' : 'Plan Your Trip in 5 Simple Steps'}
            </h2>
            <p
              className="text-[14px] sm:text-[15px] mt-1.5 max-w-2xl leading-relaxed"
              style={{ color: 'var(--ink-soft)' }}
            >
              {language === 'HI'
                ? 'जानें कि आपकी पहाड़ी यात्रा में कितना प्रदूषण और ईंधन लगता है, आसान हरित उपाय खोजें और देखें कि कितने पेड़ आपकी यात्रा को संतुलित कर सकते हैं।'
                : 'Find out how much fuel and energy your mountain journey uses, discover easy green choices, and see how many trees can balance your travel.'}
            </p>
          </div>

          <Link
            href="/calculator/route"
            className="button-primary px-5 py-3 rounded text-[13.5px] font-bold inline-flex items-center gap-2 self-start md:self-auto shadow-xs"
          >
            <span>{language === 'HI' ? 'यात्रा शुरू करें (चरण ०१) →' : 'Start Planning (Step 01) →'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 5-Step Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {onboardingSteps.map((step) => {
            const IconComp = step.icon;
            return (
              <Link
                key={step.num}
                href={step.path}
                className="journal-card p-5 group hover:border-[#496951] hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#E8EDE5] text-[#304B38] border border-[#496951]/20">
                      STEP {step.num}
                    </span>
                    <div className="w-8 h-8 rounded border border-[#2D322B14] bg-[#FAF9F5] group-hover:bg-[#E8EDE5] flex items-center justify-center text-[#304B38] transition-colors">
                      <IconComp className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-[15px] font-bold text-[#242722] group-hover:text-[#304B38] transition-colors">
                    {language === 'HI' ? step.titleHi : step.titleEn}
                  </h3>
                  <p className="text-[12px] text-[#51554D] leading-relaxed mt-1.5">
                    {language === 'HI' ? step.descHi : step.descEn}
                  </p>
                </div>

                <div className="pt-3 mt-4 border-t border-[#2D322B14] flex items-center justify-between font-mono text-[11px] text-[#304B38] font-bold">
                  <span>{language === 'HI' ? 'कॉन्फ़िगर करें' : 'Configure Step'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Interactive Full-Page Form Expandable Option */}
        <div className="pt-4 text-center">
          <button
            type="button"
            onClick={() => setShowSinglePageForm(!showSinglePageForm)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded text-[12.5px] font-mono font-semibold text-[#51554D] hover:text-[#242722] hover:bg-[#F0EEE6] transition-all"
          >
            <span>{showSinglePageForm ? (language === 'HI' ? 'त्वरित १-पेज फॉर्म छुपाएं' : 'Hide All-in-One Form') : (language === 'HI' ? 'या त्वरित १-पेज फॉर्म देखें' : 'Or view quick all-in-one form on this page')}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showSinglePageForm ? 'rotate-180' : ''}`} />
          </button>

          {showSinglePageForm && (
            <div className="mt-6 text-left">
              <TripCalculatorForm />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
