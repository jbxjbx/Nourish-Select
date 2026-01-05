'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { translations, Language } from '@/lib/translations';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'nourish-select-language';

// Detect browser language and map to our supported languages
function detectBrowserLanguage(): Language {
    if (typeof navigator === 'undefined') return 'en';

    const browserLang = navigator.language || (navigator as any).userLanguage || 'en';
    const langCode = browserLang.toLowerCase().split('-')[0];

    // Map browser language codes to our supported languages
    if (langCode === 'zh' || langCode === 'cn') {
        return 'cn';
    } else if (langCode === 'ja' || langCode === 'jp') {
        return 'jp';
    }

    // Default to English for all other languages
    return 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('en');
    const [isHydrated, setIsHydrated] = useState(false);

    // Load language from localStorage on mount, or detect from browser
    useEffect(() => {
        const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;

        if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'cn' || savedLanguage === 'jp')) {
            // User has previously set a preference
            setLanguageState(savedLanguage);
        } else {
            // First-time visitor: detect browser language
            const detectedLang = detectBrowserLanguage();
            setLanguageState(detectedLang);
            localStorage.setItem(LANGUAGE_STORAGE_KEY, detectedLang);
        }
        setIsHydrated(true);
    }, []);

    // Wrapper to save language to localStorage when changed
    const setLanguage = useCallback((lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    }, []);

    // Helper to get nested translation
    const t = useCallback((path: string) => {
        const keys = path.split('.');
        let current: any = translations[language];

        for (const key of keys) {
            if (current[key] === undefined) return path;
            current = current[key];
        }
        return current;
    }, [language]);

    // Prevent hydration mismatch by showing nothing until mounted
    // Actually, we should render with default 'en' and update after hydration
    // This avoids flicker while still persisting the choice

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
