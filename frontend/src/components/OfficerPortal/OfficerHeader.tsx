'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LanguageSelector } from '../LanguageSelector';
import {
  ShieldCheck,
  Scale,
  Clock,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Building2,
  Activity,
  ArrowLeft,
  Truck,
  CheckCircle2,
  Users
} from 'lucide-react';

interface OfficerHeaderProps {
  activeCenterName: string;
  selectedTab: 'station' | 'queue' | 'inspections';
  setSelectedTab: (tab: 'station' | 'queue' | 'inspections') => void;
  counts: {
    insideYard: number;
    staging: number;
    completed: number;
  };
  highContrast: boolean;
  setHighContrast: (val: boolean | ((prev: boolean) => boolean)) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export function OfficerHeader({
  activeCenterName,
  selectedTab,
  setSelectedTab,
  counts,
  highContrast,
  setHighContrast,
  soundEnabled,
  setSoundEnabled
}: OfficerHeaderProps) {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-slate-900 text-white border-b-4 border-slate-700 shadow-md">
      {/* Top Officer Status Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 border-b border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          {/* Left: Officer Identification & Station */}
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 font-bold transition-all"
              title="Return to Public Portal"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">मुख्य पोर्टल (Farmer Portal)</span>
            </Link>

            <div className="flex items-center space-x-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-slate-300">गेट अधिकारी ID:</span>
              <span className="font-mono font-black text-white bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700">
                OFFICER-KOT-04
              </span>
              <span className="hidden md:inline text-slate-500">•</span>
              <span className="hidden md:inline text-slate-300 font-medium">वेब्रिज बे-२ (Bay #2)</span>
            </div>
          </div>

          {/* Right: Duty Time, Shift & Outdoor Controls */}
          <div className="flex items-center space-x-2.5">
            {/* All-India 22 Scheduled Regional Languages Selector */}
            <LanguageSelector variant="dark" />

            <div className="flex items-center space-x-1.5 font-mono text-xs sm:text-sm text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-700">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span className="font-bold">{time || '00:00:00'}</span>
              <span className="text-[10px] text-slate-400 uppercase hidden sm:inline">IST</span>
            </div>

            {/* High Contrast Outdoor Mode Toggle */}
            <button
              type="button"
              onClick={() => setHighContrast((prev) => !prev)}
              aria-label="Toggle Outdoor High Contrast"
              className={`p-2 rounded-xl border transition-all ${
                highContrast
                  ? 'bg-amber-400 text-slate-950 border-amber-300 font-black'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
              title="धूप मोड (Outdoor High Contrast)"
            >
              <Sun className="w-5 h-5" />
            </button>

            {/* Sound Notification Chime Toggle */}
            <button
              type="button"
              onClick={() => setSoundEnabled((prev) => !prev)}
              aria-label="Toggle Scanner Audio Chimes"
              className={`p-2 rounded-xl border transition-all ${
                soundEnabled
                  ? 'bg-emerald-800 text-white border-emerald-600'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
              title="स्कैनर ध्वनि (Scanner Audio Beep)"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Brand Title & Duty Center */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-slate-800 rounded-2xl border-2 border-slate-700 text-emerald-400 shrink-0">
              <ShieldCheck className="w-9 h-9" aria-hidden="true" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Kisan Setu Officer Portal
                </h1>
                <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 bg-emerald-900/80 border border-emerald-500 text-emerald-200 rounded-lg">
                  मंडी गेट व तुलाई निरीक्षक (Inspector Station)
                </span>
              </div>
              <p className="text-sm sm:text-base text-slate-300 font-medium mt-0.5 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{activeCenterName}</span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-slate-400">शिफ्ट: प्रातः ०८:०० - अपराह्न ०४:००</span>
              </p>
            </div>
          </div>

          {/* Quick Real-Time Yard Stats Pills */}
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 sm:pb-0">
            <div className="bg-slate-800 border-2 border-slate-700 rounded-2xl px-3.5 py-2 min-w-[100px] text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">मंडी प्रांगण (In Yard)</span>
              <span className="text-xl font-black text-emerald-400">{counts.insideYard} वाहन</span>
            </div>
            <div className="bg-slate-800 border-2 border-slate-700 rounded-2xl px-3.5 py-2 min-w-[100px] text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">स्टेजिंग कतार (Staging)</span>
              <span className="text-xl font-black text-amber-400">{counts.staging} वाहन</span>
            </div>
            <div className="bg-slate-800 border-2 border-slate-700 rounded-2xl px-3.5 py-2 min-w-[100px] text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">आज निस्तारित (Completed)</span>
              <span className="text-xl font-black text-cyan-300">{counts.completed} रसीदें</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Navigation Tabs for Tablet Operation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <nav className="flex space-x-3 overflow-x-auto py-2.5 scrollbar-none" aria-label="Portal Modules">
          <button
            type="button"
            onClick={() => setSelectedTab('station')}
            className={`flex items-center space-x-2.5 px-5 py-3 rounded-2xl font-bold text-base sm:text-lg transition-all min-h-[56px] whitespace-nowrap ${
              selectedTab === 'station'
                ? 'bg-white text-slate-950 shadow-md scale-102'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Scale className="w-7 h-7 text-emerald-700 shrink-0" />
            <span>गेट स्कैनर व तुलाई फॉर्म (Gate & Weighbridge)</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedTab('queue')}
            className={`flex items-center space-x-2.5 px-5 py-3 rounded-2xl font-bold text-base sm:text-lg transition-all min-h-[56px] whitespace-nowrap ${
              selectedTab === 'queue'
                ? 'bg-white text-slate-950 shadow-md scale-102'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Truck className="w-7 h-7 text-slate-800 shrink-0" />
            <span>लाइव यार्ड कतार व लॉग (Live Yard Queue & Log)</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-black bg-slate-800 text-white border border-slate-600">
              {counts.insideYard + counts.staging}
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
}
