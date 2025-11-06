"""
Test directo de conexión
======================

Vamos a probar la conexión directa sin pool para identificar el problema
"""

import os
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

import psycopg2
from src.utils.logger_base import LoggerBase

def test_direct_connection():
    """Test directo de conexión"""
    try:
        print("🔧 PROBANDO CONEXIÓN DIRECTA...")
        print("Host: localhost")
        print("Port: 5432") 
        print("User: postgres")
        print("Pass: Passe01")
        print("DB: test_db")
        print()
        
        # Conexión directa
        conn = psycopg2.connect(
            host="localhost",
            port=5432,
            user="postgres",
            password="Passe01",
            database="test_db",
            client_encoding='utf8'
        )
        
        print("✅ Conexión directa exitosa")
        
        # Probar consulta simple
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM usuario")
        count = cursor.fetchone()[0]
        print(f"✅ Usuarios en BD: {count}")
        
        # Probar seleccionar usuarios
        cursor.execute("SELECT id_usuario, username, email FROM usuario LIMIT 3")
        usuarios = cursor.fetchall()
        print("📋 Usuarios de muestra:")
        for usuario in usuarios:
            print(f"   • ID: {usuario[0]} | Usuario: {usuario[1]} | Email: {usuario[2]}")
        
        cursor.close()
        conn.close()
        
        print("\n🎉 ¡CONEXIÓN FUNCIONANDO PERFECTAMENTE!")
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print(f"❌ Tipo de error: {type(e)}")
        return False

def test_with_config():
    """Test usando la configuración del proyecto"""
    try:
        print("\n🔧 PROBANDO CON CONFIGURACIÓN DEL PROYECTO...")
        
        from config.database_config import DatabaseConfig
        
        config = DatabaseConfig()
        print(f"Host: {config.HOST}")
        print(f"Port: {config.PORT}")
        print(f"User: {config.USERNAME}")
        print(f"Pass: {config.PASSWORD}")
        print(f"DB: {config.DATABASE}")
        
        conn = psycopg2.connect(
            host=config.HOST,
            port=int(config.PORT),
            user=config.USERNAME,
            password=config.PASSWORD,
            database=config.DATABASE,
            client_encoding='utf8'
        )
        
        print("✅ Conexión con configuración del proyecto exitosa")
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error con configuración: {e}")
        return False

if __name__ == "__main__":
    print("🧪 TEST DE CONEXIÓN POSTGRESQL")
    print("=" * 50)
    
    success1 = test_direct_connection()
    success2 = test_with_config()
    
    if success1 and success2:
        print("\n🎯 ¡TODAS LAS CONEXIONES FUNCIONAN!")
        print("El problema debe estar en el pool de conexiones")
    else:
        print("\n❌ Hay problemas de conexión básicos")
