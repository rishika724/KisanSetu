'use client';

import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { useLanguage } from '../context/LanguageContext';
import { BookingResponseData } from '../lib/api';
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
  Copy
} from 'lucide-react';

interface OfflinePassCardProps {
  initialData?: BookingResponseData | null;
  onNavigateBooking?: () => void;
}

export function OfflinePassCard({ initialData, onNavigateBooking }: OfflinePassCardProps) {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [passData, setPassData] = useState<BookingResponseData | null>(initialData || null);
  const [copied, setCopied] = useState(false);

  // Load from localStorage if initialData not passed
  useEffect(() => {
    if (initialData) {
      setPassData(initialData);
      return;
    }

    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('kisan_setu_active_pass');
      if (cached) {
        try {
          setPassData(JSON.parse(cached));
        } catch (e) {
          console.error('Failed to parse cached pass:', e);
        }
      }
    }
  }, [initialData]);

  // Render high-contrast QR code
  useEffect(() => {
    if (passData && canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        passData.token.qrPayload,
        {
          width: 240,
          margin: 1,
          color: {
            dark: '#0f172a',
            light: '#ffffff'
          }
        },
        (error) => {
          if (error) console.error('QR code generation error:', error);
        }
      );
    }
  }, [passData]);

  const handleCopyToken = () => {
    if (passData) {
      navigator.clipboard.writeText(passData.token.tokenHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (passData && navigator.share) {
      try {
        await navigator.share({
          title: 'Kisan Setu Mandi Entry Pass',
          text: `Kisan Setu Token: ${passData.token.tokenHash}\nSlot: ${passData.booking.slot?.timeWindow}\nCenter: ${passData.booking.slot?.center?.name}`,
          url: window.location.href
        });
      } catch (err) {
        handleCopyToken();
      }
    } else {
      handleCopyToken();
    }
  };

  if (!passData) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl border-2 border-slate-200 shadow-xs text-center space-y-4">
        <div className="p-4 bg-slate-100 rounded-3xl border border-slate-200 w-fit mx-auto">
          <QrCode className="w-10 h-10 text-slate-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">{t.offlinePass.noPassFound}</h2>
        <p className="text-base text-slate-600 max-w-md mx-auto">{t.offlinePass.noPassDesc}</p>
        {onNavigateBooking && (
          <button
            type="button"
            onClick={onNavigateBooking}
            className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-lg transition-all min-h-[56px]"
          >
            {t.offlinePass.bookNowBtn}
          </button>
        )}
      </div>
    );
  }

  const { booking, token } = passData;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Official Offline Pass Card */}
      <div className="bg-white rounded-3xl border-2 border-slate-300 shadow-lg overflow-hidden">
        {/* Pass Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-slate-800 rounded-2xl border border-slate-700">
              <ShieldCheck className="w-8 h-8 text-emerald-400" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold block mb-0.5">
                {t.offlinePass.savedOfflineBadge}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                {t.offlinePass.title}
              </h2>
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>PWA Cached</span>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Offline Notice Banner */}
          <div className="flex items-center space-x-3 p-4 bg-emerald-50 border border-emerald-300 rounded-2xl">
            <WifiOff className="w-7 h-7 text-emerald-800 shrink-0" />
            <p className="text-xs sm:text-sm font-semibold text-emerald-950 leading-relaxed">
              {t.offlinePass.offlineNotice}
            </p>
          </div>

          {/* Large Scannable QR Code Canvas Box */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border-2 border-slate-200 rounded-3xl space-y-3">
            <canvas ref={canvasRef} className="rounded-2xl border-2 border-slate-300 shadow-sm bg-white p-2" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Mandi Gate Offline Verifiable QR
            </span>
          </div>

          {/* Token Number & Hash Display */}
          <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t.offlinePass.tokenNumberLabel}
              </span>
              <button
                type="button"
                onClick={handleCopyToken}
                className="flex items-center space-x-1 text-xs font-bold text-slate-700 hover:text-slate-900"
              >
                <Copy className="w-4 h-4" />
                <span>{copied ? 'Copied!' : 'Copy Hash'}</span>
              </button>
            </div>
            <div className="font-mono text-xs sm:text-sm bg-white p-3 rounded-xl border border-slate-300 break-all select-all font-bold text-slate-900 shadow-inner">
              {token.tokenHash}
            </div>
          </div>

          {/* Booking Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Center */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start space-x-3">
              <Building2 className="w-7 h-7 text-slate-700 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold uppercase text-slate-500">{t.offlinePass.centerLabel}</div>
                <div className="text-base font-bold text-slate-900">{booking.slot?.center?.name || 'Mandi Center'}</div>
              </div>
            </div>

            {/* Assigned Slot */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start space-x-3">
              <Calendar className="w-7 h-7 text-slate-700 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold uppercase text-slate-500">{t.offlinePass.slotLabel}</div>
                <div className="text-base font-bold text-slate-900">{booking.slot?.date}</div>
                <div className="text-sm font-bold text-emerald-800">{booking.slot?.timeWindow}</div>
              </div>
            </div>

            {/* Vehicle & Crop */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start space-x-3">
              <Truck className="w-7 h-7 text-slate-700 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold uppercase text-slate-500">{t.offlinePass.vehicleLabel}</div>
                <div className="text-base font-bold text-slate-900">{booking.vehicleType}</div>
                <div className="text-xs text-slate-600 font-medium">Unloading Priority Allocated</div>
              </div>
            </div>

            {/* Crop & Weight */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start space-x-3">
              <Scale className="w-7 h-7 text-slate-700 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold uppercase text-slate-500">{t.offlinePass.cropWeightLabel}</div>
                <div className="text-base font-bold text-slate-900">{booking.cropType}</div>
                <div className="text-sm font-bold text-slate-700">{booking.estimatedWeight} क्विंटल (Quintals)</div>
              </div>
            </div>
          </div>

          {/* Action Buttons: Print & Share */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex-1 flex items-center justify-center space-x-3 p-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-lg transition-all min-h-[56px] active:scale-98"
            >
              <Printer className="w-6 h-6" />
              <span>{t.offlinePass.printPass}</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="flex-1 flex items-center justify-center space-x-3 p-4 bg-slate-100 hover:bg-slate-200 text-slate-800 border-2 border-slate-300 rounded-2xl font-bold text-lg transition-all min-h-[56px]"
            >
              <Share2 className="w-6 h-6" />
              <span>{t.offlinePass.sharePass}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
