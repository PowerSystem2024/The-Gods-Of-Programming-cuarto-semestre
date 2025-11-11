# 📚 Índice de Documentación Swagger/OpenAPI

Este directorio contiene toda la documentación interactiva de la API del E-commerce MERN.

---

## 📁 Archivos Principales

### 🔧 Configuración
| Archivo | Descripción | Líneas |
|---------|-------------|--------|
| **[../config/swagger.config.js](../../config/swagger.config.js)** | Configuración OpenAPI 3.0 completa | ~434 |
| **[../server.js](../../server.js)** | Integración de Swagger UI | Modificado |

### 📝 Documentación de Endpoints
| Archivo | Categoría | Endpoints | Líneas |
|---------|-----------|-----------|--------|
| **[auth.swagger.js](./auth.swagger.js)** | Autenticación | 11 | ~370 |
| **[products.swagger.js](./products.swagger.js)** | Productos | 9 | ~525 |
| **[cart.swagger.js](./cart.swagger.js)** | Carrito | 10 | ~480 |
| **[orders.swagger.js](./orders.swagger.js)** | Órdenes | 9 | ~570 |

### 📖 Guías y Documentación
| Archivo | Propósito | Audiencia |
|---------|-----------|-----------|
| **[README.md](./README.md)** | Documentación completa de la API | Desarrolladores |
| **[QUICK-START.md](./QUICK-START.md)** | Guía rápida de inicio | Todos |
| **[IMPLEMENTATION.md](./IMPLEMENTATION.md)** | Resumen de implementación | Equipo técnico |
| **[CHANGELOG.md](./CHANGELOG.md)** | Historial de cambios | Todos |
| **[INDEX.md](./INDEX.md)** | Este archivo | Navegación |

### 🧪 Scripts de Prueba
| Archivo | Plataforma | Descripción |
|---------|------------|-------------|
| **[test-swagger.sh](../test-swagger.sh)** | Linux/Mac | Script bash de prueba |
| **[test-swagger.ps1](../test-swagger.ps1)** | Windows | Script PowerShell de prueba |

---

## 🚀 Inicio Rápido

### 1️⃣ Instalación
```bash
cd backend
npm install
```

### 2️⃣ Iniciar Servidor
```bash
npm start
```

### 3️⃣ Acceder a Swagger UI
```
http://localhost:5000/api-docs
```

---

## 📊 Estadísticas Generales

```
Total de Archivos:          13
Total de Líneas:         ~3,091+
Total de Endpoints:          39
Total de Esquemas:            8
Total de Tags:                4
```

### Desglose por Categoría

| Categoría | Endpoints | Métodos HTTP | Requiere Auth | Solo Admin |
|-----------|-----------|--------------|---------------|------------|
| **Auth** | 11 | GET, POST, PUT | Parcial | No |
| **Products** | 9 | GET, POST, PUT, DELETE | Parcial | Sí (CRUD) |
| **Cart** | 10 | GET, POST, PUT, DELETE | Sí | No |
| **Orders** | 9 | GET, POST, PUT | Sí | Sí (gestión) |

---

## 🔐 Autenticación

### Endpoints Públicos (No requieren autenticación)
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/google
GET    /api/auth/google/callback
POST   /api/auth/forgot-password
POST   /api/auth/reset-password/{token}
GET    /api/products
GET    /api/products/{id}
GET    /api/products/category/{category}
GET    /api/products/featured
GET    /api/products/search/{query}
GET    /api/orders/{orderNumber}/track
```

### Endpoints Protegidos (Requieren JWT)
```
POST   /api/auth/logout
GET    /api/auth/me
PUT    /api/auth/profile
PUT    /api/auth/change-password
GET    /api/cart
POST   /api/cart
PUT    /api/cart/{productId}
DELETE /api/cart/{productId}
DELETE /api/cart/clear
GET    /api/cart/count
POST   /api/cart/sync
POST   /api/cart/validate
GET    /api/cart/checkout/preview
POST   /api/cart/apply-coupon
POST   /api/orders
GET    /api/orders
GET    /api/orders/{id}
PUT    /api/orders/{id}/cancel
```

### Endpoints Solo Admin
```
POST   /api/products
PUT    /api/products/{id}
DELETE /api/products/{id}
GET    /api/products/admin/stats
GET    /api/orders/admin/all
PUT    /api/orders/admin/{id}/status
PUT    /api/orders/admin/{id}/payment-status
GET    /api/orders/admin/stats
```

---

## 📋 Esquemas de Datos

### User
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['user', 'admin']),
  cart: [CartItem],
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Product
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  category: String (enum: ['tortas', 'pastelitos', 'galletas', 'postres', 'otros']),
  stock: Number,
  images: [String],
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### CartItem
```javascript
{
  product: ObjectId (ref: Product),
  name: String,
  price: Number,
  quantity: Number,
  subtotal: Number
}
```

### Order
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  orderNumber: String (unique),
  items: [OrderItem],
  contactInfo: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    DNI: String
  },
  shippingAddress: {
    street: String,
    number: String,
    floor: String,
    apartment: String,
    city: String,
    province: String,
    postalCode: String,
    country: String
  },
  paymentMethod: String (enum: ['transferencia', 'mercadopago', 'efectivo']),
  subtotal: Number,
  shippingCost: Number,
  total: Number,
  status: String (enum: ['pendiente', 'confirmado', 'en_preparacion', 'enviado', 'entregado', 'cancelado']),
  paymentStatus: String (enum: ['pendiente', 'pagado', 'rechazado']),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

---

## 🎨 Enumeraciones

### Categorías de Productos
```
tortas         - Tortas y pasteles grandes
pastelitos     - Pastelitos y productos pequeños
galletas       - Galletas, cookies y similares
postres        - Postres variados
otros          - Otros productos de pastelería
```

### Métodos de Pago
```
transferencia  - Transferencia bancaria
mercadopago    - Pago con MercadoPago
efectivo       - Pago en efectivo contra entrega
```

### Estados de Orden
```
pendiente      - Orden recibida, esperando confirmación
confirmado     - Orden confirmada, próxima a preparación
en_preparacion - Orden en proceso de preparación
enviado        - Orden enviada al cliente
entregado      - Orden entregada exitosamente
cancelado      - Orden cancelada
```

### Estados de Pago
```
pendiente      - Pago pendiente de confirmación
pagado         - Pago confirmado y procesado
rechazado      - Pago rechazado o fallido
```

---

## 🔍 Filtros y Búsqueda

### Productos
**Parámetros disponibles:**
- `search` (string) - Buscar en nombre y descripción
- `category` (enum) - Filtrar por categoría
- `minPrice` (number) - Precio mínimo
- `maxPrice` (number) - Precio máximo
- `sortBy` (enum) - Ordenar: price_asc, price_desc, name_asc, name_desc, newest, oldest
- `inStock` (boolean) - Solo productos en stock
- `page` (number) - Número de página (default: 1)
- `limit` (number) - Items por página (default: 12, max: 100)

**Ejemplo:**
```
GET /api/products?search=chocolate&category=tortas&minPrice=1000&maxPrice=5000&sortBy=price_asc&page=1&limit=12
```

### Órdenes
**Parámetros disponibles:**
- `status` (enum) - Filtrar por estado de orden
- `paymentStatus` (enum) - Filtrar por estado de pago (solo admin)
- `sortBy` (enum) - Ordenar: createdAt_desc, createdAt_asc, total_desc, total_asc
- `page` (number) - Número de página
- `limit` (number) - Items por página (max: 50 user, 100 admin)

**Ejemplo:**
```
GET /api/orders?status=pendiente&sortBy=createdAt_desc&page=1&limit=10
```

---

## 📱 Respuestas HTTP

### Códigos de Estado
| Código | Nombre | Descripción |
|--------|--------|-------------|
| 200 | OK | Solicitud exitosa |
| 201 | Created | Recurso creado exitosamente |
| 400 | Bad Request | Datos inválidos o faltantes |
| 401 | Unauthorized | No autenticado (falta token o es inválido) |
| 403 | Forbidden | No autorizado (sin permisos suficientes) |
| 404 | Not Found | Recurso no encontrado |
| 500 | Server Error | Error interno del servidor |

### Formato de Respuestas

**Éxito:**
```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Descripción del error",
  "errors": [
    {
      "field": "email",
      "message": "Email es requerido"
    }
  ]
}
```

---

## 🛠️ Herramientas Compatibles

### Importar Especificación
Puedes importar la especificación OpenAPI en:

- **Postman**: File → Import → http://localhost:5000/api-docs.json
- **Insomnia**: Create → Import → From URL
- **API Testing Tools**: Cualquier herramienta compatible con OpenAPI 3.0

### Generar Clientes
Usando la especificación puedes generar clientes automáticos:

```bash
# Instalar OpenAPI Generator
npm install -g @openapitools/openapi-generator-cli

# Generar cliente TypeScript
openapi-generator-cli generate \
  -i http://localhost:5000/api-docs.json \
  -g typescript-axios \
  -o ./client

# Generar cliente Python
openapi-generator-cli generate \
  -i http://localhost:5000/api-docs.json \
  -g python \
  -o ./client-python
```

---

## 📞 Soporte y Contribución

### ¿Encontraste un error en la documentación?
1. Revisa los archivos `.swagger.js` en este directorio
2. Verifica la sintaxis YAML en los comentarios JSDoc
3. Reinicia el servidor después de cambios
4. Consulta la consola para errores de Swagger

### ¿Quieres agregar nuevos endpoints?
1. Crea o edita un archivo `.swagger.js` en este directorio
2. Usa el formato JSDoc con `@swagger`
3. Sigue la estructura de los archivos existentes
4. Reinicia el servidor para ver los cambios
5. Verifica en http://localhost:5000/api-docs

---

## 📚 Recursos Adicionales

- [OpenAPI 3.0 Specification](https://swagger.io/specification/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
- [Swagger JSDoc GitHub](https://github.com/Surnet/swagger-jsdoc)
- [OpenAPI Generator](https://openapi-generator.tech/)

---

## 📄 Licencia

MIT License - Ver LICENSE en la raíz del proyecto

---

**Última actualización**: Enero 2024  
**Versión de OpenAPI**: 3.0.0  
**Proyecto**: E-commerce MERN - The Gods of Programming
