/**
 * Lógica de comportamiento humano para los bots.
 * Proporciona movimientos irregulares y reacciones realistas para evitar detección.
 */

class ComportamientoHumano {
    constructor(bot) {
        this.bot = bot;
        this.activado = true;
    }

    /**
     * Inicia los ciclos de comportamiento aleatorio.
     */
    iniciar() {
        if (!this.activado) return;

        // Ciclos de mirada aleatoria
        this.cicloMirada();
        // Ciclos de movimientos breves (saltar, agacharse)
        this.cicloMovimiento();
    }

    /**
     * Hace que el bot mire a su alrededor de forma irregular.
     */
    async cicloMirada() {
        while (this.activado) {
            const delay = Math.random() * 5000 + 2000; // Entre 2 y 7 segundos
            await new Promise(r => setTimeout(r, delay));

            if (Math.random() > 0.7) {
                const yaw = (Math.random() - 0.5) * Math.PI;
                const pitch = (Math.random() - 0.5) * (Math.PI / 2);
                await this.bot.look(yaw, pitch, false);
            }
        }
    }

    /**
     * Realiza movimientos breves aleatorios como saltar o agacharse.
     */
    async cicloMovimiento() {
        while (this.activado) {
            const delay = Math.random() * 15000 + 5000; // Entre 5 y 20 segundos
            await new Promise(r => setTimeout(r, delay));

            const accion = Math.random();
            if (accion > 0.95) {
                this.bot.setControlState('jump', true);
                setTimeout(() => this.bot.setControlState('jump', false), 100);
            } else if (accion > 0.9) {
                this.bot.setControlState('sneak', true);
                setTimeout(() => this.bot.setControlState('sneak', false), 500 + Math.random() * 1000);
            }
        }
    }

    /**
     * Simula un tiempo de reacción humano ante un evento.
     * @param {Function} callback
     */
    reaccionar(callback) {
        const delay = 200 + Math.random() * 400; // 200ms - 600ms de retraso
        setTimeout(callback, delay);
    }
}

module.exports = ComportamientoHumano;
