'use client';

import React, { useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useVoiceAssistant } from '../context/VoiceAssistantContext';
import { PlayAudioButton } from './VoiceAssistant/PlayAudioButton';
import { SyncBooking } from '../lib/syncStore';
import {
  FileCheck2,
  Printer,
  Download,
  X,
  CheckCircle2,
  ShieldCheck,
  Building2,
  User,
  Calendar,
  Scale,
  DollarSign,
  QrCode,
  Sparkles,
  Layers,
  Landmark
} from 'lucide-react';

interface DigitalReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: SyncBooking;
}

export function DigitalReceiptModal({
  isOpen,
  onClose,
  booking
}: DigitalReceiptModalProps) {
  const { t, language } = useLanguage();

  if (!isOpen || !booking) return null;

  // Use inspection data if present, or generate realistic standardized receipt figures
  const inspection = booking.qualityInspection || {
    dockageGrade: 'A',
    moistureLevel: 11.2,
    foreignMatter: 1.0,
    grossWeight: 5400,
    tareWeight: 1400,
    netWeight: Math.round(booking.quantity * 100) || 3500,
    mspRate: booking.crop === 'PADDY' ? 2320 : booking.crop === 'WHEAT' ? 2275 : 2320,
    moisturePenalty: 0,
    totalPayout: Math.round((booking.quantity || 35) * (booking.crop === 'PADDY' ? 2320 : 2275)),
    inspectorId: 'OFFICER-KOTA-01',
    verifiedAt: new Date().toISOString()
  };

  const receiptId = `KS-RCP-2026-${booking.tokenNumber}-8942`;
  const netWeightQuintals = (inspection.netWeight / 100).toFixed(2);
  const formattedPayout = inspection.totalPayout.toLocaleString(
    language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-IN'
  );

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleDownload = () => {
    // Generate text/JSON blob for offline record download or trigger print
    const receiptSummary = `
=====================================================
          KISAN SETU DIGITAL PROCUREMENT RECEIPT
          Govt. of India • Ministry of Agriculture
=====================================================
Receipt ID: ${receiptId}
Token Number: ${booking.tokenNumber}
Farmer Name: ${booking.farmerName} (${booking.farmerId})
Village: ${booking.village}
Center: ${booking.centerName}
Produce: ${booking.crop}
Slot: ${booking.date} | ${booking.timeSlot}
-----------------------------------------------------
Gross Weight: ${inspection.grossWeight} kg
Tare Weight: ${inspection.tareWeight} kg
Net Weight: ${inspection.netWeight} kg (${netWeightQuintals} Quintals)
Quality Grade: Grade ${inspection.dockageGrade}
Moisture Content: ${inspection.moistureLevel}%
MSP Rate: ₹${inspection.mspRate} / Quintal
Moisture Deduction: -₹${inspection.moisturePenalty}
-----------------------------------------------------
TOTAL PAYABLE AMOUNT: ₹${formattedPayout}
DBT Status: APPROVED & TRANSFERRED TO AADHAAR BANK A/C
Timestamp: ${new Date(inspection.verifiedAt || Date.now()).toLocaleString()}
Cryptographic Hash: ${booking.tokenHash}
=====================================================
    `;
    const element = document.createElement('a');
    const file = new Blob([receiptSummary.trim()], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${receiptId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const receiptSpokenText =
    language === 'te'
      ? `డిజిటల్ రసీదు వివరాలు: రసీదు సంఖ్య ${receiptId}. రైతు ${booking.farmerName}. నికర బరువు ${inspection.netWeight} కిలోగ్రాములు. నాణ్యత గ్రేడ్ ${inspection.dockageGrade}, తేమ శాతం ${inspection.moistureLevel} శాతం. మొత్తం చెల్లించాల్సిన మొత్తం ₹${inspection.totalPayout.toLocaleString('en-IN')}, ప్రత్యక్ష బ్యాంకు బదిలీ ద్వారా జమ చేయబడుతుంది.`
      : language === 'hi'
      ? `डिजिटल रसीद विवरण: रसीद संख्या ${receiptId}। किसान ${booking.farmerName}। कुल शुद्ध वजन ${inspection.netWeight} किलोग्राम। गुणवत्ता ग्रेड ${inspection.dockageGrade}, नमी स्तर ${inspection.moistureLevel}%। कुल देय राशि ₹${inspection.totalPayout.toLocaleString('en-IN')}, डीबीटी डायरेक्ट बैंक ट्रांसफर द्वारा देय है।`
      : `Digital Receipt Summary: Receipt ID ${receiptId} for farmer ${booking.farmerName}. Net Weight is ${inspection.netWeight} kg. Quality Grade is ${inspection.dockageGrade} with ${inspection.moistureLevel}% moisture. Total payable amount is ${inspection.totalPayout.toLocaleString('en-IN')} rupees via Direct Bank Transfer.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl border-2 border-slate-400 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b-2 border-slate-700 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block">
                {t.digitalReceipt.govtSeal}
              </span>
              <h2 className="text-lg sm:text-xl font-black tracking-tight leading-tight">
                {t.digitalReceipt.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <PlayAudioButton
              textToSpeak={receiptSpokenText}
              highlightKey="digital-receipt-modal"
              size="sm"
            />

            <button
              type="button"
              onClick={onClose}
              aria-label={t.digitalReceipt.closeReceipt}
              className="p-2 text-slate-400 hover:text-white rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto printable-receipt flex-1 bg-slate-50/50">
          {/* Official Document Sub-Header */}
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="space-y-0.5">
              <div className="flex items-center justify-center sm:justify-start space-x-1.5 text-xs font-black text-emerald-950">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>{t.digitalReceipt.dbtStatus}</span>
              </div>
              <div className="text-xs text-emerald-900 font-bold">
                {t.digitalReceipt.receiptId}: <span className="font-mono text-slate-900">{receiptId}</span>
              </div>
            </div>

            <div className="px-3 py-1.5 bg-emerald-700 text-white rounded-xl text-xs font-mono font-black shrink-0 shadow-xs">
              {t.digitalReceipt.tokenNumber}: {booking.tokenNumber}
            </div>
          </div>

          {/* Farmer & Procurement Location Grid */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                {language === 'te' ? 'రైతు మరియు సేకరణ వివరాలు' : language === 'hi' ? 'किसान एवं खरीद केंद्र विवरण' : 'Farmer & Mandi Details'}
              </span>
              <span className="text-[11px] font-bold text-slate-600 font-mono">
                {new Date(inspection.verifiedAt || Date.now()).toLocaleDateString()}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-xs">
              <div>
                <span className="text-slate-500 font-bold block">{t.digitalReceipt.farmerName}</span>
                <span className="font-black text-sm text-slate-900 block mt-0.5">{booking.farmerName}</span>
                <span className="font-mono text-[11px] text-slate-500">{booking.farmerId}</span>
              </div>

              <div>
                <span className="text-slate-500 font-bold block">{t.digitalReceipt.village}</span>
                <span className="font-bold text-sm text-slate-900 block mt-0.5">{booking.village}</span>
                <span className="text-[11px] text-slate-500 font-semibold">{booking.farmerMobile || '9876543210'}</span>
              </div>

              <div>
                <span className="text-slate-500 font-bold block">{t.digitalReceipt.crop}</span>
                <span className="font-black text-sm text-slate-900 block mt-0.5">{t.crops[booking.crop]}</span>
                <span className="text-[11px] text-slate-600 font-bold">{t.vehicles[booking.vehicleType]}</span>
              </div>

              <div className="col-span-2 sm:col-span-2">
                <span className="text-slate-500 font-bold block">{t.digitalReceipt.centerLabel}</span>
                <span className="font-bold text-sm text-slate-900 block mt-0.5 truncate">{booking.centerName}</span>
              </div>

              <div>
                <span className="text-slate-500 font-bold block">{t.digitalReceipt.slotLabel}</span>
                <span className="font-bold text-sm text-slate-900 block mt-0.5">{booking.timeSlot}</span>
              </div>
            </div>
          </div>

          {/* Weighbridge Net Weight & Quality Inspection Breakdown */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center space-x-2">
                <Scale className="w-4 h-4 text-slate-700" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                  {t.digitalReceipt.weighbridgeSlip}
                </span>
              </div>
              <span className="px-2.5 py-0.5 bg-purple-100 text-purple-950 font-black text-xs rounded-lg border border-purple-300">
                {t.digitalReceipt.dockageGrade}: {inspection.dockageGrade}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">{t.digitalReceipt.grossWeight}</span>
                <span className="text-base font-mono font-black text-slate-900 block mt-0.5">
                  {inspection.grossWeight} <span className="text-[11px] font-normal">{t.common.kg}</span>
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">{t.digitalReceipt.tareWeight}</span>
                <span className="text-base font-mono font-black text-slate-900 block mt-0.5">
                  {inspection.tareWeight} <span className="text-[11px] font-normal">{t.common.kg}</span>
                </span>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border-2 border-emerald-300">
                <span className="text-[10px] font-black text-emerald-800 uppercase block">{t.digitalReceipt.netWeight}</span>
                <span className="text-base font-mono font-black text-emerald-950 block mt-0.5">
                  {inspection.netWeight} <span className="text-[11px] font-normal">{t.common.kg}</span>
                </span>
                <span className="text-[10px] text-emerald-700 font-bold block">
                  ({netWeightQuintals} {t.common.quintal})
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">{t.digitalReceipt.moistureLevel}</span>
                <span className="text-base font-mono font-black text-slate-900 block mt-0.5">
                  {inspection.moistureLevel}%
                </span>
                <span className="text-[10px] text-slate-500 font-semibold block">
                  {t.digitalReceipt.foreignMatter}: {inspection.foreignMatter}%
                </span>
              </div>
            </div>
          </div>

          {/* Financial MSP Payout Calculation Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 border-2 border-slate-700 space-y-3.5">
            <div className="flex items-center justify-between text-xs text-slate-300 font-bold border-b border-slate-800 pb-2">
              <span>{t.digitalReceipt.mspRate}: ₹{inspection.mspRate} / {t.common.quintal}</span>
              <span>{t.digitalReceipt.moistureDeduction}: ₹{inspection.moisturePenalty}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs uppercase font-black tracking-widest text-emerald-400 block">
                  {t.digitalReceipt.totalPayable}
                </span>
                <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight mt-0.5">
                  ₹{formattedPayout}
                </div>
              </div>

              <div className="sm:text-right">
                <span className="inline-block px-3 py-1 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 rounded-xl text-xs font-black uppercase">
                  {t.digitalReceipt.dbtStatus}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                  Txn Ref: DBT-{booking.tokenNumber}-9941
                </span>
              </div>
            </div>
          </div>

          {/* Cryptographic Compliance Notice */}
          <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-center text-[11px] font-semibold text-slate-600">
            {t.digitalReceipt.receiptNotice}
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="p-4 sm:p-5 bg-white border-t-2 border-slate-200 flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl font-black text-sm min-h-[48px] transition-colors"
          >
            {t.digitalReceipt.closeReceipt}
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto sm:ml-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-5 py-3 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-300 rounded-2xl font-black text-sm min-h-[48px] shadow-xs transition-all active:scale-98"
            >
              <Printer className="w-4 h-4 text-slate-700" />
              <span>{t.digitalReceipt.printReceipt}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-5 py-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-2xl font-black text-sm min-h-[48px] shadow-md transition-all active:scale-98"
            >
              <Download className="w-4 h-4" />
              <span>{t.digitalReceipt.downloadPdf}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
