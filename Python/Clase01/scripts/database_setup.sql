-- =====================================================
-- SCRIPT DE CONFIGURACIÓN DE BASE DE DATOS
-- LAB UML 1.1 - Sistema de Gestión de Usuarios
-- =====================================================
--
-- Este script configura la base de datos PostgreSQL
-- para el sistema de gestión de usuarios
--
-- Uso:
-- psql -U postgres -f scripts/database_setup.sql
--

-- =====================================================
-- 1. CREAR BASE DE DATOS
-- =====================================================

-- Conectar como superusuario y crear la base de datos
-- (Ejecutar manualmente si es necesario)
-- CREATE DATABASE test_db
--     WITH 
--     OWNER = postgres
--     ENCODING = 'UTF8'
--     LC_COLLATE = 'Spanish_Spain.1252'
--     LC_CTYPE = 'Spanish_Spain.1252'
--     TABLESPACE = pg_default
--     CONNECTION LIMIT = -1;

-- =====================================================
-- 2. USAR LA BASE DE DATOS (conectar a test_db)
-- =====================================================

\c test_db;

-- =====================================================
-- 3. ELIMINAR TABLA SI EXISTE (DESARROLLO)
-- =====================================================

DROP TABLE IF EXISTS usuario CASCADE;

-- =====================================================
-- 4. CREAR TABLA USUARIO
-- =====================================================

CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 5. CREAR ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

-- Índice para búsquedas por username
CREATE INDEX idx_usuario_username ON usuario(username);

-- Índice para búsquedas por email
CREATE INDEX idx_usuario_email ON usuario(email);

-- =====================================================
-- 6. CREAR TRIGGER PARA FECHA DE MODIFICACIÓN
-- =====================================================

-- Función para actualizar fecha_modificacion
CREATE OR REPLACE FUNCTION actualizar_fecha_modificacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_modificacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger que ejecuta la función
CREATE TRIGGER trigger_actualizar_fecha_modificacion
    BEFORE UPDATE ON usuario
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_fecha_modificacion();

-- =====================================================
-- 7. INSERTAR DATOS DE PRUEBA
-- =====================================================

INSERT INTO usuario (username, password, email) VALUES
    ('admin', 'admin123', 'admin@test.com'),
    ('usuario1', 'pass123', 'usuario1@test.com'),
    ('test_user', 'test123', 'test@example.com'),
    ('demo', 'demo123', 'demo@demo.com'),
    ('estudiante', 'est123', 'estudiante@universidad.edu');

-- =====================================================
-- 8. VERIFICAR DATOS INSERTADOS
-- =====================================================

SELECT 
    id_usuario,
    username,
    email,
    fecha_creacion
FROM usuario
ORDER BY id_usuario;

-- =====================================================
-- 9. MOSTRAR INFORMACIÓN DE LA TABLA
-- =====================================================

\d usuario;

-- =====================================================
-- 10. CREAR USUARIO DE APLICACIÓN (OPCIONAL)
-- =====================================================

-- Crear usuario específico para la aplicación
-- CREATE USER usuario_app WITH PASSWORD 'app_password';

-- Otorgar permisos necesarios
-- GRANT CONNECT ON DATABASE test_db TO usuario_app;
-- GRANT USAGE ON SCHEMA public TO usuario_app;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE usuario TO usuario_app;
-- GRANT USAGE, SELECT ON SEQUENCE usuario_id_usuario_seq TO usuario_app;

-- =====================================================
-- CONSULTAS DE VERIFICACIÓN
-- =====================================================

-- Contar usuarios
SELECT COUNT(*) as total_usuarios FROM usuario;

-- Verificar estructura
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'usuario'
ORDER BY ordinal_position;

-- =====================================================
-- MENSAJES DE CONFIRMACIÓN
-- =====================================================

\echo '✅ Base de datos configurada exitosamente'
\echo '📊 Tabla usuario creada con índices y triggers'
\echo '🔍 Datos de prueba insertados'
\echo '🎯 Sistema listo para el Lab UML 1.1'
