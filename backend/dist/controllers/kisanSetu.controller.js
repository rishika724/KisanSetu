"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCenters = getCenters;
exports.getAvailableSlots = getAvailableSlots;
exports.createBooking = createBooking;
exports.verifyToken = verifyToken;
exports.updateBookingStatus = updateBookingStatus;
exports.getFarmers = getFarmers;
exports.registerFarmer = registerFarmer;
exports.verifyFarmer = verifyFarmer;
exports.sendNotification = sendNotification;
exports.getQueueCapacity = getQueueCapacity;
exports.checkGeofenceStatus = checkGeofenceStatus;
exports.generateOfflineTokenEndpoint = generateOfflineTokenEndpoint;
exports.getAllBookings = getAllBookings;
exports.createQualityInspection = createQualityInspection;
const crypto_1 = __importDefault(require("crypto"));
const prisma_1 = require("../prisma");
const dbStore_1 = require("../dbStore");
const token_service_1 = require("../services/token.service");
const notification_service_1 = require("../services/notification.service");
const kisanSetuQueueEngine_1 = require("../services/kisanSetuQueueEngine");
/**
 * GET /api/kisan-setu/centers
 * List all procurement centers
 */
async function getCenters(req, res) {
    try {
        if ((0, prisma_1.isDbActive)()) {
            const centers = await prisma_1.prisma.procurementCenter.findMany({
                include: {
                    _count: {
                        select: { slots: true }
                    }
                },
                orderBy: { name: 'asc' }
            });
            return res.json({ success: true, count: centers.length, data: centers });
        }
        else {
            // Memory store fallback
            const data = dbStore_1.memoryStore.centers.map((c) => ({
                ...c,
                _count: {
                    slots: dbStore_1.memoryStore.slots.filter((s) => s.centerId === c.id).length
                }
            }));
            return res.json({ success: true, count: data.length, data, isMock: true });
        }
    }
    catch (error) {
        console.error('Error fetching centers:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch centers', error: error.message });
    }
}
/**
 * GET /api/kisan-setu/slots/available?centerId=&date=
 * Fetch available slots with capacity checks
 */
async function getAvailableSlots(req, res) {
    try {
        const centerId = req.query.centerId;
        const date = req.query.date || new Date().toISOString().split('T')[0];
        if (!centerId) {
            return res.status(400).json({ success: false, message: 'centerId query parameter is required' });
        }
        if ((0, prisma_1.isDbActive)()) {
            const slots = await prisma_1.prisma.slot.findMany({
                where: {
                    centerId,
                    date
                },
                include: {
                    center: {
                        select: { name: true, hourlyCapacity: true, weighbridgeCount: true }
                    }
                },
                orderBy: { timeWindow: 'asc' }
            });
            const formatted = slots.map((s) => ({
                ...s,
                remainingCapacity: Math.max(0, s.maxCapacity - s.bookedCount),
                isAvailable: s.bookedCount < s.maxCapacity,
                utilizationPercentage: Math.round((s.bookedCount / s.maxCapacity) * 100)
            }));
            return res.json({ success: true, centerId, date, count: formatted.length, data: formatted });
        }
        else {
            // Memory store fallback
            const filtered = dbStore_1.memoryStore.slots.filter((s) => s.centerId === centerId && s.date === date);
            const center = dbStore_1.memoryStore.centers.find((c) => c.id === centerId);
            const formatted = filtered.map((s) => ({
                ...s,
                center: center ? { name: center.name, hourlyCapacity: center.hourlyCapacity, weighbridgeCount: center.weighbridgeCount } : undefined,
                remainingCapacity: Math.max(0, s.maxCapacity - s.bookedCount),
                isAvailable: s.bookedCount < s.maxCapacity,
                utilizationPercentage: Math.round((s.bookedCount / s.maxCapacity) * 100)
            }));
            return res.json({ success: true, centerId, date, count: formatted.length, data: formatted, isMock: true });
        }
    }
    catch (error) {
        console.error('Error fetching available slots:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch slots', error: error.message });
    }
}
/**
 * POST /api/kisan-setu/bookings
 * Create a booking and generate a SHA-256 encrypted offline token string
 */
async function createBooking(req, res) {
    try {
        const { farmerId, slotId, vehicleType, cropType, estimatedWeight, notificationPreferences } = req.body;
        // Validate inputs
        if (!farmerId || !slotId || !vehicleType || !cropType || !estimatedWeight) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: farmerId, slotId, vehicleType, cropType, estimatedWeight'
            });
        }
        const validVehicles = ['TRACTOR', 'BULLOCK_CART', 'TRUCK'];
        if (!validVehicles.includes(vehicleType)) {
            return res.status(400).json({
                success: false,
                message: `Invalid vehicleType. Allowed values: ${validVehicles.join(', ')}`
            });
        }
        const parsedWeight = parseFloat(estimatedWeight);
        if (isNaN(parsedWeight) || parsedWeight <= 0) {
            return res.status(400).json({
                success: false,
                message: 'estimatedWeight must be a positive number'
            });
        }
        if ((0, prisma_1.isDbActive)()) {
            // 1. Check Slot & Capacity in DB
            const slot = await prisma_1.prisma.slot.findUnique({
                where: { id: slotId },
                include: { center: true }
            });
            if (!slot) {
                return res.status(404).json({ success: false, message: 'Slot not found' });
            }
            if (slot.bookedCount >= slot.maxCapacity) {
                return res.status(409).json({
                    success: false,
                    message: 'Slot capacity reached. Please choose another slot window.'
                });
            }
            // 2. Fetch the verified farmer selected during registration
            const farmer = await prisma_1.prisma.farmer.findUnique({
                where: { id: farmerId }
            });
            if (!farmer) {
                return res.status(404).json({ success: false, message: 'Farmer not found' });
            }
            // 3. Generate SHA-256 encrypted offline token string
            const tokenPackage = (0, token_service_1.createOfflineTokenPackage)({
                farmerId: farmer.id,
                farmerAadhaarHash: farmer.aadhaarHash,
                centerId: slot.centerId,
                slotId: slot.id,
                vehicleType,
                cropType,
                estimatedWeight: parsedWeight
            });
            // 4. Atomic transaction: create booking and increment bookedCount
            const [newBooking] = await prisma_1.prisma.$transaction([
                prisma_1.prisma.booking.create({
                    data: {
                        farmerId: farmer.id,
                        slotId: slot.id,
                        vehicleType,
                        cropType,
                        estimatedWeight: parsedWeight,
                        tokenHash: tokenPackage.tokenHash,
                        status: 'BOOKED'
                    },
                    include: {
                        farmer: true,
                        slot: {
                            include: { center: true }
                        }
                    }
                }),
                prisma_1.prisma.slot.update({
                    where: { id: slotId },
                    data: { bookedCount: { increment: 1 } }
                })
            ]);
            const notificationResults = await (0, notification_service_1.dispatchNotification)({
                phone: newBooking.farmer.phoneno,
                preferences: notificationPreferences,
                template: 'bookingConfirmation',
                values: {
                    name: newBooking.farmer.name,
                    mandiName: newBooking.slot.center.name,
                    date: newBooking.slot.date,
                    time: newBooking.slot.timeWindow,
                    token: tokenPackage.tokenHash,
                    passLink: `${process.env.FRONTEND_URL || 'http://localhost:3000'}?tab=offlinePass`
                }
            });
            return res.status(201).json({
                success: true,
                message: 'Booking created successfully with SHA-256 offline token',
                data: {
                    booking: newBooking,
                    token: tokenPackage,
                    notifications: notificationResults
                }
            });
        }
        else {
            // Memory Store fallback
            const slot = dbStore_1.memoryStore.slots.find((s) => s.id === slotId);
            if (!slot) {
                return res.status(404).json({ success: false, message: 'Slot not found' });
            }
            if (slot.bookedCount >= slot.maxCapacity) {
                return res.status(409).json({
                    success: false,
                    message: 'Slot capacity reached. Please choose another slot window.'
                });
            }
            const farmer = dbStore_1.memoryStore.farmers.find((f) => f.id === farmerId);
            if (!farmer) {
                return res.status(404).json({ success: false, message: 'Farmer not found. Register or verify the farmer first.' });
            }
            const center = dbStore_1.memoryStore.centers.find((c) => c.id === slot.centerId);
            const tokenPackage = (0, token_service_1.createOfflineTokenPackage)({
                farmerId: farmer.id,
                farmerAadhaarHash: farmer.aadhaarHash,
                centerId: slot.centerId,
                slotId: slot.id,
                vehicleType,
                cropType,
                estimatedWeight: parsedWeight
            });
            // Increment bookedCount
            slot.bookedCount += 1;
            const newBooking = {
                id: `booking-${Date.now()}`,
                farmerId: farmer.id,
                slotId: slot.id,
                vehicleType,
                cropType,
                estimatedWeight: parsedWeight,
                tokenHash: tokenPackage.tokenHash,
                status: 'BOOKED',
                createdAt: new Date().toISOString(),
                farmer,
                slot: {
                    ...slot,
                    center
                }
            };
            dbStore_1.memoryStore.bookings.push(newBooking);
            const notificationResults = await (0, notification_service_1.dispatchNotification)({
                phone: farmer.phoneno,
                preferences: notificationPreferences,
                template: 'bookingConfirmation',
                values: {
                    name: farmer.name,
                    mandiName: center?.name || 'Mandi Center',
                    date: slot.date,
                    time: slot.timeWindow,
                    token: tokenPackage.tokenHash,
                    passLink: `${process.env.FRONTEND_URL || 'http://localhost:3000'}?tab=offlinePass`
                }
            });
            return res.status(201).json({
                success: true,
                message: 'Booking created successfully with SHA-256 offline token',
                data: {
                    booking: newBooking,
                    token: tokenPackage,
                    notifications: notificationResults
                },
                isMock: true
            });
        }
    }
    catch (error) {
        console.error('Error creating booking:', error);
        return res.status(500).json({ success: false, message: 'Failed to create booking', error: error.message });
    }
}
/**
 * GET /api/kisan-setu/bookings/token/:tokenHash
 * Verify token details for Mandi Gate scanner
 */
async function verifyToken(req, res) {
    try {
        const rawTokenHash = req.params.tokenHash;
        if (!rawTokenHash) {
            return res.status(400).json({ success: false, message: 'tokenHash parameter is required' });
        }
        const tokenHash = rawTokenHash.trim().toUpperCase();
        if ((0, prisma_1.isDbActive)()) {
            const booking = await prisma_1.prisma.booking.findUnique({
                where: { tokenHash },
                include: {
                    farmer: {
                        select: {
                            id: true,
                            name: true,
                            phoneno: true,
                            aadhaarHash: true,
                            locationVillage: true,
                            landSize: true,
                            language: true
                        }
                    },
                    slot: {
                        include: {
                            center: true
                        }
                    },
                    qualityInspection: true
                }
            });
            if (!booking) {
                return res.status(404).json({
                    success: false,
                    verified: false,
                    message: 'Invalid or unregistered token hash. Vehicle entry denied.'
                });
            }
            const notificationResults = await (0, notification_service_1.dispatchNotification)({
                phone: booking.farmer.phoneno,
                template: 'gateEntry',
                values: {
                    vehicleNo: booking.vehicleType,
                    mandiName: booking.slot.center.name,
                    position: 1
                }
            });
            return res.json({
                success: true,
                verified: true,
                message: 'Token verified successfully for Mandi Gate entry.',
                data: {
                    bookingId: booking.id,
                    tokenHash: booking.tokenHash,
                    status: booking.status,
                    vehicleType: booking.vehicleType,
                    cropType: booking.cropType,
                    estimatedWeight: booking.estimatedWeight,
                    createdAt: booking.createdAt,
                    farmer: booking.farmer,
                    slot: {
                        date: booking.slot.date,
                        timeWindow: booking.slot.timeWindow
                    },
                    center: {
                        name: booking.slot.center.name,
                        weighbridgeCount: booking.slot.center.weighbridgeCount
                    },
                    qualityInspection: booking.qualityInspection,
                    notifications: notificationResults
                }
            });
        }
        else {
            // Memory store fallback
            const booking = dbStore_1.memoryStore.bookings.find((b) => b.tokenHash.toUpperCase() === tokenHash);
            if (!booking) {
                return res.status(404).json({
                    success: false,
                    verified: false,
                    message: 'Invalid or unregistered token hash. Vehicle entry denied.',
                    isMock: true
                });
            }
            const farmer = dbStore_1.memoryStore.farmers.find((f) => f.id === booking.farmerId) || booking.farmer;
            const slot = dbStore_1.memoryStore.slots.find((s) => s.id === booking.slotId) || booking.slot;
            const center = slot ? dbStore_1.memoryStore.centers.find((c) => c.id === slot.centerId) : null;
            const notificationResults = await (0, notification_service_1.dispatchNotification)({
                phone: farmer?.phoneno || '',
                template: 'gateEntry',
                values: {
                    vehicleNo: booking.vehicleType,
                    mandiName: center?.name || 'Mandi Center',
                    position: 1
                }
            });
            return res.json({
                success: true,
                verified: true,
                message: 'Token verified successfully for Mandi Gate entry.',
                data: {
                    bookingId: booking.id,
                    tokenHash: booking.tokenHash,
                    status: booking.status,
                    vehicleType: booking.vehicleType,
                    cropType: booking.cropType,
                    estimatedWeight: booking.estimatedWeight,
                    createdAt: booking.createdAt,
                    farmer: farmer
                        ? {
                            id: farmer.id,
                            name: farmer.name,
                            phoneno: farmer.phoneno,
                            aadhaarHash: farmer.aadhaarHash,
                            locationVillage: farmer.locationVillage,
                            landSize: farmer.landSize,
                            language: farmer.language
                        }
                        : null,
                    slot: slot
                        ? {
                            date: slot.date,
                            timeWindow: slot.timeWindow
                        }
                        : null,
                    center: center
                        ? {
                            name: center.name,
                            weighbridgeCount: center.weighbridgeCount
                        }
                        : null,
                    qualityInspection: null,
                    notifications: notificationResults
                },
                isMock: true
            });
        }
    }
    catch (error) {
        console.error('Error verifying token:', error);
        return res.status(500).json({ success: false, message: 'Failed to verify token', error: error.message });
    }
}
/**
 * PATCH /api/kisan-setu/bookings/:id/status
 * Gate Staff can update booking status (e.g., BOOKED -> MANDI_GATE -> STAGING -> COMPLETED)
 */
async function updateBookingStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const validStatuses = ['BOOKED', 'STAGING', 'MANDI_GATE', 'COMPLETED', 'CANCELLED'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Allowed values: ${validStatuses.join(', ')}`
            });
        }
        if ((0, prisma_1.isDbActive)()) {
            const updated = await prisma_1.prisma.booking.update({
                where: { id },
                data: { status: status }
            });
            return res.json({ success: true, message: 'Status updated successfully', data: updated });
        }
        else {
            const booking = dbStore_1.memoryStore.bookings.find((b) => b.id === id);
            if (!booking) {
                return res.status(404).json({ success: false, message: 'Booking not found' });
            }
            booking.status = status;
            return res.json({ success: true, message: 'Status updated successfully', data: booking, isMock: true });
        }
    }
    catch (error) {
        console.error('Error updating status:', error);
        return res.status(500).json({ success: false, message: 'Failed to update status', error: error.message });
    }
}
/**
 * GET /api/kisan-setu/farmers
 * Helper endpoint to list mock farmers for UI demo dropdown
 */
async function getFarmers(req, res) {
    try {
        if ((0, prisma_1.isDbActive)()) {
            const farmers = await prisma_1.prisma.farmer.findMany();
            return res.json({ success: true, data: farmers });
        }
        else {
            return res.json({ success: true, data: dbStore_1.memoryStore.farmers, isMock: true });
        }
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
/**
 * POST /api/kisan-setu/farmers/register
 * Register a farmer without persisting the raw Aadhaar number.
 */
async function registerFarmer(req, res) {
    try {
        const { name, phoneno, aadhaarNumber, village, crop, quantity, vehicleType } = req.body;
        const normalizedPhone = String(phoneno || '').replace(/\D/g, '');
        const normalizedAadhaar = String(aadhaarNumber || normalizedPhone).replace(/\D/g, '');
        if (!name?.trim() || !/^\d{10}$/.test(normalizedPhone)) {
            return res.status(400).json({
                success: false,
                message: 'name and phoneno (10 digits) are required'
            });
        }
        const aadhaarHash = crypto_1.default.createHash('sha256').update(normalizedAadhaar).digest('hex');
        if ((0, prisma_1.isDbActive)()) {
            const existing = await prisma_1.prisma.farmer.findFirst({
                where: { OR: [{ phoneno: normalizedPhone }, { aadhaarHash }] }
            });
            if (existing) {
                return res.status(409).json({ success: false, message: 'A farmer with this phone number or Aadhaar already exists', data: existing });
            }
            const farmer = await prisma_1.prisma.farmer.create({
                data: { name: name.trim(), phoneno: normalizedPhone, aadhaarHash }
            });
            return res.status(201).json({ success: true, data: farmer });
        }
        const existing = dbStore_1.memoryStore.farmers.find((farmer) => farmer.phoneno === normalizedPhone || farmer.aadhaarHash === aadhaarHash);
        if (existing) {
            return res.status(409).json({ success: false, message: 'A farmer with this phone number or Aadhaar already exists', data: existing, isMock: true });
        }
        const farmer = {
            id: crypto_1.default.randomUUID(),
            aadhaarHash,
            name: name.trim(),
            phoneno: normalizedPhone,
            language: 'hi',
            locationVillage: village?.trim() || undefined,
            primaryCrop: crop || undefined,
            approximateQuantity: Number(quantity) || undefined,
            vehicleType: vehicleType || undefined,
        };
        dbStore_1.memoryStore.farmers.push(farmer);
        return res.status(201).json({ success: true, data: farmer, isMock: true });
    }
    catch (error) {
        console.error('Error registering farmer:', error);
        return res.status(500).json({ success: false, message: 'Failed to register farmer', error: error.message });
    }
}
/**
 * GET /api/kisan-setu/farmers/verify?phoneno=
 */
async function verifyFarmer(req, res) {
    try {
        const normalizedPhone = String(req.query.phoneno || '').replace(/\D/g, '');
        if (!/^\d{10}$/.test(normalizedPhone)) {
            return res.status(400).json({ success: false, message: 'phoneno must contain 10 digits' });
        }
        const farmer = (0, prisma_1.isDbActive)()
            ? await prisma_1.prisma.farmer.findUnique({ where: { phoneno: normalizedPhone } })
            : dbStore_1.memoryStore.farmers.find((item) => item.phoneno === normalizedPhone);
        return res.json({ success: true, exists: Boolean(farmer), data: farmer || null, isMock: !(0, prisma_1.isDbActive)() });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to verify farmer', error: error.message });
    }
}
/** POST /api/kisan-setu/notify - demo/admin notification dispatcher */
async function sendNotification(req, res) {
    try {
        const { phone, language, preferences, template = 'bookingConfirmation', values = {} } = req.body;
        if (!phone)
            return res.status(400).json({ success: false, message: 'phone is required' });
        const notifications = await (0, notification_service_1.dispatchNotification)({ phone, language, preferences, template, values });
        return res.json({ success: true, data: notifications, isMock: notifications.some((item) => item.simulated) });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Notification dispatch failed', error: error.message });
    }
}
/**
 * GET /api/kisan-setu/queue/capacity
 * Dynamic capacity & queue congestion calculation
 */
async function getQueueCapacity(req, res) {
    try {
        const centerId = req.query.centerId || 'center-01';
        const date = req.query.date || new Date().toISOString().split('T')[0];
        const timeWindow = req.query.timeWindow || '09:00-10:00';
        const result = await (0, kisanSetuQueueEngine_1.calculateAvailableCapacity)(centerId, date, timeWindow);
        return res.json({
            success: true,
            data: result,
            unloadingBenchmarks: kisanSetuQueueEngine_1.UNLOADING_DURATIONS_MINUTES
        });
    }
    catch (error) {
        console.error('Error in getQueueCapacity:', error);
        return res.status(500).json({ success: false, message: 'Failed to calculate queue capacity', error: error.message });
    }
}
/**
 * POST /api/kisan-setu/queue/geofence
 * Geofenced buffer staging evaluation
 */
async function checkGeofenceStatus(req, res) {
    try {
        const { farmerLat, farmerLng, centerLat, centerLng, centerId, bookingId } = req.body;
        if (farmerLat === undefined || farmerLng === undefined) {
            return res.status(400).json({ success: false, message: 'farmerLat and farmerLng are required' });
        }
        let targetCenterLat = centerLat;
        let targetCenterLng = centerLng;
        // If center coordinates not provided directly, lookup by centerId
        if (targetCenterLat === undefined || targetCenterLng === undefined) {
            const resolvedCenterId = centerId || 'center-01';
            if ((0, prisma_1.isDbActive)()) {
                const center = await prisma_1.prisma.procurementCenter.findUnique({ where: { id: resolvedCenterId } });
                if (center) {
                    targetCenterLat = center.locationLat;
                    targetCenterLng = center.locationLng;
                }
            }
            else {
                const center = dbStore_1.memoryStore.centers.find((c) => c.id === resolvedCenterId);
                if (center) {
                    targetCenterLat = center.locationLat;
                    targetCenterLng = center.locationLng;
                }
            }
        }
        // Default fallback to Kota Mandi coordinates if needed
        if (targetCenterLat === undefined || targetCenterLng === undefined) {
            targetCenterLat = 25.18;
            targetCenterLng = 75.83;
        }
        const state = (0, kisanSetuQueueEngine_1.updateFarmerQueueState)(parseFloat(farmerLat), parseFloat(farmerLng), parseFloat(targetCenterLat), parseFloat(targetCenterLng));
        // If a bookingId is provided and status changed, update the booking status in the DB/memory
        if (bookingId) {
            if ((0, prisma_1.isDbActive)()) {
                await prisma_1.prisma.booking.update({
                    where: { id: bookingId },
                    data: { status: state.status }
                }).catch(() => { });
            }
            else {
                const b = dbStore_1.memoryStore.bookings.find((item) => item.id === bookingId);
                if (b) {
                    b.status = state.status;
                }
            }
        }
        return res.json({
            success: true,
            data: {
                ...state,
                centerCoordinates: { lat: targetCenterLat, lng: targetCenterLng },
                farmerCoordinates: { lat: farmerLat, lng: farmerLng }
            }
        });
    }
    catch (error) {
        console.error('Error in checkGeofenceStatus:', error);
        return res.status(500).json({ success: false, message: 'Failed to evaluate geofence state', error: error.message });
    }
}
/**
 * POST /api/kisan-setu/queue/generate-offline-token
 * Direct offline SHA-256 cryptographic token generator
 */
async function generateOfflineTokenEndpoint(req, res) {
    try {
        const { farmerId, slotId, timestamp } = req.body;
        if (!farmerId || !slotId) {
            return res.status(400).json({
                success: false,
                message: 'farmerId and slotId are required'
            });
        }
        const tokenData = (0, kisanSetuQueueEngine_1.generateKisanSetuOfflineToken)(farmerId, slotId, timestamp ? parseInt(timestamp, 10) : undefined);
        return res.json({
            success: true,
            message: 'Offline cryptographic SHA-256 token generated successfully',
            data: tokenData
        });
    }
    catch (error) {
        console.error('Error generating offline token:', error);
        return res.status(500).json({ success: false, message: 'Token generation failed', error: error.message });
    }
}
/**
 * GET /api/kisan-setu/bookings
 * List all bookings with optional filtering by status and search query
 */
async function getAllBookings(req, res) {
    try {
        const status = req.query.status;
        const search = (req.query.search || '').toLowerCase().trim();
        if ((0, prisma_1.isDbActive)()) {
            const whereClause = {};
            if (status && status !== 'ALL') {
                whereClause.status = status;
            }
            const bookings = await prisma_1.prisma.booking.findMany({
                where: whereClause,
                include: {
                    farmer: true,
                    slot: {
                        include: { center: true }
                    },
                    qualityInspection: true
                },
                orderBy: { createdAt: 'desc' }
            });
            let filtered = bookings;
            if (search) {
                filtered = bookings.filter((b) => (b.farmer?.name || '').toLowerCase().includes(search) ||
                    (b.vehicleType || '').toLowerCase().includes(search) ||
                    (b.cropType || '').toLowerCase().includes(search) ||
                    (b.tokenHash || '').toLowerCase().includes(search) ||
                    (b.id || '').toLowerCase().includes(search));
            }
            return res.json({ success: true, count: filtered.length, data: filtered });
        }
        else {
            let bookings = [...dbStore_1.memoryStore.bookings];
            if (status && status !== 'ALL') {
                bookings = bookings.filter((b) => b.status === status);
            }
            if (search) {
                bookings = bookings.filter((b) => {
                    const farmerName = b.farmer?.name || '';
                    return (farmerName.toLowerCase().includes(search) ||
                        (b.vehicleType || '').toLowerCase().includes(search) ||
                        (b.cropType || '').toLowerCase().includes(search) ||
                        (b.tokenHash || '').toLowerCase().includes(search) ||
                        (b.id || '').toLowerCase().includes(search));
                });
            }
            bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            return res.json({ success: true, count: bookings.length, data: bookings, isMock: true });
        }
    }
    catch (error) {
        console.error('Error fetching bookings:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch bookings', error: error.message });
    }
}
/**
 * POST /api/kisan-setu/inspections
 * Submit quality inspection & weighbridge data, calculate payout, mark booking as COMPLETED, and issue mock SMS
 */
async function createQualityInspection(req, res) {
    try {
        const { bookingId, moistureLevel, dockageGrade, approvedWeight, mspRate = 2275, inspectorId = 'OFFICER-KOTA-04' } = req.body;
        if (!bookingId || moistureLevel === undefined || !dockageGrade || approvedWeight === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: bookingId, moistureLevel, dockageGrade, approvedWeight'
            });
        }
        const moisture = parseFloat(moistureLevel);
        const weight = parseFloat(approvedWeight);
        const msp = parseFloat(mspRate) || 2275;
        // Real-time Payout calculation:
        // Total Payout = (Approved Weight * Govt MSP Rate) - Moisture Penalty
        // Standard moisture threshold: 12.0%
        const excessMoisture = Math.max(0, moisture - 12.0);
        const moisturePenalty = Math.round(weight * msp * (excessMoisture / 100) * 100) / 100;
        const grossValue = Math.round(weight * msp * 100) / 100;
        const totalPayout = Math.max(0, Math.round((grossValue - moisturePenalty) * 100) / 100);
        const inspectionRecord = {
            id: `insp-${Date.now()}`,
            bookingId,
            moistureLevel: moisture,
            dockageGrade,
            approvedWeight: weight,
            mspRate: msp,
            moisturePenalty,
            grossValue,
            totalPayout,
            inspectorId,
            verifiedAt: new Date().toISOString()
        };
        let updatedBooking = null;
        if ((0, prisma_1.isDbActive)()) {
            const [insp, booking] = await prisma_1.prisma.$transaction([
                prisma_1.prisma.qualityInspection.upsert({
                    where: { bookingId },
                    create: {
                        bookingId,
                        moistureLevel: moisture,
                        dockageGrade,
                        approvedWeight: weight,
                        totalPayout,
                        inspectorId
                    },
                    update: {
                        moistureLevel: moisture,
                        dockageGrade,
                        approvedWeight: weight,
                        totalPayout,
                        inspectorId
                    }
                }),
                prisma_1.prisma.booking.update({
                    where: { id: bookingId },
                    data: { status: 'COMPLETED' },
                    include: { farmer: true, slot: { include: { center: true } } }
                })
            ]);
            updatedBooking = booking;
        }
        else {
            const b = dbStore_1.memoryStore.bookings.find((item) => item.id === bookingId);
            if (b) {
                b.status = 'COMPLETED';
                b.qualityInspection = inspectionRecord;
                updatedBooking = b;
            }
        }
        const farmerName = updatedBooking?.farmer?.name || 'Farmer';
        const farmerPhone = updatedBooking?.farmer?.phoneno || '9876543210';
        const receiptNumber = `REC-KS-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
        const mockSmsPayload = {
            recipientPhone: farmerPhone,
            farmerName,
            messageText: `Kisan Setu Alert: Your produce has been successfully inspected & weighed at ${updatedBooking?.slot?.center?.name || 'Mandi Center'}. Receipt #${receiptNumber}. Net Approved Weight: ${weight} Quintals. Total MSP Payout: Rs. ${totalPayout.toLocaleString('en-IN')}. Direct Benefit Transfer initiated to your linked Bank A/c. Gate Inspector: ${inspectorId}. Helpline: 1800-180-1551.`,
            dispatchedAt: new Date().toISOString(),
            receiptNumber,
            dbtStatus: 'INITIATED'
        };
        const notificationResults = await (0, notification_service_1.dispatchNotification)({
            phone: farmerPhone,
            template: 'paymentReceipt',
            values: { weight, payout: totalPayout.toLocaleString('en-IN') }
        });
        return res.status(200).json({
            success: true,
            message: 'Quality inspection approved and receipt issued successfully.',
            data: {
                inspection: inspectionRecord,
                booking: updatedBooking,
                receipt: {
                    receiptNumber,
                    farmerName,
                    farmerPhone,
                    vehicleType: updatedBooking?.vehicleType,
                    cropType: updatedBooking?.cropType,
                    approvedWeight: weight,
                    moistureLevel: moisture,
                    dockageGrade,
                    mspRate: msp,
                    grossValue,
                    moisturePenalty,
                    totalPayout,
                    inspectorId,
                    issuedAt: new Date().toISOString()
                },
                mockSms: mockSmsPayload,
                notifications: notificationResults
            },
            isMock: !(0, prisma_1.isDbActive)()
        });
    }
    catch (error) {
        console.error('Error in createQualityInspection:', error);
        return res.status(500).json({ success: false, message: 'Failed to create quality inspection', error: error.message });
    }
}
