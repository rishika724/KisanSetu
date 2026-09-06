import { Router } from 'express';
import {
  getCenters,
  getAvailableSlots,
  createBooking,
  verifyToken,
  updateBookingStatus,
  getFarmers,
  getQueueCapacity,
  checkGeofenceStatus,
  generateOfflineTokenEndpoint,
  getAllBookings,
  createQualityInspection,
  registerFarmer,
  verifyFarmer,
  sendNotification
} from '../controllers/kisanSetu.controller';

const router = Router();

// Centers listing
router.get('/centers', getCenters);

// Slots with capacity checks
router.get('/slots/available', getAvailableSlots);

// Bookings creation (with SHA-256 encrypted offline token string)
router.post('/bookings', createBooking);

// Gate scanner token verification
router.get('/bookings/token/:tokenHash', verifyToken);

// All bookings query (with status & search filter for live yard queue & officer log)
router.get('/bookings', getAllBookings);

// Update booking status at Gate / Staging
router.patch('/bookings/:id/status', updateBookingStatus);

// Quality Inspection & Weighbridge Payout Settlement with Mock SMS
router.post('/inspections', createQualityInspection);

// Helper for UI demo selection
router.get('/farmers', getFarmers);
router.post('/farmers/register', registerFarmer);
router.get('/farmers/verify', verifyFarmer);
router.post('/notify', sendNotification);

// Dynamic Capacity & Queue Engine
router.get('/queue/capacity', getQueueCapacity);

// Geofenced Buffer Staging State
router.post('/queue/geofence', checkGeofenceStatus);

// Offline Cryptographic Token Generator
router.post('/queue/generate-offline-token', generateOfflineTokenEndpoint);

export default router;
