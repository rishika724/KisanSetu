'use client';

import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { useLanguage } from '../context/LanguageContext';
import { useVoiceAssistant } from '../context/VoiceAssistantContext';
import { PlayAudioButton } from './VoiceAssistant/PlayAudioButton';
import { useSyncStore, SyncBooking, getStageNumber, SIH_8_STAGES } from '../lib/syncStore';
import {
  ShieldCheck,
  QrCode,
  Printer,
  Share2,
  Building2,
  Calendar,
  Truck,
  User,
  Scale,
  Sparkles,
  WifiOff,
  CheckCircle2,
  Copy,
  Clock,
  ArrowRight
} from 'lucide-react';

interface OfflinePassCardProps {
  initialData?: any;
  onNavigateBooking?: () => void;
}

export function OfflinePassCard({ onNavigateBooking }: OfflinePassCardProps) {
  const { t, language } = useLanguage();
  const sync = useSyncStore();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeBooking: SyncBooking | null = sync.activeBooking;
  const [copied, setCopied] = useState(false);

  // Render QR Code onto canvas
  useEffect(() => {
    if (activeBooking && canvasRef.current) {
      const qrData = JSON.stringify({
        token: activeBooking.tokenNumber,
        hash: activeBooking.tokenHash,
        farmerId: activeBooking.farmerId,
        center: activeBooking.centerName,
        date: activeBooking.date,
        slot: activeBooking.timeSlot,
        crop: activeBooking.crop,
        qty: activeBooking.quantity,
        vehicle: activeBooking.vehicleType
      });

      QRCode.toCanvas(
        canvasRef.current,
        qrData,
        {
          width: 220,
          margin: 1,
          color: {
            dark: '#0f172a',
            light: '#ffffff'
          }
        },
        (error) => {
          if (error) console.error('QR render error:', error);
        }
      );
    }
  }, [activeBooking]);

  const handleCopyToken = () => {
    if (activeBooking) {
      navigator.clipboard.writeText(activeBooking.tokenHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleShare = async () => {
    if (activeBooking && navigator.share) {
      try {
        await navigator.share({
          title: t.digitalPass.title,
          text: `${t.digitalPass.tokenNumber}: ${activeBooking.tokenNumber}\n${t.digitalPass.center}: ${activeBooking.centerName}\n${t.digitalPass.timeSlot}: ${activeBooking.date} ${activeBooking.timeSlot}`,
          url: window.location.href
        });
      } catch (e) {
        handleCopyToken();
      }
    } else {
      handleCopyToken();
    }
  };

  if (!activeBooking) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl border-2 border-slate-200 text-center space-y-5 shadow-xs">
        <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center text-slate-500 border border-slate-300">
          <QrCode className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900">{t.digitalPass.noPassFound}</h3>
          <p className="text-sm font-medium text-slate-600 mt-1 max-w-md mx-auto">
            {t.digitalPass.noPassDesc}
          </p>
        </div>
        {onNavigateBooking && (
          <button
            type="button"
            onClick={onNavigateBooking}
            className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-base transition-all inline-flex items-center space-x-2"
          >
            <span>{t.digitalPass.bookSlotNow}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  }

  const stageNum = getStageNumber(activeBooking.status);
  const stageMeta = SIH_8_STAGES[stageNum - 1] || SIH_8_STAGES[0];
  const localizedStageTitle = (t.stages8 as any)[stageMeta.translationKey] || activeBooking.status;

  const statusColor =
    stageNum >= 7
      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
      : stageNum >= 3
      ? 'bg-purple-100 text-purple-900 border-purple-300'
      : stageNum === 2
      ? 'bg-blue-100 text-blue-900 border-blue-300'
      : 'bg-amber-100 text-amber-900 border-amber-300';

  const { activeHighlightKey } = useVoiceAssistant();
  const isHighlighted = activeHighlightKey === 'digital-pass-card';

  const passSpokenText = activeBooking
    ? language === 'te'
      ? `డిజిటల్ పాస్ నిర్ధారణ: టోకెన్ సంఖ్య ${activeBooking.tokenNumber}. రైతు ${activeBooking.farmerName}. సేకరణ కేంద్రం ${activeBooking.centerName}. రాక తేదీ ${activeBooking.date}, సమయం ${activeBooking.timeSlot}. పంట ${t.crops[activeBooking.crop]}, పరిమాణం ${activeBooking.quantity} క్వింటాళ్లు. వాహనం ${t.vehicles[activeBooking.vehicleType]}.`
      : language === 'hi'
      ? `डिजिटल पास विवरण: टोकन नंबर ${activeBooking.tokenNumber}। किसान ${activeBooking.farmerName}। खरीद केंद्र ${activeBooking.centerName}। आगमन तिथि ${activeBooking.date}, समय ${activeBooking.timeSlot}। फसल ${t.crops[activeBooking.crop]}, मात्रा ${activeBooking.quantity} क्विंटल। वाहन ${t.vehicles[activeBooking.vehicleType]}।`
      : `Digital Pass Summary: Token ${activeBooking.tokenNumber} for farmer ${activeBooking.farmerName}. Center: ${activeBooking.centerName}. Arrival Date: ${activeBooking.date}, Slot: ${activeBooking.timeSlot}. Crop: ${t.crops[activeBooking.crop]}, Quantity: ${activeBooking.quantity} quintals. Vehicle: ${t.vehicles[activeBooking.vehicleType]}.`
    : t.digitalPass.noPassFound;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Printable Digital Pass */}
      <div
        className={`bg-white rounded-3xl border-2 shadow-lg overflow-hidden printable-pass transition-all duration-300 ${
          isHighlighted
            ? 'ring-4 ring-emerald-500 shadow-2xl scale-[1.01] border-emerald-500 bg-emerald-50/20'
            : 'border-slate-300'
        }`}
      >
        {/* Pass Top Banner */}
        <div className="p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-700">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 bg-slate-800 rounded-2xl border border-slate-700 text-emerald-400">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-emerald-400">
                {t.brandName}
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                {t.digitalPass.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-center">
            <PlayAudioButton
              textToSpeak={passSpokenText}
              highlightKey="digital-pass-card"
              size="sm"
            />
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-slate-300">
              <WifiOff className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.digitalPass.offlineBadge}</span>
            </div>
          </div>
        </div>

        {/* QR Code & Token Header */}
        <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-slate-200 bg-slate-50">
          <div className="flex flex-col items-center p-3 bg-white rounded-2xl border-2 border-slate-300 shadow-inner">
            <canvas ref={canvasRef} className="rounded-lg max-w-[200px] h-auto" />
            <span className="text-[10px] font-mono font-bold text-slate-500 mt-2">
              {activeBooking.tokenNumber}
            </span>
          </div>

          <div className="flex-1 space-y-3 text-center sm:text-left">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                {t.digitalPass.tokenNumber}
              </span>
              <div className="text-3xl font-black text-slate-900 font-mono tracking-tight">
                {activeBooking.tokenNumber}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                {t.digitalPass.status}
              </span>
              <div className="mt-1">
                <span className={`inline-block px-3.5 py-1 rounded-xl text-xs font-black border ${statusColor}`}>
                  {localizedStageTitle}
                </span>
              </div>
            </div>

            <div className="pt-1">
              <span className="text-[11px] font-bold text-slate-500 block mb-1">
                {t.digitalPass.tokenHash}
              </span>
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <code className="text-xs font-mono bg-white px-2.5 py-1 rounded-lg border border-slate-300 text-slate-700 truncate max-w-[220px]">
                  {activeBooking.tokenHash}
                </code>
                <button
                  type="button"
                  onClick={handleCopyToken}
                  className="p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-slate-700"
                  title="Copy Hash"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pass Details Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-2 gap-4 text-sm bg-white">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 flex items-center space-x-1.5">
              <User className="w-4 h-4 text-slate-400" />
              <span>{t.digitalPass.farmerName}</span>
            </span>
            <p className="font-black text-base text-slate-900">{activeBooking.farmerName}</p>
            <p className="text-xs font-mono text-slate-500">{activeBooking.farmerId}</p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 flex items-center space-x-1.5">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span>{t.digitalPass.center}</span>
            </span>
            <p className="font-black text-base text-slate-900">{activeBooking.centerName}</p>
            <p className="text-xs text-slate-500">{activeBooking.village}</p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{t.digitalPass.timeSlot}</span>
            </span>
            <p className="font-black text-base text-slate-900">{activeBooking.date}</p>
            <p className="text-xs font-bold text-emerald-700">{activeBooking.timeSlot}</p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 flex items-center space-x-1.5">
              <Scale className="w-4 h-4 text-slate-400" />
              <span>{t.digitalPass.crop} & {t.digitalPass.quantity}</span>
            </span>
            <p className="font-black text-base text-slate-900">
              {t.crops[activeBooking.crop]}
            </p>
            <p className="text-xs font-bold text-slate-600">
              {activeBooking.quantity} {t.common.quintal} • {t.vehicles[activeBooking.vehicleType]}
            </p>
          </div>

          {/* If Quality Inspection Completed, show final weigh slip details */}
          {activeBooking.qualityInspection && (
            <div className="col-span-2 p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-200 space-y-2 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-emerald-900">
                  {t.adminDashboard.weighingInspection}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded-md">
                  {t.adminDashboard.weighingForm.dockageGrade} {activeBooking.qualityInspection.dockageGrade}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-emerald-950">
                <div>
                  <span className="text-emerald-700 block">{t.adminDashboard.weighingForm.moistureLevel}</span>
                  <strong>{activeBooking.qualityInspection.moistureLevel}%</strong>
                </div>
                <div>
                  <span className="text-emerald-700 block">{t.adminDashboard.weighingForm.netWeight}</span>
                  <strong>{activeBooking.qualityInspection.netWeight} {t.common.kg}</strong>
                </div>
                <div>
                  <span className="text-emerald-700 block">{t.adminDashboard.weighingForm.netPayout}</span>
                  <strong className="text-sm text-emerald-900 font-black">
                    ₹{activeBooking.qualityInspection.totalPayout.toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Offline Notice Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 text-center text-xs font-medium text-slate-600">
          {t.digitalPass.offlineNotice}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          onClick={handlePrint}
          className="w-full flex-1 flex items-center justify-center space-x-2.5 p-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-base transition-all min-h-[52px] shadow-sm"
        >
          <Printer className="w-5 h-5" />
          <span>{t.digitalPass.printPass}</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="w-full flex-1 flex items-center justify-center space-x-2.5 p-4 bg-white hover:bg-slate-100 text-slate-800 border-2 border-slate-300 rounded-2xl font-bold text-base transition-all min-h-[52px]"
        >
          <Share2 className="w-5 h-5" />
          <span>{t.digitalPass.sharePass}</span>
        </button>
      </div>
    </div>
  );
}
