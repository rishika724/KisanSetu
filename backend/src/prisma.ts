import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error']
});

let isConnected = false;

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$connect();
    isConnected = true;
    console.log('✅ Connected to PostgreSQL database via Prisma.');
    return true;
  } catch (error) {
    isConnected = false;
    console.warn('⚠️  PostgreSQL database connection failed. Falling back gracefully to memory store with seed data.');
    return false;
  }
}

export function isDbActive(): boolean {
  return isConnected;
}
