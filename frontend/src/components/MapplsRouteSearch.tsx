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
        bg: 'bg-[#FFDAD6] text-[#BA1A1A] border-[#FECACA]',
      };
    }
    if (zone === 'mid_hills') {
      return {
        label: 'Mid-Hills (1.25× fuel burn)',
        bg: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]',
      };
    }
    return {
      label: 'Foothills (1.00× fuel burn)',
      bg: 'bg-[#C1ECD4] text-[#002114] border-[#A3CCA9]',
    };
  };

  return (
    <div className="bg-white border border-[#D8E8DF] rounded-2xl p-5 shadow-card space-y-4">
      {/* Header with Mappls Branding & Key Configuration */}
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#D8E8DF] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#1B4332] text-white flex items-center justify-center shadow-sm">
            <Route className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-[#111827] flex items-center gap-1.5">
              <span>Mappls Route &amp; Terrain Distance Engine</span>
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#EDF6F0] text-[#1B4332] border border-[#D8E8DF]">
                {apiKey ? 'API Active' : 'Intelligent Fallback'}
              </span>
            </h3>
            <p className="text-[11.5px] text-[#4B5563]">
              Powered by MapmyIndia / Mappls topographic GIS coordinates &amp; altitudinal gradients.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowKeyConfig((prev) => !prev)}
          className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-[#1B4332] bg-[#EDF6F0] hover:bg-[#D8E8DF] px-2.5 py-1.5 rounded-lg border border-[#D8E8DF] transition-colors"
          aria-expanded={showKeyConfig}
          aria-label="Configure Mappls API Key"
        >
          <Key className="w-3.5 h-3.5 text-[#1B4332]" />
          <span>{apiKey ? 'Configured' : 'Set Mappls Key'}</span>
        </button>
      </div>

      {/* Optional Mappls API Key Config Drawer */}
      <AnimatePresence>
        {showKeyConfig && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-[#EDF6F0] border border-[#D8E8DF] rounded-xl p-3.5 text-[12px] space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#1B4332] flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Mappls Developer Credentials
              </span>
              <span className="text-[11px] text-[#4B5563]">Optional (App works seamlessly with verified defaults)</span>
            </div>
            <p className="text-[11.5px] text-[#4B5563]">
              Enter your MapmyIndia / Mappls REST API Key for live road network ETA and routing:
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Paste Mappls REST API Key..."
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                className="flex-1 h-9 px-3 bg-white border border-[#D8E8DF] rounded-lg text-[12.5px] font-mono text-[#111827] focus:ring-2 focus:ring-[#1B4332]"
              />
              <button
                type="button"
                onClick={handleSaveKey}
                className="h-9 px-4 bg-[#1B4332] text-white font-semibold rounded-lg text-[12px] hover:bg-[#143225] transition-colors"
              >
                Save
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dual Search Columns: Origin and Destination */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Origin Search */}
        <div ref={originRef} className="relative">
          <label className="block text-[12px] font-semibold text-[#111827] mb-1 flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-[#10B981]" />
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
              className="w-full h-10 pl-3 pr-8 bg-[#F8FAF9] border border-[#D8E8DF] rounded-xl text-[13px] text-[#111827] focus:bg-white focus:ring-2 focus:ring-[#1B4332]"
            />
            <span className="absolute right-2.5 top-2.5 text-[11px] font-bold text-[#4B5563] bg-white px-1.5 py-0.5 rounded border border-[#D8E8DF]">
              {origin.altitudeMeters}m
            </span>
          </div>

          {/* Origin Autocomplete Dropdown */}
          {showOriginDropdown && (
            <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white border border-[#D8E8DF] rounded-xl shadow-elevated max-h-56 overflow-y-auto divide-y divide-[#D8E8DF]">
              {originResults.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectOrigin(item)}
                  className="w-full px-3.5 py-2.5 text-left hover:bg-[#EDF6F0] flex items-center justify-between text-[12.5px] transition-colors"
                >
                  <div>
                    <p className="font-semibold text-[#111827]">{item.placeName}</p>
                    <p className="text-[11px] text-[#4B5563] truncate max-w-[210px]">{item.placeAddress}</p>
                  </div>
                  <span className="text-[10.5px] font-bold text-[#1B4332] bg-[#EDF6F0] px-1.5 py-0.5 rounded border border-[#D8E8DF]">
                    {item.altitudeMeters}m
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Destination Search */}
        <div ref={destRef} className="relative">
          <label className="block text-[12px] font-semibold text-[#111827] mb-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#C85A32]" />
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
              className="w-full h-10 pl-3 pr-8 bg-[#F8FAF9] border border-[#D8E8DF] rounded-xl text-[13px] text-[#111827] focus:bg-white focus:ring-2 focus:ring-[#1B4332]"
            />
            <span className="absolute right-2.5 top-2.5 text-[11px] font-bold text-[#4B5563] bg-white px-1.5 py-0.5 rounded border border-[#D8E8DF]">
              {destination.altitudeMeters}m
            </span>
          </div>

          {/* Destination Autocomplete Dropdown */}
          {showDestDropdown && (
            <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white border border-[#D8E8DF] rounded-xl shadow-elevated max-h-56 overflow-y-auto divide-y divide-[#D8E8DF]">
              {destResults.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectDestination(item)}
                  className="w-full px-3.5 py-2.5 text-left hover:bg-[#EDF6F0] flex items-center justify-between text-[12.5px] transition-colors"
                >
                  <div>
                    <p className="font-semibold text-[#111827]">{item.placeName}</p>
                    <p className="text-[11px] text-[#4B5563] truncate max-w-[210px]">{item.placeAddress}</p>
                  </div>
                  <span className="text-[10.5px] font-bold text-[#1B4332] bg-[#EDF6F0] px-1.5 py-0.5 rounded border border-[#D8E8DF]">
                    {item.altitudeMeters}m
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Fast Popular Mountain Corridor Shortcuts */}
      <div className="flex items-center gap-1.5 flex-wrap text-[11.5px]">
        <span className="text-[#4B5563] font-semibold flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#1B4332]" />
          Popular:
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
            className="px-2.5 py-1 rounded-full bg-[#EDF6F0] hover:bg-[#D8E8DF] text-[#1B4332] font-medium border border-[#D8E8DF] transition-colors"
          >
            {shortcut.label}
          </button>
        ))}
      </div>

      {/* Mappls Live Route Summary Banner */}
      {routeResult && (
        <div className="bg-[#EDF6F0] border border-[#D8E8DF] rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#1B4332]" />
              <span className="text-[13px] font-bold text-[#111827]">
                {origin.placeName.split('(')[0]} → {destination.placeName.split('(')[0]}
              </span>
            </div>

            {/* Incline & Altitude Severity Badge */}
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                terrainBadge(routeResult.terrainZone).bg
              }`}
            >
              {terrainBadge(routeResult.terrainZone).label}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[12px]">
            <div className="bg-white p-2.5 rounded-lg border border-[#D8E8DF]">
              <span className="text-[11px] text-[#4B5563]">One-Way Distance</span>
              <p className="font-bold text-[#111827] text-[14px]">{routeResult.distanceKm} km</p>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-[#D8E8DF]">
              <span className="text-[11px] text-[#4B5563]">Round-Trip Circuit</span>
              <p className="font-bold text-[#1B4332] text-[14px]">{routeResult.roundTripKm} km</p>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-[#D8E8DF]">
              <span className="text-[11px] text-[#4B5563]">Elevation Delta</span>
              <p className="font-bold text-[#111827] text-[14px]">
                {origin.altitudeMeters}m ↗ {destination.altitudeMeters}m (+{routeResult.ascentMeters}m)
              </p>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-[#D8E8DF]">
              <span className="text-[11px] text-[#4B5563]">Avg. Travel Time</span>
              <p className="font-bold text-[#111827] text-[14px]">
                ~{Math.floor(routeResult.durationMinutes / 60)}h {routeResult.durationMinutes % 60}m
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
