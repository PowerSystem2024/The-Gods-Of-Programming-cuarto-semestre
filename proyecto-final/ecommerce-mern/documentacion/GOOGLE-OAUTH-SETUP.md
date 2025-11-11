# 🔐 Configuración de Google OAuth

## 📋 Pasos para Obtener Credenciales de Google

### 1️⃣ Ir a Google Cloud Console
Visita: https://console.cloud.google.com/

### 2️⃣ Crear un Nuevo Proyecto
1. Click en el selector de proyectos (arriba a la izquierda)
2. Click en "Nuevo Proyecto"
3. Nombre: `E-Commerce MERN`
4. Click en "Crear"

### 3️⃣ Habilitar la API de Google+
1. En el menú lateral → "APIs y servicios" → "Biblioteca"
2. Buscar "Google+ API"
3. Click en "Habilitar"

### 4️⃣ Configurar Pantalla de Consentimiento
1. "APIs y servicios" → "Pantalla de consentimiento de OAuth"
2. Seleccionar "Externo" → "Crear"
3. Llenar:
   - **Nombre de la app**: E-Commerce MERN
   - **Correo de asistencia**: tu-email@gmail.com
   - **Dominios autorizados**: localhost
   - **Correo del desarrollador**: tu-email@gmail.com
4. Click en "Guardar y continuar"
5. En "Scopes" → "Guardar y continuar"
6. En "Usuarios de prueba" → Agregar tu email → "Guardar y continuar"

### 5️⃣ Crear Credenciales OAuth
1. "APIs y servicios" → "Credenciales"
2. Click en "+ CREAR CREDENCIALES" → "ID de cliente de OAuth 2.0"
3. Tipo de aplicación: "Aplicación web"
4. Nombre: `E-Commerce Web Client`
5. **Orígenes de JavaScript autorizados**:
   ```
   http://localhost:5000
   http://localhost:5173
   ```
6. **URIs de redireccionamiento autorizadas**:
   ```
   http://localhost:5000/api/auth/google/callback
   ```
7. Click en "Crear"

### 6️⃣ Copiar las Credenciales
Aparecerá un modal con:
- **Client ID**: `123456789-abcdefg.apps.googleusercontent.com`
- **Client Secret**: `GOCSPX-abc123def456`

### 7️⃣ Actualizar el archivo `.env`
```env
GOOGLE_CLIENT_ID=TU_CLIENT_ID_AQUI
GOOGLE_CLIENT_SECRET=TU_CLIENT_SECRET_AQUI
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

---

## 🚀 Probar Google OAuth

### Backend
```bash
cd backend
npm run dev
```

### Frontend  
```bash
cd frontend
npm run dev
```

### Flujo de Autenticación

1. **Usuario hace click en "Iniciar sesión con Google"**
   - Frontend redirige a: `http://localhost:5000/api/auth/google`

2. **Google muestra pantalla de consentimiento**
   - Usuario selecciona su cuenta de Google
   - Acepta permisos (email, perfil)

3. **Google redirige al callback**
   - URL: `http://localhost:5000/api/auth/google/callback`
   - Backend recibe código de autorización

4. **Backend procesa la autenticación**
   - Intercambia código por token de acceso
   - Obtiene datos del usuario (email, nombre, foto)
   - Busca o crea usuario en MongoDB
   - Genera JWT

5. **Redirige al frontend con token**
   - URL: `http://localhost:5173/auth/callback?token=JWT_TOKEN`
   - Frontend guarda el token
   - Usuario queda autenticado

---

## 🔒 Seguridad

### Producción
Actualizar en Google Cloud Console:

**Orígenes autorizados**:
```
https://tu-dominio.com
```

**URIs de redireccionamiento**:
```
https://tu-dominio.com/api/auth/google/callback
```

Actualizar `.env`:
```env
FRONTEND_URL=https://tu-dominio.com
GOOGLE_CALLBACK_URL=https://tu-dominio.com/api/auth/google/callback
```

---

## ✅ Verificar Configuración

### 1. Verificar variables de entorno
```bash
# En backend/.env
GOOGLE_CLIENT_ID debe empezar con números
GOOGLE_CLIENT_SECRET debe empezar con GOCSPX-
```

### 2. Probar endpoint
```bash
curl http://localhost:5000/api/auth/google
```
Debería redirigir a Google.

### 3. Ver logs
```bash
# Terminal del backend
# Debería mostrar: "Servidor corriendo en puerto 5000"
```

---

## 🐛 Solución de Problemas

### Error: `redirect_uri_mismatch`
✅ **Solución**: Verificar que el URI en Google Console sea exactamente:
```
http://localhost:5000/api/auth/google/callback
```

### Error: `invalid_client`
✅ **Solución**: Verificar CLIENT_ID y CLIENT_SECRET en `.env`

### Error: `Access blocked`
✅ **Solución**: Agregar tu email en "Usuarios de prueba" en Google Console

### No redirige al frontend
✅ **Solución**: Verificar `FRONTEND_URL` en `.env`

---

## 📚 Flujo Completo

```
Usuario → Frontend → Backend → Google → Backend → Frontend
   |         |          |         |         |          |
Click    Redirect   /google   Auth     Callback   Guarda
 btn     a API      endpoint  screen   con token   token
```

---

**¡Listo!** Ahora puedes usar Google OAuth en tu e-commerce 🎉
