// Array global de personajes
let avatares = [];

// CLASE PERSONAJE
class Personaje {
    constructor(nombre, imagen) {
        this.nombre = nombre;
        this.imagen = imagen;
        this.vida = 3;
        this.ataques = []; // Array de ataques dentro del objeto
    }

    // Método para agregar ataques al personaje
    agregarAtaques() {
        this.ataques.push(
            { nombre: 'Puño', emoji: '🤜🏻', id: 'boton-punio' },
            { nombre: 'Patada', emoji: '🦵🏻', id: 'boton-patada' },
            { nombre: 'Barrida', emoji: '🦶🏻', id: 'boton-barrida' }
        );
    }

    atacar() {
        const ataques = ["Puño 🤜🏻", "Patada 🦵🏻", "Barrida 🦶🏻"];
        return ataques[Math.floor(Math.random() * ataques.length)];
    }

    // Método para obtener un ataque específico por índice
    obtenerAtaque(indice) {
        return this.ataques[indice];
    }
}

// FUNCIÓN PARA INICIALIZAR PERSONAJES
function inicializarPersonajes() {
    // Crear personajes básicos usando las imágenes nuevas
    let zuko = new Personaje("Zuko", "img/Zuko.png");
    let izumi = new Personaje("Izumi", "img/Izumi.png");
    let mai = new Personaje("Mai", "img/Mai.png");
    let ursa = new Personaje("Ursa", "img/Ursa.png");

    // Agregar personajes adicionales
    let sokka = new Personaje("Sokka", "img/Sokka.png");
    let iroh = new Personaje("Iroh", "img/Iroh.png");
    let ozai = new Personaje("Ozai", "img/Ozai.png");
    let azula = new Personaje("Azula", "img/Azula.png");

    // Agregar ataques a cada personaje (ejemplo de arrays dentro de objetos)
    [zuko, izumi, mai, ursa, sokka, iroh, ozai, azula].forEach(personaje => {
        personaje.agregarAtaques();
    });

    avatares = [zuko, izumi, mai, ursa, sokka, iroh, ozai, azula];
    console.log("Avatares inicializados:", avatares);
    console.log("Total de avatares:", avatares.length);
    console.log("Ataques de Zuko:", zuko.ataques); // Ejemplo de acceso a array dentro de objeto
    
    return avatares;
}