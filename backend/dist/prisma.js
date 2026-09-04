"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.checkDatabaseConnection = checkDatabaseConnection;
exports.isDbActive = isDbActive;
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error']
});
let isConnected = false;
async function checkDatabaseConnection() {
    try {
        await exports.prisma.$connect();
        isConnected = true;
        console.log('✅ Connected to PostgreSQL database via Prisma.');
        return true;
    }
    catch (error) {
        isConnected = false;
        console.warn('⚠️  PostgreSQL database connection failed. Falling back gracefully to memory store with seed data.');
        return false;
    }
}
function isDbActive() {
    return isConnected;
}
