/**
 * Kisan Setu - Smart Weather Advisory & Alert Engine
 * Rule-based expert system for agricultural microclimate advisories and procurement logistics.
 * SIH-26032 Architecture
 */

export type WeatherCondition =
  | 'sunny'
  | 'thunderstorm'
  | 'rainy'
  | 'cloudy'
  | 'high_heat'
  | 'high_wind';

export type AdvisorySeverity = 'CRITICAL' | 'WARNING' | 'INFO';

export interface WeatherMetrics {
  centerId: string;
  centerName: string;
  locationName: string;
  temperature: number; // °C
  feelsLike: number;
  rainProbability: number; // % (0-100)
  mandiRainTomorrow: boolean;
  windKm: number; // km/h
  humidity: number; // %
  uvIndex: number;
  pressureHpa: number;
  condition: WeatherCondition;
  lastUpdated: string;
}

export interface HourlyForecastItem {
  time: string; // e.g., '10:00 AM'
  temp: number;
  rainProbability: number;
  condition: WeatherCondition;
  windKm: number;
}

export interface AgriculturalAdvisory {
  id: string;
  category: 'crop_protection' | 'livestock' | 'irrigation' | 'logistics';
  severity: AdvisorySeverity;
  iconType: 'rain' | 'heat' | 'wind' | 'procurement' | 'tarpaulin' | 'check';
  titleKey: 'rainAlert' | 'heatAlert' | 'windAlert' | 'procurementAlert' | 'tarpaulinAlert' | 'favorableCondition';
  messageKey: 'rainAlert' | 'heatAlert' | 'windAlert' | 'procurementAlert' | 'tarpaulinAlert' | 'favorableCondition';
  actionKey: 'rainAlert' | 'heatAlert' | 'windAlert' | 'procurementAlert' | 'tarpaulinAlert' | 'favorableCondition';
  metricTrigger: string;
  affectedCrop?: string;
  affectedVehicle?: string;
}

/**
 * Evaluates weather metrics against agricultural safety thresholds.
 * Thresholds:
 * - Rain Alert: Rain Probability > 60%
 * - High Heat Alert: Temperature > 35°C
 * - High Wind Alert: Wind Speed > 20 km/h
 * - Procurement Alert: Heavy rain expected tomorrow at procurement center
 * - Tarpaulin Transit Alert: Rain risk + Open trolley transport
 */
export function evaluateWeatherAdvisories(
  metrics: WeatherMetrics,
  bookingCrop?: string,
  bookingVehicle?: string
): AgriculturalAdvisory[] {
  const advisories: AgriculturalAdvisory[] = [];

  // 1. Rain Alert Scenario (> 60% probability or active rainstorm)
  if (
    metrics.rainProbability > 60 ||
    metrics.condition === 'thunderstorm' ||
    metrics.condition === 'rainy'
  ) {
    advisories.push({
      id: 'adv-rain-01',
      category: 'crop_protection',
      severity: 'CRITICAL',
      iconType: 'rain',
      titleKey: 'rainAlert',
      messageKey: 'rainAlert',
      actionKey: 'rainAlert',
      metricTrigger: `${metrics.rainProbability}% Precipitation Risk`,
      affectedCrop: bookingCrop || 'PADDY'
    });
  }

  // 2. High Heat Scenario (> 35°C)
  if (metrics.temperature > 35 || metrics.condition === 'high_heat') {
    advisories.push({
      id: 'adv-heat-01',
      category: 'crop_protection',
      severity: 'WARNING',
      iconType: 'heat',
      titleKey: 'heatAlert',
      messageKey: 'heatAlert',
      actionKey: 'heatAlert',
      metricTrigger: `${metrics.temperature}°C High Temperature`
    });
  }

  // 3. High Wind Scenario (> 20 km/h)
  if (metrics.windKm > 20 || metrics.condition === 'high_wind') {
    advisories.push({
      id: 'adv-wind-01',
      category: 'irrigation',
      severity: 'WARNING',
      iconType: 'wind',
      titleKey: 'windAlert',
      messageKey: 'windAlert',
      actionKey: 'windAlert',
      metricTrigger: `${metrics.windKm} km/h Wind Speed`
    });
  }

  // 4. Operational Procurement Logistics Advisory (Center Heavy Rain)
  if (metrics.mandiRainTomorrow || metrics.rainProbability > 65) {
    advisories.push({
      id: 'adv-proc-01',
      category: 'logistics',
      severity: 'WARNING',
      iconType: 'procurement',
      titleKey: 'procurementAlert',
      messageKey: 'procurementAlert',
      actionKey: 'procurementAlert',
      metricTrigger: `Center Rain Forecast • ${metrics.centerName}`
    });
  }

  // 5. Vehicle Tarpaulin Advisory for Mandi Transit (Tractor or Open Truck in wet conditions)
  if (
    (metrics.rainProbability > 40 || metrics.mandiRainTomorrow) &&
    (!bookingVehicle || bookingVehicle === 'TRACTOR' || bookingVehicle === 'TRUCK')
  ) {
    advisories.push({
      id: 'adv-tarp-01',
      category: 'logistics',
      severity: 'CRITICAL',
      iconType: 'tarpaulin',
      titleKey: 'tarpaulinAlert',
      messageKey: 'tarpaulinAlert',
      actionKey: 'tarpaulinAlert',
      metricTrigger: 'Moisture Protection Warning',
      affectedVehicle: bookingVehicle || 'TRACTOR'
    });
  }

  // 6. Favorable Baseline Condition
  if (advisories.length === 0) {
    advisories.push({
      id: 'adv-favorable-01',
      category: 'crop_protection',
      severity: 'INFO',
      iconType: 'check',
      titleKey: 'favorableCondition',
      messageKey: 'favorableCondition',
      actionKey: 'favorableCondition',
      metricTrigger: 'Clear & Stable Atmosphere'
    });
  }

  return advisories;
}
