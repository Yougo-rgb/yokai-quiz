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
    const yokaiContent = document.getElementById("yokai-content");

    startBtn.addEventListener("click", () => {
        modal.style.display = "flex";
    });
    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });
    resetBtn.addEventListener("click", () => {
        resetGame();
    });

    let isGameStart = false;

    /* Fetch yokai data once */
    let allYokai = [];
    let yokais = [];
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
            yokais = allYokai;
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
                yokais = filterYokaiByGame(game.id);
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
                yokais = filterYokaiByTribe(tribe.id);
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

    /* Display yokai on yokai-content */
    function displayYokai(lang) {
        yokaiContent.innerHTML = '';

        yokais.forEach(yokai => {
            const el = document.createElement("span");
            el.classList.add("yokai-badge");
            el.dataset.yokai = yokai.id;

            const img = document.createElement("img");
            img.src = yokai.image;
            img.alt = yokai.names[lang].display;
            img.title = yokai.names[lang].display;
            img.style.width = "50px";
            img.style.height = "50px";
            img.style.objectFit = "cover";
            img.style.borderRadius = "50%";

            // el.textContent = yokai.names[lang].display;
            el.appendChild(img);
            yokaiContent.appendChild(el);
        })
    }

    /* Clear yokai-content */
    function clearYokai() {
        yokaiContent.innerHTML = '';
    }

    /* Start a game with the filtered yokai array*/
    function startGame() {
        isGameStart = true;
        modal.style.display = "none";
        startBtn.style.display = "none";
        resetBtn.style.display = "block";
        yokaiContent.style.display = "grid";
        console.log(yokais);

        displayYokai(savedLang);
    }

    /* Reset game */
    function resetGame() {
        isGameStart = false;
        startBtn.style.display = "block";
        resetBtn.style.display = "none";
        yokaiContent.style.display = "none";
        yokais = [];
        console.log(yokais);

        clearYokai();
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
        if (isGameStart) {
            clearYokai();
            displayYokai(lang);
        }
    });
});