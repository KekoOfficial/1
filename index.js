const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, jidNormalizedUser } = require('@whiskeysockets/baileys')
const P = require('pino')
const fs = require('fs')

const SENT_FILE = './sent.json'
let sent = []

// Cargar registros previos
try {
    if (fs.existsSync(SENT_FILE)) {
        sent = JSON.parse(fs.readFileSync(SENT_FILE))
    }
} catch (err) {
    console.error(`Error al leer el archivo de registros: ${err.message}`)
}

// ---------------------------------------------------------------------------------------------------
// Funciones de utilidad
// ---------------------------------------------------------------------------------------------------

/**
 * Obtiene la fecha y hora actual en formato local.
 * @returns {string} Fecha y hora formateada.
 */
function getDateTime() {
    const now = new Date()
    const date = now.toLocaleDateString('es-ES')
    const time = now.toLocaleTimeString('es-ES')
    return `${date} ${time}`
}

// ---------------------------------------------------------------------------------------------------
// Funciones de envío de mensajes
// ---------------------------------------------------------------------------------------------------

/**
 * Envía un mensaje de bienvenida a un usuario específico.
 * @param {import('@whiskeysockets/baileys').WASocket} sock - Instancia de la conexión de Baileys.
 * @param {string} groupJid - JID del grupo.
 * @param {string} userJid - JID del usuario.
 * @returns {Promise<void>}
 */
async function sendMessageToUser(sock, groupJid, userJid) {
    try {
        const groupMetadata = await sock.groupMetadata(groupJid)
        const groupName = groupMetadata.subject
        const messageText = `Hola, soy un subbot. Puedes usar mis comandos con .help\nGrupo: ${groupName}\nFecha y hora: ${getDateTime()}`

        await sock.sendMessage(userJid, { text: messageText })
        
        // Registrar y guardar el usuario
        sent.push(userJid)
        fs.writeFileSync(SENT_FILE, JSON.stringify(sent, null, 2))
        console.log(`Mensaje enviado a ${userJid}`)

    } catch(err) {
        console.error(`No se pudo enviar mensaje a ${userJid}:`, err)
    }
}

/**
 * Envía un mensaje de bienvenida a todos los miembros actuales del grupo que no han sido contactados.
 * @param {import('@whiskeysockets/baileys').WASocket} sock - Instancia de la conexión de Baileys.
 * @param {string} groupJid - JID del grupo.
 * @returns {Promise<void>}
 */
async function sendToGroup(sock, groupJid) {
    try {
        const groupMetadata = await sock.groupMetadata(groupJid)
        const participants = groupMetadata.participants.map(p => jidNormalizedUser(p.id))
        
        console.log(`Verificando ${participants.length} participantes del grupo...`)
        
        for (const userJid of participants) {
            if (!sent.includes(userJid)) {
                await sendMessageToUser(sock, groupJid, userJid)
            }
        }
    } catch (err) {
        console.error(`Error al enviar mensajes a todos los miembros del grupo: ${err.message}`)
    }
}

// ---------------------------------------------------------------------------------------------------
// Lógica principal del bot
// ---------------------------------------------------------------------------------------------------

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info')
    const { version } = await fetchLatestBaileysVersion()
    const sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: true,
        logger: P({ level: 'silent' })
    })

    // Manejar eventos de conexión
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode
            console.log(`Conexión cerrada, razón: ${statusCode}`)
            if (statusCode !== 515) { // 515 es un error de conexión normal, no es necesario reiniciar
                startBot() // Reintenta conectar
            }
        } else if (connection === 'open') {
            console.log('Bot conectado a WhatsApp ✅')
        }
    })

    // Guardar credenciales
    sock.ev.on('creds.update', saveCreds)

    // Evento: Detecta nuevos miembros añadidos al grupo
    sock.ev.on('group-participants.update', async (update) => {
        const groupJid = update.id
        for (const participant of update.participants) {
            const normalized = jidNormalizedUser(participant)
            if (update.action === 'add' && !sent.includes(normalized)) {
                await sendMessageToUser(sock, groupJid, normalized)
            }
        }
    })

    return sock
}

// ---------------------------------------------------------------------------------------------------
// Ejecución del bot
// ---------------------------------------------------------------------------------------------------

startBot().then(async (sock) => {
    const groupJid = 'XXXXXXX@g.us' // ⚠️ Pon aquí el JID del grupo
    console.log('Iniciando envío de mensajes a miembros existentes...')
    await sendToGroup(sock, groupJid)
})