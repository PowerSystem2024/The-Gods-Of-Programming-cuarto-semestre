# ============================================
# 🔧 MAKEFILE - BACKEND (Node.js + Express)
# ============================================

.PHONY: help install dev start build test clean seed db-shell lint format docker-build docker-run

# Colores para output
GREEN  := \033[0;32m
YELLOW := \033[0;33m
BLUE   := \033[0;34m
RED    := \033[0;31m
NC     := \033[0m # No Color

# Variables
NODE_VERSION := 20
NPM := npm
PORT := 5000

# ============================================
# 📚 AYUDA
# ============================================

help: ## Mostrar esta ayuda
	@echo "$(BLUE)════════════════════════════════════════$(NC)"
	@echo "$(GREEN)  🔧 BACKEND - Comandos Disponibles$(NC)"
	@echo "$(BLUE)════════════════════════════════════════$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "$(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""

# ============================================
# 📦 INSTALACIÓN
# ============================================

install: ## Instalar dependencias
	@echo "$(GREEN)📦 Instalando dependencias...$(NC)"
	$(NPM) install
	@echo "$(GREEN)✅ Dependencias instaladas$(NC)"

install-prod: ## Instalar solo dependencias de producción
	@echo "$(GREEN)📦 Instalando dependencias de producción...$(NC)"
	$(NPM) install --production
	@echo "$(GREEN)✅ Dependencias de producción instaladas$(NC)"

update: ## Actualizar dependencias
	@echo "$(YELLOW)🔄 Actualizando dependencias...$(NC)"
	$(NPM) update
	@echo "$(GREEN)✅ Dependencias actualizadas$(NC)"

# ============================================
# 🚀 DESARROLLO
# ============================================

dev: ## Ejecutar en modo desarrollo con nodemon
	@echo "$(GREEN)🚀 Iniciando servidor en modo desarrollo...$(NC)"
	@echo "$(BLUE)🌐 http://localhost:$(PORT)$(NC)"
	$(NPM) run dev

start: ## Ejecutar en modo producción
	@echo "$(GREEN)🚀 Iniciando servidor en modo producción...$(NC)"
	@echo "$(BLUE)🌐 http://localhost:$(PORT)$(NC)"
	NODE_ENV=production node server.js

watch: ## Ejecutar con auto-reload (alias de dev)
	@$(MAKE) dev

# ============================================
# 🗄️ BASE DE DATOS
# ============================================

seed: ## Poblar base de datos con datos de ejemplo
	@echo "$(GREEN)🌱 Poblando base de datos...$(NC)"
	node scripts/seed.js
	@echo "$(GREEN)✅ Base de datos poblada$(NC)"

seed-products: ## Poblar solo productos
	@echo "$(GREEN)🛍️ Poblando productos...$(NC)"
	node seed-products.js
	@echo "$(GREEN)✅ Productos poblados$(NC)"

db-shell: ## Abrir MongoDB shell
	@echo "$(BLUE)🗄️ Abriendo MongoDB shell...$(NC)"
	@if [ -z "$$MONGODB_URI" ]; then \
		echo "$(RED)❌ MONGODB_URI no está definida$(NC)"; \
		exit 1; \
	fi
	mongosh "$$MONGODB_URI"

db-backup: ## Crear backup de la base de datos
	@echo "$(GREEN)💾 Creando backup...$(NC)"
	@mkdir -p backups
	mongodump --uri="$$MONGODB_URI" --out=backups/backup-$$(date +%Y%m%d-%H%M%S)
	@echo "$(GREEN)✅ Backup creado$(NC)"

# ============================================
# 🧪 TESTING
# ============================================

test: ## Ejecutar tests
	@echo "$(GREEN)🧪 Ejecutando tests...$(NC)"
	$(NPM) test

test-watch: ## Ejecutar tests en modo watch
	@echo "$(GREEN)🧪 Ejecutando tests en modo watch...$(NC)"
	$(NPM) test -- --watch

test-coverage: ## Ejecutar tests con coverage
	@echo "$(GREEN)🧪 Ejecutando tests con cobertura...$(NC)"
	$(NPM) test -- --coverage

# ============================================
# 🔍 CALIDAD DE CÓDIGO
# ============================================

lint: ## Ejecutar linter
	@echo "$(GREEN)🔍 Ejecutando linter...$(NC)"
	$(NPM) run lint || echo "$(YELLOW)⚠️ Lint no configurado$(NC)"

lint-fix: ## Corregir problemas de linting automáticamente
	@echo "$(GREEN)🔧 Corrigiendo problemas de linting...$(NC)"
	$(NPM) run lint:fix || echo "$(YELLOW)⚠️ Lint no configurado$(NC)"

format: ## Formatear código con Prettier
	@echo "$(GREEN)✨ Formateando código...$(NC)"
	$(NPM) run format || npx prettier --write "**/*.{js,json,md}"

# ============================================
# 🐳 DOCKER
# ============================================

docker-build: ## Construir imagen Docker
	@echo "$(GREEN)🐳 Construyendo imagen Docker...$(NC)"
	docker build -t ecommerce-backend:latest .
	@echo "$(GREEN)✅ Imagen construida$(NC)"

docker-run: ## Ejecutar contenedor Docker
	@echo "$(GREEN)🐳 Ejecutando contenedor...$(NC)"
	docker run -p $(PORT):$(PORT) --env-file .env ecommerce-backend:latest

docker-shell: ## Abrir shell en contenedor
	@echo "$(BLUE)🐳 Abriendo shell en contenedor...$(NC)"
	docker run -it --rm ecommerce-backend:latest sh

# ============================================
# 🧹 LIMPIEZA
# ============================================

clean: ## Limpiar archivos generados
	@echo "$(YELLOW)🧹 Limpiando archivos...$(NC)"
	rm -rf node_modules
	rm -rf logs/*
	rm -rf uploads/*
	rm -f *.log
	@echo "$(GREEN)✅ Limpieza completada$(NC)"

clean-cache: ## Limpiar caché de npm
	@echo "$(YELLOW)🧹 Limpiando caché...$(NC)"
	$(NPM) cache clean --force
	@echo "$(GREEN)✅ Caché limpiada$(NC)"

clean-all: clean clean-cache ## Limpieza completa

# ============================================
# 📊 INFORMACIÓN
# ============================================

info: ## Mostrar información del proyecto
	@echo "$(BLUE)════════════════════════════════════════$(NC)"
	@echo "$(GREEN)  📊 BACKEND - Información$(NC)"
	@echo "$(BLUE)════════════════════════════════════════$(NC)"
	@echo "$(YELLOW)Node:$(NC)        $$(node --version 2>/dev/null || echo 'No instalado')"
	@echo "$(YELLOW)NPM:$(NC)         $$(npm --version 2>/dev/null || echo 'No instalado')"
	@echo "$(YELLOW)Puerto:$(NC)      $(PORT)"
	@echo "$(YELLOW)Dependencias:$(NC) $$(ls node_modules 2>/dev/null | wc -l) paquetes"
	@echo "$(BLUE)════════════════════════════════════════$(NC)"

deps: ## Listar dependencias instaladas
	@echo "$(GREEN)📦 Dependencias instaladas:$(NC)"
	@$(NPM) list --depth=0

outdated: ## Verificar dependencias desactualizadas
	@echo "$(YELLOW)🔍 Verificando dependencias desactualizadas...$(NC)"
	@$(NPM) outdated

audit: ## Auditoría de seguridad
	@echo "$(GREEN)🔒 Ejecutando auditoría de seguridad...$(NC)"
	@$(NPM) audit

audit-fix: ## Corregir vulnerabilidades automáticamente
	@echo "$(GREEN)🔧 Corrigiendo vulnerabilidades...$(NC)"
	@$(NPM) audit fix

# ============================================
# 🔧 UTILIDADES
# ============================================

logs: ## Ver logs del servidor
	@echo "$(BLUE)📋 Mostrando logs...$(NC)"
	@tail -f logs/*.log 2>/dev/null || echo "$(YELLOW)No hay logs disponibles$(NC)"

check-env: ## Verificar variables de entorno
	@echo "$(GREEN)🔍 Verificando variables de entorno...$(NC)"
	@node -e "require('dotenv').config(); \
		const required = ['MONGODB_URI', 'JWT_SECRET', 'SESSION_SECRET']; \
		required.forEach(v => console.log(v + ':', process.env[v] ? '✅' : '❌'));"

create-env: ## Crear archivo .env de ejemplo
	@echo "$(GREEN)📝 Creando .env de ejemplo...$(NC)"
	@if [ ! -f .env ]; then \
		echo "PORT=5000" > .env; \
		echo "MONGODB_URI=mongodb://localhost:27017/ecommerce" >> .env; \
		echo "JWT_SECRET=tu-secreto-jwt-aqui" >> .env; \
		echo "SESSION_SECRET=tu-secreto-session-aqui" >> .env; \
		echo "FRONTEND_URL=http://localhost:3000" >> .env; \
		echo "$(GREEN)✅ Archivo .env creado$(NC)"; \
	else \
		echo "$(YELLOW)⚠️ El archivo .env ya existe$(NC)"; \
	fi

# ============================================
# 🎯 ATAJOS
# ============================================

i: install ## Atajo para install
d: dev ## Atajo para dev
s: start ## Atajo para start
t: test ## Atajo para test
c: clean ## Atajo para clean
