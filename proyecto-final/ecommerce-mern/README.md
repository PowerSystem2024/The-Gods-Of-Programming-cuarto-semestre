# E-commerce Backend - MERN Stack

## Descripción

Backend para aplicación de e-commerce desarrollada con Node.js, Express y MongoDB usando el stack MERN.

## Características

- 🔐 Autenticación con Passport.js
- 🛒 Carrito de compras nativo
- 📦 Gestión de productos completa
- 👥 Sistema de usuarios con roles
- 🔍 Búsqueda y filtrado de productos
- ⭐ Sistema de reseñas y calificaciones
- 📊 Panel de administración

## Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **Passport.js** - Autenticación
- **bcryptjs** - Encriptación de contraseñas
- **JSON Web Tokens** - Tokens de autenticación
- **ES6 Modules** - Sintaxis moderna import/export

## Instalación

1. Clonar el repositorio
\`\`\`bash
git clone <url-del-repositorio>
cd ecommerce-backend
\`\`\`

2. Instalar dependencias
\`\`\`bash
npm install
\`\`\`

3. Configurar variables de entorno
\`\`\`bash
cp .env.example .env
# Editar .env con tus configuraciones
\`\`\`

4. Ejecutar en modo desarrollo
\`\`\`bash
npm run dev
\`\`\`

## Estructura del Proyecto

\`\`\`
backend/
├── config/
│   └── database.config.js   # Configuración de MongoDB
├── models/
│   ├── user.model.js       # Modelo de usuario
│   └── product.model.js    # Modelo de producto
├── routes/                 # Rutas de la API
├── middleware/             # Middlewares personalizados
├── uploads/               # Archivos subidos
├── .env.example           # Ejemplo de variables de entorno
├── .gitignore            # Archivos ignorados por Git
├── server.js             # Punto de entrada del servidor
└── package.json          # Dependencias y scripts (con ES6 modules)
\`\`\`

## Modelos de Datos

### Usuario (User)
- Información personal (nombre, email, teléfono)
- Dirección de envío
- Carrito de compras
- Lista de deseos
- Historial de pedidos
- Rol (usuario/administrador)

### Producto (Product)
- Información básica (nombre, descripción, precio)
- Inventario y variantes
- Imágenes y SEO
- Reseñas y calificaciones
- Categorías y etiquetas

## Scripts Disponibles

- \`npm start\` - Ejecutar en producción
- \`npm run dev\` - Ejecutar en desarrollo con nodemon
- \`npm test\` - Ejecutar tests (pendiente)

## Variables de Entorno

Ver \`.env.example\` para la lista completa de variables necesarias.

## Estado del Desarrollo

### ✅ Commit 1 - Configuración inicial (ACTUALIZADO A ES6)
- [x] Configuración del servidor Express con ES6 modules
- [x] Conexión a MongoDB (database.config.js)
- [x] Modelos con nomenclatura nueva (user.model.js, product.model.js)
- [x] Estructura básica del proyecto
- [x] Migración completa a sintaxis ES6 import/export

### 📋 Próximos Commits
- [ ] Commit 2: Rutas de autenticación
- [ ] Commit 3: CRUD de productos
- [ ] Commit 4: Sistema de carrito
- [ ] Commit 5: Frontend con React

## Contribución

Este proyecto está siendo desarrollado como parte de un ejercicio académico siguiendo la metodología de desarrollo incremental por commits.

## Licencia

MIT