export function findYokaiByInput(inputText, yokais) {
    const text = inputText.trim().toLowerCase();

    return yokais.find(yokai => {
        return Object.values(yokai.names).some(langObj => {
            const namesToCheck = [langObj.display, ...(langObj.aliases || [])];
            return namesToCheck.some(name => name.toLowerCase() === text);
        });
    });
}

export function updateScore(total, actual, scoreOutput) {
    scoreOutput.textContent = actual + " / " + total;
}

export function resetScore(total, scoreOutput) {
    scoreOutput.textContent =  "0 / " + total;
}