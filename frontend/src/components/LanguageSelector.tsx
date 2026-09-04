'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Globe, Check, ChevronDown, Search, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface LanguageItem {
  code: string;
  name: string;
  nativeName: string;
}

// All 22 Scheduled Official Languages of India + English
export const ALL_INDIAN_LANGUAGES: LanguageItem[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'ur', name: 'Urdu', nativeName: 'اُردُو' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली' },
  { code: 'sat', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'कॉशुर' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली' },
  { code: 'kok', name: 'Konkani', nativeName: 'कोंकणी' },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी' },
  { code: 'mni', name: 'Manipuri', nativeName: 'মৈতৈলোন্' },
  { code: 'brx', name: 'Bodo', nativeName: "बर'" },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्' }
];

interface LanguageSelectorProps {
  variant?: 'light' | 'dark' | 'compact';
  className?: string;
}

export function LanguageSelector({ variant = 'light', className = '' }: LanguageSelectorProps) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLang, setSelectedLang] = useState<string>('hi');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load language preference from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kisan_setu_preferred_language') || localStorage.getItem('kisan_setu_lang');
      if (saved) {
        setSelectedLang(saved);
      }
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Focus search input on open
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Programmatically trigger Google Translate & Context update
  const handleSelectLanguage = (langCode: string) => {
    setSelectedLang(langCode);
    setIsOpen(false);
    setSearchQuery('');

    if (typeof window !== 'undefined') {
      // 1. Save in localStorage for PWA offline persistence
      localStorage.setItem('kisan_setu_preferred_language', langCode);
      localStorage.setItem('kisan_setu_lang', langCode);

      // 2. Update LanguageContext if it's one of the primary supported dictionary codes
      if (langCode === 'hi' || langCode === 'en' || langCode === 'te') {
        setLanguage(langCode as any);
      }

      // 3. Set Google Translate Cookie
      const hostname = window.location.hostname;
      document.cookie = `googtrans=/en/${langCode}; path=/; domain=${hostname}`;
      document.cookie = `googtrans=/en/${langCode}; path=/;`;
      document.cookie = `googtrans=/auto/${langCode}; path=/; domain=${hostname}`;
      document.cookie = `googtrans=/auto/${langCode}; path=/;`;

      // 4. Trigger the Google Translate select dropdown element in the DOM
      const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
      if (selectElement) {
        selectElement.value = langCode;
        selectElement.dispatchEvent(new Event('change'));
      } else {
        // If element not yet ready or if already set via cookie, refresh translation or reload if needed
        if (window.location.hash.includes('googtrans')) {
          window.location.hash = `#googtrans(en|${langCode})`;
        }
      }
    }
  };

  const currentLangItem = ALL_INDIAN_LANGUAGES.find((l) => l.code === selectedLang) || ALL_INDIAN_LANGUAGES[0];

  const filteredLanguages = ALL_INDIAN_LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isDark = variant === 'dark';

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger Button with Prominent Globe Icon (size 28px) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Select Indian Regional Language"
        className={`flex items-center space-x-2.5 px-3.5 py-2 rounded-2xl font-bold transition-all min-h-[48px] active:scale-98 ${
          isDark
            ? 'bg-slate-800 hover:bg-slate-700 text-white border-2 border-slate-700'
            : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-2 border-slate-300'
        }`}
      >
        {/* Prominent Globe Icon: size 28px */}
        <div className="shrink-0 text-emerald-600">
          <Globe className="w-7 h-7" aria-hidden="true" />
        </div>

        <div className="text-left hidden sm:block">
          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-extrabold leading-none">
            Language / भाषा
          </div>
          <div className="text-sm font-black leading-tight mt-0.5">
            {currentLangItem.nativeName} <span className="text-xs font-semibold opacity-75">({currentLangItem.name})</span>
          </div>
        </div>

        <span className="sm:hidden text-xs font-black">
          {currentLangItem.nativeName}
        </span>

        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
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
                  भारतीय भाषाएं (22 Scheduled Languages)
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
                placeholder="भाषा खोजें / Search language..."
                className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-400 transition-all"
              />
            </div>
          </div>

          {/* Language Options List (Max Height with Smooth Scroll) */}
          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 p-1.5 scrollbar-thin">
            {filteredLanguages.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500 font-bold">
                कोई भाषा नहीं मिली (No language found)
              </div>
            ) : (
              filteredLanguages.map((lang) => {
                const isSelected = selectedLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left transition-all min-h-[48px] ${
                      isSelected
                        ? 'bg-slate-900 text-white font-black'
                        : 'hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold leading-tight">
                        {lang.nativeName}
                      </div>
                      <div className={`text-[11px] font-medium ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {lang.name}
                      </div>
                    </div>

                    {isSelected && (
                      <div className="p-1 bg-emerald-600 rounded-full text-white">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Note */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center text-[10px] text-slate-500 font-semibold">
            किसान सेतु • भारत की सभी आधिकारिक 22 भाषाओं में उपलब्ध
          </div>
        </div>
      )}
    </div>
  );
}
