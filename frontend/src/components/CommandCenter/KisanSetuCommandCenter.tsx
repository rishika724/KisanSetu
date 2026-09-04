'use client';

import React, { useState } from 'react';
import { CommandCenterHeader } from './CommandCenterHeader';
import { ExecutiveMetricCards } from './ExecutiveMetricCards';
import { AnalyticsCharts } from './AnalyticsCharts';
import { LiveSimulationPanel } from './LiveSimulationPanel';
import {
  CommandState,
  BASELINE_COMMAND_STATE,
  applyVehicleSurgeSimulation,
  generateMockSmsNotification,
  toggleOfflineModeSimulation
} from './MockDataGenerator';
import {
  Sliders,
  Smartphone,
  WifiOff,
  CheckCircle2,
  X,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Building2,
  Calendar,
  Sparkles
} from 'lucide-react';

export function KisanSetuCommandCenter() {
  const [state, setState] = useState<CommandState>(BASELINE_COMMAND_STATE);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [toastAlert, setToastAlert] = useState<string | null>(null);

  // Play audio chime for actions
  const playChime = (freq: number = 880) => {
    if (typeof window === 'undefined') return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.22);
    } catch (e) {}
  };

  // Simulation Triggers
  const handleSimulateSurge = () => {
    setState((prev) => applyVehicleSurgeSimulation(prev, 20));
    playChime(660);
    setToastAlert('+20 वाहन आवक दर्ज की गई: यार्ड संकुलन 24% से बढ़कर 46% हुआ, घंटेवार चार्ट अपडेट हुआ।');
    setTimeout(() => setToastAlert(null), 6000);
  };

  const handleTriggerSms = () => {
    setState((prev) => generateMockSmsNotification(prev));
    playChime(1100);
  };

  const handleToggleOffline = () => {
    setState((prev) => toggleOfflineModeSimulation(prev));
    playChime(440);
  };

  const handleReset = () => {
    setState(BASELINE_COMMAND_STATE);
    playChime(550);
    setToastAlert('डेटाबेस व सिमुलेशन को डिफ़ॉल्ट बेसलाइन पर रीसेट किया गया।');
    setTimeout(() => setToastAlert(null), 4000);
  };

  const handleDismissSms = () => {
    setState((prev) => ({
      ...prev,
      smsNotification: null
    }));
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 antialiased font-sans">
      {/* 1. Executive Header */}
      <CommandCenterHeader
        onOpenSimulation={() => setDrawerOpen(true)}
        isOfflineSimulated={state.isOfflineSimulated}
        surgeActive={state.surgeActive}
      />

      {/* Main Dashboard Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Offline Simulation Banner if active */}
        {state.isOfflineSimulated && (
          <div className="p-4 bg-amber-50 border-2 border-amber-400 rounded-3xl flex items-center justify-between text-amber-950 shadow-sm animate-fadeIn">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-200 rounded-2xl">
                <WifiOff className="w-6 h-6 text-amber-900" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-amber-800">
                  ऑफ़लाइन लचीलापन मोड (Offline Resiliency Active)
                </span>
                <p className="text-sm font-bold text-amber-950">
                  केंद्रीय सर्वर ऑफ़लाइन है। किसान सेतु PWA स्थानीय SHA-256 क्रिप्टोग्राफ़िक लेज़र द्वारा पास का निर्बाध सत्यापन जारी रखे हुए है।
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleToggleOffline}
              className="px-3 py-1.5 bg-amber-200 hover:bg-amber-300 font-black text-xs rounded-xl transition-all"
            >
              ऑनलाइन लौटें (Reconnect)
            </button>
          </div>
        )}

        {/* Dynamic Toast Alert if any */}
        {toastAlert && (
          <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-700 shadow-md flex items-center justify-between text-sm font-bold animate-fadeIn">
            <div className="flex items-center space-x-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{toastAlert}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastAlert(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              हटाएं (Dismiss)
            </button>
          </div>
        )}

        {/* 2. Executive Metric Overview Cards */}
        <section aria-labelledby="kpi-metrics-title">
          <ExecutiveMetricCards metrics={state.metrics} surgeActive={state.surgeActive} />
        </section>

        {/* 3. Analytics Data Visualizations (Recharts) */}
        <section aria-labelledby="analytics-charts-title">
          <AnalyticsCharts
            centerProcurement={state.centerProcurement}
            hourlyTraffic={state.hourlyTraffic}
            cropDistribution={state.cropDistribution}
            surgeActive={state.surgeActive}
          />
        </section>
      </main>

      {/* Pop-up Simulated SMS Notification Banner */}
      {state.smsNotification && (
        <div className="fixed top-6 right-6 z-50 max-w-sm w-full bg-slate-900 text-white rounded-3xl p-5 border-2 border-emerald-400 shadow-2xl space-y-3 animate-bounceOnce">
          <div className="flex items-center justify-between border-b border-slate-700 pb-2">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-emerald-800 rounded-xl text-emerald-200">
                <Smartphone className="w-5 h-5" />
              </div>
              <span className="text-xs font-black uppercase text-emerald-400 tracking-wider">
                SMS DBT Alert Dispatched
              </span>
            </div>
            <button
              type="button"
              onClick={handleDismissSms}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
              aria-label="Close SMS alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1 text-xs">
            <div className="text-slate-300 font-bold">
              प्राप्तकर्ता: <span className="text-white font-mono font-black">{state.smsNotification.farmerName}</span>
            </div>
            <div className="text-slate-400">फ़ोन: {state.smsNotification.phone}</div>
          </div>

          <div className="p-3 bg-slate-800 rounded-2xl border border-slate-700 font-mono text-xs text-slate-200 leading-relaxed">
            &ldquo;किसान सेतु: आपकी उपज सफलतापूर्वक स्वीकृत हुई। रसीद #{state.smsNotification.receiptNo}। राशि {state.smsNotification.amount} आपके आधार-लिंक बैंक खाते में DBT द्वारा अंतरित कर दी गई है।&rdquo;
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono pt-1">
            <span>गेटवे: PFMS-DBT-AGRI</span>
            <span>{state.smsNotification.timestamp}</span>
          </div>
        </div>
      )}

      {/* Floating SIH Hackathon Demo Trigger Button (Bottom-Right) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="flex items-center space-x-2.5 px-5 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-3xl font-black text-sm sm:text-base transition-all shadow-2xl border-2 border-emerald-400 active:scale-95 group"
        >
          <div className="p-1.5 bg-emerald-900 rounded-xl text-emerald-300 group-hover:scale-110 transition-transform">
            <Sliders className="w-5 h-5" />
          </div>
          <span className="hidden sm:inline">SIH Live Demo Controller</span>
          <span className="sm:hidden">SIH Demo</span>
        </button>
      </div>

      {/* 4. Live Hackathon Pitch Simulation Side Drawer */}
      <LiveSimulationPanel
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        state={state}
        onSimulateSurge={handleSimulateSurge}
        onTriggerSms={handleTriggerSms}
        onToggleOffline={handleToggleOffline}
        onReset={handleReset}
        onDismissSms={handleDismissSms}
      />
    </div>
  );
}
