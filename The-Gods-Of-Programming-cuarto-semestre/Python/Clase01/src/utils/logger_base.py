"""
Sistema de Logging Base
======================

Configuración centralizada del sistema de logging
Según diagrama UML con configuracion_logging()
"""

import logging
import sys
import os
from datetime import datetime
from typing import Optional

class LoggerBase:
    """
    Clase para configurar el sistema de logging de la aplicación
    
    Implementa configuracion_logging() según diagrama UML
    Patrón Singleton para logger único en toda la aplicación
    """
    
    _instance: Optional['LoggerBase'] = None
    _logger: Optional[logging.Logger] = None
    
    def __new__(cls) -> 'LoggerBase':
        """Implementa patrón Singleton"""
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        """Constructor según UML"""
        if self._logger is None:
            self._logger = self.configuracion_logging()
    
    @property
    def logger(self) -> logging.Logger:
        """
        Getter para obtener el logger configurado
        
        Returns:
            Logger configurado y listo para usar
        """
        if self._logger is None:
            self._logger = self.configuracion_logging()
        return self._logger
    
    def configuracion_logging(self) -> logging.Logger:
        """
        Configuración del logging para toda la aplicación
        Método según UML: +configuracion_logging(): void
        
        Returns:
            Logger configurado
        """
        try:
            # Crear logger principal
            logger = logging.getLogger('usuario_app')
            logger.setLevel(logging.DEBUG)
            
            # Evitar duplicar handlers si ya están configurados
            if logger.handlers:
                return logger
            
            # === CONFIGURACIÓN DE HANDLERS ===
            
            # 1. Handler para consola (INFO y superior)
            console_handler = logging.StreamHandler(sys.stdout)
            console_handler.setLevel(logging.INFO)
            
            # 2. Handler para archivo de logs generales (DEBUG y superior)
            log_dir = self._crear_directorio_logs()
            file_handler = logging.FileHandler(
                os.path.join(log_dir, 'usuario_app.log'), 
                encoding='utf-8'
            )
            file_handler.setLevel(logging.DEBUG)
            
            # 3. Handler para archivo de errores (ERROR y superior)
            error_handler = logging.FileHandler(
                os.path.join(log_dir, 'errores.log'),
                encoding='utf-8'
            )
            error_handler.setLevel(logging.ERROR)
            
            # === CONFIGURACIÓN DE FORMATOS ===
            
            # Formato para consola (más simple)
            console_format = logging.Formatter(
                '%(levelname)s - %(message)s'
            )
            
            # Formato para archivos (más detallado)
            file_format = logging.Formatter(
                '%(asctime)s | %(name)s | %(levelname)s | %(funcName)s:%(lineno)d | %(message)s',
                datefmt='%Y-%m-%d %H:%M:%S'
            )
            
            # Formato para errores (máximo detalle)
            error_format = logging.Formatter(
                '%(asctime)s | %(name)s | ERROR | %(funcName)s:%(lineno)d | %(message)s\n'
                'Detalles: %(pathname)s\n'
                '{"timestamp": "%(asctime)s", "level": "%(levelname)s", "message": "%(message)s"}\n'
                + '-' * 80,
                datefmt='%Y-%m-%d %H:%M:%S'
            )
            
            # === APLICAR FORMATOS ===
            console_handler.setFormatter(console_format)
            file_handler.setFormatter(file_format)
            error_handler.setFormatter(error_format)
            
            # === AGREGAR HANDLERS AL LOGGER ===
            logger.addHandler(console_handler)
            logger.addHandler(file_handler)
            logger.addHandler(error_handler)
            
            # === LOG INICIAL ===
            logger.info('=' * 60)
            logger.info('🚀 SISTEMA DE LOGGING CONFIGURADO EXITOSAMENTE')
            logger.info(f'📅 Sesión iniciada: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}')
            logger.info(f'📁 Logs guardados en: {log_dir}')
            logger.info('📋 Niveles configurados:')
            logger.info('   • Consola: INFO y superior')
            logger.info('   • Archivo general: DEBUG y superior') 
            logger.info('   • Archivo errores: ERROR y superior')
            logger.info('=' * 60)
            
            return logger
            
        except Exception as e:
            # Fallback: logger básico si falla la configuración
            print(f"❌ Error configurando logging: {e}")
            fallback_logger = logging.getLogger('usuario_app_fallback')
            fallback_logger.setLevel(logging.INFO)
            
            if not fallback_logger.handlers:
                handler = logging.StreamHandler(sys.stdout)
                formatter = logging.Formatter('%(levelname)s - %(message)s')
                handler.setFormatter(formatter)
                fallback_logger.addHandler(handler)
            
            return fallback_logger
    
    def _crear_directorio_logs(self) -> str:
        """
        Crea el directorio de logs si no existe
        
        Returns:
            str: Ruta del directorio de logs
        """
        try:
            # Obtener directorio base del proyecto
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
            logs_dir = os.path.join(base_dir, 'logs')
            
            # Crear directorio si no existe
            os.makedirs(logs_dir, exist_ok=True)
            
            return logs_dir
            
        except Exception as e:
            print(f"⚠️  Error creando directorio de logs: {e}")
            # Fallback: usar directorio actual
            fallback_dir = os.path.join(os.getcwd(), 'logs')
            os.makedirs(fallback_dir, exist_ok=True)
            return fallback_dir
    
    @classmethod
    def get_logger(cls, name: Optional[str] = None) -> logging.Logger:
        """
        Método estático para obtener un logger
        
        Args:
            name: Nombre específico del logger (opcional)
            
        Returns:
            Logger configurado
        """
        if name:
            return logging.getLogger(f'usuario_app.{name}')
        else:
            return cls().logger
    
    def log_startup_info(self) -> None:
        """Registra información de inicio de la aplicación"""
        try:
            self.logger.info('🔧 INFORMACIÓN DEL SISTEMA:')
            self.logger.info(f'   • Python: {sys.version}')
            self.logger.info(f'   • Plataforma: {sys.platform}')
            self.logger.info(f'   • Directorio de trabajo: {os.getcwd()}')
            self.logger.info(f'   • PID del proceso: {os.getpid()}')
        except Exception as e:
            self.logger.error(f'Error registrando información del sistema: {e}')
    
    def log_shutdown_info(self) -> None:
        """Registra información de cierre de la aplicación"""
        try:
            self.logger.info('🔒 CERRANDO APLICACIÓN')
            self.logger.info(f'📅 Sesión finalizada: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}')
            self.logger.info('=' * 60)
        except Exception as e:
            print(f"Error registrando cierre: {e}")
    
    def test_logging(self) -> None:
        """Prueba todos los niveles de logging"""
        try:
            self.logger.debug('🔍 Mensaje de DEBUG - información detallada')
            self.logger.info('ℹ️  Mensaje de INFO - información general')
            self.logger.warning('⚠️  Mensaje de WARNING - advertencia')
            self.logger.error('❌ Mensaje de ERROR - error controlado')
            self.logger.critical('🚨 Mensaje de CRITICAL - error crítico')
        except Exception as e:
            print(f"Error en test de logging: {e}")
