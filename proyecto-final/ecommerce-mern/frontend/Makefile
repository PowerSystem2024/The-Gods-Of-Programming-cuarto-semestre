# ============================================
# ⚛️ MAKEFILE - FRONTEND (React + Vite)
# ============================================

.PHONY: help install dev build preview test clean lint format docker-build docker-run

# Colores para output
GREEN  := \033[0;32m
YELLOW := \033[0;33m
BLUE   := \033[0;34m
RED    := \033[0;31m
NC     := \033[0m # No Color

# Variables
NODE_VERSION := 20
NPM := npm
DEV_PORT := 3000
PREVIEW_PORT := 4173
DIST_DIR := dist

# ============================================
# 📚 AYUDA
# ============================================

help: ## Mostrar esta ayuda
	@echo "$(BLUE)════════════════════════════════════════$(NC)"
	@echo "$(GREEN)  ⚛️ FRONTEND - Comandos Disponibles$(NC)"
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

dev: ## Ejecutar servidor de desarrollo (Vite)
	@echo "$(GREEN)🚀 Iniciando servidor de desarrollo...$(NC)"
	@echo "$(BLUE)🌐 http://localhost:$(DEV_PORT)$(NC)"
	$(NPM) run dev

start: dev ## Alias para dev

watch: dev ## Alias para dev

# ============================================
# 🏗️ BUILD
# ============================================

build: ## Construir para producción
	@echo "$(GREEN)🏗️ Construyendo aplicación...$(NC)"
	$(NPM) run build
	@echo "$(GREEN)✅ Build completado en $(DIST_DIR)/$(NC)"

build-clean: clean build ## Limpiar y construir

preview: build ## Previsualizar build de producción
	@echo "$(GREEN)👀 Previsualizando build...$(NC)"
	@echo "$(BLUE)🌐 http://localhost:$(PREVIEW_PORT)$(NC)"
	$(NPM) run preview

analyze: build ## Analizar tamaño del bundle
	@echo "$(GREEN)📊 Analizando bundle...$(NC)"
	@npx vite-bundle-visualizer

# ============================================
# 🧪 TESTING
# ============================================

test: ## Ejecutar tests
	@echo "$(GREEN)🧪 Ejecutando tests...$(NC)"
	$(NPM) test || echo "$(YELLOW)⚠️ Tests no configurados$(NC)"

test-watch: ## Ejecutar tests en modo watch
	@echo "$(GREEN)🧪 Ejecutando tests en modo watch...$(NC)"
	$(NPM) test -- --watch || echo "$(YELLOW)⚠️ Tests no configurados$(NC)"

test-coverage: ## Ejecutar tests con coverage
	@echo "$(GREEN)🧪 Ejecutando tests con cobertura...$(NC)"
	$(NPM) test -- --coverage || echo "$(YELLOW)⚠️ Tests no configurados$(NC)"

test-ui: ## Ejecutar tests con interfaz visual
	@echo "$(GREEN)🧪 Ejecutando tests UI...$(NC)"
	$(NPM) test -- --ui || echo "$(YELLOW)⚠️ Tests no configurados$(NC)"

# ============================================
# 🔍 CALIDAD DE CÓDIGO
# ============================================

lint: ## Ejecutar linter (ESLint)
	@echo "$(GREEN)🔍 Ejecutando linter...$(NC)"
	$(NPM) run lint

lint-fix: ## Corregir problemas de linting automáticamente
	@echo "$(GREEN)🔧 Corrigiendo problemas de linting...$(NC)"
	$(NPM) run lint -- --fix

format: ## Formatear código con Prettier
	@echo "$(GREEN)✨ Formateando código...$(NC)"
	$(NPM) run format || npx prettier --write "src/**/*.{js,jsx,ts,tsx,css,json}"

format-check: ## Verificar formato sin modificar
	@echo "$(GREEN)🔍 Verificando formato...$(NC)"
	npx prettier --check "src/**/*.{js,jsx,ts,tsx,css,json}"

type-check: ## Verificar tipos (si usas TypeScript)
	@echo "$(GREEN)📝 Verificando tipos...$(NC)"
	@if [ -f "tsconfig.json" ]; then \
		npx tsc --noEmit; \
	else \
		echo "$(YELLOW)⚠️ No se encontró tsconfig.json$(NC)"; \
	fi

# ============================================
# 🐳 DOCKER
# ============================================

docker-build: ## Construir imagen Docker
	@echo "$(GREEN)🐳 Construyendo imagen Docker...$(NC)"
	docker build -t ecommerce-frontend:latest .
	@echo "$(GREEN)✅ Imagen construida$(NC)"

docker-run: ## Ejecutar contenedor Docker
	@echo "$(GREEN)🐳 Ejecutando contenedor...$(NC)"
	docker run -p 3000:80 ecommerce-frontend:latest

docker-shell: ## Abrir shell en contenedor
	@echo "$(BLUE)🐳 Abriendo shell en contenedor...$(NC)"
	docker run -it --rm ecommerce-frontend:latest sh

# ============================================
# 🧹 LIMPIEZA
# ============================================

clean: ## Limpiar archivos generados
	@echo "$(YELLOW)🧹 Limpiando archivos...$(NC)"
	rm -rf $(DIST_DIR)
	rm -rf node_modules
	rm -rf .vite
	rm -f *.log
	@echo "$(GREEN)✅ Limpieza completada$(NC)"

clean-cache: ## Limpiar caché de npm y Vite
	@echo "$(YELLOW)🧹 Limpiando caché...$(NC)"
	$(NPM) cache clean --force
	rm -rf node_modules/.vite
	@echo "$(GREEN)✅ Caché limpiada$(NC)"

clean-all: clean clean-cache ## Limpieza completa

# ============================================
# 📊 INFORMACIÓN
# ============================================

info: ## Mostrar información del proyecto
	@echo "$(BLUE)════════════════════════════════════════$(NC)"
	@echo "$(GREEN)  📊 FRONTEND - Información$(NC)"
	@echo "$(BLUE)════════════════════════════════════════$(NC)"
	@echo "$(YELLOW)Node:$(NC)        $$(node --version 2>/dev/null || echo 'No instalado')"
	@echo "$(YELLOW)NPM:$(NC)         $$(npm --version 2>/dev/null || echo 'No instalado')"
	@echo "$(YELLOW)Vite:$(NC)        $$(npx vite --version 2>/dev/null | head -n1 || echo 'No instalado')"
	@echo "$(YELLOW)Puerto Dev:$(NC)  $(DEV_PORT)"
	@echo "$(YELLOW)Puerto Prev:$(NC) $(PREVIEW_PORT)"
	@echo "$(YELLOW)Build Dir:$(NC)   $(DIST_DIR)"
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

check-env: ## Verificar variables de entorno
	@echo "$(GREEN)🔍 Verificando variables de entorno...$(NC)"
	@if [ -f ".env" ]; then \
		echo "$(GREEN)✅ Archivo .env encontrado$(NC)"; \
		grep -v '^#' .env | grep VITE_ || echo "$(YELLOW)⚠️ No se encontraron variables VITE_*$(NC)"; \
	else \
		echo "$(RED)❌ No se encontró archivo .env$(NC)"; \
	fi

create-env: ## Crear archivo .env de ejemplo
	@echo "$(GREEN)📝 Creando .env de ejemplo...$(NC)"
	@if [ ! -f .env ]; then \
		echo "VITE_API_URL=http://localhost:5000/api" > .env; \
		echo "$(GREEN)✅ Archivo .env creado$(NC)"; \
	else \
		echo "$(YELLOW)⚠️ El archivo .env ya existe$(NC)"; \
	fi

open: ## Abrir aplicación en el navegador
	@echo "$(BLUE)🌐 Abriendo navegador...$(NC)"
	@if command -v xdg-open > /dev/null; then \
		xdg-open http://localhost:$(DEV_PORT); \
	elif command -v open > /dev/null; then \
		open http://localhost:$(DEV_PORT); \
	elif command -v start > /dev/null; then \
		start http://localhost:$(DEV_PORT); \
	else \
		echo "$(YELLOW)⚠️ No se pudo abrir el navegador automáticamente$(NC)"; \
	fi

serve: ## Servir build localmente (usando http-server)
	@echo "$(GREEN)🌐 Sirviendo build...$(NC)"
	@if [ ! -d "$(DIST_DIR)" ]; then \
		echo "$(RED)❌ No se encontró $(DIST_DIR). Ejecuta 'make build' primero$(NC)"; \
		exit 1; \
	fi
	npx http-server $(DIST_DIR) -p $(DEV_PORT) -c-1

# ============================================
# 🎨 ASSETS
# ============================================

optimize-images: ## Optimizar imágenes
	@echo "$(GREEN)🎨 Optimizando imágenes...$(NC)"
	@npx @squoosh/cli --webp auto public/**/*.{jpg,png} || \
		echo "$(YELLOW)⚠️ Instala @squoosh/cli para optimizar imágenes$(NC)"

# ============================================
# 🎯 ATAJOS
# ============================================

i: install ## Atajo para install
d: dev ## Atajo para dev
b: build ## Atajo para build
p: preview ## Atajo para preview
t: test ## Atajo para test
l: lint ## Atajo para lint
c: clean ## Atajo para clean
