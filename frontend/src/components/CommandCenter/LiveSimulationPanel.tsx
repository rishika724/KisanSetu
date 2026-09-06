'use client';

import React from 'react';
import {
  Sliders,
  X,
  Truck,
  Smartphone,
  WifiOff,
  Wifi,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ShieldCheck,
  Building2,
  Sparkles,
  ArrowRight
  , MessageSquare
} from 'lucide-react';
import { CommandState } from './MockDataGenerator';

interface LiveSimulationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  state: CommandState;
  onSimulateSurge: () => void;
  onTriggerSms: () => void;
  onSendTestNotification: () => void;
  onToggleOffline: () => void;
  onReset: () => void;
  onDismissSms: () => void;
}

export function LiveSimulationPanel({
  isOpen,
  onClose,
  state,
  onSimulateSurge,
  onTriggerSms,
  onSendTestNotification,
  onToggleOffline,
  onReset,
  onDismissSms
}: LiveSimulationPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-xs flex justify-end animate-fadeIn">
      {/* Side Drawer Body */}
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l-4 border-slate-700 animate-slideLeft overflow-y-auto">
        {/* Drawer Header */}
        <div className="bg-slate-900 text-white p-6 flex items-start justify-between border-b-2 border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-950/90 rounded-2xl border border-emerald-500 text-emerald-400">
              <Sliders className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block">
                SIH Problem 26032 • Live Evaluation
              </span>
              <h2 className="text-xl font-black tracking-tight">
                SIH Live Demo Controller
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 hover:text-white transition-all"
            aria-label="Close Simulation Drawer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-6 space-y-6 flex-1">
          {/* Pitch Evaluator Notice */}
          <div className="p-4 bg-slate-100 rounded-2xl border-2 border-slate-200 text-xs text-slate-700 space-y-1">
            <span className="font-black text-slate-900 block uppercase tracking-wider">
              जज व मूल्यांकनकर्ताओं के लिए (For Hackathon Pitch):
            </span>
            <p className="font-medium leading-relaxed">
              नीचे दिए गए बटनों से आप लाइव प्रेजेंटेशन के दौरान मंडी की वास्तविक भीड़, ऑफ़लाइन प्रमाणीकरण, और तत्काल SMS DBT का प्रदर्शन कर सकते हैं।
            </p>
          </div>

          {/* Trigger 1: Simulate 20 Vehicles Arriving at Mandi Gate */}
          <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                परीक्षण 1: भीड़ सिमुलेशन (Rush Hour Surge)
              </span>
              {state.surgeActive && (
                <span className="text-[10px] font-black px-2 py-0.5 bg-rose-100 text-rose-950 border border-rose-400 rounded-md">
                  सक्रिय (+20 वाहन)
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={onSimulateSurge}
              className="w-full flex items-center space-x-3.5 p-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-base transition-all shadow-sm active:scale-98 min-h-[58px]"
            >
              <div className="p-2 bg-slate-800 rounded-xl text-emerald-400">
                <Truck className="w-7 h-7" />
              </div>
              <div className="text-left">
                <div className="leading-tight">Simulate 20 Vehicles Arriving</div>
                <div className="text-[11px] text-slate-300 font-medium">
                  यार्ड कतार व घंटों के चार्ट को तुरंत अपडेट करें
                </div>
              </div>
            </button>
          </div>

          {/* Trigger 2: Trigger Kisan Setu SMS Payout Alert */}
          <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-200 space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 block">
              परीक्षण 2: तत्काल DBT भुगतान अलर्ट (Instant SMS)
            </span>

            <button
              type="button"
              onClick={onTriggerSms}
              className="w-full flex items-center space-x-3.5 p-4 bg-emerald-700 hover:bg-emerald-600 text-white rounded-2xl font-black text-base transition-all shadow-sm active:scale-98 border-2 border-emerald-500 min-h-[58px]"
            >
              <div className="p-2 bg-emerald-800 rounded-xl text-white">
                <Smartphone className="w-7 h-7" />
              </div>
              <div className="text-left">
                <div className="leading-tight">Trigger Kisan Setu SMS Payout Alert</div>
                <div className="text-[11px] text-emerald-100 font-medium">
                  किसान के फ़ोन पर स्क्रीन पॉपअप SMS भेजें
                </div>
              </div>
            </button>
          </div>

          {/* Trigger 3: Toggle Offline Mode Test */}
          <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-200 space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 block">परीक्षण 3: किसान सूचना चैनल (Test Delivery)</span>
            <button type="button" onClick={onSendTestNotification} className="w-full flex min-h-[58px] items-center gap-3.5 rounded-2xl border-2 border-slate-700 bg-slate-900 p-4 text-left text-base font-black text-white">
              <MessageSquare className="h-7 w-7 text-emerald-400" />
              <span><span className="block leading-tight">Send Test SMS / WhatsApp</span><span className="text-[11px] font-medium text-slate-300">Demo delivery with visible channel results</span></span>
            </button>
          </div>

          {/* Trigger 4: Toggle Offline Mode Test */}
          <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                परीक्षण 3: ऑफ़लाइन सत्यापन (Offline Resiliency)
              </span>
              <span
                className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${
                  state.isOfflineSimulated
                    ? 'bg-amber-100 text-amber-950 border-amber-400'
                    : 'bg-emerald-100 text-emerald-950 border-emerald-400'
                }`}
              >
                {state.isOfflineSimulated ? 'ऑफ़लाइन (OFFLINE)' : 'ऑनलाइन (ONLINE)'}
              </span>
            </div>

            <button
              type="button"
              onClick={onToggleOffline}
              className={`w-full flex items-center space-x-3.5 p-4 rounded-2xl font-black text-base transition-all shadow-sm active:scale-98 min-h-[58px] ${
                state.isOfflineSimulated
                  ? 'bg-amber-700 hover:bg-amber-800 text-white border-2 border-amber-500'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-2 border-slate-300'
              }`}
            >
              <div
                className={`p-2 rounded-xl ${
                  state.isOfflineSimulated ? 'bg-amber-800 text-white' : 'bg-white text-slate-800'
                }`}
              >
                {state.isOfflineSimulated ? <WifiOff className="w-7 h-7" /> : <Wifi className="w-7 h-7" />}
              </div>
              <div className="text-left">
                <div className="leading-tight">Toggle Offline Mode Test</div>
                <div className="text-[11px] opacity-80 font-medium">
                  {state.isOfflineSimulated
                    ? 'सर्वर डिस्कनेक्ट है • QR पास ऑफ़लाइन मान्य रहेगा'
                    : 'इंटरनेट बंद करने का सिमुलेशन चलाएं'}
                </div>
              </div>
            </button>
          </div>

          {/* Trigger 4: Reset Simulation Data */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onReset}
              className="w-full flex items-center justify-center space-x-2 p-3.5 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 text-slate-800 rounded-2xl font-bold text-sm transition-all"
            >
              <RotateCcw className="w-5 h-5" />
              <span>रीसेट करें (Reset Simulation Data to Baseline)</span>
            </button>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-5 bg-slate-50 border-t-2 border-slate-200 text-center">
          <span className="text-xs font-bold text-slate-500">
            Kisan Setu Architecture: PWA Offline-First • SHA-256 Ledger • Zero Congestion
          </span>
        </div>
      </div>
    </div>
  );
}
