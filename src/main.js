import { loadLang, applyTranslations } from "./i18n.js";

/* Language handling */
const select = document.getElementById("lang-select");
let savedLang = localStorage.getItem("lang") || "en";

await loadLang(savedLang);
applyTranslations();
select.value = savedLang

select.addEventListener("change", async () => {
    const lang = select.value;
    await loadLang(lang);
    applyTranslations()
    localStorage.setItem("lang", lang)
});

/* Theme handling */
const toggle = document.getElementById("theme-toggle");
toggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    if (currentTheme === "dark") {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
    } else {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
    }
});

const savedTheme = localStorage.getItem("theme");
if (savedTheme) document.documentElement.setAttribute("data-theme", savedTheme);