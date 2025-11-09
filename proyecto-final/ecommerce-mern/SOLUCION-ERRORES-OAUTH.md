# ⚠️ SOLUCIÓN A ERRORES DE GOOGLE OAUTH

## 🔴 Errores Encontrados y Solucionados

### Error 1: `/api/api/auth/google` (URL duplicada)
**Causa:** El `.env` tenía `VITE_API_URL=http://localhost:5000/api` y el código agregaba `/api/auth/google`

**✅ Solución Aplicada:**
- Cambiado `.env` a: `VITE_API_URL=http://localhost:5000`
- Actualizado `api.js` para agregar `/api` en cada ruta

### Error 2: `redirect_uri_mismatch`
**Causa:** Google Cloud Console necesita configuración específica

**✅ Solución:**

---

## 📋 CONFIGURACIÓN OBLIGATORIA EN GOOGLE CLOUD CONSOLE

### Paso 1: Ve a Google Cloud Console
🔗 https://console.cloud.google.com/

### Paso 2: Selecciona o crea tu proyecto "E-Commerce MERN"

### Paso 3: Ve a "APIs y servicios" → "Credenciales"

### Paso 4: Edita tu "ID de cliente de OAuth 2.0"

### Paso 5: Configura estos URIs EXACTOS:

#### ✅ Orígenes de JavaScript autorizados:
```
http://localhost:5000
http://localhost:5173
```

#### ✅ URIs de redireccionamiento autorizadas:
```
http://localhost:5000/api/auth/google/callback
```

⚠️ **IMPORTANTE:** Debe ser EXACTAMENTE esto, con `/api` en el medio.

### Paso 6: Haz clic en "GUARDAR"

### Paso 7: Copia tus credenciales

Verás algo como:
- **ID de cliente:** `123456789-abcdefgh.apps.googleusercontent.com`
- **Secreto del cliente:** `GOCSPX-abc123def456`

### Paso 8: Actualiza `backend/.env`

```env
# Google OAuth
GOOGLE_CLIENT_ID=PEGA_TU_CLIENT_ID_AQUI
GOOGLE_CLIENT_SECRET=PEGA_TU_CLIENT_SECRET_AQUI
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

⚠️ **NOTA:** La `GOOGLE_CALLBACK_URL` debe terminar en `/api/auth/google/callback`

---

## 🧪 PROBAR QUE FUNCIONE

### 1. Reinicia el backend:
```bash
cd backend
npm run dev
```

### 2. Reinicia el frontend:
```bash
cd frontend
npm run dev
```

### 3. Abre el navegador:
```
http://localhost:5173/login
```

### 4. Haz clic en "Continuar con Google"

**Debe pasar:**
1. ✅ Te redirige a Google (pantalla de login de Google)
2. ✅ Eliges tu cuenta
3. ✅ Aceptas permisos
4. ✅ Te redirige de vuelta a tu app
5. ✅ Quedas autenticado

---

## 🐛 SI AÚN HAY ERRORES

### Error: "redirect_uri_mismatch"
**Solución:** Verifica que en Google Cloud Console tengas EXACTAMENTE:
```
http://localhost:5000/api/auth/google/callback
```

### Error: "invalid_client"
**Solución:** 
1. Verifica que `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` estén correctos en `.env`
2. No debe tener espacios ni comillas extras

### Error: "Access blocked"
**Solución:**
1. Ve a Google Cloud Console
2. "APIs y servicios" → "Pantalla de consentimiento de OAuth"
3. "Usuarios de prueba" → Agrega tu email
4. Guarda

### Error: {"message":"Ruta no encontrada"}
**Solución:**
1. Verifica que el backend esté corriendo en `http://localhost:5000`
2. Abre `http://localhost:5000/api/health` en el navegador
3. Debe responder con un JSON

---

## ✅ CHECKLIST FINAL

Antes de probar, verifica:

- [ ] Backend corriendo en puerto 5000
- [ ] Frontend corriendo en puerto 5173
- [ ] MongoDB corriendo
- [ ] `backend/.env` tiene `GOOGLE_CLIENT_ID`
- [ ] `backend/.env` tiene `GOOGLE_CLIENT_SECRET`
- [ ] `backend/.env` tiene `GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback`
- [ ] Google Cloud Console tiene `http://localhost:5000/api/auth/google/callback` en URIs de redireccionamiento
- [ ] Tu email está en "Usuarios de prueba" de Google Cloud Console

---

## 🎯 ARCHIVOS MODIFICADOS

### ✅ Ya corregidos:
1. `frontend/.env` - Quitado `/api` del final de VITE_API_URL
2. `frontend/src/services/api.js` - Agregado `/api` a cada ruta

### 🔧 Debes configurar TÚ:
1. `backend/.env` - Agregar tus credenciales de Google

---

**¡Listo!** Una vez que configures las credenciales de Google, debería funcionar perfectamente 🚀
