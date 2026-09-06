'use client';

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  useWeatherAdvisory,
  REGISTERED_MANDI_LOCATIONS
} from '../lib/useWeatherAdvisory';
import {
  CloudRain,
  CloudLightning,
  Sun,
  Wind,
  Droplets,
  ThermometerSun,
  AlertTriangle,
  Umbrella,
  Flame,
  CheckCircle2,
  MapPin,
  RefreshCw,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface FarmerWeatherWidgetProps {
  onOpenDashboard?: () => void;
}

export function FarmerWeatherWidget({ onOpenDashboard }: FarmerWeatherWidgetProps) {
  const { t } = useLanguage();
  const {
    selectedCenterId,
    setSelectedCenterId,
    centerInfo,
    weather,
    advisories,
    isRefreshing,
    refreshWeather
  } = useWeatherAdvisory();

  // Top critical or warning advisory to display in the banner
  const primaryAdvisory = advisories[0];

  const isCritical = primaryAdvisory?.severity === 'CRITICAL';
  const isWarning = primaryAdvisory?.severity === 'WARNING';

  const alertTitle = primaryAdvisory
    ? t.weatherInsights[primaryAdvisory.titleKey]?.title || primaryAdvisory.titleKey
    : t.weatherInsights.favorableCondition.title;

  const alertMsg = primaryAdvisory
    ? t.weatherInsights[primaryAdvisory.messageKey]?.message || primaryAdvisory.messageKey
    : t.weatherInsights.favorableCondition.message;

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-300 shadow-md p-5 sm:p-6 space-y-5">
      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-900 text-white rounded-2xl shadow-xs">
            <CloudRain className="w-6 h-6 text-blue-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                {t.weatherInsights.title}
              </h3>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-900 text-[10px] font-black rounded uppercase">
                Live
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              {t.weatherInsights.subtitle}
            </p>
          </div>
        </div>

        {/* Location Selector & Refresh */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedCenterId}
              onChange={(e) => setSelectedCenterId(e.target.value)}
              className="pl-8 pr-8 py-2.5 bg-slate-100 border-2 border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-800 min-h-[44px]"
            >
              {Object.values(REGISTERED_MANDI_LOCATIONS).map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name.split('(')[0]} ({loc.distanceKm} km)
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={refreshWeather}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 rounded-xl text-slate-700 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-95"
            title="Refresh weather"
            aria-label="Refresh weather data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Weather Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* 1. Temperature */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center space-x-3">
          <div className="p-2 bg-amber-100 text-amber-900 rounded-xl">
            <ThermometerSun className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase truncate">
              {t.weatherInsights.temperature}
            </div>
            <div className="text-xl font-black text-slate-900 font-mono">
              {weather.temperature}°C
            </div>
            <div className="text-[10px] text-slate-500 font-semibold truncate">
              {t.weatherInsights.feelsLike}: {weather.feelsLike}°C
            </div>
          </div>
        </div>

        {/* 2. Rain Forecast */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center space-x-3">
          <div className="p-2 bg-blue-100 text-blue-900 rounded-xl">
            <CloudRain className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase truncate">
              {t.weatherInsights.rainForecast}
            </div>
            <div className="text-xl font-black text-blue-950 font-mono">
              {weather.rainProbability}%
            </div>
            <div className="text-[10px] text-blue-700 font-bold truncate">
              {weather.rainProbability > 60 ? t.weatherInsights.severities.critical : t.common.active}
            </div>
          </div>
        </div>

        {/* 3. Wind Speed */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center space-x-3">
          <div className="p-2 bg-teal-100 text-teal-900 rounded-xl">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase truncate">
              {t.weatherInsights.windSpeed}
            </div>
            <div className="text-xl font-black text-slate-900 font-mono">
              {weather.windKm} km/h
            </div>
            <div className="text-[10px] text-teal-700 font-semibold truncate">
              {weather.windKm > 20 ? t.weatherInsights.severities.warning : t.common.active}
            </div>
          </div>
        </div>

        {/* 4. Humidity */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center space-x-3">
          <div className="p-2 bg-emerald-100 text-emerald-900 rounded-xl">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase truncate">
              {t.weatherInsights.humidity}
            </div>
            <div className="text-xl font-black text-slate-900 font-mono">
              {weather.humidity}%
            </div>
            <div className="text-[10px] text-emerald-700 font-semibold truncate">
              {weather.humidity > 70 ? 'High Moisture' : 'Normal'}
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Context-Aware Agricultural Advisory Alert Banner */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs ${
          isCritical
            ? 'bg-red-50 border-red-300 text-red-950'
            : isWarning
            ? 'bg-amber-50 border-amber-300 text-amber-950'
            : 'bg-emerald-50 border-emerald-300 text-emerald-950'
        }`}
      >
        <div className="flex items-start space-x-3.5">
          <div
            className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
              isCritical
                ? 'bg-red-200 text-red-900'
                : isWarning
                ? 'bg-amber-200 text-amber-900'
                : 'bg-emerald-200 text-emerald-900'
            }`}
          >
            {isCritical ? (
              <Umbrella className="w-6 h-6 text-red-900" />
            ) : isWarning ? (
              <AlertTriangle className="w-6 h-6 text-amber-900" />
            ) : (
              <CheckCircle2 className="w-6 h-6 text-emerald-900" />
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black uppercase tracking-wider">
                {t.weatherInsights.advisoryHeader}
              </span>
              <span
                className={`px-2 py-0.5 text-[10px] font-black rounded-md uppercase border ${
                  isCritical
                    ? 'bg-red-200 text-red-950 border-red-400'
                    : isWarning
                    ? 'bg-amber-200 text-amber-950 border-amber-400'
                    : 'bg-emerald-200 text-emerald-950 border-emerald-400'
                }`}
              >
                {isCritical
                  ? t.weatherInsights.severities.critical
                  : isWarning
                  ? t.weatherInsights.severities.warning
                  : t.weatherInsights.severities.info}
              </span>
            </div>

            <h4 className="text-sm sm:text-base font-black leading-tight">
              {alertTitle}
            </h4>

            <p className="text-xs sm:text-sm font-bold leading-relaxed text-slate-800">
              {alertMsg}
            </p>
          </div>
        </div>

        {/* Optional Button to open dedicated full dashboard */}
        {onOpenDashboard && (
          <button
            type="button"
            onClick={onOpenDashboard}
            className="self-end sm:self-center px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black flex items-center space-x-1.5 transition-all shadow-xs shrink-0 whitespace-nowrap min-h-[44px]"
          >
            <span>{t.weatherInsights.viewFullDashboard}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
