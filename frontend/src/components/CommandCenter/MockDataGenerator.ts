// Mock Data Generator & Reactive State for Kisan Setu Command Center

export interface ExecutiveMetrics {
  totalCropVolumeTons: number;
  cropVolumeTargetTons: number;
  targetProgressPercent: number;
  totalPayoutsCr: number;
  dbtSuccessRatePercent: number;
  congestionIndex: number;
  congestionStatus: 'SMOOTH' | 'MODERATE' | 'CRITICAL';
  avgTurnaroundMinutes: number;
  traditionalWaitHours: number;
  timeSavedPercent: number;
  totalFarmersServed: number;
  activeVehiclesInDistrict: number;
  activeMandiCount: number;
  digitalTokensIssuedToday: number;
}

export interface CenterProcurementData {
  id: string;
  centerName: string;
  actualVolumeTons: number;
  targetVolumeTons: number;
  weighbridgeBays: number;
  completionRate: number;
  congestionScore: number;
}

export interface HourlyTrafficData {
  timeSlot: string;
  vehicleArrivals: number;
  vehiclesProcessed: number;
  avgWaitMinutes: number;
}

export interface CropDistributionData {
  cropName: string;
  hindiName: string;
  volumeTons: number;
  payoutCr: number;
  percentage: number;
  color: string;
}

export interface CommandState {
  metrics: ExecutiveMetrics;
  centerProcurement: CenterProcurementData[];
  hourlyTraffic: HourlyTrafficData[];
  cropDistribution: CropDistributionData[];
  isOfflineSimulated: boolean;
  surgeActive: boolean;
  smsNotification: {
    visible: boolean;
    farmerName: string;
    phone: string;
    amount: string;
    receiptNo: string;
    timestamp: string;
  } | null;
}

// Pristine baseline metrics
export const BASELINE_COMMAND_STATE: CommandState = {
  metrics: {
    totalCropVolumeTons: 14820,
    cropVolumeTargetTons: 18000,
    targetProgressPercent: 82.3,
    totalPayoutsCr: 33.72,
    dbtSuccessRatePercent: 100,
    congestionIndex: 24,
    congestionStatus: 'SMOOTH',
    avgTurnaroundMinutes: 28,
    traditionalWaitHours: 4.5,
    timeSavedPercent: 89,
    totalFarmersServed: 4120,
    activeVehiclesInDistrict: 46,
    activeMandiCount: 5,
    digitalTokensIssuedToday: 890
  },
  centerProcurement: [
    {
      id: 'c-01',
      centerName: 'कोटा मुख्य मंडी (Kota Main)',
      actualVolumeTons: 4850,
      targetVolumeTons: 5500,
      weighbridgeBays: 4,
      completionRate: 88,
      congestionScore: 28
    },
    {
      id: 'c-02',
      centerName: 'करनाल ग्रेन मंडी (Karnal Mandi)',
      actualVolumeTons: 3920,
      targetVolumeTons: 4500,
      weighbridgeBays: 6,
      completionRate: 87,
      congestionScore: 22
    },
    {
      id: 'c-03',
      centerName: 'भोपाल करोंद मंडी (Bhopal Karond)',
      actualVolumeTons: 2840,
      targetVolumeTons: 3500,
      weighbridgeBays: 5,
      completionRate: 81,
      congestionScore: 25
    },
    {
      id: 'c-04',
      centerName: 'बारां कृषि मंडी (Baran Mandi)',
      actualVolumeTons: 1980,
      targetVolumeTons: 2500,
      weighbridgeBays: 3,
      completionRate: 79,
      congestionScore: 19
    },
    {
      id: 'c-05',
      centerName: 'अलवार मंडी (Alwar Mandi)',
      actualVolumeTons: 1230,
      targetVolumeTons: 2000,
      weighbridgeBays: 3,
      completionRate: 61,
      congestionScore: 15
    }
  ],
  hourlyTraffic: [
    { timeSlot: '06:00', vehicleArrivals: 8, vehiclesProcessed: 8, avgWaitMinutes: 12 },
    { timeSlot: '08:00', vehicleArrivals: 24, vehiclesProcessed: 22, avgWaitMinutes: 18 },
    { timeSlot: '10:00', vehicleArrivals: 38, vehiclesProcessed: 35, avgWaitMinutes: 26 },
    { timeSlot: '12:00', vehicleArrivals: 42, vehiclesProcessed: 40, avgWaitMinutes: 32 },
    { timeSlot: '14:00', vehicleArrivals: 34, vehiclesProcessed: 36, avgWaitMinutes: 28 },
    { timeSlot: '16:00', vehicleArrivals: 26, vehiclesProcessed: 28, avgWaitMinutes: 22 },
    { timeSlot: '18:00', vehicleArrivals: 14, vehiclesProcessed: 18, avgWaitMinutes: 15 }
  ],
  cropDistribution: [
    {
      cropName: 'Wheat',
      hindiName: 'गेहूं',
      volumeTons: 7120,
      payoutCr: 16.19,
      percentage: 48,
      color: '#334155'
    },
    {
      cropName: 'Paddy',
      hindiName: 'धान',
      volumeTons: 4740,
      payoutCr: 11.0,
      percentage: 32,
      color: '#047857'
    },
    {
      cropName: 'Pulses',
      hindiName: 'चना',
      volumeTons: 1930,
      payoutCr: 4.28,
      percentage: 13,
      color: '#d97706'
    },
    {
      cropName: 'Mustard',
      hindiName: 'सरसों',
      volumeTons: 1030,
      payoutCr: 2.25,
      percentage: 7,
      color: '#0284c7'
    }
  ],
  isOfflineSimulated: false,
  surgeActive: false,
  smsNotification: null
};

// Simulation State Modifiers
export function applyVehicleSurgeSimulation(state: CommandState, surgeCount: number = 20): CommandState {
  const newCongestion = Math.min(88, state.metrics.congestionIndex + 22);
  const newActiveVehicles = state.metrics.activeVehiclesInDistrict + surgeCount;
  const newTotalVolume = state.metrics.totalCropVolumeTons + Math.round(surgeCount * 4.2);
  const newPayout = Math.round((state.metrics.totalPayoutsCr + 0.38) * 100) / 100;

  // Update hourly chart with surge peak at 12:00 and 14:00
  const updatedHourly = state.hourlyTraffic.map((slot) => {
    if (slot.timeSlot === '12:00' || slot.timeSlot === '14:00') {
      return {
        ...slot,
        vehicleArrivals: slot.vehicleArrivals + Math.round(surgeCount / 2),
        avgWaitMinutes: slot.avgWaitMinutes + 14
      };
    }
    return slot;
  });

  // Update Kota center metrics
  const updatedCenters = state.centerProcurement.map((c) => {
    if (c.id === 'c-01') {
      return {
        ...c,
        actualVolumeTons: c.actualVolumeTons + Math.round(surgeCount * 3.5),
        congestionScore: Math.min(85, c.congestionScore + 28)
      };
    }
    return c;
  });

  return {
    ...state,
    surgeActive: true,
    metrics: {
      ...state.metrics,
      totalCropVolumeTons: newTotalVolume,
      totalPayoutsCr: newPayout,
      activeVehiclesInDistrict: newActiveVehicles,
      congestionIndex: newCongestion,
      congestionStatus: newCongestion > 60 ? 'CRITICAL' : newCongestion > 35 ? 'MODERATE' : 'SMOOTH',
      avgTurnaroundMinutes: Math.min(48, state.metrics.avgTurnaroundMinutes + 8)
    },
    hourlyTraffic: updatedHourly,
    centerProcurement: updatedCenters
  };
}

export function generateMockSmsNotification(state: CommandState): CommandState {
  const sampleFarmers = [
    { name: 'रामेश कुमार (Ramesh Kumar)', phone: '+91 98765 43210', amount: '₹1,02,830', receiptNo: 'REC-KS-2026-981245' },
    { name: 'बलविंदर सिंह (Balwinder Singh)', phone: '+91 98123 45678', amount: '₹1,85,600', receiptNo: 'REC-KS-2026-554109' },
    { name: 'सुरेश पटेल (Suresh Patel)', phone: '+91 97555 23456', amount: '₹1,33,280', receiptNo: 'REC-KS-2026-339812' }
  ];
  const chosen = sampleFarmers[Math.floor(Math.random() * sampleFarmers.length)];

  return {
    ...state,
    smsNotification: {
      visible: true,
      farmerName: chosen.name,
      phone: chosen.phone,
      amount: chosen.amount,
      receiptNo: chosen.receiptNo,
      timestamp: new Date().toLocaleTimeString('en-IN')
    }
  };
}

export function toggleOfflineModeSimulation(state: CommandState): CommandState {
  return {
    ...state,
    isOfflineSimulated: !state.isOfflineSimulated
  };
}
