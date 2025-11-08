@echo off
echo ====================================
echo 🚀 Iniciando E-Commerce MERN
echo ====================================
echo.

echo 📦 Instalando dependencias del backend...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Error instalando dependencias del backend
    pause
    exit /b %errorlevel%
)

echo.
echo 📦 Instalando dependencias del frontend...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Error instalando dependencias del frontend
    pause
    exit /b %errorlevel%
)

echo.
echo ✅ Dependencias instaladas correctamente
echo.
echo ====================================
echo 📝 Configuración
echo ====================================
echo.
echo 1. Asegúrate de tener MongoDB corriendo
echo 2. Verifica los archivos .env en backend y frontend
echo 3. Lee EJECUTAR.md para más detalles
echo.
echo Presiona cualquier tecla para continuar con el inicio de servidores...
pause >nul

echo.
echo ====================================
echo 🔧 Iniciando servidores...
echo ====================================
echo.

echo Abriendo backend en nueva ventana...
start cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak >nul

echo Abriendo frontend en nueva ventana...
start cmd /k "cd frontend && npm run dev"

echo.
echo ✅ Servidores iniciados
echo.
echo 📍 Backend: http://localhost:5000
echo 📍 Frontend: http://localhost:5173
echo.
echo Presiona cualquier tecla para salir...
pause >nul
