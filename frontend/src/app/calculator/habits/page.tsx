'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  ArrowLeft,
  Droplets,
  UtensilsCrossed,
  Leaf,
  CheckCircle2,
  MapPin,
  Car,
  Home,
  ShieldCheck,
} from 'lucide-react';
import { useTranslation } from '../../../contexts/TranslationContext';
import { useTrip } from '../../../contexts/TripContext';

export default function HabitsStepPage() {
  const router = useRouter();
  const { t, language } = useTranslation();
  const {
    habitWater,
    setHabitWater,
    habitFood,
    setHabitFood,
    distance,
    terrain,
    transportMode,
    fuelType,
    passengers,
    nights,
    accommodation,
    selectedRoute,
  } = useTrip();

  const totalDeductions = (habitWater ? 2.0 : 0) + (habitFood ? 3.0 : 0);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Step Header */}
      <div className="pb-3 border-b" style={{ borderColor: 'var(--line)' }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#E8EDE5] text-[#304B38] border border-[#496951]/20">
            {language === 'HI' ? 'चरण ०४' : 'STEP 04'}
          </span>
          <span className="text-[12px] font-mono uppercase tracking-wider text-[#777C72]">
            {language === 'HI' ? 'पर्वतीय संरक्षण एवं ईको आदतें' : 'Mountain Stewardship & Eco-Habits'}
          </span>
        </div>
        <h2 className="text-[22px] sm:text-[28px] font-bold text-[#242722] tracking-tight">
          {language === 'HI' ? 'क्या आप हिमालयी ईको आदतों का पालन करेंगे?' : 'Do you practice leave-no-trace mountain habits?'}
        </h2>
        <p className="text-[13.5px] text-[#51554D] max-w-2xl mt-1 leading-relaxed">
          {language === 'HI'
            ? 'पहाड़ों में पैकेज्ड पानी और गैर-स्थानीय भोजन से प्लास्टिक कचरा और परिवहन उत्सर्जन बढ़ता है। इन आदतों को अपनाकर कार्बन छूट प्राप्त करें।'
            : 'Single-use plastic bottles and imported foods add severe supply-chain transport emissions in the hills. Claim certified deductions for responsible practices.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] gap-6 lg:gap-8 items-start">
        {/* Left: Habit Checkboxes */}
        <div className="journal-card space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#2D322B14]">
            <span className="text-[12px] font-bold text-[#242722] font-mono uppercase tracking-wider">
              {language === 'HI' ? 'प्रमाणित ईको कटौती' : 'Certified Eco Deductions'}
            </span>
            <span className="font-mono text-[11px] font-bold text-[#304B38] bg-[#E8EDE5] px-2.5 py-0.5 rounded border border-[#496951]/25">
              −{totalDeductions.toFixed(1)} kg CO₂e / person
            </span>
          </div>

          <label
            className={`flex items-start gap-3.5 p-4 rounded border cursor-pointer transition-all ${
              habitWater
                ? 'bg-[#E8EDE5]/70 border-[#496951] shadow-xs ring-1 ring-[#496951]/20'
                : 'bg-[#FAF9F5] border-[#2D322B29] hover:bg-white'
            }`}
          >
            <input
              type="checkbox"
              checked={habitWater}
              onChange={(e) => setHabitWater(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded accent-[#496951] cursor-pointer flex-shrink-0"
            />
            <div className="p-1.5 rounded bg-[#E8EDE5] text-[#304B38] flex-shrink-0">
              <Droplets className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-[13.5px] font-bold text-[#242722]">
                  {t('calculator.habitWater')}
                </p>
                <span className="font-mono text-[11.5px] font-bold text-[#304B38] bg-[#E8EDE5] px-2 py-0.5 rounded border border-[#496951]/25">
                  −2.0 kg/p
                </span>
              </div>
              <p className="text-[12px] text-[#51554D] mt-1 leading-relaxed">
                {t('calculator.habitWaterDesc')}
              </p>
            </div>
          </label>

          <label
            className={`flex items-start gap-3.5 p-4 rounded border cursor-pointer transition-all ${
              habitFood
                ? 'bg-[#E8EDE5]/70 border-[#496951] shadow-xs ring-1 ring-[#496951]/20'
                : 'bg-[#FAF9F5] border-[#2D322B29] hover:bg-white'
            }`}
          >
            <input
              type="checkbox"
              checked={habitFood}
              onChange={(e) => setHabitFood(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded accent-[#496951] cursor-pointer flex-shrink-0"
            />
            <div className="p-1.5 rounded bg-[#E8EDE5] text-[#304B38] flex-shrink-0">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-[13.5px] font-bold text-[#242722]">
                  {t('calculator.habitFood')}
                </p>
                <span className="font-mono text-[11.5px] font-bold text-[#304B38] bg-[#E8EDE5] px-2 py-0.5 rounded border border-[#496951]/25">
                  −3.0 kg/p
                </span>
              </div>
              <p className="text-[12px] text-[#51554D] mt-1 leading-relaxed">
                {t('calculator.habitFoodDesc')}
              </p>
            </div>
          </label>
        </div>

        {/* Right: Pre-Flight Trip Summary Review Card */}
        <div className="journal-card bg-[#FAF9F5] space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#2D322B14]">
            <ShieldCheck className="w-4 h-4 text-[#304B38]" />
            <h3 className="text-[13px] font-bold text-[#242722] font-mono uppercase tracking-wider">
              {language === 'HI' ? 'यात्रा कॉन्फ़िगरेशन सारांश' : 'Expedition Configuration'}
            </h3>
          </div>

          <div className="space-y-3 font-mono text-[11.5px]">
            <div className="flex justify-between items-center py-1.5 border-b border-[#2D322B0F]">
              <span className="text-[#777C72]">Route Corridor:</span>
              <span className="font-bold text-[#242722] text-right truncate max-w-[200px]">
                {selectedRoute ? `${selectedRoute.origin.placeName.split('(')[0].trim()} → ${selectedRoute.destination.placeName.split('(')[0].trim()}` : 'Custom Corridor'}
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-[#2D322B0F]">
              <span className="text-[#777C72]">Distance & Climb:</span>
              <span className="font-bold text-[#242722]">
                {distance} km ({terrain === 'high_altitude' ? '1.40× High Peak' : terrain === 'mid_hills' ? '1.25× Mid Hill' : '1.00× Baseline'})
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-[#2D322B0F]">
              <span className="text-[#777C72]">Vehicle & Fuel:</span>
              <span className="font-bold text-[#304B38]">
                {transportMode.toUpperCase()} ({fuelType})
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-[#2D322B0F]">
              <span className="text-[#777C72]">Occupancy:</span>
              <span className="font-bold text-[#242722]">
                {passengers} {passengers === 1 ? 'Traveler' : 'Travelers'}
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-[#2D322B0F]">
              <span className="text-[#777C72]">Stay Duration:</span>
              <span className="font-bold text-[#8A5D2E]">
                {nights} nights · {accommodation.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-[#777C72]">Stewardship Deductions:</span>
              <span className="font-bold text-[#304B38]">
                −{totalDeductions.toFixed(1)} kg CO₂e / p
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding Step Footer Action Bar */}
      <div className="pt-4 border-t border-[#2D322B1F] flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => router.push('/calculator/stay')}
          className="px-4 py-2.5 rounded border border-[#2D322B29] text-[12.5px] font-semibold text-[#51554D] hover:text-[#242722] hover:bg-[#F0EEE6] transition-all flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'HI' ? '← ठहराव पर वापस' : 'Back to Stay'}</span>
        </button>
        <button
          type="button"
          onClick={() => router.push('/calculator/results')}
          className="button-primary px-6 py-2.5 rounded text-[13px] font-bold flex items-center gap-2"
        >
          <span>{language === 'HI' ? 'कार्बन परिणाम देखें (चरण ०५) →' : 'Calculate Carbon Footprint (Step 05) →'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
