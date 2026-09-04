'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Navbar } from '../../components/Navbar';
import {
  fetchQueueCapacity,
  checkGeofenceApi,
  generateOfflineTokenApi,
  CapacityCheckData,
  GeofenceResponseData
} from '../../lib/api';
import {
  Home,
  Truck,
  ShieldCheck,
  Scale,
  CheckCircle2,
  Activity,
  Gauge,
  Clock,
  MapPin,
  QrCode,
  ShieldAlert,
  ArrowRight,
  Info,
  Navigation,
  Sliders
} from 'lucide-react';

export default function QueueStatusPage() {
  const { language, t } = useLanguage();
  const isHindi = language === 'hi';

  // Navigation tab state
  const [navTab, setNavTab] = useState<'booking' | 'offlinePass' | 'queue' | 'gate' | 'about'>('queue');

  // Interactive GPS distance simulation in kilometers (default: 8.5 km = Home)
  const [simulatedDistanceKm, setSimulatedDistanceKm] = useState<number>(8.5);
  const [geofenceResult, setGeofenceResult] = useState<GeofenceResponseData | null>(null);
  const [geofenceLoading, setGeofenceLoading] = useState<boolean>(false);

  // Dynamic capacity data
  const [capacityData, setCapacityData] = useState<CapacityCheckData | null>(null);
  const [capacityLoading, setCapacityLoading] = useState<boolean>(true);

  // Offline token generator state
  const [farmerId, setFarmerId] = useState<string>('farmer-01');
  const [slotId, setSlotId] = useState<string>('slot-01');
  const [generatedToken, setGeneratedToken] = useState<any>(null);
  const [tokenLoading, setTokenLoading] = useState<boolean>(false);

  // Load initial capacity data
  useEffect(() => {
    async function loadCapacity() {
      try {
        setCapacityLoading(true);
        const data = await fetchQueueCapacity('center-01');
        setCapacityData(data);
      } catch (err) {
        console.error('Failed to load queue capacity:', err);
      } finally {
        setCapacityLoading(false);
      }
    }
    loadCapacity();
  }, []);

  // Update geofence calculation whenever distance changes
  useEffect(() => {
    async function evaluateGeofence() {
      try {
        setGeofenceLoading(true);
        // Kota Mandi coordinates: 25.18, 75.83
        // 1 deg latitude is approx 111 km
        const centerLat = 25.18;
        const centerLng = 75.83;
        const deltaLat = simulatedDistanceKm / 111;
        const simulatedFarmerLat = centerLat + deltaLat;
        const simulatedFarmerLng = centerLng;

        const result = await checkGeofenceApi({
          farmerLat: simulatedFarmerLat,
          farmerLng: simulatedFarmerLng,
          centerLat,
          centerLng,
          centerId: 'center-01'
        });
        setGeofenceResult(result);
      } catch (err) {
        console.error('Failed to evaluate geofence:', err);
      } finally {
        setGeofenceLoading(false);
      }
    }

    const timer = setTimeout(evaluateGeofence, 150);
    return () => clearTimeout(timer);
  }, [simulatedDistanceKm]);

  // Handle offline token generation
  const handleGenerateOfflineToken = async () => {
    try {
      setTokenLoading(true);
      const res = await generateOfflineTokenApi({
        farmerId,
        slotId,
        timestamp: Date.now()
      });
      setGeneratedToken(res);
    } catch (err) {
      console.error('Failed to generate offline token:', err);
    } finally {
      setTokenLoading(false);
    }
  };

  // 5 Queue Stages Configuration
  const currentStageIndex = geofenceResult ? geofenceResult.stageIndex : 0;

  const queueStages = [
    {
      index: 0,
      status: 'BOOKED',
      title: t.queueVisualizer.stages.home.title,
      subtitle: t.queueVisualizer.stages.home.subtitle,
      icon: Home,
      condition: 'Distance > 5 km'
    },
    {
      index: 1,
      status: 'STAGING',
      title: t.queueVisualizer.stages.buffer.title,
      subtitle: t.queueVisualizer.stages.buffer.subtitle,
      icon: Truck,
      condition: '500m - 5 km'
    },
    {
      index: 2,
      status: 'MANDI_GATE',
      title: t.queueVisualizer.stages.gate.title,
      subtitle: t.queueVisualizer.stages.gate.subtitle,
      icon: ShieldCheck,
      condition: '< 500m'
    },
    {
      index: 3,
      status: 'INSPECTION',
      title: t.queueVisualizer.stages.inspection.title,
      subtitle: t.queueVisualizer.stages.inspection.subtitle,
      icon: Scale,
      condition: 'Inside Yard'
    },
    {
      index: 4,
      status: 'COMPLETED',
      title: t.queueVisualizer.stages.payment.title,
      subtitle: t.queueVisualizer.stages.payment.subtitle,
      icon: CheckCircle2,
      condition: 'Dispatched'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <Navbar
        activeTab="queue"
        setActiveTab={(tab) => {
          if (tab === 'queue') return;
          window.location.href = `/?tab=${tab}`;
        }}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Title & Context Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-xs">
          <div className="flex items-start space-x-4">
            <div className="p-3.5 bg-slate-100 rounded-2xl border border-slate-200 text-slate-800 shrink-0">
              {/* Prominent Lucide Icon: 32px (w-8 h-8) */}
              <Activity className="w-8 h-8 text-emerald-800" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  {t.queueVisualizer.title}
                </h1>
                <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 border border-slate-300 rounded-lg text-slate-700">
                  SIH 26032
                </span>
              </div>
              <p className="text-base sm:text-lg text-slate-600 mt-1 font-medium">
                {t.queueVisualizer.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* 1. Real-Time 5-Stage Queue Visualizer */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                {isHindi ? 'चरणबद्ध कतार प्रगति (Queue Stage Progression)' : 'Real-Time Arrival Stage Progression'}
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                {isHindi ? 'जियोफेंस इंजन दूरी के अनुसार स्वतः स्टेज अपडेट करता है' : 'Geofence staging engine updates stages automatically based on vehicle distance'}
              </p>
            </div>

            {/* Current Active Stage Badge */}
            <div className="flex items-center space-x-2 px-4 py-2 bg-slate-100 border-2 border-slate-300 rounded-2xl">
              <span className="text-xs uppercase font-bold text-slate-500">
                {t.queueVisualizer.currentStage}:
              </span>
              <span className="text-base font-extrabold text-slate-900">
                {geofenceResult?.status || 'BOOKED'}
              </span>
            </div>
          </div>

          {/* Stepper Grid with Prominent Icons (w-8 h-8 / w-10 h-10) */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {queueStages.map((stage) => {
              const IconComp = stage.icon;
              const isCurrent = stage.index === currentStageIndex;
              const isPast = stage.index < currentStageIndex;

              return (
                <div
                  key={stage.index}
                  className={`p-5 rounded-3xl border-2 transition-all duration-200 relative flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-slate-900 border-slate-900 text-white shadow-lg ring-4 ring-slate-200'
                      : isPast
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                      : 'bg-slate-50 border-slate-200 text-slate-500 opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    {/* Noticeably Large Lucide Icon (w-8 h-8 to w-10 h-10) */}
                    <div
                      className={`p-3 rounded-2xl border ${
                        isCurrent
                          ? 'bg-slate-800 border-slate-700 text-emerald-400'
                          : isPast
                          ? 'bg-white border-emerald-200 text-emerald-800'
                          : 'bg-white border-slate-200 text-slate-400'
                      }`}
                    >
                      <IconComp className="w-8 h-8" aria-hidden="true" />
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                        isCurrent
                          ? 'bg-emerald-900 text-emerald-200 border border-emerald-700'
                          : isPast
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isCurrent ? 'ACTIVE' : isPast ? 'DONE' : `STEP ${stage.index + 1}`}
                    </span>
                  </div>

                  <div>
                    <h3
                      className={`text-lg font-bold leading-snug ${
                        isCurrent ? 'text-white' : isPast ? 'text-emerald-950' : 'text-slate-800'
                      }`}
                    >
                      {stage.title}
                    </h3>
                    <p
                      className={`text-xs mt-1 font-medium ${
                        isCurrent ? 'text-slate-300' : isPast ? 'text-emerald-800' : 'text-slate-500'
                      }`}
                    >
                      {stage.subtitle}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/40 text-[11px] font-semibold flex items-center justify-between">
                    <span className={isCurrent ? 'text-emerald-300' : 'text-slate-500'}>
                      {stage.condition}
                    </span>
                    {isPast && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dynamic Instructions Banner */}
          {geofenceResult && (
            <div className="p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl flex items-start space-x-4">
              <Info className="w-8 h-8 text-slate-700 shrink-0 mt-0.5" />
              <div>
                <div className="text-base font-bold text-slate-900">
                  {isHindi ? geofenceResult.stageLabel.hi : geofenceResult.stageLabel.en}
                </div>
                <p className="text-sm font-medium text-slate-600 mt-1">
                  {isHindi ? geofenceResult.instructions.hi : geofenceResult.instructions.en}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* 2. Interactive GPS Distance Simulator & Geofence Staging */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
            <Navigation className="w-8 h-8 text-slate-700" />
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                {t.queueVisualizer.gpsSimulatorTitle}
              </h2>
              <p className="text-sm text-slate-600 font-medium">
                {t.queueVisualizer.gpsSimulatorDesc}
              </p>
            </div>
          </div>

          <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border-2 border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-base font-bold text-slate-800 flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-slate-600" />
                <span>{t.queueVisualizer.distanceAway}:</span>
                <span className="text-2xl font-black text-slate-900 font-mono">
                  {simulatedDistanceKm.toFixed(2)} km ({Math.round(simulatedDistanceKm * 1000)} meters)
                </span>
              </label>

              {/* Status Badge */}
              <div
                className={`px-4 py-1.5 rounded-xl font-bold text-sm border ${
                  simulatedDistanceKm > 5
                    ? 'bg-slate-200 border-slate-300 text-slate-800'
                    : simulatedDistanceKm >= 0.5
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                }`}
              >
                {simulatedDistanceKm > 5
                  ? 'Stage 1: > 5 km (At Home / Booked)'
                  : simulatedDistanceKm >= 0.5
                  ? 'Stage 2: 500m - 5 km (Buffer Staging Yard)'
                  : 'Stage 3: < 500m (Mandi Gate Scanner)'}
              </div>
            </div>

            {/* Slider with high touch target */}
            <input
              type="range"
              min="0.1"
              max="15.0"
              step="0.1"
              value={simulatedDistanceKm}
              onChange={(e) => setSimulatedDistanceKm(parseFloat(e.target.value))}
              className="w-full h-4 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900 touch-target-large"
              aria-label="Simulated GPS Distance"
            />

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSimulatedDistanceKm(12.0)}
                className={`px-4 py-2.5 rounded-xl font-bold text-sm border-2 transition-all ${
                  simulatedDistanceKm > 5
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-800 border-slate-300 hover:border-slate-400'
                }`}
              >
                📍 {t.queueVisualizer.presetHome}
              </button>

              <button
                type="button"
                onClick={() => setSimulatedDistanceKm(2.5)}
                className={`px-4 py-2.5 rounded-xl font-bold text-sm border-2 transition-all ${
                  simulatedDistanceKm >= 0.5 && simulatedDistanceKm <= 5
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-800 border-slate-300 hover:border-slate-400'
                }`}
              >
                🚚 {t.queueVisualizer.presetBuffer}
              </button>

              <button
                type="button"
                onClick={() => setSimulatedDistanceKm(0.25)}
                className={`px-4 py-2.5 rounded-xl font-bold text-sm border-2 transition-all ${
                  simulatedDistanceKm < 0.5
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-800 border-slate-300 hover:border-slate-400'
                }`}
              >
                🛡️ {t.queueVisualizer.presetGate}
              </button>
            </div>
          </div>
        </section>

        {/* 3. Dynamic Capacity & Queue Engine Benchmarks Card */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
            <Gauge className="w-8 h-8 text-slate-700" />
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                {t.queueVisualizer.capacityEngineTitle}
              </h2>
              <p className="text-sm text-slate-600 font-medium">
                {t.queueVisualizer.capacityEngineSubtitle}
              </p>
            </div>
          </div>

          {/* Capacity Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl">
              <span className="text-xs font-bold uppercase text-slate-500 block mb-1">
                {t.queueVisualizer.weighbridges}
              </span>
              <div className="text-3xl font-black text-slate-900 font-mono">
                {capacityData ? capacityData.weighbridgeCount : 4} Scales
              </div>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                Total Capacity: {capacityData ? capacityData.totalWeighbridgeMinutes : 240} mins/hour
              </p>
            </div>

            <div className="p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl">
              <span className="text-xs font-bold uppercase text-slate-500 block mb-1">
                {t.queueVisualizer.congestionState}
              </span>
              <div className="flex items-center space-x-2">
                <span
                  className={`text-2xl font-black ${
                    capacityData?.congestionLevel === 'CONGESTED'
                      ? 'text-red-700'
                      : capacityData?.congestionLevel === 'MODERATE'
                      ? 'text-amber-700'
                      : 'text-emerald-800'
                  }`}
                >
                  {capacityData?.congestionLevel || 'NORMAL'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                Load: {capacityData ? capacityData.utilizationPercentage : 0}% of slot capacity
              </p>
            </div>

            <div className="p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl">
              <span className="text-xs font-bold uppercase text-slate-500 block mb-1">
                {t.queueVisualizer.estimatedWaitTime}
              </span>
              <div className="text-3xl font-black text-slate-900 font-mono flex items-center space-x-2">
                <Clock className="w-6 h-6 text-slate-600" />
                <span>{capacityData ? capacityData.estimatedWaitMinutes : 0} mins</span>
              </div>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                Based on active yard throughput
              </p>
            </div>

            <div className="p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl">
              <span className="text-xs font-bold uppercase text-slate-500 block mb-1">
                Overbooking Protection
              </span>
              <div className="text-2xl font-black text-emerald-800 flex items-center space-x-1">
                <ShieldCheck className="w-6 h-6" />
                <span>ACTIVE</span>
              </div>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                Slot limits enforced dynamically
              </p>
            </div>
          </div>

          {/* Vehicle Unloading Benchmarks Table */}
          <div className="p-6 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              ⚡ {t.queueVisualizer.unloadingBenchmarks} (Vehicle Throughput Constants)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-white border border-slate-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">🐂 {t.wizard.vehicles.bullockCart.name}</span>
                  <span className="font-black text-xl text-slate-900 font-mono">25 mins</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">Manual unloading & ramp positioning</div>
                <div className="mt-2 text-xs font-bold text-emerald-800">
                  Acceptable: {capacityData?.canAcceptVehicle.BULLOCK_CART ? 'YES' : 'NO'}
                </div>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">🚜 {t.wizard.vehicles.tractor.name}</span>
                  <span className="font-black text-xl text-slate-900 font-mono">15 mins</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">Hydraulic trolley tipping</div>
                <div className="mt-2 text-xs font-bold text-emerald-800">
                  Acceptable: {capacityData?.canAcceptVehicle.TRACTOR ? 'YES' : 'NO'}
                </div>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">🚛 {t.wizard.vehicles.truck.name}</span>
                  <span className="font-black text-xl text-slate-900 font-mono">10 mins</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">Direct hopper discharge</div>
                <div className="mt-2 text-xs font-bold text-emerald-800">
                  Acceptable: {capacityData?.canAcceptVehicle.TRUCK ? 'YES' : 'NO'}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 4. Offline Cryptographic Token Generator Module */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
            <QrCode className="w-8 h-8 text-slate-700" />
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                {t.queueVisualizer.offlineTokenTitle}
              </h2>
              <p className="text-sm text-slate-600 font-medium">
                {t.queueVisualizer.offlineTokenSubtitle}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Farmer ID</label>
              <input
                type="text"
                value={farmerId}
                onChange={(e) => setFarmerId(e.target.value)}
                className="w-full p-3.5 bg-slate-50 border-2 border-slate-300 rounded-xl font-semibold text-slate-900 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Slot ID</label>
              <input
                type="text"
                value={slotId}
                onChange={(e) => setSlotId(e.target.value)}
                className="w-full p-3.5 bg-slate-50 border-2 border-slate-300 rounded-xl font-semibold text-slate-900 focus:bg-white"
              />
            </div>

            <div>
              <button
                type="button"
                onClick={handleGenerateOfflineToken}
                disabled={tokenLoading}
                className="w-full flex items-center justify-center space-x-2 p-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all touch-target-large active:scale-98"
              >
                <QrCode className="w-6 h-6 text-emerald-400" />
                <span>{tokenLoading ? 'Computing Hash...' : 'Generate SHA-256 Token'}</span>
              </button>
            </div>
          </div>

          {generatedToken && (
            <div className="p-6 bg-slate-50 border-2 border-slate-300 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-500">
                  Deterministic SHA-256 Digest
                </span>
                <span className="text-xs font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
                  Cryptographically Verified
                </span>
              </div>
              <div className="font-mono text-sm bg-white p-3.5 rounded-xl border border-slate-300 break-all select-all font-bold text-slate-900">
                {generatedToken.tokenHash}
              </div>
              <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 font-medium">
                <span>Compact Token: <strong>{generatedToken.offlineString}</strong></span>
                <span>Algorithm: {generatedToken.algorithm}</span>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
