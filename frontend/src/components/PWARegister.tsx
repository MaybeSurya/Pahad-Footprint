'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, WifiOff, Check, X, Mountain } from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext';

export function PWARegister() {
  const { language } = useTranslation();
  const [isOffline, setIsOffline] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker for offline PWA capabilities
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('[Pahad PWA] Service Worker registered with scope:', reg.scope);
          })
          .catch((err) => {
            console.warn('[Pahad PWA] Service Worker registration notice:', err);
          });
      });
    }

    // 2. Track online / offline events in the hills
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    setIsOffline(!navigator.onLine);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 3. Catch PWA installation prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show install recommendation if not already in standalone mode
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      if (!isStandalone) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    window.addEventListener('appinstalled', () => {
      setInstalled(true);
      setShowInstallBanner(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <>
      {/* Offline Mountain Mode Pill Banner */}
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-18 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full shadow-elevated border flex items-center gap-2 backdrop-blur-md"
            style={{
              backgroundColor: 'var(--ink)',
              borderColor: 'var(--line-strong)',
              color: '#FFFFFF',
            }}
          >
            <WifiOff className="w-3.5 h-3.5 text-[#B3834D] flex-shrink-0" />
            <span className="text-[12px] font-mono font-medium">
              {language === 'HI'
                ? '⛰️ पर्वतीय ऑफ़लाइन मोड — डिवाइस कैश से पूरी तरह कार्यरत'
                : '⛰️ Offline Hill Mode — Operating 100% from Local Device Cache'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PWA Install App Prompt Banner */}
      <AnimatePresence>
        {showInstallBanner && !installed && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 p-4 rounded-lg shadow-elevated border bg-[#F7F6F0] border-[#2D322B29]"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-[#304B38] text-white flex items-center justify-center">
                  <Mountain className="w-4 h-4" />
                </div>
                <h4 className="text-[13px] font-bold text-[#242722]">
                  {language === 'HI' ? 'ऑफ़लाइन ऐप इंस्टॉल करें' : 'Install Offline Field Guide'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowInstallBanner(false)}
                className="text-[#777C72] hover:text-[#242722] p-0.5"
                aria-label="Dismiss install banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11.5px] text-[#51554D] leading-relaxed mb-3">
              {language === 'HI'
                ? 'पहाड़ों में बिना इंटरनेट यात्रा करते समय कार्बन गणना और वेधशाला मानचित्रों का निर्बाध उपयोग करने के लिए ऐप इंस्टॉल करें।'
                : 'Install Pahad Footprint on your device for uninterrupted offline carbon calculations, elevation physics, and maps in remote Uttarakhand valleys.'}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleInstallClick}
                className="button-primary flex-1 py-2 px-3 text-[12px] font-bold rounded flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{language === 'HI' ? 'इंस्टॉल करें' : 'Install App'}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowInstallBanner(false)}
                className="py-2 px-3 text-[12px] rounded border border-[#2D322B29] text-[#51554D] hover:bg-[#F0EEE6]"
              >
                {language === 'HI' ? 'बाद में' : 'Later'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
