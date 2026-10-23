'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, MapPin, MountainSnow, Compass } from 'lucide-react';
import { useTranslation } from '../../../contexts/TranslationContext';
import { useTrip } from '../../../contexts/TripContext';
import dynamic from 'next/dynamic';
import { RouteSearch } from '../../../components/RouteSearch';
import { OpenMapRouteResult } from '../../../lib/openmaps';

const OpenMapView = dynamic(
  () => import('../../../components/OpenMapView').then((mod) => mod.OpenMapView),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 flex items-center justify-center bg-[#FAF9F5] text-[12px] text-[#777C72] font-mono rounded border border-[#2D322B14]">
        Loading mountain map...
      </div>
    ),
  }
);

export default function RouteStepPage() {
  const router = useRouter();
  const { t, language } = useTranslation();
  const {
    distance,
    setDistance,
    terrain,
    setTerrain,
    selectedRoute,
    setSelectedRoute,
  } = useTrip();

  const handleRouteCalculated = (route: OpenMapRouteResult) => {
    setSelectedRoute(route);
    setDistance(route.roundTripKm);
    setTerrain(route.terrainZone);
  };

  const handleNext = () => {
    router.push('/calculator/transport');
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Step Header */}
      <div className="pb-3 border-b" style={{ borderColor: 'var(--line)' }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#E8EDE5] text-[#304B38] border border-[#496951]/20">
            {language === 'HI' ? 'चरण ०१' : 'STEP 01'}
          </span>
          <span className="text-[12px] font-mono uppercase tracking-wider text-[#777C72]">
            {language === 'HI' ? 'मार्ग और ऊंचाई कारक' : 'Corridor & Elevation Gradient'}
          </span>
        </div>
        <h2 className="text-[22px] sm:text-[28px] font-bold text-[#242722] tracking-tight">
          {language === 'HI' ? 'उत्तराखंड में आप कहाँ जा रहे हैं?' : 'Where are you traveling in Uttarakhand?'}
        </h2>
        <p className="text-[13.5px] text-[#51554D] max-w-2xl mt-1 leading-relaxed">
          {language === 'HI'
            ? 'उत्तराखंड के सभी १३ जिलों के शहरों व कस्बों में से प्रस्थान और गंतव्य चुनें। हमारी प्रणाली वास्तविक सड़क दूरी और चढ़ाई के आधार पर गणना करती है।'
            : 'Select your starting point and mountain destination from any of Uttarakhand\'s 13 districts. Real mountain road curvature and altitude multipliers are applied automatically.'}
        </p>
      </div>

      {/* Main Grid: Form Inputs + Interactive Route Map */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-6 lg:gap-8 items-start">
        {/* Left: Input Selection Card */}
        <div className="journal-card space-y-6">
          {/* Corridor Search Component */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Compass className="w-4 h-4 text-[#496951]" />
              <label className="text-[13px] font-bold text-[#242722] uppercase tracking-wider font-mono">
                {language === 'HI' ? 'यात्रा मार्ग चुनें' : 'Select Origin & Destination'}
              </label>
            </div>
            <RouteSearch
              onRouteCalculated={handleRouteCalculated}
              currentDistance={distance}
            />
          </div>

          <div className="border-t border-[#2D322B14]" />

          <div className="border-t border-[#2D322B14]" />

          {/* Automatic Route Distance & Mountain Climb Information */}
          <div className="p-4 rounded border space-y-3 bg-[#FAF9F5] border-[#2D322B1F]">
            <div className="flex items-center justify-between pb-2 border-b border-[#2D322B14]">
              <div className="flex items-center gap-2">
                <MountainSnow className="w-4 h-4 text-[#496951]" />
                <span className="text-[13px] font-bold text-[#242722]">
                  {language === 'HI' ? 'स्वचालित मार्ग विश्लेषण' : 'Automatic Route & Elevation Summary'}
                </span>
              </div>
              <span className="text-[11px] font-mono font-bold text-[#304B38] bg-[#E8EDE5] px-2 py-0.5 rounded border border-[#496951]/20">
                ✓ {language === 'HI' ? 'मार्ग से स्वतः गणना' : 'Auto-Calculated'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px]">
              <div className="p-3 rounded bg-white border border-[#2D322B14]">
                <span className="text-[10.5px] font-mono text-[#777C72] uppercase block mb-1">
                  {language === 'HI' ? 'आना-जाना कुल दूरी' : 'Round-Trip Distance'}
                </span>
                <span className="font-mono text-[20px] font-bold text-[#304B38]">
                  {distance} km
                </span>
                <p className="text-[11px] text-[#51554D] mt-1 leading-snug">
                  {language === 'HI' ? 'दोनों तरफ की वास्तविक सड़क दूरी' : 'Total two-way road distance'}
                </p>
              </div>

              <div className="p-3 rounded bg-white border border-[#2D322B14]">
                <span className="text-[10.5px] font-mono text-[#777C72] uppercase block mb-1">
                  {language === 'HI' ? 'पहाड़ी ढलान व ऊंचाई कारक' : 'Mountain Slope & Climb'}
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-mono text-[20px] font-bold text-[#B3834D]">
                    {terrain === 'high_altitude' ? '1.40×' : terrain === 'mid_hills' ? '1.25×' : '1.00×'}
                  </span>
                  <span className="text-[12px] font-medium text-[#242722]">
                    {terrain === 'high_altitude'
                      ? (language === 'HI' ? 'ऊंचे पहाड़' : 'High Altitude')
                      : terrain === 'mid_hills'
                      ? (language === 'HI' ? 'मध्य पहाड़ियाँ' : 'Mid-Hills')
                      : (language === 'HI' ? 'तराई / मैदान' : 'Foothills')}
                  </span>
                </div>
                <p className="text-[11px] text-[#51554D] mt-1 leading-snug">
                  {language === 'HI'
                    ? 'गंतव्य की ऊंचाई के अनुसार स्वचालित रूप से निर्धारित'
                    : 'Automatically determined from destination elevation'}
                </p>
              </div>
            </div>

            <p className="text-[11px] text-[#777C72] leading-relaxed pt-1">
              {language === 'HI'
                ? 'गलतियों से बचने के लिए दूरी और पहाड़ी चढ़ाई दोनों का हिसाब आपके चुने गए मार्ग से अपने-आप निकाला जाता है।'
                : 'To prevent calculation mistakes, travel distance and uphill engine factors are computed automatically from your chosen route.'}
            </p>
          </div>
        </div>

        {/* Right: Mountain Map Preview Card */}
        <div className="space-y-4">
          <div className="journal-card p-0 overflow-hidden">
            <div className="p-3 border-b bg-[#FAF9F5] flex items-center justify-between" style={{ borderColor: 'var(--line)' }}>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#304B38]" />
                <span className="text-[12px] font-bold text-[#242722]">
                  {language === 'HI' ? 'उत्तराखंड लाइव कॉरिडोर मैप' : 'Uttarakhand Live Corridor Map'}
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#777C72]">OpenStreetMap Engine</span>
            </div>
            {selectedRoute ? (
              <OpenMapView route={selectedRoute} />
            ) : (
              <div className="h-[360px] flex flex-col items-center justify-center p-6 text-center bg-[#FAF9F5]">
                <MapPin className="w-8 h-8 text-[#777C72] mb-2 animate-bounce" />
                <p className="text-[13px] font-bold text-[#242722]">
                  {language === 'HI' ? 'मार्ग लोड हो रहा है...' : 'Select a starting point and destination'}
                </p>
                <p className="text-[11.5px] text-[#777C72] mt-1 max-w-xs">
                  {language === 'HI' ? 'मैप पर सड़क मार्ग और ऊंचाई विवरण तुरंत दिखाई देगा।' : 'Mountain route curvature and altitude profile will be rendered automatically.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Onboarding Step Footer Action Bar */}
      <div className="pt-4 border-t border-[#2D322B1F] flex items-center justify-between gap-3">
        <Link
          href="/"
          className="px-4 py-2.5 rounded border border-[#2D322B29] text-[12.5px] font-semibold text-[#51554D] hover:text-[#242722] hover:bg-[#F0EEE6] transition-all"
        >
          {language === 'HI' ? '← होम पर वापस' : '← Back to Overview'}
        </Link>
        <button
          type="button"
          onClick={handleNext}
          className="button-primary px-6 py-2.5 rounded text-[13px] font-bold flex items-center gap-2"
        >
          <span>{language === 'HI' ? 'वाहन चुनें (चरण ०२) →' : 'Continue to Transportation (Step 02) →'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
