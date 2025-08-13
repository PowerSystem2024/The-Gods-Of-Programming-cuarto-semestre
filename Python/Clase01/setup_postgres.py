"""
Script para configurar PostgreSQL automáticamente
================================================

Crea la base de datos y tablas necesarias para el Lab UML 1.1
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

import psycopg2
from psycopg2 import sql
from src.utils.logger_base import LoggerBase

def crear_base_datos():
    """Crea la base de datos test_db si no existe"""
    logger = LoggerBase().logger
    
    try:
        print("🔧 CONFIGURANDO POSTGRESQL...")
        print("=" * 50)
        
        # Conectar a PostgreSQL (base postgres por defecto)
        conn = psycopg2.connect(
            host="localhost",
            port="5432", 
            user="postgres",
            password="postgres",
            database="postgres"  # Base de datos por defecto
        )
        conn.autocommit = True
        cursor = conn.cursor()
        
        # Verificar si existe la base de datos
        cursor.execute("SELECT 1 FROM pg_database WHERE datname = 'test_db'")
        if cursor.fetchone():
            print("✅ Base de datos 'test_db' ya existe")
        else:
            print("📋 Creando base de datos 'test_db'...")
            cursor.execute("CREATE DATABASE test_db")
            print("✅ Base de datos 'test_db' creada exitosamente")
        
        cursor.close()
        conn.close()
        
        # Ahora conectar a la nueva base de datos para crear tablas
        crear_tablas()
        
    except psycopg2.Error as e:
        print(f"❌ Error de PostgreSQL: {e}")
        logger.error(f"Error configurando PostgreSQL: {e}")
        return False
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        logger.error(f"Error inesperado configurando BD: {e}")
        return False

def crear_tablas():
    """Crea las tablas necesarias en test_db"""
    logger = LoggerBase().logger
    
    try:
        print("📋 Creando tablas en test_db...")
        
        # Conectar a test_db
        conn = psycopg2.connect(
            host="localhost",
            port="5432",
            user="postgres", 
            password="postgres",
            database="test_db"
        )
        conn.autocommit = True
        cursor = conn.cursor()
        
        # Script SQL para crear tabla usuario
        sql_crear_tabla = """
        -- Eliminar tabla si existe (para recrear)
        DROP TABLE IF EXISTS usuario CASCADE;
        
        -- Crear tabla usuario según diagrama UML
        CREATE TABLE usuario (
            id_usuario SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        -- Crear índices para optimizar consultas
        CREATE INDEX idx_usuario_username ON usuario(username);
        CREATE INDEX idx_usuario_email ON usuario(email);
        
        -- Crear trigger para actualizar fecha_modificacion
        CREATE OR REPLACE FUNCTION actualizar_fecha_modificacion()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.fecha_modificacion = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        
        CREATE TRIGGER trigger_usuario_fecha_modificacion
            BEFORE UPDATE ON usuario
            FOR EACH ROW
            EXECUTE FUNCTION actualizar_fecha_modificacion();
        """
        
        cursor.execute(sql_crear_tabla)
        print("✅ Tabla 'usuario' creada exitosamente")
        
        # Insertar datos de prueba
        insertar_datos_prueba(cursor)
        
        cursor.close()
        conn.close()
        
        print("🎉 CONFIGURACIÓN COMPLETADA EXITOSAMENTE")
        return True
        
    except psycopg2.Error as e:
        print(f"❌ Error creando tablas: {e}")
        logger.error(f"Error creando tablas: {e}")
        return False

def insertar_datos_prueba(cursor):
    """Inserta datos de prueba en la tabla usuario"""
    try:
        print("📋 Insertando datos de prueba...")
        
        datos_prueba = [
            ('admin', 'admin123', 'admin@test.com'),
            ('user1', 'password1', 'user1@test.com'),
            ('user2', 'password2', 'user2@test.com'),
            ('usuario_test', 'test123', 'test@example.com')
        ]
        
        for username, password, email in datos_prueba:
            cursor.execute(
                "INSERT INTO usuario (username, password, email) VALUES (%s, %s, %s) ON CONFLICT (username) DO NOTHING",
                (username, password, email)
            )
        
        # Verificar cuántos registros se insertaron
        cursor.execute("SELECT COUNT(*) FROM usuario")
        total = cursor.fetchone()[0]
        print(f"✅ Datos de prueba insertados. Total usuarios: {total}")
        
    except Exception as e:
        print(f"⚠️  Error insertando datos de prueba: {e}")

def verificar_configuracion():
    """Verifica que la configuración sea correcta"""
    try:
        print("\n🔍 VERIFICANDO CONFIGURACIÓN...")
        print("=" * 40)
        
        conn = psycopg2.connect(
            host="localhost",
            port="5432",
            user="postgres",
            password="postgres", 
            database="test_db"
        )
        cursor = conn.cursor()
        
        # Verificar tabla
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'usuario'
        """)
        
        if cursor.fetchone():
            print("✅ Tabla 'usuario' existe")
            
            # Contar registros
            cursor.execute("SELECT COUNT(*) FROM usuario")
            total = cursor.fetchone()[0]
            print(f"✅ Total usuarios en BD: {total}")
            
            # Mostrar algunos usuarios
            cursor.execute("SELECT id_usuario, username, email FROM usuario LIMIT 3")
            usuarios = cursor.fetchall()
            print("📋 Usuarios de ejemplo:")
            for usuario in usuarios:
                print(f"   • ID: {usuario[0]} | Usuario: {usuario[1]} | Email: {usuario[2]}")
                
        cursor.close()
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error verificando configuración: {e}")
        return False

if __name__ == "__main__":
    print("🚀 CONFIGURADOR AUTOMÁTICO DE POSTGRESQL")
    print("=" * 50)
    print("Credenciales: postgres/postgres@localhost:5432")
    print()
    
    if crear_base_datos():
        verificar_configuracion()
        print("\n🎉 ¡CONFIGURACIÓN LISTA!")
        print("Ya puedes ejecutar: python app.py")
    else:
        print("\n❌ Error en la configuración")
        print("Verifica que PostgreSQL esté ejecutándose y las credenciales sean correctas")
