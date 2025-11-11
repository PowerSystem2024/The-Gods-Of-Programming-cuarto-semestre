# 📸 PASO A PASO CON CAPTURAS - Deployment Monorepo

## 🎯 RENDER - Configuración Backend

### 1. Crear Web Service

```
Dashboard Render → New + → Web Service
```

### 2. Conectar GitHub

```
┌────────────────────────────────────────────┐
│  Connect a repository                      │
├────────────────────────────────────────────┤
│  ○ GitHub                                  │
│  ○ GitLab                                  │
│  ○ Manual                                  │
│                                            │
│  [Connect GitHub Account]                  │
└────────────────────────────────────────────┘

Click: "Connect GitHub Account"
→ Autorizar Render
→ Seleccionar: "The-Gods-Of-Programming-cuarto-semestre"
```

### 3. ⚠️ CONFIGURACIÓN CRÍTICA - Monorepo

```
┌─────────────────────────────────────────────┐
│  Create a new Web Service                   │
├─────────────────────────────────────────────┤
│                                             │
│  Name: ecommerce-backend                    │
│                                             │
│  Region: Frankfurt (EU Central)             │
│                                             │
│  Branch: main                    👈 RAMA    │
│                                             │
│  ⚠️ Root Directory: backend      👈 CRÍTICO │
│                                             │
│  Runtime: Node                              │
│                                             │
│  Build Command: npm install                 │
│                                             │
│  Start Command: npm start                   │
│                                             │
│  Plan: Free                                 │
│                                             │
│  [Create Web Service]                       │
└─────────────────────────────────────────────┘
```

### 4. Agregar Variables de Entorno

```
Dashboard → Tu servicio → Environment

[+ Add Environment Variable]

┌──────────────────────────────────────────┐
│ Key: MONGODB_URI                         │
│ Value: mongodb+srv://user:pass@...      │
├──────────────────────────────────────────┤
│ Key: JWT_SECRET                          │
│ Value: mi-secreto-super-seguro-123       │
├──────────────────────────────────────────┤
│ Key: SESSION_SECRET                      │
│ Value: otro-secreto-diferente-456        │
├──────────────────────────────────────────┤
│ Key: FRONTEND_URL                        │
│ Value: https://tu-app.netlify.app        │
│ (Lo pondrás después del deploy Netlify)  │
├──────────────────────────────────────────┤
│ Key: NODE_ENV                            │
│ Value: production                        │
├──────────────────────────────────────────┤
│ Key: JWT_EXPIRE                          │
│ Value: 7d                                │
└──────────────────────────────────────────┘

[Save Changes]
```

### 5. Deploy Automático

```
Render inicia deploy automáticamente:

┌───────────────────────────────────┐
│ Building...                       │
│ ✓ Cloning repository              │
│ ✓ Changing to /backend            │
│ ✓ Running npm install             │
│ ✓ Starting npm start              │
│                                   │
│ Your service is live at:          │
│ https://ecommerce-backend-xxx.    │
│ onrender.com                      │
└───────────────────────────────────┘
```

---

## 🌐 NETLIFY - Configuración Frontend

### 1. Add New Site

```
Dashboard Netlify → Add new site → Import an existing project
```

### 2. Connect to Git Provider

```
┌────────────────────────────────────────┐
│  Import an existing project from a     │
│  Git repository                        │
├────────────────────────────────────────┤
│                                        │
│  [GitHub]  [GitLab]  [Bitbucket]      │
│                                        │
└────────────────────────────────────────┘

Click: GitHub
→ Autorizar Netlify
→ Buscar: "The-Gods-Of-Programming-cuarto-semestre"
→ Click en el repositorio
```

### 3. ⚠️ CONFIGURACIÓN CRÍTICA - Monorepo

```
┌──────────────────────────────────────────┐
│  Site settings for                       │
│  The-Gods-Of-Programming-cuarto-semestre │
├──────────────────────────────────────────┤
│                                          │
│  Branch to deploy: main       👈 RAMA    │
│                                          │
│  ⚠️ Base directory: frontend  👈 CRÍTICO │
│                                          │
│  Build command: npm run build            │
│                                          │
│  Publish directory: frontend/dist 👈     │
│                                          │
│  [Show advanced]                         │
│                                          │
│  [Deploy site]                           │
└──────────────────────────────────────────┘
```

### 4. Configurar Variables de Entorno

```
Después del deploy exitoso:

Site settings → Environment variables → Add a variable

┌──────────────────────────────────────────┐
│ Key: VITE_API_URL                        │
│                                          │
│ Value: https://ecommerce-backend-xxx.    │
│        onrender.com/api        👈 /api   │
│                                          │
│ ⚠️ IMPORTANTE:                           │
│ - DEBE terminar en /api                 │
│ - SIN barra final                        │
│                                          │
│ [Add variable]                           │
└──────────────────────────────────────────┘

Después de agregar:
[Trigger deploy] → [Clear cache and deploy site]
```

### 5. Obtener URL y Actualizar Backend

```
Tu sitio está desplegado en:
https://random-name-123456.netlify.app

Opcional - Cambiar nombre:
Site settings → Site details → Change site name
→ Nuevo nombre: mi-pasteleria-app
→ URL: https://mi-pasteleria-app.netlify.app
```

**AHORA VUELVE A RENDER:**

```
Render → Tu servicio backend → Environment
→ Editar FRONTEND_URL
→ Nuevo valor: https://mi-pasteleria-app.netlify.app
→ Save
(El servicio se reiniciará automáticamente)
```

---

## ✅ VERIFICACIÓN FINAL

### Test 1: Backend Health Check

```bash
curl https://tu-backend.onrender.com/api/health

# Respuesta esperada:
{
  "status": "OK",
  "database": "conectado",
  "timestamp": "2025-11-10T...",
  "version": "1.0.0"
}
```

### Test 2: Frontend carga

```
Abrir: https://tu-app.netlify.app

✓ Debe cargar la página principal
✓ Ver productos
✓ No debe haber errores en Console (F12)
```

### Test 3: Comunicación Frontend-Backend

```
En tu app Netlify:
1. Abrir DevTools (F12) → Network tab
2. Ir a /products
3. Ver petición a: https://tu-backend.onrender.com/api/products
4. Status: 200 OK
```

### Test 4: Autenticación

```
1. Intentar registrarse
2. Verificar en Network que va a: /api/auth/register
3. Login funciona
4. Token se guarda en localStorage
```

---

## 🚨 ERRORES COMUNES Y SOLUCIONES

### Error: "Failed to fetch" en Frontend

```
❌ Problema: Frontend no puede conectar con backend

✅ Verificar:
1. VITE_API_URL está configurado en Netlify
2. Valor correcto: https://tu-backend.onrender.com/api
3. Termina en /api sin barra final
4. Hacer hard refresh: Ctrl+Shift+R
```

### Error: "CORS policy" en Console

```
❌ Problema: CORS bloqueando peticiones

✅ Verificar:
1. FRONTEND_URL en Render está configurado
2. Valor coincide EXACTAMENTE con URL Netlify
3. Sin barra final
4. Backend se reinició después de cambiar variable
```

### Error: "Cannot GET /products" (404) en Netlify

```
❌ Problema: React Router no funciona en rutas directas

✅ Verificar:
1. Archivo netlify.toml existe en RAÍZ del repo
2. Contiene redirect de /* a /index.html
3. Hacer nuevo deploy si faltaba el archivo
```

### Backend responde lento (30+ segundos)

```
✓ NORMAL en Render Free Tier

Explicación:
- El servicio se duerme después de 15 min sin uso
- Primera petición lo despierta (~30 seg)
- Peticiones siguientes son rápidas

Solución: Ninguna (limitación del plan free)
```

---

## 🎉 ¡LISTO!

Tu aplicación está desplegada en:
- **Frontend:** https://tu-app.netlify.app
- **Backend:** https://tu-backend.onrender.com

Próximos pasos opcionales:
- Configurar custom domain
- Configurar Google OAuth en producción
- Configurar emails de recuperación de contraseña
- Monitorear logs y analytics
