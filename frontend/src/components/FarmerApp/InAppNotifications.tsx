'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSyncStore, markNotificationsAsRead, InAppNotification } from '../../lib/syncStore';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  CheckCheck,
  X
} from 'lucide-react';

export function InAppNotifications() {
  const { t } = useLanguage();
  const sync = useSyncStore();
  const [isOpen, setIsOpen] = useState(false);
  const trayRef = useRef<HTMLDivElement>(null);

  const notifications = sync.notifications;
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (trayRef.current && !trayRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      markNotificationsAsRead();
    }
  };

  const getIcon = (type: InAppNotification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-blue-600 shrink-0" />;
    }
  };

  return (
    <div className="relative inline-block" ref={trayRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={handleToggle}
        aria-label={t.notifications.title}
        className="relative p-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl border-2 border-slate-300 transition-all min-h-[48px] min-w-[48px] flex items-center justify-center active:scale-95"
      >
        <Bell className="w-6 h-6 text-slate-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 px-2 py-0.5 bg-red-600 text-white font-black text-xs rounded-full border-2 border-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Slide-out / Dropdown Drawer */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border-2 border-slate-300 z-50 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b-2 border-slate-700">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-black uppercase tracking-wider text-emerald-400">
                {t.notifications.title}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={markNotificationsAsRead}
                  title={t.notifications.markAllRead}
                  className="p-1 text-slate-400 hover:text-white rounded-lg"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 p-2 scrollbar-thin">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs font-bold text-slate-500">
                {t.notifications.noNotifications}
              </div>
            ) : (
              notifications.map((notif) => {
                const localizedTitle =
                  (t.notifications as any)[notif.titleKey] || notif.titleFallback;
                const localizedMessage =
                  (t.notifications as any)[notif.messageKey] || notif.messageFallback;

                return (
                  <div
                    key={notif.id}
                    className={`p-3.5 rounded-2xl transition-all space-y-1.5 ${
                      notif.read ? 'bg-white' : 'bg-slate-50 border border-slate-200'
                    }`}
                  >
                    <div className="flex items-start space-x-2.5">
                      {getIcon(notif.type)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black text-slate-900 leading-tight">
                            {localizedTitle}
                          </h4>
                          <span className="text-[10px] font-bold text-slate-400 flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>
                              {new Date(notif.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </span>
                        </div>
                        <p className="text-xs font-medium text-slate-700 mt-1 leading-relaxed">
                          {localizedMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
            <span className="text-[11px] font-bold text-slate-600">
              {t.common.helpline}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
