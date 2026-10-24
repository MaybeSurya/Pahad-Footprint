'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Mountain, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Check if error is ChunkLoadError or stale deployment mismatch
    const isChunkLoadError =
      error?.name === 'ChunkLoadError' ||
      error?.message?.includes('Loading chunk') ||
      error?.message?.includes('Failed to fetch') ||
      error?.message?.includes('Load chunk failed');

    if (typeof window === 'undefined') return;

    if (isChunkLoadError) {
      const lastReload = sessionStorage.getItem('pahad_error_boundary_reload');
      const now = Date.now();
      if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
        sessionStorage.setItem('pahad_error_boundary_reload', String(now));
        // Purge any older Service Worker caches and reload fresh assets
        if (typeof caches !== 'undefined') {
          caches
            .keys()
            .then((names) => {
              return Promise.all(
                names.map((name) => {
                  if (name.includes('v2') || name.includes('footprint')) {
                    return caches.delete(name);
                  }
                })
              );
            })
            .catch(() => {})
            .finally(() => {
              window.location.reload();
            });
        } else {
          window.location.reload();
        }
      }
    }
  }, [error]);

  const handleHardReload = () => {
    if (typeof window === 'undefined') return;

    if (typeof caches !== 'undefined') {
      caches
        .keys()
        .then((names) => {
          return Promise.all(names.map((name) => caches.delete(name)));
        })
        .catch(() => {})
        .finally(() => {
          window.location.reload();
        });
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-12">
      <div className="w-16 h-16 rounded-2xl bg-[#304B38]/10 text-[#304B38] flex items-center justify-center mb-6 border border-[#304B38]/20">
        <Mountain className="w-8 h-8" />
      </div>

      <span className="font-mono text-xs uppercase tracking-wider text-[#B3834D] mb-2 font-semibold">
        Field Guide Navigation Update
      </span>

      <h1 className="text-2xl sm:text-3xl font-bold text-[#242722] mb-3 font-serif">
        Application Updated in the Foothills
      </h1>

      <p className="max-w-md text-sm text-[#51554D] leading-relaxed mb-8">
        A new version of Pahad Footprint has been deployed. Refresh to synchronize all Himalayan telemetry, maps, and route data.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleHardReload}
          className="button-primary px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reload Fresh Application</span>
        </button>

        <button
          type="button"
          onClick={() => reset()}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold border border-[#2D322B29] text-[#242722] hover:bg-[#F0EEE6] transition-colors"
        >
          Try Again
        </button>

        <Link
          href="/"
          className="px-5 py-2.5 rounded-lg text-sm font-semibold border border-[#2D322B29] text-[#51554D] hover:bg-[#F0EEE6] transition-colors flex items-center gap-1.5"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>

      {process.env.NODE_ENV !== 'production' && error?.message && (
        <div className="mt-8 p-4 bg-[#F0EEE6] rounded border border-[#2D322B29] max-w-lg text-left text-xs font-mono text-[#8A5D2E] overflow-x-auto">
          {error.message}
        </div>
      )}
    </div>
  );
}
