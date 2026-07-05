const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, jidNormalizedUser, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const P = require('pino');
const fs = require('fs');
const qrcode = require('qrcode-terminal');
const CONFIG_LIDER = require('../../config/lider/configlider');
const GestorIdentidad = require('./identidad');

/**
 * 🧠 EL CEREBRO: Sistema Central de Proyecto Aldea Infinita.
 * Coordina a todos los bots (Corazones) y responde a la Mano (Líder).
 */
class Cerebro {
    constructor() {
        this.sock = null;
        this.corazones = new Map();
        this.SENT_FILE = './sent.json';
        this.sent = [];
    }

    /**
     * Carga los registros de usuarios contactados.
     */
    loadSentRecords() {
        try {
            if (fs.existsSync(this.SENT_FILE)) {
                this.sent = JSON.parse(fs.readFileSync(this.SENT_FILE, 'utf-8'));
            }
        } catch (err) {
            console.error(`Error al leer registros: ${err.message}`);
        }
    }

    /**
     * Inicia la conexión de WhatsApp para el control del sistema.
     */
    async iniciarControl() {
        this.loadSentRecords();
        const { state, saveCreds } = await useMultiFileAuthState('auth_info');
        const { version } = await fetchLatestBaileysVersion();

        this.sock = makeWASocket({
            version,
            auth: state,
            logger: P({ level: 'silent' }),
        });

        this.sock.ev.on('creds.update', saveCreds);
        this.sock.ev.on('connection.update', (update) => this.onConnectionUpdate(update));

        // Aquí se podrían añadir comandos de WhatsApp para controlar los bots
    }

    async onConnectionUpdate(update) {
        const { connection, lastDisconnect, qr } = update;
        if (qr) {
            console.log('🔗 Escanea el código QR para vincular el Cerebro:');
            qrcode.generate(qr, { small: true });
        }
        if (connection === 'open') {
            console.log(`🧠 Cerebro conectado ✅. Líder Supremo: ${CONFIG_LIDER.lider.nombre}`);
        }
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error instanceof Boom) &&
                lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) this.iniciarControl();
        }
    }

    /**
     * Despliega un nuevo bot (Corazón).
     * @param {number} indice
     */
    desplegarCorazon(indice) {
        const nombre = GestorIdentidad.generarNombreOffline(indice);
        console.log(`❤️ Desplegando Corazón: ${nombre}`);
        // Lógica para instanciar el bot con mineflayer
    }
}

const cerebro = new Cerebro();

module.exports = {
    startBot: () => cerebro.iniciarControl(),
    cerebro
};
