'use client';

import React, { useState } from 'react';
import { useVoiceAssistant } from '../../context/VoiceAssistantContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  ChevronDown,
  X,
  Radio,
  Calendar,
  Truck,
  CloudSun,
  QrCode,
  CheckCircle2,
  MessageSquare,
  HelpCircle
} from 'lucide-react';

export function VoiceAssistantWidget() {
  const {
    isListening,
    isSpeaking,
    transcript,
    assistantResponse,
    guidedStep,
    isSupported,
    toggleListening,
    stopListening,
    speak,
    stopSpeaking,
    startGuidedBooking,
    cancelGuidedBooking
  } = useVoiceAssistant();

  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* EXPANDABLE VOICE ASSISTANT DRAWER / PANEL */}
      {isOpen && (
        <div className="mb-4 w-92 sm:w-[420px] max-w-[calc(100vw-2rem)] bg-white rounded-3xl border-2 border-slate-300 shadow-2xl overflow-hidden animate-scaleIn">
          {/* Header */}
          <div className="bg-slate-900 text-white p-4.5 flex items-center justify-between border-b-2 border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-emerald-500/20 border border-emerald-400/40 rounded-2xl text-emerald-400">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-black text-base text-white leading-tight">
                  {t.voiceAssistant.assistantTitle}
                </h3>
                <div className="flex items-center space-x-2 mt-0.5">
                  <span className="text-[11px] text-slate-300 font-bold">
                    {language === 'te' ? 'తెలుగు (te-IN)' : language === 'hi' ? 'हिंदी (hi-IN)' : 'English (en-IN)'}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[10px] uppercase font-black tracking-wider text-emerald-400">
                    {isListening ? t.voiceAssistant.listening : isSpeaking ? t.voiceAssistant.speaking : t.voiceAssistant.ready}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1.5">
              {isSpeaking && (
                <button
                  type="button"
                  onClick={stopSpeaking}
                  title={t.voiceAssistant.stopAudio}
                  className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                >
                  <VolumeX className="w-5 h-5 text-amber-400" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Active Status & Soundwave Display */}
          <div className="p-5 space-y-4 max-h-[460px] overflow-y-auto">
            {/* Listening / Speaking Animation Canvas */}
            <div
              className={`p-4 rounded-2xl border-2 transition-all flex items-center space-x-4 ${
                isListening
                  ? 'bg-emerald-50 border-emerald-500 shadow-md'
                  : isSpeaking
                  ? 'bg-amber-50 border-amber-500 shadow-md'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              {/* Mic Icon with Audio Waves */}
              <div className="relative shrink-0">
                {isListening && (
                  <div className="absolute -inset-2 bg-emerald-400/40 rounded-full animate-ping pointer-events-none" />
                )}
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    isListening
                      ? 'bg-emerald-600 text-white scale-105'
                      : isSpeaking
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-800 text-white'
                  }`}
                >
                  {isListening ? (
                    <Mic className="w-6 h-6 animate-pulse" />
                  ) : isSpeaking ? (
                    <Volume2 className="w-6 h-6 animate-bounce" />
                  ) : (
                    <Mic className="w-6 h-6 text-slate-300" />
                  )}
                </div>
              </div>

              {/* Status Message & Soundwave Bars */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                    {isListening
                      ? t.voiceAssistant.listening
                      : isSpeaking
                      ? t.voiceAssistant.speaking
                      : t.voiceAssistant.ready}
                  </span>
                  {/* Equalizer Waveform Bars */}
                  {(isListening || isSpeaking) && (
                    <div className="flex items-center space-x-1">
                      <span className="w-1 h-3 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="w-1 h-5 bg-emerald-500 rounded-full animate-pulse delay-75" />
                      <span className="w-1 h-4 bg-emerald-500 rounded-full animate-pulse delay-150" />
                      <span className="w-1 h-6 bg-emerald-500 rounded-full animate-pulse delay-100" />
                      <span className="w-1 h-2 bg-emerald-500 rounded-full animate-pulse delay-200" />
                    </div>
                  )}
                </div>

                <p className="text-sm font-bold text-slate-800 truncate mt-0.5">
                  {transcript ? `"${transcript}"` : isSpeaking ? assistantResponse : t.voiceAssistant.assistantSubtitle}
                </p>
              </div>
            </div>

            {/* GUIDED VOICE BOOKING ACTIVE STEPPER (For low-literacy farmers) */}
            {guidedStep !== null && (
              <div className="p-4 bg-emerald-900 text-white rounded-2xl border-2 border-emerald-500/50 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-emerald-300 tracking-wider">
                    {t.voiceAssistant.guidedTitle}
                  </span>
                  <button
                    type="button"
                    onClick={cancelGuidedBooking}
                    className="text-[11px] text-red-300 hover:text-white underline font-bold"
                  >
                    {t.voiceAssistant.guidedRestart}
                  </button>
                </div>

                {/* Step indicator bar */}
                <div className="grid grid-cols-3 gap-1.5">
                  <div className={`h-1.5 rounded-full ${guidedStep >= 0 ? 'bg-emerald-400' : 'bg-slate-700'}`} />
                  <div className={`h-1.5 rounded-full ${guidedStep >= 1 ? 'bg-emerald-400' : 'bg-slate-700'}`} />
                  <div className={`h-1.5 rounded-full ${guidedStep >= 2 ? 'bg-emerald-400' : 'bg-slate-700'}`} />
                </div>

                <p className="text-xs sm:text-sm font-bold text-slate-100 leading-relaxed">
                  {guidedStep === 0
                    ? t.voiceAssistant.guidedStep1
                    : guidedStep === 1
                    ? t.voiceAssistant.guidedStep2
                    : t.voiceAssistant.guidedStep3}
                </p>

                {/* Tap-to-Answer helper chips for accessibility */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {guidedStep === 0 && (
                    <>
                      {['Paddy', 'Wheat', 'Mustard', 'Cotton'].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => speak(c)}
                          className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                        >
                          {c}
                        </button>
                      ))}
                    </>
                  )}
                  {guidedStep === 1 && (
                    <>
                      {['25 Quintals', '35 Quintals', '50 Quintals'].map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => speak(q)}
                          className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                        >
                          {q}
                        </button>
                      ))}
                    </>
                  )}
                  {guidedStep === 2 && (
                    <>
                      {['Tractor', 'Truck', 'Bullock Cart'].map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => speak(v)}
                          className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                        >
                          {v}
                        </button>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Quick Voice Command Chips */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                {t.voiceAssistant.commandsTitle}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => speak(t.voiceAssistant.cmdBookSlot)}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl text-left text-xs font-bold text-slate-800 transition-all flex items-center space-x-2"
                >
                  <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="truncate">{t.voiceAssistant.cmdBookSlot}</span>
                </button>

                <button
                  type="button"
                  onClick={() => speak(t.voiceAssistant.cmdCheckQueue)}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl text-left text-xs font-bold text-slate-800 transition-all flex items-center space-x-2"
                >
                  <Truck className="w-4 h-4 text-amber-700 shrink-0" />
                  <span className="truncate">{t.voiceAssistant.cmdCheckQueue}</span>
                </button>

                <button
                  type="button"
                  onClick={() => speak(t.voiceAssistant.cmdReadWeather)}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl text-left text-xs font-bold text-slate-800 transition-all flex items-center space-x-2"
                >
                  <CloudSun className="w-4 h-4 text-blue-700 shrink-0" />
                  <span className="truncate">{t.voiceAssistant.cmdReadWeather}</span>
                </button>

                <button
                  type="button"
                  onClick={startGuidedBooking}
                  className="p-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-950 rounded-xl text-left text-xs font-black transition-all flex items-center space-x-2"
                >
                  <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="truncate">{t.voiceAssistant.cmdStartGuided}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={toggleListening}
              className={`flex-1 py-3 px-4 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 transition-all shadow-md active:scale-98 ${
                isListening
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-emerald-700 hover:bg-emerald-600 text-white'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              <span>{isListening ? t.voiceAssistant.stopAudio : t.voiceAssistant.listening.split('...')[0]}</span>
            </button>

            {isSpeaking && (
              <button
                type="button"
                onClick={stopSpeaking}
                className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-black text-sm transition-all"
              >
                {t.voiceAssistant.stopAudio}
              </button>
            )}
          </div>
        </div>
      )}

      {/* PROMINENT FLOATING MICROPHONE BUTTON WITH PULSATING AUDIO WAVE FEEDBACK */}
      <div className="relative group">
        {/* Pulsating Concentric Audio Wave Rings when listening */}
        {isListening && (
          <>
            <div className="absolute -inset-4 rounded-full bg-emerald-400/30 animate-ping pointer-events-none" />
            <div className="absolute -inset-2 rounded-full bg-emerald-500/40 animate-pulse pointer-events-none" />
          </>
        )}

        {/* Outer Glow Ring when speaking */}
        {isSpeaking && (
          <div className="absolute -inset-2 rounded-full bg-amber-400/40 animate-pulse pointer-events-none" />
        )}

        <button
          type="button"
          onClick={() => {
            if (!isOpen) {
              setIsOpen(true);
            }
            toggleListening();
          }}
          aria-label={t.voiceAssistant.assistantTitle}
          className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform active:scale-95 border-4 ${
            isListening
              ? 'bg-emerald-600 border-white text-white shadow-[0_0_30px_rgba(16,185,129,0.8)] scale-110'
              : isSpeaking
              ? 'bg-amber-600 border-white text-white shadow-[0_0_25px_rgba(245,158,11,0.8)]'
              : 'bg-slate-900 hover:bg-slate-800 border-emerald-400 text-white hover:scale-105'
          }`}
        >
          {isListening ? (
            <Mic className="w-8 h-8 animate-pulse text-white" />
          ) : isSpeaking ? (
            <Volume2 className="w-8 h-8 animate-bounce text-white" />
          ) : (
            <Mic className="w-8 h-8 text-emerald-400 group-hover:text-emerald-300" />
          )}

          {/* Status Dot */}
          <span
            className={`absolute top-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
              isListening ? 'bg-emerald-400 animate-ping' : isSpeaking ? 'bg-amber-400' : 'bg-emerald-500'
            }`}
          />
        </button>

        {/* Hover Tooltip for Accessibility */}
        {!isOpen && (
          <div className="absolute bottom-full right-0 mb-3 hidden group-hover:block whitespace-nowrap">
            <div className="bg-slate-900 text-white text-xs font-black py-1.5 px-3 rounded-xl shadow-lg border border-slate-700 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.voiceAssistant.assistantTitle}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
