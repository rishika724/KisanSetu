'use client';

import { useState, useMemo, useCallback } from 'react';
import { useSyncStore } from './syncStore';
import {
  WeatherMetrics,
  WeatherCondition,
  HourlyForecastItem,
  AgriculturalAdvisory,
  evaluateWeatherAdvisories
} from './advisoryEngine';

export type SimulationScenario =
  | 'rain'
  | 'heat'
  | 'wind'
  | 'mandiRain'
  | 'favorable'
  | 'none';

export interface CenterLocationInfo {
  id: string;
  name: string;
  district: string;
  distanceKm: number;
  baseMetrics: WeatherMetrics;
}

export const REGISTERED_MANDI_LOCATIONS: Record<string, CenterLocationInfo> = {
  'center-01': {
    id: 'center-01',
    name: 'Kota Mandi (Ranpur Yard #1)',
    district: 'Kota, Rajasthan',
    distanceKm: 4.2,
    baseMetrics: {
      centerId: 'center-01',
      centerName: 'Kota Mandi Yard #1',
      locationName: 'Ranpur Agrico Complex, Kota',
      temperature: 32,
      feelsLike: 37,
      rainProbability: 85,
      mandiRainTomorrow: true,
      windKm: 18,
      humidity: 78,
      uvIndex: 4,
      pressureHpa: 1008,
      condition: 'thunderstorm',
      lastUpdated: 'Live Radar (5 mins ago)'
    }
  },
  'center-02': {
    id: 'center-02',
    name: 'Karnal Mandi (Grain Market)',
    district: 'Karnal, Haryana',
    distanceKm: 7.5,
    baseMetrics: {
      centerId: 'center-02',
      centerName: 'Karnal Mandi Gate #2',
      locationName: 'Sector 4 Grain Yard, Karnal',
      temperature: 38,
      feelsLike: 43,
      rainProbability: 15,
      mandiRainTomorrow: false,
      windKm: 14,
      humidity: 42,
      uvIndex: 9,
      pressureHpa: 1012,
      condition: 'high_heat',
      lastUpdated: 'Live Radar (12 mins ago)'
    }
  },
  'center-03': {
    id: 'center-03',
    name: 'Bhopal Mandi (Karond Yard)',
    district: 'Bhopal, Madhya Pradesh',
    distanceKm: 11.0,
    baseMetrics: {
      centerId: 'center-03',
      centerName: 'Karond Mandi Hub',
      locationName: 'Berasia Road Yard, Bhopal',
      temperature: 30,
      feelsLike: 32,
      rainProbability: 35,
      mandiRainTomorrow: false,
      windKm: 26,
      humidity: 62,
      uvIndex: 6,
      pressureHpa: 1005,
      condition: 'high_wind',
      lastUpdated: 'Live Radar (8 mins ago)'
    }
  },
  'center-04': {
    id: 'center-04',
    name: 'Indore Mandi (Choithram)',
    district: 'Indore, Madhya Pradesh',
    distanceKm: 18.3,
    baseMetrics: {
      centerId: 'center-04',
      centerName: 'Choithram Mandi Complex',
      locationName: 'AB Road Agrico, Indore',
      temperature: 28,
      feelsLike: 29,
      rainProbability: 10,
      mandiRainTomorrow: false,
      windKm: 12,
      humidity: 55,
      uvIndex: 6,
      pressureHpa: 1014,
      condition: 'sunny',
      lastUpdated: 'Live Radar (2 mins ago)'
    }
  }
};

/**
 * Generates dynamic 24-hour microclimate forecast based on current weather condition.
 */
function generateHourlyForecast(condition: WeatherCondition, baseTemp: number): HourlyForecastItem[] {
  const times = ['08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM', '08:00 PM'];
  return times.map((time, idx) => {
    let rainProb = 15;
    let cond: WeatherCondition = 'sunny';
    let temp = baseTemp + (idx === 2 || idx === 3 ? 3 : -idx);

    if (condition === 'thunderstorm' || condition === 'rainy') {
      rainProb = Math.min(95, 70 + idx * 4);
      cond = idx > 1 ? 'thunderstorm' : 'rainy';
    } else if (condition === 'high_heat') {
      rainProb = 5;
      temp = Math.max(36, baseTemp + (idx <= 3 ? idx : 2));
      cond = 'high_heat';
    } else if (condition === 'high_wind') {
      rainProb = 25;
      cond = 'high_wind';
    } else {
      rainProb = 10;
      cond = idx % 2 === 0 ? 'sunny' : 'cloudy';
    }

    return {
      time,
      temp: Math.round(temp),
      rainProbability: rainProb,
      condition: cond,
      windKm: condition === 'high_wind' ? 24 + idx : 12 + idx
    };
  });
}

/**
 * Custom hook providing weather telemetry, reactive advisories, and SIH simulation triggers.
 * Includes future-ready abstraction for OpenWeatherMap / AccuWeather integration.
 */
export function useWeatherAdvisory() {
  const sync = useSyncStore();
  const activeBooking = sync.activeBooking;

  // Selected Mandi procurement center
  const [selectedCenterId, setSelectedCenterId] = useState<string>('center-01');

  // Active Simulation Scenario override
  const [simulationScenario, setSimulationScenario] = useState<SimulationScenario>('none');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Future-ready API status
  const [apiMode] = useState<'mock_service' | 'live_rest'>('mock_service');

  const centerInfo = REGISTERED_MANDI_LOCATIONS[selectedCenterId] || REGISTERED_MANDI_LOCATIONS['center-01'];

  // Calculate current effective weather metrics based on base center + simulation scenario
  const effectiveWeather: WeatherMetrics = useMemo(() => {
    const base = { ...centerInfo.baseMetrics };

    if (simulationScenario === 'rain') {
      return {
        ...base,
        temperature: 28,
        feelsLike: 31,
        rainProbability: 88,
        mandiRainTomorrow: true,
        windKm: 18,
        humidity: 82,
        condition: 'thunderstorm'
      };
    }

    if (simulationScenario === 'heat') {
      return {
        ...base,
        temperature: 41,
        feelsLike: 46,
        rainProbability: 8,
        mandiRainTomorrow: false,
        windKm: 11,
        humidity: 32,
        condition: 'high_heat'
      };
    }

    if (simulationScenario === 'wind') {
      return {
        ...base,
        temperature: 29,
        feelsLike: 30,
        rainProbability: 30,
        mandiRainTomorrow: false,
        windKm: 28,
        humidity: 58,
        condition: 'high_wind'
      };
    }

    if (simulationScenario === 'mandiRain') {
      return {
        ...base,
        temperature: 30,
        feelsLike: 34,
        rainProbability: 75,
        mandiRainTomorrow: true,
        windKm: 16,
        humidity: 76,
        condition: 'rainy'
      };
    }

    if (simulationScenario === 'favorable') {
      return {
        ...base,
        temperature: 27,
        feelsLike: 28,
        rainProbability: 10,
        mandiRainTomorrow: false,
        windKm: 12,
        humidity: 48,
        condition: 'sunny'
      };
    }

    return base;
  }, [centerInfo, simulationScenario]);

  // Reactive Advisory Engine Execution
  const advisories: AgriculturalAdvisory[] = useMemo(() => {
    return evaluateWeatherAdvisories(
      effectiveWeather,
      activeBooking?.crop,
      activeBooking?.vehicleType
    );
  }, [effectiveWeather, activeBooking]);

  // Hourly Microclimate Strip
  const hourlyForecast = useMemo(() => {
    return generateHourlyForecast(effectiveWeather.condition, effectiveWeather.temperature);
  }, [effectiveWeather.condition, effectiveWeather.temperature]);

  // Refresh Trigger (Simulates network sync or API poll)
  const refreshWeather = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  }, []);

  return {
    selectedCenterId,
    setSelectedCenterId,
    centerInfo,
    weather: effectiveWeather,
    advisories,
    hourlyForecast,
    simulationScenario,
    setSimulationScenario,
    isRefreshing,
    refreshWeather,
    activeBooking,
    apiMode
  };
}
