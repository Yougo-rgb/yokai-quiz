/**
 * Main Application Controller for the Yo-kai Quiz.
 * Coordinates game state, UI transitions, and data orchestration.
 * 
 * @author Axel Truta & Hugo Pozzi
 * @version 1.2.0
 */
import { t } from "./i18n.js";
import { initLanguage } from "./lang.js";
import { initTheme } from "./theme.js";
import { initModal } from "./modal.js";
import { createHtmlAndPdf } from "./pdf.js";
import { displayYokai, clearYokai } from "./yokaiDisplay.js";
import { filterYokaiByTribe, filterYokaiByGame } from "./yokaiFilters.js";
import { 
    findYokaiByInput, updateScore, resetScore, initTimer, 
    startTimer, stopTimer, resetTimer, launchConfetti 
} from "./game.js";

document.addEventListener("DOMContentLoaded", async () => {
    
    /** 
     * Centralized DOM elements mapping to avoid multiple querySelector calls.
     * 
     * @type {Object<string, HTMLElement>} 
     */
    const UI = {
        langSelect: document.getElementById("lang-select"),
        themeToggle: document.getElementById("theme-toggle"),
        modal: document.getElementById("game-modal"),
        modeContainer: document.querySelector(".mode-buttons"),
        startBtn: document.getElementById("start-game"),
        resetBtn: document.getElementById("reset-game"),
        closeBtn: document.getElementById("close-modal"),
        yokaiContent: document.getElementById("yokai-content"),
        yokaiNameInput: document.getElementById("yo-kai-name"),
        timerOutput: document.getElementById("timer"),
        scoreOutput: document.getElementById("score"),
        gameModeText: document.getElementById("game-mode-text"),
        endGame: document.getElementById("end-game"),
        restartBtn: document.getElementById("restart-btn"),
        endGameModeText: document.getElementById("end-game-mode-text"),
        endGameTime: document.getElementById("end-game-time"),
        generatePdfBtn: document.getElementById("generate-pdf")
    };

    /** 
     * Centralized Game State to track the session progress.
     * @type {Object}
     */
    let state = {
        isGameStart: false,
        allYokai: [],
        currentYokaiPool: [],
        foundYokaiIds: [],
        savedLang: "en",
        gameModeLabel: "",
        excludedYokais: ['casteliusi', 'casteliusii', 'cuttanah'],
        excludedYokaisFound: []
    };

    /**
     * Entry point: Initializes core components and loads remote data.
     * 
     * Starts the app lifecycle by setting up i18n, theme, and fetching JSON files.
     * 
     * @async
     * 
     * @returns {Promise<void>}
     */
    async function init() {
        state.savedLang = await initLanguage(UI.langSelect, handleLanguageChange);
        initTheme(UI.themeToggle);
        initTimer(UI.timerOutput);
        
        initModal({
            modal: UI.modal, 
            startBtn: UI.startBtn, 
            closeBtn: UI.closeBtn,
            resetBtn: UI.resetBtn, 
            onReset: resetGame
        });

        await loadAllData();
        populateGameModeButtons(state.savedLang);
        setupEventListeners();
    }

    /**
     * Fetches all necessary JSON assets in parallel using Promise.all for performance.
     * 
     * @async
     * 
     * @returns {Promise<void>}
     * 
     * @example
     * await loadAllData();
     * console.log(state.allYokai.length); // Outputs total Yo-kai count
     */
    async function loadAllData() {
        try {
            const [yData, tData, gData] = await Promise.all([
                fetch("../data/yokai/ykw1.json").then(r => r.json()),
                fetch("../data/tribes.json").then(r => r.json()),
                fetch("../data/games.json").then(r => r.json())
            ]);
            state.allYokai = yData.yokai;
            state.tribes = tData.tribes;
            state.games = gData.games;
        } catch (error) {
            console.error("Failed to load game data:", error);
        }
    }

    /**
     * Prepares and starts a new game session.
     * 
     * Transitions the UI, resets progress, and starts the countdown.
     * 
     * @param {Array<Object>} filteredYokais - The specific subset of Yo-kai to find.
     * @param {string} label - The human-readable name of the current mode.
     * @example
     * startGame(legendaryYokais, "Legendary Tribe");
     */
    function startGame(filteredYokais, label) {
        state.isGameStart = true;
        state.currentYokaiPool = filteredYokais;
        state.gameModeLabel = label;
        state.foundYokaiIds = [];
        state.excludedYokaisFound = [];

        toggleUIMode(true);
        UI.yokaiNameInput.focus();
        resetScore(state.currentYokaiPool.length, UI.scoreOutput);
        displayYokai(UI.yokaiContent, state.currentYokaiPool, state.savedLang);
        startTimer();
    }

    /**
     * Resets the game to the landing state.
     * 
     * Stops all timers, clears the UI grid, and resets state flags.
     * 
     * @returns {void}
     */
    function resetGame() {
        state.isGameStart = false;
        toggleUIMode(false);
        stopTimer();
        resetTimer();
        clearYokai(UI.yokaiContent);
        resetScore(0, UI.scoreOutput);
    }

    /**
     * Evaluates if the victory conditions are met (found count == pool size).
     * 
     * Triggers the end-game sequence if successful.
     * 
     * @returns {boolean} True if the user has won.
     */
    function checkVictory() {
        if (state.foundYokaiIds.length === state.currentYokaiPool.length) {
            stopTimer();
            launchConfetti();
            showEndScreen();
        }
    }

    /**
     * Attaches global listeners to the UI elements.
     * 
     * Defined once at init to optimize memory and prevent duplicate events.
     * 
     * @returns {void}
     */
    function setupEventListeners() {
        UI.yokaiNameInput.addEventListener("input", (e) => {
            if (!state.isGameStart) return;

            const matches = findYokaiByInput(
                e.target.value, 
                state.currentYokaiPool, 
                state.savedLang, 
                state.excludedYokais, 
                state.excludedYokaisFound
            );

            matches.forEach(yokai => {
                if (!state.foundYokaiIds.includes(yokai.id)) {
                    state.foundYokaiIds.push(yokai.id);
                    updateScore(state.currentYokaiPool.length, state.foundYokaiIds.length, UI.scoreOutput);
                    e.target.value = "";
                    checkVictory();
                }
            });
        });

        UI.restartBtn.onclick = resetGame;
        
        UI.generatePdfBtn.onclick = () => createHtmlAndPdf(state.currentYokaiPool, state.foundYokaiIds, {
            lang: state.savedLang,
            time: UI.timerOutput.textContent,
            mode: state.gameModeLabel
        });
    }

    /**
     * Updates the application language state and re-renders translatable components.
     * 
     * @param {string} lang - The new language code (e.g., 'fr', 'en', 'jp').
     * 
     * @returns {void}
     */
    function handleLanguageChange(lang) {
        state.savedLang = lang;
        populateGameModeButtons(lang);
        if (state.isGameStart) {
            displayYokai(UI.yokaiContent, state.currentYokaiPool, lang);
        }
    }

    /**
     * Toggles between "Gameplay" and "Landing/Selection" visual modes.
     * 
     * Controls CSS display properties for the entire UI dashboard.
     * 
     * @param {boolean} playing - Set to true to show game controls, false for menu.
     * 
     * @returns {void}
     */
    function toggleUIMode(playing) {
        const activeDisplay = playing ? "flex" : "none";
        const landingDisplay = playing ? "none" : "flex";

        UI.modal.style.display = "none";
        UI.startBtn.style.display = landingDisplay;
        UI.langSelect.style.display = landingDisplay;
        
        UI.resetBtn.style.display = playing ? "block" : "none";
        UI.yokaiContent.style.display = playing ? "grid" : "none";
        UI.yokaiNameInput.style.display = activeDisplay;
        UI.timerOutput.style.display = activeDisplay;
        UI.scoreOutput.style.display = activeDisplay;
        UI.gameModeText.style.display = playing ? "block" : "none";
        UI.gameModeText.textContent = state.gameModeLabel;
        UI.endGame.style.display = "none";
        
        if (playing) UI.yokaiNameInput.value = "";
    }

    /**
     * Renders the mode selection buttons based on loaded Tribes and Games metadata.
     * 
     * Uses the i18n service to translate button labels.
     * 
     * @param {string} lang - The language to use for button text.
     * 
     * @returns {void}
     */
    function populateGameModeButtons(lang) {
        UI.modeContainer.innerHTML = "";
        
        // Default 'All' Mode
        createModeBtn(t("quiz.modeAll") || "All", () => startGame(state.allYokai, t("quiz.modeAll") || "All"));
        
        // Dynamic Game Modes
        state.games.forEach(g => createModeBtn(
            g.names[lang].display, 
            () => startGame(filterYokaiByGame(state.allYokai, g.id), g.names[lang].display)
        ));
        
        // Dynamic Tribe Modes
        state.tribes.forEach(t => createModeBtn(
            t.names[lang].display, 
            () => startGame(filterYokaiByTribe(state.allYokai, t.id), t.names[lang].display)
        ));
    }

    /**
     * UI Component Factory: Creates a styled button for game modes.
     * 
     * @param {string} label - The text to display on the button.
     * @param {Function} onClick - The function to execute when clicked.
     * 
     * @returns {HTMLButtonElement} The generated button element.
     */
    function createModeBtn(label, onClick) {
        const btn = document.createElement("button");
        btn.className = "mode-btn";
        btn.textContent = label;
        btn.onclick = onClick;
        UI.modeContainer.appendChild(btn);
    }

    /**
     * Displays the final summary overlay screen with time and mode results.
     * 
     * @returns {void}
     */
    function showEndScreen() {
        UI.endGame.style.display = "flex";
        UI.endGameModeText.textContent = state.gameModeLabel;
        UI.endGameTime.textContent = `${t("quiz.time")}: ${UI.timerOutput.textContent}`;
    }

    // Launch the application
    init();
});