'use client';

import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi, CheckCircle2 } from 'lucide-react';

export function PwaRegister() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Check initial online status
    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine);

      const handleOnline = () => setIsOffline(false);
      const handleOffline = () => setIsOffline(true);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      // Register Service Worker
      if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('🌾 Kisan Setu PWA Service Worker Registered:', reg.scope);
          })
          .catch((err) => {
            console.warn('⚠️ Service Worker Registration failed:', err);
          });
      }

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  if (!isOffline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-slate-900 text-white px-4 py-3 text-sm font-semibold flex items-center justify-center space-x-3 border-b border-slate-700 shadow-md sticky top-0 z-50"
    >
      <div className="p-1.5 bg-slate-800 rounded-lg border border-slate-600">
        <WifiOff className="w-5 h-5 text-amber-400 shrink-0" aria-hidden="true" />
      </div>
      <span>
        <strong>ऑफ़लाइन मोड सक्रिय (Offline Mode Active):</strong> आपके सहेजे गए डिजिटल टोकन पास बिना इंटरनेट के भी पूरी तरह वैध और स्कैन करने योग्य हैं।
      </span>
    </div>
  );
}
