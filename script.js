/**
 * 1. KONFIGURACE STANOVIŠŤ
 */
const vsechnaStanoviste = [
    { 
        n: "Česká národní banka", 
        l: "Na Příkopě 28", 
        cestaText: "Zadejte do mapy tyto souřadnice a dorazte na místo: 50.0870536N, 14.4286689E",
        t: "Úkol: Spočítejte, kolik vajec je ve čtvrtém sloupci zleva. Na recepci si nechte dát razítko do notýsku.",
        typ: "cislo",
        reseni: 4, 
        heslo: ["cnb", "ceska narodni banka"] 
    },
    { 
        n: "Česká minovna", 
        l: "Havířská 3", 
        cestaText: "Najděte budovu, v jejíž blízkosti se nachází socha muže bez tváře. V její výloze dnes uvidíte víc stříbra než v celém bločku vašich poznámek. Úkol začíná u skla, za kterým se leskne pětikilo, které byste v automatu na kávu neudali.",
        t: "Doufám, že jste u České mincovny!<br><br>Úkol: Najděte ve výloze minci s nejvyšší nominální hodnotou a zadejte její částku v Kč.",
        typ: "cislo",
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
        n: "Komerční banka", 
        l: "Spálená 51 (pobočka v centru)", 
        cestaText: "Zadejte do mapy tyto souřadnice a vyrazte na další místo: 50.0816983N, 14.4192744E",
        t: "Doufám, že stojíte před správnou bankou!<br><br>Úkol: Zjistěte, kvůli čemu nejčastěji lidé přicházejí na pobočku a co nelze vyřešit v mobilní aplikaci. V bance z bezpečnostních důvodů NENATÁČEJTE. Odpověď si zapište do notýsku a nechte si přes ni dát na pobočce razítko. Fotografii této stránky s razítkem a odpovědí nahrajte přes tlačítko níže.",
        typ: "media",
        link: "https://drive.google.com/drive/folders/1HuVArd8cLJr5S5QqOYDjPCnFRFKAnrla?usp=sharing",
        heslo: ["kb", "komercni banka"] 
    },
    { 
        n: "Směnárny (Celetná ulice)", 
        l: "Celetná (u Karolina)", 
        cestaText: "Zjistěte, ve které ulici se nachází Knihkupectví Karolinum. Právě tam totiž míříte!",
        t: "Doufám, že jste na správné ulici!<br><br>Úkol: Proveďte průzkum v 5 směnárnách na této ulici. U každé z nich zjistěte jejich aktuální kurz pro NÁKUP českých korun (We Buy) za 1 EUR a 1 USD. Výsledky statisticky zpracujte do tabulky níže. Pro postup dál musíte poctivě vyplnit všechny hodnoty a vyfotit a nahrát hotovou statistiku z notýsku přes tlačítko níže!",
        typ: "smenarny_media",
        link: "https://drive.google.com/drive/folders/1xSLI55_cf8s9CAT7Hcd8Wl1V-1_04CE1?usp=sharing", 
        heslo: "celetna"
    },
    {
        n: "Pařížská ulice (Sny vs. Realita)",
        l: "Pařížská ulice",
        cestaText: "Míříte do ulice, kde se za výlohami nelesknou obyčejné věci, ale sny milionářů. Tato ulice nese název hlavního města módy a začíná u paty starobylého Josefova. Vaším cílem je projít ji a najít ten nejdražší vystavený kousek zboží s jasnou cenovkou.",
        t: "Vítejte v Pařížské!<br><br> Najděte nejdražší kousek zboží s uvedenou cenou. Do notýsku si zapište název obchodu, o jaké zboží šlo a jeho cenu.<br><br>Úkol 2: Následně v notýsku spočítejte, kolik **celých měsíčních platů** by na něj musel čistého spořit průměrný učitel v Praze.<br><br><strong>Podmínky výpočtu:</strong><br>• Průměrný čistý plat učitele v Praze: <strong>zjistěte a uveďte zdroj</strong><br>• Průměrné měsíční náklady na život v Praze: <strong>odhadněte a nebo zjistěte a uveďte zdroj</strong><br>• Inflaci ani změnu mzdy neuvažujte.<br><br>Celou tuto analýzu vyfoťte a nahrajte na Disk. **Abyste mohli jít dál, zjistěte a zadejte odpověď na otázku níže!**",
        typ: "parizska_kviz",
        link: "https://drive.google.com/drive/folders/1Q5dioE4anGEwjeKcqzwPKPDMsdDpM0Sz?usp=sharing",
        reseni: ["hermes", "hermes praha"]
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
 * 3. LOGIKA MÍCHÁNÍ TRASY
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

    if (currentStepIndex >= teamRoute.length) {
        clearInterval(gameTimerInterval); 
        
        let endTime = new Date();
        let diffMs = endTime - startTime;
        let diffMins = Math.floor(diffMs / 60000);
        let diffSecs = Math.floor((diffMs % 60000) / 1000);

        document.getElementById('locationName').innerText = "KONEC MISE";
        document.getElementById('title').innerText = "HOTOVO! 🏆";
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
    if(document.getElementById('currentStep')) document.getElementById('currentStep').innerText = currentStepIndex + 1;
    
    let interakceHtml = "";

    if (fazaCesty) {
        document.getElementById('locationName').innerText = "Místo je skryto...";
        document.getElementById('title').innerText = "Kde je další cíl?";
        
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
        actionArea.innerHTML = ""; 
        startTimer(180); 

    } else {
        document.getElementById('locationName').innerText = st.l;
        document.getElementById('title').innerText = st.n;
        
        let formattedText = st.t.replace("Úkol 1:", "<span class='ukol-ruzove'>Úkol 1:</span>").replace("Úkol 2:", "<span class='ukol-ruzove'>Úkol 2:</span>");
        
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
            if (st.reseni) { 
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
                    <a href="${st.link}" target="_blank" class="btn-upload">NAHRÁT ANALÝZU NA DISK 📸</a>
                </div>
                <div class="answer-box" style="margin-top: 20px;">
                    <label><strong>Kontrolní otázka pro postup dál:</strong><br>Která světová módní značka otevřela v Pařížské ulici svůj luxusní butik jako úplně první a funguje zde nejdéle?</label>
                    <input type="text" id="quizAnswer" placeholder="Napište název značky...">
                </div>`;
        }

        contentDiv.innerHTML = `<div class="task-description">${formattedText}</div>${interakceHtml}`;
        actionArea.innerHTML = `<button onclick="nextStep()" class="btn-next">MÁME HOTOVO! 🚀</button>`;
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
    
    if (st.typ === "cislo" || (st.typ === "media" && st.reseni)) {
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
        if (odpoved !== "hermes" && odpoved !== "hermes praha") {
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
