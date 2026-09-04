'use client';

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  Home,
  Truck,
  ShieldCheck,
  Scale,
  CheckCircle2,
  Navigation,
  Sliders,
  Info,
  Clock
} from 'lucide-react';

interface QueueProgressCardProps {
  initialStage?: number; // 0 to 4
}

export function QueueProgressCard({ initialStage = 0 }: QueueProgressCardProps) {
  const { t, language } = useLanguage();

  // State: 0 = Home, 1 = Staging Buffer, 2 = Mandi Gate, 3 = Quality Inspection, 4 = Payment Complete
  const [activeStageIndex, setActiveStageIndex] = useState<number>(initialStage);
  const [simulatedDistanceKm, setSimulatedDistanceKm] = useState<number>(8.5);

  const stages = [
    {
      index: 0,
      id: 'HOME',
      title: t.queueCard.stages.home,
      desc: 'At Home - Slot Reserved, Awaiting Departure',
      distanceCriteria: '> 5 km away',
      icon: Home
    },
    {
      index: 1,
      id: 'STAGING',
      title: t.queueCard.stages.staging,
      desc: 'In Buffer Yard Holding Zone (500m - 5km)',
      distanceCriteria: '500m to 5 km',
      icon: Truck
    },
    {
      index: 2,
      id: 'GATE',
      title: t.queueCard.stages.gate,
      desc: 'Mandi Gate Perimeter (<500m) - Present Token',
      distanceCriteria: '< 500m',
      icon: ShieldCheck
    },
    {
      index: 3,
      id: 'INSPECTION',
      title: t.queueCard.stages.inspection,
      desc: 'Weighbridge & Moisture Quality Grading',
      distanceCriteria: 'Inside Yard Scale',
      icon: Scale
    },
    {
      index: 4,
      id: 'PAYMENT',
      title: t.queueCard.stages.payment,
      desc: 'Direct Bank Transfer (DBT) Payout Released',
      distanceCriteria: 'Procurement Complete',
      icon: CheckCircle2
    }
  ];

  const handleDistanceChange = (dist: number) => {
    setSimulatedDistanceKm(dist);
    if (dist > 5.0) {
      setActiveStageIndex(0);
    } else if (dist >= 0.5) {
      setActiveStageIndex(1);
    } else {
      setActiveStageIndex(2);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">
            Real-Time Vehicle Tracker
          </span>
          <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-800 border border-slate-300 rounded-full">
            Stage {activeStageIndex + 1} of 5
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {t.queueCard.title}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 font-medium">
          {t.queueCard.subtitle}
        </p>
      </div>

      {/* Progress Cards: High-Contrast Vertical Stepper for Mobile */}
      <div className="space-y-3">
        {stages.map((stage) => {
          const isCurrent = stage.index === activeStageIndex;
          const isPast = stage.index < activeStageIndex;
          const IconComp = stage.icon;

          return (
            <div
              key={stage.index}
              onClick={() => setActiveStageIndex(stage.index)}
              className={`p-5 rounded-3xl border-2 cursor-pointer transition-all duration-200 min-h-[56px] flex items-center justify-between ${
                isCurrent
                  ? 'bg-slate-900 border-slate-900 text-white shadow-lg ring-4 ring-slate-200'
                  : isPast
                  ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                  : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400'
              }`}
            >
              <div className="flex items-center space-x-4">
                {/* Prominent Oversized Lucide Icon (w-8 h-8 to w-10 h-10) */}
                <div
                  className={`p-3 rounded-2xl border shrink-0 ${
                    isCurrent
                      ? 'bg-slate-800 border-slate-700 text-emerald-400'
                      : isPast
                      ? 'bg-white border-emerald-200 text-emerald-800'
                      : 'bg-slate-100 border-slate-200 text-slate-400'
                  }`}
                >
                  <IconComp className="w-8 h-8" aria-hidden="true" />
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <h3
                      className={`text-lg sm:text-xl font-bold leading-tight ${
                        isCurrent ? 'text-white' : isPast ? 'text-emerald-950' : 'text-slate-800'
                      }`}
                    >
                      {stage.title}
                    </h3>
                  </div>
                  <p
                    className={`text-xs sm:text-sm font-medium mt-0.5 ${
                      isCurrent ? 'text-slate-300' : isPast ? 'text-emerald-800' : 'text-slate-500'
                    }`}
                  >
                    {stage.desc}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="shrink-0 ml-2">
                {isCurrent ? (
                  <span className="text-xs font-black px-3 py-1.5 bg-emerald-800 text-emerald-100 border border-emerald-600 rounded-xl">
                    ACTIVE
                  </span>
                ) : isPast ? (
                  <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-xl border border-emerald-300">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                ) : (
                  <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-lg">
                    {stage.distanceCriteria}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Geofenced GPS Simulation Controls */}
      <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Navigation className="w-6 h-6 text-slate-700" />
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">
              जियोफेंस दूरी सिम्युलेटर (GPS Simulation)
            </h3>
          </div>
          <span className="font-mono text-base font-black text-slate-900">
            {simulatedDistanceKm.toFixed(1)} km
          </span>
        </div>

        <input
          type="range"
          min="0.1"
          max="15.0"
          step="0.1"
          value={simulatedDistanceKm}
          onChange={(e) => handleDistanceChange(parseFloat(e.target.value))}
          className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900 min-h-[44px]"
          aria-label="Simulate GPS Distance"
        />

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={() => handleDistanceChange(12.0)}
            className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 rounded-xl border border-slate-300 min-h-[44px]"
          >
            📍 Home (12 km)
          </button>
          <button
            type="button"
            onClick={() => handleDistanceChange(2.5)}
            className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 rounded-xl border border-slate-300 min-h-[44px]"
          >
            🚚 Buffer Yard (2.5 km)
          </button>
          <button
            type="button"
            onClick={() => handleDistanceChange(0.25)}
            className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 rounded-xl border border-slate-300 min-h-[44px]"
          >
            🛡️ Gate (&lt;500m)
          </button>
        </div>
      </div>
    </div>
  );
}
