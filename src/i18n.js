let translations = {};
let currentLang = "fr";

/**
 * Load translations from a JSON file and set current language
 * @param {string} lang -Language code (e.g., "fr", "en")
 */
export async function loadLang(lang) {
    const res = await fetch(`./i18n/${lang}.json`);
    translations = await res.json();
    currentLang = lang;
}

/**
 * Get translation by key, warn if missing
 * @param {string} key - Dot-separated key, e.g., "quiz.title" 
 * @returns {string} - Translated text or key if not found
 */
export function t(key) {
    const value = key.split(".").reduce((obj, k) => obj?.[k], translations);
    if (value === undefined) {
        console.warn(`No translation found for : ${key}`);
        return key;
    }
    return value;
}

/**
 * Apply translations to all elements with data-i18n attribute
 */
export function applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        el.textContent = t(el.dataset.i18n);
    });
}