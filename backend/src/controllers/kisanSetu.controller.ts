import { Request, Response } from 'express';
import { prisma, isDbActive } from '../prisma';
import { memoryStore } from '../dbStore';
import { createOfflineTokenPackage, generateTokenHash } from '../services/token.service';
import {
  calculateAvailableCapacity,
  updateFarmerQueueState,
  generateKisanSetuOfflineToken,
  UNLOADING_DURATIONS_MINUTES
} from '../services/kisanSetuQueueEngine';

/**
 * GET /api/kisan-setu/centers
 * List all procurement centers
 */
export async function getCenters(req: Request, res: Response) {
  try {
    if (isDbActive()) {
      const centers = await prisma.procurementCenter.findMany({
        include: {
          _count: {
            select: { slots: true }
          }
        },
        orderBy: { name: 'asc' }
      });
      return res.json({ success: true, count: centers.length, data: centers });
    } else {
      // Memory store fallback
      const data = memoryStore.centers.map((c) => ({
        ...c,
        _count: {
          slots: memoryStore.slots.filter((s) => s.centerId === c.id).length
        }
      }));
      return res.json({ success: true, count: data.length, data, isMock: true });
    }
  } catch (error: any) {
    console.error('Error fetching centers:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch centers', error: error.message });
  }
}

/**
 * GET /api/kisan-setu/slots/available?centerId=&date=
 * Fetch available slots with capacity checks
 */
export async function getAvailableSlots(req: Request, res: Response) {
  try {
    const centerId = req.query.centerId as string;
    const date = (req.query.date as string) || new Date().toISOString().split('T')[0];

    if (!centerId) {
      return res.status(400).json({ success: false, message: 'centerId query parameter is required' });
    }

    if (isDbActive()) {
      const slots = await prisma.slot.findMany({
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
    } else {
      // Memory store fallback
      const filtered = memoryStore.slots.filter((s) => s.centerId === centerId && s.date === date);
      const center = memoryStore.centers.find((c) => c.id === centerId);

      const formatted = filtered.map((s) => ({
        ...s,
        center: center ? { name: center.name, hourlyCapacity: center.hourlyCapacity, weighbridgeCount: center.weighbridgeCount } : undefined,
        remainingCapacity: Math.max(0, s.maxCapacity - s.bookedCount),
        isAvailable: s.bookedCount < s.maxCapacity,
        utilizationPercentage: Math.round((s.bookedCount / s.maxCapacity) * 100)
      }));

      return res.json({ success: true, centerId, date, count: formatted.length, data: formatted, isMock: true });
    }
  } catch (error: any) {
    console.error('Error fetching available slots:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch slots', error: error.message });
  }
}

/**
 * POST /api/kisan-setu/bookings
 * Create a booking and generate a SHA-256 encrypted offline token string
 */
export async function createBooking(req: Request, res: Response) {
  try {
    const { farmerId, slotId, vehicleType, cropType, estimatedWeight } = req.body;

    // Validate inputs
    if (!slotId || !vehicleType || !cropType || !estimatedWeight) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: slotId, vehicleType, cropType, estimatedWeight'
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

    if (isDbActive()) {
      // 1. Check Slot & Capacity in DB
      const slot = await prisma.slot.findUnique({
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

      // 2. Fetch or default farmer
      let resolvedFarmerId = farmerId;
      if (!resolvedFarmerId) {
        const firstFarmer = await prisma.farmer.findFirst();
        resolvedFarmerId = firstFarmer ? firstFarmer.id : 'farmer-01';
      }

      const farmer = await prisma.farmer.findUnique({
        where: { id: resolvedFarmerId }
      });

      if (!farmer) {
        return res.status(404).json({ success: false, message: 'Farmer not found' });
      }

      // 3. Generate SHA-256 encrypted offline token string
      const tokenPackage = createOfflineTokenPackage({
        farmerId: farmer.id,
        farmerAadhaarHash: farmer.aadhaarHash,
        centerId: slot.centerId,
        slotId: slot.id,
        vehicleType,
        cropType,
        estimatedWeight: parsedWeight
      });

      // 4. Atomic transaction: create booking and increment bookedCount
      const [newBooking] = await prisma.$transaction([
        prisma.booking.create({
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
        prisma.slot.update({
          where: { id: slotId },
          data: { bookedCount: { increment: 1 } }
        })
      ]);

      return res.status(201).json({
        success: true,
        message: 'Booking created successfully with SHA-256 offline token',
        data: {
          booking: newBooking,
          token: tokenPackage
        }
      });
    } else {
      // Memory Store fallback
      const slot = memoryStore.slots.find((s) => s.id === slotId);
      if (!slot) {
        return res.status(404).json({ success: false, message: 'Slot not found' });
      }

      if (slot.bookedCount >= slot.maxCapacity) {
        return res.status(409).json({
          success: false,
          message: 'Slot capacity reached. Please choose another slot window.'
        });
      }

      const resolvedFarmerId = farmerId || memoryStore.farmers[0].id;
      const farmer = memoryStore.farmers.find((f) => f.id === resolvedFarmerId) || memoryStore.farmers[0];
      const center = memoryStore.centers.find((c) => c.id === slot.centerId);

      const tokenPackage = createOfflineTokenPackage({
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

      memoryStore.bookings.push(newBooking);

      return res.status(201).json({
        success: true,
        message: 'Booking created successfully with SHA-256 offline token',
        data: {
          booking: newBooking,
          token: tokenPackage
        },
        isMock: true
      });
    }
  } catch (error: any) {
    console.error('Error creating booking:', error);
    return res.status(500).json({ success: false, message: 'Failed to create booking', error: error.message });
  }
}

/**
 * GET /api/kisan-setu/bookings/token/:tokenHash
 * Verify token details for Mandi Gate scanner
 */
export async function verifyToken(req: Request, res: Response) {
  try {
    const rawTokenHash = req.params.tokenHash;

    if (!rawTokenHash) {
      return res.status(400).json({ success: false, message: 'tokenHash parameter is required' });
    }

    const tokenHash = rawTokenHash.trim().toUpperCase();

    if (isDbActive()) {
      const booking = await prisma.booking.findUnique({
        where: { tokenHash },
        include: {
          farmer: {
            select: {
              id: true,
              name: true,
              phone: true,
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
          qualityInspection: booking.qualityInspection
        }
      });
    } else {
      // Memory store fallback
      const booking = memoryStore.bookings.find(
        (b) => b.tokenHash.toUpperCase() === tokenHash
      );

      if (!booking) {
        return res.status(404).json({
          success: false,
          verified: false,
          message: 'Invalid or unregistered token hash. Vehicle entry denied.',
          isMock: true
        });
      }

      const farmer = memoryStore.farmers.find((f) => f.id === booking.farmerId) || booking.farmer;
      const slot = memoryStore.slots.find((s) => s.id === booking.slotId) || booking.slot;
      const center = slot ? memoryStore.centers.find((c) => c.id === slot.centerId) : null;

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
                phone: farmer.phone,
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
          qualityInspection: null
        },
        isMock: true
      });
    }
  } catch (error: any) {
    console.error('Error verifying token:', error);
    return res.status(500).json({ success: false, message: 'Failed to verify token', error: error.message });
  }
}

/**
 * PATCH /api/kisan-setu/bookings/:id/status
 * Gate Staff can update booking status (e.g., BOOKED -> MANDI_GATE -> STAGING -> COMPLETED)
 */
export async function updateBookingStatus(req: Request, res: Response) {
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

    if (isDbActive()) {
      const updated = await prisma.booking.update({
        where: { id },
        data: { status: status as any }
      });
      return res.json({ success: true, message: 'Status updated successfully', data: updated });
    } else {
      const booking = memoryStore.bookings.find((b) => b.id === id);
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }
      booking.status = status;
      return res.json({ success: true, message: 'Status updated successfully', data: booking, isMock: true });
    }
  } catch (error: any) {
    console.error('Error updating status:', error);
    return res.status(500).json({ success: false, message: 'Failed to update status', error: error.message });
  }
}

/**
 * GET /api/kisan-setu/farmers
 * Helper endpoint to list mock farmers for UI demo dropdown
 */
export async function getFarmers(req: Request, res: Response) {
  try {
    if (isDbActive()) {
      const farmers = await prisma.farmer.findMany();
      return res.json({ success: true, data: farmers });
    } else {
      return res.json({ success: true, data: memoryStore.farmers, isMock: true });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * GET /api/kisan-setu/queue/capacity
 * Dynamic capacity & queue congestion calculation
 */
export async function getQueueCapacity(req: Request, res: Response) {
  try {
    const centerId = (req.query.centerId as string) || 'center-01';
    const date = (req.query.date as string) || new Date().toISOString().split('T')[0];
    const timeWindow = (req.query.timeWindow as string) || '09:00-10:00';

    const result = await calculateAvailableCapacity(centerId, date, timeWindow);

    return res.json({
      success: true,
      data: result,
      unloadingBenchmarks: UNLOADING_DURATIONS_MINUTES
    });
  } catch (error: any) {
    console.error('Error in getQueueCapacity:', error);
    return res.status(500).json({ success: false, message: 'Failed to calculate queue capacity', error: error.message });
  }
}

/**
 * POST /api/kisan-setu/queue/geofence
 * Geofenced buffer staging evaluation
 */
export async function checkGeofenceStatus(req: Request, res: Response) {
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
      if (isDbActive()) {
        const center = await prisma.procurementCenter.findUnique({ where: { id: resolvedCenterId } });
        if (center) {
          targetCenterLat = center.locationLat;
          targetCenterLng = center.locationLng;
        }
      } else {
        const center = memoryStore.centers.find((c) => c.id === resolvedCenterId);
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

    const state = updateFarmerQueueState(
      parseFloat(farmerLat),
      parseFloat(farmerLng),
      parseFloat(targetCenterLat),
      parseFloat(targetCenterLng)
    );

    // If a bookingId is provided and status changed, update the booking status in the DB/memory
    if (bookingId) {
      if (isDbActive()) {
        await prisma.booking.update({
          where: { id: bookingId },
          data: { status: state.status as any }
        }).catch(() => {});
      } else {
        const b = memoryStore.bookings.find((item) => item.id === bookingId);
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
  } catch (error: any) {
    console.error('Error in checkGeofenceStatus:', error);
    return res.status(500).json({ success: false, message: 'Failed to evaluate geofence state', error: error.message });
  }
}

/**
 * POST /api/kisan-setu/queue/generate-offline-token
 * Direct offline SHA-256 cryptographic token generator
 */
export async function generateOfflineTokenEndpoint(req: Request, res: Response) {
  try {
    const { farmerId, slotId, timestamp } = req.body;

    if (!farmerId || !slotId) {
      return res.status(400).json({
        success: false,
        message: 'farmerId and slotId are required'
      });
    }

    const tokenData = generateKisanSetuOfflineToken(
      farmerId,
      slotId,
      timestamp ? parseInt(timestamp, 10) : undefined
    );

    return res.json({
      success: true,
      message: 'Offline cryptographic SHA-256 token generated successfully',
      data: tokenData
    });
  } catch (error: any) {
    console.error('Error generating offline token:', error);
    return res.status(500).json({ success: false, message: 'Token generation failed', error: error.message });
  }
}

/**
 * GET /api/kisan-setu/bookings
 * List all bookings with optional filtering by status and search query
 */
export async function getAllBookings(req: Request, res: Response) {
  try {
    const status = req.query.status as string;
    const search = ((req.query.search as string) || '').toLowerCase().trim();

    if (isDbActive()) {
      const whereClause: any = {};
      if (status && status !== 'ALL') {
        whereClause.status = status;
      }
      const bookings = await prisma.booking.findMany({
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
        filtered = bookings.filter((b) =>
          (b.farmer?.name || '').toLowerCase().includes(search) ||
          (b.vehicleType || '').toLowerCase().includes(search) ||
          (b.cropType || '').toLowerCase().includes(search) ||
          (b.tokenHash || '').toLowerCase().includes(search) ||
          (b.id || '').toLowerCase().includes(search)
        );
      }

      return res.json({ success: true, count: filtered.length, data: filtered });
    } else {
      let bookings = [...memoryStore.bookings];
      if (status && status !== 'ALL') {
        bookings = bookings.filter((b) => b.status === status);
      }
      if (search) {
        bookings = bookings.filter((b) => {
          const farmerName = b.farmer?.name || '';
          return (
            farmerName.toLowerCase().includes(search) ||
            (b.vehicleType || '').toLowerCase().includes(search) ||
            (b.cropType || '').toLowerCase().includes(search) ||
            (b.tokenHash || '').toLowerCase().includes(search) ||
            (b.id || '').toLowerCase().includes(search)
          );
        });
      }
      bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return res.json({ success: true, count: bookings.length, data: bookings, isMock: true });
    }
  } catch (error: any) {
    console.error('Error fetching bookings:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch bookings', error: error.message });
  }
}

/**
 * POST /api/kisan-setu/inspections
 * Submit quality inspection & weighbridge data, calculate payout, mark booking as COMPLETED, and issue mock SMS
 */
export async function createQualityInspection(req: Request, res: Response) {
  try {
    const {
      bookingId,
      moistureLevel,
      dockageGrade,
      approvedWeight,
      mspRate = 2275,
      inspectorId = 'OFFICER-KOTA-04'
    } = req.body;

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

    let updatedBooking: any = null;

    if (isDbActive()) {
      const [insp, booking] = await prisma.$transaction([
        prisma.qualityInspection.upsert({
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
        prisma.booking.update({
          where: { id: bookingId },
          data: { status: 'COMPLETED' },
          include: { farmer: true, slot: { include: { center: true } } }
        })
      ]);
      updatedBooking = booking;
    } else {
      const b = memoryStore.bookings.find((item) => item.id === bookingId);
      if (b) {
        b.status = 'COMPLETED';
        b.qualityInspection = inspectionRecord;
        updatedBooking = b;
      }
    }

    const farmerName = updatedBooking?.farmer?.name || 'Farmer';
    const farmerPhone = updatedBooking?.farmer?.phone || '+91 98765 43210';
    const receiptNumber = `REC-KS-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const mockSmsPayload = {
      recipientPhone: farmerPhone,
      farmerName,
      messageText: `Kisan Setu Alert: Your produce has been successfully inspected & weighed at ${updatedBooking?.slot?.center?.name || 'Mandi Center'}. Receipt #${receiptNumber}. Net Approved Weight: ${weight} Quintals. Total MSP Payout: Rs. ${totalPayout.toLocaleString('en-IN')}. Direct Benefit Transfer initiated to your linked Bank A/c. Gate Inspector: ${inspectorId}. Helpline: 1800-180-1551.`,
      dispatchedAt: new Date().toISOString(),
      receiptNumber,
      dbtStatus: 'INITIATED'
    };

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
        mockSms: mockSmsPayload
      },
      isMock: !isDbActive()
    });
  } catch (error: any) {
    console.error('Error in createQualityInspection:', error);
    return res.status(500).json({ success: false, message: 'Failed to create quality inspection', error: error.message });
  }
}

