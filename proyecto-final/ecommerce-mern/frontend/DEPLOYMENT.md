# 🚀 Guía de Deployment - Frontend Netlify (Monorepo)

> ⚠️ **IMPORTANTE:** Este proyecto está en un MONOREPO (backend + frontend en el mismo repositorio). Sigue las instrucciones específicas para monorepos.

## 📋 Pre-requisitos

1. **Backend desplegado** y funcionando (ver `backend/DEPLOYMENT.md`)
   - ✅ Backend corriendo en Render/Railway
   - ✅ URL del backend (ej: `https://tu-backend.onrender.com`)
2. **Cuenta en Netlify** - [Crear cuenta](https://app.netlify.com/signup)
3. **Repositorio en GitHub:** `The-Gods-Of-Programming-cuarto-semestre`

## 🌐 Deployment en Netlify

### ⚠️ CONFIGURACIÓN ESPECIAL PARA MONOREPO

#### Paso 1: Conectar con GitHub

1. **Ir a [Netlify](https://app.netlify.com/)**
2. Click en **"Add new site"** → **"Import an existing project"**
3. Seleccionar **"GitHub"**
4. Autorizar Netlify a acceder a tu repositorio
5. Seleccionar el repositorio: **`The-Gods-Of-Programming-cuarto-semestre`**

#### Paso 2: ⚠️ CONFIGURAR BUILD SETTINGS (CRÍTICO PARA MONOREPO)

```yaml
# ✅ CONFIGURACIÓN CORRECTA PARA MONOREPO

Base directory: frontend              👈 IMPORTANTE: Solo carpeta frontend
Build command: npm run build          👈 Se ejecuta desde /frontend
Publish directory: frontend/dist      👈 Path completo desde raíz
```

**Explicación:**
- Netlify clonará TODO el repositorio
- Pero ejecutará comandos solo dentro de `/frontend`
- El build generará archivos en `/frontend/dist`
- Netlify publicará desde `/frontend/dist`

#### Paso 3: Configurar Variables de Entorno

Ir a **Site settings** → **Environment variables** → **Add a variable**

```bash
# ✅ REQUERIDA
VITE_API_URL=https://tu-backend.onrender.com/api

# ⚠️ IMPORTANTE:
# - URL debe ser la de tu backend en Render/Railway
# - DEBE terminar en /api
# - NO poner barra final: ❌ /api/
# - Correcto: ✅ /api
```

**Ejemplo real:**
```
VITE_API_URL=https://ecommerce-backend-abc123.onrender.com/api
```

#### Paso 4: Deploy

1. Click en **"Deploy site"**
2. Netlify automáticamente:
   - ✅ Clona el repositorio completo
   - ✅ Va a la carpeta `/frontend`
   - ✅ Ejecuta `npm install` (instala dependencias)
   - ✅ Ejecuta `npm run build` (genera `/frontend/dist`)
   - ✅ Publica el contenido de `/frontend/dist`

3. ⏱️ **El primer deploy tarda 2-4 minutos**

4. ✅ **Obtendrás una URL:**
   - Temporal: `https://random-name-123456.netlify.app`
   - Puedes cambiarla en: **Site settings** → **Site details** → **Change site name**

---

## 🔧 Configuración Post-Deployment

### 1. ⚠️ ACTUALIZAR FRONTEND_URL EN EL BACKEND

**CRÍTICO:** El backend necesita saber la URL del frontend para CORS.

En **Render/Railway** → Variables de entorno:

```bash
# Antes (desarrollo):
FRONTEND_URL=http://localhost:5173

# Después (producción):
FRONTEND_URL=https://tu-app.netlify.app

# ⚠️ SIN barra final
# ❌ INCORRECTO: https://tu-app.netlify.app/
# ✅ CORRECTO:   https://tu-app.netlify.app
```

**Pasos:**
1. Ir a Render → Tu servicio → Environment
2. Editar `FRONTEND_URL`
3. Guardar (el servicio se reiniciará automáticamente)

### 2. Verificar Archivo netlify.toml

El archivo `netlify.toml` en la **raíz del repositorio** ya está configurado:

```toml
[build]
  base = "frontend"
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

✅ Este archivo es CRÍTICO para que funcione React Router en producción.

### 3. Actualizar Google OAuth (si lo usas)

En [Google Cloud Console](https://console.cloud.google.com/):

**Authorized JavaScript origins:**
```
https://tu-app.netlify.app
```

**Authorized redirect URIs:**
```
https://tu-backend.onrender.com/api/auth/google/callback
```

## 📊 Verificación del Deployment

1. **Test básico:**
   - Abrir `https://tu-app.netlify.app`
   - La página debe cargar correctamente

2. **Test de navegación:**
   - Navegar a diferentes rutas (`/products`, `/login`, etc.)
   - Todas deben funcionar (gracias al redirect en `netlify.toml`)

3. **Test de API:**
   - Abrir DevTools → Network
   - Intentar hacer login o cargar productos
   - Verificar que las peticiones van a `https://tu-backend.onrender.com/api`

4. **Test de autenticación:**
   - Crear cuenta
   - Iniciar sesión
   - Verificar que se guarda el token

## 🐛 Troubleshooting

### Error: "Failed to fetch"
- **Causa:** El frontend no puede conectar con el backend
- **Solución:**
  1. Verificar que `VITE_API_URL` esté configurado correctamente
  2. Verificar que el backend esté funcionando
  3. Verificar CORS en el backend

### Error: "404 Not Found" en rutas
- **Causa:** Falta configuración de redirects
- **Solución:** Verificar que existe `netlify.toml` con:
  ```toml
  [[redirects]]
    from = "/*"
    to = "/index.html"
    status = 200
  ```

### Error: "CORS policy"
- **Causa:** Backend no acepta peticiones desde Netlify
- **Solución:** Verificar `FRONTEND_URL` en backend

### Build falla
- **Causa:** Errores en el código o variables de entorno faltantes
- **Solución:**
  1. Revisar logs de build en Netlify
  2. Probar build localmente: `npm run build`
  3. Verificar todas las variables de entorno

### Cambios no se ven reflejados
- **Causa:** Cache del navegador
- **Solución:**
  1. Hard refresh: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
  2. Limpiar cache de Netlify: Deploys → Trigger deploy → Clear cache and deploy

## 🔄 Deploy Automático

Netlify hace deploy automático cuando:
- Haces push a la rama principal (main/master)
- Haces merge de un Pull Request

Para deshabilitar auto-deploy:
- Site settings → Build & deploy → Continuous deployment → Stop builds

## 🎯 Mejores Prácticas

1. **Usar diferentes sitios para staging y production:**
   - Crear un sitio de Netlify para cada rama
   - `main` → Producción
   - `develop` → Staging

2. **Deploy Previews:**
   - Netlify crea previews automáticos para Pull Requests
   - URL temporal: `https://deploy-preview-123--tu-app.netlify.app`

3. **Rollback:**
   - En caso de problemas, puedes volver a un deploy anterior
   - Deploys → Click en deploy anterior → Publish deploy

4. **Monitoreo:**
   - Analytics (gratis limitado)
   - Logs de funciones
   - Forms (si los usas)

## 🔒 Seguridad

1. **HTTPS:** Activado automáticamente por Netlify
2. **Headers de seguridad:** Configurados en `netlify.toml`
3. **Variables de entorno:** Nunca commitear `.env` al repo
4. **Secrets:** Usar variables de entorno de Netlify, no hardcodear

## 📝 Comandos Útiles

```bash
# Ver estado del sitio
netlify status

# Ver logs
netlify logs

# Abrir dashboard
netlify open

# Abrir sitio en navegador
netlify open:site

# Ver variables de entorno
netlify env:list

# Test de build local
npm run build
netlify dev
```

## 📚 Recursos

- [Netlify Docs](https://docs.netlify.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Router con Netlify](https://ui.dev/react-router-cannot-get-url-refresh)
- [Environment Variables en Netlify](https://docs.netlify.com/configure-builds/environment-variables/)

## ✅ Checklist Final

- [ ] Backend desplegado y funcionando
- [ ] `VITE_API_URL` configurado en Netlify
- [ ] `FRONTEND_URL` configurado en backend
- [ ] `netlify.toml` committeado al repo
- [ ] Build exitoso en Netlify
- [ ] Rutas funcionan correctamente (test de navegación)
- [ ] API se conecta correctamente (test de login/productos)
- [ ] Google OAuth actualizado (si se usa)
- [ ] Custom domain configurado (opcional)
- [ ] SSL/HTTPS activo (automático)
