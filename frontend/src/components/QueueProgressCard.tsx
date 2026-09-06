'use client';

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  useSyncStore,
  SyncBooking,
  getStageNumber,
  SIH_8_STAGES,
  advanceBookingStage,
  BookingStatus
} from '../lib/syncStore';
import {
  CalendarCheck,
  ShieldCheck,
  Droplets,
  Scale,
  FileCheck2,
  DollarSign,
  ArrowDownCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
  QrCode,
  Users,
  Sparkles,
  ArrowRight,
  Printer
} from 'lucide-react';
import { DigitalReceiptModal } from './DigitalReceiptModal';
import { useVoiceAssistant } from '../context/VoiceAssistantContext';
import { PlayAudioButton } from './VoiceAssistant/PlayAudioButton';

interface QueueProgressCardProps {
  initialStage?: number;
  bookingId?: string;
}

export function QueueProgressCard({ bookingId }: QueueProgressCardProps) {
  const { t, language } = useLanguage();
  const sync = useSyncStore();
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const activeBooking: SyncBooking | null =
    sync.bookings.find((b) => b.id === bookingId) || sync.activeBooking || sync.bookings[0];

  const currentStageNumber = getStageNumber(activeBooking?.status);

  // Active queue list
  const activeQueueList = sync.bookings.filter(
    (b) => b.status !== 'DIGITAL_RECEIPT' && b.status !== 'COMPLETED'
  );

  const myIndex = activeBooking
    ? activeQueueList.findIndex((b) => b.id === activeBooking.id)
    : 0;
  const queuePosition = myIndex >= 0 ? myIndex + 1 : 1;
  const vehiclesAhead = Math.max(0, queuePosition - 1);
  const estimatedWaitMin = vehiclesAhead * 12 + (currentStageNumber <= 2 ? 15 : 5);

  const { activeHighlightKey } = useVoiceAssistant();
  const isHighlighted = activeHighlightKey === 'queue-tracker-card';

  const queueSpokenText = activeBooking
    ? language === 'te'
      ? `లైవ్ క్యూ స్థితి: మీ టోకెన్ సంఖ్య ${activeBooking.tokenNumber}. మీ స్థానం #${currentStageNumber >= 8 ? 'పూర్తయింది' : queuePosition}. మీ ముందు ${vehiclesAhead} వాహనాలు ఉన్నాయి. అంచనా ప్రతీక్షా సమయం ${currentStageNumber >= 8 ? '0' : estimatedWaitMin} నిమిషాలు. కేటాయించిన లేన్ ${activeBooking.lane || 'లేన్ 1'}.`
      : language === 'hi'
      ? `लाइव कतार स्थिति: आपका टोकन नंबर ${activeBooking.tokenNumber} है। कतार में आपका स्थान #${currentStageNumber >= 8 ? 'पूर्ण' : queuePosition} है। आपके आगे ${vehiclesAhead} वाहन हैं। अनुमानित प्रतीक्षा समय ${currentStageNumber >= 8 ? '0' : estimatedWaitMin} मिनट है। आवंटित लेन ${activeBooking.lane || 'लेन 1'} है।`
      : `Live Queue Status: Your token is ${activeBooking.tokenNumber}. You are at position #${currentStageNumber >= 8 ? 'Done' : queuePosition} in line with ${vehiclesAhead} vehicles ahead. Estimated wait time is ${currentStageNumber >= 8 ? '0' : estimatedWaitMin} minutes in ${activeBooking.lane || 'Lane 1'}.`
    : t.voiceAssistant.cmdCheckQueue;

  const stageIcons = [
    CalendarCheck,
    ShieldCheck,
    Droplets,
    Scale,
    ArrowDownCircle,
    Scale,
    DollarSign,
    FileCheck2
  ];

  const handleAdvanceStage = () => {
    if (activeBooking) {
      advanceBookingStage(activeBooking.id);
    }
  };

  const handleSelectStage = (stageKey: BookingStatus) => {
    if (activeBooking) {
      advanceBookingStage(activeBooking.id, stageKey);
    }
  };

  const traffic = sync.trafficControls;

  const isCompleted = currentStageNumber >= 8;

  // Localized helper strings
  const localizedActiveBadge =
    language === 'te' ? 'క్రియాశీలం' : language === 'hi' ? 'सक्रिय' : 'Active';
  const localizedDoneBadge =
    language === 'te' ? 'పూర్తయింది' : language === 'hi' ? 'पूर्ण' : 'Done';
  const localizedPendingBadge =
    language === 'te' ? 'వేచి ఉంది' : language === 'hi' ? 'ఆగామి' : 'Pending';
  const localizedNextStageBtn =
    language === 'te' ? 'తదుపరి దశకు వెళ్లండి' : language === 'hi' ? 'अगला चरण बढ़ाएं' : 'Advance Next Stage';
  const localizedQueueTableTitle =
    language === 'te' ? 'మండి యార్డ్ క్రియాశీల క్యూ జాబితా' : language === 'hi' ? 'मंडी यार्ड सक्रिय कतार सूची' : 'Active Mandi Yard Queue List';
  const localizedVehiclesInLine =
    language === 'te' ? 'వాహనాలు వేచి ఉన్నాయి' : language === 'hi' ? 'वाहन कतार में' : 'Vehicles in Line';
  const localizedPosHeader =
    language === 'te' ? 'క్యూ' : language === 'hi' ? 'कतार' : 'Pos';
  const localizedCurrentStageHeader =
    language === 'te' ? 'ప్రస్తుత దశ' : language === 'hi' ? 'वर्तमान चरण' : 'Current Stage';
  const localizedYou =
    language === 'te' ? 'మీరు' : language === 'hi' ? 'आप' : 'You';
  const localizedCompletedStatus =
    language === 'te' ? 'ప్రక్రియ పూర్తయింది' : language === 'hi' ? 'प्रक्रिया संपन्न' : 'Completed';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Real-Time Traffic Alert Banners if toggled by Admin */}
      {traffic.breakdown && (
        <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-3xl flex items-start space-x-3 text-amber-950 animate-fadeIn">
          <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-black">
              {t.notifications.notifBreakdownTitle}
            </h4>
            <p className="font-medium mt-0.5">
              {t.notifications.notifBreakdownMsg} ({traffic.activeRerouteGate})
            </p>
          </div>
        </div>
      )}

      {traffic.emergencyLane && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-3xl flex items-start space-x-3 text-emerald-950 animate-fadeIn">
          <Flame className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-black">
              {t.notifications.notifEmergencyTitle}
            </h4>
            <p className="font-medium mt-0.5">
              {t.notifications.notifEmergencyMsg}
            </p>
          </div>
        </div>
      )}

      {/* Main Queue Dashboard Card */}
      <div className={`bg-white rounded-3xl border-2 shadow-md p-6 sm:p-8 space-y-6 transition-all duration-300 ${
          isHighlighted
            ? 'ring-4 ring-emerald-500 shadow-2xl scale-[1.01] border-emerald-500 bg-emerald-50/20'
            : 'border-slate-300'
        }`}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-emerald-700">
              {t.brandName} • {activeBooking?.centerName || 'Mandi'}
            </div>
            <h2 className="text-2xl font-black text-slate-900 leading-tight mt-0.5">
              {t.queueTracker.title}
            </h2>
            <p className="text-sm font-medium text-slate-600 mt-1">
              {t.queueTracker.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start">
            <PlayAudioButton
              textToSpeak={queueSpokenText}
              highlightKey="queue-tracker-card"
            />

            {activeBooking && (
              <div className="flex items-center space-x-3 p-3.5 bg-slate-900 text-white rounded-2xl border border-slate-700 shadow-sm">
                <QrCode className="w-6 h-6 text-emerald-400" />
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block leading-none uppercase">
                    {t.digitalPass.tokenNumber}
                  </span>
                  <span className="text-xl font-black font-mono leading-tight text-white">
                    {activeBooking.tokenNumber}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Real-Time Live Queue Numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Position */}
          <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-center sm:text-left space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              {t.queueTracker.yourPosition}
            </span>
            <div className="text-3xl font-black text-slate-900">
              #{currentStageNumber >= 8 ? '-' : queuePosition}
            </div>
            <p className="text-xs font-semibold text-slate-600">
              {currentStageNumber >= 8
                ? localizedCompletedStatus
                : `${vehiclesAhead} ${t.queueTracker.vehiclesAhead}`}
            </p>
          </div>

          {/* Wait Time */}
          <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-center sm:text-left space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              {t.queueTracker.estimatedWaitTime}
            </span>
            <div className="text-3xl font-black text-emerald-800">
              {currentStageNumber >= 8 ? '0' : estimatedWaitMin}{' '}
              <span className="text-base font-bold text-slate-600">
                {t.queueTracker.minutes}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-600 flex items-center justify-center sm:justify-start space-x-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{activeBooking?.timeSlot || '10:00 AM'}</span>
            </p>
          </div>

          {/* Assigned Lane / Vehicle */}
          <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-center sm:text-left space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              {t.queueTracker.assignedLane}
            </span>
            <div className="text-2xl font-black text-slate-900 truncate">
              {activeBooking?.lane || 'Weighbridge Lane 1'}
            </div>
            <p className="text-xs font-semibold text-slate-600">
              {activeBooking?.vehicleType ? t.vehicles[activeBooking.vehicleType] : 'Tractor'}
            </p>
          </div>
        </div>

        {/* PROMINENT DIGITAL RECEIPT ACCESS COMPONENT NEAR LIVE QUEUE TRACKER */}
        <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 text-white rounded-3xl p-5 sm:p-6 border-2 border-emerald-500/40 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4 text-center sm:text-left">
            <div className="p-3 bg-emerald-500/20 border border-emerald-400/30 rounded-2xl text-emerald-400 shrink-0">
              <FileCheck2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                  {t.digitalReceipt.govtSeal}
                </span>
                {isCompleted && (
                  <span className="px-2 py-0.5 bg-emerald-500 text-slate-950 font-black text-[10px] rounded uppercase">
                    {localizedDoneBadge}
                  </span>
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-black tracking-tight mt-0.5">
                {t.digitalReceipt.title}
              </h3>
              <p className="text-xs text-slate-300 font-medium">
                {isCompleted
                  ? t.digitalReceipt.dbtStatus
                  : t.digitalReceipt.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsReceiptOpen(true)}
              className={`w-full sm:w-auto px-5 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 transition-all shadow-md active:scale-98 min-h-[48px] ${
                isCompleted
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 ring-2 ring-emerald-300'
                  : 'bg-emerald-800 hover:bg-emerald-700 text-white border border-emerald-500/50'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>{isCompleted ? t.digitalReceipt.viewReceipt : t.digitalReceipt.previewReceipt}</span>
            </button>
          </div>
        </div>

        {/* 8-Stage Visual Tracker */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="text-base font-black text-slate-900">
              {t.queueTracker.currentStage} ({currentStageNumber}/8)
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleAdvanceStage}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 shadow-xs min-h-[44px]"
              >
                <span>{localizedNextStageBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 8-Stage Progress Bar & Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SIH_8_STAGES.map((stage, idx) => {
              const IconComp = stageIcons[idx] || CheckCircle2;
              const isPast = stage.stageNumber < currentStageNumber;
              const isCurrent = stage.stageNumber === currentStageNumber;
              const localizedTitle = (t.stages8 as any)[stage.translationKey] || stage.key;

              return (
                <button
                  key={stage.key}
                  type="button"
                  onClick={() => handleSelectStage(stage.key)}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all min-h-[90px] flex flex-col justify-between cursor-pointer ${
                    isCurrent
                      ? 'bg-slate-900 border-slate-900 text-white shadow-lg ring-2 ring-emerald-400'
                      : isPast
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950 hover:border-emerald-400'
                      : 'bg-slate-50 border-slate-200 text-slate-600 opacity-60 hover:opacity-90'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div
                      className={`p-2 rounded-xl ${
                        isCurrent
                          ? 'bg-slate-800 text-emerald-400'
                          : isPast
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-white text-slate-400 border border-slate-200'
                      }`}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>

                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase ${
                        isCurrent
                          ? 'bg-emerald-400 text-slate-950 font-black'
                          : isPast
                          ? 'bg-emerald-200 text-emerald-900'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isCurrent
                        ? localizedActiveBadge
                        : isPast
                        ? localizedDoneBadge
                        : localizedPendingBadge}
                    </span>
                  </div>

                  <div className="mt-2">
                    <div className="font-black text-xs leading-tight">
                      {localizedTitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Real-time Active Queue List Table */}
        <div className="mt-6 pt-6 border-t-2 border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm font-black text-slate-900">
              <Users className="w-4 h-4 text-emerald-700" />
              <span>{localizedQueueTableTitle}</span>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {activeQueueList.length} {localizedVehiclesInLine}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">{localizedPosHeader}</th>
                  <th className="py-2.5 px-3">{t.digitalPass.tokenNumber}</th>
                  <th className="py-2.5 px-3">{t.farmerRegistration.fullName}</th>
                  <th className="py-2.5 px-3">{t.digitalPass.crop}</th>
                  <th className="py-2.5 px-3">{t.farmerRegistration.vehicle}</th>
                  <th className="py-2.5 px-3">{localizedCurrentStageHeader}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {activeQueueList.map((item, index) => {
                  const isMe = item.id === activeBooking?.id;
                  const itemStageNum = getStageNumber(item.status);
                  const itemStageMeta = SIH_8_STAGES[itemStageNum - 1] || SIH_8_STAGES[0];
                  const itemStageTitle = (t.stages8 as any)[itemStageMeta.translationKey] || item.status;

                  return (
                    <tr
                      key={item.id}
                      className={isMe ? 'bg-emerald-50/80 font-bold' : 'hover:bg-slate-50'}
                    >
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        #{index + 1}
                      </td>
                      <td className="py-3 px-3 font-mono font-black text-slate-900">
                        {item.tokenNumber} {isMe && <span className="text-[10px] text-emerald-700 font-bold ml-1">({localizedYou})</span>}
                      </td>
                      <td className="py-3 px-3 text-slate-800">{item.farmerName}</td>
                      <td className="py-3 px-3 text-slate-700">
                        {t.crops[item.crop]} ({item.quantity} {t.common.quintal})
                      </td>
                      <td className="py-3 px-3 text-slate-700">
                        {t.vehicles[item.vehicleType]}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase inline-block ${
                            itemStageNum >= 7
                              ? 'bg-emerald-100 text-emerald-900'
                              : itemStageNum >= 3
                              ? 'bg-purple-100 text-purple-900'
                              : 'bg-blue-100 text-blue-900'
                          }`}
                        >
                          {itemStageTitle}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Digital Receipt Modal Popup */}
      {activeBooking && (
        <DigitalReceiptModal
          isOpen={isReceiptOpen}
          onClose={() => setIsReceiptOpen(false)}
          booking={activeBooking}
        />
      )}
    </div>
  );
}
