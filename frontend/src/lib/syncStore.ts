'use client';

import { useState, useEffect } from 'react';

export type UserRole = 'farmer' | 'admin';

export type VehicleTypeKey = 'TRACTOR' | 'TRUCK' | 'MINI_TRUCK' | 'BULLOCK_CART' | 'LARGE_TRUCK';

export type CropKey =
  | 'PADDY'
  | 'WHEAT'
  | 'MAIZE'
  | 'RED_GRAM'
  | 'BENGAL_GRAM'
  | 'GREEN_GRAM'
  | 'GROUNDNUT'
  | 'SOYBEAN'
  | 'SOYABEAN'
  | 'MUSTARD'
  | 'COTTON'
  | 'PULSES';

export type BookingStatus =
  | 'SLOT_BOOKED'
  | 'GATE_CHECKIN'
  | 'QUALITY_TESTING'
  | 'GROSS_WEIGHING'
  | 'UNLOADING'
  | 'TARE_WEIGHING'
  | 'PROCUREMENT'
  | 'DIGITAL_RECEIPT'
  | 'BOOKED'
  | 'STAGING'
  | 'MANDI_GATE'
  | 'INSPECTION'
  | 'COMPLETED';

export interface FarmerProfile {
  id: string;
  name: string;
  mobile: string;
  village: string;
  crop: CropKey;
  quantity: number;
  vehicleType: VehicleTypeKey;
  verified: boolean;
}

export interface SyncBooking {
  id: string;
  tokenNumber: string;
  tokenHash: string;
  farmerId: string;
  farmerName: string;
  farmerMobile: string;
  village: string;
  centerId: string;
  centerName: string;
  date: string;
  timeSlot: string;
  crop: CropKey;
  quantity: number;
  vehicleType: VehicleTypeKey;
  status: BookingStatus;
  priority: 'normal' | 'emergency';
  lane?: string;
  queuePosition?: number;
  createdAt: string;
  qualityInspection?: {
    dockageGrade: 'A' | 'B' | 'C';
    moistureLevel: number;
    foreignMatter: number;
    grossWeight: number;
    tareWeight: number;
    netWeight: number;
    mspRate: number;
    moisturePenalty: number;
    totalPayout: number;
    inspectorId: string;
    verifiedAt: string;
  };
}

export interface InAppNotification {
  id: string;
  timestamp: string;
  titleKey: string;
  titleFallback: string;
  messageKey: string;
  messageFallback: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  read: boolean;
  tokenNumber?: string;
}

export interface AdminTrafficControls {
  breakdown: boolean;
  emergencyLane: boolean;
  reroute: boolean;
  activeRerouteGate: string;
  message?: string;
}

export interface GlobalSyncState {
  activeRole: UserRole;
  currentFarmer: FarmerProfile | null;
  activeBooking: SyncBooking | null;
  bookings: SyncBooking[];
  trafficControls: AdminTrafficControls;
  notifications: InAppNotification[];
}

const STORAGE_KEY = 'kisan_setu_v3_sync_state';
const CHANNEL_NAME = 'kisan_setu_sync_channel';

export const SIH_8_STAGES: { key: BookingStatus; stageNumber: number; translationKey: string }[] = [
  { key: 'SLOT_BOOKED', stageNumber: 1, translationKey: 'slotBooked' },
  { key: 'GATE_CHECKIN', stageNumber: 2, translationKey: 'gateCheckin' },
  { key: 'QUALITY_TESTING', stageNumber: 3, translationKey: 'qualityTesting' },
  { key: 'GROSS_WEIGHING', stageNumber: 4, translationKey: 'grossWeighing' },
  { key: 'UNLOADING', stageNumber: 5, translationKey: 'unloading' },
  { key: 'TARE_WEIGHING', stageNumber: 6, translationKey: 'tareWeighing' },
  { key: 'PROCUREMENT', stageNumber: 7, translationKey: 'procurement' },
  { key: 'DIGITAL_RECEIPT', stageNumber: 8, translationKey: 'digitalReceipt' }
];

export function getStageNumber(status?: BookingStatus | string): number {
  switch (status) {
    case 'SLOT_BOOKED':
    case 'BOOKED':
      return 1;
    case 'GATE_CHECKIN':
    case 'MANDI_GATE':
      return 2;
    case 'QUALITY_TESTING':
    case 'INSPECTION':
      return 3;
    case 'GROSS_WEIGHING':
      return 4;
    case 'UNLOADING':
    case 'STAGING':
      return 5;
    case 'TARE_WEIGHING':
      return 6;
    case 'PROCUREMENT':
      return 7;
    case 'DIGITAL_RECEIPT':
    case 'COMPLETED':
      return 8;
    default:
      return 1;
  }
}

// Default initial mock bookings with SIH A023 specification
const INITIAL_BOOKINGS: SyncBooking[] = [
  {
    id: 'KS-BK-A023',
    tokenNumber: 'A023',
    tokenHash: '5A7E298B10C34DF98A00B74239ED3C19F218902B73479AF02BC8912E4A9CA023',
    farmerId: 'KS-2026-A023',
    farmerName: 'Ramesh',
    farmerMobile: '9876543210',
    village: 'Ranpur',
    centerId: 'center-01',
    centerName: 'Mandi Procurement Center #1 (Kota Main)',
    date: '08 Sept 2026',
    timeSlot: '10:00 AM',
    crop: 'PADDY',
    quantity: 35,
    vehicleType: 'TRACTOR',
    status: 'SLOT_BOOKED',
    priority: 'normal',
    lane: 'Lane 1',
    queuePosition: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: 'KS-BK-101',
    tokenNumber: 'TK-8421',
    tokenHash: '5A7E298B10C34DF98A00B74239ED3C19F218902B73479AF02BC8912E4A9C1032',
    farmerId: 'KS-2026-FARM-901',
    farmerName: 'Ramesh Kumar',
    farmerMobile: '9876543210',
    village: 'Ranpur',
    centerId: 'center-01',
    centerName: 'Kota Mandi',
    date: '08 Sept 2026',
    timeSlot: '09:00 - 10:00',
    crop: 'PADDY',
    quantity: 35,
    vehicleType: 'TRACTOR',
    status: 'GATE_CHECKIN',
    priority: 'normal',
    lane: 'Lane 1',
    queuePosition: 2,
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString()
  },
  {
    id: 'KS-BK-102',
    tokenNumber: 'TK-8422',
    tokenHash: 'B82C10F98934EBA10984E290BA55E1C389AFB1238910ABDE542890C12389A120',
    farmerId: 'KS-2026-FARM-902',
    farmerName: 'Balwinder Singh',
    farmerMobile: '9812345678',
    village: 'Nilokheri',
    centerId: 'center-01',
    centerName: 'Kota Mandi',
    date: '08 Sept 2026',
    timeSlot: '10:00 - 11:00',
    crop: 'PADDY',
    quantity: 80,
    vehicleType: 'LARGE_TRUCK',
    status: 'QUALITY_TESTING',
    priority: 'normal',
    queuePosition: 3,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: 'KS-BK-103',
    tokenNumber: 'TK-8423',
    tokenHash: 'E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855',
    farmerId: 'KS-2026-FARM-903',
    farmerName: 'Suresh Patel',
    farmerMobile: '9755523456',
    village: 'Berasia',
    centerId: 'center-01',
    centerName: 'Kota Mandi',
    date: '08 Sept 2026',
    timeSlot: '09:00 - 10:00',
    crop: 'PULSES',
    quantity: 25,
    vehicleType: 'BULLOCK_CART',
    status: 'GROSS_WEIGHING',
    priority: 'normal',
    queuePosition: 4,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  },
  {
    id: 'KS-BK-104',
    tokenNumber: 'TK-8420',
    tokenHash: 'F128A948C721098BAFE34901C9823489ABCF341908234890ABFE8923489012AB',
    farmerId: 'KS-2026-FARM-904',
    farmerName: 'Devendra Meena',
    farmerMobile: '9829012345',
    village: 'Sultanpur',
    centerId: 'center-01',
    centerName: 'Kota Mandi',
    date: '08 Sept 2026',
    timeSlot: '08:00 - 09:00',
    crop: 'MUSTARD',
    quantity: 50,
    vehicleType: 'MINI_TRUCK',
    status: 'DIGITAL_RECEIPT',
    priority: 'normal',
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    qualityInspection: {
      dockageGrade: 'A',
      moistureLevel: 10.5,
      foreignMatter: 1.2,
      grossWeight: 5200,
      tareWeight: 1200,
      netWeight: 4000,
      mspRate: 5650,
      moisturePenalty: 0,
      totalPayout: 226000,
      inspectorId: 'OFFICER-01',
      verifiedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString()
    }
  }
];

const DEFAULT_STATE: GlobalSyncState = {
  activeRole: 'farmer',
  currentFarmer: {
    id: 'KS-2026-A023',
    name: 'Ramesh',
    mobile: '9876543210',
    village: 'Ranpur',
    crop: 'PADDY',
    quantity: 35,
    vehicleType: 'TRACTOR',
    verified: true
  },
  activeBooking: INITIAL_BOOKINGS[0],
  bookings: INITIAL_BOOKINGS,
  trafficControls: {
    breakdown: false,
    emergencyLane: false,
    reroute: false,
    activeRerouteGate: 'Gate 2'
  },
  notifications: [
    {
      id: 'notif-1',
      timestamp: new Date().toISOString(),
      titleKey: 'notifBookingTitle',
      titleFallback: 'Slot Booked Successfully',
      messageKey: 'notifBookingMsg',
      messageFallback: 'Token A023 confirmed for 08 Sept 2026 (10:00 AM). Digital pass is ready.',
      type: 'success',
      read: false,
      tokenNumber: 'A023'
    }
  ]
};

// Singleton in-memory state for client session
let memoryState: GlobalSyncState = { ...DEFAULT_STATE };
let isInitialized = false;
const listeners = new Set<(state: GlobalSyncState) => void>();
let broadcastChannel: BroadcastChannel | null = null;

function notifyListeners() {
  listeners.forEach((listener) => listener(memoryState));
}

export function getSyncState(): GlobalSyncState {
  if (!isInitialized && typeof window !== 'undefined') {
    initSyncStore();
  }
  return memoryState;
}

export function initSyncStore() {
  if (isInitialized || typeof window === 'undefined') return;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      memoryState = {
        ...DEFAULT_STATE,
        ...parsed,
        bookings: parsed.bookings && parsed.bookings.length > 0 ? parsed.bookings : INITIAL_BOOKINGS
      };
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STATE));
      memoryState = { ...DEFAULT_STATE };
    }
  } catch (e) {
    memoryState = { ...DEFAULT_STATE };
  }

  // Cross-tab BroadcastChannel
  if ('BroadcastChannel' in window) {
    try {
      broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
      broadcastChannel.onmessage = (event) => {
        if (event.data && typeof event.data === 'object') {
          memoryState = { ...memoryState, ...event.data };
          notifyListeners();
        }
      };
    } catch (e) {
      console.warn('BroadcastChannel not supported', e);
    }
  }

  // Fallback storage event listener across tabs
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY && event.newValue) {
      try {
        const parsed = JSON.parse(event.newValue);
        memoryState = { ...memoryState, ...parsed };
        notifyListeners();
      } catch (e) {}
    }
  });

  isInitialized = true;
}

function persistAndBroadcast(partial: Partial<GlobalSyncState>) {
  memoryState = { ...memoryState, ...partial };
  notifyListeners();

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryState));
    } catch (e) {}

    if (broadcastChannel) {
      try {
        broadcastChannel.postMessage(partial);
      } catch (e) {}
    }
  }
}

// Store Actions

export function setActiveRole(role: UserRole) {
  persistAndBroadcast({ activeRole: role });
}

export function setFarmerProfile(profile: FarmerProfile) {
  persistAndBroadcast({ currentFarmer: profile });
}

export function createNewBooking(data: {
  centerId: string;
  centerName: string;
  date: string;
  timeSlot: string;
  crop: CropKey;
  quantity: number;
  vehicleType: VehicleTypeKey;
}): SyncBooking {
  const current = memoryState.currentFarmer || {
    id: `KS-2026-FARM-${Math.floor(1000 + Math.random() * 9000)}`,
    name: 'Farmer',
    mobile: '9876543210',
    village: 'Mandi Area',
    crop: data.crop,
    quantity: data.quantity,
    vehicleType: data.vehicleType,
    verified: true
  };

  const tokenNum = current.id.includes('-') && current.id.split('-').length >= 3
    ? current.id.split('-')[2]
    : 'A023';
  const hashSource = `${current.id}|${data.centerId}|${data.date}|${data.timeSlot}|${tokenNum}|${Date.now()}`;
  
  let hash = '';
  for (let i = 0; i < 64; i++) {
    const code = ((hashSource.charCodeAt(i % hashSource.length) * 31 + i * 17) % 16);
    hash += code.toString(16).toUpperCase();
  }

  const activeInQueue = memoryState.bookings.filter(
    (b) => b.status === 'SLOT_BOOKED' || b.status === 'GATE_CHECKIN' || b.status === 'BOOKED'
  ).length;

  const newBooking: SyncBooking = {
    id: `KS-BK-${Date.now()}`,
    tokenNumber: tokenNum,
    tokenHash: hash,
    farmerId: current.id,
    farmerName: current.name,
    farmerMobile: current.mobile,
    village: current.village,
    centerId: data.centerId,
    centerName: data.centerName,
    date: data.date,
    timeSlot: data.timeSlot,
    crop: data.crop,
    quantity: data.quantity,
    vehicleType: data.vehicleType,
    status: 'SLOT_BOOKED',
    priority: 'normal',
    queuePosition: activeInQueue + 1,
    createdAt: new Date().toISOString()
  };

  const newBookings = [newBooking, ...memoryState.bookings];
  const newNotifs: InAppNotification[] = [
    {
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      titleKey: 'notifBookingTitle',
      titleFallback: 'Slot Booked Successfully',
      messageKey: 'notifBookingMsg',
      messageFallback: `Token ${tokenNum} confirmed for ${data.date} (${data.timeSlot}). Pass is ready.`,
      type: 'success',
      read: false,
      tokenNumber: tokenNum
    },
    ...memoryState.notifications
  ];

  persistAndBroadcast({
    activeBooking: newBooking,
    bookings: newBookings,
    notifications: newNotifs
  });

  return newBooking;
}

export function verifyAndCheckInAtGate(tokenSearch: string): { success: boolean; booking?: SyncBooking; message: string } {
  const cleanSearch = tokenSearch.trim().toUpperCase();
  const index = memoryState.bookings.findIndex(
    (b) =>
      b.tokenNumber.toUpperCase() === cleanSearch ||
      b.tokenHash.toUpperCase() === cleanSearch ||
      b.farmerId.toUpperCase() === cleanSearch ||
      b.id.toUpperCase() === cleanSearch
  );

  if (index === -1) {
    return { success: false, message: 'Invalid token. Not found in Mandi register.' };
  }

  const target = memoryState.bookings[index];
  const updated: SyncBooking = {
    ...target,
    status: 'GATE_CHECKIN',
    lane: target.lane || `Lane ${Math.floor(1 + Math.random() * 3)}`
  };

  const updatedBookings = [...memoryState.bookings];
  updatedBookings[index] = updated;

  const newNotif: InAppNotification = {
    id: `notif-${Date.now()}`,
    timestamp: new Date().toISOString(),
    titleKey: 'notifGateCheckinTitle',
    titleFallback: 'Gate Check-in Confirmed',
    messageKey: 'notifGateCheckinMsg',
    messageFallback: `Token ${target.tokenNumber} verified at Mandi Gate! Vehicle admitted to ${updated.lane}.`,
    type: 'success',
    read: false,
    tokenNumber: target.tokenNumber
  };

  const updatedActive =
    memoryState.activeBooking && memoryState.activeBooking.id === target.id
      ? updated
      : memoryState.activeBooking;

  persistAndBroadcast({
    bookings: updatedBookings,
    activeBooking: updatedActive,
    notifications: [newNotif, ...memoryState.notifications]
  });

  return { success: true, booking: updated, message: 'Gate check-in completed successfully.' };
}

export function recordQualityAndWeighing(
  bookingId: string,
  inspection: {
    dockageGrade: 'A' | 'B' | 'C';
    moistureLevel: number;
    foreignMatter: number;
    grossWeight: number;
    tareWeight: number;
    netWeight: number;
    mspRate: number;
    moisturePenalty: number;
    totalPayout: number;
    inspectorId: string;
  }
): { success: boolean; booking?: SyncBooking } {
  const index = memoryState.bookings.findIndex((b) => b.id === bookingId);
  if (index === -1) return { success: false };

  const target = memoryState.bookings[index];
  const updated: SyncBooking = {
    ...target,
    status: 'COMPLETED',
    qualityInspection: {
      ...inspection,
      verifiedAt: new Date().toISOString()
    }
  };

  const updatedBookings = [...memoryState.bookings];
  updatedBookings[index] = updated;

  const newNotif: InAppNotification = {
    id: `notif-${Date.now()}`,
    timestamp: new Date().toISOString(),
    titleKey: 'notifInspectionTitle',
    titleFallback: 'Inspection & Weighing Completed',
    messageKey: 'notifInspectionMsg',
    messageFallback: `Token ${target.tokenNumber}: Net weight ${inspection.netWeight} kg (Grade ${inspection.dockageGrade}). Payout of ₹${inspection.totalPayout.toLocaleString('en-IN')} approved via DBT.`,
    type: 'success',
    read: false,
    tokenNumber: target.tokenNumber
  };

  const updatedActive =
    memoryState.activeBooking && memoryState.activeBooking.id === target.id
      ? updated
      : memoryState.activeBooking;

  persistAndBroadcast({
    bookings: updatedBookings,
    activeBooking: updatedActive,
    notifications: [newNotif, ...memoryState.notifications]
  });

  return { success: true, booking: updated };
}

export function updateTrafficControls(controls: Partial<AdminTrafficControls>) {
  const updated = { ...memoryState.trafficControls, ...controls };

  let notifs = memoryState.notifications;
  if (controls.breakdown !== undefined || controls.reroute !== undefined || controls.emergencyLane !== undefined) {
    const isBreakdown = updated.breakdown;
    const isReroute = updated.reroute;
    const isEmergency = updated.emergencyLane;

    const notif: InAppNotification = {
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      titleKey: isBreakdown ? 'notifBreakdownTitle' : isEmergency ? 'notifEmergencyTitle' : 'notifTrafficTitle',
      titleFallback: isBreakdown ? 'Traffic Alert: Weighbridge Breakdown' : isEmergency ? 'Priority Alert: Emergency Lane Active' : 'Traffic Update',
      messageKey: isBreakdown ? 'notifBreakdownMsg' : isEmergency ? 'notifEmergencyMsg' : 'notifTrafficMsg',
      messageFallback: isBreakdown
        ? `Weighbridge scale breakdown reported. Incoming vehicles are being rerouted to ${updated.activeRerouteGate}.`
        : isEmergency
        ? 'Emergency priority lane activated for perishable harvest and urgent vehicles.'
        : 'Traffic flow normal.',
      type: isBreakdown ? 'alert' : 'warning',
      read: false
    };
    notifs = [notif, ...notifs];
  }

  persistAndBroadcast({
    trafficControls: updated,
    notifications: notifs
  });
}

export function toggleEmergencyPriority(bookingId: string) {
  const index = memoryState.bookings.findIndex((b) => b.id === bookingId);
  if (index === -1) return;

  const target = memoryState.bookings[index];
  const newPriority = target.priority === 'emergency' ? 'normal' : 'emergency';

  const updatedBookings = [...memoryState.bookings];
  updatedBookings[index] = { ...target, priority: newPriority };

  persistAndBroadcast({ bookings: updatedBookings });
}

export function callNextVehicle(bookingId: string) {
  const index = memoryState.bookings.findIndex((b) => b.id === bookingId);
  if (index === -1) return;

  const target = memoryState.bookings[index];
  let nextStatus: BookingStatus = target.status;
  if (target.status === 'BOOKED') nextStatus = 'STAGING';
  else if (target.status === 'STAGING') nextStatus = 'MANDI_GATE';
  else if (target.status === 'MANDI_GATE' || target.status === 'GATE_CHECKIN') nextStatus = 'QUALITY_TESTING';

  const updatedBookings = [...memoryState.bookings];
  updatedBookings[index] = { ...target, status: nextStatus };

  persistAndBroadcast({ bookings: updatedBookings });
}

export function advanceBookingStage(bookingId: string, nextStage?: BookingStatus): SyncBooking | null {
  const index = memoryState.bookings.findIndex((b) => b.id === bookingId);
  if (index === -1) return null;

  const target = memoryState.bookings[index];
  const STAGE_ORDER: BookingStatus[] = [
    'SLOT_BOOKED',
    'GATE_CHECKIN',
    'QUALITY_TESTING',
    'GROSS_WEIGHING',
    'UNLOADING',
    'TARE_WEIGHING',
    'PROCUREMENT',
    'DIGITAL_RECEIPT'
  ];

  let resolvedStage: BookingStatus;
  if (nextStage) {
    resolvedStage = nextStage;
  } else {
    const currentNum = getStageNumber(target.status);
    const nextIndex = Math.min(STAGE_ORDER.length - 1, currentNum);
    resolvedStage = STAGE_ORDER[nextIndex];
  }

  const updated: SyncBooking = {
    ...target,
    status: resolvedStage
  };

  const updatedBookings = [...memoryState.bookings];
  updatedBookings[index] = updated;

  const updatedActive =
    memoryState.activeBooking && memoryState.activeBooking.id === target.id
      ? updated
      : memoryState.activeBooking;

  persistAndBroadcast({
    bookings: updatedBookings,
    activeBooking: updatedActive
  });

  return updated;
}

export interface CenterAnalyticsMetrics {
  totalBookings: number;
  checkedIn: number;
  waiting: number;
  processing: number;
  completed: number;
  delayed: number;
}

export function getCenterAnalytics(): CenterAnalyticsMetrics {
  return {
    totalBookings: 128,
    checkedIn: 76,
    waiting: 32,
    processing: 8,
    completed: 44,
    delayed: 5
  };
}

export function markNotificationsAsRead() {
  const updated = memoryState.notifications.map((n) => ({ ...n, read: true }));
  persistAndBroadcast({ notifications: updated });
}

// React Hook
export function useSyncStore(): GlobalSyncState {
  const [state, setState] = useState<GlobalSyncState>(getSyncState);

  useEffect(() => {
    initSyncStore();
    setState(getSyncState());

    const handleUpdate = (updatedState: GlobalSyncState) => {
      setState(updatedState);
    };

    listeners.add(handleUpdate);
    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);

  return state;
}
