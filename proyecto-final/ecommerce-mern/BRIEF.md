# 🍰 SweetCommerce – Brief

## 1. ✨ Visión de marca
SweetCommerce busca posicionarse como la tienda online líder en postres artesanales y gourmet, combinando tradición culinaria con innovación digital. Su objetivo es transmitir calidad, frescura, pasión por la repostería y crear experiencias memorables a través de sabores únicos.

## 2. 🎭 Personalidad de marca
🧁 **Ícono**: El cupcake como símbolo de celebración, dulzura y momentos especiales.
🎯 **Tono**: Cálido, acogedor, elegante pero accesible.
🍯 **Valores**: Calidad artesanal, ingredientes premium, atención personalizada, momentos especiales.

## 3. 🎯 Público objetivo
- **Amantes de los postres gourmet** que buscan calidad superior
- **Organizadores de eventos** que necesitan postres para celebraciones especiales
- **Personas que buscan regalos únicos** y experiencias gastronómicas memorables
- **Familias** que quieren compartir momentos dulces de calidad
- **Empresas** que buscan catering de postres para eventos corporativos

## 4. 🎨 Identidad visual

### Paleta de colores:
- **Primarios**: Tonos cálidos (cremas, dorados suaves, rosas pastel, marrones)
- **Acentos**: Chocolates ricos, verdes menta, rojos cereza
- **Neutros**: Blancos puros y grises elegantes

### Estilo gráfico:
- Minimalista con toques elegantes
- Fotografía gastronómica de alta calidad
- Ilustraciones delicadas tipo acuarela

### Tipografías principales:
**Para títulos y marca:**
- Playfair Display (elegante y sofisticada)
- Dancing Script (cálida y personal)

**Para descripciones y textos:**
- Open Sans (clara y legible)
- Lato (moderna y friendly)

## 5. 📦 Aplicaciones de marca
- Logo adaptable para web, packaging y redes sociales
- Plantillas para contenido en Instagram, Facebook y TikTok
- Diseño de packaging elegante y eco-friendly
- Elementos gráficos para interfaz web y materiales promocionales
- Certificados de calidad y origen artesanal

## 6. 🔍 Referencias visuales
- **Marcas similares**: Ladurée, Pierre Hermé, Magnolia Bakery
- **Inspiración estética**: Pastelerías parisinas + diseño escandinavo moderno
- **Mood**: Elegancia artesanal, calidez hogareña, sofisticación accesible

## 7. 🥊 Competencia directa
- Pastelerías locales tradicionales
- Tiendas online de repostería
- Supermercados con sección de panadería

## ❓ Preguntas clave para definir el Branding

### 1. ¿Cuál es la necesidad, desafío o problema que se busca resolver?
El mercado de postres online carece de opciones que combinen calidad artesanal con conveniencia digital. SweetCommerce busca llenar este vacío ofreciendo postres gourmet con la comodidad de compra online, entrega a domicilio y personalización de pedidos.

### 2. ¿Qué se espera lograr con este proyecto?
- Posicionar a SweetCommerce como referente en postres artesanales online
- Crear una comunidad de amantes de los postres que valoren la calidad
- Generar ingresos sostenibles a través de ventas recurrentes
- Expandir el negocio a múltiples ciudades/regiones

### 3. ¿A quién se va a impactar?
- **Consumidores finales**: Personas que buscan postres de calidad para ocasiones especiales
- **Sector eventos**: Organizadores que necesitan catering de postres
- **Mercado corporativo**: Empresas que buscan opciones premium para eventos
- **Comunidad local**: Apoyo a la economía artesanal y productos locales

### 4. ¿Cuáles son los beneficios que se van a obtener?
- **Para clientes**: Acceso a postres artesanales de calidad desde casa
- **Para el negocio**: Escalabilidad digital con margen premium
- **Para la marca**: Diferenciación clara frente a competencia masiva
- **Para la comunidad**: Promoción de la cultura repostera artesanal

### 5. ¿Cómo se va a comunicar la propuesta de valor?
- **Sitio web elegante** con fotografía gastronómica profesional
- **Contenido en redes sociales** mostrando proceso artesanal y productos finales
- **Storytelling** sobre ingredientes premium y técnicas tradicionales
- **Testimoniales** de clientes satisfechos y eventos exitosos
- **Blog de recetas** y tips de repostería para generar engagement

## 🚀 Propuesta de valor única
*"Endulzamos tus momentos especiales con postres artesanales premium, creados con pasión y entregados con amor directamente en tu puerta."*

## 📊 Métricas de éxito
- Reconocimiento de marca en el segmento premium
- Índice de satisfacción del cliente > 95%
- Crecimiento mensual de ventas del 15%
- Engagement rate en redes sociales > 8%
- Tiempo de entrega promedio < 24 horas en área metropolitana

---

# 💻 IMPLEMENTACIÓN TÉCNICA

## 8. 🛠️ Stack Tecnológico

### **Backend (API REST)**
- **Node.js** v20+ - Entorno de ejecución JavaScript del lado del servidor
- **Express.js** v4.21+ - Framework web minimalista y flexible para crear APIs
- **MongoDB** v8+ - Base de datos NoSQL orientada a documentos
- **Mongoose** v8.8+ - ODM (Object Data Modeling) para MongoDB

### **Frontend (SPA - Single Page Application)**
- **React** v19.0+ - Librería para construcción de interfaces de usuario
- **Vite** v6.0+ - Build tool y dev server ultrarrápido para proyectos frontend
- **React Router** v7.1+ - Navegación del lado del cliente
- **Axios** - Cliente HTTP para comunicación con el backend

### **Autenticación y Seguridad**
- **JWT (jsonwebtoken)** - Tokens para autenticación stateless
- **bcrypt** - Hash de contraseñas con salt
- **Passport.js** - Middleware de autenticación modular
  - Estrategia Local (email/password)
  - Estrategia Google OAuth 2.0
- **crypto** - Generación de tokens seguros para recuperación de contraseña
- **express-session** - Manejo de sesiones de usuario
- **connect-mongo** - Almacenamiento de sesiones en MongoDB

### **Email y Comunicaciones**
- **Nodemailer** - Envío de emails transaccionales
- **Gmail SMTP** - Servicio de correo para notificaciones

### **Desarrollo y Calidad de Código**
- **ESLint** - Linter para mantener código limpio y consistente
- **dotenv** - Gestión de variables de entorno
- **CORS** - Configuración de política de origen cruzado

### **Deployment y Hosting**
- **Render** - Hosting del backend (API REST)
- **Netlify** - Hosting del frontend (React SPA)
- **MongoDB Atlas** - Base de datos en la nube
- **Git/GitHub** - Control de versiones y colaboración

## 9. 👥 Equipo de Desarrollo (5 Integrantes)

### **Distribución de Tareas**

#### **Integrante 1: Líder Técnico / Arquitectura**
- Configuración inicial del proyecto (monorepo)
- Arquitectura de la aplicación (Backend + Frontend)
- Configuración de deployment (Render + Netlify)
- Documentación técnica
- **Video**: Introducción a las tecnologías y arquitectura general

#### **Integrante 2: Backend - Autenticación y Usuarios**
- Sistema de registro y login
- Autenticación con JWT
- Google OAuth 2.0
- Recuperación de contraseña
- Perfil de usuario
- **Video**: Caso de uso "Registro e Inicio de Sesión"

#### **Integrante 3: Backend - Catálogo de Productos**
- Modelo de productos
- CRUD de productos
- Sistema de categorías
- Búsqueda y filtros
- Gestión de imágenes
- **Video**: Caso de uso "Gestión de Catálogo"

#### **Integrante 4: Backend/Frontend - Carrito y Órdenes**
- Modelo de carrito de compras
- Lógica de negocio (stock, precios)
- Sistema de órdenes
- Integración frontend-backend
- **Video**: Caso de uso "Proceso de Compra"

#### **Integrante 5: Frontend - UI/UX**
- Diseño de componentes React
- Implementación de estilos CSS
- Responsive design
- Navegación con React Router
- Manejo de estados con Context API
- **Video**: Caso de uso "Experiencia de Usuario"

## 10. 📐 Arquitectura del Sistema

### **Patrón: Arquitectura Monorepo con Despliegue Independiente**

```
The-Gods-Of-Programming-cuarto-semestre/
└── proyecto-final/
    └── ecommerce-mern/
        ├── backend/          → Deploy en Render
        │   ├── controllers/  → Lógica de negocio
        │   ├── models/       → Esquemas de MongoDB
        │   ├── routes/       → Endpoints de la API
        │   ├── middleware/   → Validaciones y autenticación
        │   ├── config/       → Configuraciones (DB, Auth)
        │   └── server.js     → Punto de entrada
        │
        ├── frontend/         → Deploy en Netlify
        │   ├── src/
        │   │   ├── components/  → Componentes reutilizables
        │   │   ├── pages/       → Vistas principales
        │   │   ├── context/     → Estado global (Context API)
        │   │   ├── services/    → Llamadas a API (Axios)
        │   │   └── styles/      → CSS modular
        │   └── dist/         → Build de producción
        │
        └── netlify.toml      → Config de deployment
```

### **Flujo de Comunicación**
```
Usuario → Frontend (React) → API REST (Express) → MongoDB
          ↓
       HTTPS/JWT
          ↓
    Render Backend
```

## 11. 🔄 Metodología de Trabajo

### **Control de Versiones**
- GitHub con branching strategy:
  - `main` - Producción estable
  - `develop` - Desarrollo integrado
  - `feature/*` - Nuevas funcionalidades
  - `fix/*` - Correcciones de bugs

### **Comunicación del Equipo**
- Reuniones semanales de sincronización
- Discord/WhatsApp para comunicación diaria
- GitHub Issues para tracking de tareas
- Pull Requests con code review antes de merge

### **Documentación**
- README.md con instrucciones de setup
- Comentarios en código para lógica compleja
- Guías de deployment
- Manual de usuario
