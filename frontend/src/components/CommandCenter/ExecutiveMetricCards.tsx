'use client';

import React from 'react';
import {
  Scale,
  IndianRupee,
  Activity,
  Clock,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Users
} from 'lucide-react';
import { ExecutiveMetrics } from './MockDataGenerator';

interface ExecutiveMetricCardsProps {
  metrics: ExecutiveMetrics;
  surgeActive?: boolean;
}

export function ExecutiveMetricCards({ metrics, surgeActive }: ExecutiveMetricCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* Card 1: Total Crop Volume Procured (Tons) */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-300 shadow-sm hover:border-slate-400 transition-all space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500">
            कुल उपार्जन मात्रा (Procurement Volume)
          </span>
          <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200 text-slate-800">
            <Scale className="w-8 h-8 text-slate-800" />
          </div>
        </div>

        <div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              {metrics.totalCropVolumeTons.toLocaleString('en-IN')}
            </span>
            <span className="text-base font-bold text-slate-500">मीट्रिक टन (MT)</span>
          </div>
          <p className="text-xs font-semibold text-slate-600 mt-1">
            सरकारी लक्ष्य: {metrics.cropVolumeTargetTons.toLocaleString('en-IN')} MT
          </p>
        </div>

        {/* Target Progress Bar */}
        <div className="space-y-1.5 pt-1 border-t border-slate-100">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-600">लक्ष्य प्राप्ति दर</span>
            <span className="text-slate-900 font-mono font-black">{metrics.targetProgressPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className="h-full bg-slate-900 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, metrics.targetProgressPercent)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Card 2: Total Payouts Disbursed via Kisan Setu (₹) */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-300 shadow-sm hover:border-slate-400 transition-all space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500">
            कुल DBT प्रत्यक्ष भुगतान (Total Payouts)
          </span>
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-300 text-emerald-800">
            <IndianRupee className="w-8 h-8 text-emerald-800" />
          </div>
        </div>

        <div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-700">₹</span>
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              {metrics.totalPayoutsCr.toFixed(2)}
            </span>
            <span className="text-base font-bold text-slate-500">करोड़ (Cr)</span>
          </div>
          <p className="text-xs font-semibold text-emerald-800 mt-1 flex items-center gap-1 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>100% आधार-सत्यापित बैंक खातों में प्रेषित</span>
          </p>
        </div>

        {/* Zero Leakage Badge */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">मध्यस्थ शून्य (0 Leakage)</span>
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-950 font-black rounded-lg border border-emerald-300 text-[11px]">
            सफल अंतरण: {metrics.dbtSuccessRatePercent}%
          </span>
        </div>
      </div>

      {/* Card 3: Active Congestion Index (%) */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-300 shadow-sm hover:border-slate-400 transition-all space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500">
            सक्रिय यार्ड संकुलन सूचकांक (Congestion Index)
          </span>
          <div
            className={`p-3 rounded-2xl border ${
              metrics.congestionIndex > 60
                ? 'bg-rose-50 border-rose-300 text-rose-800'
                : metrics.congestionIndex > 35
                ? 'bg-amber-50 border-amber-300 text-amber-800'
                : 'bg-emerald-50 border-emerald-300 text-emerald-800'
            }`}
          >
            <Activity className="w-8 h-8" />
          </div>
        </div>

        <div>
          <div className="flex items-baseline space-x-2">
            <span
              className={`text-3xl sm:text-4xl font-black tracking-tight ${
                metrics.congestionIndex > 60
                  ? 'text-rose-700'
                  : metrics.congestionIndex > 35
                  ? 'text-amber-700'
                  : 'text-emerald-700'
              }`}
            >
              {metrics.congestionIndex}%
            </span>
            <span className="text-xs font-black uppercase px-2 py-0.5 rounded-lg border bg-slate-50">
              {metrics.congestionStatus === 'SMOOTH'
                ? 'सामान्य / सुगम (Normal)'
                : metrics.congestionStatus === 'MODERATE'
                ? 'मध्यम संकुलन'
                : 'अत्यधिक भीड़ (Congested)'}
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-600 mt-1">
            जिले में वर्तमान सक्रिय वाहन: {metrics.activeVehiclesInDistrict} वाहन
          </p>
        </div>

        {/* Congestion Gauge Meter */}
        <div className="space-y-1.5 pt-1 border-t border-slate-100">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-600">क्षमता उपयोगिता</span>
            <span className="text-slate-900 font-mono font-black">{metrics.congestionIndex} / 100</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                metrics.congestionIndex > 60
                  ? 'bg-rose-600'
                  : metrics.congestionIndex > 35
                  ? 'bg-amber-500'
                  : 'bg-emerald-600'
              }`}
              style={{ width: `${Math.min(100, metrics.congestionIndex)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Card 4: Average Turnaround Time per Vehicle */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-300 shadow-sm hover:border-slate-400 transition-all space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500">
            औसत निस्तारण समय (Avg Turnaround)
          </span>
          <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 text-blue-800">
            <Clock className="w-8 h-8 text-blue-800" />
          </div>
        </div>

        <div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              {metrics.avgTurnaroundMinutes}
            </span>
            <span className="text-base font-bold text-slate-500">मिनट / वाहन</span>
          </div>
          <p className="text-xs font-semibold text-slate-600 mt-1">
            पारंपरिक समय: <span className="line-through">{metrics.traditionalWaitHours} घंटे</span> (4.5 hrs)
          </p>
        </div>

        {/* Turnaround Time Reduction Pill */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">समय बचत दर</span>
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-950 font-black rounded-lg border border-emerald-300 text-[11px] flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-emerald-700" />
            <span>-{metrics.timeSavedPercent}% कम प्रतीक्षा</span>
          </span>
        </div>
      </div>
    </div>
  );
}
