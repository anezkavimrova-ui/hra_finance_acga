const vsechnaStanoviste = [
    { n: "Česká národní banka", l: "Na Příkopě 28", t: "Jděte do návštěvnického centra. <strong>Úkol:</strong> Spočítejte počet vajec ve 4. sloupci zleva. Pozor: Do banky mohou maximálně dva lidé (reportér a kameraman). Nezapomeňte na razítko do bločku!" },
    { n: "Česká minovna", l: "Havířská 3", t: "Najděte největší minci ve výloze. Zjistěte její název a nominální hodnotu." },
    { n: "Česká pojišťovna", l: "Spálená 75/16", t: "Najděte legendárního úhoře. <strong>Úkol:</strong> Natočte reportáž o historii budovy, její funkci a o tom, proč jsou zde právě úhoři." },
    { n: "Komerční banka", l: "Pobočka v centru", t: "Zjistěte, kvůli čemu nejčastěji lidé přicházejí na pobočku a co nelze vyřešit v aplikaci. <strong>Pozor:</strong> V bance se nesmí natáčet! Nechte si dát razítko." },
    { n: "Burza drahých kovů", l: "Centrum", t: "Porovnejte cenovku ve výloze s aktuální cenou zlata na burze (najděte online). Jaký je rozdíl?" },
    { n: "Směnárny - Statistika", l: "Karlova ulice", t: "Zpracujte 5 směnáren v ulici. Vypočítejte průměr, minimum, maximum a odchylku kurzu. Nakreslete graf do bločku a vyfoťte ho." },
    { n: "Neviditelná daň", l: "Libovolná večerka", t: "Najděte jeden produkt se sníženou sazbou DPH a jeden se základní (např. chleba vs. alkohol). <strong>Úkol:</strong> Vypočítejte, kolik korun z ceny jde státu." },
    { n: "Pařížská - Luxus", l: "Pařížská ulice", t: "Najděte nejdražší kousek ve výloze. Vypočítejte, kolik let by na něj musel vydělávat učitel s praxí 5 let (uvažujte tabulkovou mzdu bez bonusů)." }
];

let currentStepIndex = 0;
let teamRoute = [];

const params = new URLSearchParams(window.location.search);
const teamId = parseInt(params.get('team')) || 1;

function generujTrasu(id) {
    let shift = (id - 1) % vsechnaStanoviste.length;
    return [...vsechnaStanoviste.slice(shift), ...vsechnaStanoviste.slice(0, shift)];
}

function updateUI() {
    const contentDiv = document.getElementById('content');
    const actionArea = document.getElementById('action-area');
    const progressBar = document.getElementById('progressBar');

    if (currentStepIndex >= teamRoute.length) {
        document.getElementById('locationName').innerText = "CÍL HRA";
        document.getElementById('title').innerText = "Všechna stanoviště hotova!";
        contentDiv.innerHTML = "<p>Skvělá práce! Nyní se vraťte na základnu pro konečné sčítání bodů. Doufáme, že jste se ve světě financí neztratili!</p>";
        actionArea.style.display = "none";
        progressBar.style.width = "100%";
        return;
    }

    const st = teamRoute[currentStepIndex];
    document.getElementById('displayTeamId').innerText = teamId;
    document.getElementById('currentStep').innerText = currentStepIndex + 1;
    document.getElementById('locationName').innerText = st.l;
    document.getElementById('title').innerText = st.n;
    contentDiv.innerHTML = `<p>${st.t}</p>`;
    
    let progressPercent = ((currentStepIndex + 1) / teamRoute.length) * 100;
    progressBar.style.width = progressPercent + "%";
}

function nextStep() {
    if (confirm("Máte úkol splněný a výsledek zapsaný v bločku?")) {
        currentStepIndex++;
        updateUI();
        window.scrollTo(0,0);
    }
}

teamRoute = generujTrasu(teamId);
updateUI();
