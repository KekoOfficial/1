const fs = require('fs');
const path = require('path');

/**
 * Gestiona la identidad y autenticación de los bots.
 */
class GestorIdentidad {
    constructor() {
        this.cuentasPath = path.join(__dirname, '../../config/privado/cuentas.json');
    }

    /**
     * Genera un nombre de usuario para modo offline.
     * @param {number} indice
     * @returns {string}
     */
    generarNombreOffline(indice) {
        return `Keko_${indice.toString().padStart(4, '0')}`;
    }

    /**
     * Obtiene las credenciales de una cuenta Microsoft de la configuración privada.
     * @param {number} indice
     * @returns {Object|null}
     */
    obtenerCuentaPublica(indice) {
        if (!fs.existsSync(this.cuentasPath)) return null;
        try {
            const cuentas = JSON.parse(fs.readFileSync(this.cuentasPath, 'utf-8'));
            return cuentas[indice] || null;
        } catch (e) {
            console.error('Error al leer cuentas.json:', e);
            return null;
        }
    }
}

module.exports = new GestorIdentidad();
