'use client';

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  useSyncStore,
  createNewBooking,
  CropKey,
  VehicleTypeKey,
  SyncBooking
} from '../lib/syncStore';
import {
  Building2,
  MapPin,
  Users,
  Clock,
  CalendarCheck,
  Star,
  CheckCircle2,
  AlertCircle,
  Truck,
  Wheat,
  Scale,
  Sparkles,
  ChevronDown,
  LayoutGrid,
  List,
  ArrowRight,
  ShieldCheck,
  Plus,
  Minus
} from 'lucide-react';
import { VoiceDictationButton } from './VoiceAssistant/VoiceDictationButton';

export interface ProcurementCenterItem {
  id: string;
  name: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  location: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  currentQueue: number;
  estimatedWaitMinutes: number;
  availableSlots: number;
  status: 'open' | 'busy' | 'closed';
}

export const DEMO_PROCUREMENT_CENTERS: ProcurementCenterItem[] = [
  {
    id: 'center-01',
    name: {
      en: 'Mandi Procurement Center #1 (Kota Main)',
      hi: 'मंडी खरीद केंद्र #1 (कोटा मुख्य)',
      te: 'మండి సేకరణ కేంద్రం #1 (కోటా ప్రధానం)'
    },
    location: {
      en: 'Bhamashah Mandi Yard, Kota (4.2 km away)',
      hi: 'भामाशाह मंडी परिसर, कोटा (४.२ किमी दूर)',
      te: 'భామషా మండి యార్డ్, కోటా (4.2 కి.మీ దూరం)'
    },
    currentQueue: 12,
    estimatedWaitMinutes: 45,
    availableSlots: 8,
    status: 'open'
  },
  {
    id: 'center-02',
    name: {
      en: 'Mandi Procurement Center #2 (Karnal Grain Hub)',
      hi: 'मंडी खरीद केंद्र #2 (करनाल अनाज केंद्र)',
      te: 'మండి సేకరణ కేంద్రం #2 (కర్నాల్ ధాన్య కేంద్రం)'
    },
    location: {
      en: 'GT Road Grain Market, Karnal (7.5 km away)',
      hi: 'जीटी रोड अनाज मंडी, करनाल (७.५ किमी दूर)',
      te: 'జి.టి. రోడ్ ధాన్య మార్కెట్, కర్నాల్ (7.5 కి.మీ దూరం)'
    },
    currentQueue: 24,
    estimatedWaitMinutes: 80,
    availableSlots: 3,
    status: 'busy'
  },
  {
    id: 'center-03',
    name: {
      en: 'Mandi Procurement Center #3 (Bhopal Sub-Center)',
      hi: 'मंडी खरीद केंद्र #3 (भोपाल उप-केंद्र)',
      te: 'మండి సేకరణ కేంద్రం #3 (భోపాల్ ఉప-కేంద్రం)'
    },
    location: {
      en: 'Karond Bypass Yard, Bhopal (11.0 km away)',
      hi: 'करोंद बायपास यार्ड, भोपाल (११.० किमी दूर)',
      te: 'కరోండ్ బైపాస్ యార్డ్, భోపాల్ (11.0 కి.మీ దూరం)'
    },
    currentQueue: 6,
    estimatedWaitMinutes: 20,
    availableSlots: 14,
    status: 'open'
  },
  {
    id: 'center-04',
    name: {
      en: 'Mandi Procurement Center #4 (Indore Yard B)',
      hi: 'मंडी खरीद केंद्र #4 (इंदौर यार्ड बी)',
      te: 'మండి సేకరణ కేంద్రం #4 (ఇండోర్ యార్డ్ బి)'
    },
    location: {
      en: 'Choithram Mandi Road, Indore (18.3 km away)',
      hi: 'चोइथराम मंडी मार्ग, इंदौर (१८.३ किमी दूर)',
      te: 'చోయిత్‌రామ్ మండి రోడ్, ఇండోర్ (18.3 కి.మీ దూరం)'
    },
    currentQueue: 0,
    estimatedWaitMinutes: 0,
    availableSlots: 0,
    status: 'closed'
  }
];

// The 8 specific crops requested in Feature 3
export const SPECIFIED_CROPS: { key: CropKey; isDemoStar?: boolean }[] = [
  { key: 'PADDY', isDemoStar: true },
  { key: 'WHEAT' },
  { key: 'MAIZE' },
  { key: 'RED_GRAM' },
  { key: 'BENGAL_GRAM' },
  { key: 'GREEN_GRAM' },
  { key: 'GROUNDNUT' },
  { key: 'SOYBEAN' }
];

// Vehicle options requested in Feature 4
export const VEHICLE_OPTIONS: VehicleTypeKey[] = [
  'TRACTOR',
  'TRUCK',
  'MINI_TRUCK',
  'BULLOCK_CART',
  'LARGE_TRUCK'
];

interface ProcurementBookingFormProps {
  onBookingSuccess?: (booking: SyncBooking) => void;
}

export function ProcurementBookingForm({ onBookingSuccess }: ProcurementBookingFormProps) {
  const { t, language } = useLanguage();
  const sync = useSyncStore();
  const currentFarmer = sync.currentFarmer;

  // Feature 2 State: Procurement Center Selection
  const [selectedCenterId, setSelectedCenterId] = useState<string>('center-01');
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');

  // Feature 3 State: Crop Selection (Paddy set as default demo star item)
  const [selectedCrop, setSelectedCrop] = useState<CropKey>('PADDY');

  // Dynamic Capacity Slot State
  const [selectedSlot, setSelectedSlot] = useState<string>('10:00 AM');
  const [selectedDate, setSelectedDate] = useState<string>('08 Sept 2026');

  // Feature 4 State: Quantity & Vehicle Details (Numeric field defaulted to 35 quintals)
  const [quantity, setQuantity] = useState<number>(35);
  const [vehicleType, setVehicleType] = useState<VehicleTypeKey>('TRACTOR');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const CAPACITY_SLOTS = [
    { time: '09:00 AM', status: 'available', spots: 12, label: 'Available' },
    { time: '10:00 AM', status: 'available', spots: 8, label: 'Available' },
    { time: '11:00 AM', status: 'limited', spots: 2, label: 'Limited' },
    { time: '12:00 PM', status: 'full', spots: 0, label: 'Full' },
    { time: '02:00 PM', status: 'available', spots: 10, label: 'Available' }
  ] as const;

  const activeCenter =
    DEMO_PROCUREMENT_CENTERS.find((c) => c.id === selectedCenterId) ||
    DEMO_PROCUREMENT_CENTERS[0];

  const getLocalizedText = (dict: { en: string; hi: string; [key: string]: string }) => {
    return dict[language] || dict.hi || dict.en;
  };

  const handleQuantityAdjust = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(500, prev + delta)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNotice(null);

    if (activeCenter.status === 'closed') {
      setErrorNotice(
        language === 'te'
          ? 'ఈ సేకరణ కేంద్రం ప్రస్తుతం మూసివేయబడింది. దయచేసి తెరిచి ఉన్న కేంద్రాన్ని ఎంచుకోండి.'
          : language === 'hi'
          ? 'यह खरीद केंद्र वर्तमान में बंद है। कृपया खुला या व्यस्त केंद्र चुनें।'
          : 'This procurement center is currently closed. Please select an open center.'
      );
      return;
    }

    if (!quantity || quantity <= 0) {
      setErrorNotice(
        language === 'te'
          ? 'దయచేసి సరైన పంట పరిమాణాన్ని క్వింటాళ్ళలో నమోదు చేయండి.'
          : language === 'hi'
          ? 'कृपया मान्य फसल मात्रा दर्ज करें।'
          : 'Please specify a valid crop quantity in quintals.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const localizedCenterName = getLocalizedText(activeCenter.name);

      const booking = createNewBooking({
        centerId: activeCenter.id,
        centerName: localizedCenterName,
        date: selectedDate,
        timeSlot: selectedSlot,
        crop: selectedCrop,
        quantity: Number(quantity),
        vehicleType
      });

      setIsSubmitting(false);
      if (onBookingSuccess) {
        onBookingSuccess(booking);
      }
    } catch (err) {
      setIsSubmitting(false);
      setErrorNotice(t.booking.bookingError);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Component Header / Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-300 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-full text-xs font-black uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>{t.brandName} • {t.farmerRegistration.verified}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {t.farmerIntake.centerTitle}
            </h1>
            <p className="text-sm font-semibold text-slate-600">
              {t.farmerIntake.centerSubtitle}
            </p>
          </div>

          {/* Farmer Identity Tag */}
          <div className="bg-slate-100 border border-slate-300 rounded-2xl p-3.5 text-left sm:text-right shrink-0">
            <span className="text-[11px] font-bold text-slate-500 uppercase block">
              {t.farmerRegistration.farmerId}
            </span>
            <span className="font-mono font-black text-slate-900 text-base">
              {currentFarmer?.id || 'KS-2026-FARM-901'}
            </span>
            <span className="text-xs font-bold text-slate-700 block mt-0.5">
              {currentFarmer?.name || 'Ramesh Kumar'} ({currentFarmer?.village || 'Ranpur'})
            </span>
          </div>
        </div>
      </div>

      {/* Error Notice */}
      {errorNotice && (
        <div className="p-4 bg-red-50 border-2 border-red-300 rounded-2xl flex items-center space-x-3 text-red-900 font-bold text-sm">
          <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
          <span>{errorNotice}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ==================================================================== */}
        {/* FEATURE 2: SELECT PROCUREMENT CENTER                                */}
        {/* ==================================================================== */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-300 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-100 pb-4">
            <div className="flex items-center space-x-3.5">
              <div className="p-3 bg-emerald-700 text-white rounded-2xl shadow-sm">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {t.farmerIntake.centerTitle}
                </h2>
                <p className="text-xs sm:text-sm font-medium text-slate-600">
                  {t.farmerIntake.centerSubtitle}
                </p>
              </div>
            </div>

            {/* Toggle view: Cards vs List */}
            <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-300 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] ${
                  viewMode === 'cards'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                aria-label="Cards format"
              >
                <LayoutGrid className="w-4 h-4" />
                <span>Cards</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] ${
                  viewMode === 'list'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                aria-label="List format"
              >
                <List className="w-4 h-4" />
                <span>List</span>
              </button>
            </div>
          </div>

          {/* Center Cards / List View */}
          <div
            className={
              viewMode === 'cards'
                ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
                : 'flex flex-col space-y-3'
            }
          >
            {DEMO_PROCUREMENT_CENTERS.map((center) => {
              const isSelected = selectedCenterId === center.id;
              const isClosed = center.status === 'closed';
              const isBusy = center.status === 'busy';

              // Dynamic Status Badge Color & Text
              const statusBadgeStyles = isClosed
                ? 'bg-red-100 text-red-900 border-red-300'
                : isBusy
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-emerald-100 text-emerald-900 border-emerald-300';

              const statusLabel =
                center.status === 'open'
                  ? t.centerStatus.open
                  : center.status === 'busy'
                  ? t.centerStatus.busy
                  : t.centerStatus.closed;

              return (
                <div
                  key={center.id}
                  onClick={() => {
                    if (!isClosed) setSelectedCenterId(center.id);
                  }}
                  className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer select-none ${
                    isClosed
                      ? 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed'
                      : isSelected
                      ? 'bg-slate-900 border-slate-900 text-white shadow-lg ring-2 ring-emerald-500'
                      : 'bg-white border-slate-300 text-slate-800 hover:border-slate-500 hover:shadow-md'
                  }`}
                >
                  {/* Top Row: Center Name & Dynamic Status Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-lg font-black leading-snug ${
                            isSelected ? 'text-white' : 'text-slate-900'
                          }`}
                        >
                          {getLocalizedText(center.name)}
                        </span>
                      </div>
                      {/* Location with Distance */}
                      <div
                        className={`flex items-center space-x-1.5 text-xs font-semibold ${
                          isSelected ? 'text-slate-300' : 'text-slate-600'
                        }`}
                      >
                        <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{getLocalizedText(center.location)}</span>
                      </div>
                    </div>

                    {/* Dynamic Status Badge ("Open", "Busy", "Closed") */}
                    <div className="shrink-0 flex items-center space-x-2">
                      <span
                        className={`px-3 py-1 text-xs font-black rounded-full border shadow-2xs uppercase tracking-wide inline-flex items-center space-x-1 ${statusBadgeStyles}`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isClosed
                              ? 'bg-red-600'
                              : isBusy
                              ? 'bg-amber-600'
                              : 'bg-emerald-600'
                          }`}
                        />
                        <span>{statusLabel}</span>
                      </span>
                    </div>
                  </div>

                  {/* Center Metrics Row: Queue, Estimated Wait Time, Available Slots */}
                  <div className="mt-4 pt-3 border-t border-slate-200/40 grid grid-cols-3 gap-2 text-center">
                    {/* 1. Current Queue */}
                    <div
                      className={`p-2 rounded-xl border ${
                        isSelected
                          ? 'bg-slate-800/80 border-slate-700 text-slate-200'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-1 text-[11px] font-bold text-slate-400">
                        <Users className="w-3.5 h-3.5" />
                        <span>{t.centerDetails.currentQueue}</span>
                      </div>
                      <div
                        className={`text-sm font-black mt-0.5 ${
                          isSelected ? 'text-emerald-400' : 'text-slate-900'
                        }`}
                      >
                        {center.currentQueue} {t.centerDetails.vehiclesWaiting}
                      </div>
                    </div>

                    {/* 2. Estimated Waiting Time */}
                    <div
                      className={`p-2 rounded-xl border ${
                        isSelected
                          ? 'bg-slate-800/80 border-slate-700 text-slate-200'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-1 text-[11px] font-bold text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{t.centerDetails.estimatedWaiting}</span>
                      </div>
                      <div
                        className={`text-sm font-black mt-0.5 ${
                          isSelected ? 'text-amber-400' : 'text-slate-900'
                        }`}
                      >
                        {center.estimatedWaitMinutes} {t.centerDetails.minsWait}
                      </div>
                    </div>

                    {/* 3. Available Slots */}
                    <div
                      className={`p-2 rounded-xl border ${
                        isSelected
                          ? 'bg-slate-800/80 border-slate-700 text-slate-200'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-1 text-[11px] font-bold text-slate-400">
                        <CalendarCheck className="w-3.5 h-3.5" />
                        <span>{t.centerDetails.availableSlots}</span>
                      </div>
                      <div
                        className={`text-sm font-black mt-0.5 ${
                          isSelected ? 'text-emerald-400' : 'text-slate-900'
                        }`}
                      >
                        {center.availableSlots} {t.centerDetails.slotsOpenToday}
                      </div>
                    </div>
                  </div>

                  {/* Selection Checkmark Button */}
                  <div className="mt-3 flex items-center justify-between">
                    <button
                      type="button"
                      disabled={isClosed}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isClosed) setSelectedCenterId(center.id);
                      }}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-2 min-h-[44px] ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
                          : isClosed
                          ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-slate-950" />
                          <span>{t.centerDetails.selected}</span>
                        </>
                      ) : isClosed ? (
                        <span>{t.centerStatus.closed}</span>
                      ) : (
                        <span>{t.centerDetails.selectCenter}</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dynamic Slot Manager (Capacity limits: Available, Limited, Full) */}
          <div className="mt-6 pt-6 border-t-2 border-slate-100 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="block text-sm sm:text-base font-black text-slate-900">
                {t.booking.selectSlot} ({selectedDate})
              </label>
              <div className="flex items-center space-x-3 text-xs font-bold text-slate-600">
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>{t.booking.capacityBadges.available}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>{t.booking.capacityBadges.moderate}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span>{t.booking.capacityBadges.full}</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {CAPACITY_SLOTS.map((slot) => {
                const isSelected = selectedSlot === slot.time;
                const isFull = slot.status === 'full';
                const isLimited = slot.status === 'limited';

                return (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={isFull}
                    onClick={() => setSelectedSlot(slot.time)}
                    className={`p-3 rounded-2xl border-2 text-left transition-all min-h-[56px] flex flex-col justify-between ${
                      isFull
                        ? 'bg-slate-100 border-slate-200 opacity-50 cursor-not-allowed text-slate-400'
                        : isSelected
                        ? 'bg-slate-900 border-slate-900 text-white shadow-md ring-2 ring-emerald-400'
                        : 'bg-white border-slate-300 text-slate-800 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-black text-sm">{slot.time}</span>
                      <span
                        className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                          isFull
                            ? 'bg-red-100 text-red-800'
                            : isLimited
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-emerald-100 text-emerald-900'
                        }`}
                      >
                        {isFull
                          ? t.booking.capacityBadges.full
                          : isLimited
                          ? t.booking.capacityBadges.moderate
                          : t.booking.capacityBadges.available}
                      </span>
                    </div>
                    <div
                      className={`text-[11px] font-bold mt-1 ${
                        isSelected ? 'text-emerald-300' : 'text-slate-500'
                      }`}
                    >
                      {slot.spots} {t.booking.spotsLeft}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* FEATURE 3: CROP SELECTION                                           */}
        {/* ==================================================================== */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-300 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-100 pb-4">
            <div className="flex items-center space-x-3.5">
              <div className="p-3 bg-amber-600 text-white rounded-2xl shadow-sm">
                <Wheat className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {t.farmerIntake.cropTitle}
                </h2>
                <p className="text-xs sm:text-sm font-medium text-slate-600">
                  {t.farmerIntake.cropSubtitle}
                </p>
              </div>
            </div>

            {/* Quick Dropdown Alternative for Mobile Accessibility */}
            <div className="relative min-w-[200px]">
              <label htmlFor="crop-select-dropdown" className="sr-only">
                {t.farmerIntake.cropTitle}
              </label>
              <select
                id="crop-select-dropdown"
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value as CropKey)}
                className="w-full p-3 bg-slate-100 border-2 border-slate-300 rounded-xl font-bold text-sm text-slate-900 focus:outline-none focus:border-slate-800 transition-all min-h-[48px] appearance-none pr-9 cursor-pointer"
              >
                {SPECIFIED_CROPS.map((crop) => (
                  <option key={crop.key} value={crop.key}>
                    {t.crops[crop.key]} {crop.isDemoStar ? `(${t.farmerIntake.demoStar})` : ''}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Visual Grid Selector for 8 Specific Crops */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {SPECIFIED_CROPS.map((crop) => {
              const isSelected = selectedCrop === crop.key;
              const isStarDemo = crop.isDemoStar;

              return (
                <button
                  key={crop.key}
                  type="button"
                  onClick={() => setSelectedCrop(crop.key)}
                  className={`relative p-4 rounded-2xl border-2 text-left transition-all min-h-[96px] flex flex-col justify-between group active:scale-97 ${
                    isSelected
                      ? 'bg-slate-900 border-slate-900 text-white shadow-md ring-2 ring-emerald-400'
                      : 'bg-white border-slate-300 text-slate-800 hover:border-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {/* Demo Star Badge for Paddy */}
                  {isStarDemo && (
                    <div className="absolute -top-2.5 right-3 px-2 py-0.5 bg-amber-400 text-slate-950 rounded-md font-black text-[10px] flex items-center space-x-1 shadow-xs uppercase tracking-wider">
                      <Star className="w-3 h-3 fill-slate-950 text-slate-950" />
                      <span>{t.farmerIntake.demoStar}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between w-full">
                    <div
                      className={`p-2 rounded-xl ${
                        isSelected
                          ? 'bg-slate-800 text-emerald-400'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <Wheat className="w-6 h-6" />
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                    )}
                  </div>

                  <div className="mt-2.5">
                    <div className="font-black text-base leading-tight">
                      {t.crops[crop.key]}
                    </div>
                    <div
                      className={`text-[11px] font-medium mt-0.5 truncate ${
                        isSelected ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {t.cropDescriptions[crop.key]}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ==================================================================== */}
        {/* FEATURE 4: QUANTITY & VEHICLE DETAILS                               */}
        {/* ==================================================================== */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-300 shadow-md space-y-6">
          <div className="flex items-center space-x-3.5 border-b-2 border-slate-100 pb-4">
            <div className="p-3 bg-blue-700 text-white rounded-2xl shadow-sm">
              <Scale className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {t.farmerIntake.detailsTitle}
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-600">
                {t.farmerIntake.detailsSubtitle}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Crop Field (Displays Selected Crop) */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-900">
                {t.farmerIntake.selectedCropLabel}
              </label>
              <div className="flex items-center space-x-3 p-4 bg-slate-100 border-2 border-slate-300 rounded-2xl min-h-[56px]">
                <div className="p-2 bg-emerald-600 text-white rounded-xl">
                  <Wheat className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-black text-slate-900">
                    {t.crops[selectedCrop]}
                  </div>
                  <div className="text-xs font-semibold text-emerald-800">
                    {selectedCrop === 'PADDY'
                      ? t.farmerIntake.demoStar
                      : t.cropDescriptions[selectedCrop]}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Quantity Input (Defaulted to demo value 35 quintals) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="quantity-input"
                  className="block text-sm font-bold text-slate-900"
                >
                  {t.farmerIntake.quantityLabel}
                </label>
                <div className="flex items-center space-x-2">
                  <VoiceDictationButton
                    onDictated={(text) => {
                      const num = text.match(/\d+/);
                      if (num) {
                        setQuantity(Math.max(1, Math.min(500, parseInt(num[0], 10))));
                      }
                    }}
                    fieldLabel={t.farmerIntake.quantityLabel}
                  />
                  <span className="text-xs font-black text-emerald-800">
                    {quantity} {t.common.quintal}
                  </span>
                </div>
              </div>

              <div className="relative">
                <input
                  id="quantity-input"
                  type="number"
                  min="1"
                  max="500"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseFloat(e.target.value) || 0))}
                  className="w-full p-4 pr-24 bg-white border-2 border-slate-300 rounded-2xl font-black text-2xl text-slate-900 focus:outline-none focus:border-slate-900 min-h-[56px] shadow-inner"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-600 font-black text-sm">
                  {t.common.quintal}
                </div>
              </div>

              {/* Large Touch Adjustment Buttons for Mobile Farmers */}
              <div className="flex items-center space-x-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => handleQuantityAdjust(-5)}
                  className="flex-1 py-2 px-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-center space-x-1 min-h-[44px] active:scale-95"
                >
                  <Minus className="w-3.5 h-3.5" />
                  <span>5</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuantityAdjust(5)}
                  className="flex-1 py-2 px-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-center space-x-1 min-h-[44px] active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>5</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuantityAdjust(10)}
                  className="flex-1 py-2 px-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-center space-x-1 min-h-[44px] active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>10</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuantityAdjust(25)}
                  className="flex-1 py-2 px-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-center space-x-1 min-h-[44px] active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>25</span>
                </button>
              </div>
            </div>

            {/* 3. Vehicle Selection Dropdown */}
            <div className="space-y-2">
              <label
                htmlFor="vehicle-select"
                className="block text-sm font-bold text-slate-900"
              >
                {t.farmerIntake.vehicleLabel}
              </label>

              <div className="relative">
                <Truck className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  id="vehicle-select"
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value as VehicleTypeKey)}
                  className="w-full pl-12 pr-10 p-4 bg-white border-2 border-slate-300 rounded-2xl font-bold text-base text-slate-900 focus:outline-none focus:border-slate-900 transition-all min-h-[56px] appearance-none cursor-pointer"
                >
                  {VEHICLE_OPTIONS.map((v) => (
                    <option key={v} value={v}>
                      {t.vehicles[v]} • {t.vehicleUnloadTimes[v]}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-5 h-5 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 flex items-center space-x-2">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {t.vehicles[vehicleType]}: {t.vehicleUnloadTimes[vehicleType]}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* SUMMARY & SUBMISSION BUTTON                                         */}
        {/* ==================================================================== */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border-2 border-slate-700 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700 pb-5">
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-emerald-400">
                {t.booking.summaryTitle}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                {getLocalizedText(activeCenter.name)}
              </h3>
            </div>

            <div className="flex items-center space-x-3 text-xs sm:text-sm font-bold text-slate-300">
              <span className="px-3 py-1 bg-slate-800 rounded-lg border border-slate-700">
                {t.crops[selectedCrop]}
              </span>
              <span>•</span>
              <span className="px-3 py-1 bg-slate-800 rounded-lg border border-slate-700">
                {quantity} {t.common.quintal}
              </span>
              <span>•</span>
              <span className="px-3 py-1 bg-slate-800 rounded-lg border border-slate-700">
                {t.vehicles[vehicleType]}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs font-medium text-slate-300 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t.farmerIntake.bookingNotice}</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || activeCenter.status === 'closed'}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white rounded-2xl font-black text-base sm:text-lg transition-all shadow-lg active:scale-98 min-h-[56px] flex items-center justify-center space-x-3"
            >
              <span>{t.farmerIntake.confirmBookingBtn}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
