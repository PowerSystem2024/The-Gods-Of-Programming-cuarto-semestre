# Makefile para E-commerce MERN
.PHONY: help build up down restart logs clean test dev install seed

# Variables
DOCKER_COMPOSE = docker-compose
BACKEND_DIR = backend
FRONTEND_DIR = frontend

# Colores para output
GREEN = \033[0;32m
YELLOW = \033[0;33m
RED = \033[0;31m
NC = \033[0m # No Color

##@ Ayuda

help: ## Mostrar esta ayuda
	@echo "$(GREEN)E-commerce MERN - Comandos disponibles:$(NC)"
	@awk 'BEGIN {FS = ":.*##"; printf "\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2 } /^##@/ { printf "\n$(GREEN)%s$(NC)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Docker - Producción

build: ## Construir todas las imágenes Docker
	@echo "$(GREEN)📦 Construyendo imágenes Docker...$(NC)"
	$(DOCKER_COMPOSE) build

up: ## Levantar todos los servicios (detached)
	@echo "$(GREEN)🚀 Levantando servicios...$(NC)"
	$(DOCKER_COMPOSE) up -d
	@echo "$(GREEN)✅ Servicios iniciados:$(NC)"
	@echo "  - Frontend: http://localhost:3000"
	@echo "  - Backend:  http://localhost:5000"
	@echo "  - MongoDB:  mongodb://localhost:27017"

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

##@ Instalación Local

install: ## Instalar dependencias (backend + frontend)
	@echo "$(GREEN)📥 Instalando dependencias...$(NC)"
	@echo "$(YELLOW)Backend...$(NC)"
	cd $(BACKEND_DIR) && npm install
	@echo "$(YELLOW)Frontend...$(NC)"
	cd $(FRONTEND_DIR) && npm install
	@echo "$(GREEN)✅ Instalación completa$(NC)"

install-backend: ## Instalar solo dependencias del backend
	@echo "$(GREEN)📥 Instalando dependencias del backend...$(NC)"
	cd $(BACKEND_DIR) && npm install

install-frontend: ## Instalar solo dependencias del frontend
	@echo "$(GREEN)📥 Instalando dependencias del frontend...$(NC)"
	cd $(FRONTEND_DIR) && npm install

##@ Desarrollo Local

dev-backend: ## Ejecutar backend en modo desarrollo (local)
	@echo "$(GREEN)🚀 Iniciando backend (desarrollo)...$(NC)"
	cd $(BACKEND_DIR) && npm run dev

dev-frontend: ## Ejecutar frontend en modo desarrollo (local)
	@echo "$(GREEN)🚀 Iniciando frontend (desarrollo)...$(NC)"
	cd $(FRONTEND_DIR) && npm run dev

build-frontend: ## Hacer build del frontend
	@echo "$(GREEN)📦 Construyendo frontend...$(NC)"
	cd $(FRONTEND_DIR) && npm run build

##@ Base de Datos

seed: ## Poblar base de datos con datos de ejemplo
	@echo "$(GREEN)🌱 Poblando base de datos...$(NC)"
	cd $(BACKEND_DIR) && npm run seed

db-shell: ## Abrir shell de MongoDB en el contenedor
	@echo "$(GREEN)🐚 Abriendo MongoDB shell...$(NC)"
	$(DOCKER_COMPOSE) exec mongodb mongosh -u admin -p admin123 --authenticationDatabase admin ecommerce

##@ Testing

test: ## Ejecutar tests (cuando estén disponibles)
	@echo "$(YELLOW)⚠️  Tests no implementados aún$(NC)"

##@ Información

info: ## Mostrar información del proyecto
	@echo "$(GREEN)ℹ️  Información del Proyecto$(NC)"
	@echo ""
	@echo "$(YELLOW)URLs de Desarrollo:$(NC)"
	@echo "  Frontend: http://localhost:3000"
	@echo "  Backend:  http://localhost:5000/api"
	@echo "  Health:   http://localhost:5000/api/health"
	@echo ""
	@echo "$(YELLOW)MongoDB:$(NC)"
	@echo "  Host:     localhost:27017"
	@echo "  Database: ecommerce"
	@echo "  User:     admin"
	@echo "  Pass:     admin123"
	@echo ""
	@echo "$(YELLOW)Comandos útiles:$(NC)"
	@echo "  make help        - Ver todos los comandos"
	@echo "  make up          - Levantar servicios"
	@echo "  make logs        - Ver logs"
	@echo "  make down        - Detener servicios"

version: ## Mostrar versiones de las herramientas
	@echo "$(GREEN)🔧 Versiones:$(NC)"
	@echo "Docker:         $$(docker --version)"
	@echo "Docker Compose: $$(docker-compose --version)"
	@echo "Node.js:        $$(node --version 2>/dev/null || echo 'No instalado')"
	@echo "npm:            $$(npm --version 2>/dev/null || echo 'No instalado')"
