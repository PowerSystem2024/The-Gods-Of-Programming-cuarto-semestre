"""
Script de Prueba de Conexión
============================

Verifica que la conexión a PostgreSQL funcione correctamente
Útil para diagnosticar problemas de configuración
"""

import sys
import os

# Agregar src al path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from src.database.conexion import Conexion
from src.utils.logger_base import LoggerBase
from colorama import init, Fore, Style

init()

def test_conexion():
    """Prueba la conexión a la base de datos"""
    print(f"{Fore.CYAN}🔍 PROBANDO CONEXIÓN A POSTGRESQL{Style.RESET_ALL}")
    print("=" * 50)
    
    try:
        logger = LoggerBase().logger
        
        # Test 1: Crear pool
        print(f"{Fore.YELLOW}1. Creando pool de conexiones...{Style.RESET_ALL}")
        pool = Conexion.obtenerPool()
        
        if pool:
            print(f"{Fore.GREEN}✅ Pool creado exitosamente{Style.RESET_ALL}")
        else:
            print(f"{Fore.RED}❌ Error creando pool{Style.RESET_ALL}")
            return False
        
        # Test 2: Obtener conexión
        print(f"{Fore.YELLOW}2. Obteniendo conexión del pool...{Style.RESET_ALL}")
        conexion = Conexion.obtenerConexion()
        
        if conexion:
            print(f"{Fore.GREEN}✅ Conexión obtenida{Style.RESET_ALL}")
        else:
            print(f"{Fore.RED}❌ Error obteniendo conexión{Style.RESET_ALL}")
            return False
        
        # Test 3: Ejecutar query de prueba
        print(f"{Fore.YELLOW}3. Ejecutando query de prueba...{Style.RESET_ALL}")
        cursor = conexion.cursor()
        cursor.execute("SELECT version()")
        version = cursor.fetchone()[0]
        cursor.close()
        
        print(f"{Fore.GREEN}✅ Query ejecutada: {version[:50]}...{Style.RESET_ALL}")
        
        # Test 4: Verificar tabla usuario
        print(f"{Fore.YELLOW}4. Verificando tabla usuario...{Style.RESET_ALL}")
        cursor = conexion.cursor()
        cursor.execute("SELECT COUNT(*) FROM usuario")
        count = cursor.fetchone()[0]
        cursor.close()
        
        print(f"{Fore.GREEN}✅ Tabla usuario existe con {count} registros{Style.RESET_ALL}")
        
        # Test 5: Liberar conexión
        print(f"{Fore.YELLOW}5. Liberando conexión...{Style.RESET_ALL}")
        Conexion.liberarConexion(conexion)
        print(f"{Fore.GREEN}✅ Conexión liberada{Style.RESET_ALL}")
        
        # Test 6: Información del pool
        print(f"{Fore.YELLOW}6. Información del pool...{Style.RESET_ALL}")
        info = Conexion.get_info_pool()
        for key, value in info.items():
            print(f"   {key}: {value}")
        
        print(f"\n{Fore.GREEN}🎉 TODAS LAS PRUEBAS EXITOSAS{Style.RESET_ALL}")
        return True
        
    except Exception as e:
        print(f"{Fore.RED}❌ ERROR EN PRUEBAS: {e}{Style.RESET_ALL}")
        logger.error(f"Error en test de conexión: {e}")
        return False
    
    finally:
        # Cerrar conexiones
        try:
            Conexion.cerrarConexiones()
            print(f"{Fore.BLUE}🔒 Conexiones cerradas{Style.RESET_ALL}")
        except:
            pass

def mostrar_configuracion():
    """Muestra la configuración actual"""
    print(f"\n{Fore.CYAN}⚙️  CONFIGURACIÓN ACTUAL{Style.RESET_ALL}")
    print("=" * 30)
    
    from config.database_config import DatabaseConfig
    
    config = {
        'Host': DatabaseConfig.HOST,
        'Puerto': DatabaseConfig.PORT,
        'Base de Datos': DatabaseConfig.DATABASE,
        'Usuario': DatabaseConfig.USERNAME,
        'Min Conexiones': DatabaseConfig.MIN_CONNECTIONS,
        'Max Conexiones': DatabaseConfig.MAX_CONNECTIONS
    }
    
    for key, value in config.items():
        print(f"{key}: {value}")

def main():
    """Función principal"""
    print(f"{Fore.CYAN}{'='*60}")
    print(f"    🧪 SCRIPT DE PRUEBA - LAB UML 1.1")
    print(f"{'='*60}{Style.RESET_ALL}")
    
    mostrar_configuracion()
    
    print(f"\n{Fore.YELLOW}Iniciando pruebas de conexión...{Style.RESET_ALL}")
    
    if test_conexion():
        print(f"\n{Fore.GREEN}🎯 ¡SISTEMA LISTO PARA USAR!{Style.RESET_ALL}")
        return 0
    else:
        print(f"\n{Fore.RED}💥 HAY PROBLEMAS CON LA CONFIGURACIÓN{Style.RESET_ALL}")
        print(f"{Fore.YELLOW}💡 Revise:")
        print(f"   • PostgreSQL esté ejecutándose")
        print(f"   • Credenciales en config/database_config.py")
        print(f"   • Base de datos 'test_db' exista")
        print(f"   • Tabla 'usuario' esté creada{Style.RESET_ALL}")
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
