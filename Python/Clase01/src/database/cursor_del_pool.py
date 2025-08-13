"""
Gestor de Cursores con Context Manager
=====================================

Implementa el patrón Context Manager para manejo automático de cursores
Según diagrama UML con manejo robusto de excepciones
"""

from typing import Optional
from psycopg2.extensions import connection, cursor
from .conexion import Conexion
from src.utils.logger_base import LoggerBase

class CursorDelPool:
    """
    Clase para manejar cursores de base de datos usando context managers
    
    Implementa __enter__ y __exit__ según diagrama UML
    Manejo de excepciones para evitar que se detenga la ejecución
    """
    
    def __init__(self):
        """
        Constructor según UML
        Inicializa los atributos privados _conn y _cursor
        """
        self._conn: Optional[connection] = None
        self._cursor: Optional[cursor] = None
    
    def __enter__(self) -> Optional[cursor]:
        """
        Método para entrar al contexto 'with'
        Según UML: +__enter__(self)
        
        Returns:
            Cursor de la base de datos o None si hay error
        """
        try:
            logger = LoggerBase().logger
            logger.debug('🔄 Iniciando context manager - obteniendo conexión...')
            
            # Obtener conexión del pool
            self._conn = Conexion.obtenerConexion()
            if self._conn is None:
                logger.error('❌ No se pudo obtener conexión del pool')
                return None
            
            # Crear cursor
            self._cursor = self._conn.cursor()
            logger.debug('✅ Cursor creado exitosamente')
            
            return self._cursor
            
        except Exception as e:
            logger.error(f'❌ Error en __enter__ del CursorDelPool: {e}')
            # Limpiar recursos si hay error
            self._cleanup_on_error()
            raise e  # Re-lanzar para que el código que usa el context manager sepa que falló
    
    def __exit__(self, exc_type, exc_val, exc_tb) -> None:
        """
        Método para salir del contexto 'with'
        Según UML: +__exit__(self, exc_type, exc_val, exc_tb)
        
        Args:
            exc_type: Tipo de excepción si ocurrió
            exc_val: Valor de la excepción si ocurrió  
            exc_tb: Traceback de la excepción si ocurrió
        """
        try:
            logger = LoggerBase().logger
            
            if exc_type is not None:
                # Hubo una excepción durante la ejecución
                logger.warning(f'⚠️  Excepción detectada en context manager: {exc_type.__name__}: {exc_val}')
                
                if self._conn:
                    self._conn.rollback()
                    logger.info('🔄 Rollback ejecutado debido a excepción')
            else:
                # Todo salió bien, hacer commit
                if self._conn:
                    self._conn.commit()
                    logger.debug('✅ Commit ejecutado exitosamente')
            
        except Exception as e:
            logger.error(f'❌ Error durante commit/rollback: {e}')
            # Intentar rollback como último recurso
            try:
                if self._conn:
                    self._conn.rollback()
                    logger.info('🔄 Rollback de emergencia ejecutado')
            except:
                logger.error('❌ Error crítico: no se pudo hacer rollback de emergencia')
        
        finally:
            # Siempre limpiar recursos
            self._cleanup_resources()
    
    def _cleanup_on_error(self) -> None:
        """Limpia recursos cuando hay error en __enter__"""
        try:
            if self._cursor:
                self._cursor.close()
                self._cursor = None
            if self._conn:
                Conexion.liberarConexion(self._conn)
                self._conn = None
        except Exception as e:
            LoggerBase().logger.error(f'❌ Error limpiando recursos en error: {e}')
    
    def _cleanup_resources(self) -> None:
        """Limpia todos los recursos del context manager"""
        try:
            logger = LoggerBase().logger
            
            # Cerrar cursor
            if self._cursor:
                self._cursor.close()
                logger.debug('🔒 Cursor cerrado')
                self._cursor = None
            
            # Liberar conexión al pool
            if self._conn:
                Conexion.liberarConexion(self._conn)
                logger.debug('🔄 Conexión liberada al pool')
                self._conn = None
                
        except Exception as e:
            LoggerBase().logger.error(f'❌ Error al limpiar recursos del CursorDelPool: {e}')
    
    # Métodos adicionales para depuración
    def is_active(self) -> bool:
        """
        Verifica si el context manager está activo
        
        Returns:
            bool: True si tiene conexión y cursor activos
        """
        return self._conn is not None and self._cursor is not None
    
    def get_connection_info(self) -> dict:
        """
        Obtiene información de la conexión actual
        
        Returns:
            dict: Información de la conexión
        """
        try:
            if self._conn:
                info = self._conn.get_dsn_parameters()
                return {
                    'host': info.get('host', 'N/A'),
                    'database': info.get('dbname', 'N/A'), 
                    'user': info.get('user', 'N/A'),
                    'port': info.get('port', 'N/A'),
                    'status': 'activa' if not self._conn.closed else 'cerrada'
                }
            return {'status': 'sin_conexion'}
        except Exception as e:
            return {'error': str(e)}
