# 🎯 Sistema de Gestión de Usuarios

[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://python.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-blue.svg)](https://postgresql.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/Tests-Passing-green.svg)](#testing)

## 📋 Descripción

Sistema CRUD (Create, Read, Update, Delete) para gestión de usuarios desarrollado siguiendo un diagrama UML. Implementa el **patrón DAO** con **manejo robusto de excepciones** garantizando que la aplicación nunca se detenga por errores inesperados.

### ✨ Características Principales

- 🏗️ **Arquitectura basada en UML** - Implementación fiel al diagrama de clases
- 🛡️ **Manejo robusto de excepciones** - La aplicación nunca se detiene por errores
- 🗃️ **Patrón DAO** - Separación clara entre lógica de negocio y acceso a datos
- 🔄 **Pool de conexiones** - Gestión eficiente de conexiones PostgreSQL
- 📝 **Sistema de logging** - Registro completo de operaciones y errores
- 🎨 **Interfaz colorida** - Terminal amigable con códigos de color
- 🧪 **Testing completo** - Suite de tests unitarios y de integración

## 🏗️ Arquitectura del Sistema

```
src/
├── models/               # 📊 Modelos de datos
│   └── usuario.py        # Clase Usuario con getters/setters
├── dao/                  # 🗃️ Data Access Objects
│   └── usuario_dao.py    # Operaciones CRUD
├── database/             # 🔗 Gestión de base de datos
│   ├── conexion.py       # Pool de conexiones PostgreSQL
│   └── cursor_del_pool.py # Context manager para cursores
├── utils/                # 🛠️ Utilidades del sistema
│   └── logger_base.py    # Sistema de logging
└── ui/                   # 🖥️ Interfaz de usuario
    └── menu_app_usuario.py # Menú principal interactivo
```

## 🚀 Inicio Rápido

### Prerrequisitos

- **Python 3.9+** instalado
- **PostgreSQL 12+** instalado y ejecutándose
- **Git** (opcional, para clonar el repositorio)

### 1. Obtener el Código

```bash
# Opción 1: Clonar repositorio
git clone <tu-repositorio-url>
cd Python-Clase01

# Opción 2: Descargar ZIP y extraer
# Navegar a la carpeta extraída
```

### 2. Configurar Entorno Python

```bash
# Crear entorno virtual (recomendado)
python -m venv .venv

# Activar entorno virtual
# Windows:
.venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt
```

### 3. Configurar Base de Datos

#### Crear Base de Datos:
```sql
-- Conectar a PostgreSQL como superusuario
psql -U postgres

-- Crear base de datos
CREATE DATABASE test_db;

-- Salir de psql
\q
```

#### Ejecutar Script de Configuración:
```bash
# Opción 1: Script automático (recomendado)
python scripts/setup_database.py

# Opción 2: SQL manual
psql -U postgres -d test_db -f scripts/database_setup.sql
```

### 4. Configurar Credenciales

Copiar y editar el archivo de configuración:
```bash
# Copiar plantilla
copy .env.example .env

# Editar .env con tus credenciales de PostgreSQL
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=test_db
# DB_USER=postgres
# DB_PASSWORD=tu_password
```

### 5. Ejecutar la Aplicación

```bash
python app.py
```

## 🎮 Uso del Sistema

### Menú Principal

Al ejecutar la aplicación, verás el menú interactivo:

```
======================================================================
       🎯 SISTEMA DE GESTIÓN DE USUARIOS - LAB UML 1.1
======================================================================
📋 Opciones disponibles:
   1️⃣  Listar usuarios
   2️⃣  Agregar usuario
   3️⃣  Actualizar usuario
   4️⃣  Eliminar usuario
   5️⃣  Salir
──────────────────────────────────────────────────────────────────────
🔢 Seleccione una opción (1-5):
```

### Funcionalidades

#### 1. Listar Usuarios
Muestra todos los usuarios registrados en formato tabla:
```
ID    USERNAME             EMAIL
───── ──────────────────── ─────────────────────────
1     admin                admin@test.com
2     user1                user1@test.com
```

#### 2. Agregar Usuario
Solicita datos para crear un nuevo usuario:
- Nombre de usuario (único)
- Contraseña
- Email

#### 3. Actualizar Usuario
Permite modificar datos de un usuario existente seleccionado por ID.

#### 4. Eliminar Usuario
Elimina un usuario después de confirmación por seguridad.

#### 5. Salir
Cierra la aplicación de forma limpia, liberando todas las conexiones.

## 🧪 Testing

### Ejecutar Tests

```bash
# Verificar configuración del proyecto
python run_tests.py --tipo=verificar

# Tests unitarios (sin base de datos)
python run_tests.py --tipo=unitarios

# Tests de integración (con base de datos)
python run_tests.py --tipo=integracion

# Suite completa de tests
python run_tests.py --tipo=completos
```

### Cobertura de Tests

- ✅ **Tests unitarios** - Modelos y validaciones
- ✅ **Tests de integración** - Operaciones CRUD con base de datos
- ✅ **Tests de manejo de excepciones** - Validación de robustez
- ✅ **Tests de configuración** - Verificación de estructura del proyecto

## 📊 Implementación del Diagrama UML

### Clases Implementadas

| Clase | Archivo | Métodos UML | Estado |
|-------|---------|-------------|--------|
| **Conexion** | `src/database/conexion.py` | `obtenerPool()`, `obtenerConexion()`, `liberarConexion()`, `cerrarConexiones()` | ✅ |
| **Usuario** | `src/models/usuario.py` | Getters/setters para todos los atributos | ✅ |
| **CursorDelPool** | `src/database/cursor_del_pool.py` | `__enter__()`, `__exit__()` | ✅ |
| **UsuarioDao** | `src/dao/usuario_dao.py` | `seleccionar()`, `insertar()`, `actualizar()`, `eliminar()` | ✅ |
| **MenuAppUsuario** | `src/ui/menu_app_usuario.py` | Menú con 5 opciones | ✅ |
| **LoggerBase** | `src/utils/logger_base.py` | `configuracion_logging()` | ✅ |

### Relaciones UML

- **Conexion** ↔ **CursorDelPool** (1:N) - Pool crea cursores
- **UsuarioDao** → **Conexion** - DAO utiliza conexiones
- **UsuarioDao** ↔ **Usuario** - DAO opera sobre modelos Usuario
- **MenuAppUsuario** → **UsuarioDao** - UI utiliza DAO para operaciones

## 🛡️ Manejo de Excepciones

### Principios Implementados

- **Nunca detener la ejecución** - La aplicación continúa funcionando ante cualquier error
- **Logging detallado** - Todos los errores se registran para análisis
- **Mensajes informativos** - El usuario recibe feedback claro sobre errores
- **Recuperación automática** - Reconexión automática tras errores de red
- **Transacciones seguras** - Rollback automático en operaciones fallidas

### Ejemplo de Implementación

```python
def insertar(cls, usuario: Usuario) -> int:
    try:
        # Operación principal
        with CursorDelPool() as cursor:
            cursor.execute(cls._INSERTAR, valores)
            return 1
    except DatabaseError as e:
        logger.error(f"Error de base de datos: {e}")
        return 0  # No detiene la aplicación
    except Exception as e:
        logger.error(f"Error inesperado: {e}")
        return 0  # Continúa la ejecución
```

## 📝 Sistema de Logging

### Configuración de Logs

- **Consola**: Mensajes INFO y superiores con colores
- **Archivo general**: `logs/usuario_app.log` - DEBUG y superiores
- **Archivo errores**: `logs/errores.log` - Solo ERROR y CRITICAL

### Formato de Logs

```
2025-08-13 14:30:15 | usuario_app | INFO | mostrar_menu:45 | 🎯 Iniciando menú principal
2025-08-13 14:30:20 | usuario_app | DEBUG | seleccionar:78 | 🔍 Ejecutando consulta SELECT
2025-08-13 14:30:21 | usuario_app | ERROR | insertar:156 | ❌ Error inserción: duplicate key
```

## ⚙️ Tecnologías Utilizadas

### Core
- **Python 3.9+** - Lenguaje principal
- **PostgreSQL 12+** - Base de datos relacional
- **psycopg2-binary** - Driver PostgreSQL para Python

### Librerías
- **colorama** - Colores en terminal multiplataforma
- **python-dotenv** - Gestión de variables de entorno
- **logging** (built-in) - Sistema de logging

### Testing
- **unittest** (built-in) - Framework de testing
- **pytest** - Testing avanzado (opcional)

### Desarrollo
- **pathlib** (built-in) - Manipulación de rutas
- **dataclasses** (built-in) - Estructuras de datos
- **typing** (built-in) - Type hints

## 🔧 Configuración Avanzada

### Variables de Entorno

```bash
# Configuración de base de datos
DB_HOST=localhost          # Host del servidor PostgreSQL
DB_PORT=5432              # Puerto de PostgreSQL
DB_NAME=test_db           # Nombre de la base de datos
DB_USER=postgres          # Usuario de PostgreSQL
DB_PASSWORD=tu_password   # Contraseña de PostgreSQL

# Configuración del pool de conexiones
DB_MIN_CONN=1             # Mínimo de conexiones en el pool
DB_MAX_CONN=5             # Máximo de conexiones en el pool

# Configuración de logging
LOG_LEVEL=INFO            # Nivel de logging (DEBUG, INFO, WARNING, ERROR)
LOG_FILE=usuario_app.log  # Archivo de log principal
```

### Scripts Utilitarios

```bash
# Configurar base de datos automáticamente
python scripts/setup_database.py

# Probar conexión a base de datos
python scripts/test_connection.py

# Limpiar datos de prueba
python scripts/limpiar_bd.py

# Ejecutar tests del DAO
python scripts/test_dao.py
```

## 🚨 Troubleshooting

### Problemas Comunes

#### Error de conexión a PostgreSQL
```
❌ Error de conexión: could not connect to server
```
**Solución:**
1. Verificar que PostgreSQL esté ejecutándose
2. Confirmar credenciales en archivo `.env`
3. Verificar que la base de datos `test_db` exista

#### Error de dependencias
```
❌ ModuleNotFoundError: No module named 'psycopg2'
```
**Solución:**
```bash
pip install -r requirements.txt
```

#### Error de permisos en base de datos
```
❌ Permission denied for table usuario
```
**Solución:**
```sql
GRANT ALL PRIVILEGES ON DATABASE test_db TO tu_usuario;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO tu_usuario;
```

### Logs de Diagnóstico

Para diagnosticar problemas, revisar logs en:
- `logs/usuario_app.log` - Log general de la aplicación
- `logs/errores.log` - Log específico de errores

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consultar archivo `LICENSE` para más detalles.

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama para nueva característica (`git checkout -b feature/nueva-caracteristica`)
3. Commit de cambios (`git commit -am 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Crear Pull Request

---

## 📈 Estado del Proyecto

- ✅ **Versión estable**: 1.0.0
- ✅ **Tests**: 100% pasando
- ✅ **Documentación**: Completa
- ✅ **Producción**: Listo para despliegue
