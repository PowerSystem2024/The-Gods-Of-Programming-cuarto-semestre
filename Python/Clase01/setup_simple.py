"""
Configurador PostgreSQL Simple
=============================

Script simplificado para configurar PostgreSQL evitando problemas de codificación
"""

import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

def test_connection():
    """Prueba la conexión básica a PostgreSQL"""
    try:
        print("Probando conexión a PostgreSQL...")
        
        # Conectar con configuración básica
        conn = psycopg2.connect(
            host="localhost",
            port=5432,
            user="postgres",
            password="Passe01",
            database="postgres"
        )
        
        print("✅ Conexión exitosa a PostgreSQL")
        
        # Crear base de datos si no existe
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Verificar si test_db existe
        cursor.execute("SELECT 1 FROM pg_database WHERE datname = 'test_db'")
        if not cursor.fetchone():
            print("Creando base de datos test_db...")
            cursor.execute("CREATE DATABASE test_db")
            print("✅ Base de datos test_db creada")
        else:
            print("✅ Base de datos test_db ya existe")
        
        cursor.close()
        conn.close()
        
        # Ahora crear tablas en test_db
        create_tables()
        
    except psycopg2.OperationalError as e:
        print(f"❌ Error de conexión: {e}")
        print("Verifica que PostgreSQL esté ejecutándose y las credenciales sean correctas")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
    
    return True

def create_tables():
    """Crea las tablas necesarias"""
    try:
        print("Creando tablas...")
        
        conn = psycopg2.connect(
            host="localhost",
            port=5432,
            user="postgres",
            password="Passe01",
            database="test_db"
        )
        
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Crear tabla usuario
        cursor.execute("""
            DROP TABLE IF EXISTS usuario CASCADE;
            
            CREATE TABLE usuario (
                id_usuario SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL
            );
        """)
        
        print("✅ Tabla usuario creada")
        
        # Insertar datos de prueba
        cursor.execute("""
            INSERT INTO usuario (username, password, email) VALUES
            ('admin', 'admin123', 'admin@test.com'),
            ('user1', 'password1', 'user1@test.com'),
            ('test', 'test123', 'test@test.com')
            ON CONFLICT (username) DO NOTHING;
        """)
        
        # Verificar datos
        cursor.execute("SELECT COUNT(*) FROM usuario")
        count = cursor.fetchone()[0]
        print(f"✅ {count} usuarios en la base de datos")
        
        cursor.close()
        conn.close()
        
        return True
        
    except Exception as e:
        print(f"❌ Error creando tablas: {e}")
        return False

if __name__ == "__main__":
    print("🔧 CONFIGURADOR POSTGRESQL SIMPLE")
    print("=" * 40)
    
    if test_connection():
        print("\n🎉 ¡CONFIGURACIÓN COMPLETADA!")
        print("Ya puedes ejecutar tu aplicación")
    else:
        print("\n❌ Error en la configuración")
