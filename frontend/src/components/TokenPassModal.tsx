'use client';

import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { useLanguage } from '../context/LanguageContext';
import { BookingResponseData } from '../lib/api';
import { CheckCircle2, QrCode, Shield, Printer, X, Truck, Calendar, MapPin, User, Scale } from 'lucide-react';

interface TokenPassModalProps {
  bookingData: BookingResponseData | null;
  onClose: () => void;
}

export function TokenPassModal({ bookingData, onClose }: TokenPassModalProps) {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (bookingData && canvasRef.current) {
      // Render offline QR code with high error correction
      QRCode.toCanvas(
        canvasRef.current,
        bookingData.token.qrPayload,
        {
          width: 220,
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
  }, [bookingData]);

  if (!bookingData) return null;

  const { booking, token } = bookingData;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full border-2 border-slate-300 shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-slate-800 rounded-2xl border border-slate-700">
              <Shield className="w-8 h-8 text-emerald-400" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold block mb-1">
                {t.tokenPass.officialPass}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold">
                {t.tokenPass.modalTitle}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
            aria-label={t.tokenPass.close}
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Printable Pass Body */}
        <div className="p-6 sm:p-8 space-y-6 print:p-0">
          {/* Success Banner */}
          <div className="flex items-center space-x-4 p-4 bg-emerald-50 border border-emerald-300 rounded-2xl">
            <CheckCircle2 className="w-8 h-8 text-emerald-800 shrink-0" aria-hidden="true" />
            <div>
              <div className="text-lg font-bold text-emerald-950">
                {t.booking.bookingSuccess}
              </div>
              <div className="text-sm font-medium text-emerald-800">
                Status: {booking.status}
              </div>
            </div>
          </div>

          {/* QR Code & Token Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center p-6 bg-slate-50 border-2 border-slate-200 rounded-2xl">
            <div className="flex flex-col items-center justify-center sm:col-span-1">
              <canvas ref={canvasRef} className="rounded-xl border border-slate-300 shadow-xs" />
              <div className="flex items-center space-x-2 mt-2 text-xs font-semibold text-slate-600">
                <QrCode className="w-5 h-5 text-slate-700" />
                <span>Offline Verifiable QR</span>
              </div>
            </div>

            <div className="sm:col-span-2 space-y-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  {t.tokenPass.tokenHashLabel}
                </label>
                <div className="font-mono text-xs sm:text-sm bg-white p-3 rounded-xl border border-slate-300 break-all text-slate-800 select-all font-semibold shadow-inner">
                  {token.tokenHash}
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.tokenPass.offlineNotice}
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <User className="w-7 h-7 text-slate-700" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-semibold uppercase">{t.tokenPass.farmerLabel}</div>
                <div className="text-lg font-bold text-slate-900">{booking.farmer?.name || 'किसान (Farmer)'}</div>
                <div className="text-xs text-slate-600">{booking.farmer?.locationVillage || 'गाँव'}</div>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <MapPin className="w-7 h-7 text-slate-700" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-semibold uppercase">{t.tokenPass.centerLabel}</div>
                <div className="text-base font-bold text-slate-900">{booking.slot?.center?.name || 'मंडी केंद्र'}</div>
                <div className="text-xs text-slate-600">Weighbridges: {booking.slot?.center?.weighbridgeCount || 4}</div>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <Calendar className="w-7 h-7 text-slate-700" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-semibold uppercase">{t.tokenPass.slotLabel}</div>
                <div className="text-lg font-bold text-slate-900">{booking.slot?.date}</div>
                <div className="text-sm font-semibold text-emerald-800">{booking.slot?.timeWindow}</div>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <Truck className="w-7 h-7 text-slate-700" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-semibold uppercase">{t.tokenPass.vehicleLabel} & {t.tokenPass.cropLabel}</div>
                <div className="text-base font-bold text-slate-900">{booking.vehicleType} • {booking.cropType}</div>
                <div className="text-sm font-medium text-slate-700 flex items-center space-x-1">
                  <Scale className="w-4 h-4 text-slate-500 inline" />
                  <span>{booking.estimatedWeight} {t.booking.weightUnit}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center space-x-3 px-6 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-lg transition-all touch-target-large active:scale-98"
            >
              <Printer className="w-7 h-7" aria-hidden="true" />
              <span>{t.tokenPass.printPass}</span>
            </button>
            <button
              onClick={onClose}
              className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-800 border-2 border-slate-300 rounded-2xl font-bold text-lg transition-all touch-target-large"
            >
              {t.tokenPass.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
