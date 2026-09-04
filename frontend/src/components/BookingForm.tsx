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
  Building2,
  Calendar,
  Clock,
  Truck,
  Wheat,
  Scale,
  CheckCircle,
  AlertCircle,
  Users,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface BookingFormProps {
  onBookingSuccess: (data: BookingResponseData) => void;
}

export function BookingForm({ onBookingSuccess }: BookingFormProps) {
  const { t } = useLanguage();

  const [centers, setCenters] = useState<ProcurementCenter[]>([]);
  const [farmers, setFarmers] = useState<FarmerItem[]>([]);
  const [selectedCenterId, setSelectedCenterId] = useState<string>('');
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [slots, setSlots] = useState<SlotItem[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [vehicleType, setVehicleType] = useState<string>('TRACTOR');
  const [cropType, setCropType] = useState<string>('गेहूं (Wheat)');
  const [estimatedWeight, setEstimatedWeight] = useState<string>('45.0');

  const [loadingCenters, setLoadingCenters] = useState<boolean>(true);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load initial centers and mock farmers
  useEffect(() => {
    async function init() {
      try {
        setLoadingCenters(true);
        const [cList, fList] = await Promise.all([fetchCenters(), fetchFarmers()]);
        setCenters(cList);
        setFarmers(fList);
        if (cList.length > 0) {
          setSelectedCenterId(cList[0].id);
        }
        if (fList.length > 0) {
          setSelectedFarmerId(fList[0].id);
        }
      } catch (err: any) {
        setErrorMessage('Failed to load procurement centers');
      } finally {
        setLoadingCenters(false);
      }
    }
    init();
  }, []);

  // Load slots when center or date changes
  useEffect(() => {
    if (!selectedCenterId || !selectedDate) return;

    async function loadSlots() {
      try {
        setLoadingSlots(true);
        setSelectedSlotId('');
        const slotList = await fetchAvailableSlots(selectedCenterId, selectedDate);
        setSlots(slotList);
        // Pre-select first available slot
        const firstAvail = slotList.find((s) => s.isAvailable);
        if (firstAvail) {
          setSelectedSlotId(firstAvail.id);
        }
      } catch (err: any) {
        console.error('Error fetching slots:', err);
      } finally {
        setLoadingSlots(false);
      }
    }

    loadSlots();
  }, [selectedCenterId, selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedSlotId) {
      setErrorMessage(t.booking.selectSlot + ' is required');
      return;
    }

    const weightNum = parseFloat(estimatedWeight);
    if (isNaN(weightNum) || weightNum <= 0) {
      setErrorMessage('Please enter a valid positive crop weight');
      return;
    }

    try {
      setSubmitting(true);
      const res = await createBookingApi({
        farmerId: selectedFarmerId,
        slotId: selectedSlotId,
        vehicleType,
        cropType,
        estimatedWeight: weightNum
      });
      onBookingSuccess(res);
    } catch (err: any) {
      setErrorMessage(err.message || t.booking.bookingError);
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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-xs">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200 shrink-0">
            {/* Prominent Lucide Icon: 32px */}
            <Wheat className="w-8 h-8 text-emerald-800" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {t.booking.title}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 mt-1 font-medium">
              {t.booking.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-5 bg-red-50 border-2 border-red-200 rounded-2xl flex items-center space-x-4">
          <AlertCircle className="w-8 h-8 text-red-700 shrink-0" />
          <p className="text-red-900 font-bold text-base sm:text-lg">{errorMessage}</p>
        </div>
      )}

      {/* Main Booking Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Center & Farmer Selection */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
            <Building2 className="w-8 h-8 text-slate-700" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {t.booking.step1}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Center Selector */}
            <div>
              <label className="block text-base font-bold text-slate-800 mb-2">
                {t.booking.selectCenter}
              </label>
              <select
                value={selectedCenterId}
                onChange={(e) => setSelectedCenterId(e.target.value)}
                disabled={loadingCenters}
                className="w-full p-4 bg-slate-50 border-2 border-slate-300 rounded-2xl font-semibold text-slate-900 focus:bg-white transition-all touch-target-large"
              >
                {loadingCenters ? (
                  <option>Loading centers...</option>
                ) : (
                  centers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))
                )}
              </select>

              {selectedCenterObj && (
                <div className="mt-2 text-sm text-slate-600 flex items-center space-x-2">
                  <span className="font-semibold">वे-ब्रिज (Weighbridges): {selectedCenterObj.weighbridgeCount}</span>
                  <span>•</span>
                  <span>क्षमता (Hourly Capacity): {selectedCenterObj.hourlyCapacity}/घंटे</span>
                </div>
              )}
            </div>

            {/* Farmer Profile Selector */}
            <div>
              <label className="block text-base font-bold text-slate-800 mb-2">
                {t.booking.selectFarmer}
              </label>
              <select
                value={selectedFarmerId}
                onChange={(e) => setSelectedFarmerId(e.target.value)}
                className="w-full p-4 bg-slate-50 border-2 border-slate-300 rounded-2xl font-semibold text-slate-900 focus:bg-white transition-all touch-target-large"
              >
                {farmers.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.locationVillage}) - {f.landSize} Acres
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-slate-500 font-medium">
                आधार सत्यापित खाता (Auto-linked with PM-KISAN / State Mandi Portal)
              </p>
            </div>
          </div>

          {/* Date Selector Pills */}
          <div>
            <label className="block text-base font-bold text-slate-800 mb-3">
              {t.booking.selectDate}
            </label>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                className={`flex items-center space-x-3 px-6 py-3.5 rounded-2xl font-bold text-lg border-2 transition-all touch-target-large ${
                  selectedDate === new Date().toISOString().split('T')[0]
                    ? 'bg-slate-900 border-slate-900 text-white'
                    : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                }`}
              >
                <Calendar className="w-6 h-6" />
                <span>{t.booking.today} ({new Date().toISOString().split('T')[0]})</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedDate(getTomorrowDate())}
                className={`flex items-center space-x-3 px-6 py-3.5 rounded-2xl font-bold text-lg border-2 transition-all touch-target-large ${
                  selectedDate === getTomorrowDate()
                    ? 'bg-slate-900 border-slate-900 text-white'
                    : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                }`}
              >
                <Calendar className="w-6 h-6" />
                <span>{t.booking.tomorrow} ({getTomorrowDate()})</span>
              </button>
            </div>
          </div>
        </section>

        {/* Step 2: Slot Selection with Capacity checks */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8 text-slate-700" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                {t.booking.step2}
              </h2>
            </div>
            <span className="text-sm font-semibold text-slate-500">
              {slots.length} स्लॉट उपलब्ध
            </span>
          </div>

          {loadingSlots ? (
            <div className="p-8 text-center text-slate-600 font-semibold text-lg animate-pulse">
              {t.booking.slotsLoading}
            </div>
          ) : slots.length === 0 ? (
            <div className="p-8 text-center text-slate-600 font-medium text-base bg-slate-50 rounded-2xl border border-slate-200">
              {t.booking.noSlots}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              {slots.map((slot) => {
                const isSelected = selectedSlotId === slot.id;
                const isFull = !slot.isAvailable;

                return (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={isFull}
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={`p-5 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                        : isFull
                        ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed opacity-75'
                        : 'border-slate-300 bg-white hover:border-slate-500 text-slate-900'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className={`w-6 h-6 ${isSelected ? 'text-emerald-400' : 'text-slate-600'}`} />
                        <span className="text-xl font-bold">{slot.timeWindow}</span>
                      </div>
                      {isSelected && (
                        <CheckCircle className="w-6 h-6 text-emerald-400" />
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/40 flex items-center justify-between text-sm font-medium">
                      <span>
                        {isFull ? (
                          <span className="text-red-500 font-bold">{t.booking.capacityFull}</span>
                        ) : (
                          <span className={isSelected ? 'text-emerald-300 font-bold' : 'text-emerald-800 font-bold'}>
                            {slot.remainingCapacity} {t.booking.capacityAvailable}
                          </span>
                        )}
                      </span>
                      <span className={isSelected ? 'text-slate-300' : 'text-slate-500'}>
                        {slot.bookedCount}/{slot.maxCapacity} Booked
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isFull
                            ? 'bg-red-500'
                            : slot.utilizationPercentage > 75
                            ? 'bg-amber-500'
                            : 'bg-emerald-700'
                        }`}
                        style={{ width: `${Math.min(100, slot.utilizationPercentage)}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* Step 3: Vehicle & Crop Details */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
            <Truck className="w-8 h-8 text-slate-700" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {t.booking.step3}
            </h2>
          </div>

          {/* Vehicle Selector (Accessible large cards) */}
          <div>
            <label className="block text-base font-bold text-slate-800 mb-3">
              {t.booking.vehicleType}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { type: 'TRACTOR', label: t.booking.vehicleTractor },
                { type: 'BULLOCK_CART', label: t.booking.vehicleBullockCart },
                { type: 'TRUCK', label: t.booking.vehicleTruck }
              ].map((v) => (
                <button
                  key={v.type}
                  type="button"
                  onClick={() => setVehicleType(v.type)}
                  className={`p-4 rounded-2xl border-2 font-bold text-base flex flex-col items-center justify-center space-y-2 transition-all touch-target-large ${
                    vehicleType === v.type
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-300 bg-slate-50 text-slate-800 hover:border-slate-400'
                  }`}
                >
                  <Truck className={`w-8 h-8 ${vehicleType === v.type ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span>{v.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Crop Type */}
            <div>
              <label className="block text-base font-bold text-slate-800 mb-2">
                {t.booking.cropType}
              </label>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full p-4 bg-slate-50 border-2 border-slate-300 rounded-2xl font-semibold text-slate-900 focus:bg-white transition-all touch-target-large"
              >
                <option value="गेहूं (Wheat)">{t.booking.cropWheat}</option>
                <option value="धान (Paddy)">{t.booking.cropPaddy}</option>
                <option value="सरसों (Mustard)">{t.booking.cropMustard}</option>
                <option value="चना (Gram)">{t.booking.cropGram}</option>
              </select>
            </div>

            {/* Estimated Weight */}
            <div>
              <label className="block text-base font-bold text-slate-800 mb-2">
                {t.booking.estimatedWeight}
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  value={estimatedWeight}
                  onChange={(e) => setEstimatedWeight(e.target.value)}
                  required
                  className="w-full p-4 pr-24 bg-slate-50 border-2 border-slate-300 rounded-2xl font-bold text-slate-900 focus:bg-white transition-all touch-target-large"
                  placeholder="e.g. 45"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500 font-bold">
                  {t.booking.weightUnit}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Submit Booking Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={submitting || !selectedSlotId}
            className="w-full flex items-center justify-center space-x-4 p-5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white rounded-3xl font-bold text-xl sm:text-2xl transition-all shadow-md active:scale-98 touch-target-large"
          >
            {/* Prominent Lucide Icon: 32px */}
            <Sparkles className="w-8 h-8 text-emerald-400" aria-hidden="true" />
            <span>{submitting ? t.booking.submitting : t.booking.submitBooking}</span>
          </button>
          <p className="text-center text-sm font-medium text-slate-600 mt-3">
            सुरक्षित एवं अपरिवर्तनीय 256-बिट डिजिटल टोकन तुरंत जारी किया जाएगा।
          </p>
        </div>
      </form>
    </div>
  );
}
