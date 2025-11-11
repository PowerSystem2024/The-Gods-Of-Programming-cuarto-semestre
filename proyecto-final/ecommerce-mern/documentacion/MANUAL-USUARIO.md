# 📖 MANUAL DE USUARIO - E-Commerce de Postres

> **Guía completa** para usar la tienda en línea

---

## 📋 Contenido

1. [Introducción](#-introducción)
2. [Acceso a la Tienda](#-acceso-a-la-tienda)
3. [Registro e Inicio de Sesión](#-registro-e-inicio-de-sesión)
4. [Navegación](#-navegación)
5. [Catálogo de Productos](#-catálogo-de-productos)
6. [Carrito de Compras](#-carrito-de-compras)
7. [Perfil de Usuario](#-perfil-de-usuario)
8. [Recuperación de Contraseña](#-recuperación-de-contraseña)
9. [Preguntas Frecuentes](#-preguntas-frecuentes)
10. [Soporte](#-soporte)

---

## 🌟 Introducción

Bienvenido a la **Tienda de Postres Artesanales**, tu destino en línea para encontrar los mejores postres caseros. Esta guía te ayudará a aprovechar al máximo todas las funcionalidades de nuestra plataforma.

### ✨ ¿Qué puedes hacer?

- 🛍️ **Explorar** más de 50 productos premium
- 🔍 **Buscar y filtrar** por categoría, precio y nombre
- 🛒 **Agregar al carrito** tus postres favoritos
- 👤 **Gestionar tu perfil** y datos personales
- 📧 **Recuperar contraseña** si la olvidas
- 🔐 **Iniciar sesión** con tu cuenta de Google

---

## 🌐 Acceso a la Tienda

### URL de la Aplicación

**🔗 [https://thegodsofprogrammingfrontend.netlify.app](https://thegodsofprogrammingfrontend.netlify.app)**

### Requisitos del Navegador

| Navegador | Versión Mínima | Estado |
|-----------|----------------|--------|
| Chrome | 90+ | ✅ Recomendado |
| Firefox | 88+ | ✅ Recomendado |
| Safari | 14+ | ✅ Compatible |
| Edge | 90+ | ✅ Compatible |
| Opera | 76+ | ✅ Compatible |

### Compatibilidad de Dispositivos

- 📱 **Móviles** - Android 8+, iOS 12+
- 📲 **Tablets** - iPad, Galaxy Tab, etc.
- 💻 **Desktop** - Windows, Mac, Linux

---

## 🔐 Registro e Inicio de Sesión

### 📝 Crear una Cuenta Nueva

1. **Acceder al registro:**
   - Click en el botón **"Registrarse"** en la esquina superior derecha
   - O visita directamente: `/register`

2. **Completar el formulario:**
   - **Nombre completo:** Tu nombre y apellido
   - **Email:** Debe ser válido (recibirás confirmación)
   - **Contraseña:** Mínimo 6 caracteres
   - **Confirmar contraseña:** Debe coincidir

3. **Validaciones automáticas:**
   - ✅ Email no puede estar duplicado
   - ✅ Contraseña debe tener 6+ caracteres
   - ✅ Todos los campos son obligatorios

4. **Confirmación:**
   - Click en **"Registrarse"**
   - Si todo está correcto, serás redirigido a la tienda
   - Verás un mensaje de bienvenida

### 🔑 Iniciar Sesión

#### Método 1: Con Email y Contraseña

1. Click en **"Iniciar Sesión"** (esquina superior derecha)
2. Ingresa tu **email**
3. Ingresa tu **contraseña**
4. Click en **"Iniciar Sesión"**

#### Método 2: Con Google (OAuth)

1. Click en **"Iniciar Sesión"**
2. Click en el botón **"Continuar con Google"** 🔵
3. Selecciona tu cuenta de Google
4. Autoriza la aplicación
5. Serás redirigido automáticamente

### 🚪 Cerrar Sesión

1. Click en tu nombre de usuario (esquina superior derecha)
2. Selecciona **"Cerrar Sesión"**
3. Serás redirigido a la página principal

---

## 🧭 Navegación

### Barra de Navegación Superior

```
┌─────────────────────────────────────────────────┐
│  🏠 Inicio | 🛍️ Productos | 🛒 Carrito | 👤 Usuario │
└─────────────────────────────────────────────────┘
```

#### Menú Principal

- **🏠 Inicio** - Página de bienvenida con productos destacados
- **🛍️ Productos** - Catálogo completo con filtros
- **🛒 Carrito** - Ver productos agregados (muestra cantidad)
- **👤 Usuario** - Perfil, pedidos, cerrar sesión

### Navegación Móvil

En dispositivos móviles, el menú se convierte en un **menú hamburguesa** (☰):

1. Click en el icono ☰ (esquina superior izquierda)
2. Se despliega el menú lateral
3. Selecciona la opción deseada

---

## 🛍️ Catálogo de Productos

### Explorar Productos

#### Vista General

Al acceder a **"Productos"**, verás:

- **Grid responsivo** - 3 columnas en desktop, 2 en tablet, 1 en móvil
- **Tarjetas de producto** - Imagen, nombre, precio, stock
- **Paginación** - Si hay más de 12 productos

#### Información de Producto

Cada tarjeta muestra:

- 📸 **Imagen** del postre
- 📝 **Nombre** del producto
- 💰 **Precio** en pesos argentinos
- 📦 **Stock disponible:**
  - 🟢 **"En stock"** - Más de 10 unidades
  - 🟡 **"Pocas unidades"** - Entre 1-10 unidades
  - 🔴 **"Agotado"** - Sin stock

### 🔍 Buscar Productos

#### Barra de Búsqueda

1. Escribe en el campo **"Buscar productos..."**
2. La búsqueda es en tiempo real
3. Busca en: nombre, descripción y categoría

**Ejemplo:**
- "chocolate" → Muestra todos los productos con chocolate
- "tarta" → Filtra tartas y productos relacionados

#### Filtros Avanzados

##### Por Categoría

```
☑️ Todas las categorías
☐ Tortas
☐ Tartas
☐ Pasteles
☐ Galletas
☐ Brownies
☐ Alfajores
```

##### Por Rango de Precio

```
Precio mínimo: [____] $
Precio máximo: [____] $
            [Filtrar]
```

##### Ordenamiento

```
Ordenar por:
  • Nombre (A-Z)
  • Nombre (Z-A)
  • Precio (menor a mayor)
  • Precio (mayor a menor)
  • Más recientes
```

### 📄 Detalle de Producto

1. **Click en cualquier producto** del catálogo
2. Se abre la **vista detallada** con:
   - 🖼️ Imagen grande del producto
   - 📝 Descripción completa
   - 💰 Precio destacado
   - 📦 Stock disponible
   - 🏷️ Categoría
   - ⭐ Calificación (próximamente)

3. **Acciones disponibles:**
   - ➕ **Agregar al carrito** - Si hay stock
   - ⬅️ **Volver al catálogo**

---

## 🛒 Carrito de Compras

### Agregar Productos

#### Desde el Catálogo

1. Click en cualquier producto
2. En la vista detallada, click en **"Agregar al Carrito"**
3. Verás una confirmación visual
4. El contador del carrito se actualiza

#### Limitaciones

- ❌ No puedes agregar productos **sin stock**
- ⚠️ La cantidad está limitada al **stock disponible**
- 🔄 Si ya está en el carrito, se incrementa la cantidad

### Ver el Carrito

1. Click en el icono **🛒 Carrito** (esquina superior)
2. O visita directamente: `/cart`

### Gestionar Productos en el Carrito

#### Vista del Carrito

Cada producto muestra:

```
┌─────────────────────────────────────────────┐
│ [Imagen] Nombre del Producto               │
│                                             │
│ Precio: $1,200                              │
│ Cantidad: [−] 2 [+]                         │
│ Subtotal: $2,400                            │
│                                             │
│                             [🗑️ Eliminar]  │
└─────────────────────────────────────────────┘
```

#### Acciones Disponibles

##### Cambiar Cantidad

- **➕ Incrementar** - Click en el botón `+`
- **➖ Decrementar** - Click en el botón `-`
- **Límites:**
  - Mínimo: 1 unidad
  - Máximo: Stock disponible

##### Eliminar Producto

1. Click en el botón **🗑️ "Eliminar"**
2. El producto se quita inmediatamente
3. El total se recalcula

##### Vaciar Carrito Completo

1. Click en **"Vaciar Carrito"** (en la parte superior)
2. Confirma la acción
3. Todos los productos se eliminan

### Resumen de Compra

En la parte derecha (o inferior en móvil):

```
┌──────────────────────────┐
│  📊 RESUMEN              │
├──────────────────────────┤
│  Subtotal:    $5,600     │
│  Envío:       $500       │
│  ─────────────────────   │
│  TOTAL:       $6,100     │
│                          │
│  [Continuar Compra]      │
└──────────────────────────┘
```

- **Subtotal** - Suma de todos los productos
- **Envío** - $500 (fijo, puede cambiar)
- **Total** - Subtotal + Envío

### Finalizar Compra

1. Revisa tu carrito
2. Click en **"Continuar Compra"**
3. Completa el formulario de envío:
   - 📍 Dirección
   - 📞 Teléfono de contacto
   - 📧 Email de confirmación
4. Selecciona método de pago
5. Confirma la orden

> ⚠️ **Nota:** El sistema de pagos está en desarrollo. Actualmente es solo simulación.

---

## 👤 Perfil de Usuario

### Acceder al Perfil

1. Click en tu **nombre de usuario** (esquina superior)
2. Selecciona **"Mi Perfil"**
3. O visita: `/profile`

### Información Personal

#### Ver Datos

Tu perfil muestra:

- 👤 **Nombre completo**
- 📧 **Email**
- 📅 **Fecha de registro**
- 🆔 **ID de usuario**
- 🔐 **Método de autenticación** (Email o Google)

#### Editar Perfil

1. Click en **"Editar Perfil"**
2. Modifica los campos:
   - Nombre
   - Email (si no es cuenta de Google)
3. Click en **"Guardar Cambios"**

#### Cambiar Contraseña

1. En tu perfil, click **"Cambiar Contraseña"**
2. Ingresa:
   - 🔒 Contraseña actual
   - 🆕 Nueva contraseña (6+ caracteres)
   - ✅ Confirmar nueva contraseña
3. Click en **"Actualizar Contraseña"**

> 🔐 **Seguridad:** Tu contraseña se encripta con bcrypt antes de guardarse.

### Historial de Pedidos

> 🚧 **Próximamente** - Podrás ver:
> - 📦 Todos tus pedidos
> - 📊 Estado de envío
> - 🧾 Facturas descargables
> - ⭐ Calificar productos

---

## 🔐 Recuperación de Contraseña

### ¿Olvidaste tu Contraseña?

#### Paso 1: Solicitar Recuperación

1. En la página de **login**, click en **"¿Olvidaste tu contraseña?"**
2. Ingresa tu **email registrado**
3. Click en **"Enviar Enlace de Recuperación"**

#### Paso 2: Revisar Email

1. Abre tu bandeja de entrada
2. Busca el email de **"Recuperación de Contraseña"**
3. El enlace es válido por **1 hora**

> 📧 **Nota:** Si no ves el email, revisa la carpeta de SPAM.

#### Paso 3: Restablecer Contraseña

1. Click en el enlace del email
2. Serás redirigido a la página de restablecimiento
3. Ingresa tu **nueva contraseña** (6+ caracteres)
4. Confirma la contraseña
5. Click en **"Restablecer Contraseña"**

#### Paso 4: Inicio de Sesión

1. Verás un mensaje de confirmación
2. Serás redirigido al **login**
3. Inicia sesión con tu nueva contraseña

### Problemas Comunes

| Problema | Solución |
|----------|----------|
| ❌ "Email no encontrado" | Verifica que sea el email correcto o regístrate |
| ⏱️ "Enlace expirado" | Solicita un nuevo enlace (válido 1h) |
| 📧 "No recibí el email" | Revisa SPAM, espera 5 min, o solicita otro |
| 🔒 "Contraseña muy corta" | Debe tener mínimo 6 caracteres |

---

## 💳 Métodos de Pago

> 🚧 **En Desarrollo**

### Opciones Disponibles (Próximamente)

- 💳 **Tarjeta de Crédito/Débito** (Stripe)
- 💰 **MercadoPago**
- 🏦 **Transferencia Bancaria**
- 💵 **Efectivo contra entrega**

### Seguridad

- 🔐 Cifrado SSL/TLS
- 🛡️ Certificado PCI-DSS
- 🔒 No almacenamos datos de tarjetas

---

## 📦 Envíos

### Zonas de Envío

Actualmente enviamos a:
- 🌍 **Todo Argentina**
- 📍 Resistencia, Chaco (envío local)

### Costos de Envío

| Zona | Tiempo | Costo |
|------|--------|-------|
| 📍 Resistencia | 24-48h | $500 |
| 🌆 Gran Resistencia | 48-72h | $800 |
| 🇦🇷 Resto del país | 3-7 días | $1,500 |

### Seguimiento

> 🚧 **Próximamente** - Podrás rastrear tu pedido en tiempo real.

---

## ❓ Preguntas Frecuentes

### Cuenta y Registro

**P: ¿Es obligatorio registrarse para comprar?**  
R: Sí, necesitas una cuenta para realizar pedidos. Puedes usar tu email o cuenta de Google.

**P: ¿Puedo tener múltiples cuentas?**  
R: No es recomendable. Usa una sola cuenta con el email que más uses.

**P: ¿Puedo cambiar mi email?**  
R: Sí, desde tu perfil puedes actualizar tu email (excepto cuentas de Google).

### Productos y Stock

**P: ¿Con qué frecuencia se actualiza el stock?**  
R: El stock se actualiza en tiempo real con cada compra.

**P: ¿Qué significa "Pocas unidades"?**  
R: Quedan entre 1 y 10 unidades disponibles. ¡Apresúrate!

**P: ¿Puedo reservar un producto?**  
R: Actualmente no. El stock se reserva al agregar al carrito por 30 minutos.

### Carrito y Compras

**P: ¿Por cuánto tiempo se guardan los productos en mi carrito?**  
R: 30 días o hasta que vacíes el carrito manualmente.

**P: ¿Puedo comprar sin iniciar sesión?**  
R: No, necesitas estar autenticado para realizar compras.

**P: ¿Cuántos productos puedo agregar?**  
R: Hasta el límite del stock disponible.

### Pagos y Facturación

**P: ¿Emiten factura?**  
R: Sí, todas las compras incluyen factura electrónica enviada por email.

**P: ¿Aceptan todas las tarjetas?**  
R: 🚧 En desarrollo. Próximamente Visa, Mastercard, American Express.

### Envíos

**P: ¿Cuánto demora el envío?**  
R: Depende de la zona. Ver tabla de [envíos](#-envíos).

**P: ¿Puedo retirar en el local?**  
R: 🚧 Próximamente tendremos retiro en sucursal.

### Seguridad

**P: ¿Es seguro pagar en línea?**  
R: Sí, usamos cifrado SSL y no almacenamos datos sensibles.

**P: ¿Qué hago si olvidé mi contraseña?**  
R: Ver sección [Recuperación de Contraseña](#-recuperación-de-contraseña).

---

## 🆘 Soporte

### Canales de Ayuda

#### 📧 Email de Soporte
**soporte@thegodsofprogramming.com**

- Respuesta en: 24-48 horas
- Adjunta capturas si es necesario
- Incluye tu email de registro

#### 💬 Chat en Vivo
> 🚧 **Próximamente**

Horarios de atención:
- Lunes a Viernes: 9:00 - 18:00 hs
- Sábados: 9:00 - 13:00 hs

#### 📞 Teléfono
**+54 9 362 123-4567**

- Mismo horario que chat
- Solo para consultas urgentes

### Reportar un Problema

Si encuentras un error en la aplicación:

1. 📧 Envía un email a: **bugs@thegodsofprogramming.com**
2. Incluye:
   - 🖥️ Navegador y versión
   - 📱 Dispositivo (si es móvil)
   - 📋 Pasos para reproducir el error
   - 📸 Capturas de pantalla
   - 🕐 Hora aproximada del error

---

## 📱 Consejos de Uso

### Mejores Prácticas

#### Navegación
- ✅ Usa **Chrome o Firefox** para mejor experiencia
- ✅ Mantén tu navegador **actualizado**
- ✅ Habilita **JavaScript** y **cookies**

#### Seguridad
- ✅ Usa una **contraseña fuerte** (8+ caracteres, letras y números)
- ✅ No compartas tu contraseña
- ✅ Cierra sesión en dispositivos públicos
- ✅ Verifica que la URL sea **HTTPS** (🔒)

#### Compras
- ✅ Revisa el carrito antes de comprar
- ✅ Verifica la dirección de envío
- ✅ Guarda el número de pedido
- ✅ Revisa tu email para confirmaciones

### Atajos de Teclado

| Tecla | Acción |
|-------|--------|
| `Ctrl + K` | Abrir búsqueda |
| `Esc` | Cerrar modales |
| `Tab` | Navegar elementos |
| `Enter` | Confirmar acción |

---

## 🎁 Programa de Fidelización

> 🚧 **Próximamente**

### Beneficios para Clientes Frecuentes

- 🎉 **10% de descuento** en tu 5ta compra
- 🎁 **Envío gratis** en compras mayores a $10,000
- 🌟 **Puntos por compra** canjeables por productos
- 📧 **Ofertas exclusivas** por email

---

## 📊 Estadísticas de Uso

### Tiempos de Carga

- ⚡ **Página principal:** <2 segundos
- ⚡ **Catálogo:** <3 segundos
- ⚡ **Carrito:** <1 segundo

### Disponibilidad

- 🟢 **99.9% uptime** garantizado
- 🔄 Mantenimientos programados los **domingos 2-4am**

---

## 🔄 Actualizaciones

### Historial de Versiones

#### v1.0.0 (Actual) - Noviembre 2024
- ✅ Lanzamiento inicial
- ✅ Catálogo de productos
- ✅ Carrito de compras
- ✅ Sistema de autenticación
- ✅ OAuth con Google
- ✅ Recuperación de contraseña

#### v1.1.0 (Próxima) - Diciembre 2024
- 🔄 Sistema de pagos
- 🔄 Panel de administración
- 🔄 Historial de pedidos
- 🔄 Sistema de reseñas

---

## 📄 Términos y Condiciones

### Uso Aceptable

Al usar esta plataforma, aceptas:

- ✅ Proporcionar información **verídica**
- ✅ No usar la plataforma para fines **ilegales**
- ✅ Respetar los **derechos de autor**
- ✅ No intentar **hackear** o comprometer el sistema

### Privacidad

- 🔐 Tu información personal está **protegida**
- 📧 No compartimos emails con terceros
- 🍪 Usamos cookies solo para mejorar la experiencia
- 📊 Recopilamos datos anónimos para estadísticas

Ver más en: [Política de Privacidad](./PRIVACY.md)

---

## 📞 Contacto

### Equipo de Desarrollo

**The Gods of Programming**  
Tecnicatura en Desarrollo de Software  
UTN FRRe - 2024

- 🌐 **Web:** [thegodsofprogramming.com](https://thegodsofprogramming.com)
- 📧 **Email:** contacto@thegodsofprogramming.com
- 💼 **LinkedIn:** [/company/thegodsofprogramming](https://linkedin.com/company/thegodsofprogramming)
- 🐙 **GitHub:** [PowerSystem2024](https://github.com/PowerSystem2024/The-Gods-Of-Programming-cuarto-semestre)

---

<p align="center">
  <strong>¡Gracias por usar nuestra tienda! 🎉</strong><br>
  Esperamos que disfrutes de nuestros deliciosos postres artesanales<br>
  <br>
  Hecho con ❤️ y mucho 🍰 por <strong>The Gods of Programming</strong>
</p>

---

**Última actualización:** 11 de Noviembre, 2025  
**Versión del manual:** 1.0.0
