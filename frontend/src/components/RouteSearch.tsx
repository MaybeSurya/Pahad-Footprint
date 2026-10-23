'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Navigation,
  Compass,
  Route,
  ArrowRight,
} from 'lucide-react';
import {
  OpenMapPlace,
  OpenMapRouteResult,
  UTTARAKHAND_HUBS,
  searchOpenMapPlaces,
  calculateOpenMapRoute,
} from '../lib/openmaps';
import { useTranslation } from '../contexts/TranslationContext';

interface RouteSearchProps {
  onRouteCalculated: (route: OpenMapRouteResult) => void;
  currentDistance: number;
}

export const RouteSearch: React.FC<RouteSearchProps> = ({
  onRouteCalculated,
}) => {
  const { language } = useTranslation();
  const [origin, setOrigin] = useState<OpenMapPlace>(UTTARAKHAND_HUBS[0]); // Kathgodam
  const [destination, setDestination] = useState<OpenMapPlace>(UTTARAKHAND_HUBS[7]); // Nainital
  const [originQuery, setOriginQuery] = useState<string>(UTTARAKHAND_HUBS[0].placeName);
  const [destQuery, setDestQuery] = useState<string>(UTTARAKHAND_HUBS[7].placeName);

  const [originResults, setOriginResults] = useState<OpenMapPlace[]>([]);
  const [destResults, setDestResults] = useState<OpenMapPlace[]>([]);
  const [showOriginDropdown, setShowOriginDropdown] = useState<boolean>(false);
  const [showDestDropdown, setShowDestDropdown] = useState<boolean>(false);

  const [routeResult, setRouteResult] = useState<OpenMapRouteResult | null>(null);

  const originRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);

  // Initialize initial route calculation on mount
  useEffect(() => {
    computeRoute(UTTARAKHAND_HUBS[0], UTTARAKHAND_HUBS[7]);
  }, []);

  // Handle outside clicks to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (originRef.current && !originRef.current.contains(e.target as Node)) {
        setShowOriginDropdown(false);
      }
      if (destRef.current && !destRef.current.contains(e.target as Node)) {
        setShowDestDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOriginSearch = async (val: string) => {
    setOriginQuery(val);
    setShowOriginDropdown(true);
    const results = await searchOpenMapPlaces(val);
    setOriginResults(results);
  };

  const handleDestSearch = async (val: string) => {
    setDestQuery(val);
    setShowDestDropdown(true);
    const results = await searchOpenMapPlaces(val);
    setDestResults(results);
  };

  const selectOrigin = (place: OpenMapPlace) => {
    setOrigin(place);
    setOriginQuery(place.placeName);
    setShowOriginDropdown(false);
    computeRoute(place, destination);
  };

  const selectDestination = (place: OpenMapPlace) => {
    setDestination(place);
    setDestQuery(place.placeName);
    setShowDestDropdown(false);
    computeRoute(origin, place);
  };

  const computeRoute = async (orig: OpenMapPlace, dest: OpenMapPlace) => {
    const res = await calculateOpenMapRoute(orig, dest);
    setRouteResult(res);
    onRouteCalculated(res);
  };

  const terrainBadge = (zone: 'foothills' | 'mid_hills' | 'high_altitude') => {
    if (zone === 'high_altitude') {
      return {
        label: language === 'HI' ? 'ऊंचे पहाड़ (1.40× चढ़ाई)' : 'High Altitude (1.40× climb factor)',
        className: 'badge-amber',
      };
    }
    if (zone === 'mid_hills') {
      return {
        label: language === 'HI' ? 'मध्य पहाड़ियाँ (1.25× चढ़ाई)' : 'Mid-Hills (1.25× climb factor)',
        className: 'badge-accent',
      };
    }
    return {
      label: language === 'HI' ? 'निचली पहाड़ियाँ (1.00×)' : 'Foothills (1.00× baseline)',
      className: 'badge-mono',
    };
  };

  return (
    <div
      className="p-4 rounded border space-y-3.5 mb-4"
      style={{
        backgroundColor: 'var(--paper-subtle)',
        borderColor: 'var(--line)',
      }}
    >
      {/* Header - Simple and Clean */}
      <div className="flex items-center justify-between flex-wrap gap-2 border-b pb-2.5" style={{ borderColor: 'var(--line)' }}>
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded border flex items-center justify-center text-[#304B38]"
            style={{
              backgroundColor: 'var(--green-pale)',
              borderColor: 'rgba(73, 105, 81, 0.25)',
            }}
          >
            <Route className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-[12.5px] font-bold text-[#242722]">
              {language === 'HI' ? 'यात्रा मार्ग चुनें' : 'Choose Your Travel Route'}
            </h4>
            <p className="text-[11px] text-[#777C72]">
              {language === 'HI' ? 'उत्तराखंड के लोकप्रिय स्थानों से चुनें या खोजें' : 'Select starting point and destination in Uttarakhand'}
            </p>
          </div>
        </div>
      </div>

      {/* Dual Columns: Start Point (Origin) and Destination */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Origin Search */}
        <div ref={originRef} className="relative">
          <label className="block text-[11.5px] font-semibold text-[#242722] mb-1 flex items-center gap-1">
            <Navigation className="w-3 h-3 text-[#304B38]" />
            {language === 'HI' ? 'प्रस्थान (शुरुआती बिंदु)' : 'Starting Point'}
          </label>
          <div className="relative">
            <input
              type="text"
              value={originQuery}
              onChange={(e) => handleOriginSearch(e.target.value)}
              onFocus={() => {
                setShowOriginDropdown(true);
                searchOpenMapPlaces(originQuery).then(setOriginResults);
              }}
              placeholder={language === 'HI' ? 'उत्तराखंड का कोई भी शहर/जिला खोजें...' : 'Search any Uttarakhand city/district...'}
              className="w-full h-9 px-3 bg-white border border-[#2D322B29] rounded text-[12.5px] text-[#242722] focus:outline-none focus:ring-1 focus:ring-[#496951]"
            />
          </div>

          {/* Autocomplete Dropdown */}
          {showOriginDropdown && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#2D322B29] rounded shadow-elevated z-40 max-h-64 overflow-y-auto divide-y divide-[#2D322B14]">
              <div className="sticky top-0 bg-[#F0EEE6] px-3 py-1 text-[10px] font-mono font-bold text-[#777C72] uppercase tracking-wider z-10 flex justify-between">
                <span>{language === 'HI' ? 'उत्तराखंड के जिले एवं शहर' : 'Uttarakhand Cities & Districts'}</span>
                <span>{(originResults.length > 0 ? originResults : UTTARAKHAND_HUBS).length} places</span>
              </div>
              {(originResults.length > 0 ? originResults : UTTARAKHAND_HUBS).map((place) => (
                <button
                  key={place.id}
                  type="button"
                  onClick={() => selectOrigin(place)}
                  className="w-full px-3 py-2 text-left hover:bg-[#FAF9F5] transition-colors flex items-center justify-between gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-[12px] font-bold text-[#242722] truncate">{place.placeName}</div>
                    <div className="text-[10.5px] text-[#777C72] truncate">{place.placeAddress}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="inline-block text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-[#E8EDE5] text-[#304B38] border border-[#496951]/20 mb-0.5">
                      {place.district}
                    </span>
                    <div className="font-mono text-[10px] text-[#496951] font-semibold">{place.altitudeMeters}m</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Destination Search */}
        <div ref={destRef} className="relative">
          <label className="block text-[11.5px] font-semibold text-[#242722] mb-1 flex items-center gap-1">
            <Compass className="w-3 h-3 text-[#B3834D]" />
            {language === 'HI' ? 'गंतव्य (कहाँ जा रहे हैं)' : 'Destination'}
          </label>
          <div className="relative">
            <input
              type="text"
              value={destQuery}
              onChange={(e) => handleDestSearch(e.target.value)}
              onFocus={() => {
                setShowDestDropdown(true);
                searchOpenMapPlaces(destQuery).then(setDestResults);
              }}
              placeholder={language === 'HI' ? 'उत्तराखंड का कोई भी शहर/जिला खोजें...' : 'Search any Uttarakhand city/district...'}
              className="w-full h-9 px-3 bg-white border border-[#2D322B29] rounded text-[12.5px] text-[#242722] focus:outline-none focus:ring-1 focus:ring-[#496951]"
            />
          </div>

          {/* Autocomplete Dropdown */}
          {showDestDropdown && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#2D322B29] rounded shadow-elevated z-40 max-h-64 overflow-y-auto divide-y divide-[#2D322B14]">
              <div className="sticky top-0 bg-[#F0EEE6] px-3 py-1 text-[10px] font-mono font-bold text-[#777C72] uppercase tracking-wider z-10 flex justify-between">
                <span>{language === 'HI' ? 'उत्तराखंड के जिले एवं शहर' : 'Uttarakhand Cities & Districts'}</span>
                <span>{(destResults.length > 0 ? destResults : UTTARAKHAND_HUBS).length} places</span>
              </div>
              {(destResults.length > 0 ? destResults : UTTARAKHAND_HUBS).map((place) => (
                <button
                  key={place.id}
                  type="button"
                  onClick={() => selectDestination(place)}
                  className="w-full px-3 py-2 text-left hover:bg-[#FAF9F5] transition-colors flex items-center justify-between gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-[12px] font-bold text-[#242722] truncate">{place.placeName}</div>
                    <div className="text-[10.5px] text-[#777C72] truncate">{place.placeAddress}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="inline-block text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-[#F1EADD] text-[#8A5D2E] border border-[#B3834D]/25 mb-0.5">
                      {place.district}
                    </span>
                    <div className="font-mono text-[10px] text-[#B3834D] font-semibold">{place.altitudeMeters}m</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Route Shortcuts */}
      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
        <span className="text-[10.5px] text-[#777C72] font-semibold">
          {language === 'HI' ? 'लोकप्रिय रास्ते:' : 'Popular routes:'}
        </span>
        {[
          { label: 'Kathgodam → Nainital', orig: UTTARAKHAND_HUBS[0], dest: UTTARAKHAND_HUBS[7] },
          { label: 'Rishikesh → Chopta', orig: UTTARAKHAND_HUBS[1], dest: UTTARAKHAND_HUBS[18] },
          { label: 'Ramnagar → Ranikhet', orig: UTTARAKHAND_HUBS[4], dest: UTTARAKHAND_HUBS[9] },
          { label: 'Dehradun → Mussoorie', orig: UTTARAKHAND_HUBS[3], dest: UTTARAKHAND_HUBS[12] },
          { label: 'Rishikesh → Badrinath', orig: UTTARAKHAND_HUBS[1], dest: UTTARAKHAND_HUBS[21] },
        ].map((shortcut, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setOrigin(shortcut.orig);
              setDestination(shortcut.dest);
              setOriginQuery(shortcut.orig.placeName);
              setDestQuery(shortcut.dest.placeName);
              computeRoute(shortcut.orig, shortcut.dest);
            }}
            className="px-2 py-0.5 rounded bg-white hover:bg-[#F0EEE6] text-[#304B38] font-mono text-[10.5px] border border-[#2D322B29] transition-colors"
          >
            {shortcut.label}
          </button>
        ))}
      </div>

      {/* Route Calculation Summary Banner */}
      {routeResult && (
        <div className="p-3 rounded border space-y-2" style={{ backgroundColor: 'var(--paper-deep)', borderColor: 'var(--line)' }}>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 font-bold text-[12.5px] text-[#242722] min-w-0">
              <Compass className="w-3.5 h-3.5 text-[#496951] flex-shrink-0" />
              <span className="break-words">
                {origin.placeName.split('(')[0].trim()} → {destination.placeName.split('(')[0].trim()}
              </span>
            </div>

            <span className={terrainBadge(routeResult.terrainZone).className}>
              {terrainBadge(routeResult.terrainZone).label}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11.5px]">
            <div className="bg-white p-2 rounded border border-[#2D322B29]">
              <span className="text-[10px] text-[#777C72] font-mono block">
                {language === 'HI' ? 'एक तरफ़ा दूरी' : 'ONE-WAY DISTANCE'}
              </span>
              <p className="font-mono font-bold text-[#242722] text-[13px]">{routeResult.distanceKm} km</p>
            </div>
            <div className="bg-white p-2 rounded border border-[#2D322B29]">
              <span className="text-[10px] text-[#777C72] font-mono block">
                {language === 'HI' ? 'आना-जाना कुल' : 'ROUND TRIP'}
              </span>
              <p className="font-mono font-bold text-[#304B38] text-[13px]">{routeResult.roundTripKm} km</p>
            </div>
            <div className="bg-white p-2 rounded border border-[#2D322B29]">
              <span className="text-[10px] text-[#777C72] font-mono block">
                {language === 'HI' ? 'ऊंचाई चढ़ाई' : 'ELEVATION CLIMB'}
              </span>
              <p className="font-mono font-bold text-[#242722] text-[13px]">
                {origin.altitudeMeters}m ↗ {destination.altitudeMeters}m
              </p>
            </div>
            <div className="bg-white p-2 rounded border border-[#2D322B29]">
              <span className="text-[10px] text-[#777C72] font-mono block">
                {language === 'HI' ? 'अनुमानित समय' : 'ESTIMATED DRIVE'}
              </span>
              <p className="font-mono font-bold text-[#242722] text-[13px]">
                ~{Math.floor(routeResult.durationMinutes / 60)}h {routeResult.durationMinutes % 60}m
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
