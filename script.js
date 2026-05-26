/**
 * 1. KONFIGURACE STANOVIŠŤ
 */
const vsechnaStanoviste = [
    { 
        n: "Česká národní banka", 
        l: "Na Příkopě 28", 
        cestaText: "Zadejte do mapy tyto souřadnice a dorazte na místo: 50.0870536N, 14.4286689E",
        t: "Úkol: Spočítejte, kolik vajec je ve čtvrtém sloupci zleva. Na recepci si nechte dát největší možné razítko do kartičky.",
        typ: "cislo",
        reseni: 12 // TODO: Sem pak napiš správné číslo
    },
    { 
        n: "Česká minovna", 
        l: "Havířská 3", 
        cestaText: "Najděte budovu, v jejíž blízkosti se nachází socha muže bez tváře. V její výloze dnes uvidíte víc stříbra než v celém bločku vašich poznámek. Úkol začíná u skla, za kterým se leskne pětikilo, které byste v automatu na kávu neudali.",
        t: "Doufám, že jste u České mincovny!<br><br>Úkol: Najděte ve výloze minci s nejvyšší nominální hodnotou a zadejte její částku v Kč.",
        typ: "cislo",
        reseni: 200
    },
    { 
        n: "Generali Česká pojišťovna (Úhoři)", 
        l: "Spálená 75/16", 
        cestaText: "Míříte na místo, kde i pojišťováci mají svého maskota, který nepotřebuje oblek, ale vodu. Jmenuje se Pepík.",
        t: "Doufám, že jste ve Spálené ulici u České pojišťovny!<br><br>Úkol: Natočte krátkou reportáž o historii budovy a její funkci. V reportáži se také objeví krátká historie úhořů v budově. Video nahrajte přes tlačítko níže.",
        typ: "media",
        link: "https://photos.app.goo.gl/vase-album",
        reseni: 1 // TODO: Zjistit, kolikátý úhoř to je
    },
    { 
        n: "Komerční banka", 
        l: "Spálená 51 (pobočka v centru)", 
        cestaText: "Zadejte do mapy tyto souřadnice a vyrazte na další místo: 50.0816983N, 14.4192744E",
        t: "Doufám, že stojíte před správnou bankou!<br><br>Úkol: Zjistěte, kvůli čemu nejčastěji lidé přicházejí na pobočku a co nelze vyřešit v mobilní aplikaci. V bance z bezpečnostních důvodů NENATÁČEJTE. Odpověď si zapište do notýsku a nechte si přes ni dát na pobočce razítko. Fotografii této stránky s razítkem a odpovědí nahrajte přes tlačítko níže.",
        typ: "media",
        link: "https://photos.app.goo.gl/vase-album"
    },
    { 
        n: "Směnárny (Celetná ulice)", 
        l: "Celetná (u Karolina)", 
        cestaText: "Zjistěte, ve které ulici se nachází Knihkupectví Karolinum. Právě tam totiž míříte!",
        t: "Doufám, že jste na správné ulici!<br><br>Úkol: Proveďte průzkum v 5 směnárnách na této ulici. U každé z nich zjistěte jejich aktuální kurz pro NÁKUP českých korun (We Buy) za 1 EUR a 1 USD. Výsledky statisticky zpracujte do tabulky níže. Pro postup dál musíte poctivě vyplnit všechny hodnoty!",
        typ: "smenarny"
    }
];

/**
 * 2. GLOBÁLNÍ STATE HRY
 */
let currentStepIndex = 0;
let teamRoute = [];
let fazaCesty = true; 
let timerInterval = null;
let startTime = null; // Pro celkové stopování hry

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
 * 4. ČASOVAČ NA STANOVIŠTI (3 MINUTY)
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
        
        if(timerDisplay) timerDisplay.innerText = `Tlačítko se odemkne za: ${minutes}:${seconds}`;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            if(timerDisplay) timerDisplay.style.display = "none";
            if(btnArrived) btnArrived.style.display = "block";
        }
        timeLeft--;
    }, 1000);
}

/**
 * 5. VYKRESLOVÁNÍ WEBU (UI)
 */
function updateUI() {
    const contentDiv = document.getElementById('content');
    const actionArea = document.getElementById('action-area');
    const progressBar = document.getElementById('progressBar');

    // KONEC HRY -> Výpočet celkového času
    if (currentStepIndex >= teamRoute.length) {
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
                    VÁŠ ČAS: ${diffMins} min a ${diffSecs} s
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
        // FÁZE 1: CESTA (Skryté info)
        document.getElementById('locationName').innerText = "Místo je skryto...";
        document.getElementById('title').innerText = "Kde je další cíl?";
        
        interakceHtml = `
            <div class="task-description">
                <span class="ukol-ruzove">Šifra / Indicie:</span>
                <p>${st.cestaText}</p>
            </div>
            <div id="timer-display" class="timer-style">Načítání časovače...</div>
            <button id="btn-arrived" onclick="jsmeNaMiste()" class="btn-arrived-style" style="display:none;">UŽ JSME NA MÍSTĚ! 📍</button>
        `;
        contentDiv.innerHTML = interakceHtml;
        actionArea.innerHTML = ""; 
        
        // SPUŠTĚNÍ ODPOČTU: 180 sekund = 3 minuty. (Pro testy můžeš změnit na 5)
        startTimer(180);

    } else {
        // FÁZE 2: ÚKOL (Odemčeno)
        document.getElementById('locationName').innerText = st.l;
        document.getElementById('title').innerText = st.n;
        
        let formattedText = st.t.replace("Úkol:", "<span class='ukol-ruzove'>Úkol:</span>");
        
        if (st.typ === "cislo") {
            interakceHtml = `
                <div class="answer-box">
                    <label>Zadej číselný výsledek:</label>
                    <input type="number" id="userAnswer" placeholder="0">
                </div>`;
        } else if (st.typ === "media") {
            interakceHtml = `
                <div class="media-box">
                    <p>Pořiďte záznam a nahrajte soubor sem:</p>
                    <a href="${st.link}" target="_blank" class="btn-upload">NAHRÁT SOUBOR 📸</a>
                </div>`;
            if (st.reseni) { // Pokud má média úkol ještě dodatečnou otázku (Pepík úhoř)
                interakceHtml += `
                    <div class="answer-box" style="margin-top:15px;">
                        <label>Otázka: Kolikátý maskot (úhoř) to je?</label>
                        <input type="number" id="userAnswer" placeholder="0">
                    </div>`;
            }
        } else if (st.typ === "smenarny") {
            // Speciální dynamická tabulka pro 5. stanoviště
            interakceHtml = `
                <div class="exchange-table-box">
                    <table class="exchange-table">
                        <tr>
                            <th>Statistika</th>
                            <th>Euro (EUR)</th>
                            <th>Dolar (USD)</th>
                        </tr>
                        <tr>
                            <td><strong>MAXIMUM</strong></td>
                            <td><input type="number" step="0.01" id="eurMax" placeholder="0.00"></td>
                            <td><input type="number" step="0.01" id="usdMax" placeholder="0.00"></td>
                        </tr>
                        <tr>
                            <td><strong>MINIMUM</strong></td>
                            <td><input type="number" step="0.01" id="eurMin" placeholder="0.00"></td>
                            <td><input type="number" step="0.01" id="usdMin" placeholder="0.00"></td>
                        </tr>
                        <tr>
                            <td><strong>PRŮMĚR</strong></td>
                            <td><input type="number" step="0.01" id="eurAvg" placeholder="0.00"></td>
                            <td><input type="number" step="0.01" id="usdAvg" placeholder="0.00"></td>
                        </tr>
                    </table>
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
 * 6. KONTROLA ÚSPĚŠNOSTI A POSTUP
 */
function nextStep() {
    const st = teamRoute[currentStepIndex];
    
    // Kontrola běžného čísla (či doplňující otázky u médií)
    if (st.typ === "cislo" || (st.typ === "media" && st.reseni)) {
        const userVal = document.getElementById('userAnswer').value;
        if (parseInt(userVal) !== st.reseni) {
            alert("❌ Špatný výsledek! Zkuste to znovu.");
            return;
        }
    }

    // Kontrola nahraných médií
    if (st.typ === "media") {
        if (!confirm("Máte soubor úspěšně nahraný v albu?")) return;
    }

    // Kontrola vyplnění celé tabulky směnáren
    if (st.typ === "smenarny") {
        const fields = ['eurMax', 'usdMax', 'eurMin', 'usdMin', 'eurAvg', 'usdAvg'];
        for (let id of fields) {
            const val = parseFloat(document.getElementById(id).value);
            if (isNaN(val) || val <= 0) {
                alert("❌ Musíte vyplnit všechna políčka tabulky platnými kurzy!");
                return;
            }
        }
    }

    if (confirm("Máte vše splněno a zapsáno v bločku? Pokračovat dál?")) {
        currentStepIndex++;
        fazaCesty = true; 
        updateUI();
        window.scrollTo(0,0);
    }
}

/**
 * 7. INICIALIZACE HRY PŘI NAČTENÍ
 */
startTime = new Date(); // Spustíme stopky
teamRoute = generujChaotickouTrasu(teamId);
updateUI();
