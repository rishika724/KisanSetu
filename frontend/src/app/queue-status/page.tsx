'use client';

import React, { useState } from 'react';
import { Navbar } from '../../components/Navbar';
import { QueueProgressCard } from '../../components/QueueProgressCard';
import { useLanguage } from '../../context/LanguageContext';

export default function QueueStatusPage() {
  const { t } = useLanguage();
  const [tab, setTab] = useState<'register' | 'booking' | 'offlinePass' | 'queue' | 'weather'>('queue');

  return (
    <div className="flex flex-col min-h-screen bg-slate-100 text-slate-900 antialiased font-sans">
      <Navbar activeTab={tab} setActiveTab={setTab} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <QueueProgressCard />
      </main>
    </div>
  );
}
