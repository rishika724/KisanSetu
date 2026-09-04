'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Building2,
  Clock,
  Sliders,
  ArrowLeft,
  Wifi,
  WifiOff,
  Activity,
  Layers,
  Sparkles,
  Award,
  ChevronDown
} from 'lucide-react';

interface CommandCenterHeaderProps {
  onOpenSimulation: () => void;
  isOfflineSimulated: boolean;
  surgeActive: boolean;
}

export function CommandCenterHeader({
  onOpenSimulation,
  isOfflineSimulated,
  surgeActive
}: CommandCenterHeaderProps) {
  const [time, setTime] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('kota');

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
      {/* Top Metadata Navigation Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 border-b border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Back link & Role */}
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="flex items-center space-x-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 font-bold transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>मुख्य पोर्टल (Public Portal)</span>
            </Link>

            <Link
              href="/officer"
              className="flex items-center space-x-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 font-bold transition-all"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>गेट अधिकारी पोर्टल (Officer Portal)</span>
            </Link>

            <div className="hidden md:flex items-center space-x-2 text-slate-400">
              <span>•</span>
              <span className="font-bold text-slate-300">जिला कृषि अधिकारी (DAO) मॉनिटरिंग कंसोल</span>
            </div>
          </div>

          {/* System Status Indicators & Live Clock */}
          <div className="flex items-center space-x-3 font-mono">
            {/* Offline Simulation Alert Tag */}
            {isOfflineSimulated ? (
              <span className="flex items-center space-x-1 px-2.5 py-0.5 bg-amber-950 text-amber-300 border border-amber-500 rounded-lg text-[11px] font-black animate-pulse">
                <WifiOff className="w-3.5 h-3.5" />
                <span>ऑफ़लाइन मोड सक्रिय (Offline Simulated)</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1 px-2.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500 rounded-lg text-[11px] font-bold">
                <Wifi className="w-3.5 h-3.5" />
                <span>लाइव सिंक (Live Gateway Active)</span>
              </span>
            )}

            {/* Surge Warning */}
            {surgeActive && (
              <span className="px-2.5 py-0.5 bg-red-950 text-red-300 border border-red-500 rounded-lg text-[11px] font-black">
                +20 वाहन आवक (Surge Simulated)
              </span>
            )}

            <div className="flex items-center space-x-1.5 bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-700 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-bold">{time || '00:00:00'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Command Center Title Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Logo & Headline */}
          <div className="flex items-start space-x-4">
            <div className="p-3.5 bg-slate-800 rounded-2xl border-2 border-slate-700 text-emerald-400 shrink-0 shadow-inner">
              <Building2 className="w-9 h-9" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Kisan Setu Command Center
                </h1>
                <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 bg-emerald-900/80 border border-emerald-500 text-emerald-200 rounded-lg">
                  SIH 26032 • Executive Dashboard
                </span>
              </div>
              <p className="text-sm sm:text-base text-slate-300 font-medium mt-1 flex items-center gap-2">
                <span>जिला कृषि खरीद निगरानी प्रकोष्ठ (District Agriculture Procurement & Payout Command)</span>
              </p>
            </div>
          </div>

          {/* Controls: District Selector & SIH Pitch Simulation Button */}
          <div className="flex flex-wrap items-center gap-3">
            {/* District Selector */}
            <div className="relative">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="appearance-none bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm px-4 py-3 pr-9 rounded-2xl border-2 border-slate-700 focus:outline-none focus:border-emerald-500 transition-all min-h-[50px] cursor-pointer"
              >
                <option value="kota">कोटा संभाग (Kota Division - 5 Mandis)</option>
                <option value="karnal">करनाल संभाग (Karnal Division - 4 Mandis)</option>
                <option value="bhopal">भोपाल संभाग (Bhopal Division - 3 Mandis)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Prominent Hackathon Pitch Simulation Drawer Trigger */}
            <button
              type="button"
              onClick={onOpenSimulation}
              className="flex items-center space-x-2.5 px-5 py-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-2xl font-black text-sm sm:text-base transition-all shadow-md active:scale-98 border-2 border-emerald-500 min-h-[50px]"
            >
              <Sliders className="w-5 h-5" />
              <span>SIH Live Demo Controller</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
