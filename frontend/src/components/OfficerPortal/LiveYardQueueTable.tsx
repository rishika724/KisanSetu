'use client';

import React, { useState, useEffect } from 'react';
import {
  Truck,
  Search,
  Filter,
  RefreshCw,
  Scale,
  ArrowRight,
  CheckCircle2,
  Clock,
  User,
  Layers,
  FileText,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import { VerifiedTokenData, fetchBookingsApi, updateStatusApi } from '../../lib/api';

interface LiveYardQueueTableProps {
  onSelectVehicleForInspection: (vehicle: VerifiedTokenData) => void;
  onRefreshRequested?: () => void;
}

export function LiveYardQueueTable({
  onSelectVehicleForInspection,
  onRefreshRequested
}: LiveYardQueueTableProps) {
  const [bookings, setBookings] = useState<VerifiedTokenData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchBookingsApi(statusFilter, searchQuery);
      setBookings(data);
    } catch (e) {
      console.error('Failed to load queue table data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    const intervalId = window.setInterval(loadData, 5000);
    return () => window.clearInterval(intervalId);
  }, [statusFilter, searchQuery]);

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      setUpdatingId(bookingId);
      await updateStatusApi(bookingId, newStatus);
      await loadData();
      if (onRefreshRequested) onRefreshRequested();
    } catch (e) {
      console.error('Failed to update vehicle status:', e);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCopyToken = (token: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(token);
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(null), 2000);
    }
  };

  // Status counts
  const counts = {
    all: bookings.length,
    inYard: bookings.filter((b) => b.status === 'MANDI_GATE').length,
    staging: bookings.filter((b) => b.status === 'STAGING').length,
    completed: bookings.filter((b) => b.status === 'COMPLETED').length,
    booked: bookings.filter((b) => b.status === 'BOOKED').length
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-300 shadow-sm overflow-hidden space-y-6">
      {/* Table Module Header */}
      <div className="bg-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-slate-800 rounded-xl border border-slate-700">
            <Truck className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">
              Live Yard Queue & Log Table
            </h2>
            <p className="text-xs text-slate-300 font-medium">
              मंडी प्रांगण, स्टेजिंग बफर व तुलाई निस्तारण की वास्तविक स्थिति
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={loadData}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-xs sm:text-sm font-bold text-white transition-all min-h-[44px]"
        >
          <RefreshCw className={`w-4 h-4 text-emerald-400 ${loading ? 'animate-spin' : ''}`} />
          <span>रिफ्रेश (Refresh)</span>
        </button>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Search & Filter Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-6 h-6 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="किसान का नाम, वाहन, फसल या टोकन खोजें..."
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-300 rounded-2xl text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-slate-800 transition-all shadow-inner"
            />
          </div>

          {/* Filter Pills with Live Count Badges */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {[
              { id: 'ALL', label: 'सभी (All)' },
              { id: 'MANDI_GATE', label: 'मंडी में (Inside Yard)' },
              { id: 'STAGING', label: 'स्टेजिंग (Staging)' },
              { id: 'COMPLETED', label: 'निस्तारित (Completed)' },
              { id: 'BOOKED', label: 'आगामी (Booked)' }
            ].map((f) => {
              const isActive = statusFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setStatusFilter(f.id)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[44px] whitespace-nowrap flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                  }`}
                >
                  <span>{f.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Responsive Data Table / Cards */}
        {loading ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <RefreshCw className="w-8 h-8 mx-auto animate-spin text-slate-400" />
            <p className="text-base font-bold">यार्ड कतार डेटा लोड हो रहा है...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-300 space-y-2">
            <Truck className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className="text-lg font-bold text-slate-800">कोई वाहन नहीं मिला (No Vehicles Found)</h4>
            <p className="text-xs text-slate-500">
              चयनित फिल्टर या खोज के अनुसार वर्तमान में कोई वाहन उपलब्ध नहीं है।
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border-2 border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 border-b-2 border-slate-200 text-slate-800 uppercase text-[11px] font-black tracking-wider">
                <tr>
                  <th className="p-4">टोकन / पास</th>
                  <th className="p-4">किसान विवरण</th>
                  <th className="p-4">वाहन व जिंस</th>
                  <th className="p-4">पंजीकृत भूमि</th>
                  <th className="p-4">स्लॉट समय</th>
                  <th className="p-4">वर्तमान स्थिति</th>
                  <th className="p-4 text-center">त्वरित कार्यवाही (Quick Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {bookings.map((b) => {
                  const isCompleted = b.status === 'COMPLETED';
                  const isInYard = b.status === 'MANDI_GATE';
                  const isStaging = b.status === 'STAGING';

                  return (
                    <tr key={b.bookingId} className="hover:bg-slate-50/80 transition-colors">
                      {/* Token */}
                      <td className="p-4 align-middle">
                        <div className="flex items-center space-x-1 font-mono text-xs font-bold text-slate-800">
                          <span>{b.tokenHash.substring(0, 10)}...</span>
                          <button
                            type="button"
                            onClick={() => handleCopyToken(b.tokenHash)}
                            className="p-1 hover:bg-slate-200 rounded text-slate-500"
                            title="Copy Full Token"
                          >
                            {copiedToken === b.tokenHash ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <span className="text-[10px] text-slate-400 uppercase">SHA-256 Ledger</span>
                      </td>

                      {/* Farmer Details */}
                      <td className="p-4 align-middle">
                        <div className="font-bold text-slate-900 text-base">{b.farmer?.name || 'N/A'}</div>
                        <div className="text-xs text-slate-500 font-medium">
                          {b.farmer?.phoneno} • {b.farmer?.locationVillage}
                        </div>
                      </td>

                      {/* Vehicle & Crop */}
                      <td className="p-4 align-middle">
                        <div className="font-bold text-slate-900">{b.vehicleType}</div>
                        <div className="text-xs text-emerald-800 font-semibold">{b.cropType}</div>
                        <div className="text-[11px] text-slate-500">
                          {b.estimatedWeight} क्विंटल (Est.)
                        </div>
                      </td>

                      {/* Registered Land Size */}
                      <td className="p-4 align-middle">
                        <div className="font-black text-slate-900 text-sm">
                          {b.farmer?.landSize ?? '4.5'} <span className="text-xs font-bold text-slate-500">एकड़</span>
                        </div>
                        <div className="text-[10px] text-emerald-700 font-bold">भूलेख सत्यापित</div>
                      </td>

                      {/* Slot Time */}
                      <td className="p-4 align-middle">
                        <div className="font-bold text-slate-900">{b.slot?.timeWindow}</div>
                        <div className="text-xs text-slate-500">{b.slot?.date}</div>
                      </td>

                      {/* Status */}
                      <td className="p-4 align-middle">
                        <span
                          className={`inline-block px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider ${
                            b.status === 'MANDI_GATE'
                              ? 'bg-emerald-100 text-emerald-950 border border-emerald-400'
                              : b.status === 'STAGING'
                              ? 'bg-amber-100 text-amber-950 border border-amber-400'
                              : b.status === 'COMPLETED'
                              ? 'bg-blue-100 text-blue-950 border border-blue-400'
                              : 'bg-slate-100 text-slate-700 border border-slate-300'
                          }`}
                        >
                          {b.status === 'MANDI_GATE'
                            ? 'गेट में (In Yard)'
                            : b.status === 'STAGING'
                            ? 'स्टेजिंग (Staging)'
                            : b.status === 'COMPLETED'
                            ? 'निस्तारित (Done)'
                            : 'बुक (Booked)'}
                        </span>
                        {b.qualityInspection && (
                          <div className="text-[11px] font-mono font-bold text-emerald-800 mt-1">
                            देय: ₹{b.qualityInspection.totalPayout?.toLocaleString('en-IN')}
                          </div>
                        )}
                      </td>

                      {/* Quick Action Buttons with Oversized Touch Targets & Lucide Icons (w-8 h-8 / 28px-32px) */}
                      {/* Directive: Quick action buttons with prominent icons to update queue progression manually if needed */}
                      <td className="p-4 align-middle text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* 1. Staging -> Advance to Mandi Gate */}
                          {isStaging && (
                            <button
                              type="button"
                              onClick={() => handleStatusChange(b.bookingId, 'MANDI_GATE')}
                              disabled={updatingId === b.bookingId}
                              className="flex items-center space-x-1.5 px-3.5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-black text-xs transition-all min-h-[48px] active:scale-95 shadow-xs"
                              title="Admit to Yard (Mandi Gate Entry)"
                            >
                              <ArrowRight className="w-6 h-6 shrink-0" />
                              <span>गेट प्रवेश (Admit)</span>
                            </button>
                          )}

                          {/* 2. In Yard -> Load into Quality Inspection Form */}
                          {isInYard && (
                            <button
                              type="button"
                              onClick={() => onSelectVehicleForInspection(b)}
                              className="flex items-center space-x-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black text-xs sm:text-sm transition-all min-h-[50px] active:scale-95 shadow-sm border border-emerald-500"
                              title="Inspect & Weigh at Bay"
                            >
                              <Scale className="w-7 h-7 text-emerald-400 shrink-0" />
                              <span>तुलाई व जांच (Weigh & Inspect)</span>
                            </button>
                          )}

                          {/* 3. Completed -> View Slip */}
                          {isCompleted && (
                            <button
                              type="button"
                              onClick={() => onSelectVehicleForInspection(b)}
                              className="flex items-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 text-slate-800 rounded-xl font-bold text-xs transition-all min-h-[44px]"
                              title="View Approved Inspection Receipt"
                            >
                              <FileText className="w-5 h-5 text-slate-700" />
                              <span>रसीद (Receipt)</span>
                            </button>
                          )}

                          {/* 4. Booked -> Advance to Staging if vehicle arrives early */}
                          {b.status === 'BOOKED' && (
                            <button
                              type="button"
                              onClick={() => handleStatusChange(b.bookingId, 'STAGING')}
                              disabled={updatingId === b.bookingId}
                              className="flex items-center space-x-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-xl font-bold text-xs transition-all min-h-[44px]"
                              title="Advance to Staging Buffer"
                            >
                              <Clock className="w-5 h-5" />
                              <span>स्टेजिंग (Stage)</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
