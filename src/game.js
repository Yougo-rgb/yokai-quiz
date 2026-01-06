let startTime = null;
let timerId = null;
let timerOutput = null;

/**
 * Searches for and validates Yo-kai based on user input.
 * 
 * Handles text normalization, alias checking, and duplicate exclusion logic.
 * 
 * @param {string} inputText - The raw string entered by the user.
 * @param {Array} yokais - The master list of Yo-kai objects.
 * @param {string} lang - The current display language (e.g., 'en', 'fr').
 * @param {string[]} excludedYokais - List of names identified as exclusions.
 * @param {string[]} excludedYokaisFound - Registry of exclusions already matched.
 * 
 * @returns {Array} Array of matched Yo-kai objects.
 */
export function findYokaiByInput(inputText, yokais, lang, excludedYokais, excludedYokaisFound) {
    const text = inputText.toLowerCase().replace(/[\s.\-']/g, "")
    const matched = [];

    yokais.forEach(yokai => {
        const langs = Object.keys(yokai.names);

        langs.forEach(l => {
            const namesToCheck = [yokai.names[l].display, ...(yokai.names[l].aliases || [])];

            namesToCheck.forEach(name => {
                const normalizedName = name.toLowerCase().replace(/[\s.\-']/g, "")
                if (normalizedName === text && !excludedYokaisFound.includes(text)) {
                    if (excludedYokais.includes(text)) {
                        excludedYokaisFound.push(text)
                    }
                    matched.push(yokai);
                    revealYokai(yokai, lang);
                }
            });
        });
    });
    return matched;
}

/**
 * Updates the UI to reveal a Yo-kai's identity (image and titles).
 * 
 * @param {Object} yokai - The Yo-kai object to reveal.
 * @param {string} lang - The language key to use for image alt and title attributes.
 */
export function revealYokai(yokai, lang) {
    const els = document.querySelectorAll(`.yokai-badge[data-yokai="${yokai.id}"]`);
    els.forEach(el => {
        const img = el.querySelector("img");
        if (!img) return;
        img.src = yokai.image;
        img.alt = yokai.names[lang].display;
        img.title = yokai.names[lang].display;
    });
}

/**
 * Updates the score display element.
 * 
 * @param {number} total - The total number of Yo-kai with the selected mode.
 * @param {number} actual - The current count of Yo-kai found.
 * @param {HTMLElement} scoreOutput - The DOM element where the score is displayed.
 */
export function updateScore(total, actual, scoreOutput) {
    scoreOutput.textContent = actual + " / " + total;
}

/**
 * Resets the score display to zero.
 * 
 * @param {number} total - The total number of Yo-kai to display in the "0 / Total" format.
 * @param {HTMLElement} scoreOutput - The DOM element target.
 */
export function resetScore(total, scoreOutput) {
    scoreOutput.textContent =  "0 / " + total;
}

/**
 * Initializes the timer by linking it to a UI output element.
 * 
 * @param {HTMLElement} outputElement - The DOM element that will display the time.
 */
export function initTimer(outputElement) {
    timerOutput = outputElement;
    timerOutput.textContent = "00:00";
}

/**
 * Starts the timer using requestAnimationFrame for high-precision tracking.
 * Prevents multiple intervals from running simultaneously.
 */
export function startTimer() {
    if (timerId !== null) return;

    startTime = performance.now();
    timerId = requestAnimationFrame(updateTimer);
}

/**
 * Internal loop to calculate elapsed time and format the MM:SS string.
 * @private
 * @param {number} now - High-res timestamp provided by requestAnimationFrame.
 */
function updateTimer(now) {
    const elapsedMs = now - startTime;

    const totalSeconds = Math.floor(elapsedMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    timerOutput.textContent =
        `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    timerId = requestAnimationFrame(updateTimer);
}

/**
 * Stops the timer and cancels the pending animation frame.
 */
export function stopTimer() {
    if (timerId !== null) {
        cancelAnimationFrame(timerId);
        timerId = null;
    }
}

/**
 * Stops the timer and resets the display to "00:00".
 */
export function resetTimer() {
    stopTimer();
    startTime = null;
    timerOutput.textContent = "00:00";
}

/**
 * Triggers a visual confetti celebration.
 * 
 * Note: Requires like canvas-confetti 
 * 
 * https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js.
 */
export function launchConfetti() {
    confetti({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.6 }
    });
}