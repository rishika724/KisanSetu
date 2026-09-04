'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  fetchCenters,
  fetchAvailableSlots,
  fetchFarmers,
  createBookingApi,
  ProcurementCenter,
  SlotItem,
  FarmerItem,
  BookingResponseData
} from '../lib/api';
import {
  Wheat,
  Sprout,
  Building2,
  Calendar,
  Clock,
  Truck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Plus,
  Scale,
  Sparkles
} from 'lucide-react';

interface MobileBookingWizardProps {
  onBookingSuccess: (data: BookingResponseData) => void;
}

export function MobileBookingWizard({ onBookingSuccess }: MobileBookingWizardProps) {
  const { language, t } = useLanguage();

  // 3 Steps: 1 = Crop & Weight, 2 = Center & Slot, 3 = Vehicle Type
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [selectedCrop, setSelectedCrop] = useState<string>('PADDY');
  const [estimatedWeight, setEstimatedWeight] = useState<string>('45');
  const [centers, setCenters] = useState<ProcurementCenter[]>([]);
  const [farmers, setFarmers] = useState<FarmerItem[]>([]);
  const [selectedCenterId, setSelectedCenterId] = useState<string>('');
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState<SlotItem[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [vehicleType, setVehicleType] = useState<'BULLOCK_CART' | 'TRACTOR' | 'TRUCK'>('TRACTOR');

  // UI state
  const [loadingCenters, setLoadingCenters] = useState<boolean>(true);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch initial Mandis and Farmers
  useEffect(() => {
    async function loadInitial() {
      try {
        setLoadingCenters(true);
        const [cList, fList] = await Promise.all([fetchCenters(), fetchFarmers()]);
        setCenters(cList);
        setFarmers(fList);
        if (cList.length > 0) setSelectedCenterId(cList[0].id);
        if (fList.length > 0) setSelectedFarmerId(fList[0].id);
      } catch (err: any) {
        console.error('Failed to load centers:', err);
      } finally {
        setLoadingCenters(false);
      }
    }
    loadInitial();
  }, []);

  // Fetch Slots whenever Center or Date changes
  useEffect(() => {
    if (!selectedCenterId || !selectedDate) return;

    async function loadSlots() {
      try {
        setLoadingSlots(true);
        setSelectedSlotId('');
        const slotList = await fetchAvailableSlots(selectedCenterId, selectedDate);
        setSlots(slotList);
        const firstAvail = slotList.find((s) => s.isAvailable);
        if (firstAvail) setSelectedSlotId(firstAvail.id);
      } catch (err: any) {
        console.error('Error fetching slots:', err);
      } finally {
        setLoadingSlots(false);
      }
    }

    loadSlots();
  }, [selectedCenterId, selectedDate]);

  const handleQuickAddWeight = (increment: number) => {
    const curr = parseFloat(estimatedWeight) || 0;
    setEstimatedWeight(String(curr + increment));
  };

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    const weightNum = parseFloat(estimatedWeight);
    if (isNaN(weightNum) || weightNum <= 0) {
      setErrorMessage('Please enter a valid crop weight in quintals.');
      return;
    }
    setErrorMessage(null);
    setCurrentStep(2);
  };

  const handleStep2Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlotId) {
      setErrorMessage('Please select an available time window slot.');
      return;
    }
    setErrorMessage(null);
    setCurrentStep(3);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const weightNum = parseFloat(estimatedWeight);
    if (!selectedSlotId || isNaN(weightNum) || weightNum <= 0) {
      setErrorMessage('Invalid booking configuration.');
      return;
    }

    const cropNameMap: Record<string, string> = {
      PADDY: t.wizard.crops.paddy.name,
      WHEAT: t.wizard.crops.wheat.name,
      PULSES: t.wizard.crops.pulses.name
    };

    try {
      setSubmitting(true);
      const res = await createBookingApi({
        farmerId: selectedFarmerId,
        slotId: selectedSlotId,
        vehicleType,
        cropType: cropNameMap[selectedCrop] || 'Paddy (धान)',
        estimatedWeight: weightNum
      });

      // Cache the active pass in localStorage for instant PWA offline access
      if (typeof window !== 'undefined') {
        localStorage.setItem('kisan_setu_active_pass', JSON.stringify(res));
      }

      onBookingSuccess(res);
    } catch (err: any) {
      setErrorMessage(err.message || 'Booking submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const getTomorrowDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const selectedCenterObj = centers.find((c) => c.id === selectedCenterId);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* 3-Step Guided Header Indicator */}
      <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
            {t.wizard.stepTitle} {currentStep} / 3
          </span>
          <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-800 border border-slate-300 rounded-full">
            {currentStep === 1
              ? 'Crop & Weight'
              : currentStep === 2
              ? 'Center & Slot'
              : 'Vehicle Type'}
          </span>
        </div>

        {/* 3-Step Visual Bar */}
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((stepNum) => (
            <div
              key={stepNum}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                stepNum <= currentStep ? 'bg-slate-900' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl flex items-center space-x-3">
          <AlertCircle className="w-8 h-8 text-red-700 shrink-0" />
          <p className="text-red-900 font-bold text-base leading-snug">{errorMessage}</p>
        </div>
      )}

      {/* STEP 1: Select Crop Type & Estimated Weight */}
      {currentStep === 1 && (
        <form onSubmit={handleStep1Next} className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-xs space-y-6">
            <div className="flex items-start space-x-4 border-b border-slate-100 pb-4">
              <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200 shrink-0">
                <Wheat className="w-8 h-8 text-slate-800" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  {t.wizard.step1Title}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 font-medium mt-0.5">
                  {t.wizard.step1Subtitle}
                </p>
              </div>
            </div>

            {/* Crop Type Large Selection Cards */}
            <div className="space-y-3">
              <label className="block text-base font-bold text-slate-900">
                फसल का प्रकार चुनें (Select Harvest):
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Paddy Card */}
                <button
                  type="button"
                  onClick={() => setSelectedCrop('PADDY')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all min-h-[56px] flex flex-col justify-between ${
                    selectedCrop === 'PADDY'
                      ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                      : 'bg-white border-slate-300 text-slate-800 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <Sprout className={`w-8 h-8 ${selectedCrop === 'PADDY' ? 'text-emerald-400' : 'text-slate-600'}`} />
                    {selectedCrop === 'PADDY' && <CheckCircle2 className="w-6 h-6 text-emerald-400" />}
                  </div>
                  <div className="mt-3">
                    <div className="font-bold text-lg leading-tight">{t.wizard.crops.paddy.name}</div>
                    <div className={`text-xs font-medium mt-0.5 ${selectedCrop === 'PADDY' ? 'text-slate-300' : 'text-slate-500'}`}>
                      {t.wizard.crops.paddy.desc}
                    </div>
                  </div>
                </button>

                {/* Wheat Card */}
                <button
                  type="button"
                  onClick={() => setSelectedCrop('WHEAT')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all min-h-[56px] flex flex-col justify-between ${
                    selectedCrop === 'WHEAT'
                      ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                      : 'bg-white border-slate-300 text-slate-800 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <Wheat className={`w-8 h-8 ${selectedCrop === 'WHEAT' ? 'text-emerald-400' : 'text-slate-600'}`} />
                    {selectedCrop === 'WHEAT' && <CheckCircle2 className="w-6 h-6 text-emerald-400" />}
                  </div>
                  <div className="mt-3">
                    <div className="font-bold text-lg leading-tight">{t.wizard.crops.wheat.name}</div>
                    <div className={`text-xs font-medium mt-0.5 ${selectedCrop === 'WHEAT' ? 'text-slate-300' : 'text-slate-500'}`}>
                      {t.wizard.crops.wheat.desc}
                    </div>
                  </div>
                </button>

                {/* Pulses Card */}
                <button
                  type="button"
                  onClick={() => setSelectedCrop('PULSES')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all min-h-[56px] flex flex-col justify-between ${
                    selectedCrop === 'PULSES'
                      ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                      : 'bg-white border-slate-300 text-slate-800 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <Scale className={`w-8 h-8 ${selectedCrop === 'PULSES' ? 'text-emerald-400' : 'text-slate-600'}`} />
                    {selectedCrop === 'PULSES' && <CheckCircle2 className="w-6 h-6 text-emerald-400" />}
                  </div>
                  <div className="mt-3">
                    <div className="font-bold text-lg leading-tight">{t.wizard.crops.pulses.name}</div>
                    <div className={`text-xs font-medium mt-0.5 ${selectedCrop === 'PULSES' ? 'text-slate-300' : 'text-slate-500'}`}>
                      {t.wizard.crops.pulses.desc}
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Estimated Weight Input */}
            <div className="space-y-3 pt-2">
              <label className="block text-base font-bold text-slate-900">
                {t.wizard.weightLabel}
              </label>

              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  value={estimatedWeight}
                  onChange={(e) => setEstimatedWeight(e.target.value)}
                  placeholder={t.wizard.weightPlaceholder}
                  required
                  className="w-full p-4 pr-24 bg-slate-50 border-2 border-slate-300 rounded-2xl font-black text-2xl text-slate-900 focus:bg-white transition-all min-h-[56px] shadow-inner"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-600 font-black text-lg">
                  {t.wizard.weightUnit}
                </div>
              </div>

              {/* Quick Increment Buttons */}
              <div className="flex items-center space-x-2 pt-1">
                <span className="text-xs font-bold text-slate-500">{t.wizard.quickAdd}</span>
                {[+5, +10, +25, +50].map((inc) => (
                  <button
                    key={inc}
                    type="button"
                    onClick={() => handleQuickAddWeight(inc)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 transition-all active:scale-95"
                  >
                    +{inc} {t.wizard.weightUnit}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action: Next Step Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-3 p-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xl transition-all shadow-md active:scale-98 min-h-[56px]"
          >
            <span>{t.wizard.nextStep}</span>
            <ArrowRight className="w-7 h-7" aria-hidden="true" />
          </button>
        </form>
      )}

      {/* STEP 2: Pick Nearest Center & Available Time Slot */}
      {currentStep === 2 && (
        <form onSubmit={handleStep2Next} className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-xs space-y-6">
            <div className="flex items-start space-x-4 border-b border-slate-100 pb-4">
              <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200 shrink-0">
                <Building2 className="w-8 h-8 text-slate-800" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  {t.wizard.step2Title}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 font-medium mt-0.5">
                  {t.wizard.step2Subtitle}
                </p>
              </div>
            </div>

            {/* Center Selector */}
            <div className="space-y-2">
              <label className="block text-base font-bold text-slate-900">
                {t.wizard.selectCenterLabel}
              </label>
              <select
                value={selectedCenterId}
                onChange={(e) => setSelectedCenterId(e.target.value)}
                disabled={loadingCenters}
                className="w-full p-4 bg-slate-50 border-2 border-slate-300 rounded-2xl font-bold text-base text-slate-900 focus:bg-white min-h-[56px]"
              >
                {centers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.weighbridgeCount} Weighbridges)
                  </option>
                ))}
              </select>
            </div>

            {/* Arrival Date Selection */}
            <div className="space-y-2">
              <label className="block text-base font-bold text-slate-900">
                {t.wizard.selectDateLabel}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                  className={`p-3.5 rounded-2xl border-2 font-bold text-base flex items-center justify-center space-x-2 transition-all min-h-[56px] ${
                    selectedDate === new Date().toISOString().split('T')[0]
                      ? 'bg-slate-900 border-slate-900 text-white'
                      : 'bg-white border-slate-300 text-slate-800 hover:border-slate-400'
                  }`}
                >
                  <Calendar className="w-6 h-6" />
                  <span>आज (Today)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDate(getTomorrowDate())}
                  className={`p-3.5 rounded-2xl border-2 font-bold text-base flex items-center justify-center space-x-2 transition-all min-h-[56px] ${
                    selectedDate === getTomorrowDate()
                      ? 'bg-slate-900 border-slate-900 text-white'
                      : 'bg-white border-slate-300 text-slate-800 hover:border-slate-400'
                  }`}
                >
                  <Calendar className="w-6 h-6" />
                  <span>कल (Tomorrow)</span>
                </button>
              </div>
            </div>

            {/* Time Slot Picker with Neutral Capacity Badges */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-base font-bold text-slate-900">
                  {t.wizard.selectSlotLabel}
                </label>
                <span className="text-xs text-slate-500 font-semibold">
                  {slots.length} Slots
                </span>
              </div>

              {/* Neutral Capacity Legend Guide */}
              <div className="flex flex-wrap gap-2 text-xs font-semibold p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="flex items-center space-x-1.5">
                  <span className="w-3.5 h-3.5 rounded-md bg-slate-100 border border-slate-400" />
                  <span>{t.wizard.capacityBadges.available}</span>
                </span>
                <span className="flex items-center space-x-1.5 ml-2">
                  <span className="w-3.5 h-3.5 rounded-md bg-slate-300 border border-slate-500" />
                  <span>{t.wizard.capacityBadges.moderate}</span>
                </span>
                <span className="flex items-center space-x-1.5 ml-2">
                  <span className="w-3.5 h-3.5 rounded-md bg-slate-800 border border-slate-900" />
                  <span>{t.wizard.capacityBadges.full}</span>
                </span>
              </div>

              {loadingSlots ? (
                <div className="p-6 text-center text-slate-600 font-bold animate-pulse">
                  Checking slot capacity...
                </div>
              ) : slots.length === 0 ? (
                <div className="p-6 text-center text-slate-600 font-medium bg-slate-50 rounded-2xl border">
                  No slots available for this date.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {slots.map((slot) => {
                    const isSelected = selectedSlotId === slot.id;
                    const isFull = !slot.isAvailable;
                    const isModerate = slot.utilizationPercentage >= 60 && !isFull;

                    return (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={isFull}
                        onClick={() => setSelectedSlotId(slot.id)}
                        className={`p-4 rounded-2xl border-2 text-left transition-all min-h-[56px] flex flex-col justify-between ${
                          isSelected
                            ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                            : isFull
                            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                            : 'bg-white border-slate-300 text-slate-900 hover:border-slate-500'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center space-x-2">
                            <Clock className={`w-6 h-6 ${isSelected ? 'text-emerald-400' : 'text-slate-700'}`} />
                            <span className="font-bold text-lg">{slot.timeWindow}</span>
                          </div>

                          {/* Neutral Capacity Badges: Soft Gray = Available, Muted Slate = Moderate, Charcoal = Full */}
                          <span
                            className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                              isFull
                                ? 'bg-slate-800 text-white border-slate-900'
                                : isModerate
                                ? 'bg-slate-300 text-slate-900 border-slate-400'
                                : 'bg-slate-100 text-slate-800 border-slate-300'
                            }`}
                          >
                            {isFull
                              ? t.wizard.capacityBadges.full
                              : isModerate
                              ? t.wizard.capacityBadges.moderate
                              : t.wizard.capacityBadges.available}
                          </span>
                        </div>

                        <div className="mt-2 text-xs font-medium flex items-center justify-between">
                          <span className={isSelected ? 'text-emerald-300 font-bold' : 'text-slate-600'}>
                            {slot.remainingCapacity} spots left
                          </span>
                          <span className={isSelected ? 'text-slate-300' : 'text-slate-500'}>
                            {slot.bookedCount}/{slot.maxCapacity} Booked
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons: Prev & Next */}
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="flex-1 flex items-center justify-center space-x-2 p-4 bg-slate-100 hover:bg-slate-200 text-slate-800 border-2 border-slate-300 rounded-2xl font-bold text-lg transition-all min-h-[56px]"
            >
              <ArrowLeft className="w-6 h-6" />
              <span>{t.wizard.prevStep}</span>
            </button>

            <button
              type="submit"
              disabled={!selectedSlotId}
              className="flex-2 flex items-center justify-center space-x-3 p-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white rounded-2xl font-bold text-xl transition-all shadow-md active:scale-98 min-h-[56px]"
            >
              <span>{t.wizard.nextStep}</span>
              <ArrowRight className="w-7 h-7" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: Choose Vehicle Type with Large Icons */}
      {currentStep === 3 && (
        <form onSubmit={handleFinalSubmit} className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-xs space-y-6">
            <div className="flex items-start space-x-4 border-b border-slate-100 pb-4">
              <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200 shrink-0">
                <Truck className="w-8 h-8 text-slate-800" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  {t.wizard.step3Title}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 font-medium mt-0.5">
                  {t.wizard.step3Subtitle}
                </p>
              </div>
            </div>

            {/* Vehicle Options Grid with Prominent Oversized Icons (w-8 h-8) */}
            <div className="space-y-3">
              {[
                {
                  id: 'BULLOCK_CART' as const,
                  ...t.wizard.vehicles.bullockCart,
                  icon: Truck
                },
                {
                  id: 'TRACTOR' as const,
                  ...t.wizard.vehicles.tractor,
                  icon: Truck
                },
                {
                  id: 'TRUCK' as const,
                  ...t.wizard.vehicles.truck,
                  icon: Truck
                }
              ].map((v) => {
                const isSelected = vehicleType === v.id;
                const IconComp = v.icon;

                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVehicleType(v.id)}
                    className={`w-full p-5 rounded-2xl border-2 text-left transition-all min-h-[56px] flex items-center justify-between ${
                      isSelected
                        ? 'bg-slate-900 border-slate-900 text-white shadow-lg ring-2 ring-slate-400'
                        : 'bg-white border-slate-300 text-slate-800 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      {/* Prominent Lucide Icon: 32px (w-8 h-8) */}
                      <div
                        className={`p-3 rounded-2xl border ${
                          isSelected ? 'bg-slate-800 border-slate-700 text-emerald-400' : 'bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        <IconComp className="w-8 h-8" aria-hidden="true" />
                      </div>
                      <div>
                        <div className="font-bold text-lg sm:text-xl leading-tight">{v.name}</div>
                        <div className={`text-xs font-semibold mt-0.5 ${isSelected ? 'text-emerald-300' : 'text-slate-600'}`}>
                          ⏱️ {v.unloadTime} • {v.desc}
                        </div>
                      </div>
                    </div>

                    <div>
                      {isSelected ? (
                        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-slate-300" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Booking Summary Card */}
            <div className="p-4 bg-slate-50 border border-slate-300 rounded-2xl space-y-2 text-sm">
              <div className="font-bold text-slate-900">बुकिंग सारांश (Summary):</div>
              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div>फसल: <strong>{selectedCrop}</strong></div>
                <div>वजन: <strong>{estimatedWeight} क्विंटल</strong></div>
                <div>मंडी: <strong>{selectedCenterObj?.name?.split('(')[0]}</strong></div>
                <div>तारीख: <strong>{selectedDate}</strong></div>
              </div>
            </div>
          </div>

          {/* Action Buttons: Prev & Final Submit */}
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="flex-1 flex items-center justify-center space-x-2 p-4 bg-slate-100 hover:bg-slate-200 text-slate-800 border-2 border-slate-300 rounded-2xl font-bold text-lg transition-all min-h-[56px]"
            >
              <ArrowLeft className="w-6 h-6" />
              <span>{t.wizard.prevStep}</span>
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex-2 flex items-center justify-center space-x-3 p-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white rounded-2xl font-black text-lg sm:text-xl transition-all shadow-lg active:scale-98 min-h-[56px]"
            >
              <Sparkles className="w-7 h-7 text-emerald-400" />
              <span>{submitting ? t.wizard.submitting : t.wizard.submitBooking}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
