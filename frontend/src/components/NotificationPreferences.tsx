'use client';

import { MessageSquare, Phone } from 'lucide-react';

export interface NotificationPreferenceValues {
  sms: boolean;
  whatsapp: boolean;
}

interface NotificationPreferencesProps {
  value: NotificationPreferenceValues;
  onChange: (value: NotificationPreferenceValues) => void;
  compact?: boolean;
}

export function NotificationPreferences({ value, onChange, compact = false }: NotificationPreferencesProps) {
  return (
    <div className={`rounded-2xl border-2 border-slate-300 bg-slate-50 ${compact ? 'p-4' : 'p-5'} space-y-3`}>
      <h3 className="text-base font-black text-slate-900">सूचना प्राथमिकताएं (Notification Preferences)</h3>
      <label className="flex min-h-[56px] cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-900">
        <span className="flex items-center gap-3"><Phone className="h-6 w-6 text-slate-700" /> Send SMS Alert</span>
        <input type="checkbox" checked={value.sms} onChange={(event) => onChange({ ...value, sms: event.target.checked })} className="h-6 w-6 accent-slate-900" />
      </label>
      <label className="flex min-h-[56px] cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-900">
        <span className="flex items-center gap-3"><MessageSquare className="h-6 w-6 text-slate-700" /> Send WhatsApp Pass & Receipt</span>
        <input type="checkbox" checked={value.whatsapp} onChange={(event) => onChange({ ...value, whatsapp: event.target.checked })} className="h-6 w-6 accent-slate-900" />
      </label>
    </div>
  );
}
