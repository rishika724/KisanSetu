'use client';

export interface GpsCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export type QueueGpsStatus = 'BOOKED' | 'STAGING' | 'MANDI_GATE';

export function getDistanceInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const latitudeDelta = toRadians(lat2 - lat1);
  const longitudeDelta = toRadians(lon2 - lon1);
  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(longitudeDelta / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getQueueStatusForDistance(distanceKm: number): QueueGpsStatus {
  if (distanceKm > 5) return 'BOOKED';
  if (distanceKm > 0.5) return 'STAGING';
  return 'MANDI_GATE';
}

export function watchFarmerPosition(
  onPosition: (position: GpsCoordinates) => void,
  onError: (error: GeolocationPositionError) => void
): number | null {
  if (typeof navigator === 'undefined' || !navigator.geolocation) return null;
  return navigator.geolocation.watchPosition(
    (position) => onPosition({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: position.timestamp
    }),
    onError,
    { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
  );
}

export function stopWatchingFarmerPosition(watchId: number | null): void {
  if (watchId !== null && typeof navigator !== 'undefined' && navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId);
  }
}
