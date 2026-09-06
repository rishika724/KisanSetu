'use client';

import React, { useState, useEffect } from 'react';
import {
  Scale,
  Droplets,
  Award,
  IndianRupee,
  CheckCircle2,
  FileCheck,
  Send,
  Printer,
  X,
  AlertCircle,
  HelpCircle,
  Truck,
  User,
  Layers,
  Sparkles,
  Smartphone,
  Check
} from 'lucide-react';
import {
  VerifiedTokenData,
  QualityInspectionInput,
  InspectionReceiptResult,
  submitQualityInspectionApi
} from '../../lib/api';

interface QualityInspectionFormProps {
  activeVehicle: VerifiedTokenData | null;
  onInspectionCompleted: (result: InspectionReceiptResult) => void;
  onCancel?: () => void;
  soundEnabled?: boolean;
}

// Standard crop MSP rates (Govt MSP 2024-2025 in INR per Quintal)
const DEFAULT_MSP_RATES: Record<string, number> = {
  'गेहूं (Wheat)': 2275,
  'धान (Paddy Basmati)': 2320,
  'चना (Gram/Chana)': 5440,
  'सरसों (Mustard)': 5650,
  DEFAULT: 2275
};

export function QualityInspectionForm({
  activeVehicle,
  onInspectionCompleted,
  onCancel,
  soundEnabled = true
}: QualityInspectionFormProps) {
  // Input fields
  const [moisture, setMoisture] = useState<number>(12.5);
  const [dockageGrade, setDockageGrade] = useState<'A' | 'B' | 'C'>('A');
  const [scaleWeight, setScaleWeight] = useState<number>(
    activeVehicle ? activeVehicle.estimatedWeight : 45.0
  );
  const [mspRate, setMspRate] = useState<number>(2275);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Completed receipt & mock SMS modal state
  const [completedResult, setCompletedResult] = useState<InspectionReceiptResult | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);
  const [smsDispatchedNotification, setSmsDispatchedNotification] = useState<boolean>(false);

  // Sync weight & MSP when activeVehicle changes
  useEffect(() => {
    if (activeVehicle) {
      setScaleWeight(activeVehicle.estimatedWeight || 45.0);
      const crop = activeVehicle.cropType || '';
      let detectedMsp = DEFAULT_MSP_RATES['DEFAULT'];
      for (const [key, rate] of Object.entries(DEFAULT_MSP_RATES)) {
        if (crop.includes(key) || key.includes(crop)) {
          detectedMsp = rate;
          break;
        }
      }
      setMspRate(detectedMsp);
    }
  }, [activeVehicle]);

  // Real-time automatic calculation formula:
  // Total Payout = (Approved Weight * Govt MSP Rate) - Moisture Penalty
  // Standard moisture acceptable ceiling: 12.0%
  const approvedWeight = Math.max(0, scaleWeight || 0);
  const currentMsp = Math.max(0, mspRate || 0);
  const excessMoisturePercent = Math.max(0, Number(moisture) - 12.0);

  // Moisture penalty in Rupees:
  // Deduction applies proportionally to the gross value for moisture > 12.0%
  const moisturePenalty = Math.round(
    approvedWeight * currentMsp * (excessMoisturePercent / 100) * 100
  ) / 100;

  const grossValue = Math.round(approvedWeight * currentMsp * 100) / 100;
  const totalPayout = Math.max(0, Math.round((grossValue - moisturePenalty) * 100) / 100);

  // Play success sound
  const playApprovalChime = () => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2); // G5
      osc.frequency.setValueAtTime(1046.5, audioCtx.currentTime + 0.3); // C6
      gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.55);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.58);
    } catch (e) {}
  };

  const handleApproveAndIssueReceipt = async () => {
    if (!activeVehicle) {
      setError('कृपया पहले स्कैनर या कतार से किसी वाहन का चयन करें। (Please select or scan a vehicle first)');
      return;
    }

    if (approvedWeight <= 0) {
      setError('अंतिम तुलाई वजन (Final Scale Weight) शून्य से अधिक होना चाहिए।');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const payload: QualityInspectionInput = {
        bookingId: activeVehicle.bookingId,
        moistureLevel: Number(moisture),
        dockageGrade,
        approvedWeight,
        mspRate: currentMsp,
        inspectorId: 'OFFICER-KOT-04'
      };

      const result = await submitQualityInspectionApi(payload);

      setCompletedResult(result);
      setShowReceiptModal(true);
      setSmsDispatchedNotification(true);
      playApprovalChime();
      onInspectionCompleted(result);
    } catch (err: any) {
      setError(err.message || 'निरीक्षण रसीद जारी करने में त्रुटि (Failed to approve and issue receipt)');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Form Container */}
      <div className="bg-white rounded-3xl border-2 border-slate-300 shadow-sm overflow-hidden">
        {/* Form Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-slate-800 rounded-xl border border-slate-700">
              <Scale className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">
                Quality Inspection & Weighbridge Form
              </h2>
              <p className="text-xs text-slate-300 font-medium">
                उपज गुणवत्ता मापदंड, धर्मकांटा वजन व प्रत्यक्ष लाभ अंतरण (DBT) भुगतान गणना
              </p>
            </div>
          </div>

          {activeVehicle ? (
            <div className="px-3.5 py-1.5 bg-emerald-900/80 border border-emerald-500 rounded-xl text-xs font-black text-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>सक्रिय वाहन: {activeVehicle.vehicleType}</span>
            </div>
          ) : (
            <div className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-slate-300">
              मानक परीक्षण मोड (Sample Testing Mode)
            </div>
          )}
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* Active Vehicle Summary Pill / Info Card */}
          {activeVehicle && (
            <div className="p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <User className="w-7 h-7 text-slate-800" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase text-slate-500">किसान व स्लॉट (Farmer & Slot)</span>
                  <div className="text-base font-black text-slate-900">
                    {activeVehicle.farmer?.name || 'किसान'} • {activeVehicle.farmer?.phoneno}
                  </div>
                  <div className="text-xs text-slate-600 font-semibold">
                    भूमि: {activeVehicle.farmer?.landSize ?? '4.5'} एकड़ • स्लॉट: {activeVehicle.slot?.timeWindow}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <Truck className="w-7 h-7 text-slate-800" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase text-slate-500">फसल व अनुमानित वजन (Crop & Est. Qtl)</span>
                  <div className="text-base font-black text-slate-900">{activeVehicle.cropType}</div>
                  <div className="text-xs text-emerald-800 font-bold">
                    अनुमान: {activeVehicle.estimatedWeight} क्विंटल
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Input 1: Moisture Percentage (%) */}
            <div className="bg-slate-50 p-5 rounded-3xl border-2 border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Droplets className="w-5 h-5 text-blue-600" />
                  <span>नमी प्रतिशत (Moisture %)</span>
                </label>
                <span
                  className={`text-xs font-black px-2 py-0.5 rounded-md ${
                    moisture <= 12.0
                      ? 'bg-emerald-100 text-emerald-900'
                      : moisture <= 14.0
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-red-100 text-red-900'
                  }`}
                >
                  {moisture <= 12.0 ? 'आदर्श (≤12%)' : moisture <= 14.0 ? 'कटौती लागू' : 'अधिक नमी'}
                </span>
              </div>

              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="5"
                  max="35"
                  value={moisture}
                  onChange={(e) => setMoisture(parseFloat(e.target.value) || 0)}
                  className="w-full p-4 bg-white border-2 border-slate-300 rounded-2xl text-2xl font-black text-slate-900 text-center focus:border-slate-800 transition-all shadow-inner"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">
                  %
                </span>
              </div>

              {/* Touch Increment / Decrement Buttons for Rugged Tablet */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMoisture((prev) => Math.max(5, Math.round((prev - 0.5) * 10) / 10))}
                  className="flex-1 p-2 bg-white hover:bg-slate-200 border border-slate-300 rounded-xl font-bold text-base text-slate-800"
                >
                  - 0.5%
                </button>
                <button
                  type="button"
                  onClick={() => setMoisture(12.0)}
                  className="p-2 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl font-bold text-xs"
                  title="Set to standard 12%"
                >
                  12% (मानक)
                </button>
                <button
                  type="button"
                  onClick={() => setMoisture((prev) => Math.min(35, Math.round((prev + 0.5) * 10) / 10))}
                  className="flex-1 p-2 bg-white hover:bg-slate-200 border border-slate-300 rounded-xl font-bold text-base text-slate-800"
                >
                  + 0.5%
                </button>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                मानक सीमा: 12.0%। 12% से अधिक नमी होने पर स्वचालित कटौती लागू होगी।
              </p>
            </div>

            {/* Input 2: Dockage / Foreign Matter Grade (A/B/C) */}
            <div className="bg-slate-50 p-5 rounded-3xl border-2 border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-5 h-5 text-amber-600" />
                  <span>अपद्रव्य श्रेणी (Dockage Grade)</span>
                </label>
                <span className="text-xs font-bold text-slate-500">ग्रेड A / B / C</span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                {(['A', 'B', 'C'] as const).map((grade) => (
                  <button
                    key={grade}
                    type="button"
                    onClick={() => setDockageGrade(grade)}
                    className={`p-4 rounded-2xl border-2 font-black transition-all flex flex-col items-center justify-center min-h-[75px] ${
                      dockageGrade === grade
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm scale-102'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <span className="text-2xl font-black">ग्रेड {grade}</span>
                    <span className="text-[10px] font-bold opacity-80 mt-0.5">
                      {grade === 'A' ? 'स्वच्छ (<1%)' : grade === 'B' ? 'मध्यम (1-2%)' : 'उच्च (2-4%)'}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                फसल में तिनके, धूल, और बाह्य तत्वों की प्रयोगशाला जांच अनुसार चयन करें।
              </p>
            </div>

            {/* Input 3: Final Scale Weight (Quintals) */}
            <div className="bg-slate-50 p-5 rounded-3xl border-2 border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Scale className="w-5 h-5 text-emerald-700" />
                  <span>धर्मकांटा कुल वजन (Scale Weight)</span>
                </label>
                <span className="text-xs font-bold text-slate-500">क्विंटल (Quintals)</span>
              </div>

              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  max="1000"
                  value={scaleWeight}
                  onChange={(e) => setScaleWeight(parseFloat(e.target.value) || 0)}
                  className="w-full p-4 bg-white border-2 border-slate-300 rounded-2xl text-2xl font-black text-slate-900 text-center focus:border-slate-800 transition-all shadow-inner"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                  Qtl
                </span>
              </div>

              {/* Touch Increment / Decrement Buttons for Scale */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setScaleWeight((prev) => Math.max(0, Math.round((prev - 1) * 10) / 10))}
                  className="flex-1 p-2 bg-white hover:bg-slate-200 border border-slate-300 rounded-xl font-bold text-base text-slate-800"
                >
                  - 1.0 Qtl
                </button>
                <button
                  type="button"
                  onClick={() => setScaleWeight((prev) => Math.round((prev + 1) * 10) / 10)}
                  className="flex-1 p-2 bg-white hover:bg-slate-200 border border-slate-300 rounded-xl font-bold text-base text-slate-800"
                >
                  + 1.0 Qtl
                </button>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                सकल वजन (Gross) - खाली वाहन वजन (Tare) = शुद्ध स्वीकृत वजन (Net Approved)
              </p>
            </div>
          </div>

          {/* Real-time Automatic Calculation Field */}
          {/* Directive: Total Payout = (Approved Weight * Govt MSP Rate) - Moisture Penalty */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border-4 border-slate-700 shadow-md space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-emerald-950/80 rounded-2xl border border-emerald-500 text-emerald-400">
                  <IndianRupee className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-emerald-400 block">
                    Real-Time Transparent Valuation Engine
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black">
                    कुल देय राशि गणना (Total Payout Calculation)
                  </h3>
                </div>
              </div>

              {/* Editable Govt MSP Rate Badge */}
              <div className="flex items-center space-x-2 bg-slate-800 px-3.5 py-2 rounded-2xl border border-slate-700 text-sm">
                <span className="text-xs font-bold text-slate-400">सरकारी MSP दर:</span>
                <span className="font-mono font-black text-emerald-400">₹</span>
                <input
                  type="number"
                  value={mspRate}
                  onChange={(e) => setMspRate(parseFloat(e.target.value) || 0)}
                  className="w-20 bg-slate-900 border border-slate-600 rounded-lg px-2 py-0.5 font-mono font-black text-white text-center"
                />
                <span className="text-xs text-slate-400">/क्विंटल</span>
              </div>
            </div>

            {/* Calculation Breakdown Step-by-Step Display */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Step 1: Base Value */}
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-1">
                <span className="text-xs font-bold uppercase text-slate-400">
                  सकल मूल्य (Gross Value)
                </span>
                <div className="text-xl sm:text-2xl font-black text-white">
                  ₹{grossValue.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {approvedWeight} Qtl × ₹{currentMsp}
                </div>
              </div>

              {/* Step 2: Moisture Penalty Deduction */}
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-400">
                    नमी कटौती (Moisture Penalty)
                  </span>
                  {excessMoisturePercent > 0 && (
                    <span className="text-[10px] font-black px-1.5 py-0.5 bg-rose-950 text-rose-300 border border-rose-800 rounded">
                      +{excessMoisturePercent.toFixed(1)}% अधिक
                    </span>
                  )}
                </div>
                <div className={`text-xl sm:text-2xl font-black ${moisturePenalty > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  - ₹{moisturePenalty.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {excessMoisturePercent > 0
                    ? `(${moisture}% - 12%) पर अनुपातिक कटौती`
                    : 'शून्य कटौती (मानक सीमा के भीतर)'}
                </div>
              </div>

              {/* Step 3: Total Net Payout */}
              <div className="bg-emerald-950/60 p-4 rounded-2xl border-2 border-emerald-500 space-y-1">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                  कुल अंतिम भुगतान (Total Payout)
                </span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-300">
                  ₹{totalPayout.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-emerald-200/80 font-bold">
                  प्रत्यक्ष बैंक अंतरण (DBT Mandate)
                </div>
              </div>
            </div>

            {/* Formula Reference Tag */}
            <div className="text-xs font-mono text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-center">
              फार्मूला: <strong>Total Payout = (Approved Weight × Govt MSP Rate) - Moisture Penalty</strong>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-rose-900/80 border border-rose-500 rounded-2xl flex items-center space-x-3 text-rose-100 text-sm font-bold">
                <AlertCircle className="w-6 h-6 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Prominent, Large "Approve & Issue Kisan Setu Receipt" Button */}
            {/* Directive: Prominent, large "Approve & Issue Kisan Setu Receipt" button that triggers status update to 'COMPLETED' and sends a mock SMS receipt */}
            <button
              type="button"
              onClick={handleApproveAndIssueReceipt}
              disabled={submitting}
              className="w-full flex items-center justify-center space-x-4 p-5 sm:p-6 bg-emerald-700 hover:bg-emerald-600 disabled:bg-slate-700 text-white rounded-3xl font-black text-xl sm:text-2xl transition-all shadow-xl min-h-[64px] active:scale-98 border-2 border-emerald-500 cursor-pointer"
            >
              <FileCheck className="w-9 h-9 shrink-0 text-white" />
              <span>
                {submitting
                  ? 'रसीद जारी की जा रही है (Issuing Receipt)...'
                  : 'Approve & Issue Kisan Setu Receipt (स्वीकृत करें व रसीद जारी करें)'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mock SMS Dispatched Notification Toast Banner */}
      {smsDispatchedNotification && completedResult && (
        <div className="p-4 sm:p-5 bg-slate-900 text-white rounded-3xl border-2 border-emerald-400 shadow-lg flex items-center justify-between gap-4 animate-bounceOnce">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 bg-emerald-800 rounded-2xl border border-emerald-600">
              <Smartphone className="w-7 h-7 text-emerald-200" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-emerald-400">
                स्वचालित SMS रसीद प्रेषित (Mock SMS Dispatched)
              </div>
              <div className="text-sm sm:text-base font-bold text-white">
                किसान {completedResult.receipt.farmerName} ({completedResult.receipt.farmerPhone}) को SMS भेजा गया
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowReceiptModal(true)}
            className="px-4 py-2.5 bg-white text-slate-950 font-black text-xs sm:text-sm rounded-xl hover:bg-slate-200 transition-all min-h-[44px]"
          >
            रसीद देखें (View Receipt)
          </button>
        </div>
      )}

      {/* Printable / Downloadable Mandi Inspection Slip & Receipt Modal */}
      {showReceiptModal && completedResult && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border-4 border-slate-400 max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
            {/* Modal Close Button */}
            <button
              type="button"
              onClick={() => setShowReceiptModal(false)}
              className="absolute top-5 right-5 p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Official Mandi Letterhead */}
            <div className="border-b-2 border-slate-300 pb-4 text-center space-y-1">
              <div className="inline-block px-3 py-1 bg-emerald-100 border border-emerald-400 text-emerald-950 text-xs font-black rounded-lg uppercase tracking-wider">
                राजकीय कृषि उपज मंडी समिति • डिजिटल धर्मकांटा पर्ची
              </div>
              <h3 className="text-2xl font-black text-slate-950 tracking-tight">
                Kisan Setu Official Weighbridge & Quality Receipt
              </h3>
              <p className="text-xs text-slate-600 font-semibold">
                रसीद संख्या: <span className="font-mono font-bold text-slate-900">{completedResult.receipt.receiptNumber}</span> • जारी तिथि: {new Date().toLocaleString('en-IN')}
              </p>
            </div>

            {/* Receipt Summary Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase block">किसान का नाम</span>
                <span className="text-base font-black text-slate-900">{completedResult.receipt.farmerName}</span>
                <div className="text-xs text-slate-600">{completedResult.receipt.farmerPhone}</div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase block">वाहन व जिंस</span>
                <span className="text-base font-black text-slate-900">{completedResult.receipt.cropType}</span>
                <div className="text-xs text-slate-600">वाहन: {completedResult.receipt.vehicleType}</div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase block">स्वीकृत शुद्ध वजन</span>
                <span className="text-lg font-black text-slate-900">{completedResult.receipt.approvedWeight} क्विंटल</span>
                <div className="text-xs text-slate-600">MSP दर: ₹{completedResult.receipt.mspRate}/Qtl</div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase block">गुणवत्ता मापदंड</span>
                <span className="text-base font-black text-slate-900">नमी: {completedResult.receipt.moistureLevel}%</span>
                <div className="text-xs text-slate-600">अपद्रव्य: ग्रेड {completedResult.receipt.dockageGrade}</div>
              </div>
            </div>

            {/* Financial Settlement Box */}
            <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-300 space-y-2">
              <div className="flex justify-between text-sm text-slate-700">
                <span>सकल मूल्य (Gross MSP Value):</span>
                <span className="font-mono font-bold">₹{completedResult.receipt.grossValue.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm text-rose-700 font-semibold">
                <span>नमी कटौती (Moisture Penalty):</span>
                <span className="font-mono font-bold">- ₹{completedResult.receipt.moisturePenalty.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 border-t border-emerald-300 flex justify-between items-center text-lg sm:text-xl font-black text-emerald-950">
                <span>कुल शुद्ध देय राशि (Net Payout):</span>
                <span className="font-mono text-2xl font-black text-emerald-900">
                  ₹{completedResult.receipt.totalPayout.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Mock SMS Preview Drawer */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-700 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase">
                <Smartphone className="w-4 h-4" />
                <span>किसान को भेजा गया स्वचालित SMS विवरण:</span>
              </div>
              <p className="text-xs font-mono text-slate-300 leading-relaxed bg-slate-800 p-3 rounded-xl border border-slate-700">
                &ldquo;{completedResult.mockSms.messageText}&rdquo;
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 flex items-center justify-center space-x-2.5 p-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-base transition-all min-h-[56px]"
              >
                <Printer className="w-6 h-6" />
                <span>धर्मकांटा रसीद प्रिंट करें (Print Slip)</span>
              </button>

              <button
                type="button"
                onClick={() => setShowReceiptModal(false)}
                className="flex-1 p-4 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-2xl font-bold text-base transition-all min-h-[56px]"
              >
                बंद करें व अगला वाहन लें (Close & Next)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
