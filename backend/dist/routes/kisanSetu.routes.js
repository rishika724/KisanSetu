"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const kisanSetu_controller_1 = require("../controllers/kisanSetu.controller");
const router = (0, express_1.Router)();
// Centers listing
router.get('/centers', kisanSetu_controller_1.getCenters);
// Slots with capacity checks
router.get('/slots/available', kisanSetu_controller_1.getAvailableSlots);
// Bookings creation (with SHA-256 encrypted offline token string)
router.post('/bookings', kisanSetu_controller_1.createBooking);
// Gate scanner token verification
router.get('/bookings/token/:tokenHash', kisanSetu_controller_1.verifyToken);
// All bookings query (with status & search filter for live yard queue & officer log)
router.get('/bookings', kisanSetu_controller_1.getAllBookings);
// Update booking status at Gate / Staging
router.patch('/bookings/:id/status', kisanSetu_controller_1.updateBookingStatus);
// Quality Inspection & Weighbridge Payout Settlement with Mock SMS
router.post('/inspections', kisanSetu_controller_1.createQualityInspection);
// Helper for UI demo selection
router.get('/farmers', kisanSetu_controller_1.getFarmers);
// Dynamic Capacity & Queue Engine
router.get('/queue/capacity', kisanSetu_controller_1.getQueueCapacity);
// Geofenced Buffer Staging State
router.post('/queue/geofence', kisanSetu_controller_1.checkGeofenceStatus);
// Offline Cryptographic Token Generator
router.post('/queue/generate-offline-token', kisanSetu_controller_1.generateOfflineTokenEndpoint);
exports.default = router;
