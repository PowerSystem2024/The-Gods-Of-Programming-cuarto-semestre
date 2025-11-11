# 🚀 GUÍA RÁPIDA DE DEPLOYMENT - MONOREPO

## ⚠️ IMPORTANTE
Este proyecto es un **MONOREPO** (backend + frontend en el mismo repositorio GitHub).

## 📦 Orden de Deployment

### 1️⃣ PRIMERO: Backend (Render/Railway)

**📁 Carpeta:** `backend/`  
**📖 Guía:** [`backend/DEPLOYMENT.md`](./backend/DEPLOYMENT.md)

**Pasos rápidos:**

1. Crear servicio en [Render](https://render.com/)
2. **⚠️ IMPORTANTE - Root Directory:** `backend`
3. Configurar variables:
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=secreto-random-seguro
   SESSION_SECRET=otro-secreto-random
   FRONTEND_URL=https://tu-app.netlify.app (lo pondrás después)
   ```
4. Deploy → Obtienes: `https://tu-backend.onrender.com`

### 2️⃣ SEGUNDO: Frontend (Netlify)

**📁 Carpeta:** `frontend/`  
**📖 Guía:** [`frontend/DEPLOYMENT.md`](./frontend/DEPLOYMENT.md)

**Pasos rápidos:**

1. Crear sitio en [Netlify](https://netlify.com/)
2. **⚠️ IMPORTANTE - Base directory:** `frontend`
3. **⚠️ IMPORTANTE - Publish directory:** `frontend/dist`
4. Configurar variable:
   ```
   VITE_API_URL=https://tu-backend.onrender.com/api
   ```
5. Deploy → Obtienes: `https://tu-app.netlify.app`

### 3️⃣ TERCERO: Actualizar Backend

Volver a Render → Editar variable:
```
FRONTEND_URL=https://tu-app.netlify.app
```

## ✅ Checklist

- [ ] Backend desplegado en Render/Railway
- [ ] MongoDB Atlas configurado con IP `0.0.0.0/0`
- [ ] Frontend desplegado en Netlify
- [ ] `VITE_API_URL` apunta al backend
- [ ] `FRONTEND_URL` apunta al frontend
- [ ] Archivo `netlify.toml` en la raíz del repo
- [ ] Test de login funciona
- [ ] Test de productos funciona

## 🐛 Problemas Comunes

### "Cannot connect to backend"
✅ Verificar `VITE_API_URL` en Netlify  
✅ Verificar que termina en `/api` sin barra final

### "CORS error"
✅ Verificar `FRONTEND_URL` en Render  
✅ Debe coincidir exactamente con URL de Netlify

### "Cannot read properties of undefined"
✅ Hacer hard refresh: `Ctrl+Shift+R`  
✅ Verificar que no haya errores en Console del navegador

### Backend se duerme (Render Free Tier)
✅ Es normal, despierta en ~30 segundos  
✅ Primera petición es lenta, las siguientes son rápidas

## 📚 Documentación Completa

- **Backend:** [`backend/DEPLOYMENT.md`](./backend/DEPLOYMENT.md)
- **Frontend:** [`frontend/DEPLOYMENT.md`](./frontend/DEPLOYMENT.md)

## 🆘 Ayuda

1. Leer las guías completas en cada carpeta
2. Revisar logs en Render/Netlify dashboards
3. Abrir un issue en el repositorio
