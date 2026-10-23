'use client';

import React, { useEffect, useRef, useState, useId } from 'react';
import { MountainSnow, Navigation, Layers } from 'lucide-react';
import { OpenMapRouteResult } from '../lib/openmaps';
import { useTranslation } from '../contexts/TranslationContext';

interface OpenMapViewProps {
  route: OpenMapRouteResult | null;
}

export const OpenMapView: React.FC<OpenMapViewProps> = ({ route }) => {
  const { language } = useTranslation();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletInstanceRef = useRef<any>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'profile'>('map');
  const [mounted, setMounted] = useState(false);
  const uniqueMapId = useId();

  // Guard against SSR hydration mismatches
  useEffect(() => {
    setMounted(true);
  }, []);

  // When tab switches to map, refresh leaflet layout dimensions
  useEffect(() => {
    if (activeTab === 'map' && leafletInstanceRef.current) {
      const timer = setTimeout(() => {
        try {
          leafletInstanceRef.current?.invalidateSize();
        } catch {
          // Ignore
        }
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  useEffect(() => {
    if (!mounted || !route || !mapContainerRef.current) return;
    let isCancelled = false;

    async function initOpenMap() {
      try {
        const leafletModule = await import('leaflet');
        const L = leafletModule.default || leafletModule;

        if (isCancelled || !mapContainerRef.current) return;

        // Defensive Patch for Leaflet DomUtil to eliminate 'reading _leaflet_pos of undefined'
        if (L && L.DomUtil && !(L.DomUtil as any)._posPatched) {
          (L.DomUtil as any)._posPatched = true;

          const origGetPosition = L.DomUtil.getPosition;
          L.DomUtil.getPosition = function (el: any) {
            if (!el || typeof el !== 'object') {
              return new L.Point(0, 0);
            }
            try {
              return el._leaflet_pos || new L.Point(0, 0);
            } catch {
              return new L.Point(0, 0);
            }
          };

          const origSetPosition = L.DomUtil.setPosition;
          L.DomUtil.setPosition = function (el: any, point: any) {
            if (!el || typeof el !== 'object') return;
            try {
              origSetPosition.call(L.DomUtil, el, point);
            } catch {
              // Ignore position write on detached nodes
            }
          };
        }

        // Clean up previous instance cleanly
        if (leafletInstanceRef.current) {
          try {
            leafletInstanceRef.current.stop();
            leafletInstanceRef.current.off();
            leafletInstanceRef.current.remove();
          } catch {
            // Ignore teardown error
          }
          leafletInstanceRef.current = null;
        }

        if (mapContainerRef.current) {
          delete (mapContainerRef.current as any)._leaflet_id;
          mapContainerRef.current.innerHTML = '';
        }

        if (isCancelled || !mapContainerRef.current) return;

        const centerLat = (route!.origin.latitude + route!.destination.latitude) / 2;
        const centerLng = (route!.origin.longitude + route!.destination.longitude) / 2;

        const map = L.map(mapContainerRef.current, {
          center: [centerLat, centerLng],
          zoom: 9,
          scrollWheelZoom: false,
          fadeAnimation: false,
          markerZoomAnimation: false,
        });

        leafletInstanceRef.current = map;

        // Standard OpenStreetMap tiles with offline-graceful tileerror handler
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: '&copy; OpenStreetMap contributors',
        });

        // Gracefully suppress broken image errors when operating offline in remote hills
        tileLayer.on('tileerror', (e: any) => {
          if (e && e.tile) {
            e.tile.style.visibility = 'hidden';
          }
        });

        tileLayer.addTo(map);

        // Origin custom pin (Alpine Forest Green)
        const originIcon = L.divIcon({
          className: 'custom-map-pin origin-pin',
          html: `<div style="background-color: #304B38; color: #E8EDE5; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; border: 2px solid white; box-shadow: 0 2px 8px rgba(36,39,34,0.3);">A</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
          popupAnchor: [0, -14],
        });

        // Destination custom pin (Muted Warm Amber)
        const destIcon = L.divIcon({
          className: 'custom-map-pin dest-pin',
          html: `<div style="background-color: #B3834D; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; border: 2px solid white; box-shadow: 0 2px 8px rgba(36,39,34,0.3);">B</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
          popupAnchor: [0, -14],
        });

        const originMarker = L.marker([route!.origin.latitude, route!.origin.longitude], { icon: originIcon })
          .bindPopup(
            `<div style="font-size:12px; font-family:sans-serif;">
              <strong style="color:#304B38;">${route!.origin.placeName}</strong><br/>
              <span style="color:#51554D;">Altitude: ${route!.origin.altitudeMeters}m</span>
            </div>`
          )
          .addTo(map);

        const destMarker = L.marker([route!.destination.latitude, route!.destination.longitude], { icon: destIcon })
          .bindPopup(
            `<div style="font-size:12px; font-family:sans-serif;">
              <strong style="color:#B3834D;">${route!.destination.placeName}</strong><br/>
              <span style="color:#51554D;">Altitude: ${route!.destination.altitudeMeters}m</span>
            </div>`
          )
          .addTo(map);

        // Draw transit route line
        const latlngs = route!.coordinates.map((c) => [c[0], c[1]] as [number, number]);
        const polyline = L.polyline(latlngs, {
          color: '#496951',
          weight: 4,
          opacity: 0.9,
          dashArray: '6, 6',
        }).addTo(map);

        polyline.bindPopup(
          `<div style="font-size:12px; font-family:sans-serif;">
            <strong>${route!.origin.placeName.split('(')[0]} → ${route!.destination.placeName.split('(')[0]}</strong><br/>
            ${route!.distanceKm} km · ${Math.floor(route!.durationMinutes / 60)}h ${route!.durationMinutes % 60}m
          </div>`
        );

        // Fit map bounds safely without animation race conditions
        const group = L.featureGroup([originMarker, destMarker, polyline]);
        const bounds = group.getBounds();
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [32, 32], animate: false });
        }

        // Trigger a size recalculation once the DOM has settled
        setTimeout(() => {
          if (!isCancelled && leafletInstanceRef.current) {
            leafletInstanceRef.current.invalidateSize();
          }
        }, 100);
      } catch (err) {
        console.error('OpenStreetMap render notice:', err);
      }
    }

    initOpenMap();

    return () => {
      isCancelled = true;
      if (leafletInstanceRef.current) {
        try {
          leafletInstanceRef.current.stop();
          leafletInstanceRef.current.off();
          leafletInstanceRef.current.remove();
        } catch {
          // Ignore
        }
        leafletInstanceRef.current = null;
      }
      if (mapContainerRef.current) {
        delete (mapContainerRef.current as any)._leaflet_id;
        mapContainerRef.current.innerHTML = '';
      }
    };
  }, [mounted, route]);

  if (!route) return null;

  if (!mounted) {
    return (
      <div className="journal-card p-0 overflow-hidden">
        <div
          className="px-4 py-2.5 border-b flex items-center justify-between"
          style={{ backgroundColor: 'var(--paper-deep)', borderColor: 'var(--line)' }}
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#496951]" />
            <span className="text-[12.5px] font-bold text-[#242722]">
              {language === 'HI' ? 'यात्रा मार्ग दृश्य' : 'Route Overview'}
            </span>
          </div>
        </div>
        <div className="h-60 sm:h-68 lg:h-72 w-full flex items-center justify-center bg-[#FAF9F5] text-[12px] font-mono text-[#777C72]">
          Initializing mountain corridor map...
        </div>
      </div>
    );
  }

  return (
    <div className="journal-card p-0 overflow-hidden">
      {/* Mode Tabs */}
      <div
        className="px-4 py-2.5 border-b flex items-center justify-between flex-wrap gap-2"
        style={{ backgroundColor: 'var(--paper-deep)', borderColor: 'var(--line)' }}
      >
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#496951]" />
          <span className="text-[12.5px] font-bold text-[#242722]">
            {language === 'HI' ? 'यात्रा मार्ग दृश्य' : 'Route Overview'}
          </span>
        </div>

        <div className="flex items-center gap-1 bg-white p-0.5 rounded border border-[#2D322B29]">
          <button
            type="button"
            onClick={() => setActiveTab('map')}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
              activeTab === 'map'
                ? 'bg-[#242722] text-white shadow-xs'
                : 'text-[#51554D] hover:text-[#242722]'
            }`}
          >
            {language === 'HI' ? 'मानचित्र' : 'Map View'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
              activeTab === 'profile'
                ? 'bg-[#242722] text-white shadow-xs'
                : 'text-[#51554D] hover:text-[#242722]'
            }`}
          >
            {language === 'HI' ? 'ऊंचाई प्रोफ़ाइल' : 'Elevation Profile'}
          </button>
        </div>
      </div>

      {/* Main Viewport Content */}
      <div className="p-4 space-y-3">
        {/* Map View Pane (Kept in DOM to prevent Leaflet teardown pos errors) */}
        <div style={{ display: activeTab === 'map' ? 'block' : 'none' }}>
          <div
            ref={mapContainerRef}
            id={`mountain-map-${uniqueMapId}`}
            className="h-60 sm:h-68 lg:h-72 xl:h-80 2xl:h-96 w-full rounded border overflow-hidden relative z-10"
            style={{ borderColor: 'var(--line)' }}
          />
          <div className="mt-2 flex items-center justify-between text-[10.5px] font-mono text-[#777C72]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#304B38]" />
              <strong>A:</strong> {route.origin.placeName.split('(')[0]} ({route.origin.altitudeMeters}m)
              <span className="mx-1">→</span>
              <span className="w-2 h-2 rounded-full bg-[#B3834D]" />
              <strong>B:</strong> {route.destination.placeName.split('(')[0]} ({route.destination.altitudeMeters}m)
            </span>
            <span className="hidden sm:inline">
              {language === 'HI' ? 'ज़ूम और ड्रैग करें' : 'Scroll to zoom · Drag to pan'}
            </span>
          </div>
        </div>

        {/* Elevation Profile Pane */}
        <div style={{ display: activeTab === 'profile' ? 'block' : 'none' }} className="space-y-3">
            {/* SVG Elevation Cross-Section Diagram */}
            <div
              className="relative h-32 sm:h-36 2xl:h-44 w-full rounded p-3 overflow-hidden flex flex-col justify-between border"
              style={{
                backgroundColor: 'var(--paper-deep)',
                borderColor: 'var(--line)',
              }}
            >
              <div className="flex items-center justify-between text-[11px] font-mono font-semibold text-[#304B38] z-10">
                <span className="flex items-center gap-1">
                  <Navigation className="w-3 h-3 text-[#304B38]" />
                  {route.origin.placeName.split('(')[0]} ({route.origin.altitudeMeters}m)
                </span>
                <span className="flex items-center gap-1">
                  <MountainSnow className="w-3 h-3 text-[#B3834D]" />
                  {route.destination.placeName.split('(')[0]} ({route.destination.altitudeMeters}m)
                </span>
              </div>

              {/* Topographic Elevation Curve */}
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 120">
                <defs>
                  <linearGradient id="elevationGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#496951" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#496951" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                <path
                  d={`M 0,${100 - (route.origin.altitudeMeters / 4000) * 80}
                      C 150,${90 - (route.origin.altitudeMeters / 4000) * 60}
                        250,${60 - (route.destination.altitudeMeters / 4000) * 50}
                        400,${100 - (route.destination.altitudeMeters / 4000) * 80}
                      L 400,120 L 0,120 Z`}
                  fill="url(#elevationGrad)"
                />
                <path
                  d={`M 0,${100 - (route.origin.altitudeMeters / 4000) * 80}
                      C 150,${90 - (route.origin.altitudeMeters / 4000) * 60}
                        250,${60 - (route.destination.altitudeMeters / 4000) * 50}
                        400,${100 - (route.destination.altitudeMeters / 4000) * 80}`}
                  fill="none"
                  stroke="#496951"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>

              <div
                className="flex items-center justify-between text-[10px] font-mono text-[#777C72] z-10 pt-1.5 border-t"
                style={{ borderColor: 'var(--line)' }}
              >
                <span>{language === 'HI' ? '0 किमी (प्रस्थान)' : '0 km (Start Point)'}</span>
                <span>Δ +{route.ascentMeters}m {language === 'HI' ? 'ऊंचाई बढ़त' : 'Elevation Gain'}</span>
                <span>{route.distanceKm} km {language === 'HI' ? '(गंतव्य)' : '(Arrival)'}</span>
              </div>
            </div>

            {/* Geographical Meta Summary */}
            <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 text-[11px] font-mono">
              <div className="p-2 rounded bg-[#FAF9F5] border border-[#2D322B29]">
                <span className="text-[#777C72] text-[9.5px] block">
                  {language === 'HI' ? 'प्रस्थान' : 'START POINT'}
                </span>
                <p className="font-bold text-[#242722]">
                  {route.origin.latitude.toFixed(3)}°N, {route.origin.longitude.toFixed(3)}°E
                </p>
              </div>
              <div className="p-2 rounded bg-[#FAF9F5] border border-[#2D322B29]">
                <span className="text-[#777C72] text-[9.5px] block">
                  {language === 'HI' ? 'गंतव्य' : 'DESTINATION'}
                </span>
                <p className="font-bold text-[#242722]">
                  {route.destination.latitude.toFixed(3)}°N, {route.destination.longitude.toFixed(3)}°E
                </p>
              </div>
              <div className="p-2 rounded bg-[#FAF9F5] border border-[#2D322B29]">
                <span className="text-[#777C72] text-[9.5px] block">
                  {language === 'HI' ? 'ढलान क्षेत्र' : 'TERRAIN'}
                </span>
                <p className="font-bold text-[#304B38] uppercase">
                  {route.terrainZone.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};
