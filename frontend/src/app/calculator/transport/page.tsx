'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  ArrowLeft,
  Users,
  Minus,
  Plus,
  Fuel,
  Flame,
  Leaf,
  Zap,
} from 'lucide-react';
import {
  SuvIcon,
  SedanIcon,
  HatchbackIcon,
  CoupeIcon,
  BicycleIcon,
  MotorcycleIcon,
  ScootyIcon,
  TwoWheelerIcon,
  BusIcon,
  TrainIcon,
  HelicopterIcon,
  FlightIcon,
  PrivateVehicleIcon,
} from '../../../components/VehicleIcons';
import { useTranslation } from '../../../contexts/TranslationContext';
import {
  useTrip,
  ALLOWED_FUELS_BY_VEHICLE,
  PRIVATE_VEHICLE_MATRIX,
} from '../../../contexts/TripContext';
import { FuelType } from '../../../types';

export default function TransportStepPage() {
  const router = useRouter();
  const { t, language } = useTranslation();
  const {
    transportCategory,
    handleSelectCategory,
    vehicleType,
    handleSelectVehicle,
    fuelType,
    setFuelType,
    transitMode,
    setTransitMode,
    passengers,
    setPassengers,
    currentLimit,
  } = useTrip();

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Step Header */}
      <div className="pb-3 border-b" style={{ borderColor: 'var(--line)' }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#E8EDE5] text-[#304B38] border border-[#496951]/20">
            {language === 'HI' ? 'चरण ०२' : 'STEP 02'}
          </span>
          <span className="text-[12px] font-mono uppercase tracking-wider text-[#777C72]">
            {language === 'HI' ? 'परिवहन और वाहन चयन' : 'Transportation Method & Occupancy'}
          </span>
        </div>
        <h2 className="text-[22px] sm:text-[28px] font-bold text-[#242722] tracking-tight">
          {language === 'HI' ? 'आप पहाड़ों में कैसे यात्रा करेंगे?' : 'How will you navigate the mountain passes?'}
        </h2>
        <p className="text-[13.5px] text-[#51554D] max-w-2xl mt-1 leading-relaxed">
          {language === 'HI'
            ? 'दोपहिया (साइकिल, मोटरसाइकिल, स्कूटी), निजी ४-पहिया कार, अथवा सार्वजनिक परिवहन (बस, ट्रेन, हेली) में से चुनें।'
            : 'Select two-wheelers (bicycle, motorcycle, scooty), personal 4-wheelers, or regional transit corridors.'}
        </p>
      </div>

      <div className="journal-card space-y-6">
        {/* Category Switcher: 3 Options */}
        <div>
          <label className="block text-[12px] font-semibold text-[#242722] mb-2 uppercase font-mono tracking-wider">
            {language === 'HI' ? 'परिवहन श्रेणी' : 'Travel Category'}
          </label>
          <div className="grid grid-cols-3 rounded bg-[#F0EEE6] p-1.5 border border-[#2D322B29] gap-1.5">
            <button
              type="button"
              onClick={() => handleSelectCategory('two_wheeler')}
              className={`py-2 px-2 sm:px-3 rounded text-[12px] sm:text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                transportCategory === 'two_wheeler'
                  ? 'bg-white text-[#304B38] shadow-xs border border-[#496951]/30 font-bold'
                  : 'text-[#51554D] hover:text-[#242722]'
              }`}
            >
              <TwoWheelerIcon className="w-4 h-4 text-[#496951] flex-shrink-0" />
              <span>{language === 'HI' ? 'दोपहिया' : 'Two-Wheeler'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectCategory('private')}
              className={`py-2 px-2 sm:px-3 rounded text-[12px] sm:text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                transportCategory === 'private'
                  ? 'bg-white text-[#304B38] shadow-xs border border-[#496951]/30 font-bold'
                  : 'text-[#51554D] hover:text-[#242722]'
              }`}
            >
              <PrivateVehicleIcon className="w-4 h-4 text-[#496951] flex-shrink-0" />
              <span>{language === 'HI' ? '४-पहिया कार' : '4-Wheeler Car'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectCategory('transit')}
              className={`py-2 px-2 sm:px-3 rounded text-[12px] sm:text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                transportCategory === 'transit'
                  ? 'bg-white text-[#304B38] shadow-xs border border-[#496951]/30 font-bold'
                  : 'text-[#51554D] hover:text-[#242722]'
              }`}
            >
              <BusIcon className="w-4 h-4 text-[#496951] flex-shrink-0" />
              <span>{language === 'HI' ? 'पब्लिक ट्रांजिट' : 'Public Transit'}</span>
            </button>
          </div>
        </div>

        {/* Option A: Two-Wheelers */}
        {transportCategory === 'two_wheeler' && (
          <div className="space-y-5">
            <div>
              <label className="block text-[12px] font-semibold text-[#242722] mb-2 font-mono uppercase tracking-wider">
                {language === 'HI' ? 'दोपहिया वाहन मॉडल' : 'Select Two-Wheeler Vehicle'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'bicycle',
                    name: language === 'HI' ? 'साइकिल (Bicycle)' : 'Bicycle',
                    icon: BicycleIcon,
                    desc: language === 'HI' ? 'पैडल अथवा ई-साइकिल (शून्य या अति-न्यूनतम कार्बन)' : 'Pedal or Electric E-Bike (Zero/Low Carbon)',
                    tag: 'Zero/Low CO₂',
                  },
                  {
                    id: 'motorcycle',
                    name: language === 'HI' ? 'मोटरसाइकिल (Motorcycle)' : 'Motorcycle',
                    icon: MotorcycleIcon,
                    desc: language === 'HI' ? 'रॉयल एनफील्ड, पल्सर, हिमालयन 450' : 'Royal Enfield, Pulsar, Himalayan 450',
                    tag: 'Alpine Touring',
                  },
                  {
                    id: 'scooty',
                    name: language === 'HI' ? 'स्कूटी / स्कूटर (Scooty)' : 'Scooty / Scooter',
                    icon: ScootyIcon,
                    desc: language === 'HI' ? 'एक्टिवा, जुपिटर, ओला, एथर' : 'Activa, Jupiter, Ola EV, Ather',
                    tag: 'Urban / Hill Commute',
                  },
                ].map((item) => {
                  const IconComp = item.icon;
                  const isSel = vehicleType === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectVehicle(item.id as any)}
                      className={`p-3.5 rounded border text-left transition-all ${
                        isSel
                          ? 'border-[#496951] bg-[#E8EDE5]/60 shadow-xs ring-1 ring-[#496951]/30'
                          : 'border-[#2D322B29] bg-[#FAF9F5] hover:border-[#2D322B29]/70'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <IconComp className={`w-5 h-5 ${isSel ? 'text-[#304B38]' : 'text-[#777C72]'}`} />
                        <span className="font-mono text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-white text-[#304B38] border border-[#2D322B14]">
                          {item.tag}
                        </span>
                      </div>
                      <p className="text-[13.5px] font-bold text-[#242722]">{item.name}</p>
                      <p className="text-[11px] text-[#777C72] mt-1">{item.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fuel Selector for Two-Wheelers */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[12px] font-semibold text-[#242722] font-mono uppercase tracking-wider">
                  {language === 'HI' ? 'ईंधन / ड्राइवट्रेन प्रकार' : 'Fuel / Drivetrain Option'}
                </label>
                <span className="font-mono text-[11px] font-bold text-[#304B38] bg-[#E8EDE5] px-2.5 py-1 rounded border border-[#496951]/25">
                  {vehicleType === 'bicycle' && fuelType === 'pedal'
                    ? (language === 'HI' ? '0 g CO₂e/km (शून्य उत्सर्जन 🌿)' : '0 g CO₂e/km (Zero Emission 🌿)')
                    : `${PRIVATE_VEHICLE_MATRIX[vehicleType]?.[fuelType] ?? 0} g CO₂e/km`}
                </span>
              </div>
              <div className={`grid gap-2 ${
                (ALLOWED_FUELS_BY_VEHICLE[vehicleType] || []).length === 2 ? 'grid-cols-2' : 'grid-cols-3'
              }`}>
                {[
                  { id: 'pedal', label: language === 'HI' ? 'पैडल (0g)' : 'Pedal Manual (0g)', icon: Leaf, desc: 'Zero Emission' },
                  { id: 'petrol', label: language === 'HI' ? 'पेट्रोल' : 'Petrol', icon: Fuel, desc: 'Regular Fuel' },
                  { id: 'hybrid', label: language === 'HI' ? 'हाइब्रिड' : 'Hybrid', icon: Leaf, desc: 'Electric Assist' },
                  { id: 'ev', label: 'EV Electric', icon: Zap, desc: 'Zero Tailpipe' },
                ]
                  .filter((fuel) => (ALLOWED_FUELS_BY_VEHICLE[vehicleType] || []).includes(fuel.id as FuelType))
                  .map((fuel) => {
                    const FuelIcon = fuel.icon;
                    const isFuelSel = fuelType === fuel.id;
                    return (
                      <button
                        key={fuel.id}
                        type="button"
                        onClick={() => setFuelType(fuel.id as any)}
                        className={`p-3 text-center rounded border transition-all ${
                          isFuelSel
                            ? 'bg-[#242722] text-white border-[#242722] shadow-xs'
                            : 'bg-[#FAF9F5] text-[#51554D] border-[#2D322B29] hover:bg-white'
                        }`}
                      >
                        <FuelIcon className={`w-4 h-4 mx-auto mb-1 ${isFuelSel ? 'text-[#E8EDE5]' : 'text-[#777C72]'}`} />
                        <span className="block text-[12px] font-bold">{fuel.label}</span>
                        <span className={`text-[9.5px] ${isFuelSel ? 'text-[#E8EDE5]/80' : 'text-[#777C72]'}`}>{fuel.desc}</span>
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* Option B: 4-Wheelers */}
        {transportCategory === 'private' && (
          <div className="space-y-5">
            <div>
              <label className="block text-[12px] font-semibold text-[#242722] mb-2 font-mono uppercase tracking-wider">
                {language === 'HI' ? 'कार बॉडी प्रकार' : 'Car Body Profile'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'suv', name: 'SUV / 4×4', icon: SuvIcon, desc: language === 'HI' ? 'स्कॉर्पियो, थार, सफारी' : 'Scorpio, Thar, Safari' },
                  { id: 'sedan', name: language === 'HI' ? 'सेडान' : 'Sedan', icon: SedanIcon, desc: language === 'HI' ? 'सिटी, डिजायर, वरना' : 'City, Dzire, Verna' },
                  { id: 'hatchback', name: language === 'HI' ? 'हैचबैक' : 'Hatchback', icon: HatchbackIcon, desc: language === 'HI' ? 'स्विफ्ट, i20, टियागो' : 'Swift, i20, Tiago' },
                  { id: 'coupe', name: language === 'HI' ? 'कूपे' : 'Coupe', icon: CoupeIcon, desc: language === 'HI' ? 'स्पोर्ट्स / २-डोर' : 'Sports / 2-Door' },
                ].map((item) => {
                  const IconComp = item.icon;
                  const isSel = vehicleType === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectVehicle(item.id as any)}
                      className={`p-3 rounded border text-left transition-all ${
                        isSel
                          ? 'border-[#496951] bg-[#E8EDE5]/50 shadow-xs ring-1 ring-[#496951]/30'
                          : 'border-[#2D322B29] bg-[#FAF9F5] hover:border-[#2D322B29]/70'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <IconComp className={`w-4 h-4 ${isSel ? 'text-[#304B38]' : 'text-[#777C72]'}`} />
                        {isSel && <span className="font-mono text-[10px] font-bold text-[#304B38]">✓</span>}
                      </div>
                      <p className="text-[13px] font-bold text-[#242722] leading-tight">{item.name}</p>
                      <p className="text-[10px] text-[#777C72] mt-0.5">{item.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fuel Selector for 4-Wheelers */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[12px] font-semibold text-[#242722] font-mono uppercase tracking-wider">
                  {language === 'HI' ? 'ईंधन प्रकार' : 'Fuel Type'}
                </label>
                <span className="font-mono text-[11px] font-bold text-[#304B38] bg-[#E8EDE5] px-2.5 py-1 rounded border border-[#496951]/25">
                  {PRIVATE_VEHICLE_MATRIX[vehicleType]?.[fuelType] ?? 0} g CO₂e/km
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
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
                      className={`py-2 px-1 text-center rounded border transition-all ${
                        isFuelSel
                          ? 'bg-[#242722] text-white border-[#242722] shadow-xs font-bold'
                          : 'bg-[#FAF9F5] text-[#51554D] border-[#2D322B29] hover:bg-white'
                      }`}
                    >
                      <FuelIcon className={`w-3.5 h-3.5 mx-auto mb-1 ${isFuelSel ? 'text-[#E8EDE5]' : 'text-[#777C72]'}`} />
                      <span className="text-[11.5px] block">{fuel.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Option C: Public Transit */}
        {transportCategory === 'transit' && (
          <div>
            <label className="block text-[12px] font-semibold text-[#242722] mb-2 font-mono uppercase tracking-wider">
              {language === 'HI' ? 'ट्रांजिट मोड' : 'Public & Regional Transit Corridor'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'bus', name: language === 'HI' ? 'साझा यूटीसी बस' : 'Shared UTC Bus', factor: '30 g CO₂/pkm', badge: 'Eco', icon: BusIcon, desc: language === 'HI' ? 'रोडवेज बस / पर्वतीय हाईवे' : 'State bus / mountain highway' },
                { id: 'train', name: language === 'HI' ? 'भारतीय रेल (ट्रेन)' : 'Indian Railways (Train)', factor: '18 g CO₂/pkm', badge: 'Lowest', icon: TrainIcon, desc: language === 'HI' ? 'काठगोदाम / ऋषिकेश स्टेशन' : 'Foothill train corridor' },
                { id: 'helicopter', name: language === 'HI' ? 'हिमालयन हेलीकॉप्टर' : 'Himalayan Helicopter', factor: '450 g CO₂/pkm', badge: 'Alpine', icon: HelicopterIcon, desc: language === 'HI' ? 'चार धाम / केदारनाथ शटल' : 'Char Dham / Kedarnath shuttle' },
                { id: 'flight', name: language === 'HI' ? 'रीजनल फ्लाइट' : 'Regional Flight', factor: '180 g CO₂/pkm', badge: 'Aviation', icon: FlightIcon, desc: language === 'HI' ? 'जॉली ग्रांट / पंतनगर' : 'Flight to Dehradun / Pantnagar' },
              ].map((transit) => {
                const TransitIcon = transit.icon;
                const isTransitSel = transitMode === transit.id;
                return (
                  <button
                    key={transit.id}
                    type="button"
                    onClick={() => setTransitMode(transit.id as any)}
                    className={`p-3.5 rounded border text-left flex flex-col justify-between transition-all ${
                      isTransitSel
                        ? 'border-[#496951] bg-[#E8EDE5]/50 shadow-xs ring-1 ring-[#496951]/30'
                        : 'border-[#2D322B29] bg-[#FAF9F5] hover:border-[#2D322B29]/70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <TransitIcon className={`w-4 h-4 ${isTransitSel ? 'text-[#304B38]' : 'text-[#777C72]'}`} />
                        <span className="text-[13px] font-bold text-[#242722]">{transit.name}</span>
                      </div>
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-[#304B38] border border-[#2D322B14]">
                        {transit.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#777C72] mb-2">{transit.desc}</p>
                    <div className="font-mono text-[11px] text-[#304B38] font-bold">
                      {transit.factor}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="border-t border-[#2D322B14]" />

        {/* Passenger Occupancy Stepper */}
        <div className="bg-[#FAF9F5] border border-[#2D322B29] rounded p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#496951]" />
              <p className="text-[13px] font-bold text-[#242722]">
                {language === 'HI' ? 'यात्रियों की संख्या' : 'Passenger Load / Group Size'}
              </p>
              <span className="font-mono text-[10.5px] font-bold px-2 py-0.5 rounded bg-white text-[#304B38] border border-[#2D322B29]">
                {currentLimit.label}
              </span>
            </div>
            <p className="text-[11.5px] text-[#777C72] mt-1">
              {language === 'HI'
                ? 'निजी वाहन का कुल उत्सर्जन सभी यात्रियों में बराबर विभाजित होता है।'
                : 'Vehicle emissions are distributed across all passengers sharing the journey.'}
            </p>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#2D322B14]">
            <button
              type="button"
              disabled={passengers <= currentLimit.min}
              onClick={() => setPassengers((prev) => Math.max(currentLimit.min, prev - 1))}
              className="w-9 h-9 rounded bg-white border border-[#2D322B29] font-bold text-[16px] text-[#242722] disabled:opacity-30 hover:bg-[#F0EEE6] active:scale-95 flex items-center justify-center transition-all"
              aria-label="Decrease travelers"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-mono font-bold text-[14px] text-[#242722] min-w-[90px] text-center">
              {passengers} {language === 'HI' ? 'यात्री' : (passengers === 1 ? 'Traveler' : 'Travelers')}
            </span>
            <button
              type="button"
              disabled={passengers >= currentLimit.max}
              onClick={() => setPassengers((prev) => Math.min(currentLimit.max, prev + 1))}
              className="w-9 h-9 rounded bg-white border border-[#2D322B29] font-bold text-[16px] text-[#242722] disabled:opacity-30 hover:bg-[#F0EEE6] active:scale-95 flex items-center justify-center transition-all"
              aria-label="Increase travelers"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Onboarding Step Footer Action Bar */}
      <div className="pt-4 border-t border-[#2D322B1F] flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => router.push('/calculator/route')}
          className="px-4 py-2.5 rounded border border-[#2D322B29] text-[12.5px] font-semibold text-[#51554D] hover:text-[#242722] hover:bg-[#F0EEE6] transition-all flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'HI' ? '← मार्ग पर वापस' : 'Back to Route'}</span>
        </button>
        <button
          type="button"
          onClick={() => router.push('/calculator/stay')}
          className="button-primary px-6 py-2.5 rounded text-[13px] font-bold flex items-center gap-2"
        >
          <span>{language === 'HI' ? 'ठहराव चुनें (चरण ०३) →' : 'Continue to Stay & Lodging (Step 03) →'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
