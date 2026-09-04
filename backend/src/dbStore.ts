import { seedFarmers, seedCenters, seedSlots } from './seedData';
import crypto from 'crypto';

export interface InMemoryStore {
  farmers: typeof seedFarmers;
  centers: typeof seedCenters;
  slots: typeof seedSlots;
  bookings: Array<{
    id: string;
    farmerId: string;
    slotId: string;
    vehicleType: string;
    cropType: string;
    estimatedWeight: number;
    tokenHash: string;
    status: string;
    createdAt: string;
    farmer?: any;
    slot?: any;
    qualityInspection?: any;
  }>;
}

// Deterministic seed tokens for test passes
const token1 = crypto
  .createHash('sha256')
  .update('farmer-01|center-01|slot-01|TRACTOR|WHEAT|45.5|INITIAL_SEED_TOKEN')
  .digest('hex')
  .toUpperCase();

const token2 = crypto
  .createHash('sha256')
  .update('farmer-02|center-01|slot-02|TRUCK|PADDY|80.0|INITIAL_SEED_TOKEN_2')
  .digest('hex')
  .toUpperCase();

const token3 = crypto
  .createHash('sha256')
  .update('farmer-03|center-01|slot-03|BULLOCK_CART|CHANA|25.0|INITIAL_SEED_TOKEN_3')
  .digest('hex')
  .toUpperCase();

const token4 = crypto
  .createHash('sha256')
  .update('farmer-01|center-01|slot-04|TRACTOR|MUSTARD|50.0|INITIAL_SEED_TOKEN_4')
  .digest('hex')
  .toUpperCase();

const token5 = crypto
  .createHash('sha256')
  .update('farmer-02|center-01|slot-01|TRUCK|WHEAT|95.0|INITIAL_SEED_TOKEN_5')
  .digest('hex')
  .toUpperCase();

export const memoryStore: InMemoryStore = {
  farmers: [...seedFarmers],
  centers: [...seedCenters],
  slots: seedSlots.map((s) => ({ ...s })),
  bookings: [
    {
      id: 'booking-seed-01',
      farmerId: 'farmer-01',
      slotId: 'slot-01',
      vehicleType: 'TRACTOR',
      cropType: 'गेहूं (Wheat)',
      estimatedWeight: 45.5,
      tokenHash: token1,
      status: 'MANDI_GATE',
      createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      farmer: seedFarmers[0],
      slot: {
        ...seedSlots[0],
        center: seedCenters[0]
      }
    },
    {
      id: 'booking-seed-02',
      farmerId: 'farmer-02',
      slotId: 'slot-02',
      vehicleType: 'TRUCK',
      cropType: 'धान (Paddy Basmati)',
      estimatedWeight: 80.0,
      tokenHash: token2,
      status: 'STAGING',
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      farmer: seedFarmers[1],
      slot: {
        ...seedSlots[1],
        center: seedCenters[0]
      }
    },
    {
      id: 'booking-seed-03',
      farmerId: 'farmer-03',
      slotId: 'slot-03',
      vehicleType: 'BULLOCK_CART',
      cropType: 'चना (Gram/Chana)',
      estimatedWeight: 25.0,
      tokenHash: token3,
      status: 'MANDI_GATE',
      createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      farmer: seedFarmers[2],
      slot: {
        ...seedSlots[2],
        center: seedCenters[0]
      }
    },
    {
      id: 'booking-seed-04',
      farmerId: 'farmer-01',
      slotId: 'slot-04',
      vehicleType: 'TRACTOR',
      cropType: 'सरसों (Mustard)',
      estimatedWeight: 52.0,
      tokenHash: token4,
      status: 'COMPLETED',
      createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
      farmer: seedFarmers[0],
      slot: {
        ...seedSlots[3],
        center: seedCenters[0]
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
      id: 'booking-seed-05',
      farmerId: 'farmer-02',
      slotId: 'slot-01',
      vehicleType: 'TRUCK',
      cropType: 'गेहूं (Wheat)',
      estimatedWeight: 92.5,
      tokenHash: token5,
      status: 'BOOKED',
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      farmer: seedFarmers[1],
      slot: {
        ...seedSlots[0],
        center: seedCenters[0]
      }
    }
  ]
};
