'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Globe, Check, ChevronDown, Search, X } from 'lucide-react';
import { SUPPORTED_LANGUAGES, useLanguage } from '../context/LanguageContext';
import { Language } from '../lib/translations';

interface LanguageSelectorProps {
  variant?: 'light' | 'dark' | 'compact';
  className?: string;
}

export function LanguageSelector({ variant = 'light', className = '' }: LanguageSelectorProps) {
  const { language, setLanguage, t, supportedLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectLanguage = (langCode: Language) => {
    setLanguage(langCode);
    setIsOpen(false);
    setSearchQuery('');
  };

  const currentLang = supportedLanguages.find((l) => l.code === language) || supportedLanguages[0];

  const filteredLanguages = supportedLanguages.filter(
    (l) =>
      l.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isDark = variant === 'dark';

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger Button with Prominent Globe Icon */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={t.langSwitchLabel}
        className={`flex items-center space-x-2.5 px-3.5 py-2 rounded-2xl font-bold transition-all min-h-[48px] active:scale-98 ${
          isDark
            ? 'bg-slate-800 hover:bg-slate-700 text-white border-2 border-slate-700'
            : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-2 border-slate-300'
        }`}
      >
        <div className="shrink-0 text-emerald-700">
          <Globe className="w-6 h-6" aria-hidden="true" />
        </div>

        <div className="text-left hidden sm:block">
          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-extrabold leading-none">
            {t.langSwitchLabel}
          </div>
          <div className="text-sm font-black leading-tight mt-0.5 text-slate-900">
            {currentLang.nativeName}
          </div>
        </div>

        <span className="sm:hidden text-xs font-black">
          {currentLang.nativeName}
        </span>

        <ChevronDown className={`w-4 h-4 text-slate-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Accessible Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-3xl bg-white shadow-2xl border-2 border-slate-300 z-50 overflow-hidden animate-fadeIn">
          {/* Dropdown Header & Search */}
          <div className="p-3.5 bg-slate-900 text-white border-b-2 border-slate-700 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                  {t.langSwitchLabel}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.langSwitchLabel}
                className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-400 transition-all"
              />
            </div>
          </div>

          {/* Language Options List */}
          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 p-1.5 scrollbar-thin">
            {filteredLanguages.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500 font-bold">
                {t.langSwitchLabel}
              </div>
            ) : (
              filteredLanguages.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all min-h-[48px] ${
                      isSelected
                        ? 'bg-slate-900 text-white font-black'
                        : 'hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <div>
                      <div className="text-base font-bold leading-tight">
                        {lang.nativeName}
                      </div>
                    </div>

                    {isSelected && (
                      <div className="p-1 bg-emerald-600 rounded-full text-white">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
