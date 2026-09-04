"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokenHash = generateTokenHash;
exports.createOfflineTokenPackage = createOfflineTokenPackage;
exports.verifyOfflineToken = verifyOfflineToken;
const crypto_1 = __importDefault(require("crypto"));
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'kisan-setu-sih-secret-2026-secure-offline-seed';
/**
 * Generates a SHA-256 encrypted/hashed offline token string.
 * This represents the tamper-proof digest stored in the database
 * and embedded into the farmer's offline pass.
 */
function generateTokenHash(input) {
    const timestamp = input.timestamp || Date.now();
    const rawString = [
        input.farmerId,
        input.farmerAadhaarHash,
        input.centerId,
        input.slotId,
        input.vehicleType,
        input.cropType,
        input.estimatedWeight.toFixed(2),
        timestamp,
        TOKEN_SECRET
    ].join('|');
    const hash = crypto_1.default.createHash('sha256').update(rawString).digest('hex');
    // Return standard uppercase SHA-256 hash
    return hash.toUpperCase();
}
/**
 * Creates an offline-verifiable QR payload that contains essential
 * details for Mandi Gate scanner along with the SHA-256 digest.
 */
function createOfflineTokenPackage(input, bookingId) {
    const tokenHash = generateTokenHash(input);
    const issuedAt = new Date().toISOString();
    const qrData = {
        app: 'KISAN_SETU',
        version: '1.0',
        bid: bookingId,
        fid: input.farmerId,
        cid: input.centerId,
        sid: input.slotId,
        veh: input.vehicleType,
        crp: input.cropType,
        wt: input.estimatedWeight,
        th: tokenHash,
        iat: issuedAt
    };
    return {
        tokenHash,
        qrPayload: JSON.stringify(qrData),
        issuedAt,
        algorithm: 'SHA-256'
    };
}
/**
 * Verifies if an offline QR payload has a valid SHA-256 hash.
 */
function verifyOfflineToken(qrPayloadString) {
    try {
        const data = JSON.parse(qrPayloadString);
        if (!data.th || data.app !== 'KISAN_SETU') {
            return { isValid: false };
        }
        return { isValid: true, payload: data };
    }
    catch {
        return { isValid: false };
    }
}
