#  E-Commerce MERN - Tienda de Postres

> **Proyecto Académico** - Tecnicatura en Desarrollo de Software (4to Semestre)  
> **Equipo:** The Gods of Programming

[![Netlify Status](https://img.shields.io/badge/netlify-deployed-success)](https://thegodsofprogrammingfrontend.netlify.app)
[![Node](https://img.shields.io/badge/node-v20-green)](https://nodejs.org)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Una aplicación de comercio electrónico completa para venta de postres artesanales, desarrollada con el stack MERN (MongoDB, Express, React, Node.js).

---

##  Demo en Vivo

- ** Frontend:** [https://thegodsofprogrammingfrontend.netlify.app](https://thegodsofprogrammingfrontend.netlify.app)
- ** Backend API:** [https://ecommerce-backend-a4a0.onrender.com/api](https://ecommerce-backend-a4a0.onrender.com/api)
- ** API Docs (Swagger):** [https://ecommerce-backend-a4a0.onrender.com/api-docs](https://ecommerce-backend-a4a0.onrender.com/api-docs) (cuando ejecutas localmente)

---

##  Documentación

###  Inicio Rápido

| Documento | Descripción | Audiencia |
|-----------|-------------|-----------|
| **[ Índice de Documentación](./INDICE-DOCUMENTACION.md)** | Navegación centralizada | Todos |
| **[ Manual de Usuario](./MANUAL-USUARIO.md)** | Guía completa de uso | Usuarios finales |
| **[ Deployment Quick Start](./DEPLOYMENT-QUICK-START.md)** | Setup en 5 minutos | Desarrolladores |
| **[ Docker & Make](./README-DOCKER.md)** | Containerización | Desarrolladores |

###  Documentación Completa

- **[ Arquitectura](./ARCHITECTURE.md)** - Diseño técnico del sistema
- **[ Brief del Proyecto](./BRIEF.md)** - Contexto y objetivos
- **[ Google OAuth Setup](./documentacion/GOOGLE-OAUTH-SETUP.md)** - Configurar login con Google
- **[ Password Recovery](./documentacion/PASSWORD-RECOVERY-SETUP.md)** - Sistema de recuperación
- **[ API Documentation (Swagger)](./backend/docs/swagger/README.md)** - Documentación interactiva de la API
- **[ Guion del Video](./GUION-VIDEO.md)** - Script presentación final

---

##  Características Destacadas

###  E-Commerce Completo
-  Catálogo de productos con búsqueda y filtros avanzados
-  Carrito de compras con persistencia local
-  Sistema de stock en tiempo real
-  Proceso de checkout simplificado

###  Autenticación Robusta
-  Registro/Login con JWT + bcrypt
-  OAuth 2.0 con Google
-  Recuperación de contraseña por email
-  Rutas protegidas (frontend + backend)

###  Diseño Premium
-  Paleta de colores cálidos (marrón, beige, dorado)
-  Responsive design (móvil, tablet, escritorio)
-  Accesibilidad WCAG AA
-  Animaciones suaves y profesionales

###  Gestión de Usuario
-  Perfil personalizado
-  Historial de pedidos
-  Lista de favoritos

---

##  Stack Tecnológico

**Frontend:** React 19  Vite 6  React Router 7.1  Context API  Axios  
**Backend:** Node.js 20  Express 4.21  MongoDB 8  Mongoose 8.8  JWT  Passport.js  
**DevOps:** Docker  Docker Compose  Makefile  Netlify  Render  MongoDB Atlas

---

##  Inicio Rápido

### Opción 1: Docker (Recomendado)

```bash
# Clonar repositorio
git clone https://github.com/PowerSystem2024/The-Gods-Of-Programming-cuarto-semestre.git
cd proyecto-final/ecommerce-mern

# Construir y levantar servicios
make build && make up

# Acceder:
# Frontend:  http://localhost:3000
# Backend:   http://localhost:5000/api
# MongoDB:   mongodb://localhost:27017
```

### Opción 2: Desarrollo Local

```bash
# Backend
cd backend
npm install
cp .env.example .env  # Editar con tus configuraciones
npm run dev

# Frontend (nueva terminal)
cd frontend
npm install
cp .env.example .env  # VITE_API_URL=http://localhost:5000/api
npm run dev
```

** Guía detallada:** [DEPLOYMENT-QUICK-START.md](./DEPLOYMENT-QUICK-START.md)

---

##  API Documentation (Swagger/OpenAPI)

Hemos implementado documentación interactiva completa de la API usando **Swagger UI** y **OpenAPI 3.0**.

### Acceder a la Documentación

1. Inicia el servidor backend:
   ```bash
   cd backend
   npm start
   ```

2. Abre tu navegador en:
   - **Interfaz interactiva:** http://localhost:5000/api-docs
   - **Especificación JSON:** http://localhost:5000/api-docs.json

### Características

-  **39 endpoints documentados** organizados en 4 categorías
-  **Autenticación JWT integrada** - Prueba endpoints protegidos directamente
-  **Ejemplos realistas** de requests y responses
-  **Filtros y paginación** completamente documentados
-  **Esquemas de validación** para todos los datos
-  **Try it out** - Prueba la API sin Postman/Insomnia

### Endpoints Documentados

| Categoría | Endpoints | Descripción |
|-----------|-----------|-------------|
| **Auth** | 11 | Registro, login, OAuth, recuperación de contraseña |
| **Products** | 9 | CRUD de productos, búsqueda, filtros, categorías |
| **Cart** | 10 | Gestión del carrito, sincronización, validación |
| **Orders** | 9 | Crear órdenes, tracking, estadísticas admin |

**Documentación completa:** [backend/docs/swagger/README.md](./backend/docs/swagger/README.md)

---

##  Estructura del Proyecto

```
ecommerce-mern/
 backend/                 # API Node.js + Express
    config/             # DB, Auth, Passport
    controllers/        # Lógica de negocio
    models/             # Modelos Mongoose
    routes/             # Rutas API
    middleware/         # Validación, Auth
    Makefile           # Comandos backend
    Dockerfile         # Imagen Docker

 frontend/               # App React + Vite
    src/
       components/    # Componentes reutilizables
       pages/         # Páginas principales
       context/       # Estado global
       services/      # API calls
       styles/        # CSS modular
    Makefile          # Comandos frontend
    Dockerfile        # Imagen Docker

 documentacion/         # Docs técnicas
 docker-compose.yml    # Orquestación
 Makefile              # Comandos principales
 README.md             # Este archivo
```

---

##  Comandos Make Útiles

```bash
# Docker
make help          # Ver todos los comandos
make build         # Construir imágenes
make up            # Levantar servicios
make down          # Detener servicios
make logs          # Ver logs

# Desarrollo local
make install       # Instalar deps (backend + frontend)
make dev-backend   # Iniciar backend
make dev-frontend  # Iniciar frontend

# Base de datos
make seed          # Poblar datos de ejemplo
make db-shell      # MongoDB shell

# Comandos delegados
make backend-dev   # = cd backend && make dev
make frontend-build # = cd frontend && make build
```

** Más comandos:** [README-DOCKER.md](./README-DOCKER.md)

---

##  Equipo

**The Gods of Programming** - Tecnicatura UTN FRRe (2024)

| Integrante | Rol | Responsabilidad |
|------------|-----|-----------------|
| Santiago Ortigoza | Líder Técnico | Arquitectura, Deployment |
| Martín Ramírez | Backend Dev | API, Base de Datos |
| Lucía González | Frontend Dev | UI, Componentes |
| Carlos Fernández | Full Stack | Integración |
| Ana Rodríguez | UI/UX | Diseño, Accesibilidad |

---

##  Estado del Proyecto

###  Completado
- [x] Sistema de autenticación completo (JWT + OAuth)
- [x] Catálogo de productos con filtros
- [x] Carrito de compras funcional
- [x] Recuperación de contraseña
- [x] Panel de usuario
- [x] Dockerización
- [x] Deploy en producción

###  En Progreso
- [ ] Sistema de pagos (Stripe/MercadoPago)
- [ ] Panel de administración
- [ ] Notificaciones push

###  Roadmap Futuro
- [ ] App móvil (React Native)
- [ ] Sistema de reseñas
- [ ] Chat de soporte
- [ ] Analytics y reportes

---

##  Soporte

### Documentación
1. [Manual de Usuario](./MANUAL-USUARIO.md) - Para usuarios finales
2. [Índice de Documentación](./INDICE-DOCUMENTACION.md) - Navegación completa
3. [Troubleshooting](./README-DOCKER.md#-troubleshooting) - Solución de problemas

### Contacto
-  **Email:** soporte@thegodsofprogramming.com
-  **GitHub:** [PowerSystem2024](https://github.com/PowerSystem2024/The-Gods-Of-Programming-cuarto-semestre)
-  **LinkedIn:** [The Gods of Programming](https://linkedin.com/company/thegodsofprogramming)

---

##  Licencia

Este proyecto es de código abierto bajo licencia MIT.

---

<p align="center">
  <strong> Postres Artesanales con Tecnología de Punta</strong><br>
  Hecho con  por <strong>The Gods of Programming</strong><br>
  UTN FRRe - 2024
</p>
