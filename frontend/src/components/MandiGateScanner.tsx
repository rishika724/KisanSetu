'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ShieldCheck, ExternalLink } from 'lucide-react';

const KisanSetuOfficerPortal = dynamic(
  () =>
    import('./OfficerPortal/KisanSetuOfficerPortal').then(
      (mod) => mod.KisanSetuOfficerPortal
    ),
  {
    ssr: false,
    loading: () => (
      <div className="bg-white p-12 rounded-3xl border-2 border-slate-300 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="font-bold text-slate-800">Kisan Setu Officer Portal लोड हो रहा है...</p>
      </div>
    )
  }
);

export function MandiGateScanner() {
  return (
    <div className="space-y-4">
      {/* Full Screen Dedicated Officer Tablet Mode Banner */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl border-2 border-slate-700 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-slate-800 rounded-xl border border-slate-700">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold block">
              Dedicated Mandi Gate Inspector Tablet Mode
            </span>
            <span className="text-sm font-bold">
              Kisan Setu Officer Portal: QR Scanner • Weighbridge & Quality Inspection • Live Yard Table
            </span>
          </div>
        </div>

        <Link
          href="/officer"
          target="_blank"
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-1.5 transition-all shadow-xs min-h-[44px]"
        >
          <span>पूर्ण स्क्रीन में खोलें (Open Dedicated Portal)</span>
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      {/* Embedded Master Portal Component */}
      <KisanSetuOfficerPortal />
    </div>
  );
}
