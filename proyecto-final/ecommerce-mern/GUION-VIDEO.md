# 🎬 GUION VIDEO PRESENTACIÓN FINAL
## SweetCommerce - E-commerce MERN Stack

**⏱️ Duración Total:** 25-30 minutos  
**👥 Participantes:** 5 integrantes

---

# 📋 ESTRUCTURA DEL VIDEO

## 🎯 INTRODUCCIÓN (3-4 minutos)
**Presentador: Integrante 1 (Líder Técnico)**

### Contenido:
1. **Presentación del equipo** (30 seg)
   - "Somos el equipo [nombre] y les presentamos SweetCommerce"
   - Nombre de cada integrante y su rol

2. **¿Qué es SweetCommerce?** (1 min)
   - E-commerce de postres artesanales gourmet
   - Problema que resuelve
   - Propuesta de valor única

3. **Tecnologías Utilizadas** (2 min)
   - **Mostrar diagrama de arquitectura** (ARCHITECTURE.md)
   - Stack tecnológico completo:
     - Frontend: React 19 + Vite + React Router
     - Backend: Node.js + Express + MongoDB
     - Autenticación: JWT + Google OAuth
     - Deployment: Render + Netlify + MongoDB Atlas

### Archivos a mostrar en pantalla:
```
📁 ARCHITECTURE.md        → Diagrama visual
📁 package.json (ambos)   → Dependencias instaladas
📁 netlify.toml          → Configuración de deployment
```

---

## 🔐 CASO DE USO 1: Autenticación de Usuarios (5-6 minutos)
**Presentador: Integrante 2**

### Demostración en vivo:
1. **Registro de nuevo usuario** (1.5 min)
   - Ir a `/register`
   - Llenar formulario
   - Mostrar validaciones en tiempo real
   - Usuario creado exitosamente

2. **Login con credenciales** (1 min)
   - Ir a `/login`
   - Iniciar sesión
   - Mostrar token JWT en localStorage (F12)

3. **Google OAuth** (1 min)
   - Click en "Continuar con Google"
   - Proceso de autenticación
   - Usuario autenticado

4. **Recuperación de contraseña** (1.5 min)
   - Click en "¿Olvidaste tu contraseña?"
   - Ingresar email
   - Mostrar email recibido con token
   - Cambiar contraseña con el link

### Explicación del código:

#### **Backend:**
```
📁 backend/models/user.model.js
   → Esquema de usuario (líneas 1-40)
   → Campos: email, password, resetPasswordToken, etc.

📁 backend/controllers/auth.controller.js
   → register() - Líneas 15-70
   → login() - Líneas 75-120
   → forgotPassword() - Líneas 420-480
   → resetPassword() - Líneas 515-580

📁 backend/config/passport.config.js
   → Estrategia Google OAuth (líneas 10-60)

📁 backend/middleware/auth.middleware.js
   → verifyToken() - Verificación de JWT
```

#### **Frontend:**
```
📁 frontend/src/pages/Register.jsx
   → Formulario de registro (líneas 20-100)

📁 frontend/src/pages/Login.jsx
   → Formulario de login + Google button (líneas 15-90)

📁 frontend/src/pages/ForgotPassword.jsx
   → Solicitud de recuperación (líneas 10-60)

📁 frontend/src/pages/ResetPassword.jsx
   → Formulario nueva contraseña (líneas 15-80)

📁 frontend/src/services/api.js
   → Configuración de Axios + interceptores JWT (líneas 1-40)
```

### Puntos clave a explicar:
- Hash de contraseñas con bcrypt
- Generación y verificación de JWT
- Tokens de recuperación con crypto (SHA256)
- Expiración de tokens (1 hora)
- Envío de emails con Nodemailer

---

## 🛍️ CASO DE USO 2: Catálogo de Productos (5-6 minutos)
**Presentador: Integrante 3**

### Demostración en vivo:
1. **Ver catálogo completo** (1 min)
   - Ir a `/products`
   - Mostrar grid de productos con imágenes

2. **Filtros y búsqueda** (2 min)
   - Filtrar por categoría (Tartas, Alfajores, etc.)
   - Buscar por nombre
   - Ordenar por precio

3. **Ver detalle de producto** (2 min)
   - Click en un producto
   - Ver galería de imágenes
   - Descripción completa
   - Selector de cantidad
   - Botón "Agregar al carrito"

### Explicación del código:

#### **Backend:**
```
📁 backend/models/product.model.js
   → Esquema de producto (líneas 1-80)
   → Campos: name, price, category, images[], stock

📁 backend/controllers/product.controller.js
   → getAllProducts() - Líneas 10-60 (paginación, filtros)
   → getProductById() - Líneas 65-85
   → searchProducts() - Líneas 90-130

📁 backend/routes/product.routes.js
   → GET /api/products
   → GET /api/products/:id
   → GET /api/products/search

📁 backend/seed-products.js
   → Script de seed inicial de productos
```

#### **Frontend:**
```
📁 frontend/src/pages/Products.jsx
   → Vista principal de catálogo (líneas 20-150)

📁 frontend/src/components/ProductCard.jsx
   → Card individual de producto (líneas 1-120)
   → getCategoryIcon() - Emojis por categoría

📁 frontend/src/components/SearchFilters.jsx
   → Barra de búsqueda y filtros (líneas 15-200)

📁 frontend/src/pages/ProductDetail.jsx
   → Vista de detalle completo (líneas 20-250)
   → Galería de imágenes, descripción, agregar al carrito
```

### Puntos clave a explicar:
- Estructura de documento en MongoDB
- Filtros y queries con Mongoose
- Manejo de imágenes (URLs de Unsplash)
- Componentes reutilizables en React
- Props y estado local

---

## 🛒 CASO DE USO 3: Carrito de Compras y Órdenes (5-6 minutos)
**Presentador: Integrante 4**

### Demostración en vivo:
1. **Agregar productos al carrito** (1 min)
   - Desde detalle de producto
   - Seleccionar cantidad
   - Agregar múltiples productos

2. **Ver y gestionar carrito** (2 min)
   - Ir a `/cart`
   - Ver lista de productos
   - Modificar cantidades
   - Eliminar items
   - Ver subtotal calculado

3. **Proceso de checkout** (2 min)
   - Click en "Proceder al pago"
   - Ver resumen de orden
   - Confirmar compra
   - Orden creada exitosamente

### Explicación del código:

#### **Backend:**
```
📁 backend/controllers/cart.controller.js
   → addToCart() - Líneas 15-80
   → updateCartItem() - Líneas 85-130
   → removeFromCart() - Líneas 135-170
   → getCart() - Líneas 10-50

📁 backend/middleware/cart.validation.js
   → Validación de stock disponible
   → Validación de cantidades

📁 backend/routes/cart.routes.js
   → POST /api/cart/add
   → PUT /api/cart/update/:productId
   → DELETE /api/cart/remove/:productId
   → GET /api/cart
```

#### **Frontend:**
```
📁 frontend/src/context/CartContext.jsx
   → Context API para estado global del carrito (líneas 1-150)
   → addToCart(), updateQuantity(), removeItem(), clearCart()

📁 frontend/src/pages/Cart.jsx
   → Vista del carrito (líneas 20-300)
   → Cálculo de totales, listado de items

📁 frontend/src/components/ProductDetail.jsx
   → Botón "Agregar al carrito" (líneas 180-220)
```

### Puntos clave a explicar:
- Context API para estado global
- Persistencia en localStorage
- Validación de stock en backend
- Cálculo de totales (subtotal, envío, total)
- Manejo de errores (producto sin stock)

---

## 🎨 CASO DE USO 4: Experiencia de Usuario (UI/UX) (4-5 minutos)
**Presentador: Integrante 5**

### Demostración en vivo:
1. **Diseño responsive** (2 min)
   - Mostrar en desktop (F12 → Responsive mode)
   - Mostrar en tablet
   - Mostrar en móvil
   - Menú hamburguesa en mobile

2. **Navegación fluida** (1.5 min)
   - React Router en acción
   - Navegación sin recargas de página
   - Breadcrumbs y volver atrás

3. **Perfil de usuario** (1.5 min)
   - Ir a `/profile`
   - Ver datos personales
   - Editar información
   - Cambiar contraseña

### Explicación del código:

#### **Frontend:**
```
📁 frontend/src/App.jsx
   → Configuración de rutas con React Router (líneas 1-80)
   → Rutas protegidas

📁 frontend/src/components/Layout.jsx
   → Header, Footer, Navbar (líneas 1-150)
   → Responsive design

📁 frontend/src/components/ProtectedRoute.jsx
   → HOC para rutas que requieren autenticación (líneas 1-40)

📁 frontend/src/styles/
   → colors.css - Paleta de colores
   → global.css - Estilos globales
   → layout.css - Grid y flexbox
   → product.css - Componentes de productos
   → cart.css - Estilos del carrito
   → profile.css - Página de perfil

📁 frontend/src/pages/Profile.jsx
   → Vista de perfil de usuario (líneas 1-250)
   → Edición de datos, cambio de contraseña
```

### Puntos clave a explicar:
- CSS modular por componente
- Variables CSS para colores y tipografías
- Flexbox y Grid para layouts
- Media queries para responsive
- React Router para SPA
- Context API para autenticación

---

## 🚀 DEPLOYMENT Y ARQUITECTURA (3-4 minutos)
**Presentador: Integrante 1 (Cierre)**

### Contenido:

1. **Arquitectura de deployment** (2 min)
   - **Mostrar diagrama en pantalla**
   - Monorepo: Un repositorio, dos deploys
   - Backend en Render (Node.js)
   - Frontend en Netlify (React SPA)
   - MongoDB Atlas (base de datos en la nube)

2. **Variables de entorno** (1 min)
   - Backend: MONGODB_URI, JWT_SECRET, FRONTEND_URL
   - Frontend: VITE_API_URL

3. **Flujo de CI/CD** (1 min)
   - Git push → GitHub
   - Netlify auto-deploy del frontend
   - Render auto-deploy del backend
   - Zero-downtime deployment

### Archivos a mostrar:
```
📁 netlify.toml                    → Config de Netlify
📁 backend/DEPLOYMENT.md          → Guía de deployment backend
📁 frontend/DEPLOYMENT.md         → Guía de deployment frontend
📁 DEPLOYMENT-QUICK-START.md      → Resumen rápido
📁 ARCHITECTURE.md                → Diagrama completo
```

### Demo final:
- **Mostrar app en producción:**
  - URL de Netlify funcionando
  - URL de Render/API respondiendo
  - Realizar una compra completa end-to-end

---

## 🎓 CONCLUSIONES (2 minutos)
**Presentador: Todos (rotativo)**

### Aprendizajes del equipo:
- Cada integrante menciona 1 aprendizaje clave
- Desafíos enfrentados
- Próximos pasos / mejoras futuras

### Posibles mejoras:
- Integración de pagos (Stripe/PayPal)
- Sistema de reviews y ratings
- Panel de administración
- Notificaciones push
- App móvil con React Native

---

# 📝 TIPS PARA LA GRABACIÓN

## ✅ Antes de grabar:
- [ ] Tener la app desplegada y funcionando
- [ ] Preparar datos de prueba (usuarios, productos)
- [ ] Probar todo el flujo completo
- [ ] Tener VS Code abierto con los archivos clave
- [ ] Preparar pantalla compartida (cerrar pestañas innecesarias)

## 🎥 Durante la grabación:
- [ ] Grabar en 1080p mínimo
- [ ] Usar micrófono de buena calidad
- [ ] Hablar claro y pausado
- [ ] Zoom a partes importantes del código
- [ ] No leer código línea por línea, explicar la lógica
- [ ] Mostrar resultado visual después de cada explicación

## 🗣️ Lenguaje:
- ✅ Técnico pero comprensible
- ✅ Explicar acrónimos la primera vez (JWT, API, SPA)
- ✅ Usar analogías cuando sea necesario
- ❌ Evitar muletillas ("ehh", "este", "o sea")

---

# 📊 DISTRIBUCIÓN DE TIEMPO

| Sección | Presentador | Tiempo |
|---------|------------|--------|
| Introducción + Tecnologías | Integrante 1 | 3-4 min |
| Caso 1: Autenticación | Integrante 2 | 5-6 min |
| Caso 2: Catálogo | Integrante 3 | 5-6 min |
| Caso 3: Carrito/Órdenes | Integrante 4 | 5-6 min |
| Caso 4: UI/UX | Integrante 5 | 4-5 min |
| Deployment + Cierre | Integrante 1 | 3-4 min |
| **TOTAL** | | **25-30 min** |

---

# 🎬 ORDEN RECOMENDADO DE GRABACIÓN

## Opción A: Grabación en vivo (todos juntos)
1. Hacer un ensayo completo antes
2. Grabar de corrido con transiciones naturales
3. Editar para quitar pausas largas

## Opción B: Grabación por partes (individual)
1. Cada integrante graba su sección
2. Usar intro/outro consistente
3. Editar todo junto con transiciones
4. Agregar música de fondo suave

---

# 📦 ENTREGABLES

1. **Video final** (MP4, máx 30 min)
2. **Repositorio GitHub** con código completo
   - https://github.com/PowerSystem2024/The-Gods-Of-Programming-cuarto-semestre
3. **Brief actualizado** (BRIEF.md)
4. **Documentación técnica** (DEPLOYMENT.md, README.md, GUION-VIDEO.md)
5. **Apps desplegadas:**
   - **Frontend:** https://thegodsofprogrammingfrontend.netlify.app
   - **Backend API:** https://ecommerce-backend-a4a0.onrender.com/api
   - **Health Check:** https://ecommerce-backend-a4a0.onrender.com/api/health

---

## 🎬 URLs PARA EL VIDEO

Usar estas URLs durante la presentación:

- **Demo en producción:** https://thegodsofprogrammingfrontend.netlify.app
- **API Backend:** https://ecommerce-backend-a4a0.onrender.com/api
- **Repositorio:** https://github.com/PowerSystem2024/The-Gods-Of-Programming-cuarto-semestre

---

¡Éxito con la presentación! 🚀🍰
