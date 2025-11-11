# 📐 Arquitectura de Deployment - Monorepo

```
┌─────────────────────────────────────────────────────────────────┐
│                         GITHUB REPOSITORY                        │
│        The-Gods-Of-Programming-cuarto-semestre/proyecto-final   │
│                          ecommerce-mern/                         │
│                                                                  │
│  ┌──────────────────┐              ┌──────────────────┐         │
│  │   backend/       │              │   frontend/      │         │
│  │  - server.js     │              │  - src/          │         │
│  │  - package.json  │              │  - package.json  │         │
│  │  - .env.example  │              │  - .env.example  │         │
│  └──────────────────┘              └──────────────────┘         │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐       │
│  │  netlify.toml  (en raíz)                             │       │
│  │  - base = "frontend"                                 │       │
│  │  - publish = "frontend/dist"                         │       │
│  └──────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
                    │                           │
                    │                           │
                    ▼                           ▼
        ┌───────────────────────┐   ┌────────────────────────┐
        │   RENDER / RAILWAY    │   │      NETLIFY           │
        │   (Backend Deploy)    │   │   (Frontend Deploy)    │
        │                       │   │                        │
        │  Root Dir: backend/   │   │  Base Dir: frontend/   │
        │  Build: npm install   │   │  Build: npm run build  │
        │  Start: npm start     │   │  Publish: frontend/dist│
        │                       │   │                        │
        │  ┌─────────────────┐ │   │  ┌──────────────────┐  │
        │  │ ENV VARIABLES   │ │   │  │  ENV VARIABLES   │  │
        │  │                 │ │   │  │                  │  │
        │  │ MONGODB_URI=... │ │   │  │ VITE_API_URL=    │  │
        │  │ JWT_SECRET=...  │ │   │  │ https://         │  │
        │  │ FRONTEND_URL=   │ │   │  │ backend.         │  │
        │  │ https://        │ │   │  │ onrender.com/api │  │
        │  │ app.netlify.app │ │   │  │                  │  │
        │  └─────────────────┘ │   │  └──────────────────┘  │
        └───────────────────────┘   └────────────────────────┘
                    │                           │
                    │                           │
                    ▼                           ▼
        https://backend.onrender.com  https://app.netlify.app
                    │                           │
                    │                           │
                    └─────────── CORS ──────────┘
                         (Se comunican)


═══════════════════════════════════════════════════════════════════

🔐 FLUJO DE COMUNICACIÓN:

1. Usuario abre: https://app.netlify.app
2. Frontend React carga
3. Frontend hace petición a: https://backend.onrender.com/api/products
4. Backend verifica CORS (FRONTEND_URL)
5. Backend responde con datos
6. Frontend muestra productos

═══════════════════════════════════════════════════════════════════

⚙️ CONFIGURACIÓN CRÍTICA:

Backend (Render):
  Root Directory: backend  ← Solo trabaja con carpeta backend
  FRONTEND_URL: https://app.netlify.app  ← Para CORS

Frontend (Netlify):
  Base Directory: frontend  ← Solo trabaja con carpeta frontend
  VITE_API_URL: https://backend.onrender.com/api  ← API endpoint

═══════════════════════════════════════════════════════════════════

📦 MONOREPO vs REPOS SEPARADOS:

MONOREPO (tu caso):
✅ Un solo repositorio GitHub
✅ Deploy con "Root/Base Directory"
✅ Netlify.toml en raíz
❌ Render/Netlify descargan TODO pero usan solo su carpeta

REPOS SEPARADOS:
✅ Dos repositorios: backend-repo, frontend-repo
✅ Cada uno se deploya independiente
❌ Más difícil de mantener sincronizado
```
