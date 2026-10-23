'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  MountainSnow,
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
  Fuel,
} from 'lucide-react';
import {
  SuvIcon,
  SedanIcon,
  HatchbackIcon,
  CoupeIcon,
  BusIcon,
  TrainIcon,
  HelicopterIcon,
  FlightIcon,
  PrivateVehicleIcon,
} from './VehicleIcons';
import {
  CalculationInput,
  CalculationOutput,
  PrivateVehicleType,
  FuelType,
  TransitMode,
  TransportCategory,
} from '../types';
import { calculateTrip, logTripRecord, getStoredSession } from '../lib/api';
import { useTranslation } from '../contexts/TranslationContext';
import { CalculationResults } from './CalculationResults';
import { EcoSwapCard } from './EcoSwapCard';
import { RestorationPledgeBox } from './RestorationPledgeBox';
import { RouteSearch } from './RouteSearch';
import { OpenMapView } from './OpenMapView';
import { OpenMapRouteResult } from '../lib/openmaps';

const PRESET_ROUTES: Record<string, { name: string; nameHi: string; distance: number; terrain: 'foothills' | 'mid_hills' | 'high_altitude' }> = {
  kumaon: {
    name: 'Kumaon Hill Circuit: Kathgodam – Nainital – Almora (320 km)',
    nameHi: 'कुमाऊं हिल सर्किट: काठगोदाम – नैनीताल – अल्मोड़ा (320 किमी)',
    distance: 320,
    terrain: 'mid_hills',
  },
  garhwal: {
    name: 'Garhwal Pilgrim Loop: Rishikesh – Devprayag – Chopta (410 km)',
    nameHi: 'गढ़वाल यात्रा लूप: ऋषिकेश – देवप्रयाग – चोपता (410 किमी)',
    distance: 410,
    terrain: 'high_altitude',
  },
  corbett: {
    name: 'Foothill to Ridge: Ramnagar – Corbett – Ranikhet (210 km)',
    nameHi: 'तराई से रानीखेत मार्ग: रामनगर – कॉर्बेट – रानीखेत (210 किमी)',
    distance: 210,
    terrain: 'foothills',
  },
  custom: {
    name: 'Custom Mountain Route (Enter Distance Manually)',
    nameHi: 'कस्टम रास्ता (दूरी स्वयं दर्ज करें)',
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
  const { t, language } = useTranslation();
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
  const [selectedRoute, setSelectedRoute] = useState<OpenMapRouteResult | null>(null);

  const handleRouteCalculated = (route: OpenMapRouteResult) => {
    setSelectedRoute(route);
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
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-elevated flex items-center gap-3 border backdrop-blur-md"
            style={{
              backgroundColor: 'var(--ink)',
              borderColor: 'var(--line-strong)',
              color: '#FFFFFF',
            }}
          >
            <CheckCircle2 className="w-4 h-4 text-[#E8EDE5] flex-shrink-0" />
            <span className="text-[13px] font-medium leading-snug">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Grid: Responsive 2-Column Editorial Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.18fr)_minmax(0,1fr)] 2xl:grid-cols-[minmax(0,1.22fr)_minmax(0,1fr)] gap-6 lg:gap-8 2xl:gap-10 items-start">
        {/* LEFT COLUMN: Field Journal Input Configuration */}
        <div className="journal-card space-y-6 sm:space-y-7">
          {/* Section 1: Route Corridor & Elevation Gradient */}
          <div>
            <div className="flex items-center justify-between mb-4 pb-2.5 border-b" style={{ borderColor: 'var(--line)' }}>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#E8EDE5] text-[#304B38] border border-[#496951]/20">
                  {t('calculator.step01')}
                </span>
                <span className="text-[13px] font-bold tracking-tight text-[#242722] uppercase font-mono flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#496951]" />
                  {t('calculator.step01Title')}
                </span>
              </div>
              <span className="font-mono text-[11px] text-[#777C72]">01 / 04</span>
            </div>

            {/* Travel Route Corridor Selection */}
            <div className="mb-4">
              <RouteSearch
                onRouteCalculated={handleRouteCalculated}
                currentDistance={distance}
              />
            </div>

            {/* Route Preset Dropdown */}
            <div className="mb-4">
              <label htmlFor="route-preset" className="block text-[12.5px] font-semibold text-[#242722] mb-1.5">
                {t('calculator.circuitPreset')}
              </label>
              <div className="relative">
                <select
                  id="route-preset"
                  value={selectedPreset}
                  onChange={handlePresetChange}
                  className="w-full h-10 px-3 pr-8 bg-[#FAF9F5] border border-[#2D322B29] rounded text-[13px] font-medium text-[#242722] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#496951] focus:border-[#496951] transition-all"
                >
                  {Object.entries(PRESET_ROUTES).map(([key, route]) => (
                    <option key={key} value={key}>
                      {language === 'HI' ? route.nameHi : route.name}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-[11px] text-[#777C72] mt-1 font-mono">
                {t('calculator.routeHint')}
              </p>
            </div>

            {/* Terrain Multiplier Radios */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[12.5px] font-semibold text-[#242722] flex items-center gap-1.5">
                  <MountainSnow className="w-3.5 h-3.5 text-[#496951]" />
                  {t('calculator.terrainZone')} <span className="text-[11px] font-normal text-[#777C72]">({t('calculator.terrainMultiplier')})</span>
                </label>
                <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#E8EDE5] text-[#304B38] border border-[#496951]/25">
                  {terrain === 'foothills' ? '1.00×' : terrain === 'mid_hills' ? '1.25×' : '1.40×'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 bg-[#F0EEE6] p-1 sm:p-1.5 rounded border border-[#2D322B29]">
                {[
                  { id: 'foothills', label: t('calculator.terrainFoothills'), mult: '1.00×' },
                  { id: 'mid_hills', label: t('calculator.terrainMidHills'), mult: '1.25×' },
                  { id: 'high_altitude', label: t('calculator.terrainHighAltitude'), mult: '1.40×' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTerrain(item.id as any)}
                    className={`py-1.5 sm:py-2 px-1 text-[11px] sm:text-[12px] font-semibold rounded transition-all text-center leading-tight ${
                      terrain === item.id
                        ? 'bg-white text-[#304B38] shadow-xs border border-[#496951]/40 font-bold'
                        : 'text-[#51554D] hover:text-[#242722]'
                    }`}
                  >
                    <span className="block text-[10.5px] sm:text-[11px] font-bold">{item.label}</span>
                    <span className="text-[9.5px] sm:text-[10px] font-mono opacity-75">{item.mult}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Round-Trip Circuit Distance */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="distance-slider" className="text-[12.5px] font-semibold text-[#242722]">
                  {t('calculator.distanceSlider')}
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={50}
                    max={1000}
                    value={distance}
                    onChange={(e) => setDistance(Math.max(50, Math.min(1000, Number(e.target.value) || 50)))}
                    className="w-20 h-7 text-right font-mono font-bold text-[13px] px-2 bg-[#FAF9F5] border border-[#2D322B29] rounded text-[#242722] focus:bg-white focus:border-[#496951]"
                  />
                  <span className="font-mono text-[12px] text-[#777C72]">km</span>
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
                className="w-full h-1.5 rounded-full cursor-pointer bg-[#E4E1D8] accent-[#496951]"
              />
              <div className="flex justify-between text-[10.5px] text-[#777C72] mt-1 font-mono">
                <span>50 km</span>
                <span>500 km</span>
                <span>1,000 km</span>
              </div>
            </div>
          </div>

          <div className="border-t" style={{ borderColor: 'var(--line)' }} />

          {/* Section 2: Vehicle Mode & Passenger Load */}
          <div>
            <div className="flex items-center justify-between mb-4 pb-2.5 border-b" style={{ borderColor: 'var(--line)' }}>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#E8EDE5] text-[#304B38] border border-[#496951]/20">
                  {t('calculator.step02')}
                </span>
                <span className="text-[13px] font-bold tracking-tight text-[#242722] uppercase font-mono flex items-center gap-1.5">
                  <PrivateVehicleIcon className="w-3.5 h-3.5 text-[#496951]" />
                  {t('calculator.step02Title')}
                </span>
              </div>
              <span className="font-mono text-[11px] text-[#777C72]">02 / 04</span>
            </div>

            {/* Mode Category Selector: Private Vehicle vs Public & Regional Transit */}
            <div className="flex rounded bg-[#F0EEE6] p-1 border border-[#2D322B29] mb-4">
              <button
                type="button"
                onClick={() => setTransportCategory('private')}
                className={`flex-1 py-1.5 px-2 sm:px-3 rounded text-[11.5px] sm:text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  transportCategory === 'private'
                    ? 'bg-white text-[#304B38] shadow-xs border border-[#496951]/30 font-bold'
                    : 'text-[#51554D] hover:text-[#242722]'
                }`}
              >
                <PrivateVehicleIcon className="w-3.5 h-3.5 text-[#496951]" />
                <span>{t('calculator.privateVehicle')}</span>
              </button>
              <button
                type="button"
                onClick={() => setTransportCategory('transit')}
                className={`flex-1 py-1.5 px-2 sm:px-3 rounded text-[11.5px] sm:text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  transportCategory === 'transit'
                    ? 'bg-white text-[#304B38] shadow-xs border border-[#496951]/30 font-bold'
                    : 'text-[#51554D] hover:text-[#242722]'
                }`}
              >
                <BusIcon className="w-3.5 h-3.5 text-[#496951]" />
                <span>{t('calculator.publicTransit')}</span>
              </button>
            </div>

            {/* Option A: Private Vehicle (Body Type + Fuel Type Selection) */}
            {transportCategory === 'private' ? (
              <div className="space-y-4 mb-4">
                {/* Vehicle Body Type */}
                <div>
                  <label className="block text-[11.5px] font-semibold text-[#242722] mb-1.5">
                    {t('calculator.vehicleType')}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'suv', name: 'SUV / 4×4', icon: SuvIcon, desc: language === 'HI' ? 'स्कॉर्पियो, थार, सफारी' : 'Scorpio, Thar, Safari' },
                      { id: 'sedan', name: language === 'HI' ? 'सेडान' : 'Sedan', icon: SedanIcon, desc: language === 'HI' ? 'होंडा सिटी, डिजायर, वरना' : 'City, Dzire, Verna' },
                      { id: 'hatchback', name: language === 'HI' ? 'हैचबैक' : 'Hatchback', icon: HatchbackIcon, desc: language === 'HI' ? 'स्विफ्ट, i20, टियागो' : 'Swift, i20, Tiago' },
                      { id: 'coupe', name: language === 'HI' ? 'कूपे' : 'Coupe', icon: CoupeIcon, desc: language === 'HI' ? 'स्पोर्ट्स / 2-डोर' : 'Sports / 2-Door' },
                    ].map((item) => {
                      const IconComp = item.icon;
                      const isSel = vehicleType === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setVehicleType(item.id as any)}
                          className={`p-2.5 rounded border text-left transition-all ${
                            isSel
                              ? 'border-[#496951] bg-[#E8EDE5]/50 shadow-xs'
                              : 'border-[#2D322B29] bg-[#FAF9F5] hover:border-[#2D322B29]/70'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <IconComp className={`w-3.5 h-3.5 ${isSel ? 'text-[#304B38]' : 'text-[#777C72]'}`} />
                            {isSel && <span className="font-mono text-[10px] font-bold text-[#304B38]">✓</span>}
                          </div>
                          <p className="text-[12px] font-bold text-[#242722] leading-tight">{item.name}</p>
                          <p className="text-[9.5px] text-[#777C72] mt-0.5">{item.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Fuel Engine Type */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11.5px] font-semibold text-[#242722]">
                      {t('calculator.fuelType')}
                    </label>
                    <span className="font-mono text-[10.5px] font-bold text-[#304B38] bg-[#E8EDE5] px-2 py-0.5 rounded border border-[#496951]/25">
                      {PRIVATE_VEHICLE_MATRIX[vehicleType][fuelType]} g CO₂e/km
                    </span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                    {[
                      { id: 'petrol', label: language === 'HI' ? 'पेट्रोल' : 'Petrol', icon: Fuel },
                      { id: 'diesel', label: language === 'HI' ? 'डीजल' : 'Diesel', icon: Fuel },
                      { id: 'cng', label: 'CNG', icon: Flame },
                      { id: 'lpg', label: 'LPG', icon: Flame },
                      { id: 'hybrid', label: language === 'HI' ? 'हाइब्रिड' : 'Hybrid', icon: Leaf },
                      { id: 'ev', label: 'EV', icon: Zap },
                    ].map((fuel) => {
                      const FuelIcon = fuel.icon;
                      const isFuelSel = fuelType === fuel.id;
                      return (
                        <button
                          key={fuel.id}
                          type="button"
                          onClick={() => setFuelType(fuel.id as any)}
                          className={`py-1.5 px-1 text-center rounded border text-[11px] font-semibold transition-all ${
                            isFuelSel
                              ? 'bg-[#242722] text-white border-[#242722] shadow-xs'
                              : 'bg-[#FAF9F5] text-[#51554D] border-[#2D322B29] hover:bg-white'
                          }`}
                        >
                          <FuelIcon className={`w-3 h-3 mx-auto mb-0.5 ${isFuelSel ? 'text-[#E8EDE5]' : 'text-[#777C72]'}`} />
                          <span>{fuel.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              /* Option B: Public & Regional Transit */
              <div className="mb-4">
                <label className="block text-[11.5px] font-semibold text-[#242722] mb-1.5">
                  {t('calculator.transitMode')}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-2">
                  {[
                    { id: 'bus', name: language === 'HI' ? 'साझा यूटीसी बस' : 'Shared UTC Bus', factor: '30 g CO₂/km', badge: 'Eco', icon: BusIcon, desc: language === 'HI' ? 'रोडवेज बस / पर्वतीय हाईवे' : 'State bus / mountain highway' },
                    { id: 'train', name: language === 'HI' ? 'भारतीय रेल (ट्रेन)' : 'Indian Railways (Train)', factor: '18 g CO₂/km', badge: language === 'HI' ? 'सबसे कम' : 'Lowest', icon: TrainIcon, desc: language === 'HI' ? 'काठगोदाम / ऋषिकेश स्टेशन' : 'Foothill train corridor' },
                    { id: 'helicopter', name: language === 'HI' ? 'हिमालयन हेलीकॉप्टर' : 'Himalayan Helicopter', factor: '450 g CO₂/km', badge: 'Alpine', icon: HelicopterIcon, desc: language === 'HI' ? 'चार धाम / केदारनाथ शटल' : 'Char Dham / Kedarnath shuttle' },
                    { id: 'flight', name: language === 'HI' ? 'रीजनल फ्लाइट' : 'Regional Flight', factor: '180 g CO₂/km', badge: 'Aviation', icon: FlightIcon, desc: language === 'HI' ? 'जॉली ग्रांट / पंतनगर' : 'Flight to Dehradun / Pantnagar' },
                  ].map((transit) => {
                    const TransitIcon = transit.icon;
                    const isTransitSel = transitMode === transit.id;
                    return (
                      <button
                        key={transit.id}
                        type="button"
                        onClick={() => setTransitMode(transit.id as any)}
                        className={`p-2.5 rounded border text-left flex flex-col justify-between transition-all ${
                          isTransitSel
                            ? 'border-[#496951] bg-[#E8EDE5]/50 shadow-xs'
                            : 'border-[#2D322B29] bg-[#FAF9F5] hover:border-[#2D322B29]/70'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5">
                            <TransitIcon className={`w-3.5 h-3.5 ${isTransitSel ? 'text-[#304B38]' : 'text-[#777C72]'}`} />
                            <span className="text-[12px] font-bold text-[#242722]">{transit.name}</span>
                          </div>
                          {isTransitSel && (
                            <span className="font-mono text-[10px] font-bold text-[#304B38]">✓</span>
                          )}
                        </div>
                        <p className="text-[10px] text-[#777C72] mb-1">{transit.desc}</p>
                        <div className="flex items-center justify-between font-mono text-[10.5px]">
                          <span className="text-[#304B38] font-semibold">{transit.factor}</span>
                          {transit.badge && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#E8EDE5] text-[#304B38]">
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

            {/* Passenger Stepper: Responsive on Mobile */}
            <div className="bg-[#FAF9F5] border border-[#2D322B29] rounded p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-[12.5px] font-semibold text-[#242722] flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#496951]" />
                    {t('calculator.passengers')}
                  </p>
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-[#304B38] border border-[#2D322B29]">
                    {currentLimit.label}
                  </span>
                </div>
                <p className="text-[11px] text-[#777C72] mt-0.5">
                  {t('calculator.passengersHelper')}
                </p>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#2D322B14]">
                <button
                  type="button"
                  disabled={passengers <= currentLimit.min}
                  onClick={() => setPassengers((prev) => Math.max(currentLimit.min, prev - 1))}
                  className="w-9 h-9 rounded bg-white border border-[#2D322B29] font-bold text-[16px] text-[#242722] disabled:opacity-30 hover:bg-[#F0EEE6] active:scale-95 flex items-center justify-center transition-all"
                  aria-label="Decrease passengers"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-mono font-bold text-[13.5px] text-[#242722] min-w-[80px] text-center">
                  {passengers} {language === 'HI' ? 'यात्री' : (passengers === 1 ? 'Traveler' : 'Travelers')}
                </span>
                <button
                  type="button"
                  disabled={passengers >= currentLimit.max}
                  onClick={() => setPassengers((prev) => Math.min(currentLimit.max, prev + 1))}
                  className="w-9 h-9 rounded bg-white border border-[#2D322B29] font-bold text-[16px] text-[#242722] disabled:opacity-30 hover:bg-[#F0EEE6] active:scale-95 flex items-center justify-center transition-all"
                  aria-label="Increase passengers"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t" style={{ borderColor: 'var(--line)' }} />

          {/* Section 3: Lodging Profile & Stay Duration */}
          <div>
            <div className="flex items-center justify-between mb-4 pb-2.5 border-b" style={{ borderColor: 'var(--line)' }}>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#E8EDE5] text-[#304B38] border border-[#496951]/20">
                  {t('calculator.step03')}
                </span>
                <span className="text-[13px] font-bold tracking-tight text-[#242722] uppercase font-mono flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-[#496951]" />
                  {t('calculator.step03Title')}
                </span>
              </div>
              <span className="font-mono text-[11px] text-[#777C72]">03 / 04</span>
            </div>

            {/* Stay Duration Slider */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="nights-slider" className="text-[12.5px] font-semibold text-[#242722]">
                  {t('calculator.durationStay')}
                </label>
                <span className="font-mono text-[11.5px] font-bold px-2 py-0.5 bg-[#F1EADD] border border-[#B3834D]/30 rounded text-[#8A5D2E]">
                  {nights} {language === 'HI' ? 'रातें' : (nights === 1 ? 'Night' : 'Nights')}
                </span>
              </div>
              <input
                id="nights-slider"
                type="range"
                min={1}
                max={14}
                value={nights}
                onChange={(e) => setNights(Number(e.target.value))}
                className="w-full h-1.5 rounded-full cursor-pointer bg-[#E4E1D8] accent-[#B3834D]"
              />
              <div className="flex justify-between text-[10.5px] text-[#777C72] mt-1 font-mono">
                <span>1 {language === 'HI' ? 'रात' : 'Night'}</span>
                <span>7 {language === 'HI' ? 'रातें' : 'Nights'}</span>
                <span>14 {language === 'HI' ? 'रातें' : 'Nights'}</span>
              </div>
            </div>

            {/* Lodging Type Selection */}
            <div>
              <label className="block text-[12.5px] font-semibold text-[#242722] mb-1.5">
                {t('calculator.stayType')}
              </label>
              <div className="grid grid-cols-1 xs:grid-cols-2 2xl:grid-cols-4 gap-2">
                {[
                  { id: 'luxury', name: t('calculator.stayLuxuryResort'), intensity: '24.0 kg/night', icon: Flame },
                  { id: 'hotel', name: t('calculator.stayStandardHotel'), intensity: '9.0 kg/night', icon: Hotel },
                  { id: 'homestay', name: t('calculator.stayPahadi'), intensity: '6.0 kg/night', eco: true, icon: Home },
                  { id: 'camp', name: t('calculator.stayEcoCamp'), intensity: '3.5 kg/night', eco: true, icon: Tent },
                ].map((item) => {
                  const IconComponent = item.icon;
                  const isSelected = accommodation === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setAccommodation(item.id as any)}
                      className={`p-2.5 rounded border text-left flex flex-col justify-between transition-all ${
                        isSelected
                          ? item.eco
                            ? 'border-[#496951] bg-[#E8EDE5]/60 shadow-xs'
                            : 'border-[#B3834D] bg-[#F1EADD]/40 shadow-xs'
                          : 'border-[#2D322B29] bg-[#FAF9F5] hover:border-[#2D322B29]/70'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <IconComponent className={`w-3.5 h-3.5 ${isSelected ? (item.eco ? 'text-[#304B38]' : 'text-[#8A5D2E]') : 'text-[#777C72]'}`} />
                        <span className="text-[12px] font-bold text-[#242722]">{item.name}</span>
                      </div>
                      <span className={`font-mono text-[10.5px] mt-1 ${item.eco ? 'text-[#304B38] font-semibold' : 'text-[#777C72]'}`}>
                        {item.intensity} {item.eco && (language === 'HI' ? '· ईको' : '· Eco')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="border-t" style={{ borderColor: 'var(--line)' }} />

          {/* Section 4: Optional Eco-Habit Modifier Checkboxes */}
          <div>
            <div className="flex items-center justify-between mb-4 pb-2.5 border-b" style={{ borderColor: 'var(--line)' }}>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#E8EDE5] text-[#304B38] border border-[#496951]/20">
                  {t('calculator.step04')}
                </span>
                <span className="text-[13px] font-bold tracking-tight text-[#242722] uppercase font-mono flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-[#496951]" />
                  {t('calculator.step04Title')}
                </span>
              </div>
              <span className="font-mono text-[11px] text-[#777C72]">04 / 04</span>
            </div>

            <div className="space-y-2">
              <label className={`flex items-center gap-3 p-3 rounded border cursor-pointer transition-all ${
                habitWater ? 'bg-[#E8EDE5]/60 border-[#496951] shadow-xs' : 'bg-[#FAF9F5] border-[#2D322B29] hover:bg-white'
              }`}>
                <input
                  type="checkbox"
                  checked={habitWater}
                  onChange={(e) => setHabitWater(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#496951] cursor-pointer"
                />
                <div className="p-1 rounded bg-[#E8EDE5] text-[#304B38]">
                  <Droplets className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <p className="text-[12.5px] font-semibold text-[#242722]">{t('calculator.habitWater')}</p>
                  <p className="text-[11px] text-[#777C72]">{t('calculator.habitWaterDesc')}</p>
                </div>
                <span className="font-mono text-[11px] font-bold text-[#304B38] bg-[#E8EDE5] px-2 py-0.5 rounded border border-[#496951]/25">
                  −2.0 kg/p
                </span>
              </label>

              <label className={`flex items-center gap-3 p-3 rounded border cursor-pointer transition-all ${
                habitFood ? 'bg-[#E8EDE5]/60 border-[#496951] shadow-xs' : 'bg-[#FAF9F5] border-[#2D322B29] hover:bg-white'
              }`}>
                <input
                  type="checkbox"
                  checked={habitFood}
                  onChange={(e) => setHabitFood(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#496951] cursor-pointer"
                />
                <div className="p-1 rounded bg-[#E8EDE5] text-[#304B38]">
                  <UtensilsCrossed className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <p className="text-[12.5px] font-semibold text-[#242722]">{t('calculator.habitFood')}</p>
                  <p className="text-[11px] text-[#777C72]">{t('calculator.habitFoodDesc')}</p>
                </div>
                <span className="font-mono text-[11px] font-bold text-[#304B38] bg-[#E8EDE5] px-2 py-0.5 rounded border border-[#496951]/25">
                  −3.0 kg/p
                </span>
              </label>
            </div>
          </div>

          {/* Action CTA: Save Trip */}
          <button
            type="button"
            onClick={handleSaveTrip}
            disabled={isSaving}
            className="w-full py-3.5 sm:py-4 px-5 button-primary font-semibold text-[13.5px] sm:text-[14px] rounded transition-all flex items-center justify-center gap-2"
          >
            <BookmarkCheck className="w-4 h-4" />
            <span>{isSaving ? (language === 'HI' ? 'सहेज रहे हैं...' : 'Saving...') : t('calculator.saveTrip')}</span>
          </button>
        </div>

        {/* RIGHT COLUMN: Real-Time Results & Action Panels (Sticky on Desktop & TV) */}
        <div className="space-y-6 lg:sticky lg:top-24">
          {selectedRoute && <OpenMapView route={selectedRoute} />}
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
