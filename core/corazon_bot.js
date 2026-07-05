const mineflayer = require('mineflayer');
const { pathfinder, Movements } = require('mineflayer-pathfinder');
const CONFIG_LIDER = require('../config/lider/configlider');
const ComportamientoHumano = require('./comportamiento_humano');

/**
 * ❤️ EL CORAZÓN: Representación individual de un bot en la aldea.
 */
class CorazonBot {
    constructor(opciones) {
        this.bot = mineflayer.createBot(opciones);
        this.humano = new ComportamientoHumano(this.bot);

        this.configurarEventos();
    }

    configurarEventos() {
        this.bot.loadPlugin(pathfinder);

        this.bot.once('spawn', () => {
            console.log(`[${this.bot.username}] Ha aparecido en la aldea.`);
            this.humano.iniciar();
        });

        // REGLA DE ORO: Protección al Líder
        this.bot.on('entityHurt', (entidad) => {
            if (entidad.username === CONFIG_LIDER.lider.nombre) {
                this.humano.reaccionar(() => {
                    console.log(`🛡️ [${this.bot.username}] ¡Defendiendo al Líder!`);
                    // Lógica de defensa inmediata
                });
            }
        });

        // Prohibido atacar al líder
        this.bot.on('attack', (objetivo) => {
            if (objetivo.username === CONFIG_LIDER.lider.nombre) {
                return false;
            }
        });
    }
}

module.exports = CorazonBot;
