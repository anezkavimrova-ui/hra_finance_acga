
const vsechnaStanoviste = [
    { id: 0, nazev: "ČNB", zadani: "Spočítejte vejce ve 4. sloupci a získejte razítko.", poloha: "Na Příkopě 28" },
    { id: 1, nazev: "Česká minovna", zadani: "Najděte největší minci ve výloze a zapište její název.", poloha: "Havířská 3" },
    { id: 2, nazev: "Pojišťovna - Úhoři", zadani: "Natočte reportáž o historii budovy a úhořích.", poloha: "Spálená 75/16" },
    // ... doplňte všech 8
];

// Definice tras (posunutí indexů)
function inicializujHru() {
    const urlParams = new URLSearchParams(window.location.search);
    const tymId = urlParams.get('tym'); // např. ?tym=1
    
    // Logika rotace: Tým 1 začíná od 0, Tým 2 od 1...
    let poradi = [];
    for(let i = 0; i < vsechnaStanoviste.length; i++) {
        let index = (i + parseInt(tymId) - 1) % vsechnaStanoviste.length;
        poradi.push(vsechnaStanoviste[index]);
    }
    return poradi;
}
