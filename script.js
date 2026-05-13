const vsechnaStanoviste = [
    { n: "Česká národní banka", l: "Na Příkopě 28", t: "Jděte do návštěvnického centra. Úkol: Spočítejte počet vajec ve 4. sloupci zleva. Razítko do bločku!" },
    { n: "Česká minovna", l: "Havířská 3", t: "Najděte největší minci ve výloze. Zjistěte její název a hodnotu." },
    { n: "Česká pojišťovna", l: "Spálená 75/16", t: "Najděte úhoře. Natočte reportáž o historii budovy a úhořích." },
    { n: "Komerční banka", l: "Pobočka centrum", t: "Zjistěte, co lidé řeší na pobočce a co nejde v aplikaci. Razítko do bločku!" },
    { n: "Burza drahých kovů", l: "Centrum", t: "Porovnejte cenu zlata ve výloze s cenou na světové burze v mobilu." },
    { n: "Směnárny - Statistika", l: "Karlova ulice", t: "Zpracujte 5 směnáren. Vypočítejte průměr, min, max a nakreslete graf do bločku." },
    { n: "Neviditelná daň", l: "Potraviny/Večerka", t: "Najděte produkt s 12% a 21% DPH (např. jídlo vs alkohol). Vypočítejte daň pro stát." },
    { n: "Pařížská ulice", l: "U luxusních butiků", t: "Najděte nejdražší kousek. Vypočítejte, kolik let by na něj vydělával učitel (35k čistého)." }
];

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
