'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, Navigation2, Home, Leaf, BarChart3, Check } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { useTrip } from '../../contexts/TripContext';

const STEPS = [
  {
    path: '/calculator/route',
    id: 1,
    titleEn: 'Corridor & Route',
    titleHi: 'मार्ग और ऊंचाई',
    shortEn: 'Route',
    shortHi: 'मार्ग',
    icon: MapPin,
  },
  {
    path: '/calculator/transport',
    id: 2,
    titleEn: 'Transport Method',
    titleHi: 'वाहन का प्रकार',
    shortEn: 'Transport',
    shortHi: 'वाहन',
    icon: Navigation2,
  },
  {
    path: '/calculator/stay',
    id: 3,
    titleEn: 'Stay & Lodging',
    titleHi: 'ठहराव और रातें',
    shortEn: 'Stay',
    shortHi: 'ठहराव',
    icon: Home,
  },
  {
    path: '/calculator/habits',
    id: 4,
    titleEn: 'Eco-Habits',
    titleHi: 'ईको आदतें',
    shortEn: 'Habits',
    shortHi: 'आदतें',
    icon: Leaf,
  },
  {
    path: '/calculator/results',
    id: 5,
    titleEn: 'Footprint Results',
    titleHi: 'कार्बन परिणाम',
    shortEn: 'Results',
    shortHi: 'परिणाम',
    icon: BarChart3,
  },
];

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { language } = useTranslation();
  const { distance, transportMode, fuelType, nights, selectedRoute } = useTrip();

  const currentStepIndex = Math.max(
    0,
    STEPS.findIndex((s) => pathname.startsWith(s.path))
  );
  const currentStepNumber = currentStepIndex + 1;
  const progressPercent = ((currentStepIndex + 1) / STEPS.length) * 100;

  return (
    <div className="w-full max-w-[1180px] 2xl:max-w-[1360px] 3xl:max-w-[1500px] mx-auto space-y-6 sm:space-y-8">
      {/* Onboarding Header & Step Tracker */}
      <div
        className="rounded-lg border p-4 sm:p-5 shadow-xs"
        style={{
          backgroundColor: 'var(--paper-card)',
          borderColor: 'var(--line)',
        }}
      >
        {/* Top Info Bar: Step Progress & Live Telemetry Pill */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-[#2D322B14]">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#E8EDE5] text-[#304B38] border border-[#496951]/25">
                {language === 'HI' ? `चरण 0${currentStepNumber} / 05` : `STEP 0${currentStepNumber} OF 05`}
              </span>
              <span className="font-mono text-[11.5px] uppercase tracking-wider text-[#777C72]">
                {language === 'HI' ? 'उत्तराखंड यात्रा ऑनबोर्डिंग' : 'Uttarakhand Expedition Onboarding'}
              </span>
            </div>
            <h1 className="text-[17px] sm:text-[20px] font-bold text-[#242722] mt-1 tracking-tight">
              {language === 'HI' ? STEPS[currentStepIndex].titleHi : STEPS[currentStepIndex].titleEn}
            </h1>
          </div>

          {/* Quick Context Pill */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#F0EEE6] border border-[#2D322B1F] text-[#51554D]">
              📍 {selectedRoute ? `${selectedRoute.origin.placeName.split('(')[0].trim()} → ${selectedRoute.destination.placeName.split('(')[0].trim()}` : `${distance} km corridor`}
            </span>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#F0EEE6] border border-[#2D322B1F] text-[#304B38] font-bold">
              ⚡ {transportMode.toUpperCase()} ({fuelType})
            </span>
          </div>
        </div>

        {/* Multi-Step Onboarding Wizard Progress Bar */}
        <div className="pt-3">
          <div className="h-1.5 w-full bg-[#E8E6DF] rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-[#496951] rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Step Badges / Links */}
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2 text-center">
            {STEPS.map((step, idx) => {
              const IconComp = step.icon;
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <Link
                  key={step.path}
                  href={step.path}
                  className={`group py-2 px-1 rounded border text-left flex flex-col justify-between transition-all ${
                    isCurrent
                      ? 'bg-white border-[#496951] shadow-xs ring-1 ring-[#496951]/20'
                      : isPast
                      ? 'bg-[#E8EDE5]/50 border-[#496951]/30 hover:bg-[#E8EDE5]'
                      : 'bg-[#FAF9F5] border-[#2D322B14] opacity-75 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-mono text-[10px] font-bold ${isCurrent ? 'text-[#304B38]' : isPast ? 'text-[#496951]' : 'text-[#777C72]'}`}>
                      0{step.id}
                    </span>
                    {isPast ? (
                      <span className="w-3.5 h-3.5 rounded-full bg-[#304B38] text-white flex items-center justify-center text-[9px] font-bold">
                        ✓
                      </span>
                    ) : (
                      <IconComp className={`w-3.5 h-3.5 ${isCurrent ? 'text-[#304B38]' : 'text-[#777C72]'}`} />
                    )}
                  </div>
                  <span className={`text-[11px] sm:text-[12px] font-bold truncate block ${isCurrent ? 'text-[#242722]' : isPast ? 'text-[#304B38]' : 'text-[#777C72]'}`}>
                    <span className="hidden sm:inline">{language === 'HI' ? step.titleHi : step.titleEn}</span>
                    <span className="sm:hidden">{language === 'HI' ? step.shortHi : step.shortEn}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="min-h-[500px]">{children}</div>
    </div>
  );
}
