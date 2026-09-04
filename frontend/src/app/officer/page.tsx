'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the officer portal with SSR disabled to ensure camera & html5-qrcode initialize strictly on client
const KisanSetuOfficerPortal = dynamic(
  () =>
    import('../../components/OfficerPortal/KisanSetuOfficerPortal').then(
      (mod) => mod.KisanSetuOfficerPortal
    ),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        <h2 className="text-2xl font-black">Kisan Setu Officer Portal</h2>
        <p className="text-slate-400 font-medium text-sm">
          मंडी गेट व वेब्रिज स्टेशन लोड हो रहा है... (Loading Station...)
        </p>
      </div>
    )
  }
);

export default function OfficerPortalPage() {
  return <KisanSetuOfficerPortal />;
}
