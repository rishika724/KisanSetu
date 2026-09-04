'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage, SUPPORTED_LANGUAGES } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import {
  Sprout,
  Languages,
  ShieldCheck,
  CalendarCheck,
  HelpCircle,
  Activity,
  QrCode,
  Building2
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'booking' | 'offlinePass' | 'queue' | 'gate' | 'about';
  setActiveTab: (tab: 'booking' | 'offlinePass' | 'queue' | 'gate' | 'about') => void;
}

export function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const { language, t, toggleLanguage, setLanguage, supportedLanguages } = useLanguage();

  return (
    <header className="bg-white border-b-2 border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Tagline */}
          <Link href="/" className="flex items-center space-x-3.5 group">
            <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200 text-slate-800 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
              {/* Prominent Lucide Icon: 32px (w-8 h-8) */}
              <Sprout className="w-8 h-8 text-emerald-800" aria-hidden="true" />
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
          </Link>

          {/* Accessible Language Switcher: 3-way toggle (English, Hindi, Telugu) */}
          <div className="flex items-center space-x-2">
            {/* Dedicated Officer Portal Direct Link */}
            <Link
              href="/officer"
              className="hidden sm:flex items-center space-x-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-black transition-all border border-slate-700 min-h-[44px]"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>गेट अधिकारी (Officer)</span>
            </Link>

            {/* Dedicated Command Center Direct Link */}
            <Link
              href="/command-center"
              className="hidden sm:flex items-center space-x-1.5 px-3 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-black transition-all border border-emerald-600 min-h-[44px]"
            >
              <Building2 className="w-4 h-4 text-emerald-200" />
              <span>कमांड सेंटर (Command Center)</span>
            </Link>

            {/* All-India 22 Scheduled Regional Languages Selector */}
            <LanguageSelector />
          </div>
        </div>

        {/* Primary Accessible Mobile-First Navigation Tabs */}
        <nav
          className="flex space-x-2 overflow-x-auto pb-2.5 pt-1 border-t border-slate-100 scrollbar-none"
          aria-label="Tabs"
        >
          <button
            onClick={() => setActiveTab('booking')}
            className={`flex items-center space-x-2.5 px-4 py-3 rounded-2xl font-bold text-base sm:text-lg transition-all min-h-[56px] whitespace-nowrap ${
              activeTab === 'booking'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <CalendarCheck className="w-7 h-7" aria-hidden="true" />
            <span>{t.tabs.booking}</span>
          </button>

          <button
            onClick={() => setActiveTab('offlinePass')}
            className={`flex items-center space-x-2.5 px-4 py-3 rounded-2xl font-bold text-base sm:text-lg transition-all min-h-[56px] whitespace-nowrap ${
              activeTab === 'offlinePass'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-7 h-7" aria-hidden="true" />
            <span>{t.tabs.offlinePass}</span>
          </button>

          <button
            onClick={() => setActiveTab('queue')}
            className={`flex items-center space-x-2.5 px-4 py-3 rounded-2xl font-bold text-base sm:text-lg transition-all min-h-[56px] whitespace-nowrap ${
              activeTab === 'queue'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Activity className="w-7 h-7" aria-hidden="true" />
            <span>{t.tabs.queueStatus}</span>
          </button>

          <button
            onClick={() => setActiveTab('gate')}
            className={`flex items-center space-x-2.5 px-4 py-3 rounded-2xl font-bold text-base sm:text-lg transition-all min-h-[56px] whitespace-nowrap ${
              activeTab === 'gate'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-7 h-7" aria-hidden="true" />
            <span>{t.tabs.gateScanner}</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`flex items-center space-x-2.5 px-4 py-3 rounded-2xl font-bold text-base sm:text-lg transition-all min-h-[56px] whitespace-nowrap ${
              activeTab === 'about'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-7 h-7" aria-hidden="true" />
            <span>{t.tabs.howItWorks}</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
