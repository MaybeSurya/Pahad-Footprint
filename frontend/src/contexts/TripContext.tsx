'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  CalculationInput,
  CalculationOutput,
  PrivateVehicleType,
  FuelType,
  TransitMode,
  TransportCategory,
} from '../types';
import { calculateTrip } from '../lib/api';
import { OpenMapRouteResult, UTTARAKHAND_HUBS } from '../lib/openmaps';

export const PRIVATE_VEHICLE_MATRIX: Record<PrivateVehicleType, Partial<Record<FuelType, number>>> = {
  suv: { diesel: 195, petrol: 185, cng: 135, lpg: 145, hybrid: 110, ev: 50 },
  sedan: { diesel: 155, petrol: 140, cng: 110, lpg: 120, hybrid: 90, ev: 42 },
  hatchback: { diesel: 130, petrol: 120, cng: 95, lpg: 105, hybrid: 78, ev: 36 },
  coupe: { diesel: 165, petrol: 155, cng: 125, lpg: 135, hybrid: 100, ev: 48 },
  motorcycle: { petrol: 55, hybrid: 38, ev: 18 },
  scooty: { petrol: 50, hybrid: 35, ev: 16 },
  bicycle: { pedal: 0, ev: 8 },
};

export const ALLOWED_FUELS_BY_VEHICLE: Record<PrivateVehicleType, FuelType[]> = {
  bicycle: ['pedal', 'ev'],
  motorcycle: ['petrol', 'hybrid', 'ev'],
  scooty: ['petrol', 'hybrid', 'ev'],
  suv: ['diesel', 'petrol', 'cng', 'lpg', 'hybrid', 'ev'],
  sedan: ['diesel', 'petrol', 'cng', 'lpg', 'hybrid', 'ev'],
  hatchback: ['diesel', 'petrol', 'cng', 'lpg', 'hybrid', 'ev'],
  coupe: ['diesel', 'petrol', 'cng', 'lpg', 'hybrid', 'ev'],
};

export function getPassengerLimits(
  category: TransportCategory,
  vehicle: PrivateVehicleType,
  transit: TransitMode
) {
  if (category === 'two_wheeler') {
    if (vehicle === 'bicycle') {
      return { min: 1, max: 1, label: 'Max 1 (Bicycle Single Rider)' };
    }
    return { min: 1, max: 2, label: 'Max 2 (Rider + Pillion)' };
  }
  if (category === 'private') {
    switch (vehicle) {
      case 'bicycle':
        return { min: 1, max: 1, label: 'Max 1 (Bicycle Single Rider)' };
      case 'motorcycle':
      case 'scooty':
        return { min: 1, max: 2, label: 'Max 2 (Rider + Pillion)' };
      case 'coupe':
        return { min: 1, max: 2, label: 'Max 2 (Coupe 2-Seater)' };
      case 'hatchback':
        return { min: 1, max: 4, label: 'Max 4 (Hatchback Cabin)' };
      case 'sedan':
        return { min: 1, max: 5, label: 'Max 5 (Sedan Cabin)' };
      case 'suv':
      default:
        return { min: 1, max: 7, label: 'Max 7 (SUV 4×4 Cabin)' };
    }
  } else {
    switch (transit) {
      case 'helicopter':
        return { min: 1, max: 6, label: 'Max 6 (Heli Alpine Payload)' };
      case 'bus':
        return { min: 1, max: 45, label: 'Max 45 (Bus Group)' };
      case 'train':
        return { min: 1, max: 20, label: 'Max 20 (Rail Party)' };
      case 'flight':
      default:
        return { min: 1, max: 10, label: 'Max 10 (Flight Group)' };
    }
  }
}

interface TripContextType {
  // Step 1: Route & Elevation
  distance: number;
  setDistance: (d: number) => void;
  terrain: 'foothills' | 'mid_hills' | 'high_altitude';
  setTerrain: (t: 'foothills' | 'mid_hills' | 'high_altitude') => void;
  selectedRoute: OpenMapRouteResult | null;
  setSelectedRoute: (r: OpenMapRouteResult | null) => void;

  // Step 2: Transportation
  transportCategory: TransportCategory;
  setTransportCategory: (c: TransportCategory) => void;
  vehicleType: PrivateVehicleType;
  setVehicleType: (v: PrivateVehicleType) => void;
  fuelType: FuelType;
  setFuelType: (f: FuelType) => void;
  transitMode: TransitMode;
  setTransitMode: (m: TransitMode) => void;
  transportMode: string;
  passengers: number;
  setPassengers: React.Dispatch<React.SetStateAction<number>>;
  currentLimit: { min: number; max: number; label: string };
  handleSelectVehicle: (v: PrivateVehicleType) => void;
  handleSelectCategory: (cat: TransportCategory) => void;

  // Step 3: Lodging
  nights: number;
  setNights: (n: number) => void;
  accommodation: 'luxury' | 'hotel' | 'homestay' | 'camp';
  setAccommodation: (a: 'luxury' | 'hotel' | 'homestay' | 'camp') => void;

  // Step 4: Eco-Habits
  habitWater: boolean;
  setHabitWater: (w: boolean) => void;
  habitFood: boolean;
  setHabitFood: (f: boolean) => void;

  // Calculation Results
  calcResult: CalculationOutput | null;
  isCalculating: boolean;
  currentInput: CalculationInput;
  resetTrip: () => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

const STORAGE_KEY = 'pahad_trip_onboarding_v1';

export const TripProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [distance, setDistance] = useState<number>(320);
  const [terrain, setTerrain] = useState<'foothills' | 'mid_hills' | 'high_altitude'>('mid_hills');
  const [selectedRoute, setSelectedRoute] = useState<OpenMapRouteResult | null>(null);

  const [transportCategory, setTransportCategory] = useState<TransportCategory>('two_wheeler');
  const [vehicleType, setVehicleType] = useState<PrivateVehicleType>('motorcycle');
  const [fuelType, setFuelType] = useState<FuelType>('petrol');
  const [transitMode, setTransitMode] = useState<TransitMode>('bus');
  const [passengers, setPassengers] = useState<number>(2);

  const [nights, setNights] = useState<number>(4);
  const [accommodation, setAccommodation] = useState<'luxury' | 'hotel' | 'homestay' | 'camp'>('homestay');

  const [habitWater, setHabitWater] = useState<boolean>(true);
  const [habitFood, setHabitFood] = useState<boolean>(true);

  const [calcResult, setCalcResult] = useState<CalculationOutput | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  // Load initial state from session storage if available
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.distance) setDistance(parsed.distance);
        if (parsed.terrain) setTerrain(parsed.terrain);
        if (parsed.transportCategory) setTransportCategory(parsed.transportCategory);
        if (parsed.vehicleType) setVehicleType(parsed.vehicleType);
        if (parsed.fuelType) setFuelType(parsed.fuelType);
        if (parsed.transitMode) setTransitMode(parsed.transitMode);
        if (parsed.passengers) setPassengers(parsed.passengers);
        if (parsed.nights) setNights(parsed.nights);
        if (parsed.accommodation) setAccommodation(parsed.accommodation);
        if (parsed.habitWater !== undefined) setHabitWater(parsed.habitWater);
        if (parsed.habitFood !== undefined) setHabitFood(parsed.habitFood);
        if (parsed.selectedRoute) setSelectedRoute(parsed.selectedRoute);
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Save changes to session storage
  useEffect(() => {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          distance,
          terrain,
          transportCategory,
          vehicleType,
          fuelType,
          transitMode,
          passengers,
          nights,
          accommodation,
          habitWater,
          habitFood,
          selectedRoute,
        })
      );
    } catch {
      // Ignore write errors
    }
  }, [
    distance,
    terrain,
    transportCategory,
    vehicleType,
    fuelType,
    transitMode,
    passengers,
    nights,
    accommodation,
    habitWater,
    habitFood,
    selectedRoute,
  ]);

  const transportMode = transportCategory === 'transit' ? transitMode : vehicleType;
  const currentLimit = getPassengerLimits(transportCategory, vehicleType, transitMode);

  // Clamp passengers whenever vehicle or category changes
  useEffect(() => {
    if (passengers > currentLimit.max) {
      setPassengers(currentLimit.max);
    } else if (passengers < currentLimit.min) {
      setPassengers(currentLimit.min);
    }
  }, [transportCategory, vehicleType, transitMode, currentLimit.max, currentLimit.min]);

  const handleSelectVehicle = (v: PrivateVehicleType) => {
    setVehicleType(v);
    const allowed = ALLOWED_FUELS_BY_VEHICLE[v] || ['petrol'];
    if (!allowed.includes(fuelType)) {
      setFuelType(allowed[0]);
    }
  };

  const handleSelectCategory = (cat: TransportCategory) => {
    setTransportCategory(cat);
    if (cat === 'two_wheeler') {
      if (!['motorcycle', 'scooty', 'bicycle'].includes(vehicleType)) {
        setVehicleType('motorcycle');
        if (!ALLOWED_FUELS_BY_VEHICLE['motorcycle'].includes(fuelType)) {
          setFuelType('petrol');
        }
      }
    } else if (cat === 'private') {
      if (!['suv', 'sedan', 'hatchback', 'coupe'].includes(vehicleType)) {
        setVehicleType('suv');
        if (!ALLOWED_FUELS_BY_VEHICLE['suv'].includes(fuelType)) {
          setFuelType('diesel');
        }
      }
    }
  };

  const currentInput: CalculationInput = {
    distanceKm: distance,
    terrainZone: terrain,
    transportCategory,
    vehicleType,
    fuelType,
    transitMode,
    transportMode,
    passengers,
    nights,
    accommodationType: accommodation,
    habitWater,
    habitFood,
  };

  // Recalculate whenever any input changes
  useEffect(() => {
    setIsCalculating(true);
    calculateTrip(currentInput)
      .then((res) => {
        setCalcResult(res);
        setIsCalculating(false);
      })
      .catch(() => {
        setIsCalculating(false);
      });
  }, [
    distance,
    terrain,
    transportCategory,
    vehicleType,
    fuelType,
    transitMode,
    transportMode,
    passengers,
    nights,
    accommodation,
    habitWater,
    habitFood,
  ]);

  const resetTrip = () => {
    setDistance(320);
    setTerrain('mid_hills');
    setTransportCategory('two_wheeler');
    setVehicleType('motorcycle');
    setFuelType('petrol');
    setPassengers(2);
    setNights(4);
    setAccommodation('homestay');
    setHabitWater(true);
    setHabitFood(true);
    setSelectedRoute(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  return (
    <TripContext.Provider
      value={{
        distance,
        setDistance,
        terrain,
        setTerrain,
        selectedRoute,
        setSelectedRoute,
        transportCategory,
        setTransportCategory,
        vehicleType,
        setVehicleType,
        fuelType,
        setFuelType,
        transitMode,
        setTransitMode,
        transportMode,
        passengers,
        setPassengers,
        currentLimit,
        handleSelectVehicle,
        handleSelectCategory,
        nights,
        setNights,
        accommodation,
        setAccommodation,
        habitWater,
        setHabitWater,
        habitFood,
        setHabitFood,
        calcResult,
        isCalculating,
        currentInput,
        resetTrip,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};
