export function displayYokai(container, yokais, lang) {
    container.innerHTML = '';

    yokais.forEach(yokai => {
        const el = document.createElement("span");
        el.classList.add("yokai-badge");
        el.dataset.yokai = yokai.id;

        const img = document.createElement("img");
        img.src = "../assets/ui/interogation.png";
        img.alt = yokai.names[lang].display;
        img.title = yokai.names[lang].display;
        img.style.width = "50px";
        img.style.height = "50px";
        img.style.objectFit = "cover";
        img.style.borderRadius = "50%";

        el.appendChild(img);
        container.appendChild(el);
    });
}

export function clearYokai(container) {
    container.innerHTML = '';
}