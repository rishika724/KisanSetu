'use client';

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  useWeatherAdvisory,
  REGISTERED_MANDI_LOCATIONS,
  SimulationScenario
} from '../lib/useWeatherAdvisory';
import {
  CloudRain,
  CloudLightning,
  Sun,
  Wind,
  Droplets,
  Thermometer,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Truck,
  MapPin,
  RefreshCw,
  Clock,
  Sparkles,
  Gauge,
  SunMedium,
  Umbrella,
  Flame,
  Info
} from 'lucide-react';

interface FarmerWeatherDashboardProps {
  onNavigateToBooking?: () => void;
}

export function FarmerWeatherDashboard({ onNavigateToBooking }: FarmerWeatherDashboardProps) {
  const { t } = useLanguage();
  const {
    selectedCenterId,
    setSelectedCenterId,
    centerInfo,
    weather,
    advisories,
    hourlyForecast,
    simulationScenario,
    setSimulationScenario,
    isRefreshing,
    refreshWeather,
    activeBooking
  } = useWeatherAdvisory();

  // Helper to get weather icon
  const getWeatherIcon = (cond: string, className: string = 'w-8 h-8') => {
    switch (cond) {
      case 'thunderstorm':
        return <CloudLightning className={`${className} text-purple-600`} />;
      case 'rainy':
        return <CloudRain className={`${className} text-blue-600`} />;
      case 'high_heat':
        return <Flame className={`${className} text-amber-600`} />;
      case 'high_wind':
        return <Wind className={`${className} text-teal-600`} />;
      case 'cloudy':
        return <SunMedium className={`${className} text-slate-600`} />;
      case 'sunny':
      default:
        return <Sun className={`${className} text-amber-500`} />;
    }
  };

  // Helper to render advisory icon
  const getAdvisoryIcon = (iconType: string) => {
    switch (iconType) {
      case 'rain':
        return <Umbrella className="w-6 h-6 text-red-600" />;
      case 'heat':
        return <Flame className="w-6 h-6 text-amber-600" />;
      case 'wind':
        return <Wind className="w-6 h-6 text-teal-600" />;
      case 'procurement':
        return <Truck className="w-6 h-6 text-amber-700" />;
      case 'tarpaulin':
        return <AlertTriangle className="w-6 h-6 text-red-700" />;
      case 'check':
      default:
        return <CheckCircle2 className="w-6 h-6 text-emerald-600" />;
    }
  };

  const conditionKey = (weather.condition === 'thunderstorm'
    ? 'thunderstorm'
    : weather.condition === 'rainy'
    ? 'rainy'
    : weather.condition === 'high_heat'
    ? 'highHeat'
    : weather.condition === 'high_wind'
    ? 'highWind'
    : weather.condition === 'cloudy'
    ? 'cloudy'
    : 'sunny') as keyof typeof t.weatherInsights.conditionNames;

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Top Header & Mandi Location Switcher */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-slate-300 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-blue-900 text-white rounded-2xl shadow-sm">
              <CloudRain className="w-7 h-7 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {t.weatherInsights.title}
                </h1>
                <span className="px-2.5 py-0.5 bg-blue-100 text-blue-900 border border-blue-300 rounded-lg text-xs font-black uppercase">
                  SIH 26032
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-0.5">
                {t.weatherInsights.subtitle}
              </p>
            </div>
          </div>

          {/* Location Selector & Refresh */}
          <div className="flex items-center space-x-2.5">
            <div className="relative flex-1 sm:w-64">
              <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedCenterId}
                onChange={(e) => {
                  setSelectedCenterId(e.target.value);
                  setSimulationScenario('none');
                }}
                className="w-full pl-9 pr-8 py-3 bg-slate-100 border-2 border-slate-300 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-slate-800 min-h-[48px]"
              >
                {Object.values(REGISTERED_MANDI_LOCATIONS).map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({loc.distanceKm} km)
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={refreshWeather}
              className="p-3 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 rounded-2xl text-slate-700 transition-all min-h-[48px] min-w-[48px] flex items-center justify-center active:scale-95"
              title="Refresh radar feed"
              aria-label="Refresh radar feed"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* SIH Simulation Scenario Selector Bar */}
        <div className="mt-5 pt-4 border-t-2 border-slate-100 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                {t.weatherInsights.simulation.title}
              </span>
            </div>
            {simulationScenario !== 'none' && (
              <button
                type="button"
                onClick={() => setSimulationScenario('none')}
                className="text-xs font-bold text-blue-700 hover:underline"
              >
                Reset to Live Telemetry
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: 'rain', label: t.weatherInsights.simulation.scenarios.rain, icon: '☔️' },
              { id: 'heat', label: t.weatherInsights.simulation.scenarios.heat, icon: '☀️' },
              { id: 'wind', label: t.weatherInsights.simulation.scenarios.wind, icon: '💨' },
              { id: 'mandiRain', label: t.weatherInsights.simulation.scenarios.mandiRain, icon: '🌧️' },
              { id: 'favorable', label: t.weatherInsights.simulation.scenarios.favorable, icon: '🌤️' }
            ].map((sc) => {
              const isSelected = simulationScenario === sc.id;
              return (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => setSimulationScenario(sc.id as SimulationScenario)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center space-x-1.5 transition-all min-h-[44px] ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-md scale-102 ring-2 ring-blue-500'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                  }`}
                >
                  <span>{sc.icon}</span>
                  <span>{sc.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Weather Telemetry Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main Temperature & Condition Card */}
        <div className="bg-white p-6 rounded-3xl border-2 border-slate-300 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {centerInfo.name}
            </span>
            <span className="px-2.5 py-1 bg-slate-100 rounded-full text-[11px] font-bold text-slate-600">
              {weather.lastUpdated}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-3xl">
              {getWeatherIcon(weather.condition, 'w-12 h-12')}
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-black text-slate-900 font-mono tracking-tight">
                {weather.temperature}°C
              </div>
              <div className="text-xs font-bold text-slate-500 mt-1">
                {t.weatherInsights.feelsLike}: {weather.feelsLike}°C
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-xs font-black text-slate-800 block">
              {t.weatherInsights.conditionNames[conditionKey] || weather.condition}
            </span>
            <span className="text-[11px] text-slate-500 font-semibold">
              {weather.locationName}
            </span>
          </div>
        </div>

        {/* 4 Microclimate Telemetry Tiles */}
        <div className="md:col-span-2 grid grid-cols-2 gap-3">
          {/* 1. Rain Probability */}
          <div className="bg-white p-5 rounded-3xl border-2 border-slate-300 shadow-sm flex items-center space-x-3.5">
            <div className="p-3 bg-blue-100 text-blue-900 rounded-2xl">
              <CloudRain className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase text-slate-500 block">
                {t.weatherInsights.rainForecast}
              </span>
              <span className="text-2xl font-black text-blue-950 font-mono">
                {weather.rainProbability}%
              </span>
              <span className="text-[10px] text-blue-700 font-bold block">
                {weather.rainProbability > 60 ? t.weatherInsights.severities.critical : t.common.active}
              </span>
            </div>
          </div>

          {/* 2. Wind Speed */}
          <div className="bg-white p-5 rounded-3xl border-2 border-slate-300 shadow-sm flex items-center space-x-3.5">
            <div className="p-3 bg-teal-100 text-teal-900 rounded-2xl">
              <Wind className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase text-slate-500 block">
                {t.weatherInsights.windSpeed}
              </span>
              <span className="text-2xl font-black text-slate-900 font-mono">
                {weather.windKm} km/h
              </span>
              <span className="text-[10px] text-teal-700 font-bold block">
                {weather.windKm > 20 ? t.weatherInsights.severities.warning : t.common.active}
              </span>
            </div>
          </div>

          {/* 3. Humidity */}
          <div className="bg-white p-5 rounded-3xl border-2 border-slate-300 shadow-sm flex items-center space-x-3.5">
            <div className="p-3 bg-emerald-100 text-emerald-900 rounded-2xl">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase text-slate-500 block">
                {t.weatherInsights.humidity}
              </span>
              <span className="text-2xl font-black text-slate-900 font-mono">
                {weather.humidity}%
              </span>
              <span className="text-[10px] text-emerald-700 font-bold block">
                {weather.humidity > 70 ? 'High Moisture' : 'Optimal'}
              </span>
            </div>
          </div>

          {/* 4. UV Index & Pressure */}
          <div className="bg-white p-5 rounded-3xl border-2 border-slate-300 shadow-sm flex items-center space-x-3.5">
            <div className="p-3 bg-amber-100 text-amber-900 rounded-2xl">
              <Gauge className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase text-slate-500 block">
                {t.weatherInsights.pressure}
              </span>
              <span className="text-2xl font-black text-slate-900 font-mono">
                {weather.pressureHpa} hPa
              </span>
              <span className="text-[10px] text-amber-700 font-bold block">
                UV Index: {weather.uvIndex}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Agricultural & Crop Protection Advisories Feed */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-slate-800" />
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              {t.weatherInsights.advisoryHeader}
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-500 font-mono">
            {advisories.length} Active Guidance Rules
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {advisories.map((adv) => {
            const isCritical = adv.severity === 'CRITICAL';
            const isWarning = adv.severity === 'WARNING';

            const severityBadgeColor = isCritical
              ? 'bg-red-200 text-red-900 border-red-400'
              : isWarning
              ? 'bg-amber-200 text-amber-900 border-amber-400'
              : 'bg-emerald-200 text-emerald-900 border-emerald-400';

            const cardBorder = isCritical
              ? 'bg-red-50/70 border-red-300 text-red-950'
              : isWarning
              ? 'bg-amber-50/70 border-amber-300 text-amber-950'
              : 'bg-emerald-50/70 border-emerald-300 text-emerald-950';

            const alertTitle = t.weatherInsights[adv.titleKey]?.title || adv.titleKey;
            const alertMsg = t.weatherInsights[adv.messageKey]?.message || adv.messageKey;
            const alertAction = t.weatherInsights[adv.actionKey]?.action || '';

            return (
              <div
                key={adv.id}
                className={`p-5 rounded-3xl border-2 shadow-xs transition-all space-y-3 ${cardBorder}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/10 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-white rounded-2xl shadow-xs shrink-0">
                      {getAdvisoryIcon(adv.iconType)}
                    </div>
                    <div>
                      <h3 className="font-black text-base sm:text-lg leading-tight">
                        {alertTitle}
                      </h3>
                      <span className="text-xs font-bold text-slate-600">
                        {adv.metricTrigger}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-xl text-xs font-black border uppercase shrink-0 self-start sm:self-auto ${severityBadgeColor}`}
                  >
                    {adv.severity === 'CRITICAL'
                      ? t.weatherInsights.severities.critical
                      : adv.severity === 'WARNING'
                      ? t.weatherInsights.severities.warning
                      : t.weatherInsights.severities.info}
                  </span>
                </div>

                {/* Advisory Message */}
                <p className="text-sm font-bold leading-relaxed">
                  {alertMsg}
                </p>

                {/* Concrete Farmer Action Steps */}
                {alertAction && (
                  <div className="p-3.5 bg-white/80 rounded-2xl border border-black/10 text-xs font-semibold text-slate-800 flex items-start space-x-2">
                    <Info className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                    <span>{alertAction}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Operational Procurement Logistics Card */}
      <div className="bg-white p-6 rounded-3xl border-2 border-slate-300 shadow-sm space-y-4">
        <div className="flex items-center space-x-3 border-b-2 border-slate-100 pb-3">
          <div className="p-2.5 bg-slate-900 text-white rounded-2xl">
            <Truck className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-black text-base sm:text-lg text-slate-900">
              {t.weatherInsights.logisticsImpact.title}
            </h3>
            <p className="text-xs font-semibold text-slate-500">
              {t.weatherInsights.logisticsImpact.appointmentNotice} • {centerInfo.name}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase block">
              {t.farmerIntake.vehicleLabel}: {activeBooking ? t.vehicles[activeBooking.vehicleType] : t.vehicles.TRACTOR}
            </span>
            <p className="text-sm font-bold text-slate-900">
              {t.weatherInsights.tarpaulinAlert.message}
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase block">
              {t.digitalPass.center}: {centerInfo.name}
            </span>
            <p className="text-sm font-bold text-slate-900">
              {t.weatherInsights.procurementAlert.message}
            </p>
          </div>
        </div>
      </div>

      {/* 24-Hour Hourly Microclimate Strip */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-slate-300 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-slate-800" />
            <h3 className="font-black text-base sm:text-lg text-slate-900">
              {t.weatherInsights.hourlyForecast.title}
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {centerInfo.district}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 overflow-x-auto pb-1">
          {hourlyForecast.map((hour, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-1.5 min-w-[95px]"
            >
              <div className="text-[11px] font-bold text-slate-500 font-mono">
                {idx === 0 ? t.weatherInsights.hourlyForecast.now : hour.time}
              </div>
              <div className="flex justify-center py-1">
                {getWeatherIcon(hour.condition, 'w-6 h-6')}
              </div>
              <div className="text-base font-black text-slate-900 font-mono">
                {hour.temp}°C
              </div>
              <div className="text-[10px] font-bold text-blue-700">
                {hour.rainProbability}% 🌧
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
