'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { MobileBookingWizard } from '../components/MobileBookingWizard';
import { OfflinePassCard } from '../components/OfflinePassCard';
import { QueueProgressCard } from '../components/QueueProgressCard';
import { MandiGateScanner } from '../components/MandiGateScanner';
import { HowItWorks } from '../components/HowItWorks';
import { BookingResponseData } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';
import {
  Shield,
  Sparkles,
  CheckCircle2,
  PhoneCall,
  QrCode,
  Activity,
  ArrowRight,
  WifiOff
} from 'lucide-react';

export default function HomePage() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'booking' | 'offlinePass' | 'queue' | 'gate' | 'about'>('booking');
  const [latestBooking, setLatestBooking] = useState<BookingResponseData | null>(null);

  // Sync tab with URL search params on mount & check cached pass
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab') as any;
      if (['booking', 'offlinePass', 'queue', 'gate', 'about'].includes(tab)) {
        setActiveTab(tab);
      }

      // Check if there is an active pass in local storage
      const cached = localStorage.getItem('kisan_setu_active_pass');
      if (cached) {
        try {
          setLatestBooking(JSON.parse(cached));
        } catch (e) {}
      }
    }
  }, []);

  const handleBookingSuccess = (data: BookingResponseData) => {
    setLatestBooking(data);
    // Switch directly to the PWA Cached Offline Pass view so farmer sees their QR pass
    setActiveTab('offlinePass');
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 antialiased">
      {/* Mobile-First Accessible Header & Trilingual Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Quick Jump Banner for Active Offline Pass if available */}
        {latestBooking && activeTab === 'booking' && (
          <div className="max-w-2xl mx-auto p-4 bg-slate-900 text-white rounded-2xl border-2 border-slate-700 shadow-md flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-800 rounded-xl border border-slate-700">
                <QrCode className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
                  सक्रिय पास उपलब्ध (Active Pass Available)
                </div>
                <div className="text-sm font-bold truncate max-w-[200px] sm:max-w-xs">
                  {latestBooking.booking.slot?.center?.name || 'Mandi Pass'} • {latestBooking.booking.cropType}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('offlinePass')}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-1.5 transition-all min-h-[44px]"
            >
              <span>पास देखें (View)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 1. 3-Step Guided Mobile Booking Flow */}
        {activeTab === 'booking' && (
          <div className="space-y-8">
            <MobileBookingWizard onBookingSuccess={handleBookingSuccess} />

            {/* Inlined Queue Progression Quick Preview */}
            <div className="max-w-2xl mx-auto pt-6 border-t-2 border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Activity className="w-6 h-6 text-slate-700" />
                  <h3 className="font-bold text-lg text-slate-900">
                    {t.queueCard.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('queue')}
                  className="text-xs font-bold text-slate-700 hover:text-slate-900 underline"
                >
                  पूर्ण दृश्य (Full View) →
                </button>
              </div>
              <QueueProgressCard initialStage={0} />
            </div>
          </div>
        )}

        {/* 2. Kisan Setu Offline Pass Screen (PWA Cached) */}
        {activeTab === 'offlinePass' && (
          <OfflinePassCard
            initialData={latestBooking}
            onNavigateBooking={() => setActiveTab('booking')}
          />
        )}

        {/* 3. Dynamic Queue Progress Card */}
        {activeTab === 'queue' && (
          <QueueProgressCard />
        )}

        {/* 4. Mandi Gate Staff Scanner */}
        {activeTab === 'gate' && (
          <MandiGateScanner />
        )}

        {/* 5. How It Works */}
        {activeTab === 'about' && (
          <HowItWorks />
        )}
      </main>

      {/* Accessible Footer with Rural Helpline Information */}
      <footer className="bg-white border-t-2 border-slate-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 bg-slate-100 rounded-2xl border border-slate-200">
              <Shield className="w-6 h-6 text-slate-800" />
            </div>
            <div>
              <p className="text-base font-black text-slate-900">
                {t.brandName} • {t.brandTagline}
              </p>
              <p className="text-xs text-slate-500 font-bold">
                Smart India Hackathon (SIH 26032) • PWA Mobile Offline Edition
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center space-x-4 text-sm font-bold text-slate-700">
            <div className="flex items-center space-x-2">
              <PhoneCall className="w-5 h-5 text-emerald-800" />
              <span>किसान हेल्पलाइन: 1800-180-1551 (Toll Free)</span>
            </div>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-mono">PWA v2.0 (Paddy/Wheat/Pulses)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
