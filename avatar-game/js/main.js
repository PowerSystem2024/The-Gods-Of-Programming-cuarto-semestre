// ARCHIVO PRINCIPAL - INICIALIZACIÓN DEL JUEGO
// Este archivo coordina todo el juego

// Variable global para la instancia del juego
let juegoAvatar;

// Función para inicializar el juego completo
function inicializarJuego() {
    console.log("🎮 Iniciando Avatar: La Leyenda de Aang");
    
    // Crear instancia del juego
    juegoAvatar = new Juego();
    
    // Iniciar el juego
    juegoAvatar.iniciar();
    
    console.log("✅ Juego inicializado correctamente");
}

// Iniciar el juego cuando la página esté completamente cargada
window.addEventListener('load', inicializarJuego);

// Funciones auxiliares globales si las necesitas
function reiniciarJuegoCompleto() {
    if (juegoAvatar) {
        juegoAvatar.reiniciar();
    }
}

// Función para obtener información del juego (útil para debugging)
function obtenerEstadoJuego() {
    if (juegoAvatar) {
        return {
            jugador: juegoAvatar.jugador?.nombre || 'No seleccionado',
            enemigo: juegoAvatar.enemigo?.nombre || 'No seleccionado',
            vidasJugador: juegoAvatar.jugador?.vida || 0,
            vidasEnemigo: juegoAvatar.enemigo?.vida || 0,
            personajesDisponibles: juegoAvatar.personajesDisponibles.length
        };
    }
    return null;
}

// Función para mostrar estadísticas en consola (opcional)
function mostrarEstadisticas() {
    console.log("📊 Estado actual del juego:", obtenerEstadoJuego());
    console.log("👥 Personajes disponibles:", avatares.length);
    console.log("🎯 Personajes:", avatares.map(p => p.nombre));
}