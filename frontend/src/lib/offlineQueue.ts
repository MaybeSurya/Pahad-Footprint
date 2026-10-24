// Pahad Footprint — Himalayan Expedition Offline Queue & Background Sync
// Uses IndexedDB for background sync accessibility from Service Worker threads,
// with dual-write fallback to localStorage and multi-layer reconnection dispatch.

const DB_NAME = 'pahad_offline_db';
const DB_VERSION = 1;
const STORE_NAME = 'sync_trips';
const LS_FALLBACK_KEY = 'pahad_offline_trip_logs';

export interface OfflineTripItem {
  id: string;
  data: any;
  token?: string;
  timestamp: string;
}

/**
 * Open or initialize the IndexedDB store
 */
export function openOfflineDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB not supported in current environment'));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Persist trip in offline queue (IndexedDB + localStorage) and request background sync
 */
export async function saveOfflineTrip(data: any, token?: string): Promise<string> {
  const id = `offline_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const item: OfflineTripItem = {
    id,
    data,
    token,
    timestamp: new Date().toISOString(),
  };

  // 1. Dual-write to localStorage for instant UI access
  try {
    if (typeof localStorage !== 'undefined') {
      const existing = localStorage.getItem(LS_FALLBACK_KEY);
      const queue: OfflineTripItem[] = existing ? JSON.parse(existing) : [];
      queue.push(item);
      localStorage.setItem(LS_FALLBACK_KEY, JSON.stringify(queue));
    }
  } catch (err) {
    console.warn('[OfflineQueue] LocalStorage fallback write note:', err);
  }

  // 2. Write to IndexedDB for Service Worker thread background sync access
  try {
    const db = await openOfflineDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(item);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('[OfflineQueue] IndexedDB write note:', err);
  }

  // 3. Register Background Sync with Service Worker
  await requestBackgroundSync();

  return id;
}

/**
 * Retrieve all pending trips from IndexedDB or localStorage
 */
export async function getOfflineTrips(): Promise<OfflineTripItem[]> {
  try {
    const db = await openOfflineDB();
    const trips = await new Promise<OfflineTripItem[]>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });

    if (trips.length > 0) return trips;
  } catch {
    // Fall back to localStorage
  }

  try {
    if (typeof localStorage !== 'undefined') {
      const existing = localStorage.getItem(LS_FALLBACK_KEY);
      if (existing) {
        return JSON.parse(existing);
      }
    }
  } catch {}

  return [];
}

/**
 * Remove a successfully synced trip
 */
export async function removeOfflineTrip(id: string): Promise<void> {
  // Remove from IndexedDB
  try {
    const db = await openOfflineDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {}

  // Remove from localStorage
  try {
    if (typeof localStorage !== 'undefined') {
      const existing = localStorage.getItem(LS_FALLBACK_KEY);
      if (existing) {
        const queue: OfflineTripItem[] = JSON.parse(existing);
        const filtered = queue.filter((item) => item.id !== id);
        if (filtered.length === 0) {
          localStorage.removeItem(LS_FALLBACK_KEY);
        } else {
          localStorage.setItem(LS_FALLBACK_KEY, JSON.stringify(filtered));
        }
      }
    }
  } catch {}
}

/**
 * Get count of pending offline trips waiting to be synced
 */
export async function getPendingTripsCount(): Promise<number> {
  const items = await getOfflineTrips();
  return items.length;
}

/**
 * Register Background Sync with Service Worker SyncManager
 */
export async function requestBackgroundSync(): Promise<boolean> {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const reg = await navigator.serviceWorker.ready;

    // Check W3C Background Sync API
    if ('sync' in reg && typeof (reg as any).sync?.register === 'function') {
      await (reg as any).sync.register('pahad-sync-trips');
      console.log('[OfflineQueue] Background Sync successfully registered with tag: pahad-sync-trips');
      return true;
    }

    // Check Periodic Background Sync API
    if ('periodicSync' in reg && typeof (reg as any).periodicSync?.register === 'function') {
      try {
        await (reg as any).periodicSync.register('pahad-periodic-sync', {
          minInterval: 12 * 60 * 60 * 1000, // 12 hours
        });
      } catch {}
    }

    // Fallback: Notify active Service Worker to attempt sync if online
    if (reg.active) {
      reg.active.postMessage({ type: 'TRIGGER_SYNC' });
    }
    return false;
  } catch (err) {
    console.warn('[OfflineQueue] Service Worker sync registration note:', err);
    return false;
  }
}

/**
 * Flush all pending trips to backend API once connection is stable
 */
export async function flushOfflineQueue(): Promise<{ synced: number; remaining: number }> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    const count = await getPendingTripsCount();
    return { synced: 0, remaining: count };
  }

  const items = await getOfflineTrips();
  if (items.length === 0) {
    return { synced: 0, remaining: 0 };
  }

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  let synced = 0;
  let remaining = 0;

  for (const item of items) {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (item.token) headers['Authorization'] = `Bearer ${item.token}`;

      const res = await fetch(`${API_BASE_URL}/trips/log`, {
        method: 'POST',
        headers,
        body: JSON.stringify(item.data),
        signal: AbortSignal.timeout(6000),
      });

      if (res.ok) {
        await removeOfflineTrip(item.id);
        synced++;
      } else {
        remaining++;
      }
    } catch {
      remaining++;
    }
  }

  if (synced > 0 && typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('pahad:sync-completed', {
        detail: { synced, remaining },
      })
    );
  }

  return { synced, remaining };
}
