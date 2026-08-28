import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_LANG, LANGS, localized, translate } from './strings';

const STORAGE_KEY = 'ddo.lang';

const I18nContext = createContext(null);

function readInitialLang() {
    if (typeof window === 'undefined') return DEFAULT_LANG;
    try {
        const stored = window.localStorage?.getItem(STORAGE_KEY);
        if (stored && LANGS[stored]) return stored;
    } catch {
        // localStorage can throw in private mode — fall through to the default.
    }
    return DEFAULT_LANG;
}

export function I18nProvider({ children }) {
    const [lang, setLangState] = useState(readInitialLang);

    const setLang = useCallback((next) => {
        if (!LANGS[next]) return;
        setLangState(next);
        try {
            window.localStorage?.setItem(STORAGE_KEY, next);
        } catch {
            // Persistence is best-effort; the app still works without it.
        }
    }, []);

    const toggleLang = useCallback(() => {
        setLang(lang === 'ar' ? 'en' : 'ar');
    }, [lang, setLang]);

    // Drive the document direction from language: this is what makes RTL real
    // rather than cosmetic — Tailwind logical properties and the Cesium widget
    // both key off dir/lang on <html>.
    useEffect(() => {
        if (typeof document === 'undefined') return;
        const meta = LANGS[lang] || LANGS[DEFAULT_LANG];
        document.documentElement.setAttribute('lang', meta.htmlLang);
        document.documentElement.setAttribute('dir', meta.dir);
    }, [lang]);

    const value = useMemo(() => {
        const meta = LANGS[lang] || LANGS[DEFAULT_LANG];
        return {
            lang,
            dir: meta.dir,
            isRtl: meta.dir === 'rtl',
            setLang,
            toggleLang,
            t: (key) => translate(lang, key),
            L: (val) => localized(val, lang),
        };
    }, [lang, setLang, toggleLang]);

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
    const ctx = useContext(I18nContext);
    if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
    return ctx;
}
