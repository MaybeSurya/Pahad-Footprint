'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  BookmarkCheck,
  CheckCircle2,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from '../../../contexts/TranslationContext';
import { useTrip } from '../../../contexts/TripContext';
import { CalculationResults } from '../../../components/CalculationResults';
import { EcoSwapCard } from '../../../components/EcoSwapCard';
import { RestorationPledgeBox } from '../../../components/RestorationPledgeBox';
import { OpenMapView } from '../../../components/OpenMapView';
import { logTripRecord, getStoredSession } from '../../../lib/api';

export default function ResultsStepPage() {
  const router = useRouter();
  const { t, language } = useTranslation();
  const {
    calcResult,
    currentInput,
    selectedRoute,
    distance,
    terrain,
    transportMode,
    passengers,
    nights,
    accommodation,
    resetTrip,
  } = useTrip();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSaveTrip = async () => {
    if (!calcResult) return;
    setIsSaving(true);
    try {
      const session = getStoredSession();
      const routeName = selectedRoute
        ? `${selectedRoute.origin.placeName.split('(')[0].trim()} → ${selectedRoute.destination.placeName.split('(')[0].trim()} (${selectedRoute.roundTripKm} km)`
        : `Uttarakhand Mountain Corridor (${distance} km)`;

      await logTripRecord(
        {
          routeName,
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

  const handleStartOver = () => {
    resetTrip();
    router.push('/calculator/route');
  };

  return (
    <div className="space-y-6 sm:space-y-8">
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

      {/* Step Header */}
      <div className="pb-3 border-b" style={{ borderColor: 'var(--line)' }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#E8EDE5] text-[#304B38] border border-[#496951]/20">
            {language === 'HI' ? 'चरण ०५' : 'STEP 05'}
          </span>
          <span className="text-[12px] font-mono uppercase tracking-wider text-[#777C72]">
            {language === 'HI' ? 'अंतिम टेलीमेट्री एवं कार्बन पदचिह्न' : 'Reconciled Mountain Footprint'}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-[22px] sm:text-[28px] font-bold text-[#242722] tracking-tight">
              {language === 'HI' ? 'आपकी यात्रा का पर्यावरणीय लेखा' : 'Expedition Environmental Accounting'}
            </h2>
            <p className="text-[13.5px] text-[#51554D] max-w-2xl mt-1 leading-relaxed">
              {language === 'HI'
                ? 'ऊंचाई चढ़ाई गुणक, चयनित वाहन और आवास के आधार पर पूर्ण कार्बन विश्लेषण नीचे प्रस्तुत है।'
                : 'Complete carbon telemetry factoring mountain road curvature, altitude elevation gradients, vehicle emissions, and certified eco-habits.'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleStartOver}
              className="px-3.5 py-1.5 rounded border border-[#2D322B29] text-[12px] font-mono font-bold text-[#51554D] hover:text-[#242722] hover:bg-[#F0EEE6] transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'HI' ? 'नई यात्रा शुरू करें' : 'Start Over'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Results Layout */}
      {calcResult ? (
        <div className="space-y-6">
          {/* Visual Route Corridor Map */}
          {selectedRoute && (
            <div className="journal-card p-0 overflow-hidden">
              <div className="p-3 border-b bg-[#FAF9F5] flex items-center justify-between" style={{ borderColor: 'var(--line)' }}>
                <span className="text-[12px] font-bold text-[#242722]">
                  {selectedRoute.origin.placeName.split('(')[0].trim()} ➔ {selectedRoute.destination.placeName.split('(')[0].trim()}
                </span>
                <span className="text-[10px] font-mono text-[#304B38] font-bold">
                  {selectedRoute.roundTripKm} km round trip · {selectedRoute.terrainZone.toUpperCase()}
                </span>
              </div>
              <OpenMapView route={selectedRoute} />
            </div>
          )}

          {/* Results Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] gap-6 lg:gap-8 items-start">
            {/* Primary Calculations & Charts */}
            <div className="space-y-6">
              <CalculationResults result={calcResult} input={currentInput} />
            </div>

            {/* Eco-Swap Alternative & Tree Pledge Box */}
            <div className="space-y-6">
              <EcoSwapCard ecoSwap={calcResult.ecoSwap} currentPerPerson={calcResult.perPersonCo2e} />

              <RestorationPledgeBox
                saplings={calcResult.suggestedSaplings}
                onPledgeSuccess={() => showToast('🌿 Restoration pledge logged to Van Panchayat registry!')}
              />

              {/* Action Button: Save to Registry */}
              <button
                type="button"
                onClick={handleSaveTrip}
                disabled={isSaving}
                className="w-full py-4 px-5 button-primary font-bold text-[14px] rounded transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <BookmarkCheck className="w-4 h-4" />
                <span>
                  {isSaving
                    ? (language === 'HI' ? 'सहेज रहे हैं...' : 'Saving to Registry...')
                    : t('calculator.saveTrip')}
                </span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-[#777C72] font-mono text-[13px]">
          Calculating carbon telemetry...
        </div>
      )}

      {/* Onboarding Step Footer Action Bar */}
      <div className="pt-4 border-t border-[#2D322B1F] flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => router.push('/calculator/habits')}
          className="px-4 py-2.5 rounded border border-[#2D322B29] text-[12.5px] font-semibold text-[#51554D] hover:text-[#242722] hover:bg-[#F0EEE6] transition-all flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'HI' ? '← आदतें बदलें' : 'Back to Eco-Habits'}</span>
        </button>
        <button
          type="button"
          onClick={() => router.push('/calculator/route')}
          className="px-4 py-2.5 rounded border border-[#2D322B29] text-[12.5px] font-semibold text-[#304B38] bg-[#E8EDE5] hover:bg-[#E8EDE5]/80 transition-all flex items-center gap-1.5 font-mono"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{language === 'HI' ? 'मार्ग संपादित करें (चरण ०१)' : 'Edit Route Corridor (Step 01)'}</span>
        </button>
      </div>
    </div>
  );
}
