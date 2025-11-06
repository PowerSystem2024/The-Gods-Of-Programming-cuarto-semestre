"""
Tests unitarios para la clase Usuario
====================================

Tests específicos para validar la clase Usuario según diagrama UML
"""

import unittest
import sys
import os

# Agregar src al path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

from src.models.usuario import Usuario

class TestUsuarioUnitario(unittest.TestCase):
    """Tests unitarios detallados para Usuario"""
    
    def test_constructor_completo(self):
        """Test: Constructor con todos los parámetros"""
        usuario = Usuario(
            id_usuario=1,
            username="admin", 
            password="admin123",
            email="admin@test.com"
        )
        
        self.assertEqual(usuario.id_usuario, 1)
        self.assertEqual(usuario.username, "admin")
        self.assertEqual(usuario.password, "admin123") 
        self.assertEqual(usuario.email, "admin@test.com")
    
    def test_constructor_sin_id(self):
        """Test: Constructor sin ID (para nuevos usuarios)"""
        usuario = Usuario(
            id_usuario=None,
            username="nuevo_user",
            password="pass123", 
            email="nuevo@test.com"
        )
        
        self.assertIsNone(usuario.id_usuario)
        self.assertEqual(usuario.username, "nuevo_user")
    
    def test_propiedades_getters(self):
        """Test: Funcionamiento de getters (propiedades)"""
        usuario = Usuario(10, "test", "password", "test@email.com")
        
        # Verificar que las propiedades funcionan como getters
        self.assertEqual(usuario.id_usuario, 10)
        self.assertEqual(usuario.username, "test")
        self.assertEqual(usuario.password, "password")
        self.assertEqual(usuario.email, "test@email.com")
    
    def test_propiedades_setters(self):
        """Test: Funcionamiento de setters (propiedades)"""
        usuario = Usuario(1, "original", "original_pass", "original@test.com")
        
        # Modificar usando setters
        usuario.id_usuario = 999
        usuario.username = "modificado"
        usuario.password = "nueva_password"
        usuario.email = "nuevo@email.com"
        
        # Verificar cambios
        self.assertEqual(usuario.id_usuario, 999)
        self.assertEqual(usuario.username, "modificado")
        self.assertEqual(usuario.password, "nueva_password")
        self.assertEqual(usuario.email, "nuevo@email.com")
    
    def test_validacion_datos_validos(self):
        """Test: Validación con datos correctos"""
        usuarios_validos = [
            Usuario(1, "admin", "admin123", "admin@test.com"),
            Usuario(None, "user1", "password", "user1@example.org"),
            Usuario(100, "test_user", "p@ssw0rd", "test.user@domain.co.uk")
        ]
        
        for usuario in usuarios_validos:
            with self.subTest(usuario=usuario.username):
                self.assertTrue(usuario.is_valid(), 
                               f"Usuario {usuario.username} debería ser válido")
    
    def test_validacion_username_invalido(self):
        """Test: Validación con username inválido"""
        casos_invalidos = [
            Usuario(1, "", "password", "test@test.com"),     # Username vacío
            Usuario(1, None, "password", "test@test.com"),   # Username None
            Usuario(1, "   ", "password", "test@test.com"),  # Username solo espacios
        ]
        
        for usuario in casos_invalidos:
            with self.subTest(username=usuario.username):
                self.assertFalse(usuario.is_valid(),
                                f"Username '{usuario.username}' debería ser inválido")
    
    def test_validacion_password_invalido(self):
        """Test: Validación con password inválido"""
        casos_invalidos = [
            Usuario(1, "user", "", "test@test.com"),      # Password vacío
            Usuario(1, "user", None, "test@test.com"),    # Password None
            Usuario(1, "user", "   ", "test@test.com"),   # Password solo espacios
        ]
        
        for usuario in casos_invalidos:
            with self.subTest(password=usuario.password):
                self.assertFalse(usuario.is_valid(),
                                f"Password '{usuario.password}' debería ser inválido")
    
    def test_validacion_email_invalido(self):
        """Test: Validación con email inválido"""
        casos_invalidos = [
            Usuario(1, "user", "pass", ""),           # Email vacío
            Usuario(1, "user", "pass", None),         # Email None
            Usuario(1, "user", "pass", "   "),        # Email solo espacios
        ]
        
        for usuario in casos_invalidos:
            with self.subTest(email=usuario.email):
                self.assertFalse(usuario.is_valid(),
                                f"Email '{usuario.email}' debería ser inválido")
    
    def test_representacion_string(self):
        """Test: Método __str__ funciona correctamente"""
        usuario = Usuario(5, "test_user", "password123", "test@example.com")
        str_usuario = str(usuario)
        
        # Verificar que contiene información importante
        self.assertIn("test_user", str_usuario)
        self.assertIn("test@example.com", str_usuario)
        self.assertIn("5", str_usuario)
    
    def test_representacion_repr(self):
        """Test: Método __repr__ funciona correctamente"""
        usuario = Usuario(3, "admin", "secret", "admin@company.com")
        repr_usuario = repr(usuario)
        
        # __repr__ debe permitir recrear el objeto
        self.assertIn("Usuario", repr_usuario)
        self.assertIn("admin", repr_usuario)
    
    def test_igualdad_usuarios(self):
        """Test: Comparación de usuarios por ID"""
        usuario1 = Usuario(1, "user1", "pass1", "user1@test.com")
        usuario2 = Usuario(1, "user2", "pass2", "user2@test.com")  # Mismo ID
        usuario3 = Usuario(2, "user1", "pass1", "user1@test.com")  # Diferente ID
        
        # Usuarios con mismo ID deben ser iguales
        self.assertEqual(usuario1, usuario2)
        
        # Usuarios con diferente ID deben ser diferentes
        self.assertNotEqual(usuario1, usuario3)
    
    def test_casos_limite(self):
        """Test: Casos límite y edge cases"""
        # Username muy largo
        username_largo = "a" * 100
        usuario_largo = Usuario(1, username_largo, "pass", "test@test.com")
        
        # Email muy largo
        email_largo = "test@" + "a" * 100 + ".com"
        usuario_email_largo = Usuario(2, "user", "pass", email_largo)
        
        # Verificar que se crean sin errores
        self.assertEqual(usuario_largo.username, username_largo)
        self.assertEqual(usuario_email_largo.email, email_largo)

if __name__ == "__main__":
    print("🧪 TESTS UNITARIOS - CLASE USUARIO")
    print("=" * 40)
    
    unittest.main(verbosity=2)
