"""
Script de Pruebas del DAO
========================

Prueba todas las operaciones CRUD del UsuarioDao
Verifica que el patrón DAO funcione correctamente
"""

import sys
import os

# Agregar src al path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from src.dao.usuario_dao import UsuarioDao
from src.models.usuario import Usuario
from src.utils.logger_base import LoggerBase
from src.database.conexion import Conexion
from colorama import init, Fore, Style

init()

class TestUsuarioDao:
    """Clase para probar el UsuarioDao"""
    
    def __init__(self):
        self.dao = UsuarioDao()
        self.logger = LoggerBase().logger
        self.usuario_prueba = None
    
    def test_seleccionar(self):
        """Prueba el método seleccionar()"""
        print(f"{Fore.YELLOW}🔍 Test 1: Seleccionar usuarios{Style.RESET_ALL}")
        
        try:
            usuarios = self.dao.seleccionar()
            
            if isinstance(usuarios, list):
                print(f"{Fore.GREEN}✅ Seleccionar exitoso: {len(usuarios)} usuarios{Style.RESET_ALL}")
                
                # Mostrar algunos usuarios
                for i, usuario in enumerate(usuarios[:3]):
                    print(f"   {i+1}. {usuario}")
                
                if len(usuarios) > 3:
                    print(f"   ... y {len(usuarios) - 3} más")
                
                return True
            else:
                print(f"{Fore.RED}❌ Error: seleccionar no retornó lista{Style.RESET_ALL}")
                return False
                
        except Exception as e:
            print(f"{Fore.RED}❌ Error en seleccionar: {e}{Style.RESET_ALL}")
            return False
    
    def test_insertar(self):
        """Prueba el método insertar()"""
        print(f"{Fore.YELLOW}➕ Test 2: Insertar usuario{Style.RESET_ALL}")
        
        try:
            # Crear usuario de prueba
            timestamp = str(int(os.times().elapsed * 1000))  # Timestamp para username único
            self.usuario_prueba = Usuario(
                username=f"test_user_{timestamp}",
                password="test_password_123",
                email=f"test_{timestamp}@test.com"
            )
            
            print(f"   Insertando: {self.usuario_prueba.username}")
            
            # Insertar usuario
            resultado = self.dao.insertar(self.usuario_prueba)
            
            if resultado > 0:
                print(f"{Fore.GREEN}✅ Insertar exitoso: ID {self.usuario_prueba.id_usuario}{Style.RESET_ALL}")
                return True
            else:
                print(f"{Fore.RED}❌ Error: insertar retornó {resultado}{Style.RESET_ALL}")
                return False
                
        except Exception as e:
            print(f"{Fore.RED}❌ Error en insertar: {e}{Style.RESET_ALL}")
            return False
    
    def test_seleccionar_por_id(self):
        """Prueba buscar usuario por ID"""
        print(f"{Fore.YELLOW}🔍 Test 3: Seleccionar por ID{Style.RESET_ALL}")
        
        if not self.usuario_prueba or not self.usuario_prueba.id_usuario:
            print(f"{Fore.YELLOW}⚠️  Saltando test: no hay usuario de prueba{Style.RESET_ALL}")
            return True
        
        try:
            usuario_encontrado = self.dao.seleccionar_por_id(self.usuario_prueba.id_usuario)
            
            if usuario_encontrado:
                print(f"{Fore.GREEN}✅ Usuario encontrado: {usuario_encontrado.username}{Style.RESET_ALL}")
                
                # Verificar que los datos coincidan
                if (usuario_encontrado.username == self.usuario_prueba.username and
                    usuario_encontrado.email == self.usuario_prueba.email):
                    print(f"{Fore.GREEN}✅ Datos coinciden correctamente{Style.RESET_ALL}")
                    return True
                else:
                    print(f"{Fore.RED}❌ Los datos no coinciden{Style.RESET_ALL}")
                    return False
            else:
                print(f"{Fore.RED}❌ Usuario no encontrado{Style.RESET_ALL}")
                return False
                
        except Exception as e:
            print(f"{Fore.RED}❌ Error en seleccionar_por_id: {e}{Style.RESET_ALL}")
            return False
    
    def test_actualizar(self):
        """Prueba el método actualizar()"""
        print(f"{Fore.YELLOW}📝 Test 4: Actualizar usuario{Style.RESET_ALL}")
        
        if not self.usuario_prueba or not self.usuario_prueba.id_usuario:
            print(f"{Fore.YELLOW}⚠️  Saltando test: no hay usuario de prueba{Style.RESET_ALL}")
            return True
        
        try:
            # Modificar datos
            nuevo_email = f"updated_{self.usuario_prueba.username}@test.com"
            self.usuario_prueba.email = nuevo_email
            self.usuario_prueba.password = "new_password_456"
            
            print(f"   Actualizando email a: {nuevo_email}")
            
            # Actualizar usuario
            resultado = self.dao.actualizar(self.usuario_prueba)
            
            if resultado > 0:
                print(f"{Fore.GREEN}✅ Actualizar exitoso{Style.RESET_ALL}")
                
                # Verificar actualización
                usuario_verificacion = self.dao.seleccionar_por_id(self.usuario_prueba.id_usuario)
                if usuario_verificacion and usuario_verificacion.email == nuevo_email:
                    print(f"{Fore.GREEN}✅ Actualización verificada en BD{Style.RESET_ALL}")
                    return True
                else:
                    print(f"{Fore.RED}❌ Actualización no se reflejó en BD{Style.RESET_ALL}")
                    return False
            else:
                print(f"{Fore.RED}❌ Error: actualizar retornó {resultado}{Style.RESET_ALL}")
                return False
                
        except Exception as e:
            print(f"{Fore.RED}❌ Error en actualizar: {e}{Style.RESET_ALL}")
            return False
    
    def test_eliminar(self):
        """Prueba el método eliminar()"""
        print(f"{Fore.YELLOW}🗑️  Test 5: Eliminar usuario{Style.RESET_ALL}")
        
        if not self.usuario_prueba or not self.usuario_prueba.id_usuario:
            print(f"{Fore.YELLOW}⚠️  Saltando test: no hay usuario de prueba{Style.RESET_ALL}")
            return True
        
        try:
            print(f"   Eliminando usuario ID: {self.usuario_prueba.id_usuario}")
            
            # Eliminar usuario
            resultado = self.dao.eliminar(self.usuario_prueba)
            
            if resultado > 0:
                print(f"{Fore.GREEN}✅ Eliminar exitoso{Style.RESET_ALL}")
                
                # Verificar eliminación
                usuario_verificacion = self.dao.seleccionar_por_id(self.usuario_prueba.id_usuario)
                if usuario_verificacion is None:
                    print(f"{Fore.GREEN}✅ Eliminación verificada en BD{Style.RESET_ALL}")
                    return True
                else:
                    print(f"{Fore.RED}❌ Usuario aún existe en BD{Style.RESET_ALL}")
                    return False
            else:
                print(f"{Fore.RED}❌ Error: eliminar retornó {resultado}{Style.RESET_ALL}")
                return False
                
        except Exception as e:
            print(f"{Fore.RED}❌ Error en eliminar: {e}{Style.RESET_ALL}")
            return False
    
    def test_validaciones(self):
        """Prueba validaciones del DAO"""
        print(f"{Fore.YELLOW}🛡️  Test 6: Validaciones{Style.RESET_ALL}")
        
        try:
            # Test usuario inválido
            usuario_invalido = Usuario(username="", password="", email="")
            resultado = self.dao.insertar(usuario_invalido)
            
            if resultado == 0:
                print(f"{Fore.GREEN}✅ Validación funcionando: usuario inválido rechazado{Style.RESET_ALL}")
            else:
                print(f"{Fore.RED}❌ Validación falla: usuario inválido aceptado{Style.RESET_ALL}")
                return False
            
            # Test username duplicado (usar uno existente)
            usuarios_existentes = self.dao.seleccionar()
            if usuarios_existentes:
                usuario_duplicado = Usuario(
                    username=usuarios_existentes[0].username,  # Username existente
                    password="test123",
                    email="nuevo@test.com"
                )
                
                resultado = self.dao.insertar(usuario_duplicado)
                if resultado == 0:
                    print(f"{Fore.GREEN}✅ Validación funcionando: username duplicado rechazado{Style.RESET_ALL}")
                else:
                    print(f"{Fore.RED}❌ Validación falla: username duplicado aceptado{Style.RESET_ALL}")
                    return False
            
            return True
            
        except Exception as e:
            print(f"{Fore.RED}❌ Error en validaciones: {e}{Style.RESET_ALL}")
            return False
    
    def ejecutar_todas_las_pruebas(self):
        """Ejecuta todas las pruebas del DAO"""
        print(f"{Fore.CYAN}{'='*60}")
        print(f"    🧪 PRUEBAS DEL USUARIO DAO - LAB UML 1.1")
        print(f"{'='*60}{Style.RESET_ALL}\n")
        
        pruebas = [
            self.test_seleccionar,
            self.test_insertar,
            self.test_seleccionar_por_id,
            self.test_actualizar,
            self.test_eliminar,
            self.test_validaciones
        ]
        
        resultados = []
        
        for i, prueba in enumerate(pruebas, 1):
            try:
                resultado = prueba()
                resultados.append(resultado)
                
                if resultado:
                    print(f"{Fore.GREEN}✅ Test {i} EXITOSO{Style.RESET_ALL}\n")
                else:
                    print(f"{Fore.RED}❌ Test {i} FALLÓ{Style.RESET_ALL}\n")
                    
            except Exception as e:
                print(f"{Fore.RED}💥 Test {i} ERROR: {e}{Style.RESET_ALL}\n")
                resultados.append(False)
        
        # Resumen
        exitosos = sum(resultados)
        total = len(resultados)
        
        print(f"{Fore.CYAN}📊 RESUMEN DE PRUEBAS{Style.RESET_ALL}")
        print("=" * 30)
        print(f"Total de pruebas: {total}")
        print(f"Exitosas: {Fore.GREEN}{exitosos}{Style.RESET_ALL}")
        print(f"Fallidas: {Fore.RED}{total - exitosos}{Style.RESET_ALL}")
        
        if exitosos == total:
            print(f"\n{Fore.GREEN}🎉 ¡TODAS LAS PRUEBAS EXITOSAS!{Style.RESET_ALL}")
            print(f"{Fore.GREEN}✅ El UsuarioDao está funcionando correctamente{Style.RESET_ALL}")
            return True
        else:
            print(f"\n{Fore.RED}⚠️  ALGUNAS PRUEBAS FALLARON{Style.RESET_ALL}")
            print(f"{Fore.YELLOW}💡 Revise los errores anteriores{Style.RESET_ALL}")
            return False

def main():
    """Función principal"""
    try:
        # Verificar conexión primero
        print(f"{Fore.BLUE}🔍 Verificando conexión a base de datos...{Style.RESET_ALL}")
        
        if not Conexion.verificar_conexion():
            print(f"{Fore.RED}❌ No hay conexión a la base de datos{Style.RESET_ALL}")
            print(f"{Fore.YELLOW}💡 Ejecute primero: python scripts/test_connection.py{Style.RESET_ALL}")
            return 1
        
        print(f"{Fore.GREEN}✅ Conexión verificada{Style.RESET_ALL}\n")
        
        # Ejecutar pruebas del DAO
        test_dao = TestUsuarioDao()
        exito = test_dao.ejecutar_todas_las_pruebas()
        
        return 0 if exito else 1
        
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
