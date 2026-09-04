"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoryStore = void 0;
const seedData_1 = require("./seedData");
const crypto_1 = __importDefault(require("crypto"));
// Deterministic seed tokens for test passes
const token1 = crypto_1.default
    .createHash('sha256')
    .update('farmer-01|center-01|slot-01|TRACTOR|WHEAT|45.5|INITIAL_SEED_TOKEN')
    .digest('hex')
    .toUpperCase();
const token2 = crypto_1.default
    .createHash('sha256')
    .update('farmer-02|center-01|slot-02|TRUCK|PADDY|80.0|INITIAL_SEED_TOKEN_2')
    .digest('hex')
    .toUpperCase();
const token3 = crypto_1.default
    .createHash('sha256')
    .update('farmer-03|center-01|slot-03|BULLOCK_CART|CHANA|25.0|INITIAL_SEED_TOKEN_3')
    .digest('hex')
    .toUpperCase();
const token4 = crypto_1.default
    .createHash('sha256')
    .update('farmer-01|center-01|slot-04|TRACTOR|MUSTARD|50.0|INITIAL_SEED_TOKEN_4')
    .digest('hex')
    .toUpperCase();
const token5 = crypto_1.default
    .createHash('sha256')
    .update('farmer-02|center-01|slot-01|TRUCK|WHEAT|95.0|INITIAL_SEED_TOKEN_5')
    .digest('hex')
    .toUpperCase();
exports.memoryStore = {
    farmers: [...seedData_1.seedFarmers],
    centers: [...seedData_1.seedCenters],
    slots: seedData_1.seedSlots.map((s) => ({ ...s })),
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
            farmer: seedData_1.seedFarmers[0],
            slot: {
                ...seedData_1.seedSlots[0],
                center: seedData_1.seedCenters[0]
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
            farmer: seedData_1.seedFarmers[1],
            slot: {
                ...seedData_1.seedSlots[1],
                center: seedData_1.seedCenters[0]
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
            farmer: seedData_1.seedFarmers[2],
            slot: {
                ...seedData_1.seedSlots[2],
                center: seedData_1.seedCenters[0]
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
            farmer: seedData_1.seedFarmers[0],
            slot: {
                ...seedData_1.seedSlots[3],
                center: seedData_1.seedCenters[0]
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
            farmer: seedData_1.seedFarmers[1],
            slot: {
                ...seedData_1.seedSlots[0],
                center: seedData_1.seedCenters[0]
            }
        }
    ]
};
