'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Compass,
  Trees,
  BookOpen,
  HeartHandshake,
  ShieldCheck,
  WifiOff,
  ExternalLink,
  MapPin,
  QrCode,
  MountainSnow,
  CloudSun,
} from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext';

export const Footer: React.FC = () => {
  const { t, language } = useTranslation();

  return (
    <footer
      className="border-t mt-auto overflow-hidden relative"
      style={{
        backgroundColor: 'var(--paper-deep)',
        borderColor: 'var(--line)',
      }}
      role="contentinfo"
    >
      {/* ── Top Mountain Ridge Horizon Panorama ── */}
      <div className="relative w-full h-28 sm:h-36 md:h-44 overflow-hidden border-b select-none" style={{ borderColor: 'var(--line)' }}>
        <Image
          src="/images/footer_panorama.webp"
          alt="Panoramic mountain ridge of Garhwal and Kumaon"
          fill
          className="object-cover object-bottom opacity-75 mix-blend-multiply"
          sizes="100vw"
        />
        {/* Paper tone gradient blend */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, var(--paper-deep) 0%, transparent 20%, transparent 80%, var(--paper-deep) 100%)',
          }}
        />

        {/* Mountain Peak Badges overlay */}
        <div className="absolute bottom-3 left-4 sm:left-8 flex items-center gap-2 font-mono text-[10px] text-[#51554D]">
          <span className="px-2 py-0.5 rounded bg-[#FAF9F5]/90 border border-[#2D322B29] backdrop-blur-xs flex items-center gap-1.5 shadow-2xs">
            <MountainSnow className="w-3 h-3 text-[#304B38]" />
            <span>GARHWAL & KUMAON HIMALAYAN RIDGELINE</span>
          </span>
        </div>

        <div className="absolute bottom-3 right-4 sm:right-8 hidden md:flex items-center gap-2 font-mono text-[10px] text-[#51554D]">
          <span className="px-2.5 py-0.5 rounded bg-[#FAF9F5]/90 border border-[#2D322B29] backdrop-blur-xs flex items-center gap-1.5 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#496951]" />
            <span>NANDA DEVI BASIN · 7,816m</span>
          </span>
        </div>
      </div>

      {/* ── Elevation Corridor Ribbon ── */}
      <div className="border-b bg-[#FAF9F5]/70 py-2.5 px-4 sm:px-6 lg:px-8 text-[11px] font-mono" style={{ borderColor: 'var(--line)' }}>
        <div className="max-w-[1380px] 2xl:max-w-[1560px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[#777C72]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-[#304B38] flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>ELEVATION TRANSECT:</span>
            </span>
            <span>Rishikesh (372m)</span>
            <span>→</span>
            <span>Nainital (2,084m)</span>
            <span>→</span>
            <span>Badrinath (3,100m)</span>
            <span>→</span>
            <span>Kedarnath (3,583m)</span>
            <span>→</span>
            <span className="font-bold text-[#242722]">Nanda Devi (7,816m)</span>
          </div>
          <div className="text-[10.5px]">
            <span>30.0668° N, 79.0193° E · Uttarakhand, India</span>
          </div>
        </div>
      </div>

      {/* ── 4-Column Structured Content ── */}
      <div className="max-w-[1380px] 2xl:max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Column 1: Brand & Purpose */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg border flex items-center justify-center flex-shrink-0 overflow-hidden shadow-2xs"
                style={{
                  backgroundColor: 'var(--paper-card)',
                  borderColor: 'var(--line)',
                }}
                aria-hidden="true"
              >
                <Image
                  src="/icons/icon.svg"
                  alt="Pahad Footprint Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-bold tracking-tight text-[16px] text-[#242722] block leading-tight">
                  {t('home.title')}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#777C72]">
                  {t('home.subtitle')}
                </span>
              </div>
            </div>

            <p className="text-[12.5px] text-[#51554D] leading-relaxed">
              {language === 'HI'
                ? 'उत्तराखंड की नाजुक हिमालयी वादियों में जिम्मेदारी से यात्रा करने का कार्बन गाइड। तीखे पहाड़ी मोड़ों, खड़ी चढ़ाइयों और स्थानीय वन पंचायतों के संरक्षण प्रयासों का संपूर्ण हिसाब।'
                : 'A mountain-aware carbon guide for journeys through Uttarakhand. Factoring road curvature, steep climbs, high altitudes, and community tree planting.'}
            </p>

            {/* Offline PWA & Privacy Badges */}
            <div className="space-y-2 pt-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#E8EDE5] text-[#304B38] text-[11px] font-mono border border-[#496951]/20">
                <WifiOff className="w-3 h-3" />
                <span>100% Offline-Ready PWA</span>
              </div>
              <div className="block">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white text-[#51554D] text-[11px] font-mono border border-[#2D322B1F]">
                  <ShieldCheck className="w-3 h-3 text-[#496951]" />
                  <span>Client-Side Private · Zero Tracking</span>
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Trip Planning & Calculator */}
          <div className="space-y-3">
            <h4 className="font-mono text-[11px] uppercase tracking-wider font-bold text-[#242722] border-b pb-1.5" style={{ borderColor: 'var(--line)' }}>
              {language === 'HI' ? 'यात्रा कैलकुलेटर' : 'Trip Calculator'}
            </h4>
            <ul className="space-y-2 text-[12.5px] text-[#51554D]">
              <li>
                <Link href="/calculator/route" className="hover:text-[#242722] hover:underline flex items-center gap-1.5 transition-colors">
                  <Compass className="w-3.5 h-3.5 text-[#496951]" />
                  <span>{language === 'HI' ? 'कदम ०१: मार्ग एवं दूरी' : 'Step 1: Route & Slope'}</span>
                </Link>
              </li>
              <li>
                <Link href="/calculator/vehicle" className="hover:text-[#242722] hover:underline flex items-center gap-1.5 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#496951]" />
                  <span>{language === 'HI' ? 'कदम ०२: वाहन एवं दोपहिया' : 'Step 2: Vehicles & Two-Wheelers'}</span>
                </Link>
              </li>
              <li>
                <Link href="/calculator/stay" className="hover:text-[#242722] hover:underline flex items-center gap-1.5 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#496951]" />
                  <span>{language === 'HI' ? 'कदम ०३: होटल एवं होमस्टे' : 'Step 3: Stays & Homestays'}</span>
                </Link>
              </li>
              <li>
                <Link href="/calculator/habits" className="hover:text-[#242722] hover:underline flex items-center gap-1.5 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#496951]" />
                  <span>{language === 'HI' ? 'कदम ०४: पर्यावरण-अनुकूल आदतें' : 'Step 4: Eco-Travel Habits'}</span>
                </Link>
              </li>
              <li>
                <Link href="/calculator/results" className="hover:text-[#242722] hover:underline flex items-center gap-1.5 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#304B38]" />
                  <span>{language === 'HI' ? 'कदम ०५: यात्रा कार्बन लेखा' : 'Step 5: Trip Carbon Results'}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Science & Methodology */}
          <div className="space-y-3">
            <h4 className="font-mono text-[11px] uppercase tracking-wider font-bold text-[#242722] border-b pb-1.5" style={{ borderColor: 'var(--line)' }}>
              {language === 'HI' ? 'गणना विज्ञान एवं डेटा' : 'Science & Data'}
            </h4>
            <ul className="space-y-2 text-[12.5px] text-[#51554D]">
              <li>
                <Link href="/methodology" className="hover:text-[#242722] hover:underline flex items-center gap-1.5 transition-colors">
                  <BookOpen className="w-3.5 h-3.5 text-[#496951]" />
                  <span>{t('navigation.methodology')}</span>
                </Link>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#777C72]" />
                <span>ARAI Indian Driving Standards</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#777C72]" />
                <span>CRRI Hill Incline Multipliers</span>
              </li>
              <li>
                <a
                  href="https://weather.maybesurya.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#242722] hover:underline inline-flex items-center gap-1 text-[#304B38] font-medium"
                >
                  <CloudSun className="w-3.5 h-3.5" />
                  <span>Live Weather & AQI</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#242722] hover:underline flex items-center gap-1.5 transition-colors">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#8A5D2E]" />
                  <span>{t('navigation.adminAnalytics')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Tree Restoration & NGOs */}
          <div className="space-y-3">
            <h4 className="font-mono text-[11px] uppercase tracking-wider font-bold text-[#242722] border-b pb-1.5" style={{ borderColor: 'var(--line)' }}>
              {language === 'HI' ? 'पौधारोपण एवं वन पंचायत' : 'Tree Restoration'}
            </h4>
            <ul className="space-y-2 text-[12.5px] text-[#51554D]">
              <li>
                <Link href="/restoration" className="hover:text-[#242722] hover:underline flex items-center gap-1.5 font-semibold text-[#304B38] transition-colors">
                  <Trees className="w-3.5 h-3.5" />
                  <span>{language === 'HI' ? 'बांज ओक पौधारोपण अभियान' : 'Banj Oak Reforestation'}</span>
                </Link>
              </li>
              <li>
                <a
                  href="https://devnexis.in/payment"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#242722] hover:underline inline-flex items-center gap-1 text-[#242722] font-semibold"
                >
                  <HeartHandshake className="w-3.5 h-3.5 text-[#304B38]" />
                  <span>{language === 'HI' ? 'एनजीओ को दान दें' : 'Donate to NGOs'}</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
              <li>
                <Link
                  href="/verify"
                  className="hover:text-[#242722] hover:underline inline-flex items-center gap-1.5 text-[#51554D] font-medium transition-colors"
                >
                  <QrCode className="w-3.5 h-3.5 text-[#304B38]" />
                  <span>{language === 'HI' ? 'प्रमाण पत्र सत्यापन' : 'Verify Certificate'}</span>
                </Link>
              </li>
              <li className="pt-1">
                <div className="p-2.5 rounded border border-[#496951]/20 bg-[#E8EDE5]/50 text-[11px] text-[#304B38]">
                  <span>🌲 1 native Banj Oak tree absorbs ~22 kg CO₂ annually and protects mountain springs.</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div
          className="mt-10 pt-6 border-t flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[11.5px]"
          style={{ borderColor: 'var(--line)', color: 'var(--ink-faint)' }}
        >
          <div className="space-y-1">
            <p className="text-[#51554D]">
              {t('footer.copyright')}
            </p>
            <p className="text-[10.5px] font-mono text-[#777C72]">
              Himalayan Weather API by MaybeSurya · OpenStreetMap & Leaflet · ARAI Hill Factors
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-[10.5px]">
            <span className="px-2 py-0.5 rounded bg-white border border-[#2D322B1F] text-[#304B38] font-bold">
              PWA v1.2 · OFFLINE READY
            </span>
            <span className="text-[#777C72]">
              DEVBHOOMI UTTARAKHAND
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
