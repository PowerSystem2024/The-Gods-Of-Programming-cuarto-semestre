"""
Menú de Aplicación de Usuario
============================

Interfaz de usuario para el sistema de gestión de usuarios
Implementa las 5 opciones según diagrama UML con manejo de excepciones
"""

import sys
from typing import Optional
from colorama import init, Fore, Style

from src.dao.usuario_dao import UsuarioDao
from src.models.usuario import Usuario
from src.utils.logger_base import LoggerBase

# Inicializar colorama para Windows
init(autoreset=True)

class MenuAppUsuario:
    """
    Clase para manejar el menú de la aplicación de usuarios
    
    Responsabilidades según UML:
    - Contiene un menú con 5 opciones
    - 1) Listar usuarios
    - 2) Agregar usuario  
    - 3) Actualizar usuario
    - 4) Eliminar usuario
    - 5) Salir
    """
    
    def __init__(self):
        """Constructor según UML"""
        self.usuario_dao = UsuarioDao()
        self.logger = LoggerBase().logger
        self._running = True
    
    def mostrar_menu(self) -> None:
        """
        Muestra el menú principal con las 5 opciones según UML
        Manejo de excepciones para evitar que se detenga la ejecución
        """
        self.logger.info("🎯 Iniciando menú principal de la aplicación")
        
        while self._running:
            try:
                self._mostrar_opciones()
                opcion = self._obtener_opcion_usuario()
                
                if opcion:
                    self._procesar_opcion(opcion)
                    
            except KeyboardInterrupt:
                self._manejar_interrupcion()
                break
            except Exception as e:
                self._manejar_error_general(e)
    
    def _mostrar_opciones(self) -> None:
        """Muestra las opciones del menú"""
        print(f"\n{Fore.CYAN}{'='*70}")
        print(f"       🎯 SISTEMA DE GESTIÓN DE USUARIOS - LAB UML 1.1")
        print(f"{'='*70}{Style.RESET_ALL}")
        print(f"{Fore.GREEN}📋 Opciones disponibles:")
        print(f"   1️⃣  Listar usuarios")
        print(f"   2️⃣  Agregar usuario")  
        print(f"   3️⃣  Actualizar usuario")
        print(f"   4️⃣  Eliminar usuario")
        print(f"   5️⃣  Salir{Style.RESET_ALL}")
        print(f"{Fore.YELLOW}{'─'*70}{Style.RESET_ALL}")
    
    def _obtener_opcion_usuario(self) -> Optional[str]:
        """
        Obtiene y valida la opción seleccionada por el usuario
        
        Returns:
            Opción válida o None si hay error
        """
        try:
            opcion = input(f"{Fore.YELLOW}🔢 Seleccione una opción (1-5): {Style.RESET_ALL}").strip()
            
            if opcion in ['1', '2', '3', '4', '5']:
                return opcion
            else:
                print(f"{Fore.RED}❌ Opción no válida. Debe ser un número del 1 al 5.{Style.RESET_ALL}")
                return None
                
        except EOFError:
            print(f"\n{Fore.YELLOW}⚠️  Entrada interrumpida{Style.RESET_ALL}")
            return None
        except Exception as e:
            self.logger.error(f"Error obteniendo opción del usuario: {e}")
            print(f"{Fore.RED}❌ Error leyendo opción. Intente nuevamente.{Style.RESET_ALL}")
            return None
    
    def _procesar_opcion(self, opcion: str) -> None:
        """
        Procesa la opción seleccionada por el usuario
        
        Args:
            opcion: Opción válida del menú
        """
        try:
            self.logger.debug(f"Procesando opción: {opcion}")
            
            if opcion == '1':
                self.listar_usuarios()
            elif opcion == '2':
                self.agregar_usuario()
            elif opcion == '3':
                self.actualizar_usuario()
            elif opcion == '4':
                self.eliminar_usuario()
            elif opcion == '5':
                self._salir_aplicacion()
                
        except Exception as e:
            self.logger.error(f"Error procesando opción {opcion}: {e}")
            print(f"{Fore.RED}❌ Error procesando la opción. Intente nuevamente.{Style.RESET_ALL}")
    
    def listar_usuarios(self) -> None:
        """
        Lógica para listar todos los usuarios
        Opción 1 del menú según UML
        """
        try:
            print(f"\n{Fore.CYAN}📋 === LISTA DE USUARIOS ==={Style.RESET_ALL}")
            self.logger.debug("Iniciando listado de usuarios")
            
            usuarios = self.usuario_dao.seleccionar()
            
            if not usuarios:
                print(f"{Fore.YELLOW}⚠️  No hay usuarios registrados en el sistema{Style.RESET_ALL}")
                self.logger.info("No se encontraron usuarios para listar")
                return
            
            # Mostrar tabla de usuarios
            self._mostrar_tabla_usuarios(usuarios)
            
            # Mostrar estadísticas
            total = len(usuarios)
            print(f"\n{Fore.GREEN}📊 Total de usuarios: {total}{Style.RESET_ALL}")
            self.logger.info(f"Listado completado: {total} usuarios mostrados")
            
        except Exception as e:
            self.logger.error(f"Error al listar usuarios: {e}")
            print(f"{Fore.RED}❌ Error al obtener la lista de usuarios: {e}{Style.RESET_ALL}")
    
    def agregar_usuario(self) -> None:
        """
        Lógica para agregar un nuevo usuario
        Opción 2 del menú según UML
        """
        try:
            print(f"\n{Fore.CYAN}➕ === AGREGAR NUEVO USUARIO ==={Style.RESET_ALL}")
            self.logger.debug("Iniciando proceso de agregar usuario")
            
            # Solicitar datos con validación
            datos_usuario = self._solicitar_datos_usuario()
            if not datos_usuario:
                return
            
            # Crear usuario
            usuario = Usuario(
                username=datos_usuario['username'],
                password=datos_usuario['password'], 
                email=datos_usuario['email']
            )
            
            # Insertar en base de datos
            registros_insertados = self.usuario_dao.insertar(usuario)
            
            if registros_insertados > 0:
                print(f"{Fore.GREEN}✅ Usuario '{usuario.username}' agregado exitosamente{Style.RESET_ALL}")
                print(f"{Fore.BLUE}ℹ️  ID asignado: {usuario.id_usuario}{Style.RESET_ALL}")
                self.logger.info(f"Usuario agregado exitosamente: {usuario.username} (ID: {usuario.id_usuario})")
            else:
                print(f"{Fore.RED}❌ No se pudo agregar el usuario. Verifique los datos.{Style.RESET_ALL}")
                self.logger.warning(f"Falló la inserción del usuario: {usuario.username}")
                
        except Exception as e:
            self.logger.error(f"Error al agregar usuario: {e}")
            print(f"{Fore.RED}❌ Error inesperado al agregar usuario: {e}{Style.RESET_ALL}")
    
    def actualizar_usuario(self) -> None:
        """
        Lógica para actualizar un usuario existente
        Opción 3 del menú según UML
        """
        try:
            print(f"\n{Fore.CYAN}📝 === ACTUALIZAR USUARIO ==={Style.RESET_ALL}")
            self.logger.debug("Iniciando proceso de actualizar usuario")
            
            # Mostrar usuarios disponibles
            usuarios = self.usuario_dao.seleccionar()
            if not usuarios:
                print(f"{Fore.YELLOW}⚠️  No hay usuarios para actualizar{Style.RESET_ALL}")
                return
            
            print(f"\n{Fore.BLUE}👥 Usuarios disponibles:{Style.RESET_ALL}")
            self._mostrar_tabla_usuarios(usuarios)
            
            # Seleccionar usuario
            usuario_existente = self._seleccionar_usuario_por_id()
            if not usuario_existente:
                return
            
            print(f"\n{Fore.GREEN}✅ Usuario seleccionado: {usuario_existente}{Style.RESET_ALL}")
            print(f"{Fore.YELLOW}💡 Presione Enter para mantener el valor actual{Style.RESET_ALL}")
            
            # Solicitar nuevos datos
            nuevos_datos = self._solicitar_datos_actualizacion(usuario_existente)
            if not nuevos_datos:
                return
            
            # Crear usuario actualizado
            usuario_actualizado = Usuario(
                id_usuario=usuario_existente.id_usuario,
                username=nuevos_datos['username'],
                password=nuevos_datos['password'],
                email=nuevos_datos['email']
            )
            
            # Actualizar en base de datos
            registros_actualizados = self.usuario_dao.actualizar(usuario_actualizado)
            
            if registros_actualizados > 0:
                print(f"{Fore.GREEN}✅ Usuario actualizado exitosamente{Style.RESET_ALL}")
                self.logger.info(f"Usuario actualizado: ID {usuario_actualizado.id_usuario}")
            else:
                print(f"{Fore.RED}❌ No se pudo actualizar el usuario{Style.RESET_ALL}")
                self.logger.warning(f"Falló la actualización del usuario ID: {usuario_actualizado.id_usuario}")
                
        except Exception as e:
            self.logger.error(f"Error al actualizar usuario: {e}")
            print(f"{Fore.RED}❌ Error inesperado al actualizar usuario: {e}{Style.RESET_ALL}")
    
    def eliminar_usuario(self) -> None:
        """
        Lógica para eliminar un usuario
        Opción 4 del menú según UML
        """
        try:
            print(f"\n{Fore.CYAN}🗑️  === ELIMINAR USUARIO ==={Style.RESET_ALL}")
            self.logger.debug("Iniciando proceso de eliminar usuario")
            
            # Mostrar usuarios disponibles
            usuarios = self.usuario_dao.seleccionar()
            if not usuarios:
                print(f"{Fore.YELLOW}⚠️  No hay usuarios para eliminar{Style.RESET_ALL}")
                return
            
            print(f"\n{Fore.BLUE}👥 Usuarios disponibles:{Style.RESET_ALL}")
            self._mostrar_tabla_usuarios(usuarios)
            
            # Seleccionar usuario
            usuario_a_eliminar = self._seleccionar_usuario_por_id()
            if not usuario_a_eliminar:
                return
            
            # Confirmación de eliminación
            if not self._confirmar_eliminacion(usuario_a_eliminar):
                print(f"{Fore.YELLOW}⚠️  Eliminación cancelada{Style.RESET_ALL}")
                return
            
            # Eliminar de base de datos
            registros_eliminados = self.usuario_dao.eliminar(usuario_a_eliminar)
            
            if registros_eliminados > 0:
                print(f"{Fore.GREEN}✅ Usuario eliminado exitosamente{Style.RESET_ALL}")
                self.logger.info(f"Usuario eliminado: {usuario_a_eliminar.username} (ID: {usuario_a_eliminar.id_usuario})")
            else:
                print(f"{Fore.RED}❌ No se pudo eliminar el usuario{Style.RESET_ALL}")
                self.logger.warning(f"Falló la eliminación del usuario ID: {usuario_a_eliminar.id_usuario}")
                
        except Exception as e:
            self.logger.error(f"Error al eliminar usuario: {e}")
            print(f"{Fore.RED}❌ Error inesperado al eliminar usuario: {e}{Style.RESET_ALL}")
    
    def _salir_aplicacion(self) -> None:
        """Maneja la salida de la aplicación (Opción 5)"""
        print(f"{Fore.GREEN}👋 ¡Gracias por usar el Sistema de Gestión de Usuarios!{Style.RESET_ALL}")
        print(f"{Fore.BLUE}📊 Desarrollado según diagrama UML - Lab 1.1{Style.RESET_ALL}")
        self.logger.info("Usuario salió de la aplicación normalmente")
        self._running = False
    
    # === MÉTODOS AUXILIARES ===
    
    def _mostrar_tabla_usuarios(self, usuarios: list) -> None:
        """Muestra usuarios en formato tabla"""
        print(f"\n{Fore.GREEN}{'ID':<5} {'USERNAME':<20} {'EMAIL':<35}{Style.RESET_ALL}")
        print(f"{Fore.GREEN}{'─'*5} {'─'*20} {'─'*35}{Style.RESET_ALL}")
        
        for usuario in usuarios:
            print(f"{usuario.id_usuario:<5} {usuario.username:<20} {usuario.email:<35}")
    
    def _solicitar_datos_usuario(self) -> Optional[dict]:
        """Solicita y valida datos para nuevo usuario"""
        try:
            username = input(f"{Fore.YELLOW}👤 Nombre de usuario: {Style.RESET_ALL}").strip()
            if not username:
                print(f"{Fore.RED}❌ El nombre de usuario es obligatorio{Style.RESET_ALL}")
                return None
            
            password = input(f"{Fore.YELLOW}🔒 Contraseña: {Style.RESET_ALL}").strip()
            if not password:
                print(f"{Fore.RED}❌ La contraseña es obligatoria{Style.RESET_ALL}")
                return None
            
            email = input(f"{Fore.YELLOW}📧 Email: {Style.RESET_ALL}").strip()
            if not email or '@' not in email:
                print(f"{Fore.RED}❌ Debe ingresar un email válido{Style.RESET_ALL}")
                return None
            
            return {
                'username': username,
                'password': password,
                'email': email
            }
            
        except Exception as e:
            self.logger.error(f"Error solicitando datos de usuario: {e}")
            return None
    
    def _seleccionar_usuario_por_id(self) -> Optional[Usuario]:
        """Selecciona un usuario por su ID"""
        try:
            id_str = input(f"\n{Fore.YELLOW}🔢 Ingrese el ID del usuario: {Style.RESET_ALL}").strip()
            
            if not id_str.isdigit():
                print(f"{Fore.RED}❌ El ID debe ser un número{Style.RESET_ALL}")
                return None
            
            id_usuario = int(id_str)
            usuario = self.usuario_dao.seleccionar_por_id(id_usuario)
            
            if not usuario:
                print(f"{Fore.RED}❌ No se encontró usuario con ID: {id_usuario}{Style.RESET_ALL}")
                return None
            
            return usuario
            
        except ValueError:
            print(f"{Fore.RED}❌ ID inválido{Style.RESET_ALL}")
            return None
        except Exception as e:
            self.logger.error(f"Error seleccionando usuario por ID: {e}")
            return None
    
    def _solicitar_datos_actualizacion(self, usuario_actual: Usuario) -> Optional[dict]:
        """Solicita datos para actualización de usuario"""
        try:
            print(f"\n{Fore.BLUE}📝 Datos actuales:{Style.RESET_ALL}")
            print(f"   Username: {usuario_actual.username}")
            print(f"   Email: {usuario_actual.email}")
            
            nuevo_username = input(f"\n{Fore.YELLOW}👤 Nuevo username [{usuario_actual.username}]: {Style.RESET_ALL}").strip()
            nueva_password = input(f"{Fore.YELLOW}🔒 Nueva contraseña: {Style.RESET_ALL}").strip()
            nuevo_email = input(f"{Fore.YELLOW}📧 Nuevo email [{usuario_actual.email}]: {Style.RESET_ALL}").strip()
            
            # Usar valores existentes si no se proporciona nuevo valor
            username_final = nuevo_username if nuevo_username else usuario_actual.username
            password_final = nueva_password if nueva_password else usuario_actual.password
            email_final = nuevo_email if nuevo_email else usuario_actual.email
            
            # Validar email si se cambió
            if nuevo_email and '@' not in email_final:
                print(f"{Fore.RED}❌ Email inválido{Style.RESET_ALL}")
                return None
            
            return {
                'username': username_final,
                'password': password_final,
                'email': email_final
            }
            
        except Exception as e:
            self.logger.error(f"Error solicitando datos de actualización: {e}")
            return None
    
    def _confirmar_eliminacion(self, usuario: Usuario) -> bool:
        """Confirma la eliminación de un usuario"""
        try:
            print(f"\n{Fore.RED}⚠️  CONFIRMACIÓN DE ELIMINACIÓN{Style.RESET_ALL}")
            print(f"{Fore.YELLOW}Usuario a eliminar: {usuario}{Style.RESET_ALL}")
            
            confirmacion = input(f"{Fore.RED}¿Está seguro de eliminar este usuario? (s/N): {Style.RESET_ALL}").strip().lower()
            
            return confirmacion in ['s', 'si', 'sí', 'yes', 'y']
            
        except Exception as e:
            self.logger.error(f"Error en confirmación de eliminación: {e}")
            return False
    
    def _manejar_interrupcion(self) -> None:
        """Maneja la interrupción por Ctrl+C"""
        print(f"\n{Fore.YELLOW}⚠️  Operación interrumpida por el usuario (Ctrl+C){Style.RESET_ALL}")
        print(f"{Fore.BLUE}👋 Cerrando aplicación...{Style.RESET_ALL}")
        self.logger.info("Aplicación interrumpida por el usuario (Ctrl+C)")
        self._running = False
    
    def _manejar_error_general(self, error: Exception) -> None:
        """Maneja errores generales del menú"""
        self.logger.error(f"Error inesperado en menú principal: {error}", exc_info=True)
        print(f"{Fore.RED}❌ Error inesperado: {error}{Style.RESET_ALL}")
        print(f"{Fore.YELLOW}💡 La aplicación continuará ejecutándose...{Style.RESET_ALL}")
        
        # Opción para continuar o salir
        try:
            continuar = input(f"{Fore.YELLOW}¿Desea continuar? (S/n): {Style.RESET_ALL}").strip().lower()
            if continuar in ['n', 'no']:
                self._running = False
        except:
            self._running = False
