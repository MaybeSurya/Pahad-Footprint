'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Scale, MountainSnow, Hotel, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';

export default function MethodologyPage() {
  const { t, language } = useTranslation();

  return (
    <div className="max-w-[980px] mx-auto space-y-8 py-4">
      {/* Back Link */}
      <div>
        <Link
          href="/"
          className="text-link font-mono text-[11.5px]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t('methodology.backLink')}</span>
        </Link>
      </div>

      {/* Header */}
      <div className="pb-4 border-b" style={{ borderColor: 'var(--line)' }}>
        <div className="section-kicker mb-2">
          <span>{t('methodology.kicker')}</span>
        </div>
        <h1
          className="text-[30px] sm:text-[40px] font-semibold tracking-[-0.035em] leading-tight mb-3"
          style={{ color: 'var(--ink)' }}
        >
          {t('methodology.pageHeader')}
        </h1>
        <p
          className="text-[15px] sm:text-[16px] leading-relaxed max-w-2xl"
          style={{ color: 'var(--ink-soft)' }}
        >
          {t('methodology.pageSubtitle')}
        </p>
      </div>

      {/* Transparency Field Notice */}
      <div
        className="rounded p-4 text-[12.5px] leading-relaxed flex items-start gap-3 border"
        style={{
          backgroundColor: 'var(--amber-pale)',
          borderColor: 'rgba(179, 131, 77, 0.3)',
          color: 'var(--amber-deep)',
        }}
      >
        <span className="font-mono font-bold text-[14px]">⚠</span>
        <div>
          <strong>{t('methodology.noticeTitle')}</strong> {t('methodology.noticeText')}
        </div>
      </div>

      {/* 3 Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="journal-card p-5 space-y-2">
          <span className="font-mono text-[12px] font-bold text-[#496951]">01</span>
          <h2 className="text-[14px] font-bold text-[#242722]">{t('methodology.card1Title')}</h2>
          <p className="text-[12px] text-[#51554D] leading-relaxed">
            {t('methodology.card1Desc')}
          </p>
        </div>

        <div className="journal-card p-5 space-y-2">
          <span className="font-mono text-[12px] font-bold text-[#496951]">02</span>
          <h2 className="text-[14px] font-bold text-[#242722]">{t('methodology.card2Title')}</h2>
          <p className="text-[12px] text-[#51554D] leading-relaxed">
            {t('methodology.card2Desc')}
          </p>
        </div>

        <div className="journal-card p-5 space-y-2">
          <span className="font-mono text-[12px] font-bold text-[#496951]">03</span>
          <h2 className="text-[14px] font-bold text-[#242722]">{t('methodology.card3Title')}</h2>
          <p className="text-[12px] text-[#51554D] leading-relaxed">
            {t('methodology.card3Desc')}
          </p>
        </div>
      </div>

      {/* Section 1: Mathematical Formulations */}
      <div className="journal-card space-y-4">
        <h2 className="text-[16px] font-bold text-[#242722] flex items-center gap-2">
          <Scale className="w-4 h-4 text-[#496951]" />
          <span>{t('methodology.transportTitle')}</span>
        </h2>

        <div className="space-y-3 font-mono text-[12px]">
          <div className="p-3.5 rounded bg-[#FAF9F5] border border-[#2D322B29] space-y-1">
            <span className="text-[#304B38] font-bold block">{t('methodology.transportVehicle')}</span>
            <div className="bg-white p-2.5 rounded border border-[#2D322B29] text-[#242722] overflow-x-auto">
              {t('methodology.transportVehicleFormula')}
            </div>
          </div>

          <div className="p-3.5 rounded bg-[#FAF9F5] border border-[#2D322B29] space-y-1">
            <span className="text-[#304B38] font-bold block">{t('methodology.transportPublic')}</span>
            <div className="bg-white p-2.5 rounded border border-[#2D322B29] text-[#242722] overflow-x-auto">
              {t('methodology.transportPublicFormula')}
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Altitude Terrain Multipliers */}
      <div className="journal-card space-y-4">
        <h2 className="text-[16px] font-bold text-[#242722] flex items-center gap-2">
          <MountainSnow className="w-4 h-4 text-[#496951]" />
          <span>{t('methodology.terrainTitle')}</span>
        </h2>
        <p className="text-[13px] text-[#51554D] leading-relaxed">
          {t('methodology.terrainDesc')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded border border-[#2D322B29] bg-[#FAF9F5]">
            <span className="font-mono text-[10.5px] uppercase font-bold text-[#777C72]">
              {t('calculator.terrainFoothills')}
            </span>
            <div className="font-mono text-[22px] font-bold text-[#242722] my-0.5">1.00×</div>
            <p className="text-[11px] text-[#777C72]">{language === 'HI' ? 'रामनगर, हरिद्वार मैदानी मार्ग' : 'Ramnagar, Haridwar flat routes'}</p>
          </div>
          <div className="p-3.5 rounded border border-[#2D322B29] bg-[#FAF9F5]">
            <span className="font-mono text-[10.5px] uppercase font-bold text-[#777C72]">
              {t('calculator.terrainMidHills')}
            </span>
            <div className="font-mono text-[22px] font-bold text-[#304B38] my-0.5">1.25×</div>
            <p className="text-[11px] text-[#777C72]">{language === 'HI' ? 'नैनीताल, अल्मोड़ा, मसूरी' : 'Nainital, Almora, Mussoorie'}</p>
          </div>
          <div className="p-3.5 rounded border border-[#2D322B29] bg-[#FAF9F5]">
            <span className="font-mono text-[10.5px] uppercase font-bold text-[#777C72]">
              {t('calculator.terrainHighAltitude')}
            </span>
            <div className="font-mono text-[22px] font-bold text-[#8A5D2E] my-0.5">1.40×</div>
            <p className="text-[11px] text-[#777C72]">{language === 'HI' ? 'चोपता, जोशीमठ, औली, केदारनाथ' : 'Chopta, Joshimath, Auli, Kedarnath'}</p>
          </div>
        </div>
      </div>

      {/* Section 3: Lodging Factors Table */}
      <div className="journal-card space-y-4">
        <h2 className="text-[16px] font-bold text-[#242722] flex items-center gap-2">
          <Hotel className="w-4 h-4 text-[#496951]" />
          <span>{t('methodology.accommodationTitle')}</span>
        </h2>
        <p className="text-[13px] text-[#51554D] leading-relaxed">
          {t('methodology.accommodationDesc')}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              type: t('calculator.stayLuxuryResort'),
              kg: '24.0 kg/night',
              note: language === 'HI' ? 'सेंट्रल हीटिंग, गर्म पानी, बैकअप जनरेटर' : 'Central heating, hot water, generator backup',
            },
            {
              type: t('calculator.stayStandardHotel'),
              kg: '9.0 kg/night',
              note: language === 'HI' ? 'ग्रिड बिजली और गीजर' : 'Standard room electricity and water geyser',
            },
            {
              type: t('calculator.stayPahadi'),
              kg: '6.0 kg/night',
              note: language === 'HI' ? 'सौर ऊर्जा, स्थानीय मौसमी भोजन' : 'Solar water heater, local fresh meals',
            },
            {
              type: t('calculator.stayEcoCamp'),
              kg: '3.5 kg/night',
              note: language === 'HI' ? 'कम से कम बिजली, सोलर लालटेन' : 'Low electricity, solar lanterns',
            },
          ].map((item) => (
            <div key={item.type} className="p-3 rounded border border-[#2D322B29] bg-[#FAF9F5]">
              <div className="text-[12.5px] font-bold text-[#242722]">{item.type}</div>
              <div className="font-mono text-[13px] font-bold text-[#304B38] my-0.5">{item.kg}</div>
              <div className="text-[10.5px] text-[#777C72] leading-snug">{item.note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
