# 🚀 Guía de Deployment - Backend (Monorepo)

> ⚠️ **IMPORTANTE:** Este proyecto está en un MONOREPO (backend + frontend en el mismo repositorio). Sigue las instrucciones específicas para monorepos.

## 📋 Pre-requisitos

1. **MongoDB Atlas**
   - Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Crear un cluster gratuito (M0)
   - Obtener la URI de conexión: `mongodb+srv://usuario:password@cluster.mongodb.net/ecommerce`
   - Ir a "Network Access" → Agregar `0.0.0.0/0` (permitir todas las IPs)

2. **Variables de Entorno**
   - Tener listas las siguientes variables (NO las subas al repo)

## 🌐 Opciones de Deployment

### Opción 1: Render (Recomendado - Gratis) 🟢

#### ⚠️ CONFIGURACIÓN ESPECIAL PARA MONOREPO

1. **Crear cuenta en [Render](https://render.com/)**

2. **Crear nuevo Web Service:**
   - Click en "New +" → "Web Service"
   - Conectar tu repositorio de GitHub: `The-Gods-Of-Programming-cuarto-semestre`
   - ✅ Seleccionar la rama: `main`

3. **⚠️ CONFIGURACIÓN CRÍTICA - MONOREPO:**
   ```
   Name: ecommerce-backend
   Root Directory: backend          👈 IMPORTANTE: Solo la carpeta backend
   Environment: Node
   Build Command: npm install       👈 Se ejecuta desde /backend
   Start Command: npm start         👈 Se ejecuta desde /backend  
   Plan: Free
   ```

4. **🔧 IMPORTANTE - Root Directory:**
   - Render ejecutará todos los comandos DENTRO de la carpeta `backend/`
   - No necesitas hacer `cd backend` en los comandos
   - El `package.json` que usará es `backend/package.json`

3. **Configurar Variables de Entorno:**
   
   En Render → Tu servicio → Environment → Add Environment Variable
   
   ```bash
   # REQUERIDAS ✅
   NODE_ENV=production
   PORT=5000
   
   # MongoDB Atlas (COPIA TU URL COMPLETA)
   MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
   
   # URL del Frontend (la obtendrás de Netlify después)
   FRONTEND_URL=https://tu-app.netlify.app
   
   # Secretos de seguridad (usa generadores de strings random)
   # Ejemplo: openssl rand -base64 32
   SESSION_SECRET=tu-secreto-super-seguro-random-123456789
   JWT_SECRET=otro-jwt-secreto-super-seguro-random-987654321
   JWT_EXPIRE=7d
   
   # OPCIONALES (si usas Google OAuth)
   GOOGLE_CLIENT_ID=tu-google-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-tu-google-secret
   GOOGLE_CALLBACK_URL=https://tu-backend.onrender.com/api/auth/google/callback
   
   # OPCIONALES (si usas recuperación de contraseña)
   EMAIL_USER=tu-email@gmail.com
   EMAIL_PASS=tu-app-password-de-16-caracteres
   ```

4. **Deploy:**
   - Click en "Create Web Service"
   - Render automáticamente:
     1. Clona tu repo
     2. Va a la carpeta `backend/`
     3. Ejecuta `npm install`
     4. Ejecuta `npm start`
   - ⏱️ El primer deploy tarda 2-5 minutos
   - ✅ Obtendrás una URL como: `https://ecommerce-backend-xxxx.onrender.com`

5. **⚠️ IMPORTANTE - Free Tier:**
   - El servicio se duerme después de 15 minutos sin actividad
   - La primera petición tardará ~30 segundos en despertar
   - Es normal, es gratis 😊

### Opción 2: Railway 🚂

#### ⚠️ CONFIGURACIÓN ESPECIAL PARA MONOREPO

1. **Crear cuenta en [Railway](https://railway.app/)**

2. **Crear nuevo proyecto:**
   - Click en "New Project" → "Deploy from GitHub repo"
   - Seleccionar: `The-Gods-Of-Programming-cuarto-semestre`
   - Railway detectará automáticamente Node.js

3. **⚠️ CONFIGURACIÓN CRÍTICA - MONOREPO:**
   
   Ir a Settings del servicio:
   
   ```
   Root Directory: backend          👈 IMPORTANTE
   Build Command: npm install
   Start Command: npm start
   Watch Paths: backend/**          👈 Solo redeploy si cambia /backend
   ```

4. **Configurar Variables de Entorno:**
   - Ir a "Variables"
   - Agregar las mismas variables que en Render (ver arriba)

5. **Deploy:**
   - Railway hace deploy automático
   - ✅ Obtendrás una URL como: `https://ecommerce-backend.up.railway.app`

### Opción 3: Vercel (⚠️ No Recomendado para Backend Persistente)

Vercel está optimizado para frontend y funciones serverless, no para servidores persistentes con WebSockets o conexiones a BD.

**Solo si decides usarlo:**

1. **Instalar Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy desde la carpeta backend:**
   ```bash
   # Ir a la carpeta backend
   cd backend
   
   # Deploy
   vercel
   ```

3. **Configurar Variables de Entorno:**
   - En Vercel Dashboard → Settings → Environment Variables
   - Agregar todas las variables

**⚠️ Limitación:** Vercel tiene límite de 10s de ejecución en plan free, no es ideal para MongoDB.

---

## 🔧 Configuración Post-Deployment

### 1. Verificar que el Backend funciona

```bash
# Reemplaza con tu URL de Render/Railway
curl https://tu-backend.onrender.com/api/health

# Deberías ver:
# {"status":"OK","database":"conectado",...}
```

### 2. Actualizar Google OAuth Callback (si usas Google Login)

En [Google Cloud Console](https://console.cloud.google.com/):
- Ir a "Credenciales"
- Editar tu OAuth 2.0 Client ID
- Agregar a "Authorized redirect URIs":
  ```
  https://tu-backend.onrender.com/api/auth/google/callback
  ```

### 3. Configurar MongoDB Atlas Network Access

- Ir a MongoDB Atlas → Network Access
- Agregar IP Address: `0.0.0.0/0` (permitir desde cualquier IP)
- O agregar la IP específica de Render (la puedes ver en los logs)

## 📊 Verificación del Deployment

1. **Health Check:**
   ```bash
   curl https://tu-backend.onrender.com/api/health
   ```

2. **Verificar conexión a MongoDB:**
   - El health check debe retornar `"database": "conectado"`

3. **Test de autenticación:**
   ```bash
   curl https://tu-backend.onrender.com/api/auth/google
   ```

## 🐛 Troubleshooting

### Error: "Cannot connect to MongoDB"
- Verificar MONGODB_URI en variables de entorno
- Verificar que la IP está en la whitelist de MongoDB Atlas
- Verificar usuario y contraseña en la URI

### Error: "CORS policy"
- Verificar que FRONTEND_URL está correctamente configurado
- Verificar que coincide exactamente con la URL de Netlify

### Error: "Application error"
- Revisar logs en el dashboard de Render/Railway
- Verificar que todas las variables de entorno están configuradas

## 📝 Comandos Útiles

```bash
# Ver logs en Render
# Ir al dashboard → tu servicio → Logs

# Ver logs en Railway
railway logs

# Test local con variables de producción
NODE_ENV=production MONGODB_URI=tu-uri npm start
```

## 🔒 Seguridad

1. **Nunca** commitear `.env` al repositorio
2. Usar secretos **diferentes** para desarrollo y producción
3. Rotar secretos regularmente
4. Usar HTTPS en producción (automático en Render/Railway)

## 📚 Recursos

- [Render Docs](https://render.com/docs)
- [Railway Docs](https://docs.railway.app/)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Express.js Production Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
