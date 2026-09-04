'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TranslationDict, translations } from '../lib/translations';

export interface LanguageOption {
  code: string;
  label: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'hi', label: 'Hindi', nativeName: 'हिंदी' },
  { code: 'en', label: 'English', nativeName: 'English' },
  { code: 'te', label: 'Telugu', nativeName: 'తెలుగు' }
];

interface LanguageContextType {
  language: Language;
  t: TranslationDict;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  supportedLanguages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('hi');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved =
        (localStorage.getItem('kisan_setu_preferred_language') as Language) ||
        (localStorage.getItem('kisan_setu_lang') as Language);
      if (saved === 'hi' || saved === 'en' || saved === 'te') {
        setLanguageState(saved);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kisan_setu_lang', lang);
      localStorage.setItem('kisan_setu_preferred_language', lang);
    }
  };

  const toggleLanguage = () => {
    const nextOrder: Record<Language, Language> = {
      hi: 'en',
      en: 'te',
      te: 'hi'
    };
    setLanguage(nextOrder[language] || 'hi');
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        t: translations[language] || translations.hi,
        toggleLanguage,
        setLanguage,
        supportedLanguages: SUPPORTED_LANGUAGES
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
