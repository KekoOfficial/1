/**
 * Motor de Logros NoaDev
 * Calcula y muestra el progreso hacia los 400 logros.
 */

const fs = require('fs');
const path = require('path');

class LogrosEngine {
    constructor() {
        this.dbPath = path.join(__dirname, 'achievements_db.json');
        this.data = JSON.parse(fs.readFileSync(this.dbPath, 'utf8'));
    }

    getStatus() {
        const officialCount = this.data.official_achievements.length;
        const noadevCount = this.data.noadev_achievements.length;
        const total = officialCount + noadevCount;

        console.log("========================================");
        console.log("   🏆 REPORTE DE LOGROS NOADEV   ");
        console.log("========================================");
        console.log(`Logros Oficiales de GitHub: ${officialCount}`);
        console.log(`Logros de Sistema NoaDev: ${noadevCount}`);
        console.log(`Progreso Total: ${total} / ${this.data.meta.total_achievements_target}`);
        console.log("----------------------------------------");
    }

    listMissing() {
        console.log("Próximos objetivos:");
        this.data.noadev_achievements.forEach(l => {
            console.log(`- [ ] ${l.name}: ${l.description}`);
        });
    }
}

if (require.main === module) {
    const engine = new LogrosEngine();
    engine.getStatus();
    engine.listMissing();
}

module.exports = LogrosEngine;
