/**
 * Initializes modal interactions and event listeners.
 * 
 * Sets up visibility toggles for the modal and binds the reset logic.
 * 
 * @param {Object} options - The configuration object.
 * @param {HTMLElement} options.modal - The modal container element to show or hide.
 * @param {HTMLElement} options.startBtn - The button used to open the modal.
 * @param {HTMLElement} options.closeBtn - The button used to close the modal.
 * @param {HTMLElement} options.resetBtn - The button that triggers the reset process.
 * @param {Function} options.onReset - Callback function executed when the reset button is clicked.
 */
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