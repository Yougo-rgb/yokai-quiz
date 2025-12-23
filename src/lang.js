import { loadLang, applyTranslations } from "./i18n.js";

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