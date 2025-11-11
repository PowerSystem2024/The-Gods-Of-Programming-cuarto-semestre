# 🚀 GUÍA RÁPIDA - Makefiles Modulares

## 📁 Estructura

```
proyecto/
├── Makefile              # ⭐ Principal (Docker + orquestación)
├── backend/
│   ├── Makefile         # 🔧 Backend específico
│   └── ...
└── frontend/
    ├── Makefile         # ⚛️ Frontend específico
    └── ...
```

---

## 🎯 Casos de Uso Comunes

### 1️⃣ Desarrollo con Docker (Recomendado para testing completo)

```bash
# Desde la raíz del proyecto
make build              # Construir imágenes
make up                 # Levantar servicios
make logs               # Ver logs

# URLs disponibles:
# - Frontend:  http://localhost:3000
# - Backend:   http://localhost:5000/api
# - MongoDB:   mongodb://localhost:27017

make down               # Detener todo
```

---

### 2️⃣ Desarrollo Local - Backend Solo

```bash
cd backend

make install            # 1. Instalar dependencias
make create-env         # 2. Crear .env (si no existe)
# Editar .env con tu MongoDB URI

make dev                # 3. Iniciar servidor (nodemon)
# Backend: http://localhost:5000
```

**Comandos útiles:**
```bash
make seed               # Poblar base de datos
make db-shell           # Abrir MongoDB shell
make test               # Ejecutar tests
make lint               # Verificar código
```

---

### 3️⃣ Desarrollo Local - Frontend Solo

```bash
cd frontend

make install            # 1. Instalar dependencias
make create-env         # 2. Crear .env (si no existe)
# Editar .env con VITE_API_URL

make dev                # 3. Iniciar Vite
# Frontend: http://localhost:3000
```

**Comandos útiles:**
```bash
make build              # Build de producción
make preview            # Preview del build
make lint               # ESLint
make format             # Prettier
```

---

### 4️⃣ Desarrollo Local - Backend + Frontend

**Opción A: Dos terminales**

```bash
# Terminal 1 (Backend)
cd backend
make dev

# Terminal 2 (Frontend)
cd frontend
make dev
```

**Opción B: Desde raíz**

```bash
# Delegar comandos desde la raíz
make dev-backend        # En una terminal
make dev-frontend       # En otra terminal
```

---

### 5️⃣ Comandos desde la Raíz (Delegados)

```bash
# Ejecutar comandos específicos sin cambiar de carpeta
make backend-dev           # = cd backend && make dev
make backend-seed          # = cd backend && make seed
make backend-test          # = cd backend && make test

make frontend-build        # = cd frontend && make build
make frontend-lint         # = cd frontend && make lint
make frontend-preview      # = cd frontend && make preview
```

---

### 6️⃣ Operaciones Globales

```bash
# Instalación completa
make install               # Backend + Frontend

# Testing completo
make test                  # Tests de ambos

# Linting completo
make lint                  # Linter backend + frontend
make lint-fix              # Corregir automáticamente

# Información
make info                  # Info del proyecto
make version               # Versiones de herramientas
```

---

### 7️⃣ Base de Datos

```bash
# Desde raíz
make seed                  # Poblar DB (local)
make seed-docker           # Poblar DB (Docker)
make db-shell              # MongoDB shell (Docker)

# Desde backend/
cd backend
make seed                  # Poblar DB
make db-shell              # MongoDB shell
make db-backup             # Crear backup
```

---

### 8️⃣ Limpieza

```bash
# Docker
make clean                 # Limpiar contenedores y volúmenes
make clean-all             # Limpieza completa (incluye imágenes)

# Local
make clean-modules         # Limpiar node_modules (backend + frontend)

cd backend
make clean                 # Limpiar backend

cd frontend
make clean                 # Limpiar frontend (dist + node_modules)
```

---

## 🔍 Ver Ayuda

```bash
# Ayuda principal
make help
make

# Ayuda específica
make backend-help
make frontend-help

# O directamente en cada carpeta
cd backend && make help
cd frontend && make help
```

---

## 💡 Atajos Útiles

Ambos Makefiles (backend y frontend) tienen atajos:

```bash
make i      # = make install
make d      # = make dev
make b      # = make build
make t      # = make test
make l      # = make lint
make c      # = make clean
```

---

## 📋 Flujo de Trabajo Típico

### Primera vez (Setup inicial)

```bash
# 1. Clonar repo
git clone <url>
cd proyecto

# 2. Instalar dependencias
make install

# 3. Configurar entornos
cd backend && make create-env
cd ../frontend && make create-env

# 4. Editar .env files
# backend/.env -> MONGODB_URI, JWT_SECRET, etc.
# frontend/.env -> VITE_API_URL

# 5. Poblar DB (si necesario)
cd backend && make seed
```

### Desarrollo diario

```bash
# Opción 1: Docker (todo integrado)
make build && make up
make logs

# Opción 2: Local (más rápido para cambios)
# Terminal 1
cd backend && make dev

# Terminal 2
cd frontend && make dev
```

### Antes de commit

```bash
# Verificar código
make lint
make test

# Corregir problemas
make lint-fix
```

### Build para producción

```bash
# Frontend
cd frontend
make build              # Genera dist/

# Backend (Docker)
cd ..
make docker-build       # Genera imagen
```

---

## 🐛 Troubleshooting

### "Make: command not found"

**Windows:**
- Instalar mediante Chocolatey: `choco install make`
- O usar Git Bash que incluye make

**Mac:**
- Viene con Xcode Command Line Tools: `xcode-select --install`

**Linux:**
- Debian/Ubuntu: `sudo apt install build-essential`
- Fedora: `sudo dnf install make`

### Puerto ocupado

```bash
# Ver qué está usando el puerto
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Linux/Mac
lsof -i :3000
lsof -i :5000

# Detener servicios Docker
make down
```

### Variables de entorno no cargadas

```bash
# Verificar .env
cd backend && make check-env
cd frontend && make check-env

# Recrear .env
cd backend && rm .env && make create-env
```

---

## 📚 Recursos

- [GNU Make Manual](https://www.gnu.org/software/make/manual/)
- [Make Tutorial](https://makefiletutorial.com/)
- [Docker Compose](https://docs.docker.com/compose/)

---

¡Feliz desarrollo! 🚀
