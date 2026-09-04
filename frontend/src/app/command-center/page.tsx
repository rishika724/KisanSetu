'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the command center with SSR disabled for Recharts SVG safety
const KisanSetuCommandCenter = dynamic(
  () =>
    import('../../components/CommandCenter/KisanSetuCommandCenter').then(
      (mod) => mod.KisanSetuCommandCenter
    ),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        <h2 className="text-2xl font-black">Kisan Setu Command Center</h2>
        <p className="text-slate-400 font-medium text-sm">
          जिला कृषि उपार्जन डैशबोर्ड लोड हो रहा है... (Loading Executive Dashboard...)
        </p>
      </div>
    )
  }
);

export default function CommandCenterPage() {
  return <KisanSetuCommandCenter />;
}
