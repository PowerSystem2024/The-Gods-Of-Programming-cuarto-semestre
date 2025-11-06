"""
Aplicación de Gestión de Usuarios
=================================

Sistema CRUD para gestión de usuarios con PostgreSQL
Implementa el patrón DAO y manejo robusto de excepciones

Autor: [Tu nombre]
Fecha: Agosto 2025
"""

import sys
import os

# Agregar src al path para imports
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from src.ui.menu_app_usuario import MenuAppUsuario
from src.database.conexion import Conexion
from src.utils.logger_base import LoggerBase
from colorama import init, Fore, Style

# Inicializar colorama para Windows
init()

def main():
    """Función principal de la aplicación"""
    try:
        # Configurar logger
        logger = LoggerBase().logger
        logger.info("=== INICIANDO APLICACIÓN DE GESTIÓN DE USUARIOS ===")
        
        print(f"{Fore.CYAN}{'='*70}")
        print(f"    🚀 SISTEMA DE GESTIÓN DE USUARIOS - UML LAB 1.1")
        print(f"{'='*70}{Style.RESET_ALL}")
        print(f"{Fore.GREEN}✅ Manejo de excepciones implementado")
        print(f"✅ Patrón DAO implementado") 
        print(f"✅ Pool de conexiones configurado")
        print(f"✅ Sistema de logging activo{Style.RESET_ALL}\n")
        
        # Probar conexión a BD antes de iniciar menú
        logger.info("Verificando conexión a base de datos...")
        pool = Conexion.obtenerPool()
        if pool:
            logger.info("✅ Conexión a base de datos exitosa")
            
            # Crear instancia del menú y mostrar
            menu = MenuAppUsuario()
            menu.mostrar_menu()
        else:
            print(f"{Fore.RED}❌ No se pudo conectar a la base de datos{Style.RESET_ALL}")
            logger.error("Error de conexión a base de datos")
            
    except KeyboardInterrupt:
        print(f"\n{Fore.YELLOW}⚠️  Aplicación interrumpida por el usuario{Style.RESET_ALL}")
        logger.info("Aplicación interrumpida por el usuario (Ctrl+C)")
    except Exception as e:
        print(f"{Fore.RED}❌ Error crítico en la aplicación: {e}{Style.RESET_ALL}")
        logger.error(f"Error crítico en aplicación: {e}", exc_info=True)
    finally:
        # Cerrar conexiones al finalizar
        try:
            Conexion.cerrarConexiones()
            logger.info("=== APLICACIÓN FINALIZADA ===")
        except Exception as e:
            logger.error(f"Error al cerrar conexiones: {e}")

if __name__ == "__main__":
    main()
