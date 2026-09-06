const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/kisan-setu';

export interface ProcurementCenter {
  id: string;
  name: string;
  locationLat: number;
  locationLng: number;
  weighbridgeCount: number;
  hourlyCapacity: number;
  _count?: { slots: number };
}

export interface SlotItem {
  id: string;
  centerId: string;
  date: string;
  timeWindow: string;
  maxCapacity: number;
  bookedCount: number;
  remainingCapacity: number;
  isAvailable: boolean;
  utilizationPercentage: number;
  center?: {
    name: string;
    hourlyCapacity: number;
    weighbridgeCount: number;
  };
}

export interface FarmerItem {
  id: string;
  aadhaarHash: string;
  name: string;
  phoneno: string;
  language: string;
  landSize?: number;
  locationVillage?: string;
  createdAt?: string;
  primaryCrop?: string;
  approximateQuantity?: number;
  vehicleType?: string;
}

export interface BookingResponseData {
  booking: {
    id: string;
    farmerId: string;
    slotId: string;
    vehicleType: string;
    cropType: string;
    estimatedWeight: number;
    tokenHash: string;
    status: string;
    createdAt: string;
    farmer?: FarmerItem;
    slot?: SlotItem;
  };
  token: {
    tokenHash: string;
    qrPayload: string;
    issuedAt: string;
    algorithm: string;
  };
  notifications?: Array<{ channel: 'sms' | 'whatsapp'; delivered: boolean; simulated: boolean; message: string; sentAt: string }>;
}

export interface VerifiedTokenData {
  bookingId: string;
  tokenHash: string;
  status: string;
  vehicleType: string;
  cropType: string;
  estimatedWeight: number;
  createdAt: string;
  farmer: {
    id: string;
    name: string;
    phoneno: string;
    aadhaarHash: string;
    locationVillage: string;
    landSize: number;
    language: string;
  } | null;
  slot: {
    date: string;
    timeWindow: string;
  } | null;
  center: {
    name: string;
    weighbridgeCount: number;
  } | null;
  qualityInspection?: {
    id: string;
    bookingId: string;
    moistureLevel: number;
    dockageGrade: string;
    approvedWeight: number;
    mspRate?: number;
    moisturePenalty?: number;
    grossValue?: number;
    totalPayout: number;
    inspectorId: string;
    verifiedAt: string;
  } | null;
}

export interface QualityInspectionInput {
  bookingId: string;
  moistureLevel: number;
  dockageGrade: 'A' | 'B' | 'C' | string;
  approvedWeight: number;
  mspRate?: number;
  inspectorId?: string;
}

export interface InspectionReceipt {
  receiptNumber: string;
  farmerName: string;
  farmerPhone: string;
  vehicleType: string;
  cropType: string;
  approvedWeight: number;
  moistureLevel: number;
  dockageGrade: string;
  mspRate: number;
  grossValue: number;
  moisturePenalty: number;
  totalPayout: number;
  inspectorId: string;
  issuedAt: string;
}

export interface MockSmsPayload {
  recipientPhone: string;
  farmerName: string;
  messageText: string;
  dispatchedAt: string;
  receiptNumber: string;
  dbtStatus: string;
}

export interface InspectionReceiptResult {
  inspection: any;
  booking: any;
  receipt: InspectionReceipt;
  mockSms: MockSmsPayload;
}

// Fallback seed data for mock / offline operation
const DEFAULT_MOCK_BOOKINGS: VerifiedTokenData[] = [
  {
    bookingId: 'booking-seed-01',
    tokenHash: '5A7E298B10C34DF98A00B74239ED3C19F218902B73479AF02BC8912E4A9C1032',
    status: 'MANDI_GATE',
    vehicleType: 'TRACTOR',
    cropType: 'Wheat',
    estimatedWeight: 45.5,
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    farmer: {
      id: 'farmer-01',
      name: 'Ramesh Kumar',
      phoneno: '9876543210',
      aadhaarHash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      locationVillage: 'Ranpur',
      landSize: 4.5,
      language: 'hi'
    },
    slot: {
      date: new Date().toISOString().split('T')[0],
      timeWindow: '09:00-10:00'
    },
    center: {
      name: 'Kota Mandi',
      weighbridgeCount: 4
    },
    qualityInspection: null
  },
  {
    bookingId: 'booking-seed-02',
    tokenHash: 'B82C10F98934EBA10984E290BA55E1C389AFB1238910ABDE542890C12389A120',
    status: 'STAGING',
    vehicleType: 'TRUCK',
    cropType: 'Paddy',
    estimatedWeight: 82.0,
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    farmer: {
      id: 'farmer-02',
      name: 'Balwinder Singh',
      phoneno: '9812345678',
      aadhaarHash: '9c56cc51b374c3ba189210d5b55476f276081418b59e4913d3725ef4a504acaf',
      locationVillage: 'Nilokheri',
      landSize: 12.0,
      language: 'hi'
    },
    slot: {
      date: new Date().toISOString().split('T')[0],
      timeWindow: '10:00-11:00'
    },
    center: {
      name: 'Kota Mandi',
      weighbridgeCount: 4
    },
    qualityInspection: null
  },
  {
    bookingId: 'booking-seed-03',
    tokenHash: 'E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855',
    status: 'MANDI_GATE',
    vehicleType: 'BULLOCK_CART',
    cropType: 'Pulses',
    estimatedWeight: 24.5,
    createdAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    farmer: {
      id: 'farmer-03',
      name: 'Suresh Patel',
      phoneno: '9755523456',
      aadhaarHash: 'cb4325a74eab88b773e610f2d9c1932d04b901ac57e07d4803738b008f34b47a',
      locationVillage: 'Berasia',
      landSize: 7.2,
      language: 'hi'
    },
    slot: {
      date: new Date().toISOString().split('T')[0],
      timeWindow: '08:00-09:00'
    },
    center: {
      name: 'Kota Mandi',
      weighbridgeCount: 4
    },
    qualityInspection: null
  },
  {
    bookingId: 'booking-seed-04',
    tokenHash: 'F128A948C721098BAFE34901C9823489ABCF341908234890ABFE8923489012AB',
    status: 'COMPLETED',
    vehicleType: 'TRACTOR',
    cropType: 'Mustard',
    estimatedWeight: 52.0,
    createdAt: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
    farmer: {
      id: 'farmer-01',
      name: 'Ramesh Kumar',
      phoneno: '9876543210',
      aadhaarHash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      locationVillage: 'Ranpur',
      landSize: 4.5,
      language: 'hi'
    },
    slot: {
      date: new Date().toISOString().split('T')[0],
      timeWindow: '08:00-09:00'
    },
    center: {
      name: 'Kota Mandi',
      weighbridgeCount: 4
    },
    qualityInspection: {
      id: 'insp-seed-04',
      bookingId: 'booking-seed-04',
      moistureLevel: 11.5,
      dockageGrade: 'A',
      approvedWeight: 51.8,
      totalPayout: 292670,
      inspectorId: 'OFFICER-KOTA-04',
      verifiedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString()
    }
  },
  {
    bookingId: 'booking-seed-05',
    tokenHash: 'AA11BB22CC33DD44EE55FF6600112233445566778899AABBCCDDEEFF00112233',
    status: 'BOOKED',
    vehicleType: 'TRUCK',
    cropType: 'Wheat',
    estimatedWeight: 90.0,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    farmer: {
      id: 'farmer-02',
      name: 'Balwinder Singh',
      phoneno: '9812345678',
      aadhaarHash: '9c56cc51b374c3ba189210d5b55476f276081418b59e4913d3725ef4a504acaf',
      locationVillage: 'Nilokheri',
      landSize: 12.0,
      language: 'hi'
    },
    slot: {
      date: new Date().toISOString().split('T')[0],
      timeWindow: '11:00-12:00'
    },
    center: {
      name: 'Kota Mandi',
      weighbridgeCount: 4
    },
    qualityInspection: null
  }
];

function getStoredMockBookings(): VerifiedTokenData[] {
  if (typeof window === 'undefined') return DEFAULT_MOCK_BOOKINGS;
  try {
    const saved = localStorage.getItem('kisan_setu_mock_bookings');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return DEFAULT_MOCK_BOOKINGS;
}

function saveStoredMockBookings(list: VerifiedTokenData[]) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('kisan_setu_mock_bookings', JSON.stringify(list));
    } catch (e) {}
  }
}

export async function fetchCenters(): Promise<ProcurementCenter[]> {
  try {
    const res = await fetch(`${API_BASE}/centers`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch procurement centers');
    const json = await res.json();
    return json.data || [];
  } catch (e) {
    return [
      {
        id: 'center-01',
        name: 'कोटा कृषि उपज मंडी (Kota Krishi Upaj Mandi)',
        locationLat: 25.18,
        locationLng: 75.83,
        weighbridgeCount: 4,
        hourlyCapacity: 20
      },
      {
        id: 'center-02',
        name: 'करनाल मुख्य अनाज मंडी (Karnal Grain Mandi)',
        locationLat: 29.68,
        locationLng: 76.99,
        weighbridgeCount: 6,
        hourlyCapacity: 35
      }
    ];
  }
}

export async function fetchAvailableSlots(centerId: string, date: string): Promise<SlotItem[]> {
  const res = await fetch(`${API_BASE}/slots/available?centerId=${centerId}&date=${date}`, {
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('Failed to fetch slots');
  const json = await res.json();
  return json.data || [];
}

export async function fetchFarmers(): Promise<FarmerItem[]> {
  const res = await fetch(`${API_BASE}/farmers`, { cache: 'no-store' });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data || [];
}

export async function registerFarmerApi(payload: {
  name: string;
  phoneno: string;
  aadhaarNumber?: string;
  village?: string;
  crop?: string;
  quantity?: number;
  vehicleType?: string;
}): Promise<FarmerItem> {
  const res = await fetch(`${API_BASE}/farmers/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || 'Farmer registration failed');
  return json.data;
}

export async function verifyFarmerApi(phoneno: string): Promise<FarmerItem | null> {
  const res = await fetch(`${API_BASE}/farmers/verify?phoneno=${encodeURIComponent(phoneno)}`, {
    cache: 'no-store'
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Farmer verification failed');
  return json.exists ? json.data : null;
}

export async function createBookingApi(payload: {
  farmerId: string;
  slotId: string;
  vehicleType: string;
  cropType: string;
  estimatedWeight: number;
  notificationPreferences?: { sms: boolean; whatsapp: boolean };
}): Promise<BookingResponseData> {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Booking creation failed');
  }
  return json.data;
}

export async function sendTestNotificationApi(payload: {
  phone: string;
  preferences: { sms: boolean; whatsapp: boolean };
}): Promise<Array<{ channel: 'sms' | 'whatsapp'; delivered: boolean; simulated: boolean; message: string; sentAt: string }>> {
  const res = await fetch(`${API_BASE}/notify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, template: 'bookingConfirmation', values: { name: 'Demo Farmer', mandiName: 'Kota Mandi', date: 'today', time: '10:00', token: 'DEMO-TOKEN', passLink: 'http://localhost:3000/?tab=offlinePass' } })
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || 'Notification test failed');
  return json.data || [];
}

export async function verifyTokenApi(tokenHash: string): Promise<VerifiedTokenData> {
  const cleanedHash = tokenHash.trim().toUpperCase();
  try {
    const res = await fetch(`${API_BASE}/bookings/token/${cleanedHash}`, {
      cache: 'no-store'
    });
    const json = await res.json();
    if (res.ok && json.success && json.data) {
      return json.data;
    }
  } catch (e) {
    // Try fallback lookup in stored mock bookings
  }

  const mockList = getStoredMockBookings();
  const match = mockList.find((b) => b.tokenHash.toUpperCase() === cleanedHash);
  if (match) {
    return match;
  }

  // If token is unknown but looks like a valid SHA-256 hash or demo token, allow demo inspection
  if (cleanedHash.length === 64 || cleanedHash.startsWith('VALID_') || cleanedHash === 'SAMPLE') {
    return {
      bookingId: `demo-book-${Date.now()}`,
      tokenHash: cleanedHash,
      status: 'MANDI_GATE',
      vehicleType: 'TRACTOR',
      cropType: 'गेहूं (Wheat)',
      estimatedWeight: 45.0,
      createdAt: new Date().toISOString(),
      farmer: {
        id: 'farmer-demo',
        name: 'रामेश कुमार (Ramesh Kumar)',
        phoneno: '9876543210',
        aadhaarHash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
        locationVillage: 'रनपुर (Ranpur, Kota)',
        landSize: 4.5,
        language: 'hi'
      },
      slot: {
        date: new Date().toISOString().split('T')[0],
        timeWindow: '09:00-10:00'
      },
      center: {
        name: 'कोटा कृषि उपज मंडी (Kota Krishi Upaj Mandi)',
        weighbridgeCount: 4
      },
      qualityInspection: null
    };
  }

  throw new Error('अमान्य या समाप्त टोकन है (Invalid or Expired Token)');
}

export async function fetchBookingsApi(
  status?: string,
  search?: string
): Promise<VerifiedTokenData[]> {
  const query = new URLSearchParams();
  if (status && status !== 'ALL') query.set('status', status);
  if (search) query.set('search', search);

  try {
    const res = await fetch(`${API_BASE}/bookings?${query.toString()}`, {
      cache: 'no-store'
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        // Update local mock list for consistency
        saveStoredMockBookings(json.data);
        return json.data;
      }
    }
  } catch (e) {
    // Network / backend offline fallback
  }

  let list = getStoredMockBookings();
  if (status && status !== 'ALL') {
    list = list.filter((b) => b.status === status);
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (b) =>
        (b.farmer?.name || '').toLowerCase().includes(q) ||
        (b.vehicleType || '').toLowerCase().includes(q) ||
        (b.cropType || '').toLowerCase().includes(q) ||
        (b.tokenHash || '').toLowerCase().includes(q) ||
        b.bookingId.toLowerCase().includes(q)
    );
  }
  return list;
}

export async function updateStatusApi(bookingId: string, status: string): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success) {
        // Also update local mock storage
        const list = getStoredMockBookings().map((item) =>
          item.bookingId === bookingId ? { ...item, status } : item
        );
        saveStoredMockBookings(list);
        return json.data;
      }
    }
  } catch (e) {
    // Fallback update local storage
  }

  const list = getStoredMockBookings().map((item) =>
    item.bookingId === bookingId ? { ...item, status } : item
  );
  saveStoredMockBookings(list);
  return { id: bookingId, status };
}

export async function submitQualityInspectionApi(
  payload: QualityInspectionInput
): Promise<InspectionReceiptResult> {
  try {
    const res = await fetch(`${API_BASE}/inspections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        // Update local mock cache
        const list = getStoredMockBookings().map((item) =>
          item.bookingId === payload.bookingId
            ? { ...item, status: 'COMPLETED', qualityInspection: json.data.inspection }
            : item
        );
        saveStoredMockBookings(list);
        return json.data;
      }
    }
  } catch (e) {
    // Fallback calculation below
  }

  // Offline / Standalone Mock calculation:
  // Total Payout = (Approved Weight * Govt MSP Rate) - Moisture Penalty
  const moisture = Number(payload.moistureLevel);
  const weight = Number(payload.approvedWeight);
  const msp = Number(payload.mspRate) || 2275;
  const inspectorId = payload.inspectorId || 'OFFICER-KOTA-04';

  const excessMoisture = Math.max(0, moisture - 12.0);
  const moisturePenalty = Math.round(weight * msp * (excessMoisture / 100) * 100) / 100;
  const grossValue = Math.round(weight * msp * 100) / 100;
  const totalPayout = Math.max(0, Math.round((grossValue - moisturePenalty) * 100) / 100);

  const receiptNumber = `REC-KS-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const inspectionRecord = {
    id: `insp-${Date.now()}`,
    bookingId: payload.bookingId,
    moistureLevel: moisture,
    dockageGrade: payload.dockageGrade,
    approvedWeight: weight,
    mspRate: msp,
    grossValue,
    moisturePenalty,
    totalPayout,
    inspectorId,
    verifiedAt: new Date().toISOString()
  };

  const list = getStoredMockBookings();
  const currentBooking = list.find((b) => b.bookingId === payload.bookingId);
  const updatedList = list.map((item) =>
    item.bookingId === payload.bookingId
      ? { ...item, status: 'COMPLETED', qualityInspection: inspectionRecord }
      : item
  );
  saveStoredMockBookings(updatedList);

  const farmerName = currentBooking?.farmer?.name || 'रामेश कुमार (Ramesh Kumar)';
  const farmerPhone = currentBooking?.farmer?.phoneno || '9876543210';

  return {
    inspection: inspectionRecord,
    booking: currentBooking,
    receipt: {
      receiptNumber,
      farmerName,
      farmerPhone,
      vehicleType: currentBooking?.vehicleType || 'TRACTOR',
      cropType: currentBooking?.cropType || 'गेहूं (Wheat)',
      approvedWeight: weight,
      moistureLevel: moisture,
      dockageGrade: payload.dockageGrade,
      mspRate: msp,
      grossValue,
      moisturePenalty,
      totalPayout,
      inspectorId,
      issuedAt: new Date().toISOString()
    },
    mockSms: {
      recipientPhone: farmerPhone,
      farmerName,
      messageText: `Kisan Setu Alert: Your produce has been successfully inspected & weighed at कोटा कृषि उपज मंडी. Receipt #${receiptNumber}. Net Approved Weight: ${weight} Quintals. Total MSP Payout: Rs. ${totalPayout.toLocaleString('en-IN')}. Direct Benefit Transfer initiated to your linked Bank A/c. Gate Inspector: ${inspectorId}. Helpline: 1800-180-1551.`,
      dispatchedAt: new Date().toISOString(),
      receiptNumber,
      dbtStatus: 'INITIATED'
    }
  };
}

export interface CapacityCheckData {
  centerId: string;
  centerName: string;
  date: string;
  timeWindow: string;
  weighbridgeCount: number;
  totalWeighbridgeMinutes: number;
  usedMinutes: number;
  remainingMinutes: number;
  utilizationPercentage: number;
  congestionLevel: 'NORMAL' | 'MODERATE' | 'CONGESTED';
  isOverbooked: boolean;
  canAcceptVehicle: {
    BULLOCK_CART: boolean;
    TRACTOR: boolean;
    TRUCK: boolean;
  };
  estimatedWaitMinutes: number;
  activeBookingsCount: number;
  bookingsBreakdown: {
    BULLOCK_CART: number;
    TRACTOR: number;
    TRUCK: number;
  };
}

export interface GeofenceResponseData {
  status: 'BOOKED' | 'STAGING' | 'MANDI_GATE';
  stageIndex: number;
  distanceKm: number;
  distanceMeters: number;
  stageLabel: {
    en: string;
    hi: string;
  };
  instructions: {
    en: string;
    hi: string;
  };
  centerCoordinates: { lat: number; lng: number };
  farmerCoordinates: { lat: number; lng: number };
}

export async function fetchQueueCapacity(
  centerId: string = 'center-01',
  date: string = new Date().toISOString().split('T')[0],
  timeWindow: string = '09:00-10:00'
): Promise<CapacityCheckData> {
  const res = await fetch(
    `${API_BASE}/queue/capacity?centerId=${centerId}&date=${date}&timeWindow=${timeWindow}`,
    { cache: 'no-store' }
  );
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to fetch queue capacity');
  }
  return json.data;
}

export async function checkGeofenceApi(payload: {
  farmerLat: number;
  farmerLng: number;
  centerLat?: number;
  centerLng?: number;
  centerId?: string;
  bookingId?: string;
}): Promise<GeofenceResponseData> {
  const res = await fetch(`${API_BASE}/queue/geofence`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to check geofence state');
  }
  return json.data;
}

export async function generateOfflineTokenApi(payload: {
  farmerId: string;
  slotId: string;
  timestamp?: number;
}): Promise<any> {
  const res = await fetch(`${API_BASE}/queue/generate-offline-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to generate offline token');
  }
  return json.data;
}
