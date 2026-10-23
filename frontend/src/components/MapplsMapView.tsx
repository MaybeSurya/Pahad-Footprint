'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MountainSnow, Compass, MapPin, Layers, Navigation, Info } from 'lucide-react';
import { MapplsRouteResult } from '../lib/mappls';

interface MapplsMapViewProps {
  route: MapplsRouteResult | null;
}

declare global {
  interface Window {
    mappls?: any;
    initMapplsMap?: () => void;
  }
}

export const MapplsMapView: React.FC<MapplsMapViewProps> = ({ route }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletInstanceRef = useRef<any>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'profile'>('map');
  const [mapProvider, setMapProvider] = useState<'mappls' | 'osm' | 'none'>('none');

  useEffect(() => {
    if (!route || !mapContainerRef.current) return;
    let isCancelled = false;

    async function initMap() {
      // 1. Check if Mappls Web SDK is loaded with a live key
      if (typeof window !== 'undefined' && window.mappls && window.mappls.Map) {
        try {
          const center = [
            (route!.origin.latitude + route!.destination.latitude) / 2,
            (route!.origin.longitude + route!.destination.longitude) / 2,
          ];
          const map = new window.mappls.Map(mapContainerRef.current, {
            center,
            zoom: 9,
            traffic: false,
            geolocation: false,
          });

          new window.mappls.Marker({
            map,
            position: { lat: route!.origin.latitude, lng: route!.origin.longitude },
            fitbounds: true,
            popupHtml: `<strong>${route!.origin.placeName}</strong><br/>Altitude: ${route!.origin.altitudeMeters}m`,
          });

          new window.mappls.Marker({
            map,
            position: { lat: route!.destination.latitude, lng: route!.destination.longitude },
            fitbounds: true,
            popupHtml: `<strong>${route!.destination.placeName}</strong><br/>Altitude: ${route!.destination.altitudeMeters}m`,
          });

          setMapProvider('mappls');
          return;
        } catch {
          // Fall through to OpenStreetMap
        }
      }

      // 2. OpenStreetMap + Leaflet Fallback
      try {
        const L = (await import('leaflet')).default;

        if (isCancelled || !mapContainerRef.current) return;

        // Clean up previous instance
        if (leafletInstanceRef.current) {
          leafletInstanceRef.current.remove();
          leafletInstanceRef.current = null;
        }

        const map = L.map(mapContainerRef.current, {
          center: [
            (route!.origin.latitude + route!.destination.latitude) / 2,
            (route!.origin.longitude + route!.destination.longitude) / 2,
          ],
          zoom: 9,
          scrollWheelZoom: false,
        });
        leafletInstanceRef.current = map;

        // Standard OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        // Origin custom pin (Alpine Forest Green)
        const originIcon = L.divIcon({
          className: 'custom-map-pin origin-pin',
          html: `<div style="background-color: #304B38; color: #E8EDE5; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; border: 2px solid white; box-shadow: 0 2px 8px rgba(36,39,34,0.3);">A</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
          popupAnchor: [0, -16],
        });

        // Destination custom pin (Muted Warm Amber)
        const destIcon = L.divIcon({
          className: 'custom-map-pin dest-pin',
          html: `<div style="background-color: #B3834D; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; border: 2px solid white; box-shadow: 0 2px 8px rgba(36,39,34,0.3);">B</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
          popupAnchor: [0, -16],
        });

        const originMarker = L.marker([route!.origin.latitude, route!.origin.longitude], { icon: originIcon })
          .bindPopup(
            `<div style="font-size:12px; font-family:sans-serif;">
              <strong style="color:#304B38;">Origin: ${route!.origin.placeName}</strong><br/>
              <span style="color:#51554D;">Altitude: ${route!.origin.altitudeMeters}m AMSL</span>
            </div>`
          )
          .addTo(map);

        const destMarker = L.marker([route!.destination.latitude, route!.destination.longitude], { icon: destIcon })
          .bindPopup(
            `<div style="font-size:12px; font-family:sans-serif;">
              <strong style="color:#B3834D;">Destination: ${route!.destination.placeName}</strong><br/>
              <span style="color:#51554D;">Altitude: ${route!.destination.altitudeMeters}m AMSL</span>
            </div>`
          )
          .addTo(map);

        // Draw mountain transit route polyline
        const latlngs = route!.coordinates.map((c) => [c[0], c[1]] as [number, number]);
        const polyline = L.polyline(latlngs, {
          color: '#496951',
          weight: 4,
          opacity: 0.9,
          dashArray: '6, 6',
        }).addTo(map);

        polyline.bindPopup(
          `<div style="font-size:12px; font-family:sans-serif;">
            <strong style="color:#242722;">Himalayan Transit Corridor</strong><br/>
            One-Way: <strong>${route!.distanceKm} km</strong> (~${Math.floor(route!.durationMinutes / 60)}h ${route!.durationMinutes % 60}m)<br/>
            Ascent: <strong style="color:#304B38;">Δ +${route!.ascentMeters}m</strong>
          </div>`
        );

        // Fit map bounds with padding
        const group = L.featureGroup([originMarker, destMarker, polyline]);
        map.fitBounds(group.getBounds(), { padding: [36, 36] });

        setMapProvider('osm');
      } catch (err) {
        console.error('Leaflet / OSM render error:', err);
      }
    }

    if (activeTab === 'map') {
      initMap();
    }

    return () => {
      isCancelled = true;
      if (leafletInstanceRef.current) {
        leafletInstanceRef.current.remove();
        leafletInstanceRef.current = null;
      }
    };
  }, [route, activeTab]);

  if (!route) return null;

  return (
    <div className="journal-card p-0 overflow-hidden">
      {/* Map View Header & Mode Tabs */}
      <div
        className="px-4 py-3 border-b flex items-center justify-between flex-wrap gap-2"
        style={{ backgroundColor: 'var(--paper-deep)', borderColor: 'var(--line)' }}
      >
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#496951]" />
          <div>
            <span className="text-[12.5px] font-bold text-[#242722] font-mono">
              HIMALAYAN TRANSIT CORRIDOR
            </span>
            <span className="ml-2 font-mono text-[9.5px] uppercase px-1.5 py-0.2 rounded bg-white text-[#304B38] border border-[#2D322B29]">
              {mapProvider === 'mappls' ? 'Mappls Active' : 'OpenStreetMap'}
            </span>
          </div>
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
            Live Map
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
            Elevation Profile
          </button>
        </div>
      </div>

      {/* Main Viewport Content */}
      <div className="p-4 space-y-3">
        {activeTab === 'map' ? (
          <div>
            <div
              ref={mapContainerRef}
              id="mountain-map"
              className="h-60 sm:h-68 w-full rounded border overflow-hidden relative z-10"
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
              <span className="hidden sm:inline">Scroll to zoom · Drag to pan</span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* SVG Elevation Cross-Section Diagram */}
            <div
              className="relative h-32 w-full rounded p-3 overflow-hidden flex flex-col justify-between border"
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

              {/* Dynamic Topographic Elevation Curve */}
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
                <span>0 km (Start Point)</span>
                <span>Δ +{route.ascentMeters}m Elevation Gain</span>
                <span>{route.distanceKm} km (Summit)</span>
              </div>
            </div>

            {/* Geographical Meta Summary */}
            <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
              <div className="p-2 rounded bg-[#FAF9F5] border border-[#2D322B29]">
                <span className="text-[#777C72] text-[9.5px] block">ORIGIN</span>
                <p className="font-bold text-[#242722]">
                  {route.origin.latitude.toFixed(3)}°N, {route.origin.longitude.toFixed(3)}°E
                </p>
              </div>
              <div className="p-2 rounded bg-[#FAF9F5] border border-[#2D322B29]">
                <span className="text-[#777C72] text-[9.5px] block">DESTINATION</span>
                <p className="font-bold text-[#242722]">
                  {route.destination.latitude.toFixed(3)}°N, {route.destination.longitude.toFixed(3)}°E
                </p>
              </div>
              <div className="p-2 rounded bg-[#FAF9F5] border border-[#2D322B29]">
                <span className="text-[#777C72] text-[9.5px] block">TERRAIN ZONE</span>
                <p className="font-bold text-[#304B38] uppercase">
                  {route.terrainZone.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
