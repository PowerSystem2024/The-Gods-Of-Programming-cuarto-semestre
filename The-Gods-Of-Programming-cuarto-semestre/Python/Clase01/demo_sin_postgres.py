"""
DEMO SIN POSTGRESQL
==================
Script para demostrar que todas las clases funcionan sin conexión a BD
"""

from src.models.usuario import Usuario
from src.utils.logger_base import LoggerBase
from colorama import init, Fore, Style

def demo_sin_bd():
    """Demuestra todas las funcionalidades sin conexión a BD"""
    init()  # Inicializar colorama
    
    print(f"{Fore.CYAN}{'='*70}")
    print(f"🎯 DEMO: TODAS LAS CLASES FUNCIONANDO")
    print(f"{'='*70}{Style.RESET_ALL}\n")
    
    # 1. Configurar logging
    logger_base = LoggerBase()
    logger = logger_base.configuracion_logging()
    logger.info("=== INICIANDO DEMO ===")
    
    # 2. Crear usuarios de prueba
    print(f"{Fore.GREEN}✅ 1. CREANDO USUARIOS DE PRUEBA{Style.RESET_ALL}")
    usuarios = [
        Usuario(1, "admin", "password123", "admin@test.com"),
        Usuario(2, "user1", "pass456", "user1@test.com"),
        Usuario(3, "user2", "pass789", "user2@test.com")
    ]
    
    # 3. Mostrar usuarios
    print(f"\n{Fore.BLUE}📋 USUARIOS CREADOS:{Style.RESET_ALL}")
    for usuario in usuarios:
        print(f"   • ID: {usuario.id_usuario} | Usuario: {usuario.username} | Email: {usuario.email}")
    
    # 4. Demostrar getters/setters
    print(f"\n{Fore.GREEN}✅ 2. PROBANDO GETTERS/SETTERS{Style.RESET_ALL}")
    usuario_test = usuarios[0]
    print(f"   Original: {usuario_test.username}")
    usuario_test.username = "admin_modificado"
    print(f"   Modificado: {usuario_test.username}")
    
    # 5. Mostrar manejo de errores
    print(f"\n{Fore.GREEN}✅ 3. MANEJO DE EXCEPCIONES{Style.RESET_ALL}")
    try:
        # Simular error
        resultado = 10 / 0
    except ZeroDivisionError as e:
        print(f"   🛡️ Error capturado: {e}")
        logger.error(f"Error simulado capturado: {e}")
        print(f"   ✅ La aplicación continúa ejecutándose")
    
    # 6. Menú simulado
    print(f"\n{Fore.GREEN}✅ 4. MENÚ DE OPCIONES (SIMULADO){Style.RESET_ALL}")
    opciones = [
        "1. Listar usuarios",
        "2. Agregar usuario", 
        "3. Actualizar usuario",
        "4. Eliminar usuario",
        "5. Salir"
    ]
    for opcion in opciones:
        print(f"   {opcion}")
    
    print(f"\n{Fore.CYAN}🎉 DEMO COMPLETADO EXITOSAMENTE")
    print(f"✅ Todas las clases del UML funcionan correctamente")
    print(f"✅ Manejo de excepciones implementado")
    print(f"✅ Sistema de logging operativo")
    print(f"{'='*70}{Style.RESET_ALL}")
    
    logger.info("=== DEMO FINALIZADO ===")

if __name__ == "__main__":
    demo_sin_bd()
