"""
Script para Limpiar Base de Datos
=================================

Limpia y resetea la tabla de usuarios para pruebas frescas
Útil durante el desarrollo y testing
"""

import sys
import os

# Agregar src al path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from src.database.conexion import Conexion
from src.database.cursor_del_pool import CursorDelPool
from src.utils.logger_base import LoggerBase
from colorama import init, Fore, Style

init()

def confirmar_limpieza():
    """Pide confirmación para limpiar la base de datos"""
    print(f"{Fore.RED}⚠️  ADVERTENCIA: Esta operación eliminará TODOS los usuarios{Style.RESET_ALL}")
    print(f"{Fore.YELLOW}   Se mantendrán solo los usuarios de ejemplo básicos{Style.RESET_ALL}")
    
    respuesta = input(f"\n{Fore.YELLOW}¿Está seguro de continuar? (escriba 'CONFIRMAR'): {Style.RESET_ALL}")
    
    return respuesta.strip().upper() == 'CONFIRMAR'

def limpiar_tabla_usuarios():
    """Limpia la tabla de usuarios y resetea la secuencia"""
    try:
        logger = LoggerBase().logger
        logger.info("Iniciando limpieza de tabla usuarios")
        
        with CursorDelPool() as cursor:
            if cursor is None:
                print(f"{Fore.RED}❌ No se pudo obtener cursor{Style.RESET_ALL}")
                return False
            
            # 1. Eliminar todos los usuarios
            print(f"{Fore.YELLOW}🗑️  Eliminando todos los usuarios...{Style.RESET_ALL}")
            cursor.execute("DELETE FROM usuario")
            eliminados = cursor.rowcount
            print(f"{Fore.GREEN}✅ {eliminados} usuarios eliminados{Style.RESET_ALL}")
            
            # 2. Resetear secuencia del ID
            print(f"{Fore.YELLOW}🔄 Reseteando secuencia de IDs...{Style.RESET_ALL}")
            cursor.execute("ALTER SEQUENCE usuario_id_usuario_seq RESTART WITH 1")
            print(f"{Fore.GREEN}✅ Secuencia reseteada{Style.RESET_ALL}")
            
            logger.info(f"Tabla usuarios limpiada: {eliminados} registros eliminados")
            return True
            
    except Exception as e:
        print(f"{Fore.RED}❌ Error limpiando tabla: {e}{Style.RESET_ALL}")
        logger.error(f"Error en limpieza: {e}")
        return False

def insertar_datos_ejemplo():
    """Inserta datos de ejemplo básicos"""
    try:
        logger = LoggerBase().logger
        print(f"{Fore.YELLOW}📝 Insertando datos de ejemplo...{Style.RESET_ALL}")
        
        datos_ejemplo = [
            ('admin', 'admin123', 'admin@test.com'),
            ('usuario1', 'pass123', 'usuario1@test.com'),
            ('demo', 'demo123', 'demo@demo.com'),
            ('test', 'test123', 'test@example.com')
        ]
        
        with CursorDelPool() as cursor:
            if cursor is None:
                print(f"{Fore.RED}❌ No se pudo obtener cursor{Style.RESET_ALL}")
                return False
            
            # Insertar cada usuario
            for username, password, email in datos_ejemplo:
                cursor.execute(
                    "INSERT INTO usuario (username, password, email) VALUES (%s, %s, %s)",
                    (username, password, email)
                )
            
            print(f"{Fore.GREEN}✅ {len(datos_ejemplo)} usuarios de ejemplo insertados{Style.RESET_ALL}")
            logger.info(f"Datos de ejemplo insertados: {len(datos_ejemplo)} usuarios")
            return True
            
    except Exception as e:
        print(f"{Fore.RED}❌ Error insertando datos de ejemplo: {e}{Style.RESET_ALL}")
        logger.error(f"Error insertando ejemplos: {e}")
        return False

def mostrar_estado_final():
    """Muestra el estado final de la tabla"""
    try:
        print(f"{Fore.YELLOW}📊 Estado final de la tabla:{Style.RESET_ALL}")
        
        with CursorDelPool() as cursor:
            if cursor is None:
                print(f"{Fore.RED}❌ No se pudo obtener cursor{Style.RESET_ALL}")
                return
            
            # Contar usuarios
            cursor.execute("SELECT COUNT(*) FROM usuario")
            total = cursor.fetchone()[0]
            
            # Obtener usuarios
            cursor.execute("SELECT id_usuario, username, email FROM usuario ORDER BY id_usuario")
            usuarios = cursor.fetchall()
            
            print(f"\n{Fore.GREEN}Total de usuarios: {total}{Style.RESET_ALL}")
            print(f"{Fore.GREEN}{'ID':<5} {'USERNAME':<15} {'EMAIL':<25}{Style.RESET_ALL}")
            print(f"{Fore.GREEN}{'-'*5} {'-'*15} {'-'*25}{Style.RESET_ALL}")
            
            for usuario in usuarios:
                print(f"{usuario[0]:<5} {usuario[1]:<15} {usuario[2]:<25}")
            
    except Exception as e:
        print(f"{Fore.RED}❌ Error mostrando estado: {e}{Style.RESET_ALL}")

def main():
    """Función principal"""
    print(f"{Fore.CYAN}{'='*60}")
    print(f"    🧹 LIMPIEZA DE BASE DE DATOS - LAB UML 1.1")
    print(f"{'='*60}{Style.RESET_ALL}\n")
    
    try:
        # Verificar conexión
        print(f"{Fore.BLUE}🔍 Verificando conexión...{Style.RESET_ALL}")
        if not Conexion.verificar_conexion():
            print(f"{Fore.RED}❌ No hay conexión a la base de datos{Style.RESET_ALL}")
            return 1
        
        print(f"{Fore.GREEN}✅ Conexión verificada{Style.RESET_ALL}\n")
        
        # Mostrar estado actual
        print(f"{Fore.BLUE}📊 Estado actual:{Style.RESET_ALL}")
        with CursorDelPool() as cursor:
            cursor.execute("SELECT COUNT(*) FROM usuario")
            count_actual = cursor.fetchone()[0]
            print(f"   Usuarios actuales: {count_actual}\n")
        
        # Confirmar limpieza
        if not confirmar_limpieza():
            print(f"{Fore.YELLOW}⚠️  Operación cancelada{Style.RESET_ALL}")
            return 0
        
        print(f"\n{Fore.BLUE}🚀 Iniciando limpieza...{Style.RESET_ALL}\n")
        
        # 1. Limpiar tabla
        if not limpiar_tabla_usuarios():
            print(f"{Fore.RED}❌ Error en la limpieza{Style.RESET_ALL}")
            return 1
        
        # 2. Insertar datos de ejemplo
        if not insertar_datos_ejemplo():
            print(f"{Fore.RED}❌ Error insertando datos de ejemplo{Style.RESET_ALL}")
            return 1
        
        # 3. Mostrar estado final
        mostrar_estado_final()
        
        print(f"\n{Fore.GREEN}🎉 LIMPIEZA COMPLETADA EXITOSAMENTE{Style.RESET_ALL}")
        print(f"{Fore.BLUE}💡 La base de datos está lista para usar{Style.RESET_ALL}")
        
        return 0
        
    except Exception as e:
        print(f"{Fore.RED}💥 ERROR CRÍTICO: {e}{Style.RESET_ALL}")
        return 1
    
    finally:
        try:
            Conexion.cerrarConexiones()
        except:
            pass

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
