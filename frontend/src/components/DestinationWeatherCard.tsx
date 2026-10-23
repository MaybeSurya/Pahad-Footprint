'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CloudSun,
  Wind,
  Droplets,
  Sun,
  CloudRain,
  CloudSnow,
  CloudFog,
  ShieldAlert,
  RotateCcw,
  Sparkles,
  Radio,
  ExternalLink,
  MapPin,
  MountainSnow,
} from 'lucide-react';
import {
  DestinationWeatherReport,
  getDestinationWeather,
} from '../lib/weather';
import { useTranslation } from '../contexts/TranslationContext';

interface DestinationWeatherCardProps {
  destinationName: string;
  altitudeMeters?: number;
  latitude?: number;
  longitude?: number;
}

export const DestinationWeatherCard: React.FC<DestinationWeatherCardProps> = ({
  destinationName,
  altitudeMeters = 1800,
  latitude = 29.39,
  longitude = 79.45,
}) => {
  const { language } = useTranslation();
  const [weather, setWeather] = useState<DestinationWeatherReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchReport = async () => {
    setIsRefreshing(true);
    try {
      const data = await getDestinationWeather(
        destinationName,
        altitudeMeters,
        latitude,
        longitude
      );
      setWeather(data);
    } catch {
      // Handled inside getDestinationWeather
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [destinationName, altitudeMeters, latitude, longitude]);

  const getWeatherIcon = (code: number) => {
    if (code === 0 || code === 1) return <Sun className="w-5 h-5 text-[#B3834D]" />;
    if (code >= 45 && code <= 48) return <CloudFog className="w-5 h-5 text-[#777C72]" />;
    if (code >= 51 && code <= 65) return <CloudRain className="w-5 h-5 text-[#496951]" />;
    if (code >= 71 && code <= 86) return <CloudSnow className="w-5 h-5 text-[#304B38]" />;
    return <CloudSun className="w-5 h-5 text-[#496951]" />;
  };

  if (loading) {
    return (
      <div className="journal-card p-5 animate-pulse space-y-3">
        <div className="h-4 w-48 bg-[#E8EDE5] rounded" />
        <div className="h-16 w-full bg-[#FAF9F5] rounded border border-[#2D322B14]" />
      </div>
    );
  }

  if (!weather) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.08 }}
      className="journal-card p-5 space-y-4"
    >
      {/* Header with Location & Refresh Button */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#2D322B14]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10.5px] font-bold px-2 py-0.5 rounded bg-[#E8EDE5] text-[#304B38] border border-[#496951]/20 flex items-center gap-1">
              <Radio className={`w-3 h-3 ${weather.isOffline ? 'text-[#8A5D2E]' : 'text-[#304B38] animate-pulse'}`} />
              <span>
                {weather.isOffline
                  ? (language === 'HI' ? 'पर्वतीय ऑफलाइन मोड' : 'OFFLINE HILL MODE')
                  : (language === 'HI' ? 'लाइव मौसम टेलीमेट्री' : 'LIVE METEOROLOGY')}
              </span>
            </span>
            <span className="text-[11px] font-mono text-[#777C72]">
              {language === 'HI' ? 'गंतव्य वेधशाला' : 'Destination Observatory'}
            </span>
          </div>

          <h3 className="text-[16px] font-bold text-[#242722] tracking-tight flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#B3834D]" />
            <span>{weather.city}</span>
            {weather.altitudeMeters && (
              <span className="text-[12px] font-mono font-medium text-[#777C72]">
                ({weather.altitudeMeters}m)
              </span>
            )}
          </h3>
        </div>

        <button
          type="button"
          onClick={fetchReport}
          disabled={isRefreshing}
          className="p-1.5 rounded border border-[#2D322B1F] bg-[#FAF9F5] text-[#51554D] hover:text-[#242722] hover:bg-[#F0EEE6] transition-colors"
          title="Refresh live weather & AQI from API"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Main Meteorological Grid: Temperature + AQI Meter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Left: Temperature & Ambient Condition */}
        <div
          className="p-3.5 rounded border flex flex-col justify-between"
          style={{
            backgroundColor: 'var(--paper-subtle)',
            borderColor: 'var(--line)',
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-[#777C72] tracking-wider">
              {language === 'HI' ? 'पहाड़ी तापमान' : 'Ambient Temperature'}
            </span>
            <div className="w-7 h-7 rounded bg-white border border-[#2D322B14] flex items-center justify-center">
              {getWeatherIcon(weather.conditionCode)}
            </div>
          </div>

          <div className="my-2 flex items-baseline gap-2">
            <span className="text-[32px] font-bold text-[#242722] font-mono leading-none">
              {weather.temperature}
            </span>
            <span className="text-[12px] text-[#51554D]">
              {language === 'HI' ? `अनुभव: ${weather.feelsLike}` : `Feels ${weather.feelsLike}`}
            </span>
          </div>

          <div className="pt-2 border-t border-[#2D322B0F] flex items-center justify-between text-[11px] font-mono text-[#51554D]">
            <span className="flex items-center gap-1">
              <Droplets className="w-3 h-3 text-[#496951]" />
              {weather.humidity}
            </span>
            <span className="flex items-center gap-1">
              <Wind className="w-3 h-3 text-[#B3834D]" />
              {weather.windSpeed}
            </span>
            <span className="font-semibold text-[#304B38] truncate max-w-[110px]">
              {weather.description}
            </span>
          </div>
        </div>

        {/* Right: Air Quality Index (AQI) & PM2.5 Meter */}
        <div
          className="p-3.5 rounded border flex flex-col justify-between"
          style={{
            backgroundColor: 'var(--paper-subtle)',
            borderColor: 'var(--line)',
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-[#777C72] tracking-wider">
              {language === 'HI' ? 'वायु गुणवत्ता (AQI)' : 'Air Quality Index (AQI)'}
            </span>
            <span
              className="text-[10px] font-mono font-bold px-2 py-0.5 rounded text-white"
              style={{ backgroundColor: weather.airQuality.color }}
            >
              {weather.airQuality.category.toUpperCase()}
            </span>
          </div>

          <div className="my-2 flex items-baseline gap-2">
            <span className="text-[32px] font-bold font-mono leading-none" style={{ color: weather.airQuality.color }}>
              {weather.airQuality.aqi}
            </span>
            <span className="text-[11.5px] font-mono text-[#777C72]">
              PM2.5: {weather.airQuality.pm25} µg/m³
            </span>
          </div>

          <p className="text-[11px] text-[#51554D] leading-snug pt-2 border-t border-[#2D322B0F]">
            {weather.airQuality.advisory}
          </p>
        </div>
      </div>

      {/* 3-Day Alpine Forecast Strip */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono uppercase tracking-wider text-[#777C72] block">
          {language === 'HI' ? 'आगामी ३-दिवसीय पर्वतीय पूर्वानुमान' : '3-Day Mountain Expedition Forecast'}
        </span>

        <div className="grid grid-cols-3 gap-2">
          {weather.forecast.map((day, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded border border-[#2D322B14] bg-white flex flex-col items-center text-center space-y-1"
            >
              <span className="font-mono text-[11px] font-bold text-[#242722]">
                {day.dayName}
              </span>
              <span className="text-[9.5px] font-mono text-[#777C72]">
                {day.date}
              </span>
              <div className="my-1">
                {getWeatherIcon(day.conditionCode)}
              </div>
              <div className="font-mono text-[11.5px] font-bold text-[#242722]">
                {day.tempMax}° / <span className="text-[#777C72] font-normal">{day.tempMin}°</span>
              </div>
              <span className="text-[9.5px] text-[#496951] font-mono block">
                {day.precipChance}% rain
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Attribution: MaybeSurya Weather API */}
      <div className="pt-2 border-t border-[#2D322B14] flex flex-col xs:flex-row xs:items-center justify-between gap-1 text-[10.5px] font-mono text-[#777C72]">
        <div className="flex items-center gap-1.5">
          <span>{language === 'HI' ? 'डेटा स्रोत:' : 'Source:'}</span>
          <a
            href="https://docs.maybesurya.dev/weather/overview"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#304B38] font-bold hover:underline inline-flex items-center gap-0.5"
          >
            <span>MaybeSurya Weather API</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>

        <span className="italic">
          {weather.isOffline
            ? (language === 'HI' ? 'ऑफ़लाइन कैश से सुरक्षित' : 'Offline Himalayan cache active')
            : (language === 'HI' ? 'अद्यतन टेलीमेट्री' : 'Live cloud telemetry')}
        </span>
      </div>
    </motion.div>
  );
};
