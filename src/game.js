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
                        console.log(excludedYokaisFound)
                    }
                    matched.push(yokai);
                    revealYokai(yokai, lang);
                }
            });
        });
    });
    return matched;
}

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

export function launchConfetti() {
    confetti({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.6 }
    });
}