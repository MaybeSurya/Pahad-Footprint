'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Scale,
  MountainSnow,
  Hotel,
  ShieldCheck,
  MapPin,
  Trees,
  ExternalLink,
  Calculator,
  Flame,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import {
  UTTARAKHAND_DISTRICTS,
  DISTRICTS_META,
  VAN_PANCHAYAT_RESEARCH,
  TOURISM_CARBON_DATA,
  CLIMATE_DISASTER_DATA,
} from '../../lib/uttarakhandData';

export default function MethodologyPage() {
  const { t, language } = useTranslation();
  const [selectedDivision, setSelectedDivision] = useState<'all' | 'Garhwal' | 'Kumaon'>('all');

  const filteredDistricts =
    selectedDivision === 'all'
      ? UTTARAKHAND_DISTRICTS
      : UTTARAKHAND_DISTRICTS.filter((d) => d.division === selectedDivision);

  return (
    <div className="max-w-[980px] 2xl:max-w-[1180px] 3xl:max-w-[1320px] mx-auto space-y-8 py-4">
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

      {/* Section 4: The 13 Districts & 12,089 Van Panchayats */}
      <div className="journal-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3" style={{ borderColor: 'var(--line)' }}>
          <div>
            <h2 className="text-[16px] font-bold text-[#242722] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#496951]" />
              <span>{t('methodology.districtsTitle')}</span>
            </h2>
            <p className="text-[12.5px] text-[#51554D] mt-0.5">
              {t('methodology.districtsDesc')}
            </p>
          </div>

          {/* Division Filter */}
          <div className="flex rounded bg-[#F0EEE6] p-1 border border-[#2D322B29] text-[11px] font-mono">
            {(['all', 'Garhwal', 'Kumaon'] as const).map((div) => (
              <button
                key={div}
                type="button"
                onClick={() => setSelectedDivision(div)}
                className={`px-3 py-1 rounded transition-all font-semibold ${
                  selectedDivision === div
                    ? 'bg-white text-[#304B38] shadow-xs font-bold'
                    : 'text-[#777C72] hover:text-[#242722]'
                }`}
              >
                {div === 'all' ? (language === 'HI' ? 'सभी 13 जिले' : 'All 13') : div}
              </button>
            ))}
          </div>
        </div>

        {/* Highlight KPI Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded border border-[#2D322B29] bg-[#FAF9F5]">
            <span className="text-[10.5px] font-mono uppercase text-[#777C72] block">Total Districts</span>
            <span className="font-mono text-[20px] font-bold text-[#242722]">13</span>
            <span className="text-[10.5px] text-[#51554D] block mt-0.5">Garhwal (7) · Kumaon (6)</span>
          </div>

          <div className="p-3 rounded border border-[#496951]/30 bg-[#E8EDE5]/50">
            <span className="text-[10.5px] font-mono uppercase text-[#496951] block font-bold">Official Van Panchayats</span>
            <span className="font-mono text-[20px] font-bold text-[#304B38]">12,089</span>
            <span className="text-[10.5px] text-[#51554D] block mt-0.5">Official cited statewide total</span>
          </div>

          <div className="p-3 rounded border border-[#2D322B29] bg-[#FAF9F5]">
            <span className="text-[10.5px] font-mono uppercase text-[#777C72] block">Total Geographic Area</span>
            <span className="font-mono text-[20px] font-bold text-[#242722]">53,483</span>
            <span className="text-[10.5px] text-[#51554D] block mt-0.5">Square Kilometres (km²)</span>
          </div>

          <div className="p-3 rounded border border-[#B3834D]/30 bg-[#FAF9F5]">
            <span className="text-[10.5px] font-mono uppercase text-[#8A5D2E] block font-bold">Active SPARC Support</span>
            <span className="font-mono text-[20px] font-bold text-[#8A5D2E]">750</span>
            <span className="text-[10.5px] text-[#51554D] block mt-0.5">Van Panchayats in 13 divisions</span>
          </div>
        </div>

        {/* Table of 13 Districts */}
        <div className="overflow-x-auto border border-[#2D322B1F] rounded">
          <table className="w-full text-left text-[12px]">
            <thead className="bg-[#FAF9F5] border-b border-[#2D322B1F] font-mono text-[11px] text-[#777C72]">
              <tr>
                <th className="py-2.5 px-3 font-semibold">No.</th>
                <th className="py-2.5 px-3 font-semibold">District</th>
                <th className="py-2.5 px-3 font-semibold">Division</th>
                <th className="py-2.5 px-3 font-semibold text-right">Approx. Van Panchayats</th>
                <th className="py-2.5 px-3 font-semibold text-right">Area (km²)</th>
                <th className="py-2.5 px-3 font-semibold">Himalayan Terrain & Ecological Zone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2D322B0F]">
              {filteredDistricts.map((d) => (
                <tr key={d.district} className="hover:bg-[#FAF9F5]/70 transition-colors">
                  <td className="py-2 px-3 font-mono text-[#777C72]">{d.no}</td>
                  <td className="py-2 px-3 font-bold text-[#242722]">{d.district}</td>
                  <td className="py-2 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10.5px] font-mono font-medium ${
                        d.division === 'Garhwal'
                          ? 'bg-[#E8EDE5] text-[#304B38]'
                          : 'bg-[#F4ECE1] text-[#8A5D2E]'
                      }`}
                    >
                      {d.division}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-[#304B38]">
                    {d.approxVanPanchayats.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-[#242722]">
                    {d.areaKm2.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-[11.5px] text-[#51554D]">{d.notableHimalayanTerrain}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-[#FAF9F5] font-mono font-bold text-[11.5px] text-[#242722] border-t border-[#2D322B1F]">
              <tr>
                <td className="py-2.5 px-3" colSpan={3}>
                  Official Statewide Total (Census 2011 + State Portal):
                </td>
                <td className="py-2.5 px-3 text-right text-[#304B38]">
                  12,089+ VPs
                </td>
                <td className="py-2.5 px-3 text-right">53,483 km²</td>
                <td className="py-2.5 px-3 text-[10.5px] text-[#777C72] font-normal">
                  All 13 districts verified across Garhwal & Kumaon
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Source Citation Footnote */}
        <div className="p-3 rounded bg-[#FAF9F5] border border-[#2D322B14] text-[11px] text-[#51554D] flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-[#304B38] flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#242722]">Official Citation: </strong>
            <span>{DISTRICTS_META.citation}</span>
            <span className="block mt-0.5 text-[#777C72]">
              Census of India 2011 & Uttarakhand State Government Portal; Total official figure cited: 12,089 Van Panchayats.
            </span>
          </div>
        </div>
      </div>

      {/* Section 5: Verified Van Panchayat Forest Science (Biomass & Carbon Stocks) */}
      <div className="journal-card space-y-4">
        <div>
          <h2 className="text-[16px] font-bold text-[#242722] flex items-center gap-2">
            <Trees className="w-4 h-4 text-[#496951]" />
            <span>{t('methodology.scienceTitle')}</span>
          </h2>
          <p className="text-[12.5px] text-[#51554D] mt-0.5">
            {t('methodology.scienceDesc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Study A: Kumaun University (2024) */}
          <div className="p-4 rounded border border-[#496951]/25 bg-[#FAF9F5] space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#496951] tracking-wider block">
                  Peer-Reviewed Study · 2024
                </span>
                <h3 className="text-[14px] font-bold text-[#242722] mt-0.5">
                  {VAN_PANCHAYAT_RESEARCH.kumaunStudy2024.paper}
                </h3>
                <span className="text-[11px] text-[#777C72] block">
                  {VAN_PANCHAYAT_RESEARCH.kumaunStudy2024.institution} · {VAN_PANCHAYAT_RESEARCH.kumaunStudy2024.journal}
                </span>
              </div>
              <a
                href={VAN_PANCHAYAT_RESEARCH.kumaunStudy2024.doiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[11px] font-mono text-[#304B38] hover:underline bg-white px-2 py-1 rounded border border-[#2D322B1F]"
              >
                <span>DOI</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-[#2D322B14]">
              <div className="p-2 rounded bg-white border border-[#2D322B14]">
                <span className="text-[9.5px] font-mono text-[#777C72] block uppercase">Biomass</span>
                <span className="font-mono text-[12px] font-bold text-[#242722] block mt-0.5">
                  120–240
                </span>
                <span className="text-[9px] text-[#777C72]">t/ha</span>
              </div>
              <div className="p-2 rounded bg-white border border-[#2D322B14]">
                <span className="text-[9.5px] font-mono text-[#777C72] block uppercase">Carbon Stock</span>
                <span className="font-mono text-[12px] font-bold text-[#242722] block mt-0.5">
                  56.9–113.1
                </span>
                <span className="text-[9px] text-[#777C72]">t C/ha</span>
              </div>
              <div className="p-2 rounded bg-[#E8EDE5] border border-[#496951]/30">
                <span className="text-[9.5px] font-mono text-[#304B38] block uppercase font-bold">Mean Carbon</span>
                <span className="font-mono text-[12px] font-bold text-[#304B38] block mt-0.5">
                  82.37 ±14
                </span>
                <span className="text-[9px] text-[#496951] font-semibold">t C/ha</span>
              </div>
            </div>

            <p className="text-[11.5px] text-[#51554D] leading-relaxed">
              <strong className="text-[#242722]">Key Ecological Finding: </strong>
              {VAN_PANCHAYAT_RESEARCH.kumaunStudy2024.keyFinding}
            </p>
          </div>

          {/* Study B: ABCF vs RCF (2025) & SPARC India */}
          <div className="space-y-3">
            {/* ABCF vs RCF */}
            <div className="p-3.5 rounded border border-[#2D322B1F] bg-[#FAF9F5] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold text-[#777C72]">
                  Forest Structure Analysis (2025)
                </span>
                <span className="text-[10px] font-mono text-[#8A5D2E] font-bold">ABCF vs RCF</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2 rounded bg-white border border-[#2D322B14]">
                  <span className="text-[#304B38] font-bold block">ABCF (Broadleaf)</span>
                  <div className="mt-1 space-y-0.5 text-[#51554D]">
                    <div>Density: <span className="text-[#242722] font-semibold">760 trees/ha</span></div>
                    <div>Biomass: <span className="text-[#242722] font-semibold">350.76 Mg/ha</span></div>
                    <div>Carbon: <span className="text-[#304B38] font-bold">175.77 Mg C/ha</span></div>
                  </div>
                </div>

                <div className="p-2 rounded bg-white border border-[#2D322B14]">
                  <span className="text-[#8A5D2E] font-bold block">RCF (Regenerated)</span>
                  <div className="mt-1 space-y-0.5 text-[#51554D]">
                    <div>Density: <span className="text-[#242722] font-semibold">380 trees/ha</span></div>
                    <div>Biomass: <span className="text-[#242722] font-semibold">261.81 Mg/ha</span></div>
                    <div>Carbon: <span className="text-[#8A5D2E] font-bold">131.37 Mg C/ha</span></div>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-[#51554D] leading-snug">
                {VAN_PANCHAYAT_RESEARCH.abcfRcfStudy2025.insight}
              </p>
            </div>

            {/* SPARC India */}
            <div className="p-3.5 rounded border border-[#496951]/25 bg-[#E8EDE5]/40 flex items-start gap-3">
              <div className="w-8 h-8 rounded bg-[#304B38] text-white flex items-center justify-center flex-shrink-0 font-bold text-[12px]">
                🌿
              </div>
              <div className="text-[11.5px]">
                <strong className="text-[#242722] block font-bold">
                  {VAN_PANCHAYAT_RESEARCH.sparcIndia.organization} Community Restoration
                </strong>
                <p className="text-[#51554D] leading-snug mt-0.5">
                  Supporting eco-restoration initiatives involving <strong>750 Van Panchayats</strong> across all 13 Uttarakhand divisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 6: Seasonal Tourism Carbon Footprint Calculation (IIT BHU EKC Study) */}
      <div className="journal-card space-y-4">
        <div>
          <h2 className="text-[16px] font-bold text-[#242722] flex items-center gap-2">
            <Calculator className="w-4 h-4 text-[#496951]" />
            <span>{t('methodology.tourismTitle')}</span>
          </h2>
          <p className="text-[12.5px] text-[#51554D] mt-0.5">
            {t('methodology.tourismDesc')}
          </p>
        </div>

        {/* 3 Input Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded border border-[#2D322B1F] bg-[#FAF9F5]">
            <span className="text-[10.5px] font-mono uppercase text-[#777C72] block">Seasonal Visitors</span>
            <div className="font-mono text-[22px] font-bold text-[#242722] my-0.5">4,000,000</div>
            <p className="text-[11px] text-[#51554D]">
              40 Lakh tourists per season (Uttarakhand Tourism Dept. 2023)
            </p>
          </div>

          <div className="p-3.5 rounded border border-[#2D322B1F] bg-[#FAF9F5]">
            <span className="text-[10.5px] font-mono uppercase text-[#777C72] block">Average Mountain Distance</span>
            <div className="font-mono text-[22px] font-bold text-[#304B38] my-0.5">300 km</div>
            <p className="text-[11px] text-[#51554D]">
              Average round-trip travel distance across hill corridors
            </p>
          </div>

          <div className="p-3.5 rounded border border-[#2D322B1F] bg-[#FAF9F5]">
            <span className="text-[10.5px] font-mono uppercase text-[#777C72] block">Shared Jeep Emission Rate</span>
            <div className="font-mono text-[22px] font-bold text-[#8A5D2E] my-0.5">0.12 kg</div>
            <p className="text-[11px] text-[#51554D]">
              0.12 kg CO₂ / passenger-km (Shared mountain transit)
            </p>
          </div>
        </div>

        {/* Math Calculation Formula Box */}
        <div className="p-4 rounded border border-[#304B38]/30 bg-[#FAF9F5] space-y-3 font-mono">
          <div className="flex items-center justify-between text-[11px] text-[#777C72]">
            <span>MATHEMATICAL DERIVATION</span>
            <span className="font-bold text-[#304B38]">IIT BHU EKC STUDY BENCHMARK</span>
          </div>

          <div className="bg-white p-3 rounded border border-[#2D322B1F] text-[13px] sm:text-[14px] text-[#242722] font-bold overflow-x-auto text-center">
            4,000,000 tourists × 300 km × 0.12 kg CO₂/km = 144,000,000 kg CO₂
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[#2D322B14] text-[12px]">
            <span className="text-[#51554D]">
              Total Estimated Seasonal Carbon Release:
            </span>
            <span className="font-bold text-[16px] text-[#304B38]">
              144,000 tonnes of CO₂ / season
            </span>
          </div>
        </div>

        {/* Academic Reconciliation Note */}
        <div className="p-3 rounded border border-[#B3834D]/30 bg-[#FAF9F5] text-[11.5px] text-[#51554D] space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-[#8A5D2E]">
            <Info className="w-3.5 h-3.5" />
            <span>Academic Note on Input Verification:</span>
          </div>
          <p className="leading-relaxed">
            {TOURISM_CARBON_DATA.seasonalCalculation.reconciliationNote}
          </p>
        </div>
      </div>

      {/* Section 7: Mountain Disasters & Climate Context */}
      <div className="journal-card space-y-4">
        <div>
          <h2 className="text-[16px] font-bold text-[#242722] flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#8A5D2E]" />
            <span>{t('methodology.disastersTitle')}</span>
          </h2>
          <p className="text-[12.5px] text-[#51554D] mt-0.5">
            {t('methodology.disastersDesc')}
          </p>
        </div>

        {/* 4 Historical Vulnerability Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded border border-[#2D322B1F] bg-[#FAF9F5] space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#777C72] block">Kedarnath Disaster (2013)</span>
            <div className="font-mono text-[18px] font-bold text-[#8A5D2E]">6,000+ Deaths</div>
            <p className="text-[11px] text-[#51554D] leading-snug">
              Multi-day cloudbursts, moraine breach of Chorabari Lake, and glacial flash flooding.
            </p>
          </div>

          <div className="p-3.5 rounded border border-[#2D322B1F] bg-[#FAF9F5] space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#777C72] block">Joshimath Subsidence (2023)</span>
            <div className="font-mono text-[18px] font-bold text-[#8A5D2E]">700+ Cracks</div>
            <p className="text-[11px] text-[#51554D] leading-snug">
              Over 700 houses developed structural fissures amid geotechnical slope subsidence.
            </p>
          </div>

          <div className="p-3.5 rounded border border-[#2D322B1F] bg-[#FAF9F5] space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#777C72] block">Forest Fires (2024)</span>
            <div className="font-mono text-[18px] font-bold text-[#8A5D2E]">1,000+ Incidents</div>
            <p className="text-[11px] text-[#51554D] leading-snug">
              Over 2,000 hectares burned across chir pine monocultures during prolonged dry spells.
            </p>
          </div>

          <div className="p-3.5 rounded border border-[#2D322B1F] bg-[#FAF9F5] space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#777C72] block">Regional Temperature Rise</span>
            <div className="font-mono text-[18px] font-bold text-[#304B38]">+1.5°C Anomaly</div>
            <p className="text-[11px] text-[#51554D] leading-snug">
              Recorded temperature warming trend across Uttarakhand meteorological stations (IMD Dehradun).
            </p>
          </div>
        </div>

        {/* Causal Disclaimer Notice */}
        <div className="p-4 rounded border border-[#8A5D2E]/30 bg-[#FAF9F5] text-[12px] leading-relaxed flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-[#8A5D2E] flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-[#242722] block font-bold">
              Scientific Context & Non-Causality Disclaimer:
            </strong>
            <p className="text-[#51554D]">
              {CLIMATE_DISASTER_DATA.scientificDisclaimer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
