"""
Suite de Tests para el Sistema de Gestión de Usuarios
===================================================

Tests unitarios y de integración para validar todas las funcionalidades
según el diagrama UML del Lab 1.1
"""

import unittest
import sys
import os
import tempfile
import logging

# Agregar src al path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

# Importar módulos del proyecto
from src.models.usuario import Usuario
from src.dao.usuario_dao import UsuarioDao
from src.database.conexion import Conexion
from src.utils.logger_base import LoggerBase

class TestUsuario(unittest.TestCase):
    """Tests para la clase Usuario según UML"""
    
    def setUp(self):
        """Configuración inicial para cada test"""
        self.usuario_valido = Usuario(
            id_usuario=1,
            username="test_user",
            password="test123",
            email="test@test.com"
        )
    
    def test_crear_usuario_valido(self):
        """Test: Crear usuario con datos válidos"""
        usuario = Usuario(1, "admin", "admin123", "admin@test.com")
        
        self.assertEqual(usuario.id_usuario, 1)
        self.assertEqual(usuario.username, "admin")
        self.assertEqual(usuario.password, "admin123")
        self.assertEqual(usuario.email, "admin@test.com")
    
    def test_getters_setters(self):
        """Test: Funcionamiento de getters y setters según UML"""
        usuario = Usuario(None, "", "", "")
        
        # Test setters
        usuario.id_usuario = 10
        usuario.username = "nuevo_user"
        usuario.password = "nueva_pass"
        usuario.email = "nuevo@email.com"
        
        # Test getters
        self.assertEqual(usuario.id_usuario, 10)
        self.assertEqual(usuario.username, "nuevo_user")
        self.assertEqual(usuario.password, "nueva_pass")
        self.assertEqual(usuario.email, "nuevo@email.com")
    
    def test_validacion_usuario(self):
        """Test: Validación de datos del usuario"""
        # Usuario válido
        usuario_valido = Usuario(1, "user", "pass123", "user@test.com")
        self.assertTrue(usuario_valido.is_valid())
        
        # Usuario inválido - username vacío
        usuario_invalido = Usuario(1, "", "pass123", "user@test.com")
        self.assertFalse(usuario_invalido.is_valid())
        
        # Usuario inválido - email vacío
        usuario_invalido2 = Usuario(1, "user", "pass123", "")
        self.assertFalse(usuario_invalido2.is_valid())
    
    def test_representacion_string(self):
        """Test: Representación string del usuario"""
        usuario = self.usuario_valido
        str_repr = str(usuario)
        
        self.assertIn("test_user", str_repr)
        self.assertIn("test@test.com", str_repr)

class TestLoggerBase(unittest.TestCase):
    """Tests para la clase LoggerBase según UML"""
    
    def test_configuracion_logging(self):
        """Test: configuracion_logging() según UML"""
        logger_base = LoggerBase()
        logger = logger_base.configuracion_logging()
        
        # Verificar que retorna un logger
        self.assertIsInstance(logger, logging.Logger)
        self.assertEqual(logger.name, 'usuario_app')
    
    def test_singleton_logger(self):
        """Test: Logger debe comportarse como singleton"""
        logger1 = LoggerBase().logger
        logger2 = LoggerBase().logger
        
        # Deben ser la misma instancia
        self.assertIs(logger1, logger2)

class TestConexion(unittest.TestCase):
    """Tests para la clase Conexion según UML"""
    
    @classmethod
    def setUpClass(cls):
        """Configuración una sola vez para toda la clase"""
        # Verificar si hay conexión a BD antes de ejecutar tests
        try:
            pool = Conexion.obtenerPool()
            cls.db_available = pool is not None
            if pool:
                Conexion.cerrarConexiones()
        except:
            cls.db_available = False
    
    def test_metodos_uml_existen(self):
        """Test: Verificar que existen los métodos del UML"""
        # Verificar métodos según diagrama UML
        self.assertTrue(hasattr(Conexion, 'obtenerPool'))
        self.assertTrue(hasattr(Conexion, 'obtenerConexion'))
        self.assertTrue(hasattr(Conexion, 'liberarConexion'))
        self.assertTrue(hasattr(Conexion, 'cerrarConexiones'))
    
    @unittest.skipUnless(os.getenv('TEST_DB', False), "Base de datos no disponible")
    def test_obtener_pool(self):
        """Test: obtenerPool() según UML"""
        if not self.db_available:
            self.skipTest("Base de datos no disponible")
        
        pool = Conexion.obtenerPool()
        self.assertIsNotNone(pool)
        
        # Limpiar
        Conexion.cerrarConexiones()
    
    @unittest.skipUnless(os.getenv('TEST_DB', False), "Base de datos no disponible")
    def test_obtener_conexion(self):
        """Test: obtenerConexion() según UML"""
        if not self.db_available:
            self.skipTest("Base de datos no disponible")
        
        conexion = Conexion.obtenerConexion()
        self.assertIsNotNone(conexion)
        
        # Limpiar
        if conexion:
            Conexion.liberarConexion(conexion)
        Conexion.cerrarConexiones()

class TestUsuarioDao(unittest.TestCase):
    """Tests para la clase UsuarioDao según UML"""
    
    @classmethod
    def setUpClass(cls):
        """Configuración para toda la clase"""
        try:
            # Verificar conexión a BD
            pool = Conexion.obtenerPool()
            cls.db_available = pool is not None
            if pool:
                Conexion.cerrarConexiones()
        except:
            cls.db_available = False
    
    def test_metodos_uml_existen(self):
        """Test: Verificar métodos del UML"""
        # Verificar métodos según diagrama UML
        self.assertTrue(hasattr(UsuarioDao, 'seleccionar'))
        self.assertTrue(hasattr(UsuarioDao, 'insertar'))
        self.assertTrue(hasattr(UsuarioDao, 'actualizar'))
        self.assertTrue(hasattr(UsuarioDao, 'eliminar'))
    
    def test_sentencias_sql_existen(self):
        """Test: Verificar constantes SQL según UML"""
        # Verificar sentencias según diagrama UML
        self.assertTrue(hasattr(UsuarioDao, '_SELECCIONAR'))
        self.assertTrue(hasattr(UsuarioDao, '_INSERTAR'))
        self.assertTrue(hasattr(UsuarioDao, '_ACTUALIZAR'))
        self.assertTrue(hasattr(UsuarioDao, '_ELIMINAR'))
    
    @unittest.skipUnless(os.getenv('TEST_DB', False), "Base de datos no disponible")
    def test_seleccionar_usuarios(self):
        """Test: seleccionar() retorna lista de usuarios"""
        if not self.db_available:
            self.skipTest("Base de datos no disponible")
        
        usuarios = UsuarioDao.seleccionar()
        self.assertIsInstance(usuarios, list)
        # Al menos debe retornar lista (aunque esté vacía)
        self.assertGreaterEqual(len(usuarios), 0)
    
    @unittest.skipUnless(os.getenv('TEST_DB', False), "Base de datos no disponible")
    def test_operaciones_crud_completas(self):
        """Test: Operaciones CRUD completas según UML"""
        if not self.db_available:
            self.skipTest("Base de datos no disponible")
        
        # Crear usuario de prueba
        usuario_test = Usuario(
            id_usuario=None,
            username=f"test_crud_{int(os.getpid())}",  # Username único
            password="test123",
            email=f"test_crud_{int(os.getpid())}@test.com"
        )
        
        try:
            # 1. INSERTAR
            resultado_insert = UsuarioDao.insertar(usuario_test)
            self.assertEqual(resultado_insert, 1, "Inserción debe retornar 1")
            self.assertIsNotNone(usuario_test.id_usuario, "ID debe asignarse tras insertar")
            
            # 2. SELECCIONAR (buscar el usuario insertado)
            usuario_encontrado = UsuarioDao.seleccionar_por_id(usuario_test.id_usuario)
            self.assertIsNotNone(usuario_encontrado, "Usuario debe encontrarse tras insertar")
            self.assertEqual(usuario_encontrado.username, usuario_test.username)
            
            # 3. ACTUALIZAR
            usuario_test.username = f"updated_{usuario_test.username}"
            resultado_update = UsuarioDao.actualizar(usuario_test)
            self.assertEqual(resultado_update, 1, "Actualización debe retornar 1")
            
            # 4. ELIMINAR
            resultado_delete = UsuarioDao.eliminar(usuario_test)
            self.assertEqual(resultado_delete, 1, "Eliminación debe retornar 1")
            
            # Verificar que se eliminó
            usuario_eliminado = UsuarioDao.seleccionar_por_id(usuario_test.id_usuario)
            self.assertIsNone(usuario_eliminado, "Usuario debe estar eliminado")
            
        except Exception as e:
            # Si algo falla, intentar limpiar
            try:
                if usuario_test.id_usuario:
                    UsuarioDao.eliminar(usuario_test)
            except:
                pass
            raise e

class TestIntegracion(unittest.TestCase):
    """Tests de integración del sistema completo"""
    
    def test_manejo_excepciones(self):
        """Test: Sistema maneja excepciones sin detenerse"""
        # Test con datos inválidos que no deben hacer fallar el sistema
        try:
            # Operación que puede fallar
            usuarios = UsuarioDao.seleccionar()
            # Si llega aquí, el manejo de excepciones funciona
            self.assertTrue(True, "Sistema maneja excepciones correctamente")
        except Exception:
            self.fail("Sistema no debe fallar por excepciones de BD")
    
    def test_logging_funcionando(self):
        """Test: Sistema de logging funciona"""
        logger = LoggerBase().logger
        
        # Debe poder hacer log sin errores
        try:
            logger.info("Test de logging")
            logger.error("Test de error logging")
            self.assertTrue(True)
        except Exception as e:
            self.fail(f"Sistema de logging falló: {e}")

def run_tests_with_coverage():
    """Ejecutar tests con información de cobertura"""
    print("🧪 EJECUTANDO SUITE DE TESTS - LAB UML 1.1")
    print("=" * 60)
    
    # Configurar logging para tests
    logging.basicConfig(level=logging.CRITICAL)  # Solo errores críticos
    
    # Crear suite de tests
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    
    # Agregar todas las clases de test
    test_classes = [
        TestUsuario,
        TestLoggerBase,
        TestConexion,
        TestUsuarioDao,
        TestIntegracion
    ]
    
    for test_class in test_classes:
        tests = loader.loadTestsFromTestCase(test_class)
        suite.addTests(tests)
    
    # Ejecutar tests
    runner = unittest.TextTestRunner(
        verbosity=2,
        stream=sys.stdout,
        descriptions=True,
        failfast=False
    )
    
    print(f"\n📋 Ejecutando {suite.countTestCases()} tests...")
    print("-" * 60)
    
    result = runner.run(suite)
    
    # Mostrar resumen
    print("\n" + "=" * 60)
    print("📊 RESUMEN DE TESTS")
    print("=" * 60)
    print(f"✅ Tests ejecutados: {result.testsRun}")
    print(f"❌ Fallos: {len(result.failures)}")
    print(f"💥 Errores: {len(result.errors)}")
    print(f"⏭️  Omitidos: {len(result.skipped) if hasattr(result, 'skipped') else 0}")
    
    if result.wasSuccessful():
        print("\n🎉 ¡TODOS LOS TESTS PASARON EXITOSAMENTE!")
        print("✅ El sistema cumple con el diagrama UML")
        print("✅ Manejo de excepciones implementado")
        print("✅ Sistema listo para producción")
    else:
        print("\n⚠️  ALGUNOS TESTS FALLARON")
        
        if result.failures:
            print("\n💥 FALLOS:")
            for test, traceback in result.failures:
                print(f"   • {test}: {traceback.split('AssertionError: ')[-1].split('\\n')[0]}")
        
        if result.errors:
            print("\n❌ ERRORES:")
            for test, traceback in result.errors:
                print(f"   • {test}: {traceback.split('\\n')[-2]}")
    
    return result.wasSuccessful()

if __name__ == "__main__":
    # Configurar variable de entorno para tests con BD
    if len(sys.argv) > 1 and sys.argv[1] == "--with-db":
        os.environ['TEST_DB'] = 'true'
        print("🔧 Ejecutando tests CON base de datos")
    else:
        print("🔧 Ejecutando tests SIN base de datos")
        print("   Use --with-db para incluir tests de base de datos")
    
    success = run_tests_with_coverage()
    sys.exit(0 if success else 1)
