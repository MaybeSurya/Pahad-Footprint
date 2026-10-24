'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, WifiOff, Check, X, Mountain, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext';
import { flushOfflineQueue, requestBackgroundSync, getPendingTripsCount } from '../lib/offlineQueue';

export function PWARegister() {
  const { language } = useTranslation();
  const [isOffline, setIsOffline] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [syncToast, setSyncToast] = useState<{ show: boolean; message: string } | null>(null);

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
            const cache = await caches.open('pahad-footprint-v3.2');
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
          .then(async (reg) => {
            console.log('[Pahad PWA] Service Worker active with scope:', reg.scope);
            // Proactively check for updated worker on page load
            reg.update().catch(() => {});
            // Warm cache with core routes during idle periods
            prewarmOfflineCache();

            // Register W3C background sync capability
            try {
              if ('sync' in reg && typeof (reg as any).sync?.register === 'function') {
                await (reg as any).sync.register('pahad-sync-trips');
                console.log('[Pahad PWA] Background Sync registered: pahad-sync-trips');
              }
              if ('periodicSync' in reg && typeof (reg as any).periodicSync?.register === 'function') {
                await (reg as any).periodicSync.register('pahad-periodic-sync', {
                  minInterval: 12 * 60 * 60 * 1000,
                });
              }
            } catch (syncErr) {
              console.warn('[Pahad PWA] Background sync registration note:', syncErr);
            }
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

    // Check offline pending trips queue count
    getPendingTripsCount().then(setPendingCount).catch(() => {});

    // Listen to messages from Service Worker (e.g. background sync completion)
    const handleSWMessage = (event: MessageEvent) => {
      if (event.data?.type === 'PAHAD_SYNC_COMPLETED') {
        setSyncToast({
          show: true,
          message: event.data.message || `Synchronized ${event.data.count} trip(s) recorded offline.`,
        });
        getPendingTripsCount().then(setPendingCount).catch(() => {});
        setTimeout(() => setSyncToast(null), 6000);
      }
    };

    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleSWMessage);
    }

    // Listen for custom event fired when client flushes queue
    const handleCustomSync = (event: any) => {
      const { synced } = event.detail || {};
      if (synced > 0) {
        setSyncToast({
          show: true,
          message: `Synchronized ${synced} trip(s) recorded offline in the mountains.`,
        });
        getPendingTripsCount().then(setPendingCount).catch(() => {});
        setTimeout(() => setSyncToast(null), 6000);
      }
    };
    window.addEventListener('pahad:sync-completed', handleCustomSync);

    // 2. Track online / offline events in the hills & trigger background sync
    const handleOnline = () => {
      setIsOffline(false);
      // Flush offline queue and schedule sync
      flushOfflineQueue()
        .then(({ synced }) => {
          if (synced > 0) {
            setSyncToast({
              show: true,
              message: `Synchronized ${synced} trip(s) recorded offline in the mountains.`,
            });
            setTimeout(() => setSyncToast(null), 6000);
          }
          getPendingTripsCount().then(setPendingCount).catch(() => {});
        })
        .catch(() => {});
      requestBackgroundSync().catch(() => {});
    };

    const handleOffline = () => {
      setIsOffline(true);
      getPendingTripsCount().then(setPendingCount).catch(() => {});
    };

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
      window.removeEventListener('pahad:sync-completed', handleCustomSync);
      if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleSWMessage);
      }
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
      {/* Background Sync Success Toast Banner */}
      <AnimatePresence>
        {syncToast && syncToast.show && (
          <motion.div
            initial={{ opacity: 0, y: -25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -25, scale: 0.95 }}
            className="fixed top-20 right-4 sm:right-8 z-50 px-4 py-3 rounded-lg shadow-elevated border flex items-center gap-3 backdrop-blur-md bg-[#243629] text-white border-[#304B38]"
          >
            <div className="w-6 h-6 rounded-full bg-[#304B38] flex items-center justify-center flex-shrink-0 text-[#85C49A]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="text-[12.5px] font-sans">
              <span className="font-bold block text-white">
                {language === 'HI' ? 'डेटा समन्वयित (Synced)' : 'Himalayan Sync Complete'}
              </span>
              <span className="text-[#C8D6C9] text-[11.5px]">{syncToast.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setSyncToast(null)}
              className="text-[#96A799] hover:text-white ml-2 p-1"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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
            {pendingCount > 0 && (
              <span className="bg-[#B3834D] text-[#1E211D] text-[10px] font-bold px-1.5 py-0.5 rounded-full font-mono">
                {pendingCount} {pendingCount === 1 ? 'trip queued' : 'trips queued'}
              </span>
            )}
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
