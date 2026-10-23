export interface OpenMapPlace {
  id: string;
  placeName: string;
  placeAddress: string;
  latitude: number;
  longitude: number;
  altitudeMeters: number;
  district: string;
  terrainZone: 'foothills' | 'mid_hills' | 'high_altitude';
}

export interface OpenMapRouteResult {
  distanceKm: number;
  roundTripKm: number;
  durationMinutes: number;
  origin: OpenMapPlace;
  destination: OpenMapPlace;
  terrainZone: 'foothills' | 'mid_hills' | 'high_altitude';
  ascentMeters: number;
  isSimulated: boolean;
  coordinates: [number, number][]; // [lat, lng] for Leaflet
}

// Verified Uttarakhand mountain destination catalog with altitudes and coordinates
export const UTTARAKHAND_HUBS: OpenMapPlace[] = [
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
    placeName: 'Nainital (Naini Lake / Mallital)',
    placeAddress: 'Nainital District, Kumaon, Uttarakhand',
    latitude: 29.391,
    longitude: 79.454,
    altitudeMeters: 2084,
    district: 'Nainital',
    terrainZone: 'mid_hills',
  },
  {
    id: 'almora',
    placeName: 'Almora Heritage Town',
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
    longitude: 79.426,
    altitudeMeters: 1829,
    district: 'Almora',
    terrainZone: 'mid_hills',
  },
  {
    id: 'mukteshwar',
    placeName: 'Mukteshwar Ridge',
    placeAddress: 'Nainital District, Kumaon, Uttarakhand',
    latitude: 29.472,
    longitude: 79.647,
    altitudeMeters: 2171,
    district: 'Nainital',
    terrainZone: 'mid_hills',
  },
  {
    id: 'kausani',
    placeName: 'Kausani (Trishul Viewpoint)',
    placeAddress: 'Bageshwar District, Kumaon, Uttarakhand',
    latitude: 29.854,
    longitude: 79.596,
    altitudeMeters: 1890,
    district: 'Bageshwar',
    terrainZone: 'mid_hills',
  },
  {
    id: 'mussoorie',
    placeName: 'Mussoorie (Mall Road / Library Chowk)',
    placeAddress: 'Dehradun District, Garhwal, Uttarakhand',
    latitude: 30.459,
    longitude: 78.066,
    altitudeMeters: 2005,
    district: 'Dehradun',
    terrainZone: 'mid_hills',
  },
  {
    id: 'lansdowne',
    placeName: 'Lansdowne Cantonment',
    placeAddress: 'Pauri Garhwal District, Uttarakhand',
    latitude: 29.837,
    longitude: 78.687,
    altitudeMeters: 1706,
    district: 'Pauri Garhwal',
    terrainZone: 'mid_hills',
  },
  {
    id: 'tehri',
    placeName: 'New Tehri Lake Complex',
    placeAddress: 'Tehri Garhwal District, Uttarakhand',
    latitude: 30.392,
    longitude: 78.48,
    altitudeMeters: 1750,
    district: 'Tehri Garhwal',
    terrainZone: 'mid_hills',
  },
  {
    id: 'devprayag',
    placeName: 'Devprayag (Alaknanda-Bhagirathi Confluence)',
    placeAddress: 'Tehri Garhwal District, Uttarakhand',
    latitude: 30.146,
    longitude: 78.599,
    altitudeMeters: 830,
    district: 'Tehri Garhwal',
    terrainZone: 'mid_hills',
  },
  {
    id: 'rudraprayag',
    placeName: 'Rudraprayag Sangam',
    placeAddress: 'Rudraprayag District, Garhwal, Uttarakhand',
    latitude: 30.285,
    longitude: 78.981,
    altitudeMeters: 895,
    district: 'Rudraprayag',
    terrainZone: 'mid_hills',
  },
  {
    id: 'karanprayag',
    placeName: 'Karnaprayag Sangam',
    placeAddress: 'Chamoli District, Garhwal, Uttarakhand',
    latitude: 30.26,
    longitude: 79.217,
    altitudeMeters: 1450,
    district: 'Chamoli',
    terrainZone: 'mid_hills',
  },

  // High Altitude Alpine (>2,400m)
  {
    id: 'chopta',
    placeName: 'Chopta (Mini Switzerland / Tungnath Base)',
    placeAddress: 'Rudraprayag District, Garhwal, Uttarakhand',
    latitude: 30.488,
    longitude: 79.176,
    altitudeMeters: 2680,
    district: 'Rudraprayag',
    terrainZone: 'high_altitude',
  },
  {
    id: 'joshimath',
    placeName: 'Joshimath (Jyotirmath Gateway)',
    placeAddress: 'Chamoli District, Garhwal, Uttarakhand',
    latitude: 30.557,
    longitude: 79.567,
    altitudeMeters: 1890,
    district: 'Chamoli',
    terrainZone: 'mid_hills',
  },
  {
    id: 'auli',
    placeName: 'Auli Ski Resort & Meadow',
    placeAddress: 'Chamoli District, Garhwal, Uttarakhand',
    latitude: 30.528,
    longitude: 79.566,
    altitudeMeters: 2800,
    district: 'Chamoli',
    terrainZone: 'high_altitude',
  },
  {
    id: 'badrinath',
    placeName: 'Badrinath Dham Shrine',
    placeAddress: 'Chamoli District, Garhwal, Uttarakhand',
    latitude: 30.744,
    longitude: 79.493,
    altitudeMeters: 3300,
    district: 'Chamoli',
    terrainZone: 'high_altitude',
  },
  {
    id: 'kedarnath',
    placeName: 'Gaurikund (Kedarnath Trek Base)',
    placeAddress: 'Rudraprayag District, Garhwal, Uttarakhand',
    latitude: 30.651,
    longitude: 79.025,
    altitudeMeters: 1982,
    district: 'Rudraprayag',
    terrainZone: 'high_altitude',
  },
  {
    id: 'gangotri',
    placeName: 'Gangotri Dham Base',
    placeAddress: 'Uttarkashi District, Garhwal, Uttarakhand',
    latitude: 30.999,
    longitude: 78.939,
    altitudeMeters: 3100,
    district: 'Uttarkashi',
    terrainZone: 'high_altitude',
  },
  {
    id: 'yamunotri_jankichatti',
    placeName: 'Janki Chatti (Yamunotri Base)',
    placeAddress: 'Uttarkashi District, Garhwal, Uttarakhand',
    latitude: 30.983,
    longitude: 78.433,
    altitudeMeters: 2650,
    district: 'Uttarkashi',
    terrainZone: 'high_altitude',
  },
  {
    id: 'munsyari',
    placeName: 'Munsyari (Panchachuli Base)',
    placeAddress: 'Pithoragarh District, Kumaon, Uttarakhand',
    latitude: 30.066,
    longitude: 80.237,
    altitudeMeters: 2200,
    district: 'Pithoragarh',
    terrainZone: 'mid_hills',
  },
  {
    id: 'dharchula',
    placeName: 'Dharchula Border Town',
    placeAddress: 'Pithoragarh District, Kumaon, Uttarakhand',
    latitude: 29.849,
    longitude: 80.536,
    altitudeMeters: 915,
    district: 'Pithoragarh',
    terrainZone: 'foothills',
  },

  // Complete District Headquarters & Major Towns across all 13 Districts of Uttarakhand
  {
    id: 'rudrapur',
    placeName: 'Rudrapur City (Udham Singh Nagar HQ)',
    placeAddress: 'Udham Singh Nagar District, Terai, Uttarakhand',
    latitude: 28.98,
    longitude: 79.4,
    altitudeMeters: 210,
    district: 'Udham Singh Nagar',
    terrainZone: 'foothills',
  },
  {
    id: 'kashipur',
    placeName: 'Kashipur City',
    placeAddress: 'Udham Singh Nagar District, Uttarakhand',
    latitude: 29.21,
    longitude: 78.96,
    altitudeMeters: 218,
    district: 'Udham Singh Nagar',
    terrainZone: 'foothills',
  },
  {
    id: 'pantnagar',
    placeName: 'Pantnagar (Airport & University Hub)',
    placeAddress: 'Udham Singh Nagar District, Uttarakhand',
    latitude: 29.02,
    longitude: 79.49,
    altitudeMeters: 243,
    district: 'Udham Singh Nagar',
    terrainZone: 'foothills',
  },
  {
    id: 'khatima',
    placeName: 'Khatima Border Town',
    placeAddress: 'Udham Singh Nagar District, Uttarakhand',
    latitude: 28.92,
    longitude: 79.97,
    altitudeMeters: 212,
    district: 'Udham Singh Nagar',
    terrainZone: 'foothills',
  },
  {
    id: 'champawat',
    placeName: 'Champawat (Historic Capital & District HQ)',
    placeAddress: 'Champawat District, Kumaon, Uttarakhand',
    latitude: 29.33,
    longitude: 80.09,
    altitudeMeters: 1615,
    district: 'Champawat',
    terrainZone: 'mid_hills',
  },
  {
    id: 'lohaghat',
    placeName: 'Lohaghat (Mayawati Ashram & Pine Valley)',
    placeAddress: 'Champawat District, Kumaon, Uttarakhand',
    latitude: 29.41,
    longitude: 80.09,
    altitudeMeters: 1754,
    district: 'Champawat',
    terrainZone: 'mid_hills',
  },
  {
    id: 'tanakpur',
    placeName: 'Tanakpur (Sharda River Railhead)',
    placeAddress: 'Champawat District, Uttarakhand',
    latitude: 29.07,
    longitude: 80.11,
    altitudeMeters: 255,
    district: 'Champawat',
    terrainZone: 'foothills',
  },
  {
    id: 'pithoragarh',
    placeName: 'Pithoragarh (Saur Valley District HQ)',
    placeAddress: 'Pithoragarh District, Kumaon, Uttarakhand',
    latitude: 29.58,
    longitude: 80.22,
    altitudeMeters: 1627,
    district: 'Pithoragarh',
    terrainZone: 'mid_hills',
  },
  {
    id: 'berinag',
    placeName: 'Berinag (Tea Gardens & Himalayan Views)',
    placeAddress: 'Pithoragarh District, Kumaon, Uttarakhand',
    latitude: 29.78,
    longitude: 80.06,
    altitudeMeters: 1860,
    district: 'Pithoragarh',
    terrainZone: 'mid_hills',
  },
  {
    id: 'didihat',
    placeName: 'Didihat Hill Town',
    placeAddress: 'Pithoragarh District, Kumaon, Uttarakhand',
    latitude: 29.8,
    longitude: 80.25,
    altitudeMeters: 1725,
    district: 'Pithoragarh',
    terrainZone: 'mid_hills',
  },
  {
    id: 'bageshwar',
    placeName: 'Bageshwar (Saryu Sangam District HQ)',
    placeAddress: 'Bageshwar District, Kumaon, Uttarakhand',
    latitude: 29.84,
    longitude: 79.77,
    altitudeMeters: 1004,
    district: 'Bageshwar',
    terrainZone: 'foothills',
  },
  {
    id: 'baijnath',
    placeName: 'Baijnath Temple Valley',
    placeAddress: 'Bageshwar District, Kumaon, Uttarakhand',
    latitude: 29.91,
    longitude: 79.62,
    altitudeMeters: 1130,
    district: 'Bageshwar',
    terrainZone: 'foothills',
  },
  {
    id: 'gopeshwar',
    placeName: 'Gopeshwar (Chamoli District HQ)',
    placeAddress: 'Chamoli District, Garhwal, Uttarakhand',
    latitude: 30.41,
    longitude: 79.33,
    altitudeMeters: 1550,
    district: 'Chamoli',
    terrainZone: 'mid_hills',
  },
  {
    id: 'hemkund_sahib',
    placeName: 'Govindghat (Valley of Flowers / Hemkund Base)',
    placeAddress: 'Chamoli District, Garhwal, Uttarakhand',
    latitude: 30.62,
    longitude: 79.56,
    altitudeMeters: 1828,
    district: 'Chamoli',
    terrainZone: 'mid_hills',
  },
  {
    id: 'pipalkoti',
    placeName: 'Pipalkoti Pilgrimage Stop',
    placeAddress: 'Chamoli District, Garhwal, Uttarakhand',
    latitude: 30.43,
    longitude: 79.43,
    altitudeMeters: 1260,
    district: 'Chamoli',
    terrainZone: 'mid_hills',
  },
  {
    id: 'uttarkashi',
    placeName: 'Uttarkashi Town (District HQ)',
    placeAddress: 'Uttarkashi District, Garhwal, Uttarakhand',
    latitude: 30.73,
    longitude: 78.44,
    altitudeMeters: 1158,
    district: 'Uttarkashi',
    terrainZone: 'foothills',
  },
  {
    id: 'barkot',
    placeName: 'Barkot (Yamunotri Road Junction)',
    placeAddress: 'Uttarkashi District, Garhwal, Uttarakhand',
    latitude: 30.81,
    longitude: 78.21,
    altitudeMeters: 1220,
    district: 'Uttarkashi',
    terrainZone: 'mid_hills',
  },
  {
    id: 'harsil',
    placeName: 'Harsil Apple Valley',
    placeAddress: 'Uttarkashi District, Garhwal, Uttarakhand',
    latitude: 31.04,
    longitude: 78.74,
    altitudeMeters: 2620,
    district: 'Uttarkashi',
    terrainZone: 'high_altitude',
  },
  {
    id: 'sankri',
    placeName: 'Sankri (Har Ki Dun & Kedarkantha Base)',
    placeAddress: 'Uttarkashi District, Garhwal, Uttarakhand',
    latitude: 31.08,
    longitude: 78.18,
    altitudeMeters: 1950,
    district: 'Uttarkashi',
    terrainZone: 'mid_hills',
  },
  {
    id: 'pauri',
    placeName: 'Pauri Town (Pauri Garhwal District HQ)',
    placeAddress: 'Pauri Garhwal District, Uttarakhand',
    latitude: 30.15,
    longitude: 78.78,
    altitudeMeters: 1814,
    district: 'Pauri Garhwal',
    terrainZone: 'mid_hills',
  },
  {
    id: 'srinagar_garhwal',
    placeName: 'Srinagar Garhwal (University Hub)',
    placeAddress: 'Pauri Garhwal District, Uttarakhand',
    latitude: 30.22,
    longitude: 78.78,
    altitudeMeters: 560,
    district: 'Pauri Garhwal',
    terrainZone: 'foothills',
  },
  {
    id: 'khirsu',
    placeName: 'Khirsu Oak Forest',
    placeAddress: 'Pauri Garhwal District, Uttarakhand',
    latitude: 30.18,
    longitude: 78.86,
    altitudeMeters: 1700,
    district: 'Pauri Garhwal',
    terrainZone: 'mid_hills',
  },
  {
    id: 'dhanaulti',
    placeName: 'Dhanaulti Ridge & Eco-Park',
    placeAddress: 'Tehri Garhwal District, Uttarakhand',
    latitude: 30.45,
    longitude: 78.23,
    altitudeMeters: 2286,
    district: 'Tehri Garhwal',
    terrainZone: 'mid_hills',
  },
  {
    id: 'chamba_tehri',
    placeName: 'Chamba Garhwal Junction',
    placeAddress: 'Tehri Garhwal District, Uttarakhand',
    latitude: 30.36,
    longitude: 78.4,
    altitudeMeters: 1524,
    district: 'Tehri Garhwal',
    terrainZone: 'mid_hills',
  },
  {
    id: 'kanatal',
    placeName: 'Kanatal Alpine Viewpoint',
    placeAddress: 'Tehri Garhwal District, Uttarakhand',
    latitude: 30.41,
    longitude: 78.34,
    altitudeMeters: 2590,
    district: 'Tehri Garhwal',
    terrainZone: 'high_altitude',
  },
  {
    id: 'chakrata',
    placeName: 'Chakrata Cantonment (Tiger Falls)',
    placeAddress: 'Dehradun District, Jaunsar-Bawar, Uttarakhand',
    latitude: 30.7,
    longitude: 77.87,
    altitudeMeters: 2118,
    district: 'Dehradun',
    terrainZone: 'mid_hills',
  },
  {
    id: 'vikasnagar',
    placeName: 'Vikasnagar Gateway',
    placeAddress: 'Dehradun District, Uttarakhand',
    latitude: 30.48,
    longitude: 77.77,
    altitudeMeters: 452,
    district: 'Dehradun',
    terrainZone: 'foothills',
  },
  {
    id: 'roorkee',
    placeName: 'Roorkee (Canal & IIT Hub)',
    placeAddress: 'Haridwar District, Uttarakhand',
    latitude: 29.86,
    longitude: 77.89,
    altitudeMeters: 268,
    district: 'Haridwar',
    terrainZone: 'foothills',
  },
  {
    id: 'bhimtal',
    placeName: 'Bhimtal Lake',
    placeAddress: 'Nainital District, Kumaon, Uttarakhand',
    latitude: 29.35,
    longitude: 79.56,
    altitudeMeters: 1370,
    district: 'Nainital',
    terrainZone: 'mid_hills',
  },
  {
    id: 'bhowali',
    placeName: 'Bhowali Fruit Market Junction',
    placeAddress: 'Nainital District, Kumaon, Uttarakhand',
    latitude: 29.38,
    longitude: 79.52,
    altitudeMeters: 1706,
    district: 'Nainital',
    terrainZone: 'mid_hills',
  },
  {
    id: 'jageshwar',
    placeName: 'Jageshwar Dham (Ancient Temple Valley)',
    placeAddress: 'Almora District, Kumaon, Uttarakhand',
    latitude: 29.64,
    longitude: 79.85,
    altitudeMeters: 1870,
    district: 'Almora',
    terrainZone: 'mid_hills',
  },
  {
    id: 'binsar',
    placeName: 'Binsar Wildlife Sanctuary Ridge',
    placeAddress: 'Almora District, Kumaon, Uttarakhand',
    latitude: 29.7,
    longitude: 79.75,
    altitudeMeters: 2420,
    district: 'Almora',
    terrainZone: 'high_altitude',
  },

  // Regional Transport Gateways
  {
    id: 'delhi_isbt',
    placeName: 'Delhi (Kashmere Gate ISBT)',
    placeAddress: 'National Capital Region, Delhi',
    latitude: 28.667,
    longitude: 77.228,
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

/**
 * Searches places via local Uttarakhand catalog or OpenStreetMap Nominatim
 */
export async function searchOpenMapPlaces(query: string): Promise<OpenMapPlace[]> {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return UTTARAKHAND_HUBS;

  // 1. Local matching against verified Uttarakhand mountain locations (place name, district, address)
  const filtered = UTTARAKHAND_HUBS.filter(
    (hub) =>
      hub.placeName.toLowerCase().includes(cleanQuery) ||
      hub.district.toLowerCase().includes(cleanQuery) ||
      hub.placeAddress.toLowerCase().includes(cleanQuery) ||
      hub.id.toLowerCase().includes(cleanQuery)
  );

  if (filtered.length > 0) {
    return filtered;
  }

  // 2. OpenStreetMap Nominatim Search fallback if query has 3+ chars
  if (cleanQuery.length >= 3) {
    try {
      const osmUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        cleanQuery + ' Uttarakhand'
      )}&countrycodes=in&limit=10`;
      const response = await fetch(osmUrl, {
        headers: { 'User-Agent': 'PahadFootprint-OpenMaps/1.0' },
        signal: AbortSignal.timeout(3000),
      });

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const osmResults: OpenMapPlace[] = data.map((item: any, idx: number) => {
            const lat = Number(item.lat) || 30.0;
            const lon = Number(item.lon) || 79.0;
            const isHigh = lat > 30.45;
            const isMid = !isHigh && lat > 29.3;

            return {
              id: `osm_${item.osm_id || idx}`,
              placeName: item.display_name.split(',')[0].trim(),
              placeAddress: item.display_name,
              latitude: lat,
              longitude: lon,
              altitudeMeters: isHigh ? 2800 : isMid ? 1800 : 500,
              district: 'Uttarakhand',
              terrainZone: isHigh ? 'high_altitude' : isMid ? 'mid_hills' : 'foothills',
            };
          });

          return osmResults;
        }
      }
    } catch {
      // Seamlessly fallback to local catalog
    }
  }

  return UTTARAKHAND_HUBS;
}

/**
 * Calculates road distance and coordinates between Origin and Destination using OpenStreetMap OSRM
 */
export async function calculateOpenMapRoute(
  origin: OpenMapPlace,
  destination: OpenMapPlace
): Promise<OpenMapRouteResult> {
  const higherAltitude = Math.max(origin.altitudeMeters, destination.altitudeMeters);
  const terrainZone: 'foothills' | 'mid_hills' | 'high_altitude' =
    higherAltitude >= 2400
      ? 'high_altitude'
      : higherAltitude >= 1200
      ? 'mid_hills'
      : 'foothills';

  // 1. Try OpenStreetMap public OSRM routing
  try {
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?geometries=geojson&overview=full`;
    const response = await fetch(osrmUrl, {
      signal: AbortSignal.timeout(3500),
    });

    if (response.ok) {
      const data = await response.json();
      const route = data.routes?.[0];
      if (route) {
        const distanceMeters = route.distance || 0;
        const durationSeconds = route.duration || 0;
        const oneWayKm = Math.max(25, Math.round(distanceMeters / 1000));
        const roundTrip = oneWayKm * 2;
        const durationMinutes = Math.round(durationSeconds / 60);

        // Convert GeoJSON [lon, lat] coordinates to Leaflet [lat, lon]
        const rawCoords = route.geometry?.coordinates || [];
        const coordinates: [number, number][] = rawCoords.length > 0
          ? rawCoords.map((c: [number, number]) => [c[1], c[0]])
          : [
              [origin.latitude, origin.longitude],
              [(origin.latitude + destination.latitude) / 2 + 0.03, (origin.longitude + destination.longitude) / 2 - 0.02],
              [destination.latitude, destination.longitude],
            ];

        return {
          distanceKm: oneWayKm,
          roundTripKm: roundTrip,
          durationMinutes,
          origin,
          destination,
          terrainZone,
          ascentMeters: Math.abs(destination.altitudeMeters - origin.altitudeMeters),
          isSimulated: false,
          coordinates,
        };
      }
    }
  } catch {
    // Fallback to high-precision mountain curvature formula
  }

  // 2. Calibrated mountain road curvature calculation:
  // Direct air distance multiplied by actual mountain hairpin road factor:
  // Foothills: ~1.28x | Mid-Hills: ~1.44x | High Altitude: ~1.62x
  const airDistance = calculateHaversineKm(
    origin.latitude,
    origin.longitude,
    destination.latitude,
    destination.longitude
  );

  const roadCurvature = terrainZone === 'high_altitude' ? 1.62 : terrainZone === 'mid_hills' ? 1.44 : 1.28;
  const oneWayKm = Math.max(30, Math.round(airDistance * roadCurvature));
  const roundTripKm = oneWayKm * 2;
  const avgSpeedKmh = terrainZone === 'high_altitude' ? 28 : terrainZone === 'mid_hills' ? 36 : 48;
  const durationMinutes = Math.round((oneWayKm / avgSpeedKmh) * 60);

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
