'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TranslationDict, translations } from '../lib/translations';

export interface LanguageOption {
  code: Language;
  label: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'hi', label: 'Hindi', nativeName: 'हिंदी' },
  { code: 'en', label: 'English', nativeName: 'English' },
  { code: 'pa', label: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'mr', label: 'Marathi', nativeName: 'मराठी' },
  { code: 'te', label: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', label: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'bn', label: 'Bengali', nativeName: 'বাংলা' },
  { code: 'gu', label: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', label: 'Kannada', nativeName: 'ಕನ್ನಡ' }
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
      if (SUPPORTED_LANGUAGES.some((option) => option.code === saved)) {
        setLanguageState(saved);
      }
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kisan_setu_lang', lang);
      localStorage.setItem('kisan_setu_preferred_language', lang);
    }
  };

  const toggleLanguage = () => {
    const languageOrder: Language[] = ['hi', 'en', 'pa', 'mr', 'te', 'ta', 'bn', 'gu', 'kn'];
    const currentIndex = languageOrder.indexOf(language);
    const nextLanguage = languageOrder[(currentIndex + 1) % languageOrder.length];
    setLanguage(nextLanguage);
  };

  const activeTranslations = translations[language] || translations.hi || translations.en;

  return (
    <LanguageContext.Provider
      value={{
        language,
        t: activeTranslations,
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
