import { loadLang, applyTranslations, t } from "./i18n.js";

document.addEventListener("DOMContentLoaded", async () => {
    /* Language handling */
    const select = document.getElementById("lang-select");
    let savedLang = localStorage.getItem("lang") || "en";
    await loadLang(savedLang);
    applyTranslations();
    select.value = savedLang;

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

    /* Modal handling */
    const modal = document.getElementById("game-modal");
    const modeContainer = modal.querySelector(".mode-buttons");
    const startBtn = document.getElementById("start-game");
    const closeBtn = document.getElementById("close-modal");

    startBtn.addEventListener("click", () => {
        modal.style.display = "flex";
    });
    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    /* Fetch tribes data once */
    const res = await fetch("../data/tribes.json");
    const data = await res.json();
    const tribes = data.tribes;

    /* Function to populate tribe buttons */
    function populateTribes(lang) {
        modeContainer.innerHTML = '';

        // Add the "All" button
        const allBtn = document.createElement("button");
        allBtn.classList.add("mode-btn");
        allBtn.dataset.tribe = "all";
        allBtn.textContent = t("quiz.modeAll") || "All";
        allBtn.addEventListener("click", () => {
            console.log("Selected tribe: all");
            modal.style.display = "none";
        });
        modeContainer.appendChild(allBtn);

        // Add buttons for each tribe
        tribes.forEach(tribe => {
            const btn = document.createElement("button");
            btn.classList.add("mode-btn");
            btn.dataset.tribe = tribe.id;
            btn.textContent = tribe.names[lang].display;
            btn.addEventListener("click", () => {
                console.log("Selected :", tribe.id);
                modal.style.display = "none";
            });
            modeContainer.appendChild(btn);
        });
    }

    // Initial population
    populateTribes(savedLang);

    // Update buttons when language changes
    select.addEventListener("change", async () => {
        const lang = select.value;
        await loadLang(lang);
        applyTranslations();
        localStorage.setItem("lang", lang);

        populateTribes(lang);
    });
});