"""
Tests de integración para UsuarioDao
===================================

Tests que validan las operaciones CRUD según diagrama UML
"""

import unittest
import sys
import os
import time

# Agregar src al path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

from src.models.usuario import Usuario
from src.dao.usuario_dao import UsuarioDao
from src.database.conexion import Conexion

class TestUsuarioDao(unittest.TestCase):
    """Tests de integración para UsuarioDao"""
    
    @classmethod
    def setUpClass(cls):
        """Configuración inicial para toda la clase"""
        try:
            # Verificar conexión
            pool = Conexion.obtenerPool()
            cls.db_disponible = pool is not None
            if pool:
                Conexion.cerrarConexiones()
        except Exception as e:
            cls.db_disponible = False
            print(f"⚠️  Base de datos no disponible: {e}")
    
    def setUp(self):
        """Configuración para cada test"""
        self.usuarios_test = []  # Para limpiar después
    
    def tearDown(self):
        """Limpieza después de cada test"""
        # Limpiar usuarios de prueba creados
        for usuario in self.usuarios_test:
            try:
                if usuario.id_usuario:
                    UsuarioDao.eliminar(usuario)
            except:
                pass  # Ignorar errores de limpieza
    
    @unittest.skipUnless(os.getenv('TEST_DB', False), "Requiere base de datos")
    def test_seleccionar_todos_usuarios(self):
        """Test: seleccionar() retorna lista según UML"""
        if not self.db_disponible:
            self.skipTest("Base de datos no disponible")
        
        usuarios = UsuarioDao.seleccionar()
        
        # Debe retornar lista
        self.assertIsInstance(usuarios, list)
        
        # Todos los elementos deben ser Usuario
        for usuario in usuarios:
            self.assertIsInstance(usuario, Usuario)
            self.assertIsNotNone(usuario.id_usuario)
            self.assertIsNotNone(usuario.username)
            self.assertIsNotNone(usuario.email)
    
    @unittest.skipUnless(os.getenv('TEST_DB', False), "Requiere base de datos")
    def test_insertar_usuario_valido(self):
        """Test: insertar() según UML retorna 1 en éxito"""
        if not self.db_disponible:
            self.skipTest("Base de datos no disponible")
        
        # Crear usuario único
        timestamp = str(int(time.time() * 1000000))  # Microsegundos para unicidad
        usuario = Usuario(
            id_usuario=None,
            username=f"test_insert_{timestamp}",
            password="test123",
            email=f"test_insert_{timestamp}@test.com"
        )
        self.usuarios_test.append(usuario)
        
        # Ejecutar inserción
        resultado = UsuarioDao.insertar(usuario)
        
        # Verificar resultado según UML
        self.assertEqual(resultado, 1, "insertar() debe retornar 1 en éxito")
        self.assertIsNotNone(usuario.id_usuario, "ID debe asignarse tras insertar")
        self.assertIsInstance(usuario.id_usuario, int)
    
    @unittest.skipUnless(os.getenv('TEST_DB', False), "Requiere base de datos")
    def test_insertar_usuario_duplicado(self):
        """Test: insertar() maneja duplicados sin fallar"""
        if not self.db_disponible:
            self.skipTest("Base de datos no disponible")
        
        timestamp = str(int(time.time() * 1000000))
        usuario1 = Usuario(
            id_usuario=None,
            username=f"test_dup_{timestamp}",
            password="test123",
            email=f"test_dup_{timestamp}@test.com"
        )
        usuario2 = Usuario(
            id_usuario=None,
            username=f"test_dup_{timestamp}",  # Mismo username
            password="test456",
            email=f"test_dup_2_{timestamp}@test.com"
        )
        self.usuarios_test.extend([usuario1, usuario2])
        
        # Insertar primero
        resultado1 = UsuarioDao.insertar(usuario1)
        self.assertEqual(resultado1, 1)
        
        # Insertar duplicado debe retornar 0 (no fallar)
        resultado2 = UsuarioDao.insertar(usuario2)
        self.assertEqual(resultado2, 0, "Duplicado debe retornar 0, no fallar")
    
    @unittest.skipUnless(os.getenv('TEST_DB', False), "Requiere base de datos")
    def test_actualizar_usuario_existente(self):
        """Test: actualizar() según UML retorna 1 en éxito"""
        if not self.db_disponible:
            self.skipTest("Base de datos no disponible")
        
        # Crear y insertar usuario
        timestamp = str(int(time.time() * 1000000))
        usuario = Usuario(
            id_usuario=None,
            username=f"test_update_{timestamp}",
            password="original123",
            email=f"test_update_{timestamp}@test.com"
        )
        self.usuarios_test.append(usuario)
        
        UsuarioDao.insertar(usuario)
        self.assertIsNotNone(usuario.id_usuario)
        
        # Actualizar datos
        usuario.username = f"updated_{timestamp}"
        usuario.password = "nueva_password"
        usuario.email = f"updated_{timestamp}@test.com"
        
        # Ejecutar actualización
        resultado = UsuarioDao.actualizar(usuario)
        
        # Verificar resultado según UML
        self.assertEqual(resultado, 1, "actualizar() debe retornar 1 en éxito")
        
        # Verificar que se actualizó
        usuario_actualizado = UsuarioDao.seleccionar_por_id(usuario.id_usuario)
        self.assertEqual(usuario_actualizado.username, f"updated_{timestamp}")
        self.assertEqual(usuario_actualizado.email, f"updated_{timestamp}@test.com")
    
    @unittest.skipUnless(os.getenv('TEST_DB', False), "Requiere base de datos")
    def test_eliminar_usuario_existente(self):
        """Test: eliminar() según UML retorna 1 en éxito"""
        if not self.db_disponible:
            self.skipTest("Base de datos no disponible")
        
        # Crear y insertar usuario
        timestamp = str(int(time.time() * 1000000))
        usuario = Usuario(
            id_usuario=None,
            username=f"test_delete_{timestamp}",
            password="delete123",
            email=f"test_delete_{timestamp}@test.com"
        )
        
        UsuarioDao.insertar(usuario)
        self.assertIsNotNone(usuario.id_usuario)
        
        # Eliminar usuario
        resultado = UsuarioDao.eliminar(usuario)
        
        # Verificar resultado según UML
        self.assertEqual(resultado, 1, "eliminar() debe retornar 1 en éxito")
        
        # Verificar que se eliminó
        usuario_eliminado = UsuarioDao.seleccionar_por_id(usuario.id_usuario)
        self.assertIsNone(usuario_eliminado, "Usuario debe estar eliminado")
    
    @unittest.skipUnless(os.getenv('TEST_DB', False), "Requiere base de datos")
    def test_eliminar_usuario_inexistente(self):
        """Test: eliminar() con usuario inexistente retorna 0"""
        if not self.db_disponible:
            self.skipTest("Base de datos no disponible")
        
        # Usuario con ID que no existe
        usuario_falso = Usuario(
            id_usuario=99999,
            username="no_existe",
            password="password",
            email="no_existe@test.com"
        )
        
        resultado = UsuarioDao.eliminar(usuario_falso)
        self.assertEqual(resultado, 0, "Eliminar inexistente debe retornar 0")
    
    @unittest.skipUnless(os.getenv('TEST_DB', False), "Requiere base de datos")
    def test_seleccionar_por_id_existente(self):
        """Test: seleccionar_por_id() encuentra usuario"""
        if not self.db_disponible:
            self.skipTest("Base de datos no disponible")
        
        # Crear usuario
        timestamp = str(int(time.time() * 1000000))
        usuario = Usuario(
            id_usuario=None,
            username=f"test_select_id_{timestamp}",
            password="select123",
            email=f"test_select_id_{timestamp}@test.com"
        )
        self.usuarios_test.append(usuario)
        
        UsuarioDao.insertar(usuario)
        
        # Buscar por ID
        encontrado = UsuarioDao.seleccionar_por_id(usuario.id_usuario)
        
        self.assertIsNotNone(encontrado)
        self.assertEqual(encontrado.id_usuario, usuario.id_usuario)
        self.assertEqual(encontrado.username, usuario.username)
        self.assertEqual(encontrado.email, usuario.email)
    
    @unittest.skipUnless(os.getenv('TEST_DB', False), "Requiere base de datos")
    def test_seleccionar_por_id_inexistente(self):
        """Test: seleccionar_por_id() con ID inexistente retorna None"""
        if not self.db_disponible:
            self.skipTest("Base de datos no disponible")
        
        usuario = UsuarioDao.seleccionar_por_id(99999)
        self.assertIsNone(usuario, "ID inexistente debe retornar None")
    
    @unittest.skipUnless(os.getenv('TEST_DB', False), "Requiere base de datos")
    def test_contar_usuarios(self):
        """Test: contar_usuarios() retorna número correcto"""
        if not self.db_disponible:
            self.skipTest("Base de datos no disponible")
        
        count_inicial = UsuarioDao.contar_usuarios()
        self.assertIsInstance(count_inicial, int)
        self.assertGreaterEqual(count_inicial, 0)
        
        # Agregar usuario y verificar incremento
        timestamp = str(int(time.time() * 1000000))
        usuario = Usuario(
            id_usuario=None,
            username=f"test_count_{timestamp}",
            password="count123",
            email=f"test_count_{timestamp}@test.com"
        )
        self.usuarios_test.append(usuario)
        
        UsuarioDao.insertar(usuario)
        count_despues = UsuarioDao.contar_usuarios()
        
        self.assertEqual(count_despues, count_inicial + 1)
    
    def test_manejo_excepciones_sin_bd(self):
        """Test: Métodos manejan ausencia de BD sin fallar"""
        # Simular que no hay BD disponible - los métodos deben retornar valores por defecto
        
        # seleccionar() debe retornar lista vacía
        usuarios = UsuarioDao.seleccionar()
        self.assertIsInstance(usuarios, list)
        
        # insertar() debe retornar 0
        usuario_fake = Usuario(None, "fake", "fake", "fake@fake.com")
        resultado = UsuarioDao.insertar(usuario_fake)
        self.assertEqual(resultado, 0)
        
        # contar_usuarios() debe retornar 0
        count = UsuarioDao.contar_usuarios()
        self.assertEqual(count, 0)

if __name__ == "__main__":
    print("🧪 TESTS DE INTEGRACIÓN - USUARIO DAO")
    print("=" * 45)
    print("⚠️  Requiere base de datos PostgreSQL configurada")
    print("Use: python -m pytest tests/test_dao.py --with-db")
    print()
    
    # Configurar para tests con BD si se pasa parámetro
    if len(sys.argv) > 1 and "--with-db" in sys.argv:
        os.environ['TEST_DB'] = 'true'
        print("🔧 Ejecutando tests CON base de datos")
    else:
        print("🔧 Ejecutando tests SIN base de datos")
    
    unittest.main(verbosity=2, argv=[sys.argv[0]])
