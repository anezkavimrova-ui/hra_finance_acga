/**
 * 1. KONFIGURACE STANOVIŠŤ
 */
const vsechnaStanoviste = [
    { 
        n: "Česká národní banka", 
        l: "Na Příkopě 28", 
        cestaText: "Zadejte do mapy tyto souřadnice a dorazte na místo: 50.0870536N, 14.4286689E",
        t: "Úkol: Podívejte se na interaktivní graf ve výloze (viz foto níže). Vaším úkolem je spočítat, kolik symbolů vajec se nachází přesně ve ČTVRTÉM sloupci zleva (období 1935–1939). Pozor, počítejte pouze celá a viditelná vejce v tomto sloupci!<br><br><img src='1000022677.jpg' alt='Graf ČNB' style='width:100%; max-width:400px; border-radius:10px; border:2px solid var(--black); margin-top:10px;'>",
        typ: "cislo",
        link: "",
        reseni: 4, 
        heslo: ["cnb", "ceska narodni banka"] 
    },
    { 
        n: "Česká minovna", 
        l: "Na Příkopě 24 (Pasáž ČNB)", 
        cestaText: "Míříte na ulici, která byla dlouhou dobu tou vůbec nejdražší ulicí v celé Praze. Vaším hlavním orientačním bodem bude prodejna legendárních českých tužek a pastelek Koh-i-Noor. Jakmile ji najdete, vejděte do pasáže přímo naproti ní a hledejte výlohu plnou drahých kovů, zlatých investičních slitků a pamětních mincí.",
        t: "Doufám, že stojíte u výlohy České mincovny!<br><br>Úkol: Pořádně si prohlédněte vystavené kousky. Najděte minci s tou úplně nejvyšší nominální hodnotou (částkou v Kč) a zadejte ji jako výsledek.",
        typ: "cislo",
        link: "",
        reseni: 200,
        heslo: ["mincovna", "ceska mincovna"] 
    },
    { 
        n: "Generali Česká pojišťovna (Úhoři)", 
        l: "Spálená 75/16", 
        cestaText: "Míříte na místo, kde i pojišťováci mají svého maskota, který nepotřebuje oblek, ale vodu. Jmenuje se Pepík.",
        t: "Doufám, že jste ve Spálené ulici u České pojišťovny!<br><br>Úkol: Natočte krátkou reportáž o historii budovy a její funkci. V reportáži se také objeví krátká historie úhořů v budově. Video nahrajte přes tlačítko níže.",
        typ: "media",
        link: "https://drive.google.com/drive/folders/1xSLI55_cf8s9CAT7Hcd8Wl1V-1_04CE1?usp=sharing",
        reseni: 3, 
        heslo: ["pojistovna", "ceska pojistovna"] 
    },
    { 
        n: "Směnárny (Celetná ulice)", 
        l: "Celetná (u Karolina)", 
        cestaText: "Zjistěte, ve které ulici se nachází Knihkupectví Karolinum. Právě tam totiž míříte!",
        t: "Doufám, že jste na správné ulici!<br><br>Úkol: Proveďte průzkum v 5 směnárnách na této ulici. U každé z nich zjistěte jejich aktuální kurz pro NÁKUP českých korun (We Buy) za 1 EUR a 1 USD. Výsledky statisticky zpracujte do tabulky níže. Pro postup dál musíte poctivě vyplnit všechny hodnoty a vyfotit a nahrát hotovou statistiku ze svých materiálů přes tlačítko níže!",
        typ: "smenarny_media",
        link: "https://drive.google.com/drive/folders/1xSLI55_cf8s9CAT7Hcd8Wl1V-1_04CE1?usp=sharing", 
        reseni: 0,
        heslo: "celetna"
    },
    {
        n: "Pařížská ulice (Vogue výzva)",
        l: "Pařížská ulice",
        cestaText: "Míříte do ulice, která nese název hlavního města módy, začíná u paty starobylého Josefova a byla dlouho považována za nejdražší adresu v Česku.",
        t: "Vítejte v Pařížské!<br><br>Výlohy zdejších obchodů navrhují ti nejlepší designéři na světě. Využijte toho!<br><br>Úkol: Projděte ulici, vyberte si výlohu nebo vstup do butiku, který na vás působí nejvíc luxusně, a udělejte před ním společnou týmovou fotku. Podmínka: Žádný nudný školní skupinkový snímek – zatvorte se jako modelové na obálku módního časopisu! Fotku nahrajte na Disk přes tlačítko níže.<br><br><strong>Kontrolní otázka pro postup dál:</strong> Která světová módní značka otevřela v Pařížské ulici svůj luxusní butik jako úplně první (už v roce 1997) a funguje zde nejdéle?",
        typ: "parizska_kviz",
        link: "https://drive.google.com/drive/folders/1Q5dioE4anGEwjeKcqzwPKPDMsdDpM0Sz?usp=sharing",
        reseni: ["hermes", "hermes praha"],
        heslo: ["parizska", "parizska ulice"]
    }
];

/**
 * 2. GLOBÁLNÍ STATE HRY
 */
let currentStepIndex = 0;
let teamRoute = [];
let fazaCesty = true; 
let timerInterval = null;     
let gameTimerInterval = null; 
let startTime = null; 

const params = new URLSearchParams(window.location.search);
const teamId = parseInt(params.get('team')) || 1;

/**
 * 3. LOGIKA GEOGRAFICKÉHO MÍCHÁNÍ TRASY (CHYTRÉ SOUSEDSTVÍ)
 */
function generujChaotickouTrasu(id) {
    const blokBanky = [vsechnaStanoviste[0], vsechnaStanoviste[1]]; 
    const blokCentrum = [vsechnaStanoviste[3], vsechnaStanoviste[4]]; 
    const mostPojistovna = [vsechnaStanoviste[2]]; 

    let seed = id;
    function random() {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    }

    if (random() > 0.5) blokBanky.reverse();
    if (random() > 0.5) blokCentrum.reverse();

    const struktura = random() > 0.5 ? [blokBanky, blokCentrum] : [blokCentrum, blokBanky];

    const poziceMostu = Math.floor(random() * 3); 
    struktura.splice(poziceMostu, 0, mostPojistovna);

    return struktura.flat();
}

/**
 * 4. HORNÍ ČASOVAČ
 */
function spustCelkovyCasovac() {
    startTime = new Date();
    const timerDisplay = document.getElementById('gameTimer');

    gameTimerInterval = setInterval(() => {
        let nyni = new Date();
        let diffMs = nyni - startTime;
        let celkemSekund = Math.floor(diffMs / 1000);
        
        let hodiny = Math.floor(celkemSekund / 3600);
        let minuty = Math.floor((celkemSekund % 3600) / 60);
        let sekundy = celkemSekund % 60;

        let textCasu = "";
        if (hodiny > 0) {
            textCasu += hodiny + ":";
            textCasu += (minuty < 10 ? "0" : "") + minuty + ":";
        } else {
            textCasu += (minuty < 10 ? "0" : "") + minuty + ":";
        }
        textCasu += (sekundy < 10 ? "0" : "") + sekundy;

        if (timerDisplay) timerDisplay.innerText = textCasu;
    }, 1000);
}

/**
 * 5. ČASOVAČ NA STANOVIŠTI
 */
function startTimer(durationSeconds) {
    clearInterval(timerInterval);
    let timeLeft = durationSeconds;
    const btnArrived = document.getElementById('btn-arrived');
    const timerDisplay = document.getElementById('timer-display');
    
    if(btnArrived) btnArrived.style.display = "none";
    if(timerDisplay) timerDisplay.style.display = "block";

    timerInterval = setInterval(() => {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        if (seconds < 10) seconds = "0" + seconds;
        
        if(timerDisplay) timerDisplay.innerText = `Tlačítko příchodu se odemkne za: ${minutes}:${seconds}`;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            if(timerDisplay) timerDisplay.style.display = "none";
            if(btnArrived) btnArrived.style.display = "block";
        }
        timeLeft--;
    }, 1000);
}

function normalizujText(text) {
    if (!text) return "";
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

function zkusOdemknoutHeslem() {
    const st = teamRoute[currentStepIndex];
    const vlozeneHeslo = normalizujText(document.getElementById('routePassword').value);
    
    let spravne = false;
    if (Array.isArray(st.heslo)) {
        spravne = st.heslo.some(h => normalizujText(h) === vlozeneHeslo);
    } else {
        spravne = normalizujText(st.heslo) === vlozeneHeslo;
    }
    
    if (spravne) {
        clearInterval(timerInterval); 
        fazaCesty = false; 
        updateUI();
    } else {
        alert("❌ Nesprávné heslo lokality. Zkuste to znovu nebo počkejte na vypršení časovače.");
    }
}

/**
 * 6. VYKRESLOVÁNÍ WEBU (UI)
 */
function updateUI() {
    const contentDiv = document.getElementById('content');
    const actionArea = document.getElementById('action-area');
    const progressBar = document.getElementById('progressBar');

    if (!contentDiv) return;

    if (currentStepIndex >= teamRoute.length) {
        clearInterval(gameTimerInterval); 
        
        let endTime = new Date();
        let diffMs = endTime - startTime;
        let diffMins = Math.floor(diffMs / 60000);
        let diffSecs = Math.floor((diffMs % 60000) / 1000);

        const locName = document.getElementById('locationName');
        const titleEl = document.getElementById('title');
        if (locName) locName.innerText = "KONEC MISE";
        if (titleEl) titleEl.innerText = "HOTOVO! 🏆";

        contentDiv.innerHTML = `
            <div style="text-align:center; padding: 10px;">
                <p style="font-size:1.3rem; margin-bottom:20px;">Mise úspěšně dokončena!</p>
                <div style="background:var(--black); color:var(--turquoise); padding:15px; border-radius:15px; font-weight:bold; margin-bottom:20px;">
                    CELKOVÝ ČAS: ${diffMins} min a ${diffSecs} s
                </div>
                <p>Ukažte tento displej instruktorovi a odevzdejte poznámkový bloček.</p>
            </div>`;
        if(actionArea) actionArea.style.display = "none";
        if(progressBar) progressBar.style.width = "100%";
        return;
    }

    const st = teamRoute[currentStepIndex];
    if(document.getElementById('displayTeamId')) document.getElementById('displayTeamId').innerText = teamId;
    if(currentStepIndexElement = document.getElementById('currentStep')) currentStepIndexElement.innerText = currentStepIndex + 1;
    
    let interakceHtml = "";

    if (fazaCesty) {
        const locName = document.getElementById('locationName');
        const titleEl = document.getElementById('title');
        if (locName) locName.innerText = "Místo je skryto...";
        if (titleEl) titleEl.innerText = "Kde je další cíl?";
        
        interakceHtml = `
            <div class="task-description">
                <span class="ukol-ruzove">Šifra / Indicie:</span>
                <p>${st.cestaText}</p>
            </div>
            <div class="answer-box" style="background: #fff0f6; border-color: var(--pink);">
                <label style="color: var(--black);">Víte přesně kam jít? Zadejte heslo/místo:</label>
                <input type="text" id="routePassword" placeholder="Napište cíl..." style="font-size: 1.2rem; text-transform: none;">
                <button onclick="zkusOdemknoutHeslem()" style="background: var(--pink); color: white; border: 2px solid var(--black); padding: 8px 15px; border-radius: 20px; font-weight: bold; margin-top: 10px; cursor: pointer; width: 100%; font-family: sans-serif; text-transform: uppercase; font-size: 0.8rem;">Odemknout hned 🔓</button>
            </div>
            <div id="timer-display" class="timer-style">Načítání časovače...</div>
            <button id="btn-arrived" onclick="jsmeNaMiste()" class="btn-arrived-style" style="display:none;">UŽ JSME NA MÍSTĚ! 📍</button>
        `;
        contentDiv.innerHTML = interakceHtml;
        if(actionArea) actionArea.innerHTML = ""; 
        startTimer(180); 

    } else {
        const locName = document.getElementById('locationName');
        const titleEl = document.getElementById('title');
        if (locName) locName.innerText = st.l;
        if (titleEl) titleEl.innerText = st.n;
        
        let formattedText = st.t.replace("Úkol 1:", "<span class='ukol-ruzove'>Úkol 1:</span>").replace("Úkol 2:", "<span class='ukol-ruzove'>Úkol 2:</span>");
        if (!st.t.includes("Úkol 1:")) {
            formattedText = formattedText.replace("Úkol:", "<span class='ukol-ruzove'>Úkol:</span>");
        }
        
        if (st.typ === "cislo") {
            interakceHtml = `
                <div class="answer-box">
                    <label>Zadejte číselný výsledek:</label>
                    <input type="number" id="userAnswer" placeholder="0">
                </div>`;
        } else if (st.typ === "media") {
            interakceHtml = `
                <div class="media-box">
                    <p>Pořiďte záznam/fotografii a nahrajte soubor sem:</p>
                    <a href="${st.link}" target="_blank" class="btn-upload">NAHRÁT SOUBOR 📸</a>
                </div>`;
            if (st.reseni && typeof st.reseni === "number" && st.reseni > 0) { 
                interakceHtml += `
                    <div class="answer-box" style="margin-top:15px;">
                        <label>Otázka: Kolikátý maskot (úhoř) to je?</label>
                        <input type="number" id="userAnswer" placeholder="0">
                    </div>`;
            }
        } else if (st.typ === "smenarny_media") {
            interakceHtml = `
                <div class="exchange-table-box">
                    <table class="exchange-table">
                        <tr><th>Statistika</th><th>Euro (EUR)</th><th>Dolar (USD)</th></tr>
                        <tr><td><strong>MAXIMUM</strong></td><td><input type="number" step="0.01" id="eurMax" placeholder="0.00"></td><td><input type="number" step="0.01" id="usdMax" placeholder="0.00"></td></tr>
                        <tr><td><strong>MINIMUM</strong></td><td><input type="number" step="0.01" id="eurMin" placeholder="0.00"></td><td><input type="number" step="0.01" id="usdMin" placeholder="0.00"></td></tr>
                        <tr><td><strong>PRŮMĚR</strong></td><td><input type="number" step="0.01" id="eurAvg" placeholder="0.00"></td><td><input type="number" step="0.01" id="usdAvg" placeholder="0.00"></td></tr>
                    </table>
                </div>
                <div class="media-box" style="margin-top: 20px;">
                    <p>Vyfoťte statistiku zapsanou v notýsku a nahrajte ji sem:</p>
                    <a href="${st.link}" target="_blank" class="btn-upload">NAHRÁT STATISTIKU 📸</a>
                </div>`;
        } else if (st.typ === "parizska_kviz") {
            interakceHtml = `
                <div class="media-box">
                    <p>1. Nahrajte fotografii vypracované analýzy z notýsku:</p>
                    <a href="${st.link}" target="_blank" class="btn-upload">NAHRÁT SOUBOR 📸</a>
                </div>
                <div class="answer-box" style="margin-top: 20px;">
                    <label><strong>Kontrolní otázka pro postup dál:</strong><br>Která světová módní značka otevřela v Pařížské ulici svůj luxusní butik jako úplně první (už v roce 1997) a funguje zde nejdéle?</label>
                    <input type="text" id="quizAnswer" placeholder="Napište název značky...">
                </div>`;
        }

        contentDiv.innerHTML = `<div class="task-description">${formattedText}</div>${interakceHtml}`;
        if(actionArea) actionArea.innerHTML = `<button onclick="nextStep()" class="btn-next">MÁME HOTOVO! 🚀</button>`;
    }
    
    let progressPercent = (currentStepIndex / teamRoute.length) * 100;
    if(progressBar) progressBar.style.width = progressPercent + "%";
}

function jsmeNaMiste() {
    fazaCesty = false;
    updateUI();
}

/**
 * 7. KONTROLA ÚSPĚŠNOSTI A POSTUP
 */
function nextStep() {
    const st = teamRoute[currentStepIndex];
    
    if (st.typ === "cislo" || (st.typ === "media" && st.reseni && typeof st.reseni === "number" && st.reseni > 0)) {
        const userVal = document.getElementById('userAnswer').value;
        if (parseInt(userVal) !== st.reseni) {
            alert("❌ Špatný výsledek! Zkuste to znovu.");
            return;
        }
    }

    if (st.typ === "media") {
        if (!confirm("Máte soubor úspěšně nahraný v albu?")) return;
    }

    if (st.typ === "smenarny_media") {
        const fields = ['eurMax', 'usdMax', 'eurMin', 'usdMin', 'eurAvg', 'usdAvg'];
        for (let id of fields) {
            const val = parseFloat(document.getElementById(id).value);
            if (isNaN(val) || val <= 0) {
                alert("❌ Musíte vyplnit všechna políčka tabulky platnými kurzy!");
                return;
            }
        }
        if (!confirm("Nahráli jste fotografii statistiky z notýsku do sdíleného alba?")) return;
    }

    if (st.typ === "parizska_kviz") {
        const odpoved = normalizujText(document.getElementById('quizAnswer').value);
        const jeSpravne = Array.isArray(st.reseni) && st.reseni.some(r => normalizujText(r) === odpoved);
        
        if (!jeSpravne) {
            alert("❌ Nesprávná odpověď na kontrolní otázku! Zkuste to znovu nebo zařaďte lepší googlení.");
            return;
        }
        if (!confirm("Ověření úspěšné! Máte fotografii analýzy z notýsku skutečně nahranou na Disku?")) return;
    }

    if (confirm("Máte vše splněno a zapsáno v bločku? Pokračovat dál?")) {
        currentStepIndex++;
        fazaCesty = true; 
        updateUI();
        window.scrollTo(0,0);
    }
}

/**
 * 8. SPUŠTĚNÍ HRY
 */
spustCelkovyCasovac(); 
teamRoute = generujChaotickouTrasu(teamId);
updateUI();
