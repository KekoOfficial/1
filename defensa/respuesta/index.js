const CONFIG_LIDER = require('../../config/lider/configlider')
const NOMBRE_LIDER = CONFIG_LIDER.lider.nombre
const REGLAS = CONFIG_LIDER.reglas_lider

/**
 * Ejemplo de lógica de respuesta para la defensa de la aldea y protección del líder.
 * @param {any} bot - Instancia del bot de Minecraft (por ejemplo, mineflayer).
 */
function configurarRespuestaDefensa(bot) {
    // NO ATACAN AL LÍDER
    bot.on('entityHurt', (entidad) => {
        if (entidad.username === NOMBRE_LIDER) {
            console.log(`🛡️ El Líder Supremo ${NOMBRE_LIDER} ha sido herido. ¡Activando protocolos de defensa!`);
            // Aquí iría la lógica para que los bots cercanos acudan a defender.
            return;
        }
    });

    bot.on('attack', (objetivo) => {
        if (objetivo && objetivo.username === NOMBRE_LIDER) {
            console.log("⚠️ PROHIBIDO: No se puede atacar al Líder Supremo");
            // Nota: Dependiendo de la librería del bot, cancelar el ataque puede variar.
            return false; // Intento de bloquear el ataque
        }
    });

    // Lógica de seguimiento al líder
    function seguirLider() {
        if (!REGLAS.seguir_siempre) return;

        const lider = bot.players[NOMBRE_LIDER];
        if (lider && lider.entity) {
            // Ejemplo usando pathfinder de mineflayer
            if (bot.pathfinder) {
                const { GoalNear } = require('mineflayer-pathfinder').goals;
                bot.pathfinder.setGoal(new GoalNear(lider.entity.position.x, lider.entity.position.y, lider.entity.position.z, 2));
            }
        }
    }

    // Verificar seguimiento periódicamente si está habilitado
    if (REGLAS.seguir_siempre) {
        setInterval(seguirLider, 2000);
    }
}

module.exports = { configurarRespuestaDefensa };
