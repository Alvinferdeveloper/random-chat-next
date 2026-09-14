import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import es from '@/src/locales/es.json';
import en from '@/src/locales/en.json';

const SUPPORTED_LANGUAGES = ['es', 'en'] as const;
type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];
const LANGUAGE_STORAGE_KEY = 'lang';

i18next.use(initReactI18next).init({
    resources: {
        es: { translation: es },
        en: { translation: en },
    },
    lng: 'es',
    fallbackLng: 'es',
    interpolation: { escapeValue: false },
});

// Runs client-side only, after the initial (SSR-matching) render, so the
// browser/system language is picked up without causing a hydration mismatch.
export function detectAndApplyLanguage() {
    if (typeof window === 'undefined') return;

    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    const preferred: SupportedLanguage = SUPPORTED_LANGUAGES.includes(stored as SupportedLanguage)
        ? (stored as SupportedLanguage)
        : window.navigator.language?.slice(0, 2).toLowerCase() === 'en'
            ? 'en'
            : 'es';

    if (preferred !== i18next.language) {
        i18next.changeLanguage(preferred);
    }
    if (!stored) {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, preferred);
    }
}

export { useTranslation } from 'react-i18next';
export default i18next;
