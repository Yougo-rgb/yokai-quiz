import { loadLang, applyTranslations } from "./i18n.js";

/**
 * Initializes the application's language settings.
 * 
 * Loads the saved language from localStorage (defaulting to 'en'),
 * applies translations, and sets up a listener for manual changes.
 * 
 * @async
 * @param {HTMLSelectElement} select - The dropdown element used for language selection.
 * @param {Function} onChange - Callback function executed whenever the language is updated.
 *                              Receives the new language code as a string.
 * @returns {Promise<string>} A promise that resolves to the initial language code.
 */
export async function initLanguage(select, onChange) {
    let savedLang = localStorage.getItem("lang") || "en";

    await loadLang(savedLang);
    applyTranslations();
    select.value = savedLang;

    select.addEventListener("change", async () => {
        const lang = select.value;
        await loadLang(lang);
        applyTranslations();
        localStorage.setItem("lang", lang);
        onChange(lang);
    });

    return savedLang;
}