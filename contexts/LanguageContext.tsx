'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, translations } from '@/i18n/translations';
import { cookieStorage } from '@/utils/cookieStorage';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Load language from cookies
    const savedLanguage = cookieStorage.getItem(LANGUAGE_STORAGE_KEY) as Language;
    if (savedLanguage === 'en' || savedLanguage === 'es' || savedLanguage === 'ca') {
      setLanguageState(savedLanguage);
      document.documentElement.lang = savedLanguage;
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'ca') {
        setLanguageState('ca');
        cookieStorage.setItem(LANGUAGE_STORAGE_KEY, 'ca');
        document.documentElement.lang = 'ca';
      } else if (browserLang === 'es') {
        setLanguageState('es');
        cookieStorage.setItem(LANGUAGE_STORAGE_KEY, 'es');
        document.documentElement.lang = 'es';
      } else {
        document.documentElement.lang = 'en';
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    cookieStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

