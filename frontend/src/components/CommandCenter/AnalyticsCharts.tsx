'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  CenterProcurementData,
  HourlyTrafficData,
  CropDistributionData
} from './MockDataGenerator';
import { BarChart3, TrendingUp, PieChart as PieIcon, Layers, Info } from 'lucide-react';

interface AnalyticsChartsProps {
  centerProcurement: CenterProcurementData[];
  hourlyTraffic: HourlyTrafficData[];
  cropDistribution: CropDistributionData[];
  surgeActive?: boolean;
}

export function AnalyticsCharts({
  centerProcurement,
  hourlyTraffic,
  cropDistribution,
  surgeActive
}: AnalyticsChartsProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white p-12 rounded-3xl border-2 border-slate-300 h-80 flex items-center justify-center text-slate-400 font-bold">
          चार्ट लोड हो रहे हैं (Loading Analytics Charts)...
        </div>
        <div className="lg:col-span-4 bg-white p-12 rounded-3xl border-2 border-slate-300 h-80 flex items-center justify-center text-slate-400 font-bold">
          लोडिंग...
        </div>
      </div>
    );
  }

  // Custom tooltips
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-700 shadow-xl text-xs space-y-1">
          <p className="font-bold text-slate-200 border-b border-slate-700 pb-1">{label}</p>
          <p className="text-emerald-400 font-bold">
            वास्तविक उपार्जन: {payload[0]?.value?.toLocaleString('en-IN')} MT
          </p>
          <p className="text-slate-400">
            सरकारी लक्ष्य: {payload[1]?.value?.toLocaleString('en-IN')} MT
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLineTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-700 shadow-xl text-xs space-y-1">
          <p className="font-bold text-slate-200 border-b border-slate-700 pb-1">समय: {label} बजे</p>
          <p className="text-emerald-400 font-bold">
            वाहन आवक (Arrivals): {payload[0]?.value} वाहन
          </p>
          <p className="text-amber-400 font-bold">
            औसत प्रतीक्षा समय: {payload[1]?.value} मिनट
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomDonutTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-700 shadow-xl text-xs space-y-1">
          <p className="font-bold text-slate-200 border-b border-slate-700 pb-1">{data.hindiName}</p>
          <p className="text-emerald-400 font-bold">
            कुल मात्रा: {data.volumeTons.toLocaleString('en-IN')} MT ({data.percentage}%)
          </p>
          <p className="text-slate-300">
            कुल DBT मूल्य: ₹{data.payoutCr} करोड़
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Top Row: Bar Chart (Volume vs Target) + Donut Chart (Crop Ratio) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 1. Bar Chart: Daily Procurement Volume vs Government Target across local Mandi centers */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 border-2 border-slate-300 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-slate-100 rounded-2xl border border-slate-200 text-slate-800">
                <BarChart3 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  मंडीवार उपार्जन बनाम लक्ष्य (Procurement Volume vs Target)
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  संभाग के 5 प्रमुख खरीद केंद्रों की वास्तविक उपार्जन प्रगति (मीट्रिक टन)
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-xs font-bold">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-sm bg-slate-900" />
                <span className="text-slate-700">वास्तविक उपार्जन (Actual)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-sm bg-slate-400" />
                <span className="text-slate-500">सरकारी लक्ष्य (Target)</span>
              </div>
            </div>
          </div>

          {/* Bar Chart Viewport */}
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={centerProcurement}
                margin={{ top: 10, right: 10, left: -10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="centerName"
                  tick={{ fill: '#475569', fontSize: 11, fontWeight: 700 }}
                  interval={0}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickFormatter={(val) => `${val} MT`}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar dataKey="actualVolumeTons" name="Actual MT" fill="#0f172a" radius={[6, 6, 0, 0]} maxBarSize={45} />
                <Bar dataKey="targetVolumeTons" name="Target MT" fill="#94a3b8" radius={[6, 6, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>डेटा स्रोत: राष्ट्रीय कृषि बाजार (e-NAM) व किसान सेतु डिजिटल बहीखाता</span>
            <span className="font-bold text-emerald-800">औसत उपार्जन दर: 84.6%</span>
          </div>
        </div>

        {/* 2. Donut Chart: Crop Breakdown Ratio (Paddy, Wheat, Pulses, Mustard) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border-2 border-slate-300 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center space-x-3 border-b border-slate-200 pb-4">
            <div className="p-2.5 bg-emerald-50 rounded-2xl border border-emerald-300 text-emerald-800">
              <PieIcon className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                फसल अनुपात (Crop Breakdown)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                कुल उपार्जित उपज का जिंसवार प्रतिशत
              </p>
            </div>
          </div>

          {/* Donut Chart Viewport */}
          <div className="h-56 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cropDistribution}
                  dataKey="volumeTons"
                  nameKey="hindiName"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                >
                  {cropDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomDonutTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Centered Donut Summary */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-black uppercase text-slate-400">कुल जिंस</span>
              <span className="text-lg font-black text-slate-900">4 मुख्य</span>
            </div>
          </div>

          {/* Legend Details List */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            {cropDistribution.map((crop) => (
              <div key={crop.cropName} className="p-2 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: crop.color }} />
                  <span className="font-bold text-slate-800 truncate">{crop.cropName}</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                  {crop.percentage}% ({crop.volumeTons} MT)
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Line Chart: Hourly Mandi Yard Traffic Trends and Waiting Time Progression */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-slate-300 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-50 rounded-2xl border border-blue-200 text-blue-800">
              <TrendingUp className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  घंटेवार मंडी यार्ड आवक व प्रतीक्षा समय (Hourly Yard Traffic & Wait Time Progression)
                </h3>
                {surgeActive && (
                  <span className="px-2 py-0.5 bg-rose-100 border border-rose-400 text-rose-950 font-black text-[11px] rounded-lg animate-pulse">
                    +20 वाहन आवक दर्ज
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                प्रातः ०६:०० से शाम १८:०० तक के वाहनों का आगमन और कतार प्रतीक्षा अवधि का वास्तविक रुझान
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-xs font-bold">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-700" />
              <span className="text-slate-800">वाहन आवक (Arrivals Count)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-600" />
              <span className="text-slate-800">औसत प्रतीक्षा (Wait Minutes)</span>
            </div>
          </div>
        </div>

        {/* Line Chart Viewport */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={hourlyTraffic}
              margin={{ top: 10, right: 15, left: -10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="timeSlot"
                tick={{ fill: '#475569', fontSize: 12, fontWeight: 700 }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
              />
              <Tooltip content={<CustomLineTooltip />} />
              <Line
                type="monotone"
                dataKey="vehicleArrivals"
                name="Vehicle Arrivals"
                stroke="#047857"
                strokeWidth={3}
                dot={{ r: 5, fill: '#047857' }}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="avgWaitMinutes"
                name="Avg Wait Minutes"
                stroke="#d97706"
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ r: 5, fill: '#d97706' }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <Info className="w-4 h-4 text-slate-400" />
            <span>पीक ऑवर (12:00 - 14:00) में किसान सेतु स्लॉटिंग इंजन द्वारा वाहनों को स्टेजिंग बफर में स्वचालित रूप से वितरित किया जाता है।</span>
          </div>
          <span className="font-mono font-bold text-slate-700">अधिकतम प्रतीक्षा: 32 मिनट</span>
        </div>
      </div>
    </div>
  );
}
