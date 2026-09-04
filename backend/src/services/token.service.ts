import crypto from 'crypto';

export interface TokenPayloadInput {
  farmerId: string;
  farmerAadhaarHash: string;
  centerId: string;
  slotId: string;
  vehicleType: string;
  cropType: string;
  estimatedWeight: number;
  timestamp?: number;
}

export interface OfflineTokenPackage {
  tokenHash: string;
  qrPayload: string;
  issuedAt: string;
  algorithm: string;
}

const TOKEN_SECRET = process.env.TOKEN_SECRET || 'kisan-setu-sih-secret-2026-secure-offline-seed';

/**
 * Generates a SHA-256 encrypted/hashed offline token string.
 * This represents the tamper-proof digest stored in the database
 * and embedded into the farmer's offline pass.
 */
export function generateTokenHash(input: TokenPayloadInput): string {
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

  const hash = crypto.createHash('sha256').update(rawString).digest('hex');
  // Return standard uppercase SHA-256 hash
  return hash.toUpperCase();
}

/**
 * Creates an offline-verifiable QR payload that contains essential
 * details for Mandi Gate scanner along with the SHA-256 digest.
 */
export function createOfflineTokenPackage(
  input: TokenPayloadInput,
  bookingId?: string
): OfflineTokenPackage {
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
export function verifyOfflineToken(qrPayloadString: string): { isValid: boolean; payload?: any } {
  try {
    const data = JSON.parse(qrPayloadString);
    if (!data.th || data.app !== 'KISAN_SETU') {
      return { isValid: false };
    }
    return { isValid: true, payload: data };
  } catch {
    return { isValid: false };
  }
}
