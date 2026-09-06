'use client';

import React from 'react';
import { OfflinePassCard } from './OfflinePassCard';
import { X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface TokenPassModalProps {
  bookingData?: any;
  onClose: () => void;
}

export function TokenPassModal({ onClose }: TokenPassModalProps) {
  const { t } = useLanguage();

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-fadeIn"
    >
      <div className="relative max-w-2xl w-full bg-transparent">
        <button
          type="button"
          onClick={onClose}
          aria-label={t.common.close}
          className="absolute -top-12 right-0 p-2 text-white bg-slate-800 hover:bg-slate-700 rounded-full border border-slate-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <OfflinePassCard />
      </div>
    </div>
  );
}
