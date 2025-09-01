// Constantes globales
const ATAQUES = {
    PUÑO: 'PUÑO ✊',
    PATADA: 'PATADA 🦶',
    BARRIDA: 'BARRIDA 👣'
};

// Mapeo de elementos por personaje
const ELEMENTOS = {
    ZUKO: 'fuego 🔥',
    KATARA: 'agua 💧',
    AANG: 'aire 🌪️',
    TOPH: 'tierra 🌱'
};

// Variables de estado del juego
let ataqueJugador;
let ataqueEnemigo;
let vidasJugador = 3;
let vidasEnemigo = 3;
let personajeJugador;
let personajeEnemigo;

function iniciarJuego() {
    const botonPersonajeJugador = document.getElementById('boton-personaje');
    botonPersonajeJugador.addEventListener('click', seleccionarPersonajeJugador);

    const botonPunio = document.getElementById('boton-punio');
    botonPunio.addEventListener('click', ataquePunio);
    const botonPatada = document.getElementById('boton-patada');
    botonPatada.addEventListener('click', ataquePatada);
    const botonBarrida = document.getElementById('boton-barrida');
    botonBarrida.addEventListener('click', ataqueBarrida);

    const botonReiniciar = document.getElementById('boton-reiniciar');
    botonReiniciar.addEventListener('click', reiniciarJuego);
}

function seleccionarPersonajeJugador() {
    const inputZuko = document.getElementById('zuko');
    const inputKatara = document.getElementById('katara');
    const inputAang = document.getElementById('aang');
    const inputToph = document.getElementById('toph');
    const spanPersonajeJugador = document.getElementById('personaje-jugador');

    if (inputZuko.checked) {
        spanPersonajeJugador.innerHTML = 'Zuko';
        personajeJugador = 'ZUKO';
    } else if (inputKatara.checked) {
        spanPersonajeJugador.innerHTML = 'Katara';
        personajeJugador = 'KATARA';
    } else if (inputAang.checked) {
        spanPersonajeJugador.innerHTML = 'Aang';
        personajeJugador = 'AANG';
    } else if (inputToph.checked) {
        spanPersonajeJugador.innerHTML = 'Toph';
        personajeJugador = 'TOPH';
    } else {
        alert('Selecciona un personaje');
        return;
    }

    seleccionarPersonajeEnemigo();
    ocultarSeccion('seleccionar-personaje');
    ocultarSeccion('reglas-juego');
    mostrarSeccion('seleccionar-ataque');
}

function seleccionarPersonajeEnemigo() {
    const personajeAleatorio = aleatorio(1, 4);
    const spanPersonajeEnemigo = document.getElementById('personaje-enemigo');

    if (personajeAleatorio === 1) {
        spanPersonajeEnemigo.innerHTML = 'Zuko';
        personajeEnemigo = 'ZUKO';
    } else if (personajeAleatorio === 2) {
        spanPersonajeEnemigo.innerHTML = 'Katara';
        personajeEnemigo = 'KATARA';
    } else if (personajeAleatorio === 3) {
        spanPersonajeEnemigo.innerHTML = 'Aang';
        personajeEnemigo = 'AANG';
    } else {
        spanPersonajeEnemigo.innerHTML = 'Toph';
        personajeEnemigo = 'TOPH';
    }
}

function ataquePunio() {
    ataqueJugador = ATAQUES.PUÑO;
    ataqueAleatorioEnemigo();
}

function ataquePatada() {
    ataqueJugador = ATAQUES.PATADA;
    ataqueAleatorioEnemigo();
}

function ataqueBarrida() {
    ataqueJugador = ATAQUES.BARRIDA;
    ataqueAleatorioEnemigo();
}

function ataqueAleatorioEnemigo() {
    const ataqueAleatorio = aleatorio(1, 3);

    if (ataqueAleatorio === 1) {
        ataqueEnemigo = ATAQUES.PUÑO;
    } else if (ataqueAleatorio === 2) {
        ataqueEnemigo = ATAQUES.PATADA;
    } else {
        ataqueEnemigo = ATAQUES.BARRIDA;
    }

    combate();
}

// Función para generar mensajes de acción según personaje y ataque
function generarMensajeAccion(personaje, ataque, esAtaque = true) {
    const accion = esAtaque ? 'ataca' : 'defiende';
    const nombrePersonaje = personaje.charAt(0) + personaje.slice(1).toLowerCase();

    switch (personaje) {
        case 'ZUKO':
            if (ataque === ATAQUES.PUÑO) return `${nombrePersonaje} ataca con un PUÑO DE FUEGO 🔥`;
            if (ataque === ATAQUES.PATADA) return `${nombrePersonaje} lanza una PATADA LLAMEANTE 🔥`;
            if (ataque === ATAQUES.BARRIDA) return `${nombrePersonaje} realiza una BARRIDA INCENDIARIA 🔥`;
            break;

        case 'KATARA':
            if (ataque === ATAQUES.PUÑO) return `${nombrePersonaje} golpea con un PUÑO DE AGUA 💧`;
            if (ataque === ATAQUES.PATADA) return `${nombrePersonaje} ejecuta una PATADA GLACIAL ❄️`;
            if (ataque === ATAQUES.BARRIDA) return `${nombrePersonaje} hace una BARRIDA ACUÁTICA 💦`;
            break;

        case 'AANG':
            if (ataque === ATAQUES.PUÑO) return `${nombrePersonaje} ataca con un PUÑO DE AIRE 🌪️`;
            if (ataque === ATAQUES.PATADA) return `${nombrePersonaje} lanza una PATADA TORBELLINO 💨`;
            if (ataque === ATAQUES.BARRIDA) return `${nombrePersonaje} realiza una BARRIDA AÉREA 🌀`;
            break;

        case 'TOPH':
            if (ataque === ATAQUES.PUÑO) return `${nombrePersonaje} golpea con un PUÑO DE ROCA 🌋`;
            if (ataque === ATAQUES.PATADA) return `${nombrePersonaje} ejecuta una PATADA SÍSMICA ⚡`;
            if (ataque === ATAQUES.BARRIDA) return `${nombrePersonaje} hace una BARRIDA TERRESTRE 🏔️`;
            break;
    }

    return `${nombrePersonaje} ${accion} con ${ataque}`;
}

function combate() {
    const spanVidasJugador = document.getElementById('vidas-jugador');
    const spanVidasEnemigo = document.getElementById('vidas-enemigo');
    const resultado = document.getElementById('resultado');
    const ataqueJugadorDiv = document.getElementById('ataque-del-jugador');
    const ataqueEnemigoDiv = document.getElementById('ataque-del-enemigo');
    const detalleAtaqueDiv = document.getElementById('detalle-ataque');

    // Generar mensajes de acción
    const mensajeAtaqueJugador = generarMensajeAccion(personajeJugador, ataqueJugador, true);
    const mensajeAtaqueEnemigo = generarMensajeAccion(personajeEnemigo, ataqueEnemigo, false);

    // Mostrar mensajes de ataque
    ataqueJugadorDiv.innerHTML = mensajeAtaqueJugador;
    ataqueEnemigoDiv.innerHTML = mensajeAtaqueEnemigo;

    // Mensaje especial de interacción entre elementos
    let mensajeInteraccion = '';
    const elementoJugador = ELEMENTOS[personajeJugador];
    const elementoEnemigo = ELEMENTOS[personajeEnemigo];

    // Interacciones especiales entre elementos
    if ((personajeJugador === 'KATARA' && personajeEnemigo === 'ZUKO') ||
        (personajeJugador === 'ZUKO' && personajeEnemigo === 'KATARA')) {
        mensajeInteraccion = '💧🔥 El agua y el fuego chocan creando vapor!';
    } else if ((personajeJugador === 'TOPH' && personajeEnemigo === 'AANG') ||
        (personajeJugador === 'AANG' && personajeEnemigo === 'TOPH')) {
        mensajeInteraccion = '🌪️🌱 El aire levanta polvo mientras la tierra se mantiene firme!';
    } else if (personajeJugador === personajeEnemigo) {
        mensajeInteraccion = `¡Dos maestros ${elementoJugador} se enfrentan!`;
    } else {
        mensajeInteraccion = '¡Los elementos chocan en una explosión de energía!';
    }

    detalleAtaqueDiv.innerHTML = mensajeInteraccion;

    // Lógica del combate - CORREGIDA
    if (ataqueJugador === ataqueEnemigo) {
        resultado.innerHTML = 'EMPATE 🤝';
        resultado.style.color = '#f39c12';
    } else if (
        (ataqueJugador === ATAQUES.PUÑO && ataqueEnemigo === ATAQUES.BARRIDA) ||
        (ataqueJugador === ATAQUES.PATADA && ataqueEnemigo === ATAQUES.PUÑO) ||
        (ataqueJugador === ATAQUES.BARRIDA && ataqueEnemigo === ATAQUES.PATADA)
    ) {
        resultado.innerHTML = 'GANASTE 🎉';
        resultado.style.color = '#27ae60';
        vidasEnemigo--;
        spanVidasEnemigo.textContent = vidasEnemigo;
    } else {
        resultado.innerHTML = 'PERDISTE 😢';
        resultado.style.color = '#e74c3c';
        vidasJugador--;
        spanVidasJugador.textContent = vidasJugador;
    }

    // Mostrar la sección de mensajes
    mostrarSeccion('mensajes');

    revisarVidas();
}

function revisarVidas() {
    if (vidasEnemigo === 0) {
        crearMensajeFinal(`¡Felicidades! ${personajeJugador.charAt(0) + personajeJugador.slice(1).toLowerCase()} ha ganado el juego 🏆`);
    } else if (vidasJugador === 0) {
        crearMensajeFinal(`Lo siento, ${personajeEnemigo.charAt(0) + personajeEnemigo.slice(1).toLowerCase()} te ha derrotado 💔`);
    }
}

function crearMensajeFinal(resultado) {
    const mensaje = document.getElementById('resultado');
    mensaje.innerHTML = resultado;

    ocultarSeccion('seleccionar-ataque');
    mostrarSeccion('reiniciar');
}

function reiniciarJuego() {
    location.reload();
}

function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function ocultarSeccion(id) {
    document.getElementById(id).classList.add('hidden');
}

function mostrarSeccion(id) {
    document.getElementById(id).classList.remove('hidden');
}

window.addEventListener('load', iniciarJuego);