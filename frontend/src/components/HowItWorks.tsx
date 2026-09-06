'use client';

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  CalendarCheck,
  QrCode,
  ShieldCheck,
  Scale
} from 'lucide-react';

export function HowItWorks() {
  const { language } = useLanguage();

  const isTelugu = language === 'te';
  const isHindi = language === 'hi';

  const content = isTelugu
    ? {
        badge: 'స్మార్ట్ ఇండియా హ్యాకథాన్ సమస్య ప్రకటన 26032',
        title: 'కిసాన్ సేతు ఎలా పనిచేస్తుంది?',
        desc: 'డిజిటల్ షెడ్యూలింగ్ మరియు క్రిప్టోగ్రాఫిక్ 256-బిట్ ఆఫ్‌లైన్ టోకెన్ల ద్వారా మండిలో రద్దీని నియంత్రించి, ట్రాఫిక్ జామ్‌లు మరియు రైతుల సుదీర్ఘ నిరీక్షణను నివారించే ఆధునిక వ్యవస్థ.',
        step1Title: '౧. ముందస్తు స్లాట్ బుకింగ్ (డైనమిక్ సామర్థ్యం)',
        step1Desc: 'రైతులు తమ సౌలభ్యం ప్రకారం మండి మరియు 1 గంట రాక సమయాన్ని ఎంచుకుంటారు. వేబ్రిడ్జి సామర్థ్యానికి అనుగుణంగా సిస్టమ్ స్వయంచాలకంగా స్లాట్ లభ్యతను నియంత్రిస్తుంది.',
        step2Title: '౨. SHA-256 ఆఫ్‌లైన్ టోకెన్ పాస్',
        step2Desc: 'బుకింగ్ ధృవీకరించబడిన వెంటనే SHA-256 ఎన్‌క్రిప్ట్ చేయబడిన ఆఫ్‌లైన్ టోకెన్ మరియు క్యూఆర్ పాస్ జారీ చేయబడుతుంది. ఇంటర్నెట్ లేకపోయినా దీనిని ఉపయోగించవచ్చు.',
        step3Title: '౩. వేగవంతమైన గేట్ ప్రవేశం (జీరో-వెయిట్)',
        step3Desc: 'గేట్ వద్ద భద్రతా సిబ్బంది క్యూఆర్ టోకెన్‌ను స్కాన్ చేస్తారు. ఇంటర్నెట్ లేకపోయినా 10 సెకన్లలో ప్రామాణికత నిర్ధారించబడి వాహనం యార్డులోకి ప్రవేశిస్తుంది.',
        step4Title: '౪. వేబ్రిడ్జి & నాణ్యతా రసీదు (డిజిటల్ సెటిల్‌మెంట్)',
        step4Desc: 'ప్రవేశించిన వెంటనే వాహనం నేరుగా నిర్దేశిత వేబ్రిడ్జి వద్దకు వెళుతుంది. తేమ శాతం, నాణ్యత గ్రేడ్ మరియు నికర బరువు నమోదై డిజిటల్ రసీదు ద్వారా నేరుగా బ్యాంక్ ఖాతాకు చెల్లింపు జరుగుతుంది.'
      }
    : isHindi
    ? {
        badge: 'स्मार्ट इंडिया हैकाथॉन समस्या विवरण 26032',
        title: 'किसान सेतु कैसे काम करता है?',
        desc: 'डिजिटल शेड्यूलिंग और क्रिप्टोग्राफ़िक 256-बिट ऑफलाइन टोकन के माध्यम से मंडियों में लंबी कतारों, ट्रैफिक जाम और किसानों के अनावश्यक इंतजार को समाप्त करने की आधुनिक प्रणाली।',
        step1Title: '१. अग्रिम स्लॉट बुकिंग (Dynamic Capacity)',
        step1Desc: 'किसान अपनी सुविधानुसार मंडी और 1 घंटे की समय खिड़की चुनते हैं। प्रणाली स्वचालित रूप से वे-ब्रिज क्षमता के अनुसार स्लॉट की उपलब्धता नियंत्रित करती है।',
        step2Title: '२. SHA-256 ऑफलाइन टोकन',
        step2Desc: 'बुकिंग होते ही SHA-256 एन्क्रिप्टेड ऑफलाइन टोकन स्ट्रिंग व क्यूआर पर्ची जारी होती है। इसे किसान अपने मोबाइल में सेव कर सकते हैं या पर्ची निकाल सकते हैं।',
        step3Title: '३. त्वरित गेट सत्यापन (Zero-Wait Entry)',
        step3Desc: 'मंडी गेट पर तैनात सुरक्षाकर्मी टोकन स्कैन करते हैं। इंटरनेट धीमा या अनुपस्थित होने पर भी टोकन की सत्यता प्रमाणित हो जाती है, जिससे 10 सेकंड में वाहन प्रवेश मिलता है।',
        step4Title: '४. वे-ब्रिज एवं गुणवत्ता जांच (Quality Ledger)',
        step4Desc: 'अंदर आने के बाद वाहन को सीधे खाली वे-ब्रिज पर भेजा जाता है। नमी स्तर, ग्रेड और शुद्ध वजन दर्ज होकर तुरंत भुगतान प्रक्रिया आरम्भ होती है।'
      }
    : {
        badge: 'SIH Problem Statement 26032',
        title: 'How Kisan Setu Solves Mandi Congestion',
        desc: 'A modern scheduling & cryptographic tokenization architecture that eliminates mandi gridlocks, regulates weighbridge traffic, and functions reliably in zero-internet rural environments.',
        step1Title: '1. Capacity-Aware Slot Scheduling',
        step1Desc: 'Farmers pre-reserve 1-hour delivery windows. The backend automatically caps hourly bookings according to weighbridge capacity to prevent yard saturation.',
        step2Title: '2. SHA-256 Tamper-Proof Offline Pass',
        step2Desc: 'Every reservation yields a deterministic SHA-256 digest encoding farmer Aadhaar, mandi ID, vehicle type, and timestamp for offline validation.',
        step3Title: '3. Rapid Mandi Gate Admission',
        step3Desc: 'Security staff verify the cryptographic token. Vehicle authorization and weight declarations are instantly confirmed in under 10 seconds.',
        step4Title: '4. Automated Weighbridge & Payout',
        step4Desc: 'Vehicles proceed directly to dedicated weighbridges. Moisture levels, dockage grading, and approved net weights trigger automated direct bank payouts.'
      };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Overview Header */}
      <div className="bg-white p-8 rounded-3xl border-2 border-slate-200 shadow-xs text-center space-y-3">
        <span className="text-xs uppercase tracking-widest text-emerald-800 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          {content.badge}
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          {content.title}
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          {content.desc}
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
            {content.step1Title}
          </h3>
          <p className="text-base text-slate-600 leading-relaxed font-medium">
            {content.step1Desc}
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-xs space-y-4">
          <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 w-fit">
            <QrCode className="w-8 h-8 text-emerald-800" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">
            {content.step2Title}
          </h3>
          <p className="text-base text-slate-600 leading-relaxed font-medium">
            {content.step2Desc}
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-xs space-y-4">
          <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 w-fit">
            <ShieldCheck className="w-8 h-8 text-emerald-800" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">
            {content.step3Title}
          </h3>
          <p className="text-base text-slate-600 leading-relaxed font-medium">
            {content.step3Desc}
          </p>
        </div>

        {/* Step 4 */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-xs space-y-4">
          <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 w-fit">
            <Scale className="w-8 h-8 text-emerald-800" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">
            {content.step4Title}
          </h3>
          <p className="text-base text-slate-600 leading-relaxed font-medium">
            {content.step4Desc}
          </p>
        </div>
      </div>
    </div>
  );
}
