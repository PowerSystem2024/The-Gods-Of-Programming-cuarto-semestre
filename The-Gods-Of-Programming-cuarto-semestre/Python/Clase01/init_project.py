"""
Script de Inicialización del Proyecto
====================================

Configura automáticamente todo el proyecto desde cero
Útil para instalación rápida en nuevos entornos
"""

import os
import sys
import subprocess
from pathlib import Path
from colorama import init, Fore, Style

init()

def ejecutar_comando(comando, descripcion):
    """Ejecuta un comando del sistema"""
    print(f"{Fore.YELLOW}🔄 {descripcion}...{Style.RESET_ALL}")
    try:
        resultado = subprocess.run(comando, shell=True, capture_output=True, text=True)
        if resultado.returncode == 0:
            print(f"{Fore.GREEN}✅ {descripcion} completado{Style.RESET_ALL}")
            return True
        else:
            print(f"{Fore.RED}❌ Error en {descripcion}: {resultado.stderr}{Style.RESET_ALL}")
            return False
    except Exception as e:
        print(f"{Fore.RED}❌ Error ejecutando {descripcion}: {e}{Style.RESET_ALL}")
        return False

def verificar_postgresql():
    """Verifica si PostgreSQL está disponible"""
    print(f"{Fore.BLUE}🔍 Verificando PostgreSQL...{Style.RESET_ALL}")
    return ejecutar_comando("psql --version", "Verificación de PostgreSQL")

def verificar_python():
    """Verifica la versión de Python"""
    print(f"{Fore.BLUE}🐍 Verificando Python...{Style.RESET_ALL}")
    version = sys.version_info
    if version.major >= 3 and version.minor >= 8:
        print(f"{Fore.GREEN}✅ Python {version.major}.{version.minor}.{version.micro} OK{Style.RESET_ALL}")
        return True
    else:
        print(f"{Fore.RED}❌ Python {version.major}.{version.minor} no compatible. Requiere 3.8+{Style.RESET_ALL}")
        return False

def crear_entorno_virtual():
    """Crea entorno virtual si no existe"""
    if Path("venv").exists():
        print(f"{Fore.YELLOW}⚠️  Entorno virtual ya existe{Style.RESET_ALL}")
        return True
    
    return ejecutar_comando("python -m venv venv", "Creación de entorno virtual")

def activar_entorno():
    """Instrucciones para activar entorno"""
    print(f"\n{Fore.CYAN}📋 Para activar el entorno virtual:{Style.RESET_ALL}")
    if os.name == 'nt':  # Windows
        print(f"{Fore.YELLOW}   venv\\Scripts\\activate{Style.RESET_ALL}")
    else:  # Linux/Mac
        print(f"{Fore.YELLOW}   source venv/bin/activate{Style.RESET_ALL}")

def instalar_dependencias():
    """Instala dependencias de Python"""
    if not Path("requirements.txt").exists():
        print(f"{Fore.RED}❌ Archivo requirements.txt no encontrado{Style.RESET_ALL}")
        return False
    
    # Usar pip del entorno virtual si existe
    pip_cmd = "venv\\Scripts\\pip" if os.name == 'nt' else "venv/bin/pip"
    if not Path(pip_cmd.split('\\')[0] if os.name == 'nt' else pip_cmd.split('/')[0]).exists():
        pip_cmd = "pip"
    
    return ejecutar_comando(f"{pip_cmd} install -r requirements.txt", "Instalación de dependencias")

def crear_archivo_env():
    """Crea archivo .env desde .env.example"""
    if Path(".env").exists():
        print(f"{Fore.YELLOW}⚠️  Archivo .env ya existe{Style.RESET_ALL}")
        return True
    
    if not Path(".env.example").exists():
        print(f"{Fore.RED}❌ Archivo .env.example no encontrado{Style.RESET_ALL}")
        return False
    
    try:
        # Copiar .env.example a .env
        with open(".env.example", "r", encoding="utf-8") as origen:
            contenido = origen.read()
        
        with open(".env", "w", encoding="utf-8") as destino:
            destino.write(contenido)
        
        print(f"{Fore.GREEN}✅ Archivo .env creado desde .env.example{Style.RESET_ALL}")
        print(f"{Fore.YELLOW}💡 Edite .env con sus credenciales de PostgreSQL{Style.RESET_ALL}")
        return True
        
    except Exception as e:
        print(f"{Fore.RED}❌ Error creando .env: {e}{Style.RESET_ALL}")
        return False

def configurar_base_datos():
    """Configura la base de datos PostgreSQL"""
    print(f"\n{Fore.CYAN}🗄️  CONFIGURACIÓN DE BASE DE DATOS{Style.RESET_ALL}")
    print("=" * 40)
    
    # Solicitar credenciales
    print(f"{Fore.YELLOW}Ingrese las credenciales de PostgreSQL:{Style.RESET_ALL}")
    
    try:
        usuario = input("Usuario PostgreSQL [postgres]: ").strip() or "postgres"
        host = input("Host [localhost]: ").strip() or "localhost"
        puerto = input("Puerto [5432]: ").strip() or "5432"
        
        # Crear base de datos
        cmd_crear_db = f'psql -U {usuario} -h {host} -p {puerto} -c "CREATE DATABASE test_db;"'
        print(f"\n{Fore.YELLOW}🔄 Creando base de datos 'test_db'...{Style.RESET_ALL}")
        
        resultado = subprocess.run(cmd_crear_db, shell=True, capture_output=True, text=True)
        if "already exists" in resultado.stderr or resultado.returncode == 0:
            print(f"{Fore.GREEN}✅ Base de datos lista{Style.RESET_ALL}")
        else:
            print(f"{Fore.YELLOW}⚠️  Base de datos podría existir ya: {resultado.stderr}{Style.RESET_ALL}")
        
        # Ejecutar script de configuración
        cmd_setup = f'psql -U {usuario} -h {host} -p {puerto} -d test_db -f scripts/database_setup.sql'
        return ejecutar_comando(cmd_setup, "Configuración de tablas")
        
    except KeyboardInterrupt:
        print(f"\n{Fore.YELLOW}⚠️  Configuración de BD cancelada{Style.RESET_ALL}")
        return False
    except Exception as e:
        print(f"{Fore.RED}❌ Error configurando BD: {e}{Style.RESET_ALL}")
        return False

def ejecutar_pruebas():
    """Ejecuta las pruebas del sistema"""
    print(f"\n{Fore.CYAN}🧪 EJECUTANDO PRUEBAS{Style.RESET_ALL}")
    print("=" * 25)
    
    # Usar python del entorno virtual si existe
    python_cmd = "venv\\Scripts\\python" if os.name == 'nt' else "venv/bin/python"
    if not Path(python_cmd.split('\\')[0] if os.name == 'nt' else python_cmd.split('/')[0]).exists():
        python_cmd = "python"
    
    # Prueba de conexión
    if not ejecutar_comando(f"{python_cmd} scripts/test_connection.py", "Prueba de conexión"):
        return False
    
    # Prueba de DAO
    if not ejecutar_comando(f"{python_cmd} scripts/test_dao.py", "Prueba de DAO"):
        return False
    
    return True

def mostrar_resumen():
    """Muestra resumen final de la instalación"""
    print(f"\n{Fore.CYAN}{'='*60}")
    print(f"    🎉 INSTALACIÓN COMPLETADA - LAB UML 1.1")
    print(f"{'='*60}{Style.RESET_ALL}")
    
    print(f"\n{Fore.GREEN}✅ Proyecto configurado exitosamente{Style.RESET_ALL}")
    
    print(f"\n{Fore.CYAN}📋 PRÓXIMOS PASOS:{Style.RESET_ALL}")
    print(f"1. {Fore.YELLOW}Editar .env con sus credenciales de PostgreSQL{Style.RESET_ALL}")
    print(f"2. {Fore.YELLOW}Activar entorno virtual:{Style.RESET_ALL}")
    
    if os.name == 'nt':
        print(f"   {Fore.BLUE}venv\\Scripts\\activate{Style.RESET_ALL}")
    else:
        print(f"   {Fore.BLUE}source venv/bin/activate{Style.RESET_ALL}")
    
    print(f"3. {Fore.YELLOW}Ejecutar aplicación:{Style.RESET_ALL}")
    print(f"   {Fore.BLUE}python app.py{Style.RESET_ALL}")
    
    print(f"\n{Fore.CYAN}🛠️  SCRIPTS ÚTILES:{Style.RESET_ALL}")
    print(f"   {Fore.BLUE}python scripts/test_connection.py{Style.RESET_ALL} - Probar conexión")
    print(f"   {Fore.BLUE}python scripts/test_dao.py{Style.RESET_ALL} - Probar DAO")
    print(f"   {Fore.BLUE}python scripts/limpiar_bd.py{Style.RESET_ALL} - Limpiar BD")
    
    print(f"\n{Fore.GREEN}🎯 ¡Sistema listo para el Lab UML 1.1!{Style.RESET_ALL}")

def main():
    """Función principal de inicialización"""
    print(f"{Fore.CYAN}{'='*60}")
    print(f"    🚀 INICIALIZACIÓN AUTOMÁTICA - LAB UML 1.1")
    print(f"{'='*60}{Style.RESET_ALL}")
    
    print(f"\n{Fore.BLUE}Este script configurará automáticamente:{Style.RESET_ALL}")
    print(f"   • Entorno virtual de Python")
    print(f"   • Dependencias del proyecto")
    print(f"   • Configuración de base de datos")
    print(f"   • Archivos de configuración")
    print(f"   • Pruebas del sistema")
    
    continuar = input(f"\n{Fore.YELLOW}¿Continuar con la instalación? (S/n): {Style.RESET_ALL}")
    if continuar.lower().strip() in ['n', 'no']:
        print(f"{Fore.YELLOW}⚠️  Instalación cancelada{Style.RESET_ALL}")
        return 1
    
    print(f"\n{Fore.BLUE}🚀 Iniciando configuración automática...{Style.RESET_ALL}\n")
    
    pasos = [
        ("Verificación de Python", verificar_python),
        ("Verificación de PostgreSQL", verificar_postgresql),
        ("Creación de entorno virtual", crear_entorno_virtual),
        ("Creación de archivo .env", crear_archivo_env),
        ("Instalación de dependencias", instalar_dependencias),
    ]
    
    # Ejecutar pasos obligatorios
    for nombre, funcion in pasos:
        print(f"\n{Fore.CYAN}📋 {nombre}{Style.RESET_ALL}")
        if not funcion():
            print(f"\n{Fore.RED}💥 ERROR: {nombre} falló{Style.RESET_ALL}")
            print(f"{Fore.YELLOW}💡 Revise los errores y configure manualmente{Style.RESET_ALL}")
            return 1
    
    # Configuración de base de datos (opcional)
    print(f"\n{Fore.CYAN}📋 Configuración de base de datos{Style.RESET_ALL}")
    config_bd = input(f"{Fore.YELLOW}¿Configurar base de datos automáticamente? (S/n): {Style.RESET_ALL}")
    
    if config_bd.lower().strip() not in ['n', 'no']:
        if not configurar_base_datos():
            print(f"{Fore.YELLOW}⚠️  Configure la base de datos manualmente{Style.RESET_ALL}")
            print(f"{Fore.BLUE}💡 Ver INSTALACION.md para instrucciones{Style.RESET_ALL}")
        else:
            # Ejecutar pruebas si BD está configurada
            print(f"\n{Fore.CYAN}📋 Pruebas del sistema{Style.RESET_ALL}")
            if not ejecutar_pruebas():
                print(f"{Fore.YELLOW}⚠️  Algunas pruebas fallaron{Style.RESET_ALL}")
    
    mostrar_resumen()
    return 0

if __name__ == "__main__":
    try:
        exit_code = main()
        sys.exit(exit_code)
    except KeyboardInterrupt:
        print(f"\n{Fore.YELLOW}⚠️  Instalación interrumpida por el usuario{Style.RESET_ALL}")
        sys.exit(1)
    except Exception as e:
        print(f"\n{Fore.RED}💥 ERROR CRÍTICO: {e}{Style.RESET_ALL}")
        sys.exit(1)
