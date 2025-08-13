"""
Gestión de Conexiones de Base de Datos
======================================

Implementa el patrón Singleton para el pool de conexiones PostgreSQL
Manejo robusto de excepciones según requerimientos UML
"""

import sys
import os
from typing import Optional
from psycopg2 import pool, OperationalError, DatabaseError
from psycopg2.extensions import connection

# Agregar config al path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))
from config.database_config import DatabaseConfig
from src.utils.logger_base import LoggerBase

class Conexion:
    """
    Clase para manejar la conexión a PostgreSQL usando pool de conexiones
    
    Implementa el patrón Singleton para el pool según diagrama UML
    Manejo de excepciones para evitar que se detenga la ejecución
    """
    
    # Atributos de clase según UML
    _DATABASE: str = DatabaseConfig.DATABASE
    _USERNAME: str = DatabaseConfig.USERNAME  
    _PASSWORD: str = DatabaseConfig.PASSWORD
    _DB_PORT: str = DatabaseConfig.PORT
    _HOST: str = DatabaseConfig.HOST
    _MIN_CON: int = DatabaseConfig.MIN_CONNECTIONS
    _MAX_CON: int = DatabaseConfig.MAX_CONNECTIONS
    _Pool_Pool: Optional[pool.SimpleConnectionPool] = None  # Pool_Pool según UML
    
    def __init__(self):
        """Constructor vacío según diagrama UML"""
        pass
    
    @classmethod
    def obtenerPool(cls) -> Optional[pool.SimpleConnectionPool]:
        """
        Obtiene el pool de conexiones, lo crea si no existe
        Método según UML: +obtenerPool(): Pool
        
        Returns:
            Pool de conexiones o None si hay error
        """
        if cls._Pool_Pool is None:
            try:
                logger = LoggerBase().logger
                logger.info("🔄 Creando pool de conexiones...")
                
                cls._Pool_Pool = pool.SimpleConnectionPool(
                    minconn=cls._MIN_CON,
                    maxconn=cls._MAX_CON,
                    host=cls._HOST,
                    user=cls._USERNAME,
                    password=cls._PASSWORD,
                    port=cls._DB_PORT,
                    database=cls._DATABASE,
                    client_encoding='utf8'
                )
                
                logger.info(f'✅ Pool de conexiones creado exitosamente')
                logger.info(f'📊 Configuración: Host={cls._HOST}, DB={cls._DATABASE}, '
                           f'Pool={cls._MIN_CON}-{cls._MAX_CON} conexiones')
                
                return cls._Pool_Pool
                
            except OperationalError as e:
                LoggerBase().logger.error(f'❌ Error de conexión a PostgreSQL: {e}')
                LoggerBase().logger.error('💡 Verifique que PostgreSQL esté ejecutándose')
                return None
            except DatabaseError as e:
                LoggerBase().logger.error(f'❌ Error de base de datos: {e}')
                return None
            except Exception as e:
                LoggerBase().logger.error(f'❌ Error inesperado al crear pool: {e}')
                return None
        else:
            return cls._Pool_Pool
    
    @classmethod
    def obtenerConexion(cls) -> Optional[connection]:
        """
        Obtiene una conexión del pool
        Método según UML: +obtenerConexion(): Connection
        
        Returns:
            Conexión de PostgreSQL o None si hay error
        """
        try:
            pool_conexiones = cls.obtenerPool()
            if pool_conexiones is None:
                LoggerBase().logger.error('❌ No hay pool de conexiones disponible')
                return None
                
            conexion = pool_conexiones.getconn()
            LoggerBase().logger.debug('🔗 Conexión obtenida del pool')
            return conexion
            
        except pool.PoolError as e:
            LoggerBase().logger.error(f'❌ Error del pool de conexiones: {e}')
            return None
        except Exception as e:
            LoggerBase().logger.error(f'❌ Error al obtener conexión: {e}')
            return None
    
    @classmethod
    def liberarConexion(cls, conexion: connection) -> None:
        """
        Libera una conexión de vuelta al pool
        Método según UML: +liberarConexion(conn): void
        
        Args:
            conexion: Conexión a liberar
        """
        try:
            if conexion and cls._Pool_Pool:
                cls._Pool_Pool.putconn(conexion)
                LoggerBase().logger.debug('🔄 Conexión liberada al pool')
        except pool.PoolError as e:
            LoggerBase().logger.error(f'❌ Error al liberar conexión al pool: {e}')
        except Exception as e:
            LoggerBase().logger.error(f'❌ Error inesperado al liberar conexión: {e}')
    
    @classmethod
    def cerrarConexiones(cls) -> None:
        """
        Cierra todas las conexiones del pool
        Método según UML: +cerrarConexiones(): void
        """
        try:
            if cls._Pool_Pool:
                cls._Pool_Pool.closeall()
                cls._Pool_Pool = None
                LoggerBase().logger.info('🔒 Pool de conexiones cerrado exitosamente')
        except Exception as e:
            LoggerBase().logger.error(f'❌ Error al cerrar pool de conexiones: {e}')
    
    @classmethod
    def verificar_conexion(cls) -> bool:
        """
        Verifica si la conexión a la base de datos está funcionando
        
        Returns:
            bool: True si la conexión es exitosa, False en caso contrario
        """
        try:
            conexion = cls.obtenerConexion()
            if conexion:
                cursor = conexion.cursor()
                cursor.execute('SELECT 1')
                resultado = cursor.fetchone()
                cursor.close()
                cls.liberarConexion(conexion)
                
                LoggerBase().logger.info('✅ Verificación de conexión exitosa')
                return resultado[0] == 1
            return False
        except Exception as e:
            LoggerBase().logger.error(f'❌ Error en verificación de conexión: {e}')
            return False
    
    @classmethod
    def get_info_pool(cls) -> dict:
        """
        Obtiene información del estado actual del pool
        
        Returns:
            dict: Información del pool de conexiones
        """
        try:
            if cls._Pool_Pool:
                return {
                    'conexiones_minimas': cls._MIN_CON,
                    'conexiones_maximas': cls._MAX_CON,
                    'host': cls._HOST,
                    'database': cls._DATABASE,
                    'puerto': cls._DB_PORT,
                    'pool_activo': True
                }
            else:
                return {'pool_activo': False}
        except Exception as e:
            LoggerBase().logger.error(f'❌ Error al obtener info del pool: {e}')
            return {'error': str(e)}
