"""
Paquete Principal del Sistema
============================

Sistema de Gestión de Usuarios - Lab UML 1.1
Implementa patrón DAO con manejo robusto de excepciones
"""

__version__ = "1.1.0"
__author__ = "Lab UML 1.1"
__description__ = "Sistema CRUD de usuarios con PostgreSQL y patrón DAO"

# Imports principales para facilitar el uso
from .models import Usuario
from .dao import UsuarioDao
from .database import Conexion, CursorDelPool
from .utils import LoggerBase
from .ui import MenuAppUsuario

__all__ = [
    'Usuario',
    'UsuarioDao', 
    'Conexion',
    'CursorDelPool',
    'LoggerBase',
    'MenuAppUsuario'
]
