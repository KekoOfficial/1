const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

const SENT_FILE = './sent.json';
let sent = [];

// ---------------------------------------------------------------------------------------------------
// Funciones de utilidad y persistencia
// ---------------------------------------------------------------------------------------------------

/**
 * Carga los registros de usuarios a los que ya se les ha enviado un mensaje desde un archivo.
 */
function loadSentRecords() {
    try {
        if (fs.existsSync(SENT_FILE)) {
            sent = JSON.parse(fs.readFileSync(SENT_FILE, 'utf-8'));
            console.log(`Registros cargados: ${sent.length} usuarios ya contactados.`);
        } else {
            console.log('No se encontraron registros previos. Se creará un nuevo archivo.');
        }
    } catch (err) {
        console.error(`Error al leer el archivo de registros: ${err.message}`);
    }
}

/**
 * Guarda los registros de usuarios en un archivo.
 */
function saveSentRecords() {
    try {
        fs.writeFileSync(SENT_FILE, JSON.stringify(sent, null, 2));
    } catch (err) {
        console.error(`Error al guardar los registros: ${err.message}`);
    }
}

/**
 * Obtiene la fecha y hora actual en formato local.
 * @returns {string} Fecha y hora formateada.
 */
function getDateTime() {
    const now = new Date();
    const date = now.toLocaleDateString('es-ES');
    const time = now.toLocaleTimeString('es-ES');
    return `${date} ${time}`;
}

// ---------------------------------------------------------------------------------------------------
// Lógica de envío de mensajes y del bot
// ---------------------------------------------------------------------------------------------------

/**
 * Envía un mensaje de bienvenida a un usuario específico y lo registra.
 * @param {import('whatsapp-web.js').Client} client - Instancia de la conexión del cliente de WhatsApp.
 * @param {string} groupChatId - ID del chat del grupo.
 * @param {string} userJid - ID del usuario.
 * @returns {Promise<void>}
 */
async function sendMessageToUser(client, groupChatId, userJid) {
    if (sent.includes(userJid)) {
        console.log(`Omitiendo a ${userJid}: Ya se le ha enviado un mensaje.`);
        return;
    }

    try {
        const groupChat = await client.getChatById(groupChatId);
        const groupName = groupChat.name;
        const messageText = `Hola, soy un subbot. Puedes usar mis comandos con .help\nGrupo: ${groupName}\nFecha y hora: ${getDateTime()}`;

        await client.sendMessage(userJid, messageText);
        
        sent.push(userJid);
        saveSentRecords();
        console.log(`Mensaje enviado a ${userJid} desde el grupo "${groupName}".`);
    } catch (err) {
        console.error(`No se pudo enviar mensaje a ${userJid}:`, err.message);
    }
}

/**
 * Envía un mensaje de bienvenida a todos los miembros actuales del grupo que no han sido contactados.
 * @param {import('whatsapp-web.js').Client} client - Instancia de la conexión del cliente de WhatsApp.
 * @param {string} groupChatId - ID del chat del grupo.
 * @returns {Promise<void>}
 */
async function sendToGroup(client, groupChatId) {
    try {
        const groupChat = await client.getChatById(groupChatId);
        const participants = groupChat.participants.map(p => p.id._serialized);
        
        console.log(`Verificando ${participants.length} participantes del grupo para el envío masivo...`);
        
        for (const userJid of participants) {
            await sendMessageToUser(client, groupChatId, userJid);
        }
    } catch (err) {
        console.error(`Error al enviar mensajes a todos los miembros del grupo: ${err.message}`);
    }
}

// ---------------------------------------------------------------------------------------------------
// Lógica principal del bot
// ---------------------------------------------------------------------------------------------------

// Carga los registros al inicio del script.
loadSentRecords();

const client = new Client({
    authStrategy: new LocalAuth({ clientId: 'bot-client' }),
    puppeteer: {
        args: ['--no-sandbox'],
    },
});

// Evento: Se activa cuando se necesita un código QR para la autenticación.
client.on('qr', (qr) => {
    console.log('Escanea este código QR con tu WhatsApp para vincular el dispositivo:');
    qrcode.generate(qr, { small: true });
});

// Evento: Se activa cuando el cliente está listo y conectado.
client.on('ready', async () => {
    console.log('Cliente conectado con éxito ✅');
    // Inicia el envío masivo de mensajes solo después de una conexión exitosa.
    const groupChatId = 'XXXXXXX@g.us'; // ⚠️ Pon aquí el JID del grupo
    await sendToGroup(client, groupChatId);
});

// Evento: Detecta cuando un miembro se une a un grupo.
client.on('group_join', async (notification) => {
    const groupChatId = notification.chatId;
    const participantId = notification.recipientIds[0];
    await sendMessageToUser(client, groupChatId, participantId);
});

// Evento: Se activa cuando la conexión se pierde.
client.on('disconnected', (reason) => {
    console.log('Cliente desconectado:', reason);
    console.log('Reconectando...');
    client.initialize();
});

// Inicia el proceso de autenticación y conexión.
client.initialize();