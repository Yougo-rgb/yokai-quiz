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
    const resetBtn = document.getElementById("reset-game");
    const closeBtn = document.getElementById("close-modal");

    startBtn.addEventListener("click", () => {
        modal.style.display = "flex";
    });
    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });
    resetBtn.addEventListener("click", () => {
        resetGame();
    });

    /* Fetch yokai data once */
    let allYokai = [];
    let yokai = [];
    async function loadYokaiOnce() {
        const res_yokai = await fetch("../data/yokai/ykw1.json");
        const data_yokai = await res_yokai.json()
        allYokai = data_yokai.yokai;
    }

    /* Fetch tribes data once */
    const res_tribes = await fetch("../data/tribes.json");
    const data_tribes = await res_tribes.json();
    const tribes = data_tribes.tribes;

    /* Fetch Games data once  */
    const res_games = await fetch("../data/games.json");
    const data_games = await res_games.json();
    const games = data_games.games;

    /* Function to populate tribe and game buttons */
    function populateGameModeButton(lang) {
        modeContainer.innerHTML = '';

        // Add the "All" button
        const allBtn = document.createElement("button");
        allBtn.classList.add("mode-btn");
        allBtn.dataset.tribe = "all";
        allBtn.textContent = t("quiz.modeAll") || "All";
        allBtn.addEventListener("click", () => {
            yokai = allYokai;
            startGame();
        });
        modeContainer.appendChild(allBtn);
        
        // Add buttons for each game
        games.forEach(game => {
            const btn = document.createElement("button");
            btn.classList.add("mode-btn");
            btn.dataset.game = game.id;
            btn.textContent = game.names[lang].display;
            btn.addEventListener("click", () => {
                yokai = filterYokaiByGame(game.id);
                startGame();
            })
            modeContainer.appendChild(btn);
        })

        // Add buttons for each tribe
        tribes.forEach(tribe => {
            const btn = document.createElement("button");
            btn.classList.add("mode-btn");
            btn.dataset.tribe = tribe.id;
            btn.textContent = tribe.names[lang].display;
            btn.addEventListener("click", () => {
                yokai = filterYokaiByTribe(tribe.id);
                startGame();
            });
            modeContainer.appendChild(btn);
        });
    }

    /* Filter allYokai */
    function filterYokaiByTribe(id) {
        return allYokai.filter(y => y.tribe_id === id);
    }
    function filterYokaiByRank(id) {
        return allYokai.filter(y => y.rank_id === id);
    }
    function filterYokaiByYokaiType(id) {
        return allYokai.filter(y => y.yokai_type === id);
    }
    function filterYokaiByFirstGame(id) {
        return allYokai.filter(y => y.first_game_id === id);
    }
    function filterYokaiByGame(id) {
        return allYokai.filter(y => y.game_ids.includes(id));
    }

    /* Start a game with the filtered yokai array*/
    function startGame() {
        modal.style.display = "none";
        startBtn.style.display = "none";
        resetBtn.style.display = "block";
        console.log(yokai);
    }

    /* Reset game */
    function resetGame() {
        startBtn.style.display = "block";
        resetBtn.style.display = "none";
        yokai = [];
        console.log(yokai);
    }

    // Initial population and yokai load
    await loadYokaiOnce();
    populateGameModeButton(savedLang);

    // Update buttons when language changes
    select.addEventListener("change", async () => {
        const lang = select.value;
        await loadLang(lang);
        applyTranslations();
        localStorage.setItem("lang", lang);

        populateGameModeButton(lang);
    });
});