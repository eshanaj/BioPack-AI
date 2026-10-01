import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage } from '../types/index.ts';
import { en } from './en.ts';
import { hi } from './hi.ts';
import { mr } from './mr.ts';

type TranslationType = typeof en;

interface I18nContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: TranslationType;
  getText: (keyPath: string, fallback?: string) => string;
}

const translations: Record<SupportedLanguage, TranslationType> = {
  en,
  hi,
  mr
};

const I18nContext = createContext<I18nContextType | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem('biopack_language');
      if (saved === 'hi' || saved === 'mr' || saved === 'en') {
        return saved;
      }
    } catch {
      // fallback
    }
    return 'en';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('biopack_language', lang);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = translations[language] || en;

  const getText = (keyPath: string, fallback = ''): string => {
    const parts = keyPath.split('.');
    let current: any = t;
    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        // try fallback in english
        let enCurrent: any = en;
        for (const p of parts) {
          if (enCurrent && typeof enCurrent === 'object' && p in enCurrent) {
            enCurrent = enCurrent[p];
          } else {
            return fallback || keyPath;
          }
        }
        return typeof enCurrent === 'string' ? enCurrent : fallback || keyPath;
      }
    }
    return typeof current === 'string' ? current : fallback || keyPath;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, getText }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
