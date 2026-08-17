import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from '../i18n/translations/en';
import { hi } from '../i18n/translations/hi';
import { kn } from '../i18n/translations/kn';
import { ar } from '../i18n/translations/ar';
import { zhCN } from '../i18n/translations/zh-CN';
import { fr } from '../i18n/translations/fr';
import { de } from '../i18n/translations/de';
import { pt } from '../i18n/translations/pt';
import { es } from '../i18n/translations/es';
import { th } from '../i18n/translations/th';

export type LanguageCode = 'en' | 'hi' | 'kn' | 'ar' | 'zh-CN' | 'fr' | 'de' | 'pt' | 'es' | 'th';

export interface Language {
  code: LanguageCode;
  nativeName: string;
  englishName: string;
  dir: 'ltr' | 'rtl';
}

export const LANGUAGES: Language[] = [
  { code: 'en', nativeName: 'English', englishName: 'English', dir: 'ltr' },
  { code: 'hi', nativeName: 'हिन्दी', englishName: 'Hindi', dir: 'ltr' },
  { code: 'kn', nativeName: 'ಕನ್ನಡ', englishName: 'Kannada', dir: 'ltr' },
  { code: 'ar', nativeName: 'العربية', englishName: 'Arabic', dir: 'rtl' },
  { code: 'zh-CN', nativeName: '简体中文', englishName: 'Chinese', dir: 'ltr' },
  { code: 'fr', nativeName: 'Français', englishName: 'French', dir: 'ltr' },
  { code: 'de', nativeName: 'Deutsch', englishName: 'German', dir: 'ltr' },
  { code: 'pt', nativeName: 'Português', englishName: 'Portuguese', dir: 'ltr' },
  { code: 'es', nativeName: 'Español', englishName: 'Spanish', dir: 'ltr' },
  { code: 'th', nativeName: 'ไทย', englishName: 'Thai', dir: 'ltr' }
];

const translationDict: Record<LanguageCode, any> = {
  en,
  hi,
  kn,
  ar,
  'zh-CN': zhCN,
  fr,
  de,
  pt,
  es,
  th
};

interface LanguageContextProps {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  dir: 'ltr' | 'rtl';
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getInitialLanguage = (): LanguageCode => {
    // 1. Check URL parameters
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlLang = params.get('lang') as LanguageCode;
      if (urlLang && translationDict[urlLang]) {
        localStorage.setItem('blunet_locale', urlLang);
        return urlLang;
      }
    }

    // 2. Check localStorage key 'blunet_locale' (as required by translation prompt)
    const stored = localStorage.getItem('blunet_locale') as LanguageCode;
    if (stored && translationDict[stored]) {
      return stored;
    }

    // 3. Check browser preference
    if (typeof navigator !== 'undefined') {
      const browserPref = navigator.language;
      // Handle full codes like zh-CN first
      if (browserPref === 'zh-CN' || browserPref.toLowerCase().startsWith('zh-cn')) {
        return 'zh-CN';
      }
      
      const browserLang = browserPref.substring(0, 2) as LanguageCode;
      if (browserLang && translationDict[browserLang]) {
        return browserLang;
      }
    }

    return 'en';
  };

  const [language, setLanguageState] = useState<LanguageCode>(getInitialLanguage);

  const setLanguage = (lang: LanguageCode) => {
    if (translationDict[lang]) {
      setLanguageState(lang);
      localStorage.setItem('blunet_locale', lang);
    }
  };

  const activeLangConfig = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];
  const dir = activeLangConfig.dir;

  // React on changes to update document attributes
  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
    document.documentElement.setAttribute('dir', dir);
    
    // Toggle standard tailwind direction classes if needed
    if (dir === 'rtl') {
      document.documentElement.classList.add('rtl');
      document.documentElement.classList.remove('ltr');
    } else {
      document.documentElement.classList.add('ltr');
      document.documentElement.classList.remove('rtl');
    }
  }, [language, dir]);

  // Translate helper (hierarchical resolver with fallback to English)
  const t = (key: string): string => {
    const getNestedValue = (obj: any, path: string): any => {
      return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    // Try selected language
    let value = getNestedValue(translationDict[language], key);
    
    // Fallback to English
    if (value === undefined || value === null) {
      value = getNestedValue(translationDict['en'], key);
    }

    // Ultimate fallback is the key name itself
    if (value === undefined || value === null) {
      return key;
    }

    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dir, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
