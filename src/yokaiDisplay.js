export function displayYokai(container, yokais, lang) {
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
            img.src = "../assets/ui/interogation.png";
            // img.alt = yokai.names[lang].display;
            // img.title = yokai.names[lang].display;
            img.style.width = "50px";
            img.style.height = "50px";
            img.style.borderRadius = "50%";

            el.appendChild(img);
            group.appendChild(el);
        });

        container.appendChild(group);
    }
}

export function clearYokai(container) {
    container.innerHTML = '';
}