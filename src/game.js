export function findYokaiByInput(inputText, yokais) {
    const text = inputText.trim().toLowerCase();

    return yokais.find(yokai => {
        return Object.values(yokai.names).some(langObj => {
            const namesToCheck = [langObj.display, ...(langObj.aliases || [])];
            return namesToCheck.some(name => name.toLowerCase() === text);
        });
    });
}

export function revealYokai(yokai, lang) {
    const el = document.querySelector(`.yokai-badge[data-yokai="${yokai.id}"]`);
    if (!el) return;

    const img = el.querySelector("img");
    img.src = yokai.image;
    img.alt = yokai.names[lang].display;
}

export function updateScore(total, actual, scoreOutput) {
    scoreOutput.textContent = actual + " / " + total;
}

export function resetScore(total, scoreOutput) {
    scoreOutput.textContent =  "0 / " + total;
}

let startTime = null;
let timerId = null;
let timerOutput = null;

export function initTimer(outputElement) {
    timerOutput = outputElement;
    timerOutput.textContent = "00:00";
}

export function startTimer() {
    if (timerId !== null) return;

    startTime = performance.now();
    timerId = requestAnimationFrame(updateTimer);
}

function updateTimer(now) {
    const elapsedMs = now - startTime;

    const totalSeconds = Math.floor(elapsedMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    timerOutput.textContent =
        `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    timerId = requestAnimationFrame(updateTimer);
}

export function stopTimer() {
    if (timerId !== null) {
        cancelAnimationFrame(timerId);
        timerId = null;
    }
}

export function resetTimer() {
    stopTimer();
    startTime = null;
    timerOutput.textContent = "00:00";
}