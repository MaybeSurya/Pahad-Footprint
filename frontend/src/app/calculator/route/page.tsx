'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, MapPin, MountainSnow, Compass } from 'lucide-react';
import { useTranslation } from '../../../contexts/TranslationContext';
import { useTrip } from '../../../contexts/TripContext';
import { RouteSearch } from '../../../components/RouteSearch';
import { OpenMapView } from '../../../components/OpenMapView';
import { OpenMapRouteResult } from '../../../lib/openmaps';

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

          {/* Terrain Altitude Factor */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[12.5px] font-semibold text-[#242722] flex items-center gap-1.5">
                <MountainSnow className="w-3.5 h-3.5 text-[#496951]" />
                {t('calculator.terrainZone')} <span className="text-[11px] font-normal text-[#777C72]">({t('calculator.terrainMultiplier')})</span>
              </label>
              <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#E8EDE5] text-[#304B38] border border-[#496951]/25">
                {terrain === 'foothills' ? '1.00×' : terrain === 'mid_hills' ? '1.25×' : '1.40×'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 bg-[#F0EEE6] p-1.5 rounded border border-[#2D322B29]">
              {[
                { id: 'foothills', label: t('calculator.terrainFoothills'), mult: '1.00×', desc: 'Plains & Tarai' },
                { id: 'mid_hills', label: t('calculator.terrainMidHills'), mult: '1.25×', desc: '1,200m – 2,400m' },
                { id: 'high_altitude', label: t('calculator.terrainHighAltitude'), mult: '1.40×', desc: '2,400m+' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTerrain(item.id as any)}
                  className={`py-2 px-1 text-center rounded transition-all leading-tight ${
                    terrain === item.id
                      ? 'bg-white text-[#304B38] shadow-xs border border-[#496951]/40 font-bold'
                      : 'text-[#51554D] hover:text-[#242722]'
                  }`}
                >
                  <span className="block text-[11.5px] font-bold">{item.label}</span>
                  <span className="text-[10px] font-mono opacity-80">{item.mult}</span>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[#777C72] mt-1.5 font-mono">
              {language === 'HI'
                ? 'ऊंचाई चढ़ाई पर इंजन पर दबाव बढ़ने से ईंधन की खपत 25% से 40% तक बढ़ जाती है।'
                : 'Uphill mountain driving increases engine load, adding 25% to 40% more fuel consumption.'}
            </p>
          </div>

          <div className="border-t border-[#2D322B14]" />

          {/* Round-Trip Circuit Distance */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="distance-slider" className="text-[12.5px] font-semibold text-[#242722]">
                {t('calculator.distanceSlider')}
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={20}
                  max={1200}
                  value={distance}
                  onChange={(e) => setDistance(Math.max(20, Math.min(1200, Number(e.target.value) || 20)))}
                  className="w-20 h-7 text-right font-mono font-bold text-[13px] px-2 bg-[#FAF9F5] border border-[#2D322B29] rounded text-[#242722] focus:bg-white focus:border-[#496951]"
                />
                <span className="font-mono text-[12px] text-[#777C72]">km</span>
              </div>
            </div>
            <input
              id="distance-slider"
              type="range"
              min={20}
              max={1200}
              step={5}
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              className="w-full h-1.5 rounded-full cursor-pointer bg-[#E4E1D8] accent-[#496951]"
            />
            <div className="flex justify-between text-[10.5px] text-[#777C72] mt-1 font-mono">
              <span>20 km</span>
              <span>600 km</span>
              <span>1,200 km</span>
            </div>
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
