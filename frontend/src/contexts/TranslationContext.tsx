'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, TranslationKey, getNestedTranslation } from '../lib/translations';

interface TranslationContextType {
  language: 'EN' | 'HI';
  setLanguage: (lang: 'EN' | 'HI') => void;
  t: (key: TranslationKey) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'EN' | 'HI'>('EN');

  useEffect(() => {
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('pahad-language') as 'EN' | 'HI';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    // Save language preference
    localStorage.setItem('pahad-language', language);
  }, [language]);

  const t = (key: TranslationKey): string => {
    const value = getNestedTranslation(translations[language], key) ?? getNestedTranslation(translations.EN, key);
    return value || key;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
