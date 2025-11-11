# 🐳 GUÍA DE DOCKER - E-commerce MERN

Esta guía explica cómo ejecutar la aplicación usando Docker.

---

## 📋 Pre-requisitos

- **Docker** v20.10 o superior
- **Docker Compose** v2.0 o superior
- **Make** (opcional, para comandos simplificados)

### Verificar instalación:

```bash
docker --version
docker-compose --version
make --version  # Opcional
```

---

## 🚀 INICIO RÁPIDO

### Opción 1: Con Make (Recomendado)

```bash
# Ver todos los comandos disponibles
make help

# Construir imágenes
make build

# Levantar servicios
make up

# Ver logs
make logs
```

### Opción 2: Con Docker Compose

```bash
# Construir imágenes
docker-compose build

# Levantar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f
```

---

## 🌐 URLs de Acceso

Una vez levantados los servicios:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/api/health
- **MongoDB:** mongodb://localhost:27017

---

## 🛠️ COMANDOS MAKE

### Comandos Principales

```bash
make help           # Ver ayuda
make build          # Construir imágenes
make up             # Levantar servicios (detached)
make down           # Detener servicios
make restart        # Reiniciar servicios
make logs           # Ver logs de todos los servicios
make status         # Ver estado de servicios
```

### Comandos de Desarrollo

```bash
make dev            # Levantar con logs en consola
make rebuild        # Reconstruir y levantar
make clean          # Limpiar contenedores y volúmenes
make clean-all      # Limpieza completa (incluye imágenes)
```

### Comandos de Logs

```bash
make logs           # Logs de todos los servicios
make logs-backend   # Solo backend
make logs-frontend  # Solo frontend
make logs-db        # Solo MongoDB
```

### Base de Datos

```bash
make seed           # Poblar DB con datos de ejemplo
make db-shell       # Abrir MongoDB shell
```

### Información

```bash
make info           # Información del proyecto
make version        # Versiones de herramientas
```

---

## 📦 ESTRUCTURA DE SERVICIOS

```yaml
┌─────────────────────────────────────┐
│         Docker Compose              │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────┐  ┌─────────────┐  │
│  │  Frontend   │  │   Backend   │  │
│  │  (nginx)    │→ │  (Node.js)  │  │
│  │  :3000      │  │  :5000      │  │
│  └─────────────┘  └──────┬──────┘  │
│                          │         │
│                   ┌──────▼──────┐  │
│                   │   MongoDB   │  │
│                   │   :27017    │  │
│                   └─────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

---

## 🔧 CONFIGURACIÓN

### Variables de Entorno

Copia el archivo de ejemplo:

```bash
cp .env.docker.example .env
```

Edita `.env` con tus valores:

```env
JWT_SECRET=tu-secreto-seguro
SESSION_SECRET=otro-secreto-seguro
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=contraseña-segura
```

---

## 🐛 TROUBLESHOOTING

### El frontend no se conecta al backend

**Problema:** CORS o red no configurada

**Solución:**
```bash
# Verificar que los servicios estén en la misma red
docker network ls
docker network inspect ecommerce-mern_ecommerce-network
```

### MongoDB no inicia

**Problema:** Puerto 27017 ocupado

**Solución:**
```bash
# Ver qué está usando el puerto
netstat -ano | findstr :27017  # Windows
lsof -i :27017                 # Linux/Mac

# Detener MongoDB local si está corriendo
```

### Cambios en el código no se reflejan

**Problema:** Imágenes cacheadas

**Solución:**
```bash
# Reconstruir sin caché
docker-compose build --no-cache
docker-compose up -d
```

### Error de permisos

**Problema:** Usuario en contenedor

**Solución:**
```bash
# Limpiar volúmenes y reconstruir
make clean
make build
make up
```

---

## 🧹 LIMPIEZA

### Limpieza básica

```bash
make down           # Detener servicios
make clean          # Limpiar contenedores y volúmenes
```

### Limpieza completa

```bash
make clean-all      # Eliminar todo (incluye imágenes)
```

### Limpieza manual

```bash
# Detener todos los contenedores
docker-compose down -v

# Eliminar imágenes del proyecto
docker rmi ecommerce-mern-backend ecommerce-mern-frontend

# Limpiar sistema Docker
docker system prune -a
```

---

## 📊 MONITOREO

### Ver estado de servicios

```bash
make status
# o
docker-compose ps
```

### Ver uso de recursos

```bash
docker stats
```

### Inspeccionar logs

```bash
# Últimas 100 líneas
docker-compose logs --tail=100

# Logs de un servicio específico
docker-compose logs backend --tail=50 -f
```

---

## 🔐 SEGURIDAD

### Buenas prácticas:

1. **Nunca** commitear el archivo `.env` con credenciales reales
2. Usar **secrets** de Docker para producción
3. Cambiar contraseñas por defecto (`admin123`)
4. Ejecutar contenedores como **usuario no-root** (ya configurado en Dockerfile)
5. Limitar recursos de contenedores en producción

---

## 🚢 DEPLOYMENT A PRODUCCIÓN

Para producción, considera:

1. **Usar Docker Swarm o Kubernetes**
2. **Separar servicios** (un contenedor por servicio)
3. **Usar volúmenes persistentes** para MongoDB
4. **Configurar health checks** (ya incluidos)
5. **Usar reverse proxy** (nginx/traefik)
6. **Habilitar HTTPS** con certificados SSL
7. **Implementar CI/CD** con GitHub Actions

---

## 📚 RECURSOS

- [Documentación Docker](https://docs.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Multi-stage builds](https://docs.docker.com/build/building/multi-stage/)

---

## 🆘 SOPORTE

Si tienes problemas:

1. Ver logs: `make logs`
2. Verificar estado: `make status`
3. Limpiar y reconstruir: `make clean && make build && make up`
4. Revisar la documentación del proyecto

---

¡Listo para desarrollar! 🚀
