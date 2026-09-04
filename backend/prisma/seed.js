"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedSlots = exports.seedCenters = exports.seedFarmers = void 0;
exports.main = main;
const client_1 = require("@prisma/client");
const crypto_1 = __importDefault(require("crypto"));
const prisma = new client_1.PrismaClient();
exports.seedFarmers = [
    {
        id: 'farmer-01',
        aadhaarHash: crypto_1.default.createHash('sha256').update('AADHAAR_9876_5432_1098').digest('hex'),
        name: 'रामेश कुमार (Ramesh Kumar)',
        phone: '+91 98765 43210',
        language: 'hi',
        landSize: 4.5,
        locationVillage: 'रनपुर (Ranpur, Kota)'
    },
    {
        id: 'farmer-02',
        aadhaarHash: crypto_1.default.createHash('sha256').update('AADHAAR_8765_4321_0987').digest('hex'),
        name: 'बलविंदर सिंह (Balwinder Singh)',
        phone: '+91 98123 45678',
        language: 'hi',
        landSize: 12.0,
        locationVillage: 'नीलोखेड़ी (Nilokheri, Karnal)'
    },
    {
        id: 'farmer-03',
        aadhaarHash: crypto_1.default.createHash('sha256').update('AADHAAR_7654_3210_9876').digest('hex'),
        name: 'सुरेश पटेल (Suresh Patel)',
        phone: '+91 97555 23456',
        language: 'hi',
        landSize: 7.2,
        locationVillage: 'बैरसिया (Berasia, Bhopal)'
    }
];
exports.seedCenters = [
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
    },
    {
        id: 'center-03',
        name: 'भोपाल करोंद कृषि मंडी (Bhopal Karond Mandi)',
        locationLat: 23.30,
        locationLng: 77.40,
        weighbridgeCount: 5,
        hourlyCapacity: 25
    }
];
// Generate dates starting from today
const getFormattedDate = (offsetDays = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split('T')[0];
};
exports.seedSlots = [
    // Today's slots for Kota Mandi
    {
        id: 'slot-01',
        centerId: 'center-01',
        date: getFormattedDate(0),
        timeWindow: '08:00-09:00',
        maxCapacity: 20,
        bookedCount: 5
    },
    {
        id: 'slot-02',
        centerId: 'center-01',
        date: getFormattedDate(0),
        timeWindow: '09:00-10:00',
        maxCapacity: 20,
        bookedCount: 18
    },
    {
        id: 'slot-03',
        centerId: 'center-01',
        date: getFormattedDate(0),
        timeWindow: '10:00-11:00',
        maxCapacity: 20,
        bookedCount: 8
    },
    {
        id: 'slot-04',
        centerId: 'center-01',
        date: getFormattedDate(0),
        timeWindow: '11:00-12:00',
        maxCapacity: 20,
        bookedCount: 20 // Fully booked test case
    },
    // Tomorrow's slots for Kota Mandi
    {
        id: 'slot-05',
        centerId: 'center-01',
        date: getFormattedDate(1),
        timeWindow: '09:00-10:00',
        maxCapacity: 20,
        bookedCount: 2
    },
    {
        id: 'slot-06',
        centerId: 'center-01',
        date: getFormattedDate(1),
        timeWindow: '10:00-11:00',
        maxCapacity: 20,
        bookedCount: 0
    },
    // Today's slots for Karnal Mandi
    {
        id: 'slot-07',
        centerId: 'center-02',
        date: getFormattedDate(0),
        timeWindow: '08:00-09:00',
        maxCapacity: 35,
        bookedCount: 12
    },
    {
        id: 'slot-08',
        centerId: 'center-02',
        date: getFormattedDate(0),
        timeWindow: '09:00-10:00',
        maxCapacity: 35,
        bookedCount: 15
    },
    // Today's slots for Bhopal Mandi
    {
        id: 'slot-09',
        centerId: 'center-03',
        date: getFormattedDate(0),
        timeWindow: '09:00-10:00',
        maxCapacity: 25,
        bookedCount: 4
    },
    {
        id: 'slot-10',
        centerId: 'center-03',
        date: getFormattedDate(0),
        timeWindow: '10:00-11:00',
        maxCapacity: 25,
        bookedCount: 6
    }
];
async function main() {
    console.log('Seeding Kisan Setu Database...');
    // 1. Seed Farmers
    for (const farmer of exports.seedFarmers) {
        await prisma.farmer.upsert({
            where: { id: farmer.id },
            update: farmer,
            create: farmer
        });
    }
    console.log(`Seeded ${exports.seedFarmers.length} farmers.`);
    // 2. Seed Procurement Centers
    for (const center of exports.seedCenters) {
        await prisma.procurementCenter.upsert({
            where: { id: center.id },
            update: center,
            create: center
        });
    }
    console.log(`Seeded ${exports.seedCenters.length} procurement centers.`);
    // 3. Seed Slots
    for (const slot of exports.seedSlots) {
        await prisma.slot.upsert({
            where: { id: slot.id },
            update: slot,
            create: slot
        });
    }
    console.log(`Seeded ${exports.seedSlots.length} slots.`);
    // 4. Create 1 sample booking with token hash
    const sampleTokenHash = crypto_1.default
        .createHash('sha256')
        .update(`farmer-01|center-01|slot-01|TRACTOR|WHEAT|50.0|INITIAL_SEED_TOKEN`)
        .digest('hex')
        .toUpperCase();
    const sampleBooking = await prisma.booking.upsert({
        where: { tokenHash: sampleTokenHash },
        update: {},
        create: {
            id: 'booking-seed-01',
            farmerId: 'farmer-01',
            slotId: 'slot-01',
            vehicleType: 'TRACTOR',
            cropType: 'गेहूं (Wheat)',
            estimatedWeight: 45.5,
            tokenHash: sampleTokenHash,
            status: 'BOOKED'
        }
    });
    console.log(`Seeded sample booking: ${sampleBooking.id} with token ${sampleTokenHash}`);
    console.log('Seed completed successfully.');
}
if (require.main === module) {
    main()
        .catch((e) => {
        console.error(e);
        process.exit(1);
    })
        .finally(async () => {
        await prisma.$disconnect();
    });
}
