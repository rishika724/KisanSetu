'use client';

import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import { Compass, MapPin, Navigation } from 'lucide-react';
import { GpsCoordinates } from '../utils/gpsTracker';

const farmerIcon = L.divIcon({
  className: 'live-farmer-marker',
  html: '<div class="live-farmer-marker__pin">●</div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

const mandiIcon = L.divIcon({
  className: 'mandi-marker',
  html: '<div class="mandi-marker__pin">◆</div>',
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

function MapViewport({ farmer }: { farmer: GpsCoordinates | null }) {
  const map = useMap();
  useEffect(() => {
    if (farmer) map.setView([farmer.latitude, farmer.longitude], Math.max(map.getZoom(), 12));
  }, [farmer, map]);
  return null;
}

interface LiveGpsMapProps {
  farmer: GpsCoordinates | null;
  mandi: { latitude: number; longitude: number; name: string };
  distanceKm: number;
  etaMinutes: number | null;
  signal: 'High' | 'Moderate' | 'Unavailable';
  simulated?: boolean;
}

export function LiveGpsMap({ farmer, mandi, distanceKm, etaMinutes, signal, simulated = false }: LiveGpsMapProps) {
  const mapCenter: [number, number] = farmer
    ? [farmer.latitude, farmer.longitude]
    : [mandi.latitude, mandi.longitude];
  const farmerPosition: [number, number] | null = farmer ? [farmer.latitude, farmer.longitude] : null;

  return (
    <section className="space-y-4 rounded-3xl border-2 border-slate-200 bg-white p-5 shadow-xs">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-600"><Navigation className="h-5 w-5" /> Live Distance to Mandi</div>
          <strong className="mt-2 block text-2xl text-slate-950">{distanceKm.toFixed(2)} km</strong>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-600"><Compass className="h-5 w-5" /> Estimated Time of Arrival</div>
          <strong className="mt-2 block text-2xl text-slate-950">{etaMinutes === null ? 'Unavailable' : `${etaMinutes} min`}</strong>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-600"><MapPin className="h-5 w-5" /> GPS Signal Accuracy</div>
          <strong className="mt-2 block text-2xl text-slate-950">{signal}</strong>
          <span className="text-xs font-semibold text-slate-500">{simulated ? 'Demo location' : 'Browser location'}</span>
        </div>
      </div>
      <div className="h-[360px] overflow-hidden rounded-2xl border-2 border-slate-300">
        <MapContainer center={mapCenter} zoom={12} scrollWheelZoom className="h-full w-full" aria-label="Live farmer and mandi map">
          <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapViewport farmer={farmer} />
          <Circle center={[mandi.latitude, mandi.longitude]} radius={5000} pathOptions={{ color: '#334155', fillColor: '#94a3b8', fillOpacity: 0.16, weight: 2 }} />
          <Marker position={[mandi.latitude, mandi.longitude]} icon={mandiIcon}><Popup>{mandi.name} (5 km staging buffer)</Popup></Marker>
          {farmerPosition && <Marker position={farmerPosition} icon={farmerIcon}><Popup>Farmer location {simulated ? '(demo)' : '(live)'}</Popup></Marker>}
        </MapContainer>
      </div>
    </section>
  );
}
