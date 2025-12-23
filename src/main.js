import { t } from "./i18n.js";
import { initLanguage } from "./lang.js";
import { initTheme } from "./theme.js";
import { initModal } from "./modal.js";

import {
    filterYokaiByTribe,
    filterYokaiByGame
} from "./yokaiFilters.js";

import { displayYokai, clearYokai } from "./yokaiDisplay.js";

import { findYokaiByInput, updateScore, resetScore } from "./game.js";

document.addEventListener("DOMContentLoaded", async () => {

    /* DOM */
    const select = document.getElementById("lang-select");
    const toggle = document.getElementById("theme-toggle");
    const modal = document.getElementById("game-modal");
    const modeContainer = modal.querySelector(".mode-buttons");
    const startBtn = document.getElementById("start-game");
    const resetBtn = document.getElementById("reset-game");
    const closeBtn = document.getElementById("close-modal");
    const yokaiContent = document.getElementById("yokai-content");
    const yokaiNameInput = document.getElementById("yo-kai-name");
    const timerOutput = document.getElementById("timer");
    const scoreOutput = document.getElementById("score");
    const gameModeText = document.getElementById("game-mode-text");

    /* Init language */
    let savedLang = await initLanguage(select, (lang) => {
        populateGameModeButton(lang);
        if (isGameStart) {
            clearYokai(yokaiContent);
            displayYokai(yokaiContent, yokais, lang);
        }
    });

    /* Init theme */
    initTheme(toggle);

    /* Game state */
    let isGameStart = false;
    let allYokai = [];
    let yokais = [];
    let foundYokai = [];

    /* Init modal */
    initModal({
        modal,
        startBtn,
        closeBtn,
        resetBtn,
        onReset: resetGame
    });

    /* Load yokai */
    const res = await fetch("../data/yokai/ykw1.json");
    allYokai = (await res.json()).yokai;

    /* Data */
    const tribes = (await (await fetch("../data/tribes.json")).json()).tribes;
    const games = (await (await fetch("../data/games.json")).json()).games;

    function populateGameModeButton(lang) {
        modeContainer.innerHTML = "";

        const allBtn = document.createElement("button");
        allBtn.classList.add("mode-btn");
        allBtn.textContent = t("quiz.modeAll") || "All";
        allBtn.onclick = () => {
            yokais = allYokai;
            gameModeText.textContent = t("quiz.modeAll") || "All"
            startGame();
        };
        modeContainer.appendChild(allBtn);

        games.forEach(game => {
            const btn = document.createElement("button");
            btn.classList.add("mode-btn");
            btn.textContent = game.names[lang].display;
            btn.onclick = () => {
                yokais = filterYokaiByGame(allYokai, game.id);
                gameModeText.textContent = game.names[lang].display
                startGame();
            };
            modeContainer.appendChild(btn);
        });

        tribes.forEach(tribe => {
            const btn = document.createElement("button");
            btn.classList.add("mode-btn");
            btn.textContent = tribe.names[lang].display;
            btn.onclick = () => {
                yokais = filterYokaiByTribe(allYokai, tribe.id);
                gameModeText.textContent = tribe.names[lang].display
                startGame();
            };
            modeContainer.appendChild(btn);
        });
    }

    function startGame() {
        isGameStart = true;
        modal.style.display = "none";
        startBtn.style.display = "none";
        resetBtn.style.display = "block";
        yokaiContent.style.display = "grid";
        yokaiNameInput.style.display = "flex";
        timerOutput.style.display = "flex";
        scoreOutput.style.display = "flex";
        gameModeText.style.display = "block";
        yokaiNameInput.value = "";

        foundYokai = [];
        resetScore(yokais.length, scoreOutput);

        displayYokai(yokaiContent, yokais, savedLang);

        yokaiNameInput.addEventListener("input", () => {
            const matched = findYokaiByInput(yokaiNameInput.value, yokais);
            if (matched) {
                if (!foundYokai.includes(matched.id)) {
                    console.log("Yokai :", matched);
                    foundYokai.push(matched.id);
                    // Show image
                    console.log(foundYokai)
                    updateScore(yokais.length, foundYokai.length, scoreOutput);
                } else {
                    console.log("Yokai ", matched.names[savedLang].display, "already foound");
                }
                yokaiNameInput.value = "";
            }
        })
    }

    function resetGame() {
        isGameStart = false;
        startBtn.style.display = "block";
        resetBtn.style.display = "none";
        yokaiContent.style.display = "none";
        yokaiNameInput.style.display = "none";
        timerOutput.style.display = "none";
        scoreOutput.style.display = "none";
        gameModeText.style.display = "none";
        yokaiNameInput.value = "";
        yokais = [];
        foundYokai = [];
        clearYokai(yokaiContent);
        resetScore(0, scoreOutput);
    }

    populateGameModeButton(savedLang);
});