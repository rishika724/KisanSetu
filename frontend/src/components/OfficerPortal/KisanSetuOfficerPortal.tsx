'use client';

import React, { useState, useEffect } from 'react';
import { OfficerHeader } from './OfficerHeader';
import { QrPassScannerModule } from './QrPassScannerModule';
import { QualityInspectionForm } from './QualityInspectionForm';
import { LiveYardQueueTable } from './LiveYardQueueTable';
import {
  VerifiedTokenData,
  InspectionReceiptResult,
  fetchBookingsApi
} from '../../lib/api';
import {
  Scale,
  QrCode,
  Truck,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Building2,
  Sparkles
} from 'lucide-react';

export function KisanSetuOfficerPortal() {
  const [selectedTab, setSelectedTab] = useState<'station' | 'queue' | 'inspections'>('station');
  const [activeVehicle, setActiveVehicle] = useState<VerifiedTokenData | null>(null);
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [bannerAlert, setBannerAlert] = useState<{ type: 'success' | 'info'; message: string } | null>(null);

  const [counts, setCounts] = useState({
    insideYard: 2,
    staging: 1,
    completed: 1
  });

  const refreshCounts = async () => {
    try {
      const data = await fetchBookingsApi();
      setCounts({
        insideYard: data.filter((b) => b.status === 'MANDI_GATE').length,
        staging: data.filter((b) => b.status === 'STAGING').length,
        completed: data.filter((b) => b.status === 'COMPLETED').length
      });
    } catch (e) {}
  };

  useEffect(() => {
    refreshCounts();
  }, []);

  // When QR Scanner succeeds
  const handleScannerVerifiedSuccess = (data: VerifiedTokenData) => {
    setActiveVehicle(data);
    setBannerAlert({
      type: 'success',
      message: `टोकन सत्यापित: किसान ${data.farmer?.name || ''} (${data.vehicleType}) तुलाई हेतु तैयार है।`
    });
    // Auto clear alert after 6 seconds
    setTimeout(() => setBannerAlert(null), 6000);
  };

  // When Queue table "Weigh & Inspect" is clicked
  const handleSelectFromQueue = (vehicle: VerifiedTokenData) => {
    setActiveVehicle(vehicle);
    setSelectedTab('station');
    setBannerAlert({
      type: 'info',
      message: `वाहन लोड किया गया: ${vehicle.farmer?.name || ''} (${vehicle.vehicleType} - ${vehicle.cropType})`
    });
    setTimeout(() => setBannerAlert(null), 5000);
  };

  // When Quality Inspection is approved & receipt issued
  const handleInspectionCompleted = (result: InspectionReceiptResult) => {
    refreshCounts();
    setBannerAlert({
      type: 'success',
      message: `रसीद #${result.receipt.receiptNumber} जारी की गई! शुद्ध देय राशि: ₹${result.receipt.totalPayout.toLocaleString('en-IN')} DBT अंतरण शुरू।`
    });
  };

  return (
    <div
      className={`min-h-screen transition-colors ${
        highContrast
          ? 'bg-slate-900 text-slate-100 font-sans'
          : 'bg-slate-100 text-slate-900 antialiased font-sans'
      }`}
    >
      {/* 1. Rugged Tablet Header */}
      <OfficerHeader
        activeCenterName="कोटा कृषि उपज मंडी (Kota Krishi Upaj Mandi, Raj.)"
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        counts={counts}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* Main Operational Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Banner Alert if any */}
        {bannerAlert && (
          <div
            className={`p-4 rounded-2xl border-2 flex items-center justify-between text-sm font-bold shadow-sm animate-fadeIn ${
              bannerAlert.type === 'success'
                ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                : 'bg-blue-50 border-blue-400 text-blue-950'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0" />
              <span>{bannerAlert.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setBannerAlert(null)}
              className="text-xs font-black uppercase px-2 py-1 bg-white rounded-lg border hover:bg-slate-100"
            >
              हटाएं (Dismiss)
            </button>
          </div>
        )}

        {/* View Tab 1: Gate Scanner & Weighbridge Inspection Station */}
        {selectedTab === 'station' && (
          <div className="space-y-8">
            {/* Feature 1: Kisan Setu QR Pass Scanner Module */}
            <section aria-labelledby="qr-scanner-title">
              <QrPassScannerModule
                onVerifiedSuccess={handleScannerVerifiedSuccess}
                soundEnabled={soundEnabled}
                highContrast={highContrast}
              />
            </section>

            {/* Feature 2: Quality Inspection & Weighbridge Form */}
            <section aria-labelledby="quality-form-title">
              <QualityInspectionForm
                activeVehicle={activeVehicle}
                onInspectionCompleted={handleInspectionCompleted}
                soundEnabled={soundEnabled}
              />
            </section>

            {/* Inlined Live Yard Queue Mini-Summary for Quick Access */}
            <section className="pt-4 border-t-2 border-slate-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Truck className="w-7 h-7 text-slate-800" />
                  <h3 className="text-xl font-black text-slate-900">
                    लाइव यार्ड कतार त्वरित दृश्य (Active Yard Queue Quick View)
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedTab('queue')}
                  className="text-sm font-black text-slate-900 hover:text-emerald-800 underline flex items-center gap-1"
                >
                  <span>पूर्ण कतार तालिका खोलें (Full Queue Table) →</span>
                </button>
              </div>
              <LiveYardQueueTable
                onSelectVehicleForInspection={handleSelectFromQueue}
                onRefreshRequested={refreshCounts}
              />
            </section>
          </div>
        )}

        {/* View Tab 2: Full Live Yard Queue & Log Table */}
        {selectedTab === 'queue' && (
          <div className="space-y-6">
            <LiveYardQueueTable
              onSelectVehicleForInspection={handleSelectFromQueue}
              onRefreshRequested={refreshCounts}
            />
          </div>
        )}
      </main>
    </div>
  );
}
