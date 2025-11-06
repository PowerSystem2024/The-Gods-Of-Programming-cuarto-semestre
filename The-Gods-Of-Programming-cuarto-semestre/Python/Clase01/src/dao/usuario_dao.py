"""
Data Access Object para Usuario
==============================

Implementa el patrón DAO para operaciones CRUD según diagrama UML
Manejo robusto de excepciones para evitar detener la ejecución
"""

from typing import List, Optional
from src.database.cursor_del_pool import CursorDelPool
from src.models.usuario import Usuario
from src.utils.logger_base import LoggerBase

class UsuarioDao:
    """
    Clase DAO (Data Access Object) para operaciones CRUD de usuarios
    
    Implementa las sentencias SQL y métodos según diagrama UML:
    - SELECCIONAR, INSERTAR, ACTUALIZAR, ELIMINAR
    - seleccionar(), insertar(), actualizar(), eliminar()
    """
    
    # === SENTENCIAS SQL SEGÚN UML ===
    _SELECCIONAR: str = """
        SELECT id_usuario, username, password, email 
        FROM usuario 
        ORDER BY id_usuario
    """
    
    _SELECCIONAR_POR_ID: str = """
        SELECT id_usuario, username, password, email 
        FROM usuario 
        WHERE id_usuario = %s
    """
    
    _INSERTAR: str = """
        INSERT INTO usuario(username, password, email) 
        VALUES(%s, %s, %s)
        RETURNING id_usuario
    """
    
    _ACTUALIZAR: str = """
        UPDATE usuario 
        SET username=%s, password=%s, email=%s 
        WHERE id_usuario=%s
    """
    
    _ELIMINAR: str = """
        DELETE FROM usuario 
        WHERE id_usuario=%s
    """
    
    _VERIFICAR_USERNAME: str = """
        SELECT COUNT(*) 
        FROM usuario 
        WHERE username = %s AND id_usuario != COALESCE(%s, -1)
    """
    
    @classmethod
    def seleccionar(cls) -> List[Usuario]:
        """
        Selecciona todos los usuarios de la base de datos
        Método según UML: +seleccionar(): List<Usuario>
        
        Returns:
            Lista de usuarios o lista vacía si hay error
        """
        usuarios = []
        try:
            logger = LoggerBase().logger
            logger.debug('🔍 Iniciando selección de todos los usuarios...')
            
            with CursorDelPool() as cursor:
                if cursor is None:
                    logger.error('❌ No se pudo obtener cursor para seleccionar usuarios')
                    return usuarios
                
                cursor.execute(cls._SELECCIONAR)
                registros = cursor.fetchall()
                
                for registro in registros:
                    try:
                        usuario = Usuario(
                            id_usuario=registro[0],
                            username=registro[1], 
                            password=registro[2],
                            email=registro[3]
                        )
                        usuarios.append(usuario)
                    except Exception as e:
                        logger.error(f'❌ Error creando usuario desde registro {registro}: {e}')
                        continue  # Continuar con los demás registros
                
                logger.info(f'✅ Usuarios seleccionados: {len(usuarios)}')
                
        except Exception as e:
            logger.error(f'❌ Error al seleccionar usuarios: {e}')
            # Retornar lista vacía en lugar de fallar
            
        return usuarios
    
    @classmethod
    def seleccionar_por_id(cls, id_usuario: int) -> Optional[Usuario]:
        """
        Selecciona un usuario por su ID
        
        Args:
            id_usuario: ID del usuario a buscar
            
        Returns:
            Usuario encontrado o None si no existe o hay error
        """
        try:
            logger = LoggerBase().logger
            logger.debug(f'🔍 Buscando usuario con ID: {id_usuario}')
            
            with CursorDelPool() as cursor:
                if cursor is None:
                    logger.error('❌ No se pudo obtener cursor para buscar usuario')
                    return None
                
                cursor.execute(cls._SELECCIONAR_POR_ID, (id_usuario,))
                registro = cursor.fetchone()
                
                if registro:
                    usuario = Usuario(
                        id_usuario=registro[0],
                        username=registro[1],
                        password=registro[2], 
                        email=registro[3]
                    )
                    logger.info(f'✅ Usuario encontrado: {usuario.username}')
                    return usuario
                else:
                    logger.info(f'⚠️  Usuario con ID {id_usuario} no encontrado')
                    return None
                    
        except Exception as e:
            logger.error(f'❌ Error al buscar usuario por ID {id_usuario}: {e}')
            return None
    
    @classmethod
    def insertar(cls, usuario: Usuario) -> int:
        """
        Inserta un nuevo usuario en la base de datos
        Método según UML: +insertar(usuario): int
        
        Args:
            usuario: Usuario a insertar
            
        Returns:
            Número de registros insertados (1 si éxito, 0 si error)
        """
        try:
            logger = LoggerBase().logger
            logger.debug(f'📝 Insertando usuario: {usuario.username}')
            
            # Validar datos del usuario
            if not usuario.is_valid():
                logger.error('❌ Usuario no válido para insertar')
                return 0
            
            # Verificar que el username no exista
            if cls._verificar_username_existe(usuario.username):
                logger.error(f'❌ El username "{usuario.username}" ya existe')
                return 0
            
            with CursorDelPool() as cursor:
                if cursor is None:
                    logger.error('❌ No se pudo obtener cursor para insertar usuario')
                    return 0
                
                valores = (usuario.username, usuario.password, usuario.email)
                cursor.execute(cls._INSERTAR, valores)
                
                # Obtener el ID del usuario insertado
                id_insertado = cursor.fetchone()[0]
                usuario.id_usuario = id_insertado
                
                logger.info(f'✅ Usuario insertado exitosamente con ID: {id_insertado}')
                return 1
                
        except Exception as e:
            logger.error(f'❌ Error al insertar usuario {usuario.username}: {e}')
            return 0
    
    @classmethod
    def actualizar(cls, usuario: Usuario) -> int:
        """
        Actualiza un usuario existente en la base de datos
        Método según UML: +actualizar(usuario): int
        
        Args:
            usuario: Usuario con datos actualizados
            
        Returns:
            Número de registros actualizados (1 si éxito, 0 si error)
        """
        try:
            logger = LoggerBase().logger
            logger.debug(f'📝 Actualizando usuario ID: {usuario.id_usuario}')
            
            # Validar datos del usuario
            if not usuario.is_valid() or usuario.id_usuario is None:
                logger.error('❌ Usuario no válido para actualizar')
                return 0
            
            # Verificar que el username no esté en uso por otro usuario
            if cls._verificar_username_existe(usuario.username, usuario.id_usuario):
                logger.error(f'❌ El username "{usuario.username}" ya está en uso')
                return 0
            
            with CursorDelPool() as cursor:
                if cursor is None:
                    logger.error('❌ No se pudo obtener cursor para actualizar usuario')
                    return 0
                
                valores = (usuario.username, usuario.password, usuario.email, usuario.id_usuario)
                cursor.execute(cls._ACTUALIZAR, valores)
                
                registros_afectados = cursor.rowcount
                if registros_afectados > 0:
                    logger.info(f'✅ Usuario actualizado exitosamente: {usuario.username}')
                else:
                    logger.warning(f'⚠️  No se actualizó ningún registro para ID: {usuario.id_usuario}')
                
                return registros_afectados
                
        except Exception as e:
            logger.error(f'❌ Error al actualizar usuario ID {usuario.id_usuario}: {e}')
            return 0
    
    @classmethod
    def eliminar(cls, usuario: Usuario) -> int:
        """
        Elimina un usuario de la base de datos
        Método según UML: +eliminar(usuario): int
        
        Args:
            usuario: Usuario a eliminar
            
        Returns:
            Número de registros eliminados (1 si éxito, 0 si error)
        """
        try:
            logger = LoggerBase().logger
            logger.debug(f'🗑️  Eliminando usuario ID: {usuario.id_usuario}')
            
            if usuario.id_usuario is None:
                logger.error('❌ No se puede eliminar usuario sin ID')
                return 0
            
            with CursorDelPool() as cursor:
                if cursor is None:
                    logger.error('❌ No se pudo obtener cursor para eliminar usuario')
                    return 0
                
                cursor.execute(cls._ELIMINAR, (usuario.id_usuario,))
                
                registros_afectados = cursor.rowcount
                if registros_afectados > 0:
                    logger.info(f'✅ Usuario eliminado exitosamente: {usuario.username}')
                else:
                    logger.warning(f'⚠️  No se eliminó ningún registro para ID: {usuario.id_usuario}')
                
                return registros_afectados
                
        except Exception as e:
            logger.error(f'❌ Error al eliminar usuario ID {usuario.id_usuario}: {e}')
            return 0
    
    @classmethod
    def _verificar_username_existe(cls, username: str, excluir_id: Optional[int] = None) -> bool:
        """
        Verifica si un username ya existe en la base de datos
        
        Args:
            username: Username a verificar
            excluir_id: ID a excluir de la verificación (para actualizaciones)
            
        Returns:
            bool: True si el username existe, False en caso contrario
        """
        try:
            with CursorDelPool() as cursor:
                if cursor is None:
                    return False
                
                cursor.execute(cls._VERIFICAR_USERNAME, (username, excluir_id))
                resultado = cursor.fetchone()
                
                return resultado[0] > 0 if resultado else False
                
        except Exception as e:
            LoggerBase().logger.error(f'❌ Error verificando username: {e}')
            return False
    
    @classmethod
    def contar_usuarios(cls) -> int:
        """
        Cuenta el total de usuarios en la base de datos
        
        Returns:
            int: Número total de usuarios
        """
        try:
            with CursorDelPool() as cursor:
                if cursor is None:
                    return 0
                
                cursor.execute("SELECT COUNT(*) FROM usuario")
                resultado = cursor.fetchone()
                
                return resultado[0] if resultado else 0
                
        except Exception as e:
            LoggerBase().logger.error(f'❌ Error contando usuarios: {e}')
            return 0
