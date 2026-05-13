const vsechnaStanoviste = [
    { n: "ČNB", t: "Jděte do návštěvnického centra. Úkol: Spočítejte počet vajec ve 4. sloupci zleva. Dovnitř smí jen reportér a kameraman! Nezapomeňte na razítko do bločku." },
    { n: "Česká minovna", t: "Najděte největší minci ve výloze. Jak se jmenuje a jakou má nominální hodnotu?" },
    { n: "Česká pojišťovna (Spálená)", t: "Najděte úhoře v budově. Natočte reportáž o historii této budovy a o tom, proč jsou tu úhoři." },
    { n: "Komerční banka", t: "Zjistěte, kvůli čemu lidé nejčastěji chodí na pobočku a co nelze vyřešit v aplikaci. Nechte si dát razítko (v bance se nesmí natáčet!)." },
    { n: "Burza drahých kovů", t: "Porovnejte cenovku zlata ve výloze s aktuální cenou zlata na burze (najděte v mobilu). Jaký je v tom rozdíl?" },
    { n: "Směnárny (Karlova ul.)", t: "Statisticky zpracujte 5 směnáren v ulici. Vypočítejte průměr, min, max a odchylku kurzu EUR/CZK. Nakreslete graf do bločku a vyfoťte ho." },
    { n: "Neviditelná daň", t: "Jděte do běžné samoobsluhy. Najděte jeden produkt se sníženou sazbou DPH a jeden se základní. Vypočítejte, kolik korun z každého jde státu." },
    { n: "Pařížská ulice", t: "Najděte nejdražší věc ve výloze. Vypočítejte, kolik let by na ni vydělával učitel s praxí 5 let (tabulkový plat cca 35 000 Kč čistého)." }
];

let currentStepIndex = 0;
let teamRoute = [];

// Načtení parametrů z URL
const params = new URLSearchParams(window.location.search);
const teamId = parseInt(params.get('team')) || 1;

function generujTrasu(id) {
    // Vytvoří kopii pole posunutou o ID týmu
    let shift = (id - 1) % vsechnaStanoviste.length;
    return [...vsechnaStanoviste.slice(shift), ...vsechnaStanoviste.slice(0, shift)];
}

function updateUI() {
    if (currentStepIndex >= teamRoute.length) {
        document.getElementById('content').innerHTML = "<h2>GRATULUJEME!</h2><p>Prošli jste všechna stanoviště. Teď se vraťte na základnu pro vyhodnocení.</p>";
        document.getElementById('action-area').style.display = "none";
        return;
    }

    const st = teamRoute[currentStepIndex];
    document.getElementById('displayTeamId').innerText = teamId;
    document.getElementById('currentStep').innerText = currentStepIndex + 1;
    document.getElementById('title').innerText = st.n;
    document.getElementById('content').innerHTML = `<p>${st.t}</p>`;
}

function nextStep() {
    if (confirm("Máte splněno a zapsáno v bločku?")) {
        currentStepIndex++;
        updateUI();
        window.scrollTo(0,0);
    }
}

// Inicializace
teamRoute = generujTrasu(teamId);
updateUI();
