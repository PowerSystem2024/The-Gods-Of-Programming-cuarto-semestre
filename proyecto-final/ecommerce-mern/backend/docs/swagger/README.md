# Documentación de API - E-commerce MERN

Esta carpeta contiene la documentación completa de la API del proyecto E-commerce MERN utilizando OpenAPI 3.0 (Swagger).

## 📁 Estructura de Archivos

```
docs/swagger/
├── auth.swagger.js       # Endpoints de autenticación
├── products.swagger.js   # Endpoints de productos
├── cart.swagger.js       # Endpoints del carrito
└── orders.swagger.js     # Endpoints de órdenes
```

## 🚀 Acceder a la Documentación

Una vez que el servidor esté corriendo, puedes acceder a la documentación interactiva en:

- **Interfaz Swagger UI**: http://localhost:5000/api-docs
- **Especificación JSON**: http://localhost:5000/api-docs.json

## 📚 Endpoints Documentados

### Autenticación (`auth.swagger.js`)
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/me` - Obtener usuario actual
- `PUT /api/auth/profile` - Actualizar perfil
- `PUT /api/auth/change-password` - Cambiar contraseña
- `GET /api/auth/google` - OAuth con Google
- `GET /api/auth/google/callback` - Callback OAuth
- `POST /api/auth/forgot-password` - Solicitar reset de contraseña
- `POST /api/auth/reset-password/{token}` - Restablecer contraseña

### Productos (`products.swagger.js`)
- `GET /api/products` - Listar productos (con filtros y paginación)
- `GET /api/products/{id}` - Obtener producto por ID
- `POST /api/products` - Crear producto (Admin)
- `PUT /api/products/{id}` - Actualizar producto (Admin)
- `DELETE /api/products/{id}` - Eliminar producto (Admin)
- `GET /api/products/category/{category}` - Productos por categoría
- `GET /api/products/featured` - Productos destacados
- `GET /api/products/search/{query}` - Buscar productos
- `GET /api/products/admin/stats` - Estadísticas (Admin)

### Carrito (`cart.swagger.js`)
- `GET /api/cart` - Obtener carrito del usuario
- `POST /api/cart` - Agregar producto al carrito
- `PUT /api/cart/{productId}` - Actualizar cantidad
- `DELETE /api/cart/{productId}` - Eliminar producto del carrito
- `DELETE /api/cart/clear` - Vaciar carrito
- `GET /api/cart/count` - Cantidad de items
- `POST /api/cart/sync` - Sincronizar carrito local
- `POST /api/cart/validate` - Validar disponibilidad
- `GET /api/cart/checkout/preview` - Preview de checkout
- `POST /api/cart/apply-coupon` - Aplicar cupón de descuento

### Órdenes (`orders.swagger.js`)
- `POST /api/orders` - Crear nueva orden
- `GET /api/orders` - Listar órdenes del usuario
- `GET /api/orders/{id}` - Obtener orden por ID
- `PUT /api/orders/{id}/cancel` - Cancelar orden
- `GET /api/orders/admin/all` - Todas las órdenes (Admin)
- `PUT /api/orders/admin/{id}/status` - Actualizar estado (Admin)
- `PUT /api/orders/admin/{id}/payment-status` - Actualizar pago (Admin)
- `GET /api/orders/admin/stats` - Estadísticas (Admin)
- `GET /api/orders/{orderNumber}/track` - Rastrear orden pública

## 🔐 Autenticación

La API utiliza **JWT (JSON Web Tokens)** para la autenticación. Para usar endpoints protegidos:

1. Obtén un token mediante `/api/auth/login` o `/api/auth/register`
2. En Swagger UI, haz clic en el botón **"Authorize"** (candado verde)
3. Ingresa: `Bearer {tu_token_jwt}`
4. Ahora puedes probar los endpoints protegidos

## 📋 Esquemas de Datos

### User
```json
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "role": "user | admin",
  "cart": [],
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Product
```json
{
  "_id": "string",
  "name": "string",
  "description": "string",
  "price": "number",
  "category": "tortas | pastelitos | galletas | postres | otros",
  "stock": "number",
  "images": ["string"],
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### CartItem
```json
{
  "product": "ObjectId",
  "name": "string",
  "price": "number",
  "quantity": "number",
  "subtotal": "number"
}
```

### Order
```json
{
  "_id": "string",
  "user": "ObjectId",
  "orderNumber": "string",
  "items": [OrderItem],
  "contactInfo": {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "DNI": "string"
  },
  "shippingAddress": {
    "street": "string",
    "number": "string",
    "floor": "string",
    "apartment": "string",
    "city": "string",
    "province": "string",
    "postalCode": "string",
    "country": "string"
  },
  "paymentMethod": "transferencia | mercadopago | efectivo",
  "subtotal": "number",
  "shippingCost": "number",
  "total": "number",
  "status": "pendiente | confirmado | en_preparacion | enviado | entregado | cancelado",
  "paymentStatus": "pendiente | pagado | rechazado",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

## 🎯 Filtros y Búsqueda

### Productos
```
GET /api/products?search=chocolate&category=tortas&minPrice=100&maxPrice=5000&sortBy=price_asc&page=1&limit=12
```

**Parámetros disponibles:**
- `search`: Búsqueda de texto en nombre/descripción
- `category`: tortas, pastelitos, galletas, postres, otros
- `minPrice`, `maxPrice`: Rango de precios
- `sortBy`: price_asc, price_desc, name_asc, name_desc, newest, oldest
- `inStock`: true/false
- `page`, `limit`: Paginación

### Órdenes
```
GET /api/orders?status=pendiente&sortBy=createdAt_desc&page=1&limit=10
```

**Parámetros disponibles:**
- `status`: pendiente, confirmado, en_preparacion, enviado, entregado, cancelado
- `paymentStatus`: pendiente, pagado, rechazado (solo admin)
- `sortBy`: createdAt_desc, createdAt_asc, total_desc, total_asc
- `page`, `limit`: Paginación

## 📝 Ejemplos de Uso

### Registro de Usuario
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "Password123!"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "Password123!"
  }'
```

### Agregar al Carrito
```bash
curl -X POST http://localhost:5000/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "productId": "507f1f77bcf86cd799439011",
    "quantity": 2
  }'
```

### Crear Orden
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "items": [
      {
        "product": "507f1f77bcf86cd799439011",
        "quantity": 2
      }
    ],
    "contactInfo": {
      "firstName": "Juan",
      "lastName": "Pérez",
      "email": "juan@example.com",
      "phone": "+54 9 11 1234-5678",
      "DNI": "12345678"
    },
    "shippingAddress": {
      "street": "Av. Corrientes",
      "number": "1234",
      "city": "Buenos Aires",
      "province": "CABA",
      "postalCode": "C1043",
      "country": "Argentina"
    },
    "paymentMethod": "transferencia"
  }'
```

## 🔒 Roles y Permisos

### Usuario Normal (`user`)
- Ver productos
- Gestionar su carrito
- Crear órdenes
- Ver sus propias órdenes
- Actualizar su perfil

### Administrador (`admin`)
- Todo lo del usuario normal
- Crear/editar/eliminar productos
- Ver todas las órdenes
- Cambiar estado de órdenes
- Ver estadísticas

## 🛠️ Códigos de Estado HTTP

| Código | Significado |
|--------|-------------|
| 200    | OK - Solicitud exitosa |
| 201    | Created - Recurso creado exitosamente |
| 400    | Bad Request - Datos inválidos |
| 401    | Unauthorized - No autenticado |
| 403    | Forbidden - No autorizado (sin permisos) |
| 404    | Not Found - Recurso no encontrado |
| 500    | Server Error - Error interno del servidor |

## 📦 Respuestas Estándar

### Éxito
```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": { }
}
```

### Error
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

## 🎨 Personalización

El archivo de configuración principal está en:
```
backend/config/swagger.config.js
```

Puedes modificar:
- Información de la API (título, versión, descripción)
- Servidores disponibles
- Esquemas de autenticación
- Componentes reutilizables

## 📄 Licencia

MIT License - Ver archivo LICENSE en la raíz del proyecto.

## 👥 Contribuir

Para agregar documentación de nuevos endpoints:

1. Crea un nuevo archivo en `docs/swagger/` o edita uno existente
2. Usa el formato JSDoc con anotaciones `@swagger`
3. Sigue la estructura de los archivos existentes
4. Reinicia el servidor para ver los cambios
5. Verifica en http://localhost:5000/api-docs

## 🆘 Soporte

Si encuentras algún problema con la documentación:
1. Revisa la consola del servidor para errores de Swagger
2. Verifica que la sintaxis YAML sea correcta
3. Consulta la [documentación oficial de OpenAPI 3.0](https://swagger.io/specification/)
