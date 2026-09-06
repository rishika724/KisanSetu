"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedSlots = exports.getFormattedDate = exports.seedCenters = exports.seedFarmers = void 0;
const crypto_1 = __importDefault(require("crypto"));
exports.seedFarmers = [
    {
        id: 'farmer-01',
        aadhaarHash: crypto_1.default.createHash('sha256').update('AADHAAR_9876_5432_1098').digest('hex'),
        name: 'Ramesh Kumar',
        phoneno: '9876543210',
        language: 'hi',
        landSize: 4.5,
        locationVillage: 'Ranpur'
    },
    {
        id: 'farmer-02',
        aadhaarHash: crypto_1.default.createHash('sha256').update('AADHAAR_8765_4321_0987').digest('hex'),
        name: 'Balwinder Singh',
        phoneno: '9812345678',
        language: 'hi',
        landSize: 12.0,
        locationVillage: 'Nilokheri'
    },
    {
        id: 'farmer-03',
        aadhaarHash: crypto_1.default.createHash('sha256').update('AADHAAR_7654_3210_9876').digest('hex'),
        name: 'Suresh Patel',
        phoneno: '9755523456',
        language: 'hi',
        landSize: 7.2,
        locationVillage: 'Berasia'
    }
];
exports.seedCenters = [
    {
        id: 'center-01',
        name: 'Kota Mandi',
        locationLat: 25.18,
        locationLng: 75.83,
        weighbridgeCount: 4,
        hourlyCapacity: 20
    },
    {
        id: 'center-02',
        name: 'Karnal Grain Mandi',
        locationLat: 29.68,
        locationLng: 76.99,
        weighbridgeCount: 6,
        hourlyCapacity: 35
    },
    {
        id: 'center-03',
        name: 'Bhopal Karond Mandi',
        locationLat: 23.30,
        locationLng: 77.40,
        weighbridgeCount: 5,
        hourlyCapacity: 25
    }
];
// Helper for dynamic dates starting today
const getFormattedDate = (offsetDays = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split('T')[0];
};
exports.getFormattedDate = getFormattedDate;
exports.seedSlots = [
    // Today's slots for Kota Mandi
    {
        id: 'slot-01',
        centerId: 'center-01',
        date: (0, exports.getFormattedDate)(0),
        timeWindow: '08:00-09:00',
        maxCapacity: 20,
        bookedCount: 5
    },
    {
        id: 'slot-02',
        centerId: 'center-01',
        date: (0, exports.getFormattedDate)(0),
        timeWindow: '09:00-10:00',
        maxCapacity: 20,
        bookedCount: 18
    },
    {
        id: 'slot-03',
        centerId: 'center-01',
        date: (0, exports.getFormattedDate)(0),
        timeWindow: '10:00-11:00',
        maxCapacity: 20,
        bookedCount: 8
    },
    {
        id: 'slot-04',
        centerId: 'center-01',
        date: (0, exports.getFormattedDate)(0),
        timeWindow: '11:00-12:00',
        maxCapacity: 20,
        bookedCount: 20 // Fully booked slot test case
    },
    // Tomorrow's slots for Kota Mandi
    {
        id: 'slot-05',
        centerId: 'center-01',
        date: (0, exports.getFormattedDate)(1),
        timeWindow: '09:00-10:00',
        maxCapacity: 20,
        bookedCount: 2
    },
    {
        id: 'slot-06',
        centerId: 'center-01',
        date: (0, exports.getFormattedDate)(1),
        timeWindow: '10:00-11:00',
        maxCapacity: 20,
        bookedCount: 0
    },
    // Today's slots for Karnal Mandi
    {
        id: 'slot-07',
        centerId: 'center-02',
        date: (0, exports.getFormattedDate)(0),
        timeWindow: '08:00-09:00',
        maxCapacity: 35,
        bookedCount: 12
    },
    {
        id: 'slot-08',
        centerId: 'center-02',
        date: (0, exports.getFormattedDate)(0),
        timeWindow: '09:00-10:00',
        maxCapacity: 35,
        bookedCount: 15
    },
    // Today's slots for Bhopal Mandi
    {
        id: 'slot-09',
        centerId: 'center-03',
        date: (0, exports.getFormattedDate)(0),
        timeWindow: '09:00-10:00',
        maxCapacity: 25,
        bookedCount: 4
    },
    {
        id: 'slot-10',
        centerId: 'center-03',
        date: (0, exports.getFormattedDate)(0),
        timeWindow: '10:00-11:00',
        maxCapacity: 25,
        bookedCount: 6
    }
];
