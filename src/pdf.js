export function createHtmlAndPdf(yokais, foundYokai, optionsGame) {
    // optionsGame = { lang: 'en' | 'fr' | 'jp', time: '08:45', mode: 'All' }
    console.log(optionsGame)
    const container = document.createElement("div");

    /* Language */
    const texts = {
        en: {
            congrats: "Congratulations!",
            subtitle: `You found all Yo-kai in the ${optionsGame.mode} category!`,
            timeLabel: "Time"
        },
        fr: {
            congrats: "Félicitations !",
            subtitle: `Tu as trouvé tous les Yo-kai pour la catégorie ${optionsGame.mode} !`,
            timeLabel: "Temps"
        },
        jp: {
            congrats: "おめでとうございます！",
            subtitle: `${optionsGame.mode} カテゴリの全ての妖怪を見つけました！`,
            timeLabel: "時間"
        }
    };

    const t = texts[optionsGame.lang] || texts.en;

    container.innerHTML = `
        <style>
        :root {
            --bg-color: #4F9ACC;
            --text-color: #ffffff;
            --accent-color: #f359a1;
            --card-bg: #FFD700;
        }

        .pdf-container {
            background-color: var(--card-bg);
            color: #000;
            text-align: center;
            padding: 40px;
            border-radius: 20px;
            width: 90%;
            max-width: 600px;
            box-shadow: 0 0 30px rgba(0,0,0,0.3);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-height: 400px;
            margin: auto;
        }

        .title { font-size: 3rem; font-weight: bold; margin-bottom: 20px; text-shadow: 2px 2px #fff; }
        .subtitle { font-size: 1.2rem; margin-bottom: 30px; }
        .time-display { font-size: 2rem; font-weight: bold; margin-bottom: 30px; color: var(--accent-color); text-shadow: 1px 1px #fff; }
        .yokai-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(50px, 1fr)); gap: 12px; justify-items: center; margin-top: 20px; }
        .yokai-badge { width: 60px; height: 60px; border-radius: 50%; background-color: var(--accent-color); display: flex; justify-content: center; align-items: center; font-size: 0.8rem; color: #fff; font-weight: bold; }
        .yokai-badge img { width: 70%; height: 70%; object-fit: cover; border-radius: 50%; }
        .credits { margin-top: 30px; font-size: 0.9rem; color: #333; }
        </style>

        <div class="pdf-container" id="pdf-content">
            <div>
                <h1 class="title">${t.congrats}</h1>
                <p class="subtitle">${t.subtitle}</p>
                <div class="time-display">${t.timeLabel} : <span id="game-time">${optionsGame.time}</span></div>
                <div class="yokai-list" id="yokai-list"></div>
            </div>
            <p class="credits">2026 Yougo-rgb Hugo Pozzi & StroyII Axel Truta</p>
        </div>
    `;

    document.body.appendChild(container);

    /* Take the first two, middle and last two yokai */
    const selectedYokais = [];

    if (foundYokai.length > 0) {
        const y = yokais.find(y => y.id === foundYokai[0]);
        if (y) selectedYokais.push(y);
    }
    if (foundYokai.length > 1) {
        const y = yokais.find(y => y.id === foundYokai[1]);
        if (y) selectedYokais.push(y);
    }
    if (foundYokai.length > 2) {
        const middleId = foundYokai[Math.floor(foundYokai.length / 2)];
        const y = yokais.find(y => y.id === middleId);
        if (y) selectedYokais.push(y);
    }
    if (foundYokai.length > 3) {
        const y = yokais.find(y => y.id === foundYokai[foundYokai.length - 2]);
        if (y) selectedYokais.push(y);
    }
    if (foundYokai.length > 4) {
        const y = yokais.find(y => y.id === foundYokai[foundYokai.length - 1]);
        if (y) selectedYokais.push(y);
    }

    const yokaiList = container.querySelector("#yokai-list");

    selectedYokais.forEach(yokai => {
        const badge = document.createElement("div");
        badge.classList.add("yokai-badge");
        const img = document.createElement("img");
        img.src = yokai.image ? yokai.image : "./assets/ui/whisper.png";
        img.alt = yokai.names[optionsGame.lang]?.display || yokai.names["en"].display;
        // TODO: Put an placeholder image if the yokai image is not found
        badge.appendChild(img);
        yokaiList.appendChild(badge);
    });

    /* Create PDF */
    const element = container.querySelector("#pdf-content");
    const pdfOptions = {
        filename: 'yokai-game-results.pdf',
        margin: 0.5,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };

    html2pdf().set(pdfOptions).from(element).save();
    container.style.display = "none";
}