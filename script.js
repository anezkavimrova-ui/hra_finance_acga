const vsechnaStanoviste = [
    { 
        n: "Česká národní banka", 
        l: "Na Příkopě 28", 
        t: "Úkol: Spočítejte počet vajec ve 4. sloupci zleva.",
        typ: "cislo",
        reseni: 12 // Doplňte správné číslo
    },
    { 
        n: "Česká pojišťovna (Úhoři)", 
        l: "Spálená", 
        t: "Úkol: Natočte reportáž o historii budovy a o tom, proč jsou tu úhoři. Video nahrajte přes tlačítko níže.",
        typ: "media",
        link: "https://photos.app.goo.gl/vase-album" // Odkaz na váš Google Drive/Photos
    },
    { 
        n: "Komerční banka", 
        l: "Pobočka v centru", 
        t: "Úkol: Zjistěte, co lidé řeší na pobočce. Nechte si dát razítko do bločku.",
        typ: "razitko"
    }
];

function updateUI() {
    const contentDiv = document.getElementById('content');
    const actionArea = document.getElementById('action-area');
    const progressBar = document.getElementById('progressBar');

    if (currentStepIndex >= teamRoute.length) {
        document.getElementById('locationName').innerText = "CÍL";
        document.getElementById('title').innerText = "HOTOVO! 🏆";
        contentDiv.innerHTML = "<p>Skvělá práce! Vraťte se na základnu.</p>";
        if(actionArea) actionArea.style.display = "none";
        return;
    }

    const st = teamRoute[currentStepIndex];
    
    // Update textů
    document.getElementById('displayTeamId').innerText = teamId;
    document.getElementById('currentStep').innerText = currentStepIndex + 1;
    document.getElementById('locationName').innerText = st.l;
    document.getElementById('title').innerText = st.n;
    
    // TADY JE TA ZMĚNA: Žádné emoji, žádné černé pozadí, jen růžová třída
    let cistyText = st.t.replace("Úkol:", "<span class='ukol-ruzove'>Úkol:</span>");
    
    let interakceHtml = "";
    if (st.typ === "cislo") {
        interakceHtml = `<div class="answer-box"><label>Zadej výsledek:</label><input type="number" id="userAnswer"></div>`;
    } else if (st.typ === "media") {
        interakceHtml = `<div class="media-box"><a href="${st.link}" target="_blank" class="btn-upload">NAHRÁT SOUBOR</a></div>`;
    }

    contentDiv.innerHTML = `<div class="task-description">${cistyText}</div>${interakceHtml}`;
    
    let progressPercent = ((currentStepIndex) / teamRoute.length) * 100;
    if(progressBar) progressBar.style.width = progressPercent + "%";
}
function nextStep() {
    const st = teamRoute[currentStepIndex];
    
    // Kontrola číselné odpovědi
    if (st.typ === "cislo") {
        const userVal = document.getElementById('userAnswer').value;
        if (parseInt(userVal) !== st.reseni) {
            alert("❌ Špatný výsledek! Zkuste to znovu.");
            return;
        }
    }

    // Kontrola nahrání (pouze potvrzovací dotaz)
    if (st.typ === "media") {
        if (!confirm("Máte soubor úspěšně nahraný v albu?")) return;
    }

    currentStepIndex++;
    updateUI();
    window.scrollTo(0,0);
};

let currentStepIndex = 0;
let teamRoute = [];

// Získání ID týmu z URL
const params = new URLSearchParams(window.location.search);
const teamId = parseInt(params.get('team')) || 1;

// FUNKCE PRO TOTÁLNÍ PROMÍCHÁNÍ (Fisher-Yates Shuffle se seedem)
function generujChaotickouTrasu(id) {
    let trasa = [...vsechnaStanoviste];
    
    // Použijeme číslo týmu jako "seed" pro míchání
    // Díky tomu bude mít Tým 1 vždy stejnou (ale zamíchanou) trasu, 
    // i když stránku obnoví, ale Tým 2 ji bude mít úplně jinou.
    let seed = id;
    for (let i = trasa.length - 1; i > 0; i--) {
        const j = Math.floor((Math.abs(Math.sin(seed++) * 10000)) % (i + 1));
        [trasa[i], trasa[j]] = [trasa[j], trasa[i]];
    }
    return trasa;
}

function updateUI() {
    const contentDiv = document.getElementById('content');
    const actionArea = document.getElementById('action-area');
    const progressBar = document.getElementById('progressBar');

    if (currentStepIndex >= teamRoute.length) {
        document.getElementById('locationName').innerText = "KONEC MISE";
        document.getElementById('title').innerText = "HOTOVO! 🏆";
        contentDiv.innerHTML = "<p>Skvělá práce, finančníci! Teď se vraťte k instruktorům na vyhodnocení vašich bločků.</p>";
        if(actionArea) actionArea.style.display = "none";
        if(progressBar) progressBar.style.width = "100%";
        return;
    }

    const st = teamRoute[currentStepIndex];
    
    // Update prvků na stránce
    if(document.getElementById('displayTeamId')) document.getElementById('displayTeamId').innerText = teamId;
    if(document.getElementById('currentStep')) document.getElementById('currentStep').innerText = currentStepIndex + 1;
    if(document.getElementById('locationName')) document.getElementById('locationName').innerText = st.l;
    if(document.getElementById('title')) document.getElementById('title').innerText = st.n;
    
    let formattedText = st.t.replace("Úkol:", "<strong>🎯 Úkol:</strong>");
    if(contentDiv) contentDiv.innerHTML = `<p>${formattedText}</p>`;
    
    let progressPercent = ((currentStepIndex) / teamRoute.length) * 100;
    if(progressBar) progressBar.style.width = progressPercent + "%";
}

function nextStep() {
    if (confirm("Máte splněno a zapsáno v bločku?")) {
        currentStepIndex++;
        updateUI();
        window.scrollTo(0,0);
    }
}

// Inicializace hry
teamRoute = generujChaotickouTrasu(teamId);
updateUI();
