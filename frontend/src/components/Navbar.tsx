'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { useSyncStore, setActiveRole, UserRole } from '../lib/syncStore';
import { LanguageSelector } from './LanguageSelector';
import { InAppNotifications } from './FarmerApp/InAppNotifications';
import {
  Sprout,
  CalendarCheck,
  QrCode,
  Activity,
  ShieldCheck,
  UserRound,
  LayoutDashboard,
  CloudSun
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'register' | 'booking' | 'offlinePass' | 'queue' | 'weather';
  setActiveTab: (tab: 'register' | 'booking' | 'offlinePass' | 'queue' | 'weather') => void;
}

export function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const { t } = useLanguage();
  const sync = useSyncStore();
  const role = sync.activeRole;

  return (
    <header className="bg-white border-b-2 border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Banner & Global Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-2">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-slate-900 text-white rounded-2xl flex items-center justify-center shrink-0">
              <Sprout className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                  {t.brandName}
                </span>
                <span className="hidden sm:inline-block text-[11px] font-bold px-2 py-0.5 bg-slate-100 border border-slate-300 text-slate-700 rounded-md">
                  SIH 26032
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-bold tracking-tight">
                {t.brandTagline}
              </p>
            </div>
          </div>

          {/* Right Controls: Role Switcher, Language Selector, Notifications */}
          <div className="flex items-center space-x-2.5">
            {/* Prominent Two-Role Switcher */}
            <div className="flex items-center p-1 bg-slate-100 rounded-2xl border-2 border-slate-300">
              <button
                type="button"
                onClick={() => setActiveRole('farmer')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                  role === 'farmer'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <UserRound className="w-4 h-4" />
                <span>{t.roleSwitcher.farmer}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveRole('admin')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                  role === 'admin'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>{t.roleSwitcher.admin}</span>
              </button>
            </div>

            {/* In-App Notifications Drawer */}
            <InAppNotifications />

            {/* Strict Single-Language Switcher */}
            <LanguageSelector />
          </div>
        </div>

        {/* Farmer Sub-Tabs (Visible only when in Farmer App mode) */}
        {role === 'farmer' && (
          <nav
            className="flex space-x-2 overflow-x-auto pb-2.5 pt-1 border-t border-slate-100 scrollbar-none"
            aria-label="Farmer Modules"
          >
            {/* 1. Registration / Profile Tab */}
            <button
              onClick={() => setActiveTab('register')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl font-bold text-sm sm:text-base transition-all min-h-[50px] whitespace-nowrap ${
                activeTab === 'register'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <UserRound className="w-5 h-5" />
              <span>{t.farmerRegistration.title.split(' ')[0]}</span>
            </button>

            {/* 2. Slot Booking Tab */}
            <button
              onClick={() => setActiveTab('booking')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl font-bold text-sm sm:text-base transition-all min-h-[50px] whitespace-nowrap ${
                activeTab === 'booking'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <CalendarCheck className="w-5 h-5" />
              <span>{t.booking.step2Title.split(' ')[1] || 'Booking'}</span>
            </button>

            {/* 3. Digital Pass Tab */}
            <button
              onClick={() => setActiveTab('offlinePass')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl font-bold text-sm sm:text-base transition-all min-h-[50px] whitespace-nowrap ${
                activeTab === 'offlinePass'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <QrCode className="w-5 h-5" />
              <span>{t.digitalPass.title}</span>
            </button>

            {/* 4. Live Queue Tracker Tab */}
            <button
              onClick={() => setActiveTab('queue')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl font-bold text-sm sm:text-base transition-all min-h-[50px] whitespace-nowrap ${
                activeTab === 'queue'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Activity className="w-5 h-5" />
              <span>{t.queueTracker.title}</span>
            </button>

            {/* 5. Weather & Advisory Hub Tab */}
            <button
              onClick={() => setActiveTab('weather')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl font-bold text-sm sm:text-base transition-all min-h-[50px] whitespace-nowrap ${
                activeTab === 'weather'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <CloudSun className="w-5 h-5" />
              <span>{t.weatherInsights.tabTitle}</span>
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
