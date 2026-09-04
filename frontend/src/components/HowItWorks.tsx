'use client';

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  CalendarCheck,
  QrCode,
  ShieldCheck,
  Scale,
  Clock,
  ArrowRight,
  Sparkles,
  Network
} from 'lucide-react';

export function HowItWorks() {
  const { language } = useLanguage();

  const isHindi = language === 'hi';

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Overview Header */}
      <div className="bg-white p-8 rounded-3xl border-2 border-slate-200 shadow-xs text-center space-y-3">
        <span className="text-xs uppercase tracking-widest text-emerald-800 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          SIH Problem Statement 26032
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          {isHindi
            ? 'किसान सेतु कैसे काम करता है?'
            : 'How Kisan Setu Solves Mandi Congestion'}
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          {isHindi
            ? 'डिजिटल शेड्यूलिंग और क्रिप्टोग्राफ़िक 256-बिट ऑफलाइन टोकन के माध्यम से मंडियों में लंबी कतारों, ट्रैफिक जाम और किसानों के अनावश्यक इंतजार को समाप्त करने की आधुनिक प्रणाली।'
            : 'A modern scheduling & cryptographic tokenization architecture that eliminates mandi gridlocks, regulates weighbridge traffic, and functions reliably in zero-internet rural environments.'}
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step 1 */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-xs space-y-4">
          <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 w-fit">
            <CalendarCheck className="w-8 h-8 text-emerald-800" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">
            {isHindi ? '1. अग्रिम स्लॉट बुकिंग (Dynamic Capacity)' : '1. Capacity-Aware Slot Scheduling'}
          </h3>
          <p className="text-base text-slate-600 leading-relaxed font-medium">
            {isHindi
              ? 'किसान अपनी सुविधानुसार मंडी और 1 घंटे की समय खिड़की चुनते हैं। प्रणाली स्वचालित रूप से वे-ब्रिज क्षमता के अनुसार स्लॉट की उपलब्धता नियंत्रित करती है।'
              : 'Farmers pre-reserve 1-hour delivery windows. The backend automatically caps hourly bookings according to weighbridge capacity to prevent yard saturation.'}
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-xs space-y-4">
          <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 w-fit">
            <QrCode className="w-8 h-8 text-emerald-800" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">
            {isHindi ? '2. SHA-256 ऑफलाइन टोकन' : '2. SHA-256 Tamper-Proof Offline Pass'}
          </h3>
          <p className="text-base text-slate-600 leading-relaxed font-medium">
            {isHindi
              ? 'बुकिंग होते ही SHA-256 एन्क्रिप्टेड ऑफलाइन टोकन स्ट्रिंग व क्यूआर पर्ची जारी होती है। इसे किसान अपने मोबाइल में सेव कर सकते हैं या पर्ची निकाल सकते हैं।'
              : 'Every reservation yields a deterministic SHA-256 digest encoding farmer Aadhaar, mandi ID, vehicle type, and timestamp for offline validation.'}
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-xs space-y-4">
          <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 w-fit">
            <ShieldCheck className="w-8 h-8 text-emerald-800" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">
            {isHindi ? '3. त्वरित गेट सत्यापन (Zero-Wait Entry)' : '3. Rapid Mandi Gate Admission'}
          </h3>
          <p className="text-base text-slate-600 leading-relaxed font-medium">
            {isHindi
              ? 'मंडी गेट पर तैनात सुरक्षाकर्मी टोकन स्कैन करते हैं। इंटरनेट धीमा या अनुपस्थित होने पर भी टोकन की सत्यता प्रमाणित हो जाती है, जिससे 10 सेकंड में वाहन प्रवेश मिलता है।'
              : 'Security staff verify the cryptographic token. Vehicle authorization and weight declarations are instantly confirmed in under 10 seconds.'}
          </p>
        </div>

        {/* Step 4 */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-xs space-y-4">
          <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 w-fit">
            <Scale className="w-8 h-8 text-emerald-800" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">
            {isHindi ? '4. वे-ब्रिज एवं गुणवत्ता जांच (Quality Ledger)' : '4. Automated Weighbridge & Payout'}
          </h3>
          <p className="text-base text-slate-600 leading-relaxed font-medium">
            {isHindi
              ? 'अंदर आने के बाद वाहन को सीधे खाली वे-ब्रिज पर भेजा जाता है। नमी स्तर, ग्रेड और शुद्ध वजन दर्ज होकर तुरंत भुगतान प्रक्रिया आरम्भ होती है।'
              : 'Vehicles proceed directly to dedicated weighbridges. Moisture levels, dockage grading, and approved net weights trigger automated direct bank payouts.'}
          </p>
        </div>
      </div>
    </div>
  );
}
