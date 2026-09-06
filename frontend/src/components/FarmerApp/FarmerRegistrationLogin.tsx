'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  useSyncStore,
  setFarmerProfile,
  FarmerProfile,
  CropKey,
  VehicleTypeKey
} from '../../lib/syncStore';
import {
  UserRound,
  ShieldCheck,
  CheckCircle2,
  Phone,
  MapPin,
  Wheat,
  Scale,
  Truck,
  RotateCcw,
  Sparkles,
  AlertCircle,
  KeyRound,
  Check
} from 'lucide-react';

const PRESET_VILLAGES = [
  'Ranpur',
  'Nilokheri',
  'Berasia',
  'Sultanpur',
  'Pipariya',
  'Ramgarh',
  'Fatehpur'
];

const PROTOTYPE_PROFILES: FarmerProfile[] = [
  {
    id: 'KS-2026-A023',
    name: 'Ramesh',
    mobile: '9876543210',
    village: 'Ranpur',
    crop: 'PADDY',
    quantity: 35,
    vehicleType: 'TRACTOR',
    verified: true
  },
  {
    id: 'KS-2026-B104',
    name: 'Balwinder Singh',
    mobile: '9812345678',
    village: 'Nilokheri',
    crop: 'PADDY',
    quantity: 80,
    vehicleType: 'LARGE_TRUCK',
    verified: true
  },
  {
    id: 'KS-2026-C209',
    name: 'Suresh Patel',
    mobile: '9755523456',
    village: 'Berasia',
    crop: 'PULSES',
    quantity: 25,
    vehicleType: 'BULLOCK_CART',
    verified: true
  },
  {
    id: 'KS-2026-D312',
    name: 'Devendra Meena',
    mobile: '9829012345',
    village: 'Sultanpur',
    crop: 'MUSTARD',
    quantity: 50,
    vehicleType: 'MINI_TRUCK',
    verified: true
  }
];

interface Props {
  onSuccess?: () => void;
}

export function FarmerRegistrationLogin({ onSuccess }: Props) {
  const { t } = useLanguage();
  const sync = useSyncStore();
  const current = sync.currentFarmer;

  const [name, setName] = useState(current?.name || 'Ramesh');
  const [farmerId, setFarmerId] = useState(current?.id || 'KS-2026-A023');
  const [mobile, setMobile] = useState(current?.mobile || '9876543210');
  const [village, setVillage] = useState(current?.village || 'Ranpur');
  const [customVillage, setCustomVillage] = useState('');
  const [isCustomVillage, setIsCustomVillage] = useState(false);
  const [crop, setCrop] = useState<CropKey>(current?.crop || 'PADDY');
  const [quantity, setQuantity] = useState<number>(current?.quantity || 35);
  const [vehicleType, setVehicleType] = useState<VehicleTypeKey>(current?.vehicleType || 'TRACTOR');

  // OTP Modal State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isVerified, setIsVerified] = useState(current?.verified ?? true);
  const [validationError, setValidationError] = useState('');

  const generateNewId = () => {
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const letter = letters[Math.floor(Math.random() * letters.length)];
    const num = String(Math.floor(1 + Math.random() * 999)).padStart(3, '0');
    const newId = `KS-2026-${letter}${num}`;
    setFarmerId(newId);
  };

  const selectPrototypeProfile = (profile: FarmerProfile) => {
    setName(profile.name);
    setFarmerId(profile.id);
    setMobile(profile.mobile);
    setVillage(profile.village);
    setIsCustomVillage(false);
    setCrop(profile.crop);
    setQuantity(profile.quantity);
    setVehicleType(profile.vehicleType);
    setIsVerified(true);
    setFarmerProfile(profile);
  };

  const handleSendOtp = () => {
    setValidationError('');
    if (!name.trim()) {
      setValidationError(t.farmerRegistration.validationError);
      return;
    }
    if (!/^\d{10}$/.test(mobile)) {
      setValidationError(t.farmerRegistration.validationError);
      return;
    }
    setEnteredOtp('123456'); // Pre-fill prototype testing OTP
    setShowOtpModal(true);
    setOtpError('');
  };

  const handleVerifyOtp = () => {
    if (enteredOtp.trim() === '123456') {
      setIsVerified(true);
      setShowOtpModal(false);
      saveProfile(true);
    } else {
      setOtpError(t.farmerRegistration.otpHint);
    }
  };

  const saveProfile = (verifiedStatus = isVerified) => {
    const activeVillage = isCustomVillage && customVillage.trim() ? customVillage.trim() : village;
    const profile: FarmerProfile = {
      id: farmerId,
      name: name.trim(),
      mobile: mobile.trim(),
      village: activeVillage,
      crop,
      quantity: Number(quantity) || 10,
      vehicleType,
      verified: verifiedStatus
    };
    setFarmerProfile(profile);
    if (onSuccess) onSuccess();
  };

  const cropsList: CropKey[] = ['WHEAT', 'PADDY', 'MUSTARD', 'COTTON', 'MAIZE', 'SOYABEAN', 'PULSES'];
  const vehiclesList: VehicleTypeKey[] = ['TRACTOR', 'BULLOCK_CART', 'MINI_TRUCK', 'LARGE_TRUCK'];

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-start space-x-3.5">
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 shrink-0">
            <UserRound className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 leading-tight">
              {t.farmerRegistration.title}
            </h2>
            <p className="text-sm font-medium text-slate-600 mt-1">
              {t.farmerRegistration.subtitle}
            </p>
          </div>
        </div>

        {isVerified && (
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-black self-start">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>{t.farmerRegistration.verified}</span>
          </div>
        )}
      </div>

      {/* Preset Prototype Profiles for Instant Hackathon Testing */}
      <div className="space-y-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>{t.farmerRegistration.demoProfilesTitle}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PROTOTYPE_PROFILES.map((p) => {
            const isSelected = farmerId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => selectPrototypeProfile(p)}
                className={`px-3 py-2 rounded-xl text-left text-xs font-bold transition-all border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                }`}
              >
                <div className="truncate">{p.name}</div>
                <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-emerald-300' : 'text-slate-500'}`}>
                  {p.id}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Error Banner */}
      {validationError && (
        <div className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl flex items-center space-x-3 text-red-900 text-sm font-bold">
          <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Registration & Login Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Full Name */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-900">
            {t.farmerRegistration.fullName}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setIsVerified(false);
            }}
            placeholder={t.farmerRegistration.fullNamePlaceholder}
            className="w-full p-3.5 bg-white border-2 border-slate-300 rounded-2xl font-bold text-base text-slate-900 focus:outline-none focus:border-slate-800 transition-all min-h-[52px]"
          />
        </div>

        {/* Farmer ID (Prototype Mock) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-bold text-slate-900">
              {t.farmerRegistration.farmerId}
            </label>
            <button
              type="button"
              onClick={generateNewId}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.farmerRegistration.regenerateId}</span>
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={farmerId}
              readOnly
              className="w-full p-3.5 bg-slate-100 border-2 border-slate-300 rounded-2xl font-mono font-bold text-base text-slate-800 min-h-[52px]"
            />
          </div>
        </div>

        {/* Mobile Number & OTP Verification */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-900">
            {t.farmerRegistration.mobile}
          </label>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="tel"
                maxLength={10}
                value={mobile}
                onChange={(e) => {
                  setMobile(e.target.value.replace(/\D/g, '').slice(0, 10));
                  setIsVerified(false);
                }}
                placeholder={t.farmerRegistration.mobilePlaceholder}
                className="w-full pl-11 pr-3.5 py-3.5 bg-white border-2 border-slate-300 rounded-2xl font-bold text-base text-slate-900 focus:outline-none focus:border-slate-800 transition-all min-h-[52px]"
              />
            </div>
            <button
              type="button"
              onClick={handleSendOtp}
              className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap min-h-[52px] active:scale-95 transition-all shadow-sm"
            >
              {isVerified ? t.farmerRegistration.verified : t.farmerRegistration.requestOtp}
            </button>
          </div>
        </div>

        {/* Village Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-900">
            {t.farmerRegistration.village}
          </label>
          <div className="relative">
            <MapPin className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={isCustomVillage ? 'OTHER' : village}
              onChange={(e) => {
                if (e.target.value === 'OTHER') {
                  setIsCustomVillage(true);
                } else {
                  setIsCustomVillage(false);
                  setVillage(e.target.value);
                }
              }}
              className="w-full pl-11 pr-4 py-3.5 bg-white border-2 border-slate-300 rounded-2xl font-bold text-base text-slate-900 focus:outline-none focus:border-slate-800 transition-all min-h-[52px] appearance-none"
            >
              {PRESET_VILLAGES.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
              <option value="OTHER">{t.farmerRegistration.customVillage}</option>
            </select>
          </div>
          {isCustomVillage && (
            <input
              type="text"
              value={customVillage}
              onChange={(e) => setCustomVillage(e.target.value)}
              placeholder={t.farmerRegistration.customVillage}
              className="w-full p-3 bg-white border-2 border-slate-300 rounded-xl text-sm font-bold text-slate-900 mt-2"
            />
          )}
        </div>
      </div>

      {/* Primary Crop Grid */}
      <div className="space-y-3 pt-2">
        <label className="block text-base font-bold text-slate-900">
          {t.farmerRegistration.crop}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {cropsList.map((c) => {
            const isSelected = crop === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCrop(c)}
                className={`p-3 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center min-h-[88px] ${
                  isSelected
                    ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                    : 'bg-white border-slate-300 text-slate-800 hover:border-slate-500'
                }`}
              >
                <Wheat className={`w-6 h-6 mb-1.5 ${isSelected ? 'text-emerald-400' : 'text-slate-600'}`} />
                <div className="text-xs font-black leading-snug">{t.crops[c]}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantity & Vehicle Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
        {/* Quantity (Quintals) */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-900">
            {t.farmerRegistration.quantity} ({t.common.quintal})
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="1"
              max="500"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseFloat(e.target.value) || 0))}
              className="w-full p-3.5 bg-white border-2 border-slate-300 rounded-2xl font-black text-xl text-slate-900 focus:outline-none focus:border-slate-800 min-h-[52px]"
            />
            <div className="flex space-x-1">
              {[+5, +10, +25].map((inc) => (
                <button
                  key={inc}
                  type="button"
                  onClick={() => setQuantity((prev) => prev + inc)}
                  className="px-2.5 py-3 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 min-h-[52px]"
                >
                  +{inc}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Vehicle Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-900">
            {t.farmerRegistration.vehicle}
          </label>
          <div className="relative">
            <Truck className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value as VehicleTypeKey)}
              className="w-full pl-11 pr-4 py-3.5 bg-white border-2 border-slate-300 rounded-2xl font-bold text-base text-slate-900 focus:outline-none focus:border-slate-800 transition-all min-h-[52px] appearance-none"
            >
              {vehiclesList.map((v) => (
                <option key={v} value={v}>
                  {t.vehicles[v]} • {t.vehicleUnloadTimes[v]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Continue Action */}
      <div className="pt-3">
        <button
          type="button"
          onClick={() => saveProfile()}
          className="w-full flex items-center justify-center space-x-3 p-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-lg sm:text-xl transition-all shadow-md active:scale-98 min-h-[56px]"
        >
          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          <span>{t.farmerRegistration.continueBooking}</span>
        </button>
      </div>

      {/* Mock OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white max-w-sm w-full rounded-3xl p-6 border-2 border-slate-300 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
                <KeyRound className="w-6 h-6 text-emerald-800" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {t.farmerRegistration.verifyOtp}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {mobile}
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 text-center">
              {t.farmerRegistration.otpHint}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                {t.farmerRegistration.otpLabel}
              </label>
              <input
                type="text"
                maxLength={6}
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full p-3 bg-white border-2 border-slate-300 rounded-xl font-mono font-bold text-xl text-center text-slate-900 tracking-widest focus:outline-none focus:border-slate-800"
              />
              {otpError && (
                <p className="text-xs font-bold text-red-600">{otpError}</p>
              )}
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-sm"
              >
                {t.common.close}
              </button>
              <button
                type="button"
                onClick={handleVerifyOtp}
                className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm flex items-center justify-center space-x-1.5"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{t.farmerRegistration.verifyOtp}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
