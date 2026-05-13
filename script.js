/**
 * KONFIGURACE STANOVIŠŤ
 * n = název, l = lokalita, t = text úkolu, typ = typ interakce, reseni/link = data
 */
const vsechnaStanoviste = [
    { 
        n: "Česká národní banka", 
        l: "Na Příkopě 28", 
        t: "Úkol: Spočítejte počet vajec ve 4. sloupci zleva. Dovnitř smí jen reportér a kameraman!",
        typ: "cislo",
        reseni: 12 
    },
    { 
        n: "Česká pojišťovna (Úhoři)", 
        l: "Spálená", 
        t: "Úkol: Natočte reportáž o historii budovy a o tom, proč jsou tu úhoři. Video nahrajte přes tlačítko.",
        typ: "media",
        link: "https://photos.app.goo.gl/vase-album" 
    },
    { 
        n: "Komerční banka", 
        l: "Pobočka v centru", 
        t: "Úkol: Zjistěte, co lidé řeší na pobočce. Nechte si dát razítko do bločku.",
        typ: "razitko"
    },
    { 
        n: "Česká minovna", 
        l: "Havířská 3", 
        t: "Úkol: Najděte největší minci ve výloze a napište její nominální hodnotu.",
        typ: "cislo",
        reseni: 100000000 
    },
    { 
        n: "Neviditelná daň (DPH)", 
        l: "Samoobsluha/Večerka", 
        t: "Úkol: Najděte produkt se základní sazbou DPH. Vypočítejte, kolik korun z ceny jde státu.",
        typ: "cislo",
        reseni: 21 // Příklad
    }
    // Sem můžeš přidávat další stanoviště podle stejného vzoru
];

/**
 * GLOBÁLNÍ PROMĚNNÉ
 */
let currentStepIndex = 0;
let teamRoute = [];

// Získání ID týmu z URL (např. ?team=1)
const params = new URLSearchParams(window.location.search);
const teamId = parseInt(params.get('team')) || 1;

/**
 * FUNKCE PRO GENEROVÁNÍ TRASY
 * Každý tým dostane unikátní pořadí, které se nemění při obnovení stránky
 */
function generujChaotickouTrasu(id) {
    let trasa = [...vsechnaStanoviste];
    let seed = id;
    for (let i = trasa.length - 1; i > 0; i--) {
        const j = Math.floor((Math.abs(Math.sin(seed++) * 10000)) % (i + 1));
        [trasa[i], trasa[j]] = [trasa[j], trasa[i]];
    }
    return trasa;
}

/**
 * FUNKCE PRO AKTUALIZACI ROZHRANÍ
 */
function updateUI() {
    const contentDiv = document.getElementById('content');
    const actionArea = document.getElementById('action-area');
    const progressBar = document.getElementById('progressBar');

    // Kontrola konce hry
    if (currentStepIndex >= teamRoute.length) {
        document.getElementById('locationName').innerText = "CÍL MISE";
        document.getElementById('title').innerText = "HOTOVO! 🏆";
        contentDiv.innerHTML = `
            <div style="text-align:center; padding: 20px;">
                <p>Gratulujeme! Úspěšně jste prošli všechna stanoviště.</p>
                <p>Teď se vraťte k instruktorům na základnu pro vyhodnocení.</p>
            </div>`;
        if(actionArea) actionArea.style.display = "none";
        if(progressBar) progressBar.style.width = "100%";
        return;
    }

    const st = teamRoute[currentStepIndex];
    
    // Update základních textů
    if(document.getElementById('displayTeamId')) document.getElementById('displayTeamId').innerText = teamId;
    if(document.getElementById('currentStep')) document.getElementById('currentStep').innerText = currentStepIndex + 1;
    if(document.getElementById('locationName')) document.getElementById('locationName').innerText = st.l;
    if(document.getElementById('title')) document.getElementById('title').innerText = st.n;
    
    // FORMÁTOVÁNÍ TEXTU: Úkol: bude jen růžový span, žádné černé pozadí nebo obrázky
    let formattedText = st.t.replace("Úkol:", "<span class='ukol-ruzove'>Úkol:</span>");
    
    // Generování interaktivních prvků podle typu úkolu
    let interakceHtml = "";
    if (st.typ === "cislo") {
        interakceHtml = `
            <div class="answer-box">
                <label>Zadejte číselný výsledek:</label>
                <input type="number" id="userAnswer" placeholder="0">
            </div>`;
    } else if (st.typ === "media") {
        interakceHtml = `
            <div class="media-box">
                <p>Natočte video/foto a nahrajte jej zde:</p>
                <a href="${st.link}" target="_blank" class="btn-upload">NAHRÁT SOUBOR 📸</a>
            </div>`;
    }

    contentDiv.innerHTML = `<div class="task-description">${formattedText}</div>${interakceHtml}`;
    
    // Update progress baru (v procentech)
    let progressPercent = (currentStepIndex / teamRoute.length) * 100;
    if(progressBar) progressBar.style.width = progressPercent + "%";
}

/**
 * FUNKCE PRO TLAČÍTKO "DALŠÍ"
 */
function nextStep() {
    const st = teamRoute[currentStepIndex];
    
    // 1. Kontrola číselné odpovědi (pokud je vyžadována)
    if (st.typ === "cislo") {
        const userVal = document.getElementById('userAnswer').value;
        if (parseInt(userVal) !== st.reseni) {
            alert("❌ Špatný výsledek! Zkuste to znovu nebo se lépe podívejte.");
            return; // Nepustí hráče dál
        }
    }

    // 2. Kontrola nahrání médií
    if (st.typ === "media") {
        if (!confirm("Máte soubor úspěšně nahraný v albu?")) return;
    }

    // 3. Finální potvrzení (pro všechny typy včetně razítka)
    if (confirm("Máte splněno a zapsáno v bločku? Pokračovat na další místo?")) {
        currentStepIndex++;
        updateUI();
        window.scrollTo(0,0);
    }
}

/**
 * SPUŠTĚNÍ HRY
 */
teamRoute = generujChaotickouTrasu(teamId);
updateUI();
