# 🚀 Guía Rápida de Swagger

## ⚡ Instalación

Las dependencias ya están en `package.json`, solo ejecuta:

```bash
cd backend
npm install
```

Esto instalará:
- `swagger-jsdoc@^6.2.8` - Genera especificación OpenAPI desde JSDoc
- `swagger-ui-express@^5.0.0` - Interfaz web interactiva para la API

## 🏃‍♂️ Iniciar el Servidor

```bash
npm start
```

## 🌐 Acceder a la Documentación

Una vez iniciado el servidor, abre tu navegador en:

### Interfaz Interactiva
```
http://localhost:5000/api-docs
```

Aquí puedes:
- ✅ Ver todos los endpoints disponibles
- ✅ Probar las peticiones directamente
- ✅ Ver ejemplos de request/response
- ✅ Autenticarte con JWT

### Especificación JSON
```
http://localhost:5000/api-docs.json
```

Puedes importar este JSON en herramientas como:
- Postman
- Insomnia
- API testing tools

## 🔐 Autenticación en Swagger UI

1. **Registra un usuario** o **inicia sesión**:
   - Navega a `Auth > POST /api/auth/register` o `POST /api/auth/login`
   - Haz clic en "Try it out"
   - Ingresa los datos requeridos
   - Copia el `token` de la respuesta

2. **Autorízate**:
   - Haz clic en el botón **🔓 Authorize** (arriba a la derecha)
   - Ingresa: `Bearer {tu_token_aqui}`
   - Haz clic en "Authorize"
   - Cierra el diálogo

3. **Prueba endpoints protegidos**:
   - Ahora todos los endpoints que requieren autenticación funcionarán
   - El token se enviará automáticamente en cada petición

## 📝 Probar Endpoints

### Ejemplo: Listar Productos

1. Ve a `Products > GET /api/products`
2. Haz clic en "Try it out"
3. (Opcional) Ajusta los parámetros de búsqueda:
   - `search`: "chocolate"
   - `category`: "tortas"
   - `minPrice`: 100
   - `maxPrice`: 5000
   - `page`: 1
   - `limit`: 12
4. Haz clic en "Execute"
5. Verás la respuesta debajo con:
   - Status code
   - Response body
   - Response headers

### Ejemplo: Agregar al Carrito

1. **Primero autentícate** (ver sección anterior)
2. Ve a `Cart > POST /api/cart`
3. Haz clic en "Try it out"
4. Edita el JSON del request body:
   ```json
   {
     "productId": "507f1f77bcf86cd799439011",
     "quantity": 2
   }
   ```
5. Haz clic en "Execute"
6. Verás la respuesta con el carrito actualizado

## 🎯 Estructura de la Documentación

```
backend/
├── config/
│   └── swagger.config.js          # Configuración principal OpenAPI 3.0
├── docs/
│   └── swagger/
│       ├── auth.swagger.js        # 11 endpoints de autenticación
│       ├── products.swagger.js    # 9 endpoints de productos
│       ├── cart.swagger.js        # 10 endpoints del carrito
│       ├── orders.swagger.js      # 9 endpoints de órdenes
│       ├── README.md             # Documentación completa
│       └── QUICK-START.md        # Esta guía
└── server.js                      # Integración de Swagger UI
```

## 🔧 Configuración Personalizada

Edita `backend/config/swagger.config.js` para:

- Cambiar título/descripción de la API
- Agregar más servidores (staging, producción)
- Modificar esquemas de datos
- Agregar nuevos componentes reutilizables

## 📊 Estadísticas de Documentación

- **Total de endpoints documentados**: 39
- **Autenticación**: 11 endpoints
- **Productos**: 9 endpoints
- **Carrito**: 10 endpoints
- **Órdenes**: 9 endpoints
- **Esquemas de datos**: 8 (User, Product, CartItem, Order, OrderItem, Error, Success)
- **Respuestas reutilizables**: 5 (401, 403, 404, 400, 500)
- **Tags organizados**: 4 (Auth, Products, Cart, Orders)

## 🎨 Categorías de Productos

```
tortas         - Tortas y pasteles
pastelitos     - Pastelitos individuales
galletas       - Galletas y cookies
postres        - Postres variados
otros          - Otros productos
```

## 💳 Métodos de Pago

```
transferencia  - Transferencia bancaria
mercadopago    - MercadoPago
efectivo       - Pago en efectivo
```

## 📦 Estados de Orden

```
pendiente      - Orden recibida, pendiente de confirmación
confirmado     - Orden confirmada, en espera de preparación
en_preparacion - Orden siendo preparada
enviado        - Orden enviada al cliente
entregado      - Orden entregada exitosamente
cancelado      - Orden cancelada
```

## 🚨 Solución de Problemas

### No aparece la documentación

```bash
# Verifica que el servidor esté corriendo
# Debe mostrar: "Swagger docs available at /api-docs"

# Si hay errores en la consola:
# 1. Revisa sintaxis en archivos .swagger.js
# 2. Verifica que swagger.config.js esté correctamente configurado
# 3. Reinicia el servidor
```

### Error "Cannot read property 'swagger'"

```bash
# Reinstala las dependencias
rm -rf node_modules package-lock.json
npm install
```

### Los endpoints no aparecen

```bash
# Verifica que los archivos están en la ruta correcta:
# backend/docs/swagger/*.js

# Verifica que swagger.config.js incluya la ruta:
# apis: ['./routes/*.js', './controllers/*.js', './docs/swagger/*.js']
```

## 📖 Recursos Adicionales

- [OpenAPI 3.0 Specification](https://swagger.io/specification/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
- [JSDoc Swagger Guide](https://github.com/Surnet/swagger-jsdoc)

## 🎉 ¡Listo!

Ahora tienes una documentación completa e interactiva de tu API.

Características principales:
- ✅ 39 endpoints completamente documentados
- ✅ Autenticación JWT integrada
- ✅ Ejemplos de request/response
- ✅ Interfaz interactiva para probar
- ✅ Esquemas de validación completos
- ✅ Filtros y paginación documentados
- ✅ Códigos de error descriptivos

**¡Disfruta explorando tu API!** 🚀
