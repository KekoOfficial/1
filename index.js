const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

// 1. Configura el cliente de WhatsApp
const client = new Client({
    authStrategy: new LocalAuth()
});

// 2. Evento para mostrar el código QR
client.on('qr', qr => {
    // Muestra el QR en la terminal. Escanéalo con tu teléfono.
    qrcode.generate(qr, { small: true });
});

// 3. Evento cuando el cliente está listo
client.on('ready', () => {
    console.log('¡El bot está listo y conectado!');
});

// 4. El corazón del bot: evento al unirse a un grupo
client.on('group_join', async (notification) => {
    console.log('Bot se unió a un nuevo grupo.');
    
    // Obtiene el ID del usuario que añadió al bot
    // El 'notification.id.participant' es la persona que lo agregó
    const participantId = notification.id.participant; 

    // Define el mensaje de bienvenida
    const now = new Date();
    const message = `
    Hola, cómo estás.
    Soy un Subbot, puedes usar mis comandos con .help
    [Hora] ${now.toLocaleTimeString()}
    [Fecha] ${now.toLocaleDateString()}
    [Día] ${now.toLocaleDateString('es-ES', { weekday: 'long' })}
    `;

    // 5. Envía el mensaje al usuario en privado
    try {
        await client.sendMessage(participantId, message);
        console.log(`Mensaje de bienvenida enviado en privado a: ${participantId}`);
    } catch (error) {
        console.error('Error al enviar el mensaje privado:', error);
    }
});

// 6. Inicia el cliente
client.initialize();