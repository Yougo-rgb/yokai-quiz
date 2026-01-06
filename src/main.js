import { t } from "./i18n.js";
import { initLanguage } from "./lang.js";
import { initTheme } from "./theme.js";
import { initModal } from "./modal.js";

import {
    filterYokaiByTribe,
    filterYokaiByGame
} from "./yokaiFilters.js";

import { displayYokai, clearYokai } from "./yokaiDisplay.js";

import { 
    findYokaiByInput, 
    revealYokai,
    updateScore, 
    resetScore, 
    initTimer, 
    startTimer, 
    stopTimer, 
    resetTimer,
    launchConfetti
} from "./game.js";

import { createHtmlAndPdf } from "./pdf.js"

document.addEventListener("DOMContentLoaded", async () => {

    /* DOM */
    const LangSelect = document.getElementById("lang-select");
    const ThemeToggle = document.getElementById("theme-toggle");
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
    const endGame = document.getElementById("end-game");
    const restartBtn = document.getElementById("restart-btn");
    const endGameModeText = document.getElementById("end-game-mode-text");
    const endGameTime = document.getElementById("end-game-time");
    const generatePdfBtn = document.getElementById("generate-pdf");

    /* Init language */
    let savedLang = await initLanguage(LangSelect, (lang) => {
        populateGameModeButton(lang);
        if (isGameStart) {
            clearYokai(yokaiContent);
            displayYokai(yokaiContent, yokais, lang);
        }
    });

    /* Init theme */
    initTheme(ThemeToggle);

    /* Game state */
    let isGameStart = false;
    let allYokai = [];
    let yokais = [];
    let foundYokai = [];
    let startTime = null;
    let timerId = null;
    let gameModeLabel = "";
    let excludedYokais = ['casteliusi', 'casteliusii', 'cuttanah'];
    let excludedYokaisFound = [];

    /* Init modal */
    initModal({
        modal,
        startBtn,
        closeBtn,
        resetBtn,
        onReset: resetGame
    });

    /* Init Timer */
    initTimer(timerOutput);

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
            gameModeLabel = t("quiz.modeAll") || "All"
            startGame();
        };
        modeContainer.appendChild(allBtn);

        games.forEach(game => {
            const btn = document.createElement("button");
            btn.classList.add("mode-btn");
            btn.textContent = game.names[lang].display;
            btn.onclick = () => {
                yokais = filterYokaiByGame(allYokai, game.id);
                gameModeLabel = game.names[lang].display;
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
                gameModeLabel = tribe.names[lang].display;
                startGame();
            };
            modeContainer.appendChild(btn);
        });
    }

    function startGame() {
        setupStartGame();
        yokaiNameInput.focus();
        yokaiNameInput.select();
        resetScore(yokais.length, scoreOutput);
        startTimer();

        displayYokai(yokaiContent, yokais, savedLang);
        gameModeText.textContent = gameModeLabel;

        yokaiNameInput.addEventListener("input", () => {
            const matchedYokais = findYokaiByInput(yokaiNameInput.value, yokais, savedLang, excludedYokais, excludedYokaisFound);
            
            matchedYokais.forEach(matched => {
                if (!foundYokai.includes(matched.id)) {
                    console.log("Yokai :", matched);
                    foundYokai.push(matched.id);
                    console.log(foundYokai)
                    updateScore(yokais.length, foundYokai.length, scoreOutput);
                } else {
                    console.log("Yokai", matched.names[savedLang].display, "already found");
                }
                yokaiNameInput.value = "";
            });
    
            if (foundYokai.length === yokais.length) {
                stopTimer();
                launchConfetti();
                endGame.style.display = "flex";
                endGameModeText.textContent = gameModeLabel;
                endGameTime.textContent = t("quiz.time") + ": " + timerOutput.textContent;
                restartBtn.onclick = function() { resetGame(); };
                generatePdfBtn.onclick = function() { createHtmlAndPdf(yokais, foundYokai, {
                    lang: savedLang,
                    time: timerOutput.textContent,
                    mode: gameModeLabel
                }); };
            }
        })
    }

    function resetGame() {
        setupResetGame();
        clearYokai(yokaiContent);
        resetScore(0, scoreOutput);
        stopTimer();
        resetTimer();
    }

    populateGameModeButton(savedLang);

    function setupStartGame() {
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
        LangSelect.style.display = "none";
        foundYokai = [];
    }

    function setupResetGame() {
        isGameStart = false;
        startBtn.style.display = "block";
        resetBtn.style.display = "none";
        yokaiContent.style.display = "none";
        yokaiNameInput.style.display = "none";
        timerOutput.style.display = "none";
        scoreOutput.style.display = "none";
        gameModeText.style.display = "none";
        yokaiNameInput.value = "";
        LangSelect.style.display = "flex";
        endGame.style.display = "none";
        yokais = [];
        foundYokai = [];
    }
});