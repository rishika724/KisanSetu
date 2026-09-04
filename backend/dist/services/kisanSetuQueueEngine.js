"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UNLOADING_DURATIONS_MINUTES = void 0;
exports.calculateHaversineDistance = calculateHaversineDistance;
exports.calculateAvailableCapacity = calculateAvailableCapacity;
exports.updateFarmerQueueState = updateFarmerQueueState;
exports.generateKisanSetuOfflineToken = generateKisanSetuOfflineToken;
const crypto_1 = __importDefault(require("crypto"));
const prisma_1 = require("../prisma");
const dbStore_1 = require("../dbStore");
/**
 * Standard unloading speeds specified for Mandi weighbridges and unloading bays
 */
exports.UNLOADING_DURATIONS_MINUTES = {
    BULLOCK_CART: 25,
    TRACTOR: 15,
    TRUCK: 10
};
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'kisan-setu-sih-secret-2026-secure-offline-seed';
/**
 * Computes distance in kilometers between two GPS coordinates using the Haversine formula.
 */
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
/**
 * 1. Dynamic Capacity & Queue Engine:
 * Calculates hourly slot limits based on center weighbridge capacity and vehicle unloading speeds:
 * - BULLOCK_CART = 25 mins
 * - TRACTOR = 15 mins
 * - TRUCK = 10 mins
 * Prevents overbooking and automatically flags queue congestion.
 */
async function calculateAvailableCapacity(centerId, date, timeWindow) {
    let centerName = 'Procurement Center';
    let weighbridgeCount = 4;
    let bookings = [];
    if ((0, prisma_1.isDbActive)()) {
        const center = await prisma_1.prisma.procurementCenter.findUnique({
            where: { id: centerId }
        });
        if (center) {
            centerName = center.name;
            weighbridgeCount = center.weighbridgeCount;
        }
        const slot = await prisma_1.prisma.slot.findFirst({
            where: { centerId, date, timeWindow },
            include: { bookings: { select: { vehicleType: true, status: true } } }
        });
        if (slot) {
            bookings = slot.bookings.filter((b) => b.status !== 'CANCELLED');
        }
    }
    else {
        // Memory store fallback
        const center = dbStore_1.memoryStore.centers.find((c) => c.id === centerId);
        if (center) {
            centerName = center.name;
            weighbridgeCount = center.weighbridgeCount;
        }
        const slot = dbStore_1.memoryStore.slots.find((s) => s.centerId === centerId && s.date === date && s.timeWindow === timeWindow);
        if (slot) {
            bookings = dbStore_1.memoryStore.bookings
                .filter((b) => b.slotId === slot.id && b.status !== 'CANCELLED')
                .map((b) => ({ vehicleType: b.vehicleType }));
        }
    }
    // 60 minutes per hour window per weighbridge
    const totalWeighbridgeMinutes = weighbridgeCount * 60;
    // Breakdown of vehicle counts
    const breakdown = {
        BULLOCK_CART: 0,
        TRACTOR: 0,
        TRUCK: 0
    };
    let usedMinutes = 0;
    for (const b of bookings) {
        const type = b.vehicleType;
        if (exports.UNLOADING_DURATIONS_MINUTES[type]) {
            usedMinutes += exports.UNLOADING_DURATIONS_MINUTES[type];
            if (type in breakdown) {
                breakdown[type]++;
            }
        }
        else {
            // Default to Tractor (15m) if unspecified
            usedMinutes += 15;
            breakdown.TRACTOR++;
        }
    }
    const remainingMinutes = Math.max(0, totalWeighbridgeMinutes - usedMinutes);
    const utilizationPercentage = Math.min(100, Math.round((usedMinutes / totalWeighbridgeMinutes) * 100));
    // Determine congestion level
    let congestionLevel = 'NORMAL';
    if (utilizationPercentage > 85) {
        congestionLevel = 'CONGESTED';
    }
    else if (utilizationPercentage >= 60) {
        congestionLevel = 'MODERATE';
    }
    const isOverbooked = usedMinutes >= totalWeighbridgeMinutes;
    // Check if each vehicle type can be safely accommodated
    const canAcceptVehicle = {
        BULLOCK_CART: remainingMinutes >= exports.UNLOADING_DURATIONS_MINUTES.BULLOCK_CART,
        TRACTOR: remainingMinutes >= exports.UNLOADING_DURATIONS_MINUTES.TRACTOR,
        TRUCK: remainingMinutes >= exports.UNLOADING_DURATIONS_MINUTES.TRUCK
    };
    // Estimated wait time based on queue depth per weighbridge
    const averageQueueDepthPerScale = bookings.length / (weighbridgeCount || 1);
    const estimatedWaitMinutes = Math.round(averageQueueDepthPerScale * 8);
    return {
        centerId,
        centerName,
        date,
        timeWindow,
        weighbridgeCount,
        totalWeighbridgeMinutes,
        usedMinutes,
        remainingMinutes,
        utilizationPercentage,
        congestionLevel,
        isOverbooked,
        canAcceptVehicle,
        estimatedWaitMinutes,
        activeBookingsCount: bookings.length,
        bookingsBreakdown: breakdown
    };
}
/**
 * 2. Geofenced Buffer Staging Engine:
 * Implements `updateFarmerQueueState(farmerLat, farmerLng, centerLat, centerLng)`:
 * - Distance > 5 km -> Status: 'BOOKED' (At Home)
 * - Distance between 500m and 5 km -> Status: 'STAGING' (In Kisan Setu Buffer Yard)
 * - Distance < 500m -> Status: 'MANDI_GATE' (Ready for Scanning)
 */
function updateFarmerQueueState(farmerLat, farmerLng, centerLat, centerLng) {
    const distanceKm = calculateHaversineDistance(farmerLat, farmerLng, centerLat, centerLng);
    const distanceMeters = Math.round(distanceKm * 1000);
    if (distanceKm > 5) {
        return {
            status: 'BOOKED',
            stageIndex: 0,
            distanceKm: parseFloat(distanceKm.toFixed(2)),
            distanceMeters,
            stageLabel: {
                en: 'At Home (En Route to Mandi)',
                hi: 'घर पर (मंडी की ओर प्रस्थान के लिए तैयार)'
            },
            instructions: {
                en: 'You are outside the buffer zone (>5 km). Please proceed towards the Kisan Setu Buffer Yard as per your scheduled slot.',
                hi: 'आप बफर क्षेत्र (5 किमी) से बाहर हैं। कृपया अपने स्लॉट समय के अनुसार किसान सेतु बफर यार्ड की ओर प्रस्थान करें।'
            }
        };
    }
    else if (distanceKm >= 0.5) {
        return {
            status: 'STAGING',
            stageIndex: 1,
            distanceKm: parseFloat(distanceKm.toFixed(2)),
            distanceMeters,
            stageLabel: {
                en: 'In Buffer Yard (Holding & Staging)',
                hi: 'किसान सेतु बफर यार्ड में (स्टेजिंग क्षेत्र)'
            },
            instructions: {
                en: 'Vehicle detected inside buffer staging zone (500m - 5km). Wait for green signal before advancing to Mandi Gate.',
                hi: 'वाहन बफर यार्ड (500मी - 5किमी) में दर्ज। मुख्य गेट पर जाम से बचने के लिए हरी बत्ती की प्रतीक्षा करें।'
            }
        };
    }
    else {
        return {
            status: 'MANDI_GATE',
            stageIndex: 2,
            distanceKm: parseFloat(distanceKm.toFixed(2)),
            distanceMeters,
            stageLabel: {
                en: 'Ready for Mandi Gate Scanning',
                hi: 'मंडी गेट पर उपस्थित (स्कैनिंग हेतु तैयार)'
            },
            instructions: {
                en: 'You have entered Mandi Gate perimeter (<500m). Present your offline QR code token to the gate security officer.',
                hi: 'आप मुख्य गेट (500मी के भीतर) पहुंच चुके हैं। सुरक्षा अधिकारी को अपना ऑफलाइन क्यूआर कोड या टोकन संख्या दिखाएं।'
            }
        };
    }
}
/**
 * 3. Offline Cryptographic Token Generator:
 * Generates a secure SHA-256 encrypted token hash scannable without active database connectivity.
 */
function generateKisanSetuOfflineToken(farmerId, slotId, timestamp = Date.now()) {
    // Deterministic raw message incorporating farmer, slot, and timestamp
    const rawMessage = `${farmerId}|${slotId}|${timestamp}|${TOKEN_SECRET}`;
    // Generate 64-character SHA-256 hash
    const tokenHash = crypto_1.default.createHash('sha256').update(rawMessage).digest('hex').toUpperCase();
    // Compact offline verifiable token string (Prefix KS-26032 + first 16 bytes of SHA-256)
    const offlineString = `KS-26032-${tokenHash.slice(0, 16)}`;
    // Standalone QR code payload containing cryptographic checksum
    const qrPayload = JSON.stringify({
        app: 'KISAN_SETU',
        sih: '26032',
        fid: farmerId,
        sid: slotId,
        ts: timestamp,
        th: tokenHash,
        sig: offlineString
    });
    return {
        tokenHash,
        offlineString,
        timestamp,
        qrPayload,
        algorithm: 'SHA-256'
    };
}
