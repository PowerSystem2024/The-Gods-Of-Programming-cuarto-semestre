"""
Configuración de Base de Datos
=============================

Centraliza toda la configuración de conexión a PostgreSQL
"""

import os
from dataclasses import dataclass
from dotenv import load_dotenv

# Cargar variables del archivo .env
load_dotenv()

@dataclass
class DatabaseConfig:
    """Configuración de la base de datos PostgreSQL"""
    
    # Configuración por defecto (desarrollo)
    HOST: str = os.getenv('DB_HOST', 'localhost')
    PORT: str = os.getenv('DB_PORT', '5432')
    DATABASE: str = os.getenv('DB_NAME', 'test_db')
    USERNAME: str = os.getenv('DB_USER', 'postgres')
    PASSWORD: str = os.getenv('DB_PASSWORD', 'admin')
    
    # Configuración del pool de conexiones
    MIN_CONNECTIONS: int = int(os.getenv('DB_MIN_CONN', '1'))
    MAX_CONNECTIONS: int = int(os.getenv('DB_MAX_CONN', '5'))
    
    @classmethod
    def get_connection_string(cls) -> str:
        """Retorna el string de conexión para PostgreSQL"""
        return f"postgresql://{cls.USERNAME}:{cls.PASSWORD}@{cls.HOST}:{cls.PORT}/{cls.DATABASE}"
    
    @classmethod
    def get_connection_params(cls) -> dict:
        """Retorna los parámetros de conexión como diccionario"""
        return {
            'host': cls.HOST,
            'port': cls.PORT,
            'database': cls.DATABASE,
            'user': cls.USERNAME,
            'password': cls.PASSWORD
        }
