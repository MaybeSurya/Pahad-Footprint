'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MountainSnow, Compass, MapPin, Layers, Navigation, Info, ExternalLink } from 'lucide-react';
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

      // 2. OpenStreetMap + Leaflet Fallback (Works 100% reliably out of the box with zero API keys)
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

        // Origin custom pin (Forest Green)
        const originIcon = L.divIcon({
          className: 'custom-map-pin origin-pin',
          html: `<div style="background-color: #1B4332; color: #C1ECD4; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; border: 2.5px solid white; box-shadow: 0 4px 12px rgba(27,67,50,0.35);">A</div>`,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
          popupAnchor: [0, -18],
        });

        // Destination custom pin (Terracotta Red)
        const destIcon = L.divIcon({
          className: 'custom-map-pin dest-pin',
          html: `<div style="background-color: #C85A32; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; border: 2.5px solid white; box-shadow: 0 4px 12px rgba(200,90,50,0.35);">B</div>`,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
          popupAnchor: [0, -18],
        });

        const originMarker = L.marker([route!.origin.latitude, route!.origin.longitude], { icon: originIcon })
          .bindPopup(
            `<div style="font-size:12.5px; font-family:sans-serif;">
              <strong style="color:#1B4332;">Origin: ${route!.origin.placeName}</strong><br/>
              <span style="color:#4B5563;">Altitude: ${route!.origin.altitudeMeters}m</span><br/>
              <span style="color:#6B7280; font-size:11px;">${route!.origin.placeAddress}</span>
            </div>`
          )
          .addTo(map);

        const destMarker = L.marker([route!.destination.latitude, route!.destination.longitude], { icon: destIcon })
          .bindPopup(
            `<div style="font-size:12.5px; font-family:sans-serif;">
              <strong style="color:#C85A32;">Destination: ${route!.destination.placeName}</strong><br/>
              <span style="color:#4B5563;">Altitude: ${route!.destination.altitudeMeters}m</span><br/>
              <span style="color:#6B7280; font-size:11px;">${route!.destination.placeAddress}</span>
            </div>`
          )
          .addTo(map);

        // Draw mountain transit route polyline
        const latlngs = route!.coordinates.map((c) => [c[0], c[1]] as [number, number]);
        const polyline = L.polyline(latlngs, {
          color: '#1B4332',
          weight: 4.5,
          opacity: 0.9,
          dashArray: '7, 6',
        }).addTo(map);

        polyline.bindPopup(
          `<div style="font-size:12px; font-family:sans-serif;">
            <strong style="color:#111827;">Mountain Transit Corridor</strong><br/>
            One-Way: <strong>${route!.distanceKm} km</strong> (~${Math.floor(route!.durationMinutes / 60)}h ${route!.durationMinutes % 60}m)<br/>
            Altitude Rise: <strong style="color:#1B4332;">Δ +${route!.ascentMeters}m</strong>
          </div>`
        );

        // Fit map bounds with padding
        const group = L.featureGroup([originMarker, destMarker, polyline]);
        map.fitBounds(group.getBounds(), { padding: [40, 40] });

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
    <div className="bg-white border border-[#D8E8DF] rounded-2xl overflow-hidden shadow-card">
      {/* Map View Header & Mode Tabs */}
      <div className="px-5 py-3.5 bg-[#EDF6F0] border-b border-[#D8E8DF] flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#1B4332]" />
          <div>
            <span className="text-[13px] font-bold text-[#111827]">
              Himalayan Transit Corridor &amp; Topography
            </span>
            <span className="ml-2 text-[10.5px] font-extrabold px-2 py-0.5 rounded-full bg-white text-[#1B4332] border border-[#D8E8DF]">
              {mapProvider === 'mappls' ? 'Mappls Active' : 'OpenStreetMap Live'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#D8E8DF]">
          <button
            type="button"
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1 rounded-lg text-[11.5px] font-semibold transition-colors ${
              activeTab === 'map'
                ? 'bg-[#1B4332] text-white shadow-sm'
                : 'text-[#4B5563] hover:text-[#111827]'
            }`}
          >
            Live Map Canvas
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1 rounded-lg text-[11.5px] font-semibold transition-colors ${
              activeTab === 'profile'
                ? 'bg-[#1B4332] text-white shadow-sm'
                : 'text-[#4B5563] hover:text-[#111827]'
            }`}
          >
            Elevation Profile
          </button>
        </div>
      </div>

      {/* Main Viewport Content */}
      <div className="relative p-4 sm:p-5">
        {activeTab === 'map' ? (
          <div>
            <div
              ref={mapContainerRef}
              id="mountain-map"
              className="h-64 sm:h-72 w-full rounded-xl overflow-hidden border border-[#D8E8DF] relative z-10 shadow-inner"
            />
            <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#4B5563] px-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1B4332]" />
                <strong>A:</strong> {route.origin.placeName.split('(')[0]} ({route.origin.altitudeMeters}m)
                <span className="mx-1">•</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#C85A32]" />
                <strong>B:</strong> {route.destination.placeName.split('(')[0]} ({route.destination.altitudeMeters}m)
              </span>
              <span>Scroll to zoom • Drag to pan</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* SVG Elevation Cross-Section Diagram */}
            <div className="relative h-36 w-full rounded-xl bg-gradient-to-b from-[#EDF6F0] to-[#E2ECE5] border border-[#D8E8DF] p-3 overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] font-semibold text-[#1B4332] z-10">
                <span className="flex items-center gap-1">
                  <Navigation className="w-3 h-3 text-[#10B981]" />
                  {route.origin.placeName.split('(')[0]} ({route.origin.altitudeMeters}m)
                </span>
                <span className="flex items-center gap-1">
                  <MountainSnow className="w-3.5 h-3.5 text-[#C85A32]" />
                  {route.destination.placeName.split('(')[0]} ({route.destination.altitudeMeters}m)
                </span>
              </div>

              {/* Dynamic Topographic Elevation Curve */}
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 120">
                <defs>
                  <linearGradient id="elevationGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1B4332" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#1B4332" stopOpacity="0.05" />
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
                  stroke="#1B4332"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>

              <div className="flex items-center justify-between text-[10px] font-mono text-[#4B5563] z-10 pt-2 border-t border-[#D8E8DF]/60">
                <span>0 km (Start Point)</span>
                <span>Δ +{route.ascentMeters}m Vertical Elevation Rise</span>
                <span>{route.distanceKm} km (Summit Destination)</span>
              </div>
            </div>

            {/* Geographical Meta Summary */}
            <div className="grid grid-cols-3 gap-2.5 text-[11.5px]">
              <div className="p-2.5 rounded-lg bg-[#F8FAF9] border border-[#D8E8DF]">
                <span className="text-[#4B5563] text-[10.5px]">Origin Coordinates</span>
                <p className="font-mono font-bold text-[#111827]">
                  {route.origin.latitude.toFixed(3)}°N, {route.origin.longitude.toFixed(3)}°E
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-[#F8FAF9] border border-[#D8E8DF]">
                <span className="text-[#4B5563] text-[10.5px]">Destination Coordinates</span>
                <p className="font-mono font-bold text-[#111827]">
                  {route.destination.latitude.toFixed(3)}°N, {route.destination.longitude.toFixed(3)}°E
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-[#F8FAF9] border border-[#D8E8DF]">
                <span className="text-[#4B5563] text-[10.5px]">Gradient Classification</span>
                <p className="font-bold text-[#1B4332] uppercase">
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
