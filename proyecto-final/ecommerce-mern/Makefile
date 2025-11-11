# ============================================
# 🛒 MAKEFILE PRINCIPAL - E-commerce MERN
# ============================================
# Este Makefile orquesta los Makefiles modulares
# de backend/ y frontend/, además de gestionar Docker.
# ============================================

.PHONY: help build up down restart logs clean test dev install seed

# Variables
DOCKER_COMPOSE = docker-compose
BACKEND_DIR = backend
FRONTEND_DIR = frontend

# Colores para output
GREEN = \033[0;32m
YELLOW = \033[0;33m
BLUE = \033[0;34m
RED = \033[0;31m
NC = \033[0m # No Color

# ============================================
# 📚 AYUDA
# ============================================

help: ## Mostrar esta ayuda
	@echo "$(BLUE)════════════════════════════════════════$(NC)"
	@echo "$(GREEN)  🛒 E-COMMERCE MERN - Comandos$(NC)"
	@echo "$(BLUE)════════════════════════════════════════$(NC)"
	@echo ""
	@echo "$(YELLOW)📦 DOCKER (Orquestación completa):$(NC)"
	@echo "  make build          - Construir imágenes Docker"
	@echo "  make up             - Levantar todos los servicios"
	@echo "  make down           - Detener servicios"
	@echo "  make logs           - Ver logs"
	@echo ""
	@echo "$(YELLOW)🔧 DESARROLLO LOCAL (sin Docker):$(NC)"
	@echo "  make install        - Instalar deps (backend + frontend)"
	@echo "  make dev            - Modo desarrollo completo"
	@echo "  make dev-backend    - Solo backend"
	@echo "  make dev-frontend   - Solo frontend"
	@echo ""
	@echo "$(YELLOW)📋 COMANDOS MODULARES:$(NC)"
	@echo "  make backend-help   - Ver comandos de backend"
	@echo "  make frontend-help  - Ver comandos de frontend"
	@echo ""
	@echo "$(YELLOW)🔗 ACCESO DIRECTO A MAKEFILES:$(NC)"
	@echo "  cd backend && make help"
	@echo "  cd frontend && make help"
	@echo "$(BLUE)════════════════════════════════════════$(NC)"

# ============================================
# 🐳 DOCKER - PRODUCCIÓN
# ============================================

build: ## Construir todas las imágenes Docker
	@echo "$(GREEN)📦 Construyendo imágenes Docker...$(NC)"
	$(DOCKER_COMPOSE) build

up: ## Levantar todos los servicios (detached)
	@echo "$(GREEN)🚀 Levantando servicios...$(NC)"
	$(DOCKER_COMPOSE) up -d
	@echo "$(GREEN)✅ Servicios iniciados:$(NC)"
	@echo "  $(BLUE)🌐 Frontend:$(NC)  http://localhost:3000"
	@echo "  $(BLUE)🔧 Backend:$(NC)   http://localhost:5000/api"
	@echo "  $(BLUE)🗄️ MongoDB:$(NC)   mongodb://localhost:27017"

down: ## Detener y eliminar todos los servicios
	@echo "$(RED)🛑 Deteniendo servicios...$(NC)"
	$(DOCKER_COMPOSE) down

restart: ## Reiniciar todos los servicios
	@echo "$(YELLOW)🔄 Reiniciando servicios...$(NC)"
	$(DOCKER_COMPOSE) restart

logs: ## Ver logs de todos los servicios
	$(DOCKER_COMPOSE) logs -f

logs-backend: ## Ver logs del backend
	$(DOCKER_COMPOSE) logs -f backend

logs-frontend: ## Ver logs del frontend
	$(DOCKER_COMPOSE) logs -f frontend

logs-db: ## Ver logs de MongoDB
	$(DOCKER_COMPOSE) logs -f mongodb

status: ## Ver estado de los servicios
	@echo "$(GREEN)📊 Estado de servicios:$(NC)"
	$(DOCKER_COMPOSE) ps

##@ Docker - Desarrollo

dev: ## Levantar servicios en modo desarrollo (con logs)
	@echo "$(GREEN)🔧 Iniciando en modo desarrollo...$(NC)"
	$(DOCKER_COMPOSE) up

rebuild: ## Reconstruir y levantar servicios
	@echo "$(YELLOW)🔨 Reconstruyendo servicios...$(NC)"
	$(DOCKER_COMPOSE) up -d --build

clean: ## Limpiar contenedores, volúmenes e imágenes
	@echo "$(RED)🧹 Limpiando Docker...$(NC)"
	$(DOCKER_COMPOSE) down -v --remove-orphans
	@echo "$(YELLOW)⚠️  Eliminando imágenes huérfanas...$(NC)"
	docker image prune -f

clean-all: ## Limpieza completa (incluye imágenes del proyecto)
	@echo "$(RED)🗑️  Limpieza completa...$(NC)"
	$(DOCKER_COMPOSE) down -v --rmi all --remove-orphans
	docker image prune -af

# ============================================
# 💻 DESARROLLO LOCAL (sin Docker)
# ============================================

install: ## Instalar dependencias (backend + frontend)
	@echo "$(GREEN)📥 Instalando dependencias...$(NC)"
	@echo "$(YELLOW)🔧 Backend...$(NC)"
	@$(MAKE) -C $(BACKEND_DIR) install
	@echo "$(YELLOW)⚛️ Frontend...$(NC)"
	@$(MAKE) -C $(FRONTEND_DIR) install
	@echo "$(GREEN)✅ Instalación completa$(NC)"

install-backend: ## Instalar solo dependencias del backend
	@echo "$(GREEN)📥 Backend...$(NC)"
	@$(MAKE) -C $(BACKEND_DIR) install

install-frontend: ## Instalar solo dependencias del frontend
	@echo "$(GREEN)📥 Frontend...$(NC)"
	@$(MAKE) -C $(FRONTEND_DIR) install

# ============================================
# 🚀 DESARROLLO
# ============================================

dev: ## Iniciar desarrollo completo (backend + frontend)
	@echo "$(GREEN)🚀 Iniciando modo desarrollo...$(NC)"
	@echo "$(YELLOW)⚠️  Esto abrirá 2 terminales. Usa Ctrl+C en cada una para detener.$(NC)"
	@echo "$(BLUE)Opción 1:$(NC) Abre 2 terminales:"
	@echo "  Terminal 1: cd backend && make dev"
	@echo "  Terminal 2: cd frontend && make dev"
	@echo ""
	@echo "$(BLUE)Opción 2:$(NC) Usa tmux/screen para multiplexar"

dev-backend: ## Ejecutar solo backend en modo desarrollo
	@echo "$(GREEN)� Iniciando backend (desarrollo)...$(NC)"
	@$(MAKE) -C $(BACKEND_DIR) dev

dev-frontend: ## Ejecutar solo frontend en modo desarrollo
	@echo "$(GREEN)⚛️ Iniciando frontend (desarrollo)...$(NC)"
	@$(MAKE) -C $(FRONTEND_DIR) dev

build-frontend: ## Construir frontend para producción
	@echo "$(GREEN)📦 Construyendo frontend...$(NC)"
	@$(MAKE) -C $(FRONTEND_DIR) build

# ============================================
# 🔗 COMANDOS MODULARES (Delegados)
# ============================================

backend-help: ## Ver ayuda del backend
	@$(MAKE) -C $(BACKEND_DIR) help

frontend-help: ## Ver ayuda del frontend
	@$(MAKE) -C $(FRONTEND_DIR) help

backend-%: ## Ejecutar comando en backend (ej: make backend-test)
	@$(MAKE) -C $(BACKEND_DIR) $*

frontend-%: ## Ejecutar comando en frontend (ej: make frontend-lint)
	@$(MAKE) -C $(FRONTEND_DIR) $*

# ============================================
# 🗄️ BASE DE DATOS
# ============================================

seed: ## Poblar base de datos con datos de ejemplo
	@echo "$(GREEN)🌱 Poblando base de datos...$(NC)"
	@$(MAKE) -C $(BACKEND_DIR) seed

seed-docker: ## Poblar DB en Docker
	@echo "$(GREEN)🌱 Poblando base de datos (Docker)...$(NC)"
	$(DOCKER_COMPOSE) exec backend npm run seed

db-shell: ## Abrir MongoDB shell (Docker)
	@echo "$(GREEN)🐚 Abriendo MongoDB shell...$(NC)"
	$(DOCKER_COMPOSE) exec mongodb mongosh -u admin -p admin123 --authenticationDatabase admin ecommerce

db-shell-local: ## Abrir MongoDB shell (local)
	@$(MAKE) -C $(BACKEND_DIR) db-shell

# ============================================
# 🧪 TESTING
# ============================================

test: ## Ejecutar todos los tests
	@echo "$(GREEN)🧪 Ejecutando tests...$(NC)"
	@$(MAKE) -C $(BACKEND_DIR) test
	@$(MAKE) -C $(FRONTEND_DIR) test

test-backend: ## Tests del backend
	@$(MAKE) -C $(BACKEND_DIR) test

test-frontend: ## Tests del frontend
	@$(MAKE) -C $(FRONTEND_DIR) test

lint: ## Ejecutar linters
	@echo "$(GREEN)🔍 Ejecutando linters...$(NC)"
	@$(MAKE) -C $(BACKEND_DIR) lint
	@$(MAKE) -C $(FRONTEND_DIR) lint

lint-fix: ## Corregir problemas de linting
	@echo "$(GREEN)🔧 Corrigiendo linting...$(NC)"
	@$(MAKE) -C $(BACKEND_DIR) lint-fix
	@$(MAKE) -C $(FRONTEND_DIR) lint-fix

# ============================================
# 📊 INFORMACIÓN
# ============================================

info: ## Mostrar información del proyecto
	@echo "$(BLUE)════════════════════════════════════════$(NC)"
	@echo "$(GREEN)  ℹ️  E-COMMERCE MERN - Información$(NC)"
	@echo "$(BLUE)════════════════════════════════════════$(NC)"
	@echo ""
	@echo "$(YELLOW)📡 URLs de Desarrollo:$(NC)"
	@echo "  🌐 Frontend:  http://localhost:3000"
	@echo "  🔧 Backend:   http://localhost:5000/api"
	@echo "  ❤️ Health:    http://localhost:5000/api/health"
	@echo ""
	@echo "$(YELLOW)🗄️ MongoDB:$(NC)"
	@echo "  Host:     localhost:27017"
	@echo "  Database: ecommerce"
	@echo "  User:     admin"
	@echo "  Pass:     admin123"
	@echo ""
	@echo "$(YELLOW)📚 Comandos Rápidos:$(NC)"
	@echo "  make help        - Ver todos los comandos"
	@echo "  make build       - Construir imágenes Docker"
	@echo "  make up          - Levantar servicios"
	@echo "  make logs        - Ver logs"
	@echo "  make down        - Detener servicios"
	@echo ""
	@echo "$(YELLOW)🔗 Makefiles Modulares:$(NC)"
	@echo "  cd backend && make help"
	@echo "  cd frontend && make help"
	@echo "$(BLUE)════════════════════════════════════════$(NC)"

version: ## Mostrar versiones de las herramientas
	@echo "$(GREEN)🔧 Versiones Instaladas:$(NC)"
	@echo "Docker:         $$(docker --version 2>/dev/null || echo 'No instalado')"
	@echo "Docker Compose: $$(docker-compose --version 2>/dev/null || echo 'No instalado')"
	@echo "Node.js:        $$(node --version 2>/dev/null || echo 'No instalado')"
	@echo "npm:            $$(npm --version 2>/dev/null || echo 'No instalado')"
	@echo "Make:           $$(make --version 2>/dev/null | head -n1 || echo 'No instalado')"

# ============================================
# 🧹 LIMPIEZA
# ============================================

clean-modules: ## Limpiar node_modules de backend y frontend
	@echo "$(YELLOW)🧹 Limpiando node_modules...$(NC)"
	@$(MAKE) -C $(BACKEND_DIR) clean
	@$(MAKE) -C $(FRONTEND_DIR) clean
	@echo "$(GREEN)✅ Limpieza completada$(NC)"
