'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Navigation,
  Compass,
  MountainSnow,
  Route,
  Key,
  Check,
  Sparkles,
  Clock,
  ArrowRight,
  SlidersHorizontal,
  Info,
} from 'lucide-react';
import {
  MapplsPlace,
  MapplsRouteResult,
  UTTARAKHAND_HUBS,
  searchMapplsPlaces,
  calculateMapplsRoute,
  getStoredMapplsKey,
  setStoredMapplsKey,
} from '../lib/mappls';

interface MapplsRouteSearchProps {
  onRouteCalculated: (route: MapplsRouteResult) => void;
  currentDistance: number;
}

export const MapplsRouteSearch: React.FC<MapplsRouteSearchProps> = ({
  onRouteCalculated,
  currentDistance,
}) => {
  const [origin, setOrigin] = useState<MapplsPlace>(UTTARAKHAND_HUBS[0]); // Kathgodam
  const [destination, setDestination] = useState<MapplsPlace>(UTTARAKHAND_HUBS[7]); // Nainital
  const [originQuery, setOriginQuery] = useState<string>(UTTARAKHAND_HUBS[0].placeName);
  const [destQuery, setDestQuery] = useState<string>(UTTARAKHAND_HUBS[7].placeName);

  const [originResults, setOriginResults] = useState<MapplsPlace[]>([]);
  const [destResults, setDestResults] = useState<MapplsPlace[]>([]);
  const [showOriginDropdown, setShowOriginDropdown] = useState<boolean>(false);
  const [showDestDropdown, setShowDestDropdown] = useState<boolean>(false);

  const [routeResult, setRouteResult] = useState<MapplsRouteResult | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  // Mappls Key management
  const [apiKey, setApiKey] = useState<string>('');
  const [showKeyConfig, setShowKeyConfig] = useState<boolean>(false);
  const [keyInput, setKeyInput] = useState<string>('');

  const originRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);

  // Initialize key and initial calculation
  useEffect(() => {
    const key = getStoredMapplsKey();
    setApiKey(key);
    setKeyInput(key);

    // Initial route computation
    computeRoute(UTTARAKHAND_HUBS[0], UTTARAKHAND_HUBS[7], key);
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
    const results = await searchMapplsPlaces(val, apiKey);
    setOriginResults(results);
  };

  const handleDestSearch = async (val: string) => {
    setDestQuery(val);
    setShowDestDropdown(true);
    const results = await searchMapplsPlaces(val, apiKey);
    setDestResults(results);
  };

  const selectOrigin = (place: MapplsPlace) => {
    setOrigin(place);
    setOriginQuery(place.placeName);
    setShowOriginDropdown(false);
    computeRoute(place, destination, apiKey);
  };

  const selectDestination = (place: MapplsPlace) => {
    setDestination(place);
    setDestQuery(place.placeName);
    setShowDestDropdown(false);
    computeRoute(origin, place, apiKey);
  };

  const computeRoute = async (orig: MapplsPlace, dest: MapplsPlace, key?: string) => {
    setIsCalculating(true);
    try {
      const res = await calculateMapplsRoute(orig, dest, key);
      setRouteResult(res);
      onRouteCalculated(res);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSaveKey = () => {
    setStoredMapplsKey(keyInput);
    setApiKey(keyInput);
    setShowKeyConfig(false);
    if (origin && destination) {
      computeRoute(origin, destination, keyInput);
    }
  };

  const terrainBadge = (zone: 'foothills' | 'mid_hills' | 'high_altitude') => {
    if (zone === 'high_altitude') {
      return {
        label: 'High Altitude (1.40× fuel burn)',
        className: 'badge-amber',
      };
    }
    if (zone === 'mid_hills') {
      return {
        label: 'Mid-Hills (1.25× fuel burn)',
        className: 'badge-accent',
      };
    }
    return {
      label: 'Foothills (1.00× fuel burn)',
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
      {/* Header with Mappls Branding & Key Configuration */}
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
            <h4 className="text-[12.5px] font-bold text-[#242722] flex items-center gap-1.5 font-mono">
              <span>MAPPLS ROUTE &amp; ALTITUDE ENGINE</span>
              <span className="font-mono text-[9px] uppercase px-1.5 py-0.2 rounded bg-[#E8EDE5] text-[#304B38] border border-[#496951]/20">
                {apiKey ? 'API Active' : 'Verified GIS Defaults'}
              </span>
            </h4>
            <p className="text-[11px] text-[#777C72]">
              Himalayan road distance &amp; altitudinal slope coordinates
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowKeyConfig((prev) => !prev)}
          className="inline-flex items-center gap-1 text-[10.5px] font-mono font-semibold text-[#51554D] bg-white hover:bg-[#F0EEE6] px-2 py-1 rounded border border-[#2D322B29] transition-colors"
          aria-expanded={showKeyConfig}
          aria-label="Configure Mappls API Key"
        >
          <Key className="w-3 h-3 text-[#777C72]" />
          <span>{apiKey ? 'Key Set' : 'Configure Key'}</span>
        </button>
      </div>

      {/* Optional Mappls API Key Config Drawer */}
      <AnimatePresence>
        {showKeyConfig && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden p-3 rounded border text-[11.5px] space-y-2"
            style={{
              backgroundColor: 'var(--paper-deep)',
              borderColor: 'var(--line)',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#242722] flex items-center gap-1.5 font-mono">
                <SlidersHorizontal className="w-3 h-3 text-[#496951]" />
                Mappls Developer Credentials
              </span>
              <span className="text-[10.5px] text-[#777C72]">Works out of the box with verified defaults</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Paste Mappls REST API Key..."
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                className="flex-1 h-8 px-2.5 bg-white border border-[#2D322B29] rounded text-[12px] font-mono text-[#242722] focus:outline-none focus:ring-1 focus:ring-[#496951]"
              />
              <button
                type="button"
                onClick={handleSaveKey}
                className="h-8 px-3 btn-accent text-[11px] rounded"
              >
                Save
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dual Search Columns: Origin and Destination */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Origin Search */}
        <div ref={originRef} className="relative">
          <label className="block text-[11.5px] font-semibold text-[#242722] mb-1 flex items-center gap-1">
            <Navigation className="w-3 h-3 text-[#304B38]" />
            Origin (Start Point)
          </label>
          <div className="relative">
            <input
              type="text"
              value={originQuery}
              onChange={(e) => handleOriginSearch(e.target.value)}
              onFocus={() => {
                setShowOriginDropdown(true);
                searchMapplsPlaces(originQuery, apiKey).then(setOriginResults);
              }}
              placeholder="Search origin in Uttarakhand / NCR..."
              className="w-full h-9 pl-2.5 pr-14 bg-white border border-[#2D322B29] rounded text-[12.5px] text-[#242722] focus:outline-none focus:ring-1 focus:ring-[#496951]"
            />
            <span className="absolute right-2 top-2 font-mono text-[10px] font-bold text-[#777C72] bg-[#F0EEE6] px-1 py-0.2 rounded border border-[#2D322B29]">
              {origin.altitudeMeters}m
            </span>
          </div>

          {/* Autocomplete Dropdown */}
          {showOriginDropdown && (
            <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white border border-[#2D322B29] rounded shadow-elevated max-h-52 overflow-y-auto divide-y divide-[#2D322B29]/30">
              {originResults.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectOrigin(item)}
                  className="w-full px-3 py-2 text-left hover:bg-[#F0EEE6] flex items-center justify-between text-[12px] transition-colors"
                >
                  <div>
                    <p className="font-semibold text-[#242722]">{item.placeName}</p>
                    <p className="text-[10px] text-[#777C72] truncate max-w-[200px]">{item.placeAddress}</p>
                  </div>
                  <span className="font-mono text-[10px] text-[#304B38] bg-[#E8EDE5] px-1 py-0.2 rounded">
                    {item.altitudeMeters}m
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Destination Search */}
        <div ref={destRef} className="relative">
          <label className="block text-[11.5px] font-semibold text-[#242722] mb-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#B3834D]" />
            Destination (Mountain Hub)
          </label>
          <div className="relative">
            <input
              type="text"
              value={destQuery}
              onChange={(e) => handleDestSearch(e.target.value)}
              onFocus={() => {
                setShowDestDropdown(true);
                searchMapplsPlaces(destQuery, apiKey).then(setDestResults);
              }}
              placeholder="Search destination (Nainital, Chopta, Badrinath...)"
              className="w-full h-9 pl-2.5 pr-14 bg-white border border-[#2D322B29] rounded text-[12.5px] text-[#242722] focus:outline-none focus:ring-1 focus:ring-[#496951]"
            />
            <span className="absolute right-2 top-2 font-mono text-[10px] font-bold text-[#777C72] bg-[#F0EEE6] px-1 py-0.2 rounded border border-[#2D322B29]">
              {destination.altitudeMeters}m
            </span>
          </div>

          {/* Autocomplete Dropdown */}
          {showDestDropdown && (
            <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white border border-[#2D322B29] rounded shadow-elevated max-h-52 overflow-y-auto divide-y divide-[#2D322B29]/30">
              {destResults.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectDestination(item)}
                  className="w-full px-3 py-2 text-left hover:bg-[#F0EEE6] flex items-center justify-between text-[12px] transition-colors"
                >
                  <div>
                    <p className="font-semibold text-[#242722]">{item.placeName}</p>
                    <p className="text-[10px] text-[#777C72] truncate max-w-[200px]">{item.placeAddress}</p>
                  </div>
                  <span className="font-mono text-[10px] text-[#304B38] bg-[#E8EDE5] px-1 py-0.2 rounded">
                    {item.altitudeMeters}m
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mountain Corridor Shortcuts */}
      <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
        <span className="text-[#777C72] font-mono flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#496951]" />
          Corridors:
        </span>
        {[
          { label: 'Nainital (320 km)', orig: UTTARAKHAND_HUBS[0], dest: UTTARAKHAND_HUBS[7] },
          { label: 'Chopta Valley (410 km)', orig: UTTARAKHAND_HUBS[1], dest: UTTARAKHAND_HUBS[17] },
          { label: 'Auli Ski Slopes', orig: UTTARAKHAND_HUBS[3], dest: UTTARAKHAND_HUBS[18] },
          { label: 'Mussoorie Ridge', orig: UTTARAKHAND_HUBS[3], dest: UTTARAKHAND_HUBS[12] },
          { label: 'Badrinath Dham', orig: UTTARAKHAND_HUBS[1], dest: UTTARAKHAND_HUBS[19] },
        ].map((shortcut, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setOrigin(shortcut.orig);
              setDestination(shortcut.dest);
              setOriginQuery(shortcut.orig.placeName);
              setDestQuery(shortcut.dest.placeName);
              computeRoute(shortcut.orig, shortcut.dest, apiKey);
            }}
            className="px-2 py-0.5 rounded bg-white hover:bg-[#F0EEE6] text-[#304B38] font-mono text-[10.5px] border border-[#2D322B29] transition-colors"
          >
            {shortcut.label}
          </button>
        ))}
      </div>

      {/* Mappls Route Calculation Summary Banner */}
      {routeResult && (
        <div className="p-3 rounded border space-y-2" style={{ backgroundColor: 'var(--paper-deep)', borderColor: 'var(--line)' }}>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 font-bold text-[12.5px] text-[#242722]">
              <Compass className="w-3.5 h-3.5 text-[#496951]" />
              <span>
                {origin.placeName.split('(')[0].trim()} → {destination.placeName.split('(')[0].trim()}
              </span>
            </div>

            <span className={terrainBadge(routeResult.terrainZone).className}>
              {terrainBadge(routeResult.terrainZone).label}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11.5px]">
            <div className="bg-white p-2 rounded border border-[#2D322B29]">
              <span className="text-[10px] text-[#777C72] font-mono block">ONE-WAY DISTANCE</span>
              <p className="font-mono font-bold text-[#242722] text-[13px]">{routeResult.distanceKm} km</p>
            </div>
            <div className="bg-white p-2 rounded border border-[#2D322B29]">
              <span className="text-[10px] text-[#777C72] font-mono block">CIRCUIT TOTAL</span>
              <p className="font-mono font-bold text-[#304B38] text-[13px]">{routeResult.roundTripKm} km</p>
            </div>
            <div className="bg-white p-2 rounded border border-[#2D322B29]">
              <span className="text-[10px] text-[#777C72] font-mono block">ALTITUDE ASCENT</span>
              <p className="font-mono font-bold text-[#242722] text-[13px]">
                {origin.altitudeMeters}m ↗ {destination.altitudeMeters}m
              </p>
            </div>
            <div className="bg-white p-2 rounded border border-[#2D322B29]">
              <span className="text-[10px] text-[#777C72] font-mono block">ESTIMATED DRIVE</span>
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
