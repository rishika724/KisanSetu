'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { FarmerRegistrationLogin } from '../components/FarmerApp/FarmerRegistrationLogin';
import { MobileBookingWizard } from '../components/MobileBookingWizard';
import { ProcurementBookingForm } from '../components/ProcurementBookingForm';
import { OfflinePassCard } from '../components/OfflinePassCard';
import { QueueProgressCard } from '../components/QueueProgressCard';
import { FarmerWeatherDashboard } from '../components/FarmerWeatherDashboard';
import { KisanSetuOfficerPortal } from '../components/OfficerPortal/KisanSetuOfficerPortal';
import { VoiceAssistantWidget } from '../components/VoiceAssistant/VoiceAssistantWidget';
import { useVoiceAssistant } from '../context/VoiceAssistantContext';
import { useLanguage } from '../context/LanguageContext';
import { useSyncStore, SyncBooking } from '../lib/syncStore';
import {
  Shield,
  PhoneCall,
  QrCode,
  ArrowRight
} from 'lucide-react';

export default function HomePage() {
  const { t } = useLanguage();
  const sync = useSyncStore();
  const role = sync.activeRole;
  const { registerTabSetter } = useVoiceAssistant();

  const [farmerTab, setFarmerTab] = useState<'register' | 'booking' | 'offlinePass' | 'queue' | 'weather'>('register');

  useEffect(() => {
    registerTabSetter(setFarmerTab);
  }, [registerTabSetter]);

  const handleBookingSuccess = (booking: SyncBooking) => {
    // Switch directly to the pass view once booked
    setFarmerTab('offlinePass');
  };

  const activeBooking = sync.activeBooking;

  return (
    <div className="flex flex-col min-h-screen bg-slate-100 text-slate-900 antialiased font-sans">
      {/* Accessible Header with Two-Role Switcher & Language Selector */}
      <Navbar activeTab={farmerTab} setActiveTab={setFarmerTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* ROLE 1: ADMIN DASHBOARD */}
        {role === 'admin' ? (
          <KisanSetuOfficerPortal />
        ) : (
          /* ROLE 2: FARMER APP */
          <div className="space-y-6">
            {/* Quick Active Pass Banner if available and currently on register or booking tab */}
            {activeBooking && (farmerTab === 'register' || farmerTab === 'booking') && (
              <div className="max-w-3xl mx-auto p-4 bg-slate-900 text-white rounded-2xl border-2 border-slate-700 shadow-md flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-slate-800 rounded-xl border border-slate-700">
                    <QrCode className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
                      {t.digitalPass.title}
                    </div>
                    <div className="text-sm font-bold truncate max-w-[200px] sm:max-w-xs">
                      {activeBooking.centerName} • {activeBooking.tokenNumber} ({t.crops[activeBooking.crop]})
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setFarmerTab('offlinePass')}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-1.5 transition-all min-h-[44px]"
                >
                  <span>{t.digitalPass.downloadPass.split(' ')[0]}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Farmer Tab 1: Registration & Login Form */}
            {farmerTab === 'register' && (
              <div className="max-w-3xl mx-auto">
                <FarmerRegistrationLogin onSuccess={() => setFarmerTab('booking')} />
              </div>
            )}

            {/* Farmer Tab 2: Procurement Center, Crop & Vehicle Details */}
            {farmerTab === 'booking' && (
              <ProcurementBookingForm onBookingSuccess={handleBookingSuccess} />
            )}

            {/* Farmer Tab 3: Digital Pass with QR Code */}
            {farmerTab === 'offlinePass' && (
              <OfflinePassCard onNavigateBooking={() => setFarmerTab('booking')} />
            )}

            {/* Farmer Tab 4: Live Queue Progress Tracker */}
            {farmerTab === 'queue' && (
              <QueueProgressCard />
            )}

            {/* Farmer Tab 5: Dedicated Smart Weather Advisory & Alert Dashboard */}
            {farmerTab === 'weather' && (
              <FarmerWeatherDashboard onNavigateToBooking={() => setFarmerTab('booking')} />
            )}

            {/* Interactive Hands-Free Voice Assistant Floating UI */}
            <VoiceAssistantWidget />
          </div>
        )}
      </main>

      {/* Accessible Footer */}
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
                Smart India Hackathon (SIH 26032) • {t.common.allRightsReserved}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center space-x-4 text-sm font-bold text-slate-700">
            <div className="flex items-center space-x-2">
              <PhoneCall className="w-5 h-5 text-emerald-800" />
              <span>{t.common.helpline}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
