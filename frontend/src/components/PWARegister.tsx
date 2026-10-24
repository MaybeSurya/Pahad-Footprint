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
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const prewarmOfflineCache = async () => {
        if (!navigator.onLine || typeof window === 'undefined' || typeof caches === 'undefined') return;
        const routes = [
          '/',
          '/calculator',
          '/calculator/transport',
          '/calculator/stay',
          '/calculator/habits',
          '/calculator/results',
          '/restoration',
          '/verify',
          '/methodology',
          '/faq',
          '/offline.html',
        ];

        const runWarm = async () => {
          try {
            const cache = await caches.open('pahad-footprint-v3.1');
            for (const r of routes) {
              const match = await cache.match(r);
              if (!match) {
                const res = await fetch(r);
                if (res && res.status === 200) {
                  await cache.put(r, res);
                }
              }
            }
            console.log('[Pahad PWA] All expedition routes pre-warmed for 100% offline mountain navigation.');
          } catch {
            // Silently ignore background warm errors
          }
        };

        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(runWarm, { timeout: 4000 });
        } else {
          setTimeout(runWarm, 2000);
        }
      };

      const registerSW = () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('[Pahad PWA] Service Worker active with scope:', reg.scope);
            // Proactively check for updated worker on page load
            reg.update().catch(() => {});
            // Warm cache with core routes during idle periods
            prewarmOfflineCache();
          })
          .catch((err) => {
            console.warn('[Pahad PWA] Service Worker registration note:', err);
          });
      };

      if (document.readyState === 'complete') {
        registerSW();
      } else {
        window.addEventListener('load', registerSW);
      }
    }

    // 2. Track online / offline events in the hills & trigger background sync
    const syncOfflineTrips = async () => {
      try {
        const stored = localStorage.getItem('pahad_offline_trip_logs');
        if (!stored) return;
        const queue = JSON.parse(stored);
        if (!Array.isArray(queue) || queue.length === 0) return;

        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const remaining: any[] = [];

        for (const item of queue) {
          try {
            const res = await fetch(`${API_BASE_URL}/trips/log`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item.data),
            });
            if (!res.ok) remaining.push(item);
          } catch {
            remaining.push(item);
          }
        }

        if (remaining.length === 0) {
          localStorage.removeItem('pahad_offline_trip_logs');
        } else {
          localStorage.setItem('pahad_offline_trip_logs', JSON.stringify(remaining));
        }
      } catch {
        // Ignore background sync errors
      }
    };

    const handleOnline = () => {
      setIsOffline(false);
      syncOfflineTrips();
    };
    const handleOffline = () => setIsOffline(true);

    if (typeof navigator !== 'undefined') {
      setIsOffline(!navigator.onLine);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 3. Catch PWA installation prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
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

    // 4. Automatic recovery for ChunkLoadError (caused when server redeploys and client requests old chunks)
    const handleChunkLoadError = (event: any) => {
      const errorMsg = String(
        event?.message ||
        event?.reason?.message ||
        event?.reason ||
        event?.error?.message ||
        ''
      );

      const isChunkError =
        errorMsg.includes('ChunkLoadError') ||
        errorMsg.includes('Loading chunk') ||
        errorMsg.includes('Failed to fetch dynamically imported module');

      if (isChunkError) {
        console.warn('[Pahad PWA] Stale chunk error detected post-deployment. Executing clean auto-recovery...');
        const lastReload = sessionStorage.getItem('pahad_chunk_reload_stamp');
        const now = Date.now();
        // Prevent infinite reload loop by throttling to 1 reload every 12 seconds
        if (!lastReload || now - parseInt(lastReload, 10) > 12000) {
          sessionStorage.setItem('pahad_chunk_reload_stamp', String(now));

          // Purge stale caches and trigger hard refresh
          if (typeof caches !== 'undefined') {
            caches.keys().then((names) => {
              return Promise.all(
                names.map((name) => {
                  if (name.includes('v2') || name.includes('footprint')) {
                    return caches.delete(name);
                  }
                })
              );
            }).catch(() => {}).finally(() => {
              window.location.reload();
            });
          } else {
            window.location.reload();
          }
        }
      }
    };

    window.addEventListener('error', handleChunkLoadError);
    window.addEventListener('unhandledrejection', handleChunkLoadError);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('error', handleChunkLoadError);
      window.removeEventListener('unhandledrejection', handleChunkLoadError);
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
                ? '⛰️ पर्वतीय ऑफ़लाइन मोड — डिवाइस से पूर्णतः कार्यरत'
                : '⛰️ Offline Mountain Mode — Fully functional on device.'}
            </span>
            <a
              href="/offline.html"
              className="text-[11.5px] font-mono font-bold text-[#E8EDE5] underline hover:text-white ml-1"
            >
              {language === 'HI' ? 'फील्ड गाइड →' : 'Field Guide →'}
            </a>
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
