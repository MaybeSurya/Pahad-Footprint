'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  MountainSnow,
  CarFront,
  Car,
  BusFront,
  Zap,
  Users,
  Minus,
  Plus,
  CalendarDays,
  Hotel,
  Home,
  Tent,
  Flame,
  Droplets,
  UtensilsCrossed,
  Leaf,
  BookmarkCheck,
  Check,
  CheckCircle2,
  Sparkles,
  TrainTrack,
  Plane,
  Fuel,
} from 'lucide-react';
import {
  CalculationInput,
  CalculationOutput,
  PrivateVehicleType,
  FuelType,
  TransitMode,
  TransportCategory,
} from '../types';
import { calculateTrip, logTripRecord, getStoredSession } from '../lib/api';
import { CalculationResults } from './CalculationResults';
import { EcoSwapCard } from './EcoSwapCard';
import { RestorationPledgeBox } from './RestorationPledgeBox';
import { MapplsRouteSearch } from './MapplsRouteSearch';
import { MapplsMapView } from './MapplsMapView';
import { MapplsRouteResult } from '../lib/mappls';

const PRESET_ROUTES: Record<string, { name: string; distance: number; terrain: 'foothills' | 'mid_hills' | 'high_altitude' }> = {
  kumaon: {
    name: 'Kumaon Hill Circuit: Kathgodam – Nainital – Mukteshwar – Almora (320 km)',
    distance: 320,
    terrain: 'mid_hills',
  },
  garhwal: {
    name: 'Garhwal Pilgrim Loop: Rishikesh – Devprayag – Rudraprayag – Chopta (410 km)',
    distance: 410,
    terrain: 'high_altitude',
  },
  corbett: {
    name: 'Foothill Wildlife Traverse: Ramnagar – Corbett – Marchula – Ranikhet (210 km)',
    distance: 210,
    terrain: 'foothills',
  },
  custom: {
    name: 'Custom Mountain Itinerary (Direct Distance Input)',
    distance: 320,
    terrain: 'mid_hills',
  },
};

const PRIVATE_VEHICLE_MATRIX: Record<PrivateVehicleType, Record<FuelType, number>> = {
  suv: { diesel: 195, petrol: 185, cng: 135, lpg: 145, hybrid: 110, ev: 50 },
  sedan: { diesel: 155, petrol: 140, cng: 110, lpg: 120, hybrid: 90, ev: 42 },
  hatchback: { diesel: 130, petrol: 120, cng: 95, lpg: 105, hybrid: 78, ev: 36 },
  coupe: { diesel: 165, petrol: 155, cng: 125, lpg: 135, hybrid: 100, ev: 48 },
};

export const TripCalculatorForm: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<string>('kumaon');
  const [distance, setDistance] = useState<number>(320);
  const [terrain, setTerrain] = useState<'foothills' | 'mid_hills' | 'high_altitude'>('mid_hills');

  // Expanded transportation state
  const [transportCategory, setTransportCategory] = useState<TransportCategory>('private');
  const [vehicleType, setVehicleType] = useState<PrivateVehicleType>('suv');
  const [fuelType, setFuelType] = useState<FuelType>('diesel');
  const [transitMode, setTransitMode] = useState<TransitMode>('bus');

  const transportMode = transportCategory === 'private' ? vehicleType : transitMode;

  const getPassengerLimit = (
    category: TransportCategory,
    vehicle: PrivateVehicleType,
    transit: TransitMode
  ) => {
    if (category === 'private') {
      switch (vehicle) {
        case 'coupe':
          return { min: 1, max: 2, label: 'Max 2 (Coupe 2-Seater)' };
        case 'hatchback':
          return { min: 1, max: 4, label: 'Max 4 (Hatchback Cabin)' };
        case 'sedan':
          return { min: 1, max: 5, label: 'Max 5 (Sedan Cabin)' };
        case 'suv':
        default:
          return { min: 1, max: 7, label: 'Max 7 (SUV 4×4 Cabin)' };
      }
    } else {
      switch (transit) {
        case 'helicopter':
          return { min: 1, max: 6, label: 'Max 6 (Heli Alpine Payload)' };
        case 'bus':
          return { min: 1, max: 45, label: 'Max 45 (Bus Group)' };
        case 'train':
          return { min: 1, max: 20, label: 'Max 20 (Rail Party)' };
        case 'flight':
        default:
          return { min: 1, max: 10, label: 'Max 10 (Flight Group)' };
      }
    }
  };

  const currentLimit = getPassengerLimit(transportCategory, vehicleType, transitMode);

  const [passengers, setPassengers] = useState<number>(3);

  // Clamp passengers when vehicle type or category changes
  useEffect(() => {
    if (passengers > currentLimit.max) {
      setPassengers(currentLimit.max);
    } else if (passengers < currentLimit.min) {
      setPassengers(currentLimit.min);
    }
  }, [transportCategory, vehicleType, transitMode, currentLimit.max, currentLimit.min]);
  const [nights, setNights] = useState<number>(4);
  const [accommodation, setAccommodation] = useState<'luxury' | 'hotel' | 'homestay' | 'camp'>('hotel');
  const [habitWater, setHabitWater] = useState<boolean>(false);
  const [habitFood, setHabitFood] = useState<boolean>(false);

  const [calcResult, setCalcResult] = useState<CalculationOutput | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [mapplsRoute, setMapplsRoute] = useState<MapplsRouteResult | null>(null);

  const handleMapplsRouteCalculated = (route: MapplsRouteResult) => {
    setMapplsRoute(route);
    setDistance(route.roundTripKm);
    setTerrain(route.terrainZone);
    setSelectedPreset('custom');
  };

  // Recalculate on any input change
  useEffect(() => {
    const input: CalculationInput = {
      distanceKm: distance,
      terrainZone: terrain,
      transportCategory,
      vehicleType,
      fuelType,
      transitMode,
      transportMode,
      passengers,
      nights,
      accommodationType: accommodation,
      habitWater,
      habitFood,
    };

    calculateTrip(input).then(setCalcResult);
  }, [
    distance,
    terrain,
    transportCategory,
    vehicleType,
    fuelType,
    transitMode,
    passengers,
    nights,
    accommodation,
    habitWater,
    habitFood,
  ]);

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const key = e.target.value;
    setSelectedPreset(key);
    if (PRESET_ROUTES[key]) {
      setDistance(PRESET_ROUTES[key].distance);
      setTerrain(PRESET_ROUTES[key].terrain);
    }
  };

  const handleSaveTrip = async () => {
    if (!calcResult) return;
    setIsSaving(true);
    try {
      const session = getStoredSession();
      await logTripRecord(
        {
          routeName: PRESET_ROUTES[selectedPreset]?.name || 'Custom Uttarakhand Itinerary',
          distanceKm: distance,
          terrainZone: terrain,
          transportMode,
          passengers,
          nights,
          accommodationType: accommodation,
          perPersonCo2e: calcResult.perPersonCo2e,
          totalCo2e: calcResult.totalCo2e,
          restorationPledged: false,
        },
        session?.token
      );
      showToast(`Trip logged! ${calcResult.perPersonCo2e} kg CO₂e / person saved to the registry.`);
    } catch (err: any) {
      showToast(err.message || 'Saved locally to session log.');
    } finally {
      setIsSaving(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const currentInput: CalculationInput = {
    distanceKm: distance,
    terrainZone: terrain,
    transportCategory,
    vehicleType,
    fuelType,
    transitMode,
    transportMode,
    passengers,
    nights,
    accommodationType: accommodation,
    habitWater,
    habitFood,
  };

  return (
    <div className="w-full">
      {/* Toast Banner with Framer Motion */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-elevated flex items-center gap-3 border border-slate-700/80 backdrop-blur-md"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span className="text-[13.5px] font-medium leading-snug">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Grid: Responsive Guard using minmax(0, Xfr) */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] gap-grid items-start">
        {/* LEFT COLUMN: Input Configuration Form */}
        <div className="pahad-card space-y-7">
          {/* Section 1: Route & Elevation Zone */}
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center">
                  1
                </span>
                <span className="text-[12.5px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  Route Corridor &amp; Elevation Gradient
                </span>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">Step 1 of 4</span>
            </div>

            {/* Mappls MapmyIndia Location & Corridor Search */}
            <div className="mb-4">
              <MapplsRouteSearch
                onRouteCalculated={handleMapplsRouteCalculated}
                currentDistance={distance}
              />
            </div>

            {/* Route Preset Dropdown */}
            <div className="mb-4">
              <label htmlFor="route-preset" className="block text-[13px] font-semibold text-slate-900 mb-1.5">
                Circuit Route Preset
              </label>
              <select
                id="route-preset"
                value={selectedPreset}
                onChange={handlePresetChange}
                className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[13.5px] font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all"
              >
                <option value="kumaon">Kumaon Hill Circuit: Kathgodam – Nainital – Mukteshwar – Almora (320 km)</option>
                <option value="garhwal">Garhwal Pilgrim Loop: Rishikesh – Devprayag – Rudraprayag – Chopta (410 km)</option>
                <option value="corbett">Foothill Wildlife Traverse: Ramnagar – Corbett – Marchula – Ranikhet (210 km)</option>
                <option value="custom">Custom Mountain Itinerary (Direct Distance Input)</option>
              </select>
              <p className="text-[11.5px] text-slate-500 mt-1">Standard corridors with verified altitudinal gradient profiles.</p>
            </div>

            {/* Terrain Multiplier Radios */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[13px] font-semibold text-slate-900 flex items-center gap-1.5">
                  <MountainSnow className="w-4 h-4 text-emerald-600" />
                  Terrain Multiplier <span className="text-[11.5px] font-normal text-slate-500">(altitude fuel burn)</span>
                </label>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Incline Factor: {terrain === 'foothills' ? '1.00×' : terrain === 'mid_hills' ? '1.25×' : '1.40×'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200">
                {[
                  { id: 'foothills', label: 'Foothills', mult: '1.00×' },
                  { id: 'mid_hills', label: 'Mid-Hills', mult: '1.25×' },
                  { id: 'high_altitude', label: 'High Altitude', mult: '1.40×' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTerrain(item.id as any)}
                    className={`py-2 px-1 text-[12.5px] font-semibold rounded-lg transition-all text-center relative ${
                      terrain === item.id
                        ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/80 font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <div>{item.label}</div>
                    <div className="text-[11px] font-normal opacity-80">({item.mult})</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Distance Slider */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="distance-slider" className="text-[13px] font-semibold text-slate-900">
                  Round-Trip Circuit Distance
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={50}
                    max={1000}
                    value={distance}
                    onChange={(e) => setDistance(Math.max(50, Math.min(1000, Number(e.target.value) || 50)))}
                    className="w-20 h-8 text-right font-bold text-[14px] px-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-emerald-600"
                  />
                  <span className="text-[13px] font-semibold text-slate-500">km</span>
                </div>
              </div>
              <input
                id="distance-slider"
                type="range"
                min={50}
                max={1000}
                step={5}
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full h-2 rounded-full cursor-pointer bg-slate-200 accent-emerald-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                <span>50 km</span>
                <span>500 km</span>
                <span>1,000 km</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200" />

          {/* Section 2: Transport Mode & Occupancy */}
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center">
                  2
                </span>
                <span className="text-[12.5px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CarFront className="w-3.5 h-3.5 text-emerald-600" />
                  Vehicle Mode &amp; Passenger Load
                </span>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">Step 2 of 4</span>
            </div>

            {/* Mode Category Selector: Private Vehicle vs Public & Regional Transit */}
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 mb-4">
              <button
                type="button"
                onClick={() => setTransportCategory('private')}
                className={`flex-1 py-2 px-3 rounded-lg text-[12.5px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  transportCategory === 'private'
                    ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CarFront className="w-3.5 h-3.5 text-emerald-600" />
                <span>Personal / Hired Vehicle</span>
              </button>
              <button
                type="button"
                onClick={() => setTransportCategory('transit')}
                className={`flex-1 py-2 px-3 rounded-lg text-[12.5px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  transportCategory === 'transit'
                    ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BusFront className="w-3.5 h-3.5 text-emerald-600" />
                <span>Public &amp; Regional Transit</span>
              </button>
            </div>

            {/* Option A: Private Vehicle (Body Type + Fuel Type Selection) */}
            {transportCategory === 'private' ? (
              <div className="space-y-4 mb-4">
                {/* Step 1: Vehicle Body Type */}
                <div>
                  <label className="block text-[12px] font-semibold text-slate-900 mb-2">
                    A. Vehicle Body Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'suv', name: 'SUV / 4x4', icon: CarFront, desc: 'Scorpio, Thar, Safari' },
                      { id: 'sedan', name: 'Sedan', icon: Car, desc: 'City, Dzire, Verna' },
                      { id: 'hatchback', name: 'Hatchback', icon: Car, desc: 'Swift, i20, Tiago' },
                      { id: 'coupe', name: 'Coupe', icon: Sparkles, desc: 'Sports / 2-Door' },
                    ].map((item) => {
                      const IconComp = item.icon;
                      const isSel = vehicleType === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setVehicleType(item.id as any)}
                          className={`p-2.5 rounded-xl border-2 text-left transition-all ${
                            isSel
                              ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <IconComp className={`w-4 h-4 ${isSel ? 'text-emerald-700' : 'text-slate-400'}`} />
                            {isSel && <span className="text-[11px] font-bold text-emerald-700">✓</span>}
                          </div>
                          <p className="text-[12.5px] font-bold text-slate-900 leading-tight">{item.name}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2: Fuel Engine Type */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[12px] font-semibold text-slate-900">
                      B. Fuel / Powertrain Type
                    </label>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                      ARAI Rate: {PRIVATE_VEHICLE_MATRIX[vehicleType][fuelType]} g CO₂e/vkm
                    </span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                    {[
                      { id: 'petrol', label: 'Petrol', icon: Fuel },
                      { id: 'diesel', label: 'Diesel', icon: Fuel },
                      { id: 'cng', label: 'CNG', icon: Flame },
                      { id: 'lpg', label: 'LPG', icon: Flame },
                      { id: 'hybrid', label: 'Hybrid', icon: Leaf },
                      { id: 'ev', label: 'EV', icon: Zap },
                    ].map((fuel) => {
                      const FuelIcon = fuel.icon;
                      const isFuelSel = fuelType === fuel.id;
                      return (
                        <button
                          key={fuel.id}
                          type="button"
                          onClick={() => setFuelType(fuel.id as any)}
                          className={`py-2 px-1 text-center rounded-xl border text-[11.5px] font-semibold transition-all ${
                            isFuelSel
                              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <FuelIcon className={`w-3.5 h-3.5 mx-auto mb-1 ${isFuelSel ? 'text-emerald-400' : 'text-slate-400'}`} />
                          <span>{fuel.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              /* Option B: Public & Regional Transit (Train, Bus, Helicopter, Flight) */
              <div className="mb-4">
                <label className="block text-[12px] font-semibold text-slate-900 mb-2">
                  Select Public / Aviation Transit Mode
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: 'bus', name: 'Shared UTC Bus', factor: '30 g CO₂e/pkm', badge: 'Eco', icon: BusFront, desc: 'State bus / mountain highway' },
                    { id: 'train', name: 'Indian Railways (Train)', factor: '18 g CO₂e/pkm', badge: 'Lowest', icon: TrainTrack, desc: 'Electrified foothill corridor' },
                    { id: 'helicopter', name: 'Himalayan Helicopter', factor: '450 g CO₂e/pkm', badge: 'Alpine Hover', icon: Plane, desc: 'Char Dham / Kedarnath shuttle' },
                    { id: 'flight', name: 'Regional Flight', factor: '180 g CO₂e/pkm', badge: 'Aviation', icon: Plane, desc: 'Turboprop to Jolly Grant / Pantnagar' },
                  ].map((transit) => {
                    const TransitIcon = transit.icon;
                    const isTransitSel = transitMode === transit.id;
                    return (
                      <button
                        key={transit.id}
                        type="button"
                        onClick={() => setTransitMode(transit.id as any)}
                        className={`p-3 rounded-2xl border-2 text-left flex flex-col justify-between transition-all ${
                          isTransitSel
                            ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <TransitIcon className={`w-4 h-4 ${isTransitSel ? 'text-emerald-700' : 'text-slate-400'}`} />
                            <span className="text-[12.5px] font-bold text-slate-900">{transit.name}</span>
                          </div>
                          {isTransitSel && (
                            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                              ✓
                            </span>
                          )}
                        </div>
                        <p className="text-[10.5px] text-slate-500 mb-1">{transit.desc}</p>
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-emerald-700 font-semibold">{transit.factor}</span>
                          {transit.badge && (
                            <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                              {transit.badge}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Passenger Stepper */}
            <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-[13px] font-semibold text-slate-900 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-600" />
                    Passenger Count
                  </p>
                  <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-white text-emerald-800 border border-slate-200 shadow-xs">
                    {currentLimit.label}
                  </span>
                </div>
                <p className="text-[11.5px] text-slate-500 mt-0.5">
                  {transportCategory === 'private'
                    ? `Vehicle footprint divided across ${passengers} travelers`
                    : `Group party size (${passengers} travelers)`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={passengers <= currentLimit.min}
                  onClick={() => setPassengers((prev) => Math.max(currentLimit.min, prev - 1))}
                  className="w-9 h-9 rounded-xl bg-white border border-slate-200 font-bold text-[18px] text-slate-800 disabled:opacity-40 hover:bg-slate-100 flex items-center justify-center transition-colors shadow-xs"
                  aria-label="Decrease passengers"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold text-[14px] text-slate-900 min-w-[90px] text-center font-mono">
                  {passengers} {passengers === 1 ? 'Traveler' : 'Travelers'}
                </span>
                <button
                  type="button"
                  disabled={passengers >= currentLimit.max}
                  onClick={() => setPassengers((prev) => Math.min(currentLimit.max, prev + 1))}
                  className="w-9 h-9 rounded-xl bg-white border border-slate-200 font-bold text-[18px] text-slate-800 disabled:opacity-40 hover:bg-slate-100 flex items-center justify-center transition-colors shadow-xs"
                  aria-label="Increase passengers"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200" />

          {/* Section 3: Accommodation Profile */}
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center">
                  3
                </span>
                <span className="text-[12.5px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-emerald-600" />
                  Lodging &amp; Stay Duration
                </span>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">Step 3 of 4</span>
            </div>

            {/* Stay Duration Slider */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="nights-slider" className="text-[13px] font-semibold text-slate-900">
                  Duration of Stay
                </label>
                <span className="text-[13px] font-bold px-2.5 py-0.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900">
                  {nights} {nights === 1 ? 'Night' : 'Nights'}
                </span>
              </div>
              <input
                id="nights-slider"
                type="range"
                min={1}
                max={14}
                value={nights}
                onChange={(e) => setNights(Number(e.target.value))}
                className="w-full h-2 rounded-full cursor-pointer bg-slate-200 accent-amber-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                <span>1 Night</span>
                <span>7 Nights</span>
                <span>14 Nights</span>
              </div>
            </div>

            {/* Lodging Type Selection */}
            <div>
              <label className="block text-[13px] font-semibold text-slate-900 mb-2">
                Lodging Type &amp; Energy Intensity
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'luxury', name: 'Luxury Resort', intensity: '24.0 kg/night', icon: Flame },
                  { id: 'hotel', name: 'Standard Hotel', intensity: '9.0 kg/night', icon: Hotel },
                  { id: 'homestay', name: 'Pahadi Homestay', intensity: '6.0 kg/night', eco: true, icon: Home },
                  { id: 'camp', name: 'Eco-Camp', intensity: '3.5 kg/night', eco: true, icon: Tent },
                ].map((item) => {
                  const IconComponent = item.icon;
                  const isSelected = accommodation === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setAccommodation(item.id as any)}
                      className={`p-3 rounded-2xl border-2 text-left flex flex-col justify-between transition-all ${
                        isSelected
                          ? item.eco
                            ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
                            : 'border-amber-600 bg-amber-50/30 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <IconComponent className={`w-3.5 h-3.5 ${isSelected ? (item.eco ? 'text-emerald-700' : 'text-amber-700') : 'text-slate-400'}`} />
                        <span className="text-[13px] font-bold text-slate-900">{item.name}</span>
                      </div>
                      <span className={`text-[11.5px] mt-1 ${item.eco ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                        {item.intensity} {item.eco && '✓ Eco'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200" />

          {/* Section 4: Eco-Habit Modifier Checkboxes */}
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center">
                  4
                </span>
                <span className="text-[12.5px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                  Optional Eco-Habit Deductions
                </span>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">Step 4 of 4</span>
            </div>

            <div className="space-y-2.5">
              <label className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                habitWater ? 'bg-emerald-50/60 border-emerald-300 shadow-xs' : 'bg-white border-slate-200 hover:border-slate-300'
              }`}>
                <input
                  type="checkbox"
                  checked={habitWater}
                  onChange={(e) => setHabitWater(e.target.checked)}
                  className="w-5 h-5 rounded accent-emerald-600 cursor-pointer"
                />
                <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">
                  <Droplets className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-slate-900">Refilled reusable water bottle</p>
                  <p className="text-[11.5px] text-slate-500">Saves mountain plastic supply chain freight</p>
                </div>
                <span className="text-[12px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                  −2.0 kg/p
                </span>
              </label>

              <label className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                habitFood ? 'bg-emerald-50/60 border-emerald-300 shadow-xs' : 'bg-white border-slate-200 hover:border-slate-300'
              }`}>
                <input
                  type="checkbox"
                  checked={habitFood}
                  onChange={(e) => setHabitFood(e.target.checked)}
                  className="w-5 h-5 rounded accent-emerald-600 cursor-pointer"
                />
                <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-slate-900">Chose local seasonal Pahadi cuisine</p>
                  <p className="text-[11.5px] text-slate-500">Low food-mile millets, bhatt ki churkani &amp; local produce</p>
                </div>
                <span className="text-[12px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                  −3.0 kg/p
                </span>
              </label>
            </div>
          </div>

          {/* Action CTA */}
          <button
            type="button"
            onClick={handleSaveTrip}
            disabled={isSaving}
            className="w-full py-4 px-6 bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white font-semibold text-[14.5px] rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 hover:shadow-md active:scale-[0.99]"
          >
            <BookmarkCheck className="w-4 h-4 text-emerald-200" />
            {isSaving ? 'Logging Trip Record...' : 'Save Trip to Uttarakhand Carbon Registry'}
          </button>
        </div>

        {/* RIGHT COLUMN: Real-Time Results & Action Panels */}
        <div className="space-y-6">
          {mapplsRoute && <MapplsMapView route={mapplsRoute} />}
          {calcResult && (
            <>
              <CalculationResults result={calcResult} input={currentInput} />
              <EcoSwapCard ecoSwap={calcResult.ecoSwap} currentPerPerson={calcResult.perPersonCo2e} />
              <RestorationPledgeBox
                saplings={calcResult.suggestedSaplings}
                onPledgeSuccess={() => showToast('🌿 Restoration pledge logged to Van Panchayat registry!')}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
