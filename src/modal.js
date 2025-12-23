export function initModal({ modal, startBtn, closeBtn, resetBtn, onReset }) {
    startBtn.addEventListener("click", () => {
        modal.style.display = "flex";
    });

    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    resetBtn.addEventListener("click", () => {
        onReset();
    });
}