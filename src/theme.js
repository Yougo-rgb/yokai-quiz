/**
 * Initializes the application's color theme and sets up the toggle interaction.
 * 
 * Synchronizes the theme state with localStorage to persist user preference 
 * between sessions (Light/Dark mode).
 * 
 * @param {HTMLElement} toggle - The button or input element used to trigger the theme switch.
 * 
 * @example
 * const themeBtn = document.getElementById('theme-toggle');
 * initTheme(themeBtn);
 */
export function initTheme(toggle) {
    toggle.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const nextTheme = currentTheme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", nextTheme);
        localStorage.setItem("theme", nextTheme);
    });

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        document.documentElement.setAttribute("data-theme", savedTheme);
    }
}