// MaybeSurya Weather API Client with Offline Himalayan Caching & Altitude Telemetry
// Docs: https://docs.maybesurya.dev/weather/overview
// Endpoint: https://weather.maybesurya.dev/api/weather

export interface WeatherForecastDay {
  date: string;
  dayName: string;
  tempMax: number;
  tempMin: number;
  conditionCode: number;
  description: string;
  precipChance: number;
}

export interface AirQualityData {
  aqi: number; // US AQI scale
  category: 'Pristine Alpine' | 'Good' | 'Moderate' | 'Unhealthy' | 'Very Unhealthy';
  pm25: number; // µg/m³
  pm10: number; // µg/m³
  color: string;
  advisory: string;
}

export interface DestinationWeatherReport {
  city: string;
  country: string;
  temperature: string;
  feelsLike: string;
  humidity: string;
  windSpeed: string;
  conditionCode: number;
  description: string;
  provider: string;
  isOffline: boolean;
  altitudeMeters?: number;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  airQuality: AirQualityData;
  forecast: WeatherForecastDay[];
  timestamp: string;
}

// WMO weather code dictionary (WMO 4677 standard aligned with MaybeSurya API)
export function getWMODescription(code: number): string {
  switch (code) {
    case 0:
      return 'Clear Sky';
    case 1:
      return 'Mainly Clear';
    case 2:
      return 'Partly Cloudy';
    case 3:
      return 'Overcast';
    case 45:
    case 48:
      return 'Alpine Valley Fog';
    case 51:
    case 53:
    case 55:
      return 'Light Mountain Drizzle';
    case 61:
    case 63:
    case 65:
      return 'Himalayan Rain Shower';
    case 71:
    case 73:
    case 75:
      return 'Alpine Snowfall';
    case 77:
      return 'Snow Grains / Sleet';
    case 80:
    case 81:
    case 82:
      return 'Passing Rain Showers';
    case 85:
    case 86:
      return 'Heavy Mountain Snow Showers';
    case 95:
    case 96:
    case 99:
      return 'Mountain Thunderstorm';
    default:
      return 'Muted Mountain Haze';
  }
}

// AQI Category resolver
export function resolveAQICategory(aqi: number): {
  category: AirQualityData['category'];
  color: string;
  advisory: string;
} {
  if (aqi <= 25) {
    return {
      category: 'Pristine Alpine',
      color: '#304B38', // Deep Forest Green
      advisory: 'Unblemished high-altitude Himalayan air. Zero anthropogenic particulate burden.',
    };
  }
  if (aqi <= 50) {
    return {
      category: 'Good',
      color: '#496951', // Alpine Green
      advisory: 'Air quality is satisfactory. Optimal for high-altitude trekking and outdoor exploration.',
    };
  }
  if (aqi <= 100) {
    return {
      category: 'Moderate',
      color: '#B3834D', // Warm Amber
      advisory: 'Acceptable foothill quality; slight haze in river valleys during thermal inversions.',
    };
  }
  return {
    category: 'Unhealthy',
    color: '#8A5D2E',
    advisory: 'Particulate build-up detected; consider reduced cardio exertion.',
  };
}

// Generate realistic mountain fallback for offline travelers in remote hill valleys
function getOfflineAlpineFallback(
  cityName: string,
  altitudeMeters = 1800,
  lat = 29.5,
  lng = 79.5
): DestinationWeatherReport {
  // Standard environmental lapse rate: ~6.5°C drop per 1,000m elevation gain
  const baselinePlainsTemp = 28;
  const estimatedTemp = Math.round(baselinePlainsTemp - (altitudeMeters / 1000) * 6.5);
  const feelsLike = Math.round(estimatedTemp - (altitudeMeters > 2000 ? 2 : 1));

  // High Himalayan air is naturally clean (low particulate matter)
  const simulatedAQI = altitudeMeters > 2200 ? 16 : altitudeMeters > 1200 ? 28 : 42;
  const aqiInfo = resolveAQICategory(simulatedAQI);

  const today = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const forecast: WeatherForecastDay[] = [1, 2, 3].map((offset) => {
    const d = new Date(today);
    d.setDate(today.getDate() + offset);
    return {
      date: d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      dayName: dayNames[d.getDay()],
      tempMax: estimatedTemp + (offset % 2 === 0 ? 1 : -1),
      tempMin: estimatedTemp - 7,
      conditionCode: altitudeMeters > 3000 ? 71 : 0,
      description: altitudeMeters > 3000 ? 'Alpine Flurries' : 'Crisp Mountain Sun',
      precipChance: altitudeMeters > 2500 ? 20 : 10,
    };
  });

  return {
    city: cityName,
    country: 'India (Uttarakhand)',
    temperature: `${estimatedTemp}°C`,
    feelsLike: `${feelsLike}°C`,
    humidity: `${altitudeMeters > 2000 ? 54 : 65}%`,
    windSpeed: `${altitudeMeters > 2500 ? '14 km/h' : '8 km/h'}`,
    conditionCode: altitudeMeters > 3000 ? 71 : 0,
    description: altitudeMeters > 3000 ? 'High-Altitude Flurries' : 'Clear Mountain Sky',
    provider: 'Pahad Offline Mountain Model',
    isOffline: true,
    altitudeMeters,
    coordinates: { latitude: lat, longitude: lng },
    airQuality: {
      aqi: simulatedAQI,
      category: aqiInfo.category,
      pm25: Math.round(simulatedAQI * 0.35),
      pm10: Math.round(simulatedAQI * 0.7),
      color: aqiInfo.color,
      advisory: aqiInfo.advisory,
    },
    forecast,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Fetch destination weather, AQI, and forecast using MaybeSurya Weather API
 * Endpoint: https://weather.maybesurya.dev/api/weather
 * With seamless offline caching for travelers in mountain hills
 */
export async function getDestinationWeather(
  destinationName: string,
  altitudeMeters = 1800,
  latitude = 29.39,
  longitude = 79.45
): Promise<DestinationWeatherReport> {
  // Extract primary city name from formatted strings like "Nainital (Tallital / Mall Road)"
  const cleanCity = destinationName
    .split('(')[0]
    .replace(/(Gateway|City Center|Terminal|Junction|Border|Pass|Peak|Temple)/gi, '')
    .trim();

  const cacheKey = `pahad_weather_${cleanCity.toLowerCase().replace(/\s+/g, '_')}`;

  // Check if browser is strictly offline
  const isBrowserOffline = typeof navigator !== 'undefined' && !navigator.onLine;

  if (isBrowserOffline) {
    if (typeof localStorage !== 'undefined') {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          parsed.isOffline = true;
          return parsed;
        } catch {
          // Fallback to offline model
        }
      }
    }
    return getOfflineAlpineFallback(cleanCity, altitudeMeters, latitude, longitude);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4-second timeout for fragile mountain 3G

    // 1. Primary Call: MaybeSurya Weather API
    const weatherUrl = `https://weather.maybesurya.dev/api/weather?city=${encodeURIComponent(
      cleanCity
    )}&units=metric`;

    const weatherRes = await fetch(weatherUrl, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!weatherRes.ok) {
      throw new Error(`MaybeSurya Weather API returned ${weatherRes.status}`);
    }

    const weatherJson = await weatherRes.json();

    if (weatherJson.status !== 'success' || !weatherJson.weather) {
      throw new Error('Invalid response structure from MaybeSurya Weather API');
    }

    const wData = weatherJson.weather;
    const resolvedLat = weatherJson.coordinates?.latitude || latitude;
    const resolvedLng = weatherJson.coordinates?.longitude || longitude;

    // 2. Fetch Live Air Quality (Open-Meteo Air Quality API - upstream companion)
    let aqiVal = altitudeMeters > 2000 ? 18 : 34;
    let pm25Val = 8;
    let pm10Val = 16;

    try {
      const aqiRes = await fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${resolvedLat}&longitude=${resolvedLng}&current=us_aqi,pm2_5,pm10`,
        { signal: AbortSignal.timeout(3000) }
      );
      if (aqiRes.ok) {
        const aqiJson = await aqiRes.json();
        if (aqiJson.current?.us_aqi !== undefined) {
          aqiVal = Math.round(aqiJson.current.us_aqi);
          pm25Val = Math.round(aqiJson.current.pm2_5 || aqiVal * 0.35);
          pm10Val = Math.round(aqiJson.current.pm10 || aqiVal * 0.7);
        }
      }
    } catch {
      // Use elevation-adjusted defaults
    }

    const aqiMeta = resolveAQICategory(aqiVal);

    // 3. Fetch 3-Day Daily Forecast
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let forecastList: WeatherForecastDay[] = [];

    try {
      const forecastRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${resolvedLat}&longitude=${resolvedLng}&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max&timezone=Asia%2FKolkata&forecast_days=4`,
        { signal: AbortSignal.timeout(3000) }
      );
      if (forecastRes.ok) {
        const forecastJson = await forecastRes.json();
        const daily = forecastJson.daily;
        if (daily && daily.time && daily.time.length > 1) {
          // Exclude today (index 0), take next 3 days
          forecastList = daily.time.slice(1, 4).map((timeStr: string, idx: number) => {
            const dateObj = new Date(timeStr);
            const wCode = daily.weathercode?.[idx + 1] ?? 0;
            return {
              date: dateObj.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
              dayName: dayNames[dateObj.getDay()],
              tempMax: Math.round(daily.temperature_2m_max?.[idx + 1] ?? 20),
              tempMin: Math.round(daily.temperature_2m_min?.[idx + 1] ?? 10),
              conditionCode: wCode,
              description: getWMODescription(wCode),
              precipChance: Math.round(daily.precipitation_probability_max?.[idx + 1] ?? 10),
            };
          });
        }
      }
    } catch {
      // Provide calculated fallback forecast
    }

    if (forecastList.length === 0) {
      const today = new Date();
      const currentTempNum = parseInt(wData.temperature) || 18;
      forecastList = [1, 2, 3].map((offset) => {
        const d = new Date(today);
        d.setDate(today.getDate() + offset);
        return {
          date: d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
          dayName: dayNames[d.getDay()],
          tempMax: currentTempNum + 2,
          tempMin: currentTempNum - 6,
          conditionCode: wData.condition_code ?? 0,
          description: wData.description || 'Mountain Conditions',
          precipChance: 15,
        };
      });
    }

    const report: DestinationWeatherReport = {
      city: weatherJson.location?.city || cleanCity,
      country: weatherJson.location?.country || 'India',
      temperature: wData.temperature || '18°C',
      feelsLike: wData.feels_like || wData.temperature || '18°C',
      humidity: wData.humidity || '60%',
      windSpeed: wData.wind_speed || '8 km/h',
      conditionCode: wData.condition_code ?? 0,
      description: wData.description || getWMODescription(wData.condition_code ?? 0),
      provider: 'MaybeSurya Weather API (weather.maybesurya.dev)',
      isOffline: false,
      altitudeMeters,
      coordinates: { latitude: resolvedLat, longitude: resolvedLng },
      airQuality: {
        aqi: aqiVal,
        category: aqiMeta.category,
        pm25: pm25Val,
        pm10: pm10Val,
        color: aqiMeta.color,
        advisory: aqiMeta.advisory,
      },
      forecast: forecastList,
      timestamp: new Date().toISOString(),
    };

    // Cache locally in localStorage for offline mountain access
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(cacheKey, JSON.stringify(report));
      } catch {
        // Ignore quota write errors
      }
    }

    return report;
  } catch (err) {
    console.warn('[Pahad Weather] Network fetch failed, falling back to offline cache:', err);

    // Try reading last-known cache
    if (typeof localStorage !== 'undefined') {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          parsed.isOffline = true;
          return parsed;
        } catch {
          // Ignore
        }
      }
    }

    return getOfflineAlpineFallback(cleanCity, altitudeMeters, latitude, longitude);
  }
}
