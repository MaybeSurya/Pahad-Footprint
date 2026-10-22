export interface MapplsPlace {
  id: string;
  placeName: string;
  placeAddress: string;
  latitude: number;
  longitude: number;
  altitudeMeters: number;
  district: string;
  terrainZone: 'foothills' | 'mid_hills' | 'high_altitude';
}

export interface MapplsRouteResult {
  distanceKm: number;
  roundTripKm: number;
  durationMinutes: number;
  origin: MapplsPlace;
  destination: MapplsPlace;
  terrainZone: 'foothills' | 'mid_hills' | 'high_altitude';
  ascentMeters: number;
  isSimulated: boolean;
  coordinates: [number, number][]; // [lat, lng]
}

// Built-in Uttarakhand verified mountain destination catalog
export const UTTARAKHAND_HUBS: MapplsPlace[] = [
  // Foothills / Plains (<1,200m)
  {
    id: 'kathgodam',
    placeName: 'Kathgodam Railway Terminal',
    placeAddress: 'Haldwani, Nainital District, Uttarakhand',
    latitude: 29.273,
    longitude: 79.539,
    altitudeMeters: 534,
    district: 'Nainital',
    terrainZone: 'foothills',
  },
  {
    id: 'rishikesh',
    placeName: 'Rishikesh (Triveni Ghat / Tapovan)',
    placeAddress: 'Dehradun & Tehri Border, Uttarakhand',
    latitude: 30.086,
    longitude: 78.267,
    altitudeMeters: 372,
    district: 'Dehradun',
    terrainZone: 'foothills',
  },
  {
    id: 'haridwar',
    placeName: 'Haridwar (Har Ki Pauri)',
    placeAddress: 'Haridwar District, Uttarakhand',
    latitude: 29.945,
    longitude: 78.164,
    altitudeMeters: 314,
    district: 'Haridwar',
    terrainZone: 'foothills',
  },
  {
    id: 'dehradun',
    placeName: 'Dehradun (Clock Tower / ISBT)',
    placeAddress: 'Capital City, Dehradun District, Uttarakhand',
    latitude: 30.316,
    longitude: 78.032,
    altitudeMeters: 640,
    district: 'Dehradun',
    terrainZone: 'foothills',
  },
  {
    id: 'ramnagar_corbett',
    placeName: 'Ramnagar (Jim Corbett National Park)',
    placeAddress: 'Nainital District, Uttarakhand',
    latitude: 29.395,
    longitude: 79.126,
    altitudeMeters: 345,
    district: 'Nainital',
    terrainZone: 'foothills',
  },
  {
    id: 'haldwani',
    placeName: 'Haldwani City Center',
    placeAddress: 'Nainital District, Uttarakhand',
    latitude: 29.218,
    longitude: 79.512,
    altitudeMeters: 424,
    district: 'Nainital',
    terrainZone: 'foothills',
  },
  {
    id: 'kotdwar',
    placeName: 'Kotdwar Gateway',
    placeAddress: 'Pauri Garhwal District, Uttarakhand',
    latitude: 29.749,
    longitude: 78.528,
    altitudeMeters: 454,
    district: 'Pauri Garhwal',
    terrainZone: 'foothills',
  },

  // Mid-Hills (1,200m – 2,400m)
  {
    id: 'nainital',
    placeName: 'Nainital (Mallital / Naini Lake)',
    placeAddress: 'Nainital District, Kumaon, Uttarakhand',
    latitude: 29.391,
    longitude: 79.454,
    altitudeMeters: 2084,
    district: 'Nainital',
    terrainZone: 'mid_hills',
  },
  {
    id: 'mukteshwar',
    placeName: 'Mukteshwar Dham',
    placeAddress: 'Nainital District, Kumaon, Uttarakhand',
    latitude: 29.472,
    longitude: 79.647,
    altitudeMeters: 2171,
    district: 'Nainital',
    terrainZone: 'mid_hills',
  },
  {
    id: 'almora',
    placeName: 'Almora Cultural Ridge',
    placeAddress: 'Almora District, Kumaon, Uttarakhand',
    latitude: 29.597,
    longitude: 79.659,
    altitudeMeters: 1638,
    district: 'Almora',
    terrainZone: 'mid_hills',
  },
  {
    id: 'ranikhet',
    placeName: 'Ranikhet Cantonment',
    placeAddress: 'Almora District, Kumaon, Uttarakhand',
    latitude: 29.643,
    longitude: 79.432,
    altitudeMeters: 1869,
    district: 'Almora',
    terrainZone: 'mid_hills',
  },
  {
    id: 'kausani',
    placeName: 'Kausani (Himalayan Panorama Point)',
    placeAddress: 'Bageshwar District, Kumaon, Uttarakhand',
    latitude: 29.854,
    longitude: 79.596,
    altitudeMeters: 1890,
    district: 'Bageshwar',
    terrainZone: 'mid_hills',
  },
  {
    id: 'mussoorie',
    placeName: 'Mussoorie (Queen of Hills / Mall Road)',
    placeAddress: 'Dehradun District, Garhwal, Uttarakhand',
    latitude: 30.459,
    longitude: 78.066,
    altitudeMeters: 2005,
    district: 'Dehradun',
    terrainZone: 'mid_hills',
  },
  {
    id: 'dhanaulti',
    placeName: 'Dhanaulti Eco-Park',
    placeAddress: 'Tehri Garhwal District, Uttarakhand',
    latitude: 30.45,
    longitude: 78.239,
    altitudeMeters: 2286,
    district: 'Tehri Garhwal',
    terrainZone: 'mid_hills',
  },
  {
    id: 'lansdowne',
    placeName: 'Lansdowne Cantonment',
    placeAddress: 'Pauri Garhwal District, Uttarakhand',
    latitude: 29.837,
    longitude: 78.685,
    altitudeMeters: 1706,
    district: 'Pauri Garhwal',
    terrainZone: 'mid_hills',
  },
  {
    id: 'pithoragarh',
    placeName: 'Pithoragarh Soar Valley',
    placeAddress: 'Pithoragarh District, Kumaon, Uttarakhand',
    latitude: 29.582,
    longitude: 80.218,
    altitudeMeters: 1627,
    district: 'Pithoragarh',
    terrainZone: 'mid_hills',
  },
  {
    id: 'joshimath',
    placeName: 'Joshimath (Jyotirmath Gateway)',
    placeAddress: 'Chamoli District, Garhwal, Uttarakhand',
    latitude: 30.556,
    longitude: 79.566,
    altitudeMeters: 1890,
    district: 'Chamoli',
    terrainZone: 'mid_hills',
  },

  // High-Altitude (>2,400m) Sensitive Ecosystems
  {
    id: 'chopta',
    placeName: 'Chopta Valley (Mini Switzerland)',
    placeAddress: 'Rudraprayag / Chamoli Border, Uttarakhand',
    latitude: 30.485,
    longitude: 79.176,
    altitudeMeters: 2680,
    district: 'Rudraprayag',
    terrainZone: 'high_altitude',
  },
  {
    id: 'auli',
    placeName: 'Auli Ski Slopes & Bugyal',
    placeAddress: 'Chamoli District, Garhwal, Uttarakhand',
    latitude: 30.533,
    longitude: 79.566,
    altitudeMeters: 2800,
    district: 'Chamoli',
    terrainZone: 'high_altitude',
  },
  {
    id: 'badrinath',
    placeName: 'Badrinath Dham (Alaknanda Basin)',
    placeAddress: 'Chamoli District, Garhwal, Uttarakhand',
    latitude: 30.743,
    longitude: 79.493,
    altitudeMeters: 3300,
    district: 'Chamoli',
    terrainZone: 'high_altitude',
  },
  {
    id: 'kedarnath',
    placeName: 'Kedarnath Dham (Mandakini Valley)',
    placeAddress: 'Rudraprayag District, Garhwal, Uttarakhand',
    latitude: 30.735,
    longitude: 79.066,
    altitudeMeters: 3583,
    district: 'Rudraprayag',
    terrainZone: 'high_altitude',
  },
  {
    id: 'gangotri',
    placeName: 'Gangotri Dham (Bhagirathi Gorge)',
    placeAddress: 'Uttarkashi District, Garhwal, Uttarakhand',
    latitude: 30.994,
    longitude: 78.939,
    altitudeMeters: 3100,
    district: 'Uttarkashi',
    terrainZone: 'high_altitude',
  },
  {
    id: 'yamunotri',
    placeName: 'Yamunotri Dham (Bandarpunch Base)',
    placeAddress: 'Uttarkashi District, Garhwal, Uttarakhand',
    latitude: 31.014,
    longitude: 78.46,
    altitudeMeters: 3293,
    district: 'Uttarkashi',
    terrainZone: 'high_altitude',
  },
  {
    id: 'valley_of_flowers',
    placeName: 'Valley of Flowers & Ghangaria',
    placeAddress: 'Bhyundar Valley, Chamoli District, Uttarakhand',
    latitude: 30.728,
    longitude: 79.605,
    altitudeMeters: 3658,
    district: 'Chamoli',
    terrainZone: 'high_altitude',
  },
  {
    id: 'munsiyari',
    placeName: 'Munsiyari (Panchachuli Base)',
    placeAddress: 'Pithoragarh District, Kumaon, Uttarakhand',
    latitude: 30.066,
    longitude: 80.237,
    altitudeMeters: 2200,
    district: 'Pithoragarh',
    terrainZone: 'high_altitude',
  },

  // Regional Transit Origin Hubs
  {
    id: 'delhi',
    placeName: 'New Delhi (Kashmere Gate ISBT / Airport)',
    placeAddress: 'National Capital Territory of Delhi',
    latitude: 28.613,
    longitude: 77.209,
    altitudeMeters: 216,
    district: 'Delhi',
    terrainZone: 'foothills',
  },
  {
    id: 'chandigarh',
    placeName: 'Chandigarh ISBT Sector 43',
    placeAddress: 'Chandigarh Capital Region',
    latitude: 30.733,
    longitude: 76.779,
    altitudeMeters: 350,
    district: 'Chandigarh',
    terrainZone: 'foothills',
  },
];

// Helper: Haversine distance in km
function calculateHaversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Stored Mappls Key handling
const STORAGE_KEY = 'mappls_api_key';

export function getStoredMapplsKey(): string {
  if (typeof window === 'undefined') return '';
  return (
    localStorage.getItem(STORAGE_KEY) ||
    process.env.NEXT_PUBLIC_MAPPLS_REST_KEY ||
    process.env.NEXT_PUBLIC_MAPPLS_KEY ||
    ''
  );
}

export function setStoredMapplsKey(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, key.trim());
}

/**
 * Searches places via Mappls Autosuggest API (when key available) or local Uttarakhand gazetteer
 */
export async function searchMapplsPlaces(query: string, apiKey?: string): Promise<MapplsPlace[]> {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return UTTARAKHAND_HUBS.slice(0, 6);

  const activeKey = apiKey || getStoredMapplsKey();

  // Try live Mappls Autosuggest if key is available
  if (activeKey) {
    try {
      const response = await fetch(
        `https://apis.mappls.com/advancedmaps/v1/${activeKey}/autosuggest?query=${encodeURIComponent(
          cleanQuery
        )}&region=IND&pod=CITY,VILLAGE,SUB_DISTRICT,POI`,
        { signal: AbortSignal.timeout(3500) }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.suggestedLocations && Array.isArray(data.suggestedLocations) && data.suggestedLocations.length > 0) {
          return data.suggestedLocations.map((item: any, idx: number) => {
            const lat = Number(item.latitude) || 30.0;
            const lng = Number(item.longitude) || 79.0;
            const isHigh = lat > 30.45 || (item.placeAddress && /chamoli|rudraprayag|uttarkashi|chopta|badrinath|kedarnath/i.test(item.placeAddress));
            const isMid = !isHigh && (lat > 29.3 || (item.placeAddress && /nainital|almora|mussoorie|ranikhet|tehri|pauri/i.test(item.placeAddress)));

            return {
              id: item.eLoc || `mappls_${idx}`,
              placeName: item.placeName || item.poi || cleanQuery,
              placeAddress: item.placeAddress || 'Uttarakhand, India',
              latitude: lat,
              longitude: lng,
              altitudeMeters: isHigh ? 2900 : isMid ? 1800 : 500,
              district: item.district || 'Uttarakhand',
              terrainZone: isHigh ? 'high_altitude' : isMid ? 'mid_hills' : 'foothills',
            };
          });
        }
      }
    } catch {
      // Fallback seamlessly to local gazetteer
    }
  }

  // Local matching against verified Uttarakhand mountain locations
  const filtered = UTTARAKHAND_HUBS.filter(
    (hub) =>
      hub.placeName.toLowerCase().includes(cleanQuery) ||
      hub.placeAddress.toLowerCase().includes(cleanQuery) ||
      hub.district.toLowerCase().includes(cleanQuery)
  );

  return filtered.length > 0 ? filtered : UTTARAKHAND_HUBS.slice(0, 6);
}

/**
 * Calculates driving distance and altitude profile between Origin and Destination
 */
export async function calculateMapplsRoute(
  origin: MapplsPlace,
  destination: MapplsPlace,
  apiKey?: string
): Promise<MapplsRouteResult> {
  const activeKey = apiKey || getStoredMapplsKey();

  // Try live Mappls Direction API if key is present
  if (activeKey) {
    try {
      const url = `https://apis.mappls.com/advancedmaps/v1/${activeKey}/route_eta/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?geometries=polyline&overview=full`;
      const response = await fetch(url, { signal: AbortSignal.timeout(4000) });
      if (response.ok) {
        const data = await response.json();
        const route = data.routes?.[0];
        if (route) {
          const distanceMeters = route.distance || 0;
          const durationSeconds = route.duration || 0;
          const oneWayKm = Math.max(25, Math.round(distanceMeters / 1000));
          const roundTrip = oneWayKm * 2;

          const higherAltitude = Math.max(origin.altitudeMeters, destination.altitudeMeters);
          const terrainZone: 'foothills' | 'mid_hills' | 'high_altitude' =
            higherAltitude >= 2400
              ? 'high_altitude'
              : higherAltitude >= 1200
              ? 'mid_hills'
              : 'foothills';

          return {
            distanceKm: oneWayKm,
            roundTripKm: roundTrip,
            durationMinutes: Math.round(durationSeconds / 60),
            origin,
            destination,
            terrainZone,
            ascentMeters: Math.abs(destination.altitudeMeters - origin.altitudeMeters),
            isSimulated: false,
            coordinates: [
              [origin.latitude, origin.longitude],
              [destination.latitude, destination.longitude],
            ],
          };
        }
      }
    } catch {
      // Fallback to topographical winding formula
    }
  }

  // Winding mountain road algorithm:
  // Direct euclidean air distance is multiplied by terrain road curvature factor:
  // Foothills: ~1.28x | Mid-Hills: ~1.46x | High Altitude: ~1.65x
  const airDistance = calculateHaversineKm(
    origin.latitude,
    origin.longitude,
    destination.latitude,
    destination.longitude
  );

  const higherAltitude = Math.max(origin.altitudeMeters, destination.altitudeMeters);
  const terrainZone: 'foothills' | 'mid_hills' | 'high_altitude' =
    higherAltitude >= 2400
      ? 'high_altitude'
      : higherAltitude >= 1200
      ? 'mid_hills'
      : 'foothills';

  const roadCurvature = terrainZone === 'high_altitude' ? 1.62 : terrainZone === 'mid_hills' ? 1.44 : 1.28;
  const oneWayKm = Math.max(30, Math.round(airDistance * roadCurvature));
  const roundTripKm = oneWayKm * 2;
  const avgSpeedKmh = terrainZone === 'high_altitude' ? 28 : terrainZone === 'mid_hills' ? 36 : 48;
  const durationMinutes = Math.round((oneWayKm / avgSpeedKmh) * 60);

  // Synthesize an intermediate waypoint for elevation map rendering
  const midLat = (origin.latitude + destination.latitude) / 2 + 0.04;
  const midLng = (origin.longitude + destination.longitude) / 2 - 0.03;

  return {
    distanceKm: oneWayKm,
    roundTripKm,
    durationMinutes,
    origin,
    destination,
    terrainZone,
    ascentMeters: Math.abs(destination.altitudeMeters - origin.altitudeMeters),
    isSimulated: true,
    coordinates: [
      [origin.latitude, origin.longitude],
      [midLat, midLng],
      [destination.latitude, destination.longitude],
    ],
  };
}
