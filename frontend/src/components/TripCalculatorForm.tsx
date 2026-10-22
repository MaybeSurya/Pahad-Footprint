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
} from 'lucide-react';
import { CalculationInput, CalculationOutput } from '../types';
import { calculateTrip, logTripRecord, getStoredSession } from '../lib/api';
import { CalculationResults } from './CalculationResults';
import { EcoSwapCard } from './EcoSwapCard';
import { RestorationPledgeBox } from './RestorationPledgeBox';

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

export const TripCalculatorForm: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<string>('kumaon');
  const [distance, setDistance] = useState<number>(320);
  const [terrain, setTerrain] = useState<'foothills' | 'mid_hills' | 'high_altitude'>('mid_hills');
  const [transportMode, setTransportMode] = useState<'suv' | 'sedan' | 'bus' | 'ev'>('suv');
  const [passengers, setPassengers] = useState<number>(3);
  const [nights, setNights] = useState<number>(4);
  const [accommodation, setAccommodation] = useState<'luxury' | 'hotel' | 'homestay' | 'camp'>('hotel');
  const [habitWater, setHabitWater] = useState<boolean>(false);
  const [habitFood, setHabitFood] = useState<boolean>(false);

  const [calcResult, setCalcResult] = useState<CalculationOutput | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Recalculate on any input change
  useEffect(() => {
    const input: CalculationInput = {
      distanceKm: distance,
      terrainZone: terrain,
      transportMode,
      passengers,
      nights,
      accommodationType: accommodation,
      habitWater,
      habitFood,
    };

    calculateTrip(input).then(setCalcResult);
  }, [distance, terrain, transportMode, passengers, nights, accommodation, habitWater, habitFood]);

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
            className="fixed bottom-6 right-6 z-50 bg-[#1B4332] text-white px-5 py-3.5 rounded-2xl shadow-elevated flex items-center gap-3 border border-[#2D6A4F]/60 backdrop-blur-md"
          >
            <CheckCircle2 className="w-5 h-5 text-[#C1ECD4] flex-shrink-0" />
            <span className="text-[13.5px] font-medium leading-snug">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Grid: Responsive Guard using minmax(0, Xfr) */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] gap-grid items-start">
        {/* LEFT COLUMN: Input Configuration Form */}
        <div className="pahad-card space-y-6">
          {/* Section 1: Route & Elevation Zone */}
          <div>
            <div className="flex items-center gap-2 text-[12px] font-bold text-[#4B5563] uppercase tracking-wider mb-3">
              <MapPin className="w-4 h-4 text-[#1B4332]" strokeWidth={2} />
              1. Route &amp; Elevation Zone
            </div>

            {/* Route Preset Dropdown */}
            <div className="mb-4">
              <label htmlFor="route-preset" className="block text-[13px] font-semibold text-[#111827] mb-1.5">
                Circuit Route Preset
              </label>
              <select
                id="route-preset"
                value={selectedPreset}
                onChange={handlePresetChange}
                className="w-full h-11 px-3.5 bg-[#EDF6F0] border border-[#D8E8DF] rounded-input text-[13.5px] font-medium text-[#111827] focus:ring-2 focus:ring-[#1B4332]"
              >
                <option value="kumaon">Kumaon Hill Circuit: Kathgodam – Nainital – Mukteshwar – Almora (320 km)</option>
                <option value="garhwal">Garhwal Pilgrim Loop: Rishikesh – Devprayag – Rudraprayag – Chopta (410 km)</option>
                <option value="corbett">Foothill Wildlife Traverse: Ramnagar – Corbett – Marchula – Ranikhet (210 km)</option>
                <option value="custom">Custom Mountain Itinerary (Direct Distance Input)</option>
              </select>
              <p className="text-[11.5px] text-[#4B5563] mt-1">Standard corridors with verified altitudinal gradient profiles.</p>
            </div>

            {/* Terrain Multiplier Radios */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[13px] font-semibold text-[#111827] flex items-center gap-1.5">
                  <MountainSnow className="w-4 h-4 text-[#1B4332]" />
                  Terrain Multiplier <span className="text-[11px] font-normal text-[#4B5563]">(altitude fuel burn)</span>
                </label>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#C1ECD4] text-[#002114]">
                  Incline Factor: {terrain === 'foothills' ? '1.00×' : terrain === 'mid_hills' ? '1.25×' : '1.40×'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 bg-[#EDF6F0] p-1.5 rounded-card border border-[#D8E8DF]">
                {[
                  { id: 'foothills', label: 'Foothills', mult: '1.00×' },
                  { id: 'mid_hills', label: 'Mid-Hills', mult: '1.25×' },
                  { id: 'high_altitude', label: 'High Altitude', mult: '1.40×' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTerrain(item.id as any)}
                    className={`py-2 px-1 text-[12.5px] font-semibold rounded-btn transition-all text-center relative ${
                      terrain === item.id
                        ? 'bg-white text-[#1B4332] shadow-sm'
                        : 'text-[#4B5563] hover:bg-white/50'
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
                <label htmlFor="distance-slider" className="text-[13px] font-semibold text-[#111827]">
                  Round-Trip Circuit Distance
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={50}
                    max={1000}
                    value={distance}
                    onChange={(e) => setDistance(Math.max(50, Math.min(1000, Number(e.target.value) || 50)))}
                    className="w-20 h-8 text-right font-bold text-[14px] px-2 bg-white border border-[#D8E8DF] rounded-input"
                  />
                  <span className="text-[13px] font-medium text-[#4B5563]">km</span>
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
                className="w-full h-2 rounded-full cursor-pointer bg-[#D8E8DF]"
              />
              <div className="flex justify-between text-[11px] text-[#4B5563] mt-1 font-mono">
                <span>50 km</span>
                <span>500 km</span>
                <span>1,000 km</span>
              </div>
            </div>
          </div>

          <div className="border-t border-[#D8E8DF]" />

          {/* Section 2: Transport Mode & Occupancy */}
          <div>
            <div className="flex items-center justify-between text-[12px] font-bold text-[#4B5563] uppercase tracking-wider mb-3">
              <span className="flex items-center gap-2">
                <CarFront className="w-4 h-4 text-[#1B4332]" strokeWidth={2} />
                2. Transport Mode &amp; Occupancy
              </span>
              <span className="text-[11px] font-normal text-[#4B5563]">ARAI Reference Baseline</span>
            </div>

            {/* 2x2 Transport Mode Cards */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { id: 'suv', name: 'Private SUV (Diesel)', factor: '180 g CO₂e/vkm', badge: null, icon: CarFront },
                { id: 'sedan', name: 'Petrol Sedan', factor: '140 g CO₂e/vkm', badge: null, icon: Car },
                { id: 'bus', name: 'Shared UTC Bus', factor: '30 g CO₂e/pkm', badge: 'Eco', icon: BusFront },
                { id: 'ev', name: 'Electric Vehicle (EV)', factor: '45 g CO₂e/vkm', badge: 'Low-Grid', icon: Zap },
              ].map((item) => {
                const IconComponent = item.icon;
                const isSelected = transportMode === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTransportMode(item.id as any)}
                    className={`p-3.5 rounded-2xl border-2 text-left flex flex-col justify-between transition-all relative ${
                      isSelected
                        ? 'border-[#1B4332] bg-[#EDF6F0] shadow-sm'
                        : 'border-[#D8E8DF] bg-white hover:border-[#A3CCA9]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <IconComponent className={`w-4 h-4 ${isSelected ? 'text-[#1B4332]' : 'text-[#4B5563]'}`} />
                        <span className="text-[13px] font-bold text-[#111827]">{item.name}</span>
                      </div>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-[#1B4332] text-white flex items-center justify-center text-[11px]">
                          ✓
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[11.5px] text-[#4B5563]">
                      <span>{item.factor}</span>
                      {item.badge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#C1ECD4] text-[#002114]">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Passenger Stepper */}
            <div className="bg-[#EDF6F0] border border-[#D8E8DF] rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold text-[#111827] flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#1B4332]" />
                  Passenger Count
                </p>
                <p className="text-[11.5px] text-[#4B5563]">Vehicle footprint divided across {passengers} travelers</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={passengers <= 1}
                  onClick={() => setPassengers((prev) => Math.max(1, prev - 1))}
                  className="w-9 h-9 rounded-xl bg-white border border-[#D8E8DF] font-bold text-[18px] text-[#111827] disabled:opacity-40 hover:bg-[#D8E8DF]/50 flex items-center justify-center transition-colors"
                  aria-label="Decrease passengers"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold text-[14px] text-[#111827] min-w-[90px] text-center font-mono">
                  {passengers} {passengers === 1 ? 'Traveler' : 'Travelers'}
                </span>
                <button
                  type="button"
                  disabled={passengers >= 8}
                  onClick={() => setPassengers((prev) => Math.min(8, prev + 1))}
                  className="w-9 h-9 rounded-xl bg-white border border-[#D8E8DF] font-bold text-[18px] text-[#111827] disabled:opacity-40 hover:bg-[#D8E8DF]/50 flex items-center justify-center transition-colors"
                  aria-label="Increase passengers"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-[#D8E8DF]" />

          {/* Section 3: Accommodation Profile */}
          <div>
            <div className="flex items-center justify-between text-[12px] font-bold text-[#4B5563] uppercase tracking-wider mb-3">
              <span className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-[#1B4332]" strokeWidth={2} />
                3. Accommodation Profile
              </span>
              <span className="text-[11px] font-normal text-[#4B5563]">Per Guest-Night Basis</span>
            </div>

            {/* Stay Duration Slider */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="nights-slider" className="text-[13px] font-semibold text-[#111827]">
                  Duration of Stay
                </label>
                <span className="text-[13px] font-bold px-2.5 py-0.5 bg-[#EDF6F0] border border-[#D8E8DF] rounded-btn text-[#111827]">
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
                className="w-full h-2 rounded-full cursor-pointer bg-[#D8E8DF]"
              />
              <div className="flex justify-between text-[11px] text-[#4B5563] mt-1 font-mono">
                <span>1 Night</span>
                <span>7 Nights</span>
                <span>14 Nights</span>
              </div>
            </div>

            {/* Lodging Type Selection */}
            <div>
              <label className="block text-[13px] font-semibold text-[#111827] mb-2">
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
                          ? 'border-[#1B4332] bg-[#EDF6F0] shadow-sm'
                          : 'border-[#D8E8DF] bg-white hover:border-[#A3CCA9]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-[#1B4332]' : 'text-[#4B5563]'}`} />
                        <span className="text-[13px] font-bold text-[#111827]">{item.name}</span>
                      </div>
                      <span className={`text-[11.5px] mt-1 ${item.eco ? 'text-[#1B4332] font-semibold' : 'text-[#4B5563]'}`}>
                        {item.intensity} {item.eco && '✓ Eco'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="border-t border-[#D8E8DF]" />

          {/* Section 4: Eco-Habit Modifier Checkboxes */}
          <div>
            <div className="flex items-center gap-2 text-[12px] font-bold text-[#4B5563] uppercase tracking-wider mb-3">
              <Leaf className="w-4 h-4 text-[#1B4332]" strokeWidth={2} />
              4. Optional Eco-Habit Deductions
            </div>

            <div className="space-y-2.5">
              <label className="flex items-center gap-3 p-3.5 bg-[#EDF6F0] rounded-2xl border border-[#D8E8DF] cursor-pointer hover:bg-[#E2F0E7] transition-colors">
                <input
                  type="checkbox"
                  checked={habitWater}
                  onChange={(e) => setHabitWater(e.target.checked)}
                  className="w-5 h-5 rounded accent-[#1B4332] cursor-pointer"
                />
                <div className="p-1.5 rounded-lg bg-white border border-[#D8E8DF] text-[#1B4332]">
                  <Droplets className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-[#111827]">Refilled reusable water bottle</p>
                  <p className="text-[11.5px] text-[#4B5563]">Saves mountain plastic supply chain freight</p>
                </div>
                <span className="text-[12px] font-bold text-[#1B4332] bg-white px-2.5 py-1 rounded-xl border border-[#D8E8DF]">
                  −2.0 kg/p
                </span>
              </label>

              <label className="flex items-center gap-3 p-3.5 bg-[#EDF6F0] rounded-2xl border border-[#D8E8DF] cursor-pointer hover:bg-[#E2F0E7] transition-colors">
                <input
                  type="checkbox"
                  checked={habitFood}
                  onChange={(e) => setHabitFood(e.target.checked)}
                  className="w-5 h-5 rounded accent-[#1B4332] cursor-pointer"
                />
                <div className="p-1.5 rounded-lg bg-white border border-[#D8E8DF] text-[#1B4332]">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-[#111827]">Chose local seasonal Pahadi cuisine</p>
                  <p className="text-[11.5px] text-[#4B5563]">Low food-mile millets, bhatt ki churkani &amp; local produce</p>
                </div>
                <span className="text-[12px] font-bold text-[#1B4332] bg-white px-2.5 py-1 rounded-xl border border-[#D8E8DF]">
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
            className="w-full py-4 px-6 bg-[#1B4332] hover:bg-[#143225] text-white font-semibold text-[14px] rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 hover:shadow-elevated active:scale-[0.99]"
          >
            <BookmarkCheck className="w-4 h-4 text-[#C1ECD4]" />
            {isSaving ? 'Logging Trip Record...' : 'Save Trip to Uttarakhand Carbon Registry'}
          </button>
        </div>

        {/* RIGHT COLUMN: Real-Time Results & Action Panels */}
        <div className="space-y-6">
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
