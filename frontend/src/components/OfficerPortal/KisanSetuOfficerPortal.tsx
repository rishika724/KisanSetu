'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  useSyncStore,
  verifyAndCheckInAtGate,
  recordQualityAndWeighing,
  updateTrafficControls,
  toggleEmergencyPriority,
  callNextVehicle,
  SyncBooking,
  advanceBookingStage,
  getStageNumber,
  SIH_8_STAGES,
  getCenterAnalytics
} from '../../lib/syncStore';
import {
  ShieldCheck,
  QrCode,
  Truck,
  Scale,
  Activity,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
  Check,
  X,
  Droplets,
  DollarSign,
  Building2,
  Radio,
  FileCheck,
  Sliders,
  ChevronRight
} from 'lucide-react';

export function KisanSetuOfficerPortal() {
  const { t } = useLanguage();
  const sync = useSyncStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'scanner' | 'queue' | 'weighing'>('overview');
  const [tokenInput, setTokenInput] = useState('');
  const [scannerMessage, setScannerMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Selected Booking for Quality & Weighing
  const [selectedBookingId, setSelectedBookingId] = useState<string>(
    sync.bookings.find((b) => b.status === 'MANDI_GATE' || b.status === 'INSPECTION')?.id || sync.bookings[0]?.id || ''
  );

  // Weighing & Inspection Form State
  const [dockageGrade, setDockageGrade] = useState<'A' | 'B' | 'C'>('A');
  const [moistureLevel, setMoistureLevel] = useState<number>(11.5);
  const [foreignMatter, setForeignMatter] = useState<number>(1.2);
  const [grossWeight, setGrossWeight] = useState<number>(5400); // kg
  const [tareWeight, setTareWeight] = useState<number>(1400); // kg
  const [weighingSuccessMsg, setWeighingSuccessMsg] = useState<string | null>(null);

  const selectedBooking = sync.bookings.find((b) => b.id === selectedBookingId);

  // Auto-calculated Net Weight (kg) = Gross - Tare
  const calculatedNetWeight = Math.max(0, grossWeight - tareWeight);

  // Standard MSP Rate per quintal based on crop
  const getMspRate = (cropKey?: string) => {
    switch (cropKey) {
      case 'WHEAT':
        return 2275;
      case 'PADDY':
        return 2320;
      case 'MUSTARD':
        return 5650;
      case 'COTTON':
        return 7122;
      case 'MAIZE':
        return 2090;
      case 'SOYABEAN':
        return 4892;
      case 'PULSES':
        return 5440;
      default:
        return 2275;
    }
  };

  const mspRate = getMspRate(selectedBooking?.crop);
  const excessMoisture = Math.max(0, moistureLevel - 12.0);
  const netWeightQuintals = calculatedNetWeight / 100;
  const moisturePenalty = Math.round(netWeightQuintals * mspRate * (excessMoisture / 100));
  const totalPayout = Math.max(0, Math.round(netWeightQuintals * mspRate - moisturePenalty));
  const [scannedBooking, setScannedBooking] = useState<SyncBooking | null>(null);
  const [showCheckInModal, setShowCheckInModal] = useState<boolean>(false);

  // Gate Scanner Action
  const handleVerifyGateToken = (tokenToVerify?: string) => {
    const target = (tokenToVerify || tokenInput).trim().toUpperCase();
    if (!target) return;

    const found = sync.bookings.find(
      (b) =>
        b.tokenNumber.toUpperCase() === target ||
        b.tokenHash.toUpperCase() === target ||
        b.farmerId.toUpperCase() === target ||
        b.id.toUpperCase() === target
    );

    if (found) {
      setScannedBooking(found);
      setShowCheckInModal(true);
      setTokenInput('');
    } else {
      setScannerMessage({
        type: 'error',
        text: t.adminDashboard.scanner.invalidToken
      });
      setTimeout(() => setScannerMessage(null), 5000);
    }
  };

  const handleModalCheckInConfirm = () => {
    if (!scannedBooking) return;
    const result = verifyAndCheckInAtGate(scannedBooking.tokenNumber);
    if (result.success && result.booking) {
      setScannerMessage({
        type: 'success',
        text: `${t.gateCheckInModal.successMessage} (${result.booking.farmerName} • ${result.booking.tokenNumber})`
      });
      setShowCheckInModal(false);
      setScannedBooking(null);
      setTimeout(() => setScannerMessage(null), 5000);
    }
  };

  // Submit Quality Inspection & Weighing
  const handleApproveInspection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingId) return;

    const res = recordQualityAndWeighing(selectedBookingId, {
      dockageGrade,
      moistureLevel,
      foreignMatter,
      grossWeight,
      tareWeight,
      netWeight: calculatedNetWeight,
      mspRate,
      moisturePenalty,
      totalPayout,
      inspectorId: 'OFFICER-KOTA-01'
    });

    if (res.success) {
      setWeighingSuccessMsg(t.adminDashboard.weighingForm.approvedSuccess);
      setTimeout(() => setWeighingSuccessMsg(null), 6000);
    }
  };

  // Metrics
  const dailyTokensCount = sync.bookings.length;
  const activeQueueCount = sync.bookings.filter(
    (b) => b.status === 'BOOKED' || b.status === 'STAGING' || b.status === 'MANDI_GATE' || b.status === 'INSPECTION'
  ).length;
  const completedCount = sync.bookings.filter((b) => b.status === 'COMPLETED').length;
  const totalDisbursedValue = sync.bookings
    .filter((b) => b.qualityInspection)
    .reduce((acc, b) => acc + (b.qualityInspection?.totalPayout || 0), 0);

  const traffic = sync.trafficControls;
  const centerStats = getCenterAnalytics();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-12">
      {/* Admin Command Bar */}
      <div className="bg-slate-900 text-white border-b-4 border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="p-3 bg-slate-800 rounded-2xl border-2 border-slate-700 text-emerald-400">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                    {t.adminDashboard.title}
                  </h1>
                  <span className="px-2 py-0.5 bg-emerald-900 border border-emerald-500 text-emerald-300 text-[10px] font-black rounded uppercase">
                    {t.adminDashboard.metrics.activeWeighbridges}: 4/4
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 font-bold mt-0.5">
                  {t.adminDashboard.subtitle}
                </p>
              </div>
            </div>

            {/* Quick Stats in Header */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-slate-800 border border-slate-700 rounded-2xl text-center min-w-[80px]">
                <span className="text-[10px] text-slate-400 uppercase font-black block">
                  {t.adminDashboard.metrics.activeQueue}
                </span>
                <span className="text-xl font-black text-amber-400 font-mono">
                  {activeQueueCount}
                </span>
              </div>
              <div className="p-2.5 bg-slate-800 border border-slate-700 rounded-2xl text-center min-w-[80px]">
                <span className="text-[10px] text-slate-400 uppercase font-black block">
                  {t.adminDashboard.metrics.completedProcurement}
                </span>
                <span className="text-xl font-black text-emerald-400 font-mono">
                  {completedCount}
                </span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="flex space-x-2 overflow-x-auto pt-4 border-t border-slate-800 mt-4 scrollbar-none">
            {[
              { id: 'overview', label: t.adminDashboard.liveOverview, icon: Activity },
              { id: 'scanner', label: t.adminDashboard.gateScanner, icon: QrCode },
              { id: 'queue', label: t.adminDashboard.queueControl, icon: Truck },
              { id: 'weighing', label: t.adminDashboard.weighingInspection, icon: Scale }
            ].map((tab) => {
              const IconComp = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2.5 px-4 py-3 rounded-2xl font-black text-sm sm:text-base transition-all min-h-[50px] whitespace-nowrap ${
                    isSelected
                      ? 'bg-white text-slate-900 shadow-md scale-102'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <IconComp className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Operational Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* TOP LIVE MANDI ANALYTICS METRICS BANNER */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border-2 border-slate-300 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                {t.adminMetricsBanner.totalBookings.split(':')[0] || 'Mandi Live Center Analytics'}
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-500 font-mono">
              Live Gateway Sync • Kota Mandi Yard #1
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Total Bookings */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-[11px] font-bold text-slate-500 uppercase block truncate">
                {t.adminMetricsBanner.totalBookings}
              </span>
              <span className="text-2xl font-black text-slate-900 font-mono">
                {centerStats.totalBookings}
              </span>
            </div>

            {/* Checked In */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <span className="text-[11px] font-bold text-emerald-800 uppercase block truncate">
                {t.adminMetricsBanner.checkedIn}
              </span>
              <span className="text-2xl font-black text-emerald-900 font-mono">
                {centerStats.checkedIn}
              </span>
            </div>

            {/* Waiting in Yard */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl">
              <span className="text-[11px] font-bold text-amber-800 uppercase block truncate">
                {t.adminMetricsBanner.waiting}
              </span>
              <span className="text-2xl font-black text-amber-900 font-mono">
                {centerStats.waiting}
              </span>
            </div>

            {/* In Processing */}
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl">
              <span className="text-[11px] font-bold text-purple-800 uppercase block truncate">
                {t.adminMetricsBanner.processing}
              </span>
              <span className="text-2xl font-black text-purple-900 font-mono">
                {centerStats.processing}
              </span>
            </div>

            {/* Completed */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl">
              <span className="text-[11px] font-bold text-blue-800 uppercase block truncate">
                {t.adminMetricsBanner.completed}
              </span>
              <span className="text-2xl font-black text-blue-900 font-mono">
                {centerStats.completed}
              </span>
            </div>

            {/* Delayed / Flagged */}
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl">
              <span className="text-[11px] font-bold text-red-800 uppercase block truncate">
                {t.adminMetricsBanner.delayed}
              </span>
              <span className="text-2xl font-black text-red-900 font-mono">
                {centerStats.delayed}
              </span>
            </div>
          </div>
        </div>
        {/* TAB 1: LIVE OVERVIEW METRICS DASHBOARD */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Top Metrics Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-3xl border-2 border-slate-300 shadow-sm space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t.adminDashboard.metrics.dailyTokens}
                </span>
                <div className="text-3xl font-black text-slate-900 font-mono">
                  {dailyTokensCount}
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {t.digitalPass.offlineBadge}
                </p>
              </div>

              <div className="bg-white p-5 rounded-3xl border-2 border-slate-300 shadow-sm space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t.adminDashboard.metrics.activeQueue}
                </span>
                <div className="text-3xl font-black text-amber-700 font-mono">
                  {activeQueueCount}
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {traffic.emergencyLane ? t.adminDashboard.queueManagement.emergencyLaneToggle : t.common.active}
                </p>
              </div>

              <div className="bg-white p-5 rounded-3xl border-2 border-slate-300 shadow-sm space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t.adminDashboard.metrics.mandiCapacity}
                </span>
                <div className="text-3xl font-black text-emerald-700 font-mono">
                  {Math.min(100, Math.round((activeQueueCount / 15) * 100))}%
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.round((activeQueueCount / 15) * 100))}%` }}
                  />
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border-2 border-slate-300 shadow-sm space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t.adminDashboard.metrics.activeWeighbridges}
                </span>
                <div className="text-3xl font-black text-slate-900 font-mono">
                  {traffic.breakdown ? '3 / 4' : '4 / 4'}
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {traffic.breakdown ? t.adminDashboard.queueManagement.breakdownModeToggle : t.common.active}
                </p>
              </div>

              <div className="bg-white p-5 rounded-3xl border-2 border-slate-300 shadow-sm space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t.adminDashboard.metrics.completedProcurement}
                </span>
                <div className="text-3xl font-black text-blue-800 font-mono">
                  {completedCount}
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {t.digitalPass.statusValues.COMPLETED}
                </p>
              </div>

              <div className="bg-white p-5 rounded-3xl border-2 border-slate-300 shadow-sm space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t.adminDashboard.metrics.totalDisbursed}
                </span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                  ₹{totalDisbursedValue.toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  DBT Direct Bank Transfer
                </p>
              </div>
            </div>

            {/* Quick Action Navigation Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('scanner')}
                className="p-5 bg-white rounded-3xl border-2 border-slate-300 hover:border-slate-800 text-left transition-all shadow-xs flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="p-3 bg-slate-900 text-white rounded-2xl group-hover:bg-emerald-600 transition-colors">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-slate-900">{t.adminDashboard.gateScanner}</h3>
                    <p className="text-xs text-slate-500 font-medium">{t.adminDashboard.scanner.title}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('queue')}
                className="p-5 bg-white rounded-3xl border-2 border-slate-300 hover:border-slate-800 text-left transition-all shadow-xs flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="p-3 bg-slate-900 text-white rounded-2xl group-hover:bg-amber-600 transition-colors">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-slate-900">{t.adminDashboard.queueControl}</h3>
                    <p className="text-xs text-slate-500 font-medium">{t.adminDashboard.queueManagement.title}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('weighing')}
                className="p-5 bg-white rounded-3xl border-2 border-slate-300 hover:border-slate-800 text-left transition-all shadow-xs flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="p-3 bg-slate-900 text-white rounded-2xl group-hover:bg-purple-600 transition-colors">
                    <Scale className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-slate-900">{t.adminDashboard.weighingInspection}</h3>
                    <p className="text-xs text-slate-500 font-medium">{t.adminDashboard.weighingForm.title}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: GATE QR SCANNER & CHECK-IN */}
        {activeTab === 'scanner' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-300 shadow-md space-y-5">
              <div className="flex items-start space-x-4 border-b border-slate-100 pb-4">
                <div className="p-3 bg-slate-900 text-white rounded-2xl">
                  <QrCode className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    {t.adminDashboard.scanner.title}
                  </h2>
                  <p className="text-sm font-medium text-slate-600 mt-0.5">
                    {t.adminDashboard.scanner.subtitle}
                  </p>
                </div>
              </div>

              {/* Status Banner */}
              {scannerMessage && (
                <div
                  className={`p-4 rounded-2xl border-2 flex items-center space-x-3 font-bold text-sm animate-fadeIn ${
                    scannerMessage.type === 'success'
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                      : 'bg-red-50 border-red-300 text-red-950'
                  }`}
                >
                  {scannerMessage.type === 'success' ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0" />
                  ) : (
                    <X className="w-6 h-6 text-red-600 shrink-0" />
                  )}
                  <span>{scannerMessage.text}</span>
                </div>
              )}

              {/* Manual Input or Scanned Text */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-900">
                  {t.digitalPass.tokenNumber} / {t.digitalPass.tokenHash}
                </label>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={tokenInput}
                      onChange={(e) => setTokenInput(e.target.value)}
                      placeholder={t.adminDashboard.scanner.manualInputPlaceholder}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-slate-300 rounded-2xl font-mono font-bold text-base text-slate-900 focus:bg-white focus:outline-none focus:border-slate-900"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleVerifyGateToken()}
                    className="px-5 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-sm whitespace-nowrap min-h-[52px] shadow-sm transition-all active:scale-95"
                  >
                    {t.adminDashboard.scanner.verifyTokenBtn}
                  </button>
                </div>
              </div>

              {/* Quick Sample Tokens for Instant Testing */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  {t.adminDashboard.scanner.quickTestBtn}:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {sync.bookings
                    .filter((b) => b.status === 'BOOKED' || b.status === 'STAGING')
                    .slice(0, 3)
                    .map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => handleVerifyGateToken(b.tokenNumber)}
                        className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl text-left text-xs font-bold text-slate-800 transition-all flex items-center justify-between"
                      >
                        <div>
                          <div className="font-mono text-emerald-800 font-black">{b.tokenNumber}</div>
                          <div className="text-[11px] text-slate-600 truncate">{b.farmerName}</div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md">
                          {t.stages8[SIH_8_STAGES[getStageNumber(b.status) - 1]?.key as keyof typeof t.stages8] || b.status}
                        </span>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DYNAMIC QUEUE & BREAKDOWN CONTROL */}
        {activeTab === 'queue' && (
          <div className="space-y-6">
            {/* Traffic & Breakdown Controls Card */}
            <div className="bg-white p-6 rounded-3xl border-2 border-slate-300 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    {t.adminDashboard.queueManagement.title}
                  </h3>
                  <p className="text-xs font-medium text-slate-600 mt-0.5">
                    {t.adminDashboard.queueManagement.subtitle}
                  </p>
                </div>
              </div>

              {/* Control Buttons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Emergency Lane Toggle */}
                <button
                  type="button"
                  onClick={() => updateTrafficControls({ emergencyLane: !traffic.emergencyLane })}
                  className={`p-4 rounded-2xl border-2 text-left transition-all min-h-[56px] flex items-center justify-between ${
                    traffic.emergencyLane
                      ? 'bg-emerald-900 border-emerald-900 text-white shadow-md'
                      : 'bg-slate-50 border-slate-300 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Flame className={`w-6 h-6 ${traffic.emergencyLane ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <div>
                      <div className="font-black text-sm leading-tight">
                        {t.adminDashboard.queueManagement.emergencyLaneToggle}
                      </div>
                      <div className={`text-xs font-semibold ${traffic.emergencyLane ? 'text-emerald-300' : 'text-slate-500'}`}>
                        {traffic.emergencyLane ? t.adminDashboard.queueManagement.active : t.adminDashboard.queueManagement.inactive}
                      </div>
                    </div>
                  </div>
                  <div className={`w-3.5 h-3.5 rounded-full ${traffic.emergencyLane ? 'bg-emerald-400 animate-ping' : 'bg-slate-300'}`} />
                </button>

                {/* Equipment Breakdown Mode Toggle */}
                <button
                  type="button"
                  onClick={() => updateTrafficControls({ breakdown: !traffic.breakdown })}
                  className={`p-4 rounded-2xl border-2 text-left transition-all min-h-[56px] flex items-center justify-between ${
                    traffic.breakdown
                      ? 'bg-amber-900 border-amber-900 text-white shadow-md'
                      : 'bg-slate-50 border-slate-300 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className={`w-6 h-6 ${traffic.breakdown ? 'text-amber-400' : 'text-slate-600'}`} />
                    <div>
                      <div className="font-black text-sm leading-tight">
                        {t.adminDashboard.queueManagement.breakdownModeToggle}
                      </div>
                      <div className={`text-xs font-semibold ${traffic.breakdown ? 'text-amber-300' : 'text-slate-500'}`}>
                        {traffic.breakdown ? t.adminDashboard.queueManagement.active : t.adminDashboard.queueManagement.inactive}
                      </div>
                    </div>
                  </div>
                  <div className={`w-3.5 h-3.5 rounded-full ${traffic.breakdown ? 'bg-amber-400 animate-ping' : 'bg-slate-300'}`} />
                </button>

                {/* Traffic Reroute Toggle */}
                <button
                  type="button"
                  onClick={() => updateTrafficControls({ reroute: !traffic.reroute })}
                  className={`p-4 rounded-2xl border-2 text-left transition-all min-h-[56px] flex items-center justify-between ${
                    traffic.reroute
                      ? 'bg-blue-900 border-blue-900 text-white shadow-md'
                      : 'bg-slate-50 border-slate-300 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Radio className={`w-6 h-6 ${traffic.reroute ? 'text-blue-400' : 'text-slate-600'}`} />
                    <div>
                      <div className="font-black text-sm leading-tight">
                        {t.adminDashboard.queueManagement.trafficRerouteToggle}
                      </div>
                      <div className={`text-xs font-semibold ${traffic.reroute ? 'text-blue-300' : 'text-slate-500'}`}>
                        {traffic.reroute ? `${t.adminDashboard.queueManagement.rerouteGateLabel} 2` : t.adminDashboard.queueManagement.inactive}
                      </div>
                    </div>
                  </div>
                  <div className={`w-3.5 h-3.5 rounded-full ${traffic.reroute ? 'bg-blue-400 animate-ping' : 'bg-slate-300'}`} />
                </button>
              </div>
            </div>

            {/* Live Queue Table */}
            <div className="bg-white rounded-3xl border-2 border-slate-300 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white text-xs font-black uppercase tracking-wider">
                      <th className="py-3.5 px-4">{t.adminDashboard.queueManagement.tableHeaders.token}</th>
                      <th className="py-3.5 px-4">{t.adminDashboard.queueManagement.tableHeaders.farmer}</th>
                      <th className="py-3.5 px-4">{t.adminDashboard.queueManagement.tableHeaders.vehicle}</th>
                      <th className="py-3.5 px-4">{t.adminDashboard.queueManagement.tableHeaders.cropQuantity}</th>
                      <th className="py-3.5 px-4">{t.adminDashboard.queueManagement.tableHeaders.timeSlot}</th>
                      <th className="py-3.5 px-4">{t.adminDashboard.queueManagement.tableHeaders.status}</th>
                      <th className="py-3.5 px-4 text-right">{t.adminDashboard.queueManagement.tableHeaders.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-sm font-medium">
                    {sync.bookings.map((b) => {
                      const isEmergency = b.priority === 'emergency';
                      const stageNum = getStageNumber(b.status);
                      const currentStage = SIH_8_STAGES[stageNum - 1];
                      const nextStage = stageNum < 8 ? SIH_8_STAGES[stageNum] : null;

                      return (
                        <tr key={b.id} className={`hover:bg-slate-50 transition-colors ${isEmergency ? 'bg-emerald-50/50' : ''}`}>
                          <td className="py-3.5 px-4 font-mono font-black text-slate-900">
                            {b.tokenNumber}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">{b.farmerName}</div>
                            <div className="text-xs text-slate-500">{b.village}</div>
                          </td>
                          <td className="py-3.5 px-4 text-xs font-bold text-slate-700">
                            {t.vehicles[b.vehicleType]}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">{t.crops[b.crop]}</div>
                            <div className="text-xs text-slate-500">{b.quantity} {t.common.quintal}</div>
                          </td>
                          <td className="py-3.5 px-4 text-xs font-semibold text-slate-700">
                            {b.timeSlot}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="space-y-1">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-black ${
                                  stageNum === 8
                                    ? 'bg-emerald-100 text-emerald-900'
                                    : stageNum >= 4
                                    ? 'bg-purple-100 text-purple-900'
                                    : stageNum >= 2
                                    ? 'bg-blue-100 text-blue-900'
                                    : 'bg-amber-100 text-amber-900'
                                }`}
                              >
                                {stageNum}/8: {t.stages8[currentStage?.key as keyof typeof t.stages8] || b.status}
                              </span>
                              <div className="w-24 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                                  style={{ width: `${(stageNum / 8) * 100}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="inline-flex items-center space-x-1.5">
                              {nextStage && (
                                <button
                                  type="button"
                                  onClick={() => advanceBookingStage(b.id)}
                                  className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                                  title={`Advance to ${t.stages8[nextStage.key as keyof typeof t.stages8]}`}
                                >
                                  → {t.stages8[nextStage.key as keyof typeof t.stages8]}
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => toggleEmergencyPriority(b.id)}
                                title={t.adminDashboard.queueManagement.prioritize}
                                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                                  isEmergency
                                    ? 'bg-emerald-800 text-white border-emerald-900'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
                                }`}
                              >
                                <Flame className="w-3.5 h-3.5 inline mr-1" />
                                {t.adminDashboard.queueManagement.prioritize}
                              </button>
                              <button
                                type="button"
                                onClick={() => callNextVehicle(b.id)}
                                className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
                              >
                                {t.adminDashboard.queueManagement.callNext}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: QUALITY TESTING & WEIGHBRIDGE FORM */}
        {activeTab === 'weighing' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <form onSubmit={handleApproveInspection} className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-300 shadow-md space-y-6">
              <div className="flex items-start space-x-4 border-b border-slate-100 pb-4">
                <div className="p-3 bg-slate-900 text-white rounded-2xl">
                  <Scale className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    {t.adminDashboard.weighingForm.title}
                  </h2>
                  <p className="text-sm font-medium text-slate-600 mt-0.5">
                    {t.adminDashboard.weighingForm.subtitle}
                  </p>
                </div>
              </div>

              {weighingSuccessMsg && (
                <div className="p-4 bg-emerald-50 border-2 border-emerald-400 rounded-2xl flex items-center space-x-3 text-emerald-950 font-bold text-sm animate-fadeIn">
                  <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0" />
                  <span>{weighingSuccessMsg}</span>
                </div>
              )}

              {/* Select Token / Farmer */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-900">
                  {t.adminDashboard.weighingForm.selectToken}
                </label>
                <select
                  value={selectedBookingId}
                  onChange={(e) => setSelectedBookingId(e.target.value)}
                  className="w-full p-3.5 bg-white border-2 border-slate-300 rounded-2xl font-bold text-base text-slate-900 focus:outline-none focus:border-slate-800 min-h-[52px]"
                >
                  {sync.bookings.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.tokenNumber} • {b.farmerName} • {t.crops[b.crop]} ({b.quantity} {t.common.quintal})
                    </option>
                  ))}
                </select>
              </div>

              {/* Quality Testing Parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {/* Dockage Grade */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-900">
                    {t.adminDashboard.weighingForm.dockageGrade}
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['A', 'B', 'C'] as const).map((grade) => (
                      <button
                        key={grade}
                        type="button"
                        onClick={() => setDockageGrade(grade)}
                        className={`py-3 rounded-xl font-black text-sm border transition-all ${
                          dockageGrade === grade
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-300'
                        }`}
                      >
                        {grade}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Moisture Level % */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-900">
                    {t.adminDashboard.weighingForm.moistureLevel} ({t.adminDashboard.weighingForm.moistureUnit})
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="5"
                    max="25"
                    value={moistureLevel}
                    onChange={(e) => setMoistureLevel(parseFloat(e.target.value) || 0)}
                    className="w-full p-3 bg-white border-2 border-slate-300 rounded-xl font-bold text-base text-slate-900 focus:border-slate-800 min-h-[48px]"
                  />
                </div>

                {/* Foreign Matter % */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-900">
                    {t.adminDashboard.weighingForm.foreignMatter}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={foreignMatter}
                    onChange={(e) => setForeignMatter(parseFloat(e.target.value) || 0)}
                    className="w-full p-3 bg-white border-2 border-slate-300 rounded-xl font-bold text-base text-slate-900 focus:border-slate-800 min-h-[48px]"
                  />
                </div>
              </div>

              {/* Weighbridge Scales: Gross, Tare, and Net Weight */}
              <div className="p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-4">
                <div className="font-black text-slate-900 text-base">
                  {t.adminDashboard.weighingInspection} ({t.common.kg})
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Gross Weight */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">
                      {t.adminDashboard.weighingForm.grossWeight}
                    </label>
                    <input
                      type="number"
                      step="10"
                      value={grossWeight}
                      onChange={(e) => setGrossWeight(parseFloat(e.target.value) || 0)}
                      className="w-full p-3 bg-white border-2 border-slate-300 rounded-xl font-black text-xl text-slate-900 focus:border-slate-800"
                    />
                  </div>

                  {/* Tare Weight */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">
                      {t.adminDashboard.weighingForm.tareWeight}
                    </label>
                    <input
                      type="number"
                      step="10"
                      value={tareWeight}
                      onChange={(e) => setTareWeight(parseFloat(e.target.value) || 0)}
                      className="w-full p-3 bg-white border-2 border-slate-300 rounded-xl font-black text-xl text-slate-900 focus:border-slate-800"
                    />
                  </div>

                  {/* Calculated Net Weight */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-emerald-800 block">
                      {t.adminDashboard.weighingForm.netWeight}
                    </label>
                    <div className="w-full p-3 bg-emerald-50 border-2 border-emerald-300 rounded-xl font-black text-xl text-emerald-900">
                      {calculatedNetWeight} {t.common.kg}
                    </div>
                  </div>
                </div>

                {/* MSP Payout Calculation Summary */}
                <div className="p-4 bg-white border border-slate-300 rounded-xl grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-semibold">
                  <div>
                    <span className="text-slate-500 block">{t.adminDashboard.weighingForm.mspRate}</span>
                    <span className="font-bold text-sm text-slate-900">₹{mspRate} / {t.common.quintal}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">{t.adminDashboard.weighingForm.moisturePenalty}</span>
                    <span className="font-bold text-sm text-red-600">- ₹{moisturePenalty}</span>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-emerald-800 block font-bold">{t.adminDashboard.weighingForm.netPayout}</span>
                    <span className="font-black text-base text-emerald-900">₹{totalPayout.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Submit & Issue Settlement */}
              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-3 p-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-lg transition-all shadow-md active:scale-98 min-h-[56px]"
              >
                <FileCheck className="w-6 h-6 text-emerald-400" />
                <span>{t.adminDashboard.weighingForm.approveAndIssue}</span>
              </button>
            </form>
          </div>
        )}
      </main>

      {/* GATE CHECK-IN POPUP MODAL */}
      {showCheckInModal && scannedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl border-2 border-slate-400 shadow-2xl p-6 sm:p-8 space-y-6 animate-scaleIn">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-emerald-100 text-emerald-900 rounded-2xl">
                  <QrCode className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    {t.gateCheckInModal.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-slate-600">
                    {t.gateCheckInModal.subtitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowCheckInModal(false);
                  setScannedBooking(null);
                }}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Verified Farmer Produce Information Grid */}
            <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-200 space-y-3.5">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase">{t.digitalPass.tokenNumber}</span>
                <span className="text-lg font-black text-emerald-800 font-mono">{scannedBooking.tokenNumber}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-xs font-bold text-slate-500 block">{t.gateCheckInModal.farmerName}</span>
                  <span className="font-black text-slate-900">{scannedBooking.farmerName}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 block">{t.digitalPass.farmerId}</span>
                  <span className="font-mono font-bold text-slate-800">{scannedBooking.farmerId}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 block">{t.gateCheckInModal.crop}</span>
                  <span className="font-bold text-slate-900">{t.crops[scannedBooking.crop]}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 block">{t.gateCheckInModal.quantity}</span>
                  <span className="font-bold text-slate-900">{scannedBooking.quantity} {t.common.quintal}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 block">{t.gateCheckInModal.vehicle}</span>
                  <span className="font-bold text-slate-900">{t.vehicles[scannedBooking.vehicleType]}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 block">{t.gateCheckInModal.timeSlot}</span>
                  <span className="font-bold text-slate-900">{scannedBooking.timeSlot}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowCheckInModal(false);
                  setScannedBooking(null);
                }}
                className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl font-black text-base min-h-[50px] transition-all"
              >
                {t.common.close}
              </button>
              <button
                type="button"
                onClick={handleModalCheckInConfirm}
                className="flex-2 py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-2xl font-black text-base flex items-center justify-center space-x-2 min-h-[50px] shadow-lg transition-all active:scale-98"
              >
                <Check className="w-5 h-5" />
                <span>{t.gateCheckInModal.checkInAction}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
