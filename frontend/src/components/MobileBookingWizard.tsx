'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  useSyncStore,
  createNewBooking,
  CropKey,
  VehicleTypeKey,
  SyncBooking
} from '../lib/syncStore';
import {
  Wheat,
  Building2,
  Calendar,
  Clock,
  Truck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Scale,
  Sparkles,
  MapPin
} from 'lucide-react';

interface MandiCenterOption {
  id: string;
  name: string;
  location: string;
  weighbridges: number;
  capacityPerHour: number;
  currentQueue: number;
  estimatedWaitMinutes: number;
  availableSlots: number;
  status: 'open' | 'busy' | 'closed';
}

const PROCUREMENT_CENTERS: MandiCenterOption[] = [
  {
    id: 'center-01',
    name: 'Mandi Procurement Center #1',
    location: 'Bhamashah Yard, Kota (4.2 km)',
    weighbridges: 4,
    capacityPerHour: 35,
    currentQueue: 12,
    estimatedWaitMinutes: 45,
    availableSlots: 8,
    status: 'open'
  },
  {
    id: 'center-02',
    name: 'Mandi Procurement Center #2',
    location: 'GT Road Market, Karnal (7.5 km)',
    weighbridges: 3,
    capacityPerHour: 28,
    currentQueue: 24,
    estimatedWaitMinutes: 80,
    availableSlots: 3,
    status: 'busy'
  },
  {
    id: 'center-03',
    name: 'Mandi Procurement Center #3',
    location: 'Karond Bypass, Bhopal (11.0 km)',
    weighbridges: 3,
    capacityPerHour: 25,
    currentQueue: 6,
    estimatedWaitMinutes: 20,
    availableSlots: 14,
    status: 'open'
  },
  {
    id: 'center-04',
    name: 'Mandi Procurement Center #4',
    location: 'Choithram Yard, Indore (18.3 km)',
    weighbridges: 5,
    capacityPerHour: 40,
    currentQueue: 0,
    estimatedWaitMinutes: 0,
    availableSlots: 0,
    status: 'closed'
  }
];

interface MockSlot {
  id: string;
  timeWindow: string;
  maxCapacity: number;
  bookedCount: number;
  isAvailable: boolean;
}

const MOCK_SLOTS_DATA: MockSlot[] = [
  { id: 'slot-1', timeWindow: '08:00 - 09:00', maxCapacity: 15, bookedCount: 4, isAvailable: true },
  { id: 'slot-2', timeWindow: '09:00 - 10:00', maxCapacity: 15, bookedCount: 9, isAvailable: true },
  { id: 'slot-3', timeWindow: '10:00 - 11:00', maxCapacity: 15, bookedCount: 14, isAvailable: true },
  { id: 'slot-4', timeWindow: '11:00 - 12:00', maxCapacity: 15, bookedCount: 15, isAvailable: false },
  { id: 'slot-5', timeWindow: '13:00 - 14:00', maxCapacity: 15, bookedCount: 6, isAvailable: true },
  { id: 'slot-6', timeWindow: '14:00 - 15:00', maxCapacity: 15, bookedCount: 8, isAvailable: true },
  { id: 'slot-7', timeWindow: '15:00 - 16:00', maxCapacity: 15, bookedCount: 12, isAvailable: true }
];

interface MobileBookingWizardProps {
  onBookingSuccess: (booking: SyncBooking) => void;
}

const formatDate = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function MobileBookingWizard({ onBookingSuccess }: MobileBookingWizardProps) {
  const { t } = useLanguage();
  const sync = useSyncStore();
  const currentFarmer = sync.currentFarmer;

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [selectedCrop, setSelectedCrop] = useState<CropKey>(currentFarmer?.crop || 'PADDY');
  const [estimatedWeight, setEstimatedWeight] = useState<number>(currentFarmer?.quantity || 35);
  const [selectedCenterId, setSelectedCenterId] = useState<string>('center-01');
  const [selectedDate, setSelectedDate] = useState<string>(() => formatDate(new Date()));
  const [selectedSlotId, setSelectedSlotId] = useState<string>('slot-2');
  const [vehicleType, setVehicleType] = useState<VehicleTypeKey>(currentFarmer?.vehicleType || 'TRACTOR');

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync with farmer profile if changed
  useEffect(() => {
    if (currentFarmer) {
      setSelectedCrop(currentFarmer.crop);
      setEstimatedWeight(currentFarmer.quantity);
      setVehicleType(currentFarmer.vehicleType);
    }
  }, [currentFarmer]);

  const cropsList: CropKey[] = [
    'PADDY',
    'WHEAT',
    'MAIZE',
    'RED_GRAM',
    'BENGAL_GRAM',
    'GREEN_GRAM',
    'GROUNDNUT',
    'SOYBEAN'
  ];
  const vehiclesList: VehicleTypeKey[] = [
    'TRACTOR',
    'TRUCK',
    'MINI_TRUCK',
    'BULLOCK_CART',
    'LARGE_TRUCK'
  ];

  const selectedCenter = PROCUREMENT_CENTERS.find((c) => c.id === selectedCenterId) || PROCUREMENT_CENTERS[0];
  const selectedSlot = MOCK_SLOTS_DATA.find((s) => s.id === selectedSlotId) || MOCK_SLOTS_DATA[1];

  const handleQuickAddWeight = (increment: number) => {
    setEstimatedWeight((prev) => Math.max(1, prev + increment));
  };

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!estimatedWeight || estimatedWeight <= 0) {
      setErrorMessage(t.farmerRegistration.validationError);
      return;
    }
    setErrorMessage(null);
    setCurrentStep(2);
  };

  const handleStep2Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCenterId || !selectedSlotId) {
      setErrorMessage(t.farmerRegistration.validationError);
      return;
    }
    setErrorMessage(null);
    setCurrentStep(3);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);

    try {
      const newBooking = createNewBooking({
        centerId: selectedCenter.id,
        centerName: selectedCenter.name,
        date: selectedDate,
        timeSlot: selectedSlot.timeWindow,
        crop: selectedCrop,
        quantity: estimatedWeight,
        vehicleType
      });

      setSubmitting(false);
      onBookingSuccess(newBooking);
    } catch (err: any) {
      setSubmitting(false);
      setErrorMessage(t.booking.bookingError);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* 3-Step Guided Header */}
      <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-widest text-slate-500">
            {t.booking.stepIndicator} {currentStep} / 3
          </span>
          <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-800 border border-slate-300 rounded-full">
            {currentStep === 1
              ? t.booking.step1Title
              : currentStep === 2
              ? t.booking.step2Title
              : t.booking.step3Title}
          </span>
        </div>

        {/* Visual Progress Bar */}
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
        <div className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl flex items-center space-x-3 text-red-900 font-bold text-sm">
          <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STEP 1: Select Crop & Estimated Weight */}
      {currentStep === 1 && (
        <form onSubmit={handleStep1Next} className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-xs space-y-6">
            <div className="flex items-start space-x-4 border-b border-slate-100 pb-4">
              <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200 shrink-0">
                <Wheat className="w-8 h-8 text-slate-800" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  {t.booking.step1Title}
                </h2>
                <p className="text-sm font-medium text-slate-600 mt-0.5">
                  {t.booking.step1Subtitle}
                </p>
              </div>
            </div>

            {/* Crop Grid */}
            <div className="space-y-3">
              <label className="block text-base font-bold text-slate-900">
                {t.farmerRegistration.crop}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {cropsList.slice(0, 3).map((c) => {
                  const isSelected = selectedCrop === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedCrop(c)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all min-h-[56px] flex flex-col justify-between ${
                        isSelected
                          ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                          : 'bg-white border-slate-300 text-slate-800 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <Wheat className={`w-8 h-8 ${isSelected ? 'text-emerald-400' : 'text-slate-600'}`} />
                        {isSelected && <CheckCircle2 className="w-6 h-6 text-emerald-400" />}
                      </div>
                      <div className="mt-3">
                        <div className="font-bold text-lg leading-tight">{t.crops[c]}</div>
                        <div className={`text-xs font-medium mt-1 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                          {t.cropDescriptions[c]}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Remaining Crops in Compact Select Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                {cropsList.slice(3).map((c) => {
                  const isSelected = selectedCrop === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedCrop(c)}
                      className={`p-3 rounded-xl border text-center text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {t.crops[c]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Estimated Weight Input */}
            <div className="space-y-3 pt-2">
              <label className="block text-base font-bold text-slate-900">
                {t.farmerRegistration.quantity} ({t.common.quintal})
              </label>

              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={estimatedWeight}
                  onChange={(e) => setEstimatedWeight(Math.max(1, parseFloat(e.target.value) || 0))}
                  required
                  className="w-full p-4 pr-24 bg-slate-50 border-2 border-slate-300 rounded-2xl font-black text-2xl text-slate-900 focus:bg-white transition-all min-h-[56px] shadow-inner"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-600 font-black text-lg">
                  {t.common.quintal}
                </div>
              </div>

              {/* Quick Increment Buttons */}
              <div className="flex items-center space-x-2 pt-1">
                <span className="text-xs font-bold text-slate-500">{t.booking.quickAdd}</span>
                {[+5, +10, +25, +50].map((inc) => (
                  <button
                    key={inc}
                    type="button"
                    onClick={() => handleQuickAddWeight(inc)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 transition-all active:scale-95"
                  >
                    +{inc} {t.common.quintal}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-3 p-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-xl transition-all shadow-md active:scale-98 min-h-[56px]"
          >
            <span>{t.booking.nextStep}</span>
            <ArrowRight className="w-6 h-6" />
          </button>
        </form>
      )}

      {/* STEP 2: Center Selection & Available Time Slot */}
      {currentStep === 2 && (
        <form onSubmit={handleStep2Next} className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-xs space-y-6">
            <div className="flex items-start space-x-4 border-b border-slate-100 pb-4">
              <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200 shrink-0">
                <Building2 className="w-8 h-8 text-slate-800" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  {t.booking.step2Title}
                </h2>
                <p className="text-sm font-medium text-slate-600 mt-0.5">
                  {t.booking.step2Subtitle}
                </p>
              </div>
            </div>

            {/* Procurement Center Selection Cards */}
            <div className="space-y-3">
              <label className="block text-base font-bold text-slate-900">
                {t.booking.selectCenter}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PROCUREMENT_CENTERS.map((center) => {
                  const isSelected = selectedCenterId === center.id;
                  return (
                    <button
                      key={center.id}
                      type="button"
                      onClick={() => setSelectedCenterId(center.id)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all min-h-[56px] flex flex-col justify-between ${
                        isSelected
                          ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                          : 'border-slate-300 bg-white hover:border-slate-500 text-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between w-full">
                        <div>
                          <div className="font-black text-lg">{center.name}</div>
                          <div className={`text-xs mt-0.5 flex items-center space-x-1 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            <span>{center.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2.5 py-0.5 text-xs font-black rounded-full border ${
                              center.status === 'closed'
                                ? 'bg-red-100 text-red-900 border-red-300'
                                : center.status === 'busy'
                                ? 'bg-amber-100 text-amber-900 border-amber-300'
                                : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            }`}
                          >
                            {center.status === 'open'
                              ? t.centerStatus.open
                              : center.status === 'busy'
                              ? t.centerStatus.busy
                              : t.centerStatus.closed}
                          </span>
                          {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                        </div>
                      </div>

                      <div className={`mt-3 text-xs font-bold pt-2 border-t grid grid-cols-3 gap-1 text-center ${isSelected ? 'border-slate-800 text-slate-300' : 'border-slate-100 text-slate-600'}`}>
                        <div>
                          <div className="text-[10px] text-slate-400 font-bold">{t.centerDetails.currentQueue}</div>
                          <div className={`font-black ${isSelected ? 'text-emerald-400' : 'text-slate-900'}`}>{center.currentQueue} {t.centerDetails.vehiclesWaiting}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 font-bold">{t.centerDetails.estimatedWaiting}</div>
                          <div className={`font-black ${isSelected ? 'text-amber-400' : 'text-slate-900'}`}>{center.estimatedWaitMinutes} {t.centerDetails.minsWait}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 font-bold">{t.centerDetails.availableSlots}</div>
                          <div className={`font-black ${isSelected ? 'text-emerald-400' : 'text-slate-900'}`}>{center.availableSlots} {t.centerDetails.slotsOpenToday}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date Selection */}
            <div className="space-y-2 pt-2">
              <label className="block text-base font-bold text-slate-900">
                {t.booking.selectDate}
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-600 pointer-events-none" />
                <input
                  type="date"
                  value={selectedDate}
                  min={formatDate(new Date())}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full min-h-[56px] pl-14 pr-4 rounded-2xl border-2 border-slate-300 bg-white font-bold text-base text-slate-900"
                />
              </div>
            </div>

            {/* Time Slot Selection */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="block text-base font-bold text-slate-900">
                  {t.booking.selectSlot}
                </label>
                <div className="flex space-x-3 text-xs font-bold">
                  <span className="inline-flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>{t.booking.capacityBadges.available}</span>
                  </span>
                  <span className="inline-flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span>{t.booking.capacityBadges.moderate}</span>
                  </span>
                  <span className="inline-flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                    <span>{t.booking.capacityBadges.full}</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MOCK_SLOTS_DATA.map((slot) => {
                  const isSelected = selectedSlotId === slot.id;
                  const isFull = !slot.isAvailable;
                  const isModerate = slot.bookedCount >= 10 && !isFull;
                  const spotsLeft = slot.maxCapacity - slot.bookedCount;

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
                          <Clock className={`w-5 h-5 ${isSelected ? 'text-emerald-400' : 'text-slate-700'}`} />
                          <span className="font-bold text-base">{slot.timeWindow}</span>
                        </div>
                        <span
                          className={`text-xs font-black px-2 py-0.5 rounded-md ${
                            isFull
                              ? 'bg-slate-200 text-slate-700'
                              : isModerate
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-emerald-100 text-emerald-900'
                          }`}
                        >
                          {isFull
                            ? t.booking.capacityBadges.full
                            : isModerate
                            ? t.booking.capacityBadges.moderate
                            : t.booking.capacityBadges.available}
                        </span>
                      </div>

                      <div className="mt-2 text-xs font-semibold flex items-center justify-between">
                        <span className={isSelected ? 'text-emerald-300' : 'text-slate-600'}>
                          {spotsLeft} {t.booking.spotsLeft}
                        </span>
                        <span className={isSelected ? 'text-slate-300' : 'text-slate-500'}>
                          {slot.bookedCount}/{slot.maxCapacity} {t.booking.booked}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="flex-1 flex items-center justify-center space-x-2 p-4 bg-slate-100 hover:bg-slate-200 text-slate-800 border-2 border-slate-300 rounded-2xl font-bold text-base transition-all min-h-[56px]"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{t.booking.prevStep}</span>
            </button>

            <button
              type="submit"
              className="flex-2 flex items-center justify-center space-x-3 p-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-lg transition-all shadow-md active:scale-98 min-h-[56px]"
            >
              <span>{t.booking.nextStep}</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: Vehicle Type Selection & Summary */}
      {currentStep === 3 && (
        <form onSubmit={handleFinalSubmit} className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-xs space-y-6">
            <div className="flex items-start space-x-4 border-b border-slate-100 pb-4">
              <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200 shrink-0">
                <Truck className="w-8 h-8 text-slate-800" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  {t.booking.step3Title}
                </h2>
                <p className="text-sm font-medium text-slate-600 mt-0.5">
                  {t.booking.step3Subtitle}
                </p>
              </div>
            </div>

            {/* Vehicle Cards */}
            <div className="space-y-3">
              {vehiclesList.map((v) => {
                const isSelected = vehicleType === v;
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVehicleType(v)}
                    className={`w-full p-4 rounded-2xl border-2 text-left transition-all min-h-[56px] flex items-center justify-between ${
                      isSelected
                        ? 'bg-slate-900 border-slate-900 text-white shadow-md ring-2 ring-slate-400'
                        : 'bg-white border-slate-300 text-slate-800 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-3 rounded-2xl border ${
                          isSelected
                            ? 'bg-slate-800 border-slate-700 text-emerald-400'
                            : 'bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        <Truck className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="font-black text-lg leading-tight">{t.vehicles[v]}</div>
                        <div className={`text-xs font-semibold mt-0.5 ${isSelected ? 'text-emerald-300' : 'text-slate-600'}`}>
                          {t.vehicleUnloadTimes[v]}
                        </div>
                      </div>
                    </div>

                    <div>
                      {isSelected ? (
                        <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-slate-300" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Booking Summary Box - Strict Single Language */}
            <div className="p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-3 text-sm">
              <div className="font-black text-slate-900 text-base">
                {t.booking.summaryTitle}
              </div>
              <div className="grid grid-cols-2 gap-3 text-slate-800 font-medium">
                <div>
                  <span className="text-xs text-slate-500 block">{t.farmerRegistration.fullName}</span>
                  <span className="font-bold">{currentFarmer?.name || 'Farmer'}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">{t.farmerRegistration.farmerId}</span>
                  <span className="font-bold font-mono">{currentFarmer?.id || 'KS-2026-FARM-901'}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">{t.farmerRegistration.crop}</span>
                  <span className="font-bold">{t.crops[selectedCrop]}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">{t.farmerRegistration.quantity}</span>
                  <span className="font-bold">{estimatedWeight} {t.common.quintal}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">{t.digitalPass.center}</span>
                  <span className="font-bold">{selectedCenter.name}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">{t.digitalPass.timeSlot}</span>
                  <span className="font-bold">{selectedDate} ({selectedSlot.timeWindow})</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="flex-1 flex items-center justify-center space-x-2 p-4 bg-slate-100 hover:bg-slate-200 text-slate-800 border-2 border-slate-300 rounded-2xl font-bold text-base transition-all min-h-[56px]"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{t.booking.prevStep}</span>
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex-2 flex items-center justify-center space-x-3 p-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white rounded-2xl font-black text-lg sm:text-xl transition-all shadow-lg active:scale-98 min-h-[56px]"
            >
              {submitting ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Sparkles className="w-6 h-6 text-emerald-400" />
              )}
              <span>{submitting ? t.booking.submitting : t.booking.submitBooking}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
