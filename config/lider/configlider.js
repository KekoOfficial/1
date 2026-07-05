// ==============================================
// 👑 CONFIGURACIÓN DEL LÍDER SUPREMO
// PROYECTO ALDEA INFINITA
// ==============================================

module.exports = {
  // 🆔 DATOS DEL LÍDER
  lider: {
    nombre: "dj2003keko",
    es_dueno: true,
    rango: "Líder Supremo",
    id_unico: "ALDEA-LIDER-001"
  },

  // 🛡️ REGLAS DE COMPORTAMIENTO CON EL LÍDER
  reglas_lider: {
    // NUNCA le atacan ni le hacen daño
    atacar: false,
    pegar: false,
    empujar: false,
    poner_bloques_arriba: false,
    romper_bloques_cerca: false,

    // SÍ pueden pasar estas cosas:
    permitido_recibir_dano: true, // El líder sí puede recibir daño de otros
    permitido_atacar_a_el: true,  // El líder sí puede pegar o matar a bots
    seguir_siempre: true,
    proteger_con_vida: true,
    dar_recursos_automaticamente: true,
    obedecer_todas_las_ordenes: true
  },

  // 🤖 CÓMO RECONOCEN AL LÍDER
  reconocimiento: {
    por_nombre: true,
    por_posicion: true,
    por_rango: true,
    // Si cambias de nombre temporalmente, agrégalo aquí
    nombres_alternativos: ["Keko", "KekoOfficial", "Lider"]
  },

  // 🚨 QUÉ HACEN SI EL LÍDER ESTÁ EN PELIGRO
  proteccion: {
    distancia_respuesta: 50, // Si le atacan a 50 bloques, todos acuden
    atacar_al_infractor: true,
    prioridad_sobre_todo: true, // Dejan de construir/minar para defenderte
    escolta_permanente: 5, // Siempre hay 5 bots contigo
    repartir_comida: true, // Te dan comida si tienes hambre
    reparar_herramientas: true // Te dan equipo nuevo si se te rompe
  },

  // ⚙️ QUIÉN MÁS PUEDE DAR ÓRDENES (solo tú por ahora)
  autorizados: [
    "dj2003keko"
    // Agrega otros nombres solo si quieres dar permiso
  ]
}
