# 🛒 E-Commerce MERN Stack# 🛒 E-Commerce MERN Stack



Una aplicación de comercio electrónico completa desarrollada con el stack MERN (MongoDB, Express, React, Node.js) como proyecto final del cuarto semestre de Tecnicatura.Una aplicación de comercio electrónico completa desarrollada con el stack MERN (MongoDB, Express, React, Node.js) como proyecto final del cuarto semestre de Tecnicatura.



## ✨ Características## ✨ Características



- **🔐 Autenticación de usuarios**: Registro, login y logout- **🔐 Autenticación de usuarios**: Registro, login y logout

- **📱 Gestión de productos**: Catálogo completo con búsqueda y filtros- **� Gestión de productos**: Catálogo completo con búsqueda y filtros

- **🛍️ Carrito de compras**: Funcionalidad completa con Context API- **�️ Carrito de compras**: Funcionalidad completa con Context API

- **💳 Sistema de pedidos**: Gestión completa del flujo de compra- **� Sistema de pedidos**: Gestión completa del flujo de compra

- **📊 Dashboard de administrador**: Panel para gestionar productos y pedidos- **� Dashboard de administrador**: Panel para gestionar productos y pedidos

- **🎨 Diseño responsivo**: Optimizado para desktop y móviles- **🎨 Diseño responsivo**: Optimizado para desktop y móviles

- **⚡ Estado global**: Manejo del estado con React Context API- **⚡ Estado global**: Manejo del estado con React Context API



## 🚀 Tecnologías Utilizadas## 🚀 Tecnologías Utilizadas



### Frontend### Frontend

- **React 18.2.0** - Librería para interfaces de usuario- **React 18.2.0** - Librería para interfaces de usuario

- **React Router 6.8.1** - Navegación entre páginas- **React Router 6.8.1** - Navegación entre páginas

- **React Context API** - Manejo del estado global- **React Context API** - Manejo del estado global

- **CSS3** - Estilos responsivos y modernos- **CSS3** - Estilos responsivos y modernos

- **Vite** - Herramienta de build y desarrollo- **Vite** - Herramienta de build y desarrollo



### Backend### Backend

- **Node.js** - Entorno de ejecución- **Node.js** - Entorno de ejecución

- **Express.js** - Framework web- **Express.js** - Framework web

- **MongoDB** - Base de datos NoSQL- **MongoDB** - Base de datos NoSQL

- **Mongoose** - ODM para MongoDB- **Mongoose** - ODM para MongoDB

- **JWT** - Autenticación con tokens- **Passport.js** - Autenticación

- **bcryptjs** - Encriptación de contraseñas- **bcryptjs** - Encriptación de contraseñas

- **multer** - Manejo de archivos- **JSON Web Tokens** - Tokens de autenticación

- **ES6 Modules** - Sintaxis moderna import/export

## 📋 Prerrequisitos

## Instalación

Antes de comenzar, asegúrate de tener instalado:

1. Clonar el repositorio

- [Node.js](https://nodejs.org/) (versión 16 o superior)\`\`\`bash

- [MongoDB](https://www.mongodb.com/) (local o Atlas)git clone <url-del-repositorio>

- [Git](https://git-scm.com/)cd ecommerce-backend

- Un editor de código (recomendado: VS Code)\`\`\`



## ⚙️ Instalación2. Instalar dependencias

\`\`\`bash

### 1. Clonar el repositorionpm install

\`\`\`

```bash

git clone https://github.com/PowerSystem2024/The-Gods-Of-Programming-cuarto-semestre.git3. Configurar variables de entorno

cd The-Gods-Of-Programming-cuarto-semestre/proyecto-final/ecommerce-mern\`\`\`bash

```cp .env.example .env

# Editar .env con tus configuraciones

### 2. Configurar el Backend\`\`\`



```bash4. Ejecutar en modo desarrollo

# Navegar al directorio del backend\`\`\`bash

cd backendnpm run dev

\`\`\`

# Instalar dependencias

npm install## Estructura del Proyecto



# Crear archivo de variables de entorno\`\`\`

cp .env.example .envbackend/

```├── config/

│   └── database.config.js   # Configuración de MongoDB

Editar el archivo `.env` con tus configuraciones:├── models/

│   ├── user.model.js       # Modelo de usuario

```env│   └── product.model.js    # Modelo de producto

# Puerto del servidor├── routes/                 # Rutas de la API

PORT=5000├── middleware/             # Middlewares personalizados

├── uploads/               # Archivos subidos

# URL de MongoDB├── .env.example           # Ejemplo de variables de entorno

MONGODB_URI=mongodb://localhost:27017/ecommerce├── .gitignore            # Archivos ignorados por Git

# O para MongoDB Atlas:├── server.js             # Punto de entrada del servidor

# MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/ecommerce└── package.json          # Dependencias y scripts (con ES6 modules)

\`\`\`

# Clave secreta para JWT

JWT_SECRET=tu_clave_secreta_super_segura_aqui## Modelos de Datos



# Configuración de archivos### Usuario (User)

UPLOAD_PATH=uploads/- Información personal (nombre, email, teléfono)

- Dirección de envío

# Configuración de CORS (opcional)- Carrito de compras

CLIENT_URL=http://localhost:3000- Lista de deseos

```- Historial de pedidos

- Rol (usuario/administrador)

### 3. Configurar el Frontend

### Producto (Product)

```bash- Información básica (nombre, descripción, precio)

# Abrir nueva terminal y navegar al frontend- Inventario y variantes

cd ../frontend- Imágenes y SEO

- Reseñas y calificaciones

# Instalar dependencias- Categorías y etiquetas

npm install

```## Scripts Disponibles



Crear archivo `.env` en el frontend:- \`npm start\` - Ejecutar en producción

- \`npm run dev\` - Ejecutar en desarrollo con nodemon

```env- \`npm test\` - Ejecutar tests (pendiente)

# URL del backend

VITE_API_URL=http://localhost:5000/api## Variables de Entorno

```

Ver \`.env.example\` para la lista completa de variables necesarias.

## 🚀 Ejecución

## Estado del Desarrollo

### Desarrollo

### ✅ Commit 1 - Configuración inicial (ACTUALIZADO A ES6)

#### Opción 1: Ejecutar ambos servidores por separado- [x] Configuración del servidor Express con ES6 modules

- [x] Conexión a MongoDB (database.config.js)

**Terminal 1 - Backend:**- [x] Modelos con nomenclatura nueva (user.model.js, product.model.js)

```bash- [x] Estructura básica del proyecto

cd backend- [x] Migración completa a sintaxis ES6 import/export

npm run dev

```### ✅ Commit 2 - Sistema de autenticación (COMPLETADO)

- [x] Configuración completa de Passport.js (auth.config.js)

**Terminal 2 - Frontend:**- [x] Estrategias de autenticación: Local y JWT

```bash- [x] Controlador de autenticación (auth.controller.js)

cd frontend- [x] Rutas de registro y login (/api/auth/*)

npm run dev- [x] Middlewares de autenticación y validación

```- [x] Encriptación de contraseñas con bcryptjs

- [x] Manejo de sesiones y tokens JWT

#### Opción 2: Ejecutar desde la raíz (si está configurado)

```bash### 📋 Próximos Commits

# Desde la raíz del proyecto- [ ] Commit 3: CRUD de productos

npm run dev- [ ] Commit 4: Sistema de carrito

```- [ ] Commit 5: Frontend con React



### Producción## Contribución



#### BackendEste proyecto está siendo desarrollado como parte de un ejercicio académico siguiendo la metodología de desarrollo incremental por commits.

```bash

cd backend## Licencia

npm run build

npm startMIT
```

#### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## 📁 Estructura del Proyecto

```
ecommerce-mern/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   └── orderController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── cart.js
│   │   └── orders.js
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   └── Layout.css
│   │   ├── context/
│   │   │   └── CartContext.js
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   └── Orders.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🔧 Funcionalidades Principales

### Usuarios
- **Registro**: Crear cuenta nueva
- **Login**: Iniciar sesión
- **Perfil**: Ver y editar información personal
- **Historial**: Ver pedidos realizados

### Productos
- **Catálogo**: Ver todos los productos disponibles
- **Detalles**: Información completa de cada producto
- **Búsqueda**: Encontrar productos específicos
- **Categorías**: Filtrar por tipo de producto

### Carrito
- **Agregar productos**: Añadir items al carrito
- **Gestión**: Modificar cantidades y eliminar productos
- **Persistencia**: El carrito se mantiene entre sesiones
- **Estado global**: Sincronización en toda la aplicación

### Pedidos
- **Crear pedidos**: Finalizar compras
- **Seguimiento**: Ver estado de los pedidos
- **Historial**: Acceso a compras anteriores

## 🎨 Características de UI/UX

- **Diseño Responsivo**: Adaptable a todos los dispositivos
- **Navegación Intuitiva**: Menús claros y accesibles
- **Feedback Visual**: Indicadores de estado y notificaciones
- **Carga Rápida**: Optimizada para rendimiento
- **Accesibilidad**: Cumple estándares de accesibilidad web

## 🧪 Scripts Disponibles

### Backend
```json
{
  "dev": "nodemon server.js",
  "start": "node server.js",
  "build": "echo 'Backend build completed'",
  "test": "jest"
}
```

### Frontend
```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "lint": "eslint src --ext .js,.jsx"
}
```

## 🐛 Solución de Problemas

### Errores Comunes

1. **Error de conexión a MongoDB**
   ```
   MongoNetworkError: failed to connect to server
   ```
   - Verifica que MongoDB esté ejecutándose
   - Revisa la URL de conexión en `.env`
   - Asegúrate de tener permisos de acceso

2. **Error CORS**
   ```
   Access to fetch blocked by CORS policy
   ```
   - Verifica la configuración de CORS en el backend
   - Asegúrate de que la URL del cliente esté permitida

3. **Error de dependencias**
   ```
   Module not found
   ```
   - Ejecuta `npm install` en el directorio correspondiente
   - Elimina `node_modules` y `package-lock.json`, luego reinstala

4. **Error de variables de entorno**
   ```
   undefined environment variable
   ```
   - Verifica que los archivos `.env` existan y tengan las variables correctas
   - Reinicia el servidor después de cambios en `.env`

## 📚 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil del usuario

### Productos
- `GET /api/products` - Listar productos
- `GET /api/products/:id` - Obtener producto por ID
- `POST /api/products` - Crear producto (admin)
- `PUT /api/products/:id` - Actualizar producto (admin)
- `DELETE /api/products/:id` - Eliminar producto (admin)

### Carrito
- `GET /api/cart` - Obtener carrito del usuario
- `POST /api/cart/add` - Agregar producto al carrito
- `PUT /api/cart/update` - Actualizar cantidad de producto
- `DELETE /api/cart/remove/:productId` - Eliminar producto del carrito
- `DELETE /api/cart/clear` - Vaciar carrito

### Pedidos
- `GET /api/orders` - Listar pedidos del usuario
- `POST /api/orders` - Crear nuevo pedido
- `GET /api/orders/:id` - Obtener pedido por ID

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - mira el archivo [LICENSE.md](LICENSE.md) para detalles.

## 👥 Autores

- **Los Dioses de la Programación** - *Desarrollo inicial* - [PowerSystem2024](https://github.com/PowerSystem2024)

## 🙏 Agradecimientos

- Profesores y compañeros de la Tecnicatura
- Comunidad de desarrolladores MERN
- Documentación oficial de React, Node.js y MongoDB
- Recursos educativos y tutoriales consultados

## 📞 Soporte

Si tienes alguna pregunta o necesitas ayuda, puedes:

- Abrir un [issue](https://github.com/PowerSystem2024/The-Gods-Of-Programming-cuarto-semestre/issues)
- Contactar al equipo de desarrollo
- Revisar la documentación técnica

---

⭐ ¡No olvides dar una estrella al proyecto si te resultó útil!