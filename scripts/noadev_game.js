/**
 * NoaDev: El Camino del Desarrollador Supremo
 * Un juego de terminal para simular la obtención de logros.
 */

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const ACHIEVEMENTS = [
    "Pull Shark 🦈", "Quickdraw ⚡", "YOLO 🤘", "Galaxy Brain 🧠",
    "Starstruck ⭐", "Heart on Your Sleeve ❤️", "Pair Extraordinaire 👥",
    "Arctic Code Vault ❄️", "Mars 2020 🚀", "Public Sponsor 💸"
];

let score = 0;
let unlocked = [];

function showMenu() {
    console.log("\n--- NOADEV: THE ACHIEVEMENT GAME ---");
    console.log(`Logros Desbloqueados: ${unlocked.length} / ${ACHIEVEMENTS.length}`);
    console.log("1. Hacer un Commit Rápido (Probabilidad de Quickdraw)");
    console.log("2. Colaborar en un PR (Probabilidad de Pair Extraordinaire)");
    console.log("3. Escribir Documentación (Logro NoaDev)");
    console.log("4. Ver Mis Logros");
    console.log("5. Salir");
    rl.question('Elige una acción: ', handleAction);
}

function handleAction(choice) {
    switch(choice) {
        case '1':
            if (Math.random() > 0.7) unlock("Quickdraw ⚡");
            else console.log("Commit realizado con éxito.");
            break;
        case '2':
            if (Math.random() > 0.5) unlock("Pair Extraordinaire 👥");
            else console.log("Colaboración enviada.");
            break;
        case '3':
            console.log("Documentación actualizada. ¡Eres un Dios de la Doc!");
            unlock("Documentation God 📖");
            break;
        case '4':
            console.log("Tus medallas:", unlocked.join(', ') || "Ninguna aún.");
            break;
        case '5':
            console.log("¡Adiós, Programador Supremo!");
            rl.close();
            return;
        default:
            console.log("Opción no válida.");
    }
    showMenu();
}

function unlock(name) {
    if (!unlocked.includes(name)) {
        unlocked.push(name);
        console.log(`\n🎉 ¡LOGRO DESBLOQUEADO: ${name}! 🎉`);
    } else {
        console.log(`\nYa tienes el logro: ${name}`);
    }
}

console.log("Iniciando aventura NoaDev...");
showMenu();
