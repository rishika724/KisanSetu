import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { seedFarmers, seedCenters, seedSlots } from '../src/seedData';

const prisma = new PrismaClient();

export async function main() {
  console.log('Seeding Kisan Setu Database...');

  // 1. Seed Farmers
  for (const farmer of seedFarmers) {
    await prisma.farmer.upsert({
      where: { id: farmer.id },
      update: farmer,
      create: farmer
    });
  }
  console.log(`Seeded ${seedFarmers.length} farmers.`);

  // 2. Seed Procurement Centers
  for (const center of seedCenters) {
    await prisma.procurementCenter.upsert({
      where: { id: center.id },
      update: center,
      create: center
    });
  }
  console.log(`Seeded ${seedCenters.length} procurement centers.`);

  // 3. Seed Slots
  for (const slot of seedSlots) {
    await prisma.slot.upsert({
      where: { id: slot.id },
      update: slot,
      create: slot
    });
  }
  console.log(`Seeded ${seedSlots.length} slots.`);

  // 4. Create 1 sample booking with token hash
  const sampleTokenHash = crypto
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
