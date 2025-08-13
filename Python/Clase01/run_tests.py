"""
Test Runner Principal
====================

Script para ejecutar todos los tests del sistema de manera organizada
"""

import sys
import os
import unittest
import argparse
from pathlib import Path

# Agregar src al path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root / 'src'))

def ejecutar_tests_unitarios():
    """Ejecutar solo tests unitarios (sin BD)"""
    print("🧪 EJECUTANDO TESTS UNITARIOS")
    print("=" * 50)
    print("✅ Tests que NO requieren base de datos")
    print()
    
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    
    # Cargar tests unitarios
    from tests.test_usuario import TestUsuarioUnitario
    suite.addTests(loader.loadTestsFromTestCase(TestUsuarioUnitario))
    
    # Ejecutar
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    return result.wasSuccessful()

def ejecutar_tests_integracion():
    """Ejecutar tests de integración (con BD)"""
    print("🧪 EJECUTANDO TESTS DE INTEGRACIÓN")
    print("=" * 50)
    print("⚠️  Tests que REQUIEREN base de datos PostgreSQL")
    print()
    
    # Configurar variable de entorno
    os.environ['TEST_DB'] = 'true'
    
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    
    # Cargar tests de integración
    from tests.test_dao import TestUsuarioDao
    suite.addTests(loader.loadTestsFromTestCase(TestUsuarioDao))
    
    # Ejecutar
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    return result.wasSuccessful()

def ejecutar_tests_completos():
    """Ejecutar suite completa de tests"""
    print("🧪 EJECUTANDO SUITE COMPLETA DE TESTS")
    print("=" * 60)
    
    # Configurar para tests con BD
    os.environ['TEST_DB'] = 'true'
    
    from tests.test_sistema_completo import run_tests_with_coverage
    return run_tests_with_coverage()

def verificar_configuracion():
    """Verificar que el proyecto esté configurado correctamente"""
    print("🔍 VERIFICANDO CONFIGURACIÓN DEL PROYECTO")
    print("=" * 50)
    
    project_root = Path(__file__).parent
    errores = []
    
    # Verificar estructura de archivos
    archivos_requeridos = [
        'src/models/usuario.py',
        'src/dao/usuario_dao.py', 
        'src/database/conexion.py',
        'src/utils/logger_base.py',
        'src/ui/menu_app_usuario.py',
        'config/database_config.py',
        'app.py',
        'requirements.txt'
    ]
    
    for archivo in archivos_requeridos:
        path = project_root / archivo
        if path.exists():
            print(f"✅ {archivo}")
        else:
            print(f"❌ {archivo} - FALTANTE")
            errores.append(archivo)
    
    # Verificar imports
    print("\n🔍 VERIFICANDO IMPORTS...")
    try:
        from src.models.usuario import Usuario
        print("✅ Usuario importado correctamente")
    except ImportError as e:
        print(f"❌ Error importando Usuario: {e}")
        errores.append("Import Usuario")
    
    try:
        from src.dao.usuario_dao import UsuarioDao
        print("✅ UsuarioDao importado correctamente")
    except ImportError as e:
        print(f"❌ Error importando UsuarioDao: {e}")
        errores.append("Import UsuarioDao")
    
    # Verificar métodos según UML
    print("\n🔍 VERIFICANDO MÉTODOS SEGÚN UML...")
    try:
        from src.database.conexion import Conexion
        metodos_conexion = ['obtenerPool', 'obtenerConexion', 'liberarConexion', 'cerrarConexiones']
        for metodo in metodos_conexion:
            if hasattr(Conexion, metodo):
                print(f"✅ Conexion.{metodo}")
            else:
                print(f"❌ Conexion.{metodo} - FALTANTE")
                errores.append(f"Método {metodo}")
    except ImportError as e:
        print(f"❌ Error importando Conexion: {e}")
        errores.append("Import Conexion")
    
    print(f"\n📊 RESUMEN: {len(errores)} errores encontrados")
    
    if errores:
        print("\n❌ ERRORES ENCONTRADOS:")
        for error in errores:
            print(f"   • {error}")
        return False
    else:
        print("\n✅ ¡CONFIGURACIÓN CORRECTA!")
        return True

def main():
    """Función principal del test runner"""
    parser = argparse.ArgumentParser(
        description="Test Runner para Sistema de Gestión de Usuarios - Lab UML 1.1"
    )
    parser.add_argument(
        '--tipo', 
        choices=['unitarios', 'integracion', 'completos', 'verificar'],
        default='completos',
        help='Tipo de tests a ejecutar'
    )
    parser.add_argument(
        '--sin-bd',
        action='store_true',
        help='Ejecutar solo tests que no requieren base de datos'
    )
    
    args = parser.parse_args()
    
    print("🎯 TEST RUNNER - SISTEMA DE GESTIÓN DE USUARIOS")
    print("=" * 60)
    print("📋 Lab UML 1.1 - Validación completa del sistema")
    print()
    
    # Verificar configuración primero
    if args.tipo == 'verificar':
        success = verificar_configuracion()
        sys.exit(0 if success else 1)
    
    if not verificar_configuracion():
        print("\n❌ Configuración incorrecta. Ejecute con --tipo=verificar para detalles")
        sys.exit(1)
    
    print("\n" + "="*60)
    
    # Ejecutar tests según tipo
    if args.sin_bd or args.tipo == 'unitarios':
        success = ejecutar_tests_unitarios()
    elif args.tipo == 'integracion':
        success = ejecutar_tests_integracion()
    else:  # completos
        success = ejecutar_tests_completos()
    
    # Mostrar resultado final
    print("\n" + "="*60)
    if success:
        print("🎉 ¡TODOS LOS TESTS PASARON EXITOSAMENTE!")
        print("✅ Sistema cumple con el diagrama UML")
        print("✅ Listo para presentación")
    else:
        print("❌ ALGUNOS TESTS FALLARON")
        print("⚠️  Revise los errores antes de la presentación")
    
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
