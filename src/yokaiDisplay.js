/**
 * Dynamically renders the Yo-kai list into the container by groups of 12.
 * 
 * Initializes Yo-kai as hidden placeholders using an interrogation mark image.
 * 
 * @param {HTMLElement} container - The parent element where the Yo-kai groups will be appended.
 * @param {Array<Object>} yokais - The array of Yo-kai objects to be displayed.
 */
export function displayYokai(container, yokais) {
    container.innerHTML = "";

    for (let i = 0; i < yokais.length; i += 12) {
        const group = document.createElement("div");
        group.classList.add("yokai-group");

        const slice = yokais.slice(i, i + 12);

        slice.forEach(yokai => {
            const el = document.createElement("span");
            el.classList.add("yokai-badge");
            el.dataset.yokai = yokai.id;

            const img = document.createElement("img");
            img.src = "./assets/ui/interogation.png";
            img.style.width = "50px";
            img.style.height = "50px";
            img.style.borderRadius = "50%";

            el.appendChild(img);
            group.appendChild(el);
        });

        container.appendChild(group);
    }
}

/**
 * Removes all content from the Yo-kai container.
 * 
 * @param {HTMLElement} container - The DOM element to be emptied.
 */
export function clearYokai(container) {
    container.innerHTML = '';
}