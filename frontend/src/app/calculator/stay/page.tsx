'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  ArrowLeft,
  CalendarDays,
  Hotel,
  Home,
  Tent,
  Flame,
  Leaf,
} from 'lucide-react';
import { useTranslation } from '../../../contexts/TranslationContext';
import { useTrip } from '../../../contexts/TripContext';

export default function StayStepPage() {
  const router = useRouter();
  const { t, language } = useTranslation();
  const { nights, setNights, accommodation, setAccommodation } = useTrip();

  const stayOptions = [
    {
      id: 'luxury',
      name: t('calculator.stayLuxuryResort'),
      intensity: '24.0 kg CO₂e / night',
      kgNum: 24.0,
      icon: Flame,
      eco: false,
      desc: language === 'HI' ? 'सेंट्रल हीटिंग, गर्म पानी, बैकअप जनरेटर' : 'Central heating, generator backup, full amenities',
    },
    {
      id: 'hotel',
      name: t('calculator.stayStandardHotel'),
      intensity: '9.0 kg CO₂e / night',
      kgNum: 9.0,
      icon: Hotel,
      eco: false,
      desc: language === 'HI' ? 'मानक होटल कमरा, ग्रिड बिजली, गीजर' : 'Standard room, grid power, on-demand geyser',
    },
    {
      id: 'homestay',
      name: t('calculator.stayPahadi'),
      intensity: '6.0 kg CO₂e / night',
      kgNum: 6.0,
      icon: Home,
      eco: true,
      desc: language === 'HI' ? 'सौर ऊर्जा, स्थानीय मौसमी भोजन, कम पानी' : 'Solar water heater, local meals, low resource intensity',
    },
    {
      id: 'camp',
      name: t('calculator.stayEcoCamp'),
      intensity: '3.5 kg CO₂e / night',
      kgNum: 3.5,
      icon: Tent,
      eco: true,
      desc: language === 'HI' ? 'अल्पतम बिजली, सोलर लालटेन, अल्प पदचिह्न' : 'Minimal electricity, solar lanterns, alpine leave-no-trace',
    },
  ];

  const currentOption = stayOptions.find((o) => o.id === accommodation) || stayOptions[1];
  const totalStayFootprint = (nights * currentOption.kgNum).toFixed(1);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Step Header */}
      <div className="pb-3 border-b" style={{ borderColor: 'var(--line)' }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#E8EDE5] text-[#304B38] border border-[#496951]/20">
            {language === 'HI' ? 'चरण ०३' : 'STEP 03'}
          </span>
          <span className="text-[12px] font-mono uppercase tracking-wider text-[#777C72]">
            {language === 'HI' ? 'ठहराव एवं आवास प्रोफाइल' : 'Lodging Profile & Duration'}
          </span>
        </div>
        <h2 className="text-[22px] sm:text-[28px] font-bold text-[#242722] tracking-tight">
          {language === 'HI' ? 'पहाड़ों में आप कहाँ और कितने दिन ठहरेंगे?' : 'Where will you stay in the mountains?'}
        </h2>
        <p className="text-[13.5px] text-[#51554D] max-w-2xl mt-1 leading-relaxed">
          {language === 'HI'
            ? 'पहाड़ी आवासों की ऊर्जा व पानी खपत उनके प्रकार पर निर्भर करती है। होमस्टे और कैंप्स रिसॉर्ट्स की तुलना में ७५% कम कार्बन उत्सर्जित करते हैं।'
            : 'Mountain accommodation footprint varies widely with heating and water heating. Pahadi homestays and eco-camps emit up to 75% less CO₂e than heated resorts.'}
        </p>
      </div>

      <div className="journal-card space-y-6">
        {/* Stay Duration Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="nights-slider" className="text-[13px] font-bold text-[#242722] flex items-center gap-1.5 font-mono uppercase tracking-wider">
              <CalendarDays className="w-4 h-4 text-[#496951]" />
              {t('calculator.durationStay')}
            </label>
            <span className="font-mono text-[12px] font-bold px-3 py-1 bg-[#F1EADD] border border-[#B3834D]/30 rounded text-[#8A5D2E]">
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
            className="w-full h-2 rounded-full cursor-pointer bg-[#E4E1D8] accent-[#B3834D]"
          />
          <div className="flex justify-between text-[11px] text-[#777C72] mt-1 font-mono">
            <span>1 {language === 'HI' ? 'रात' : 'Night'}</span>
            <span>7 {language === 'HI' ? 'रातें' : 'Nights'}</span>
            <span>14 {language === 'HI' ? 'रातें' : 'Nights'}</span>
          </div>
        </div>

        <div className="border-t border-[#2D322B14]" />

        {/* Accommodation Selection Cards */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-[12px] font-semibold text-[#242722] font-mono uppercase tracking-wider">
              {t('calculator.stayType')}
            </label>
            <span className="font-mono text-[11px] font-bold text-[#304B38] bg-[#E8EDE5] px-2.5 py-0.5 rounded border border-[#496951]/25">
              Est. ~{totalStayFootprint} kg CO₂e / person
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {stayOptions.map((item) => {
              const IconComponent = item.icon;
              const isSelected = accommodation === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setAccommodation(item.id as any)}
                  className={`p-4 rounded border text-left flex flex-col justify-between transition-all ${
                    isSelected
                      ? item.eco
                        ? 'border-[#496951] bg-[#E8EDE5]/70 shadow-xs ring-1 ring-[#496951]/30'
                        : 'border-[#B3834D] bg-[#F1EADD]/50 shadow-xs ring-1 ring-[#B3834D]/30'
                      : 'border-[#2D322B29] bg-[#FAF9F5] hover:border-[#2D322B29]/70'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <IconComponent className={`w-4 h-4 ${isSelected ? (item.eco ? 'text-[#304B38]' : 'text-[#8A5D2E]') : 'text-[#777C72]'}`} />
                        <span className="text-[13.5px] font-bold text-[#242722]">{item.name}</span>
                      </div>
                      {item.eco ? (
                        <span className="font-mono text-[9.5px] font-bold px-2 py-0.5 rounded bg-white text-[#304B38] border border-[#496951]/30 flex items-center gap-1">
                          <Leaf className="w-2.5 h-2.5" />
                          <span>ECO</span>
                        </span>
                      ) : (
                        isSelected && <span className="font-mono text-[10px] font-bold text-[#8A5D2E]">✓</span>
                      )}
                    </div>
                    <p className="text-[11.5px] text-[#51554D] leading-relaxed mb-3">{item.desc}</p>
                  </div>
                  <div className="pt-2 border-t border-[#2D322B14] flex items-center justify-between font-mono text-[11px]">
                    <span className={item.eco ? 'text-[#304B38] font-bold' : 'text-[#8A5D2E] font-bold'}>
                      {item.intensity}
                    </span>
                    <span className="text-[#777C72]">
                      ({nights} {nights === 1 ? 'night' : 'nights'} = {(nights * item.kgNum).toFixed(1)} kg)
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Onboarding Step Footer Action Bar */}
      <div className="pt-4 border-t border-[#2D322B1F] flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => router.push('/calculator/transport')}
          className="px-4 py-2.5 rounded border border-[#2D322B29] text-[12.5px] font-semibold text-[#51554D] hover:text-[#242722] hover:bg-[#F0EEE6] transition-all flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'HI' ? '← वाहन पर वापस' : 'Back to Transport'}</span>
        </button>
        <button
          type="button"
          onClick={() => router.push('/calculator/habits')}
          className="button-primary px-6 py-2.5 rounded text-[13px] font-bold flex items-center gap-2"
        >
          <span>{language === 'HI' ? 'ईको आदतें (चरण ०४) →' : 'Continue to Eco-Habits (Step 04) →'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
