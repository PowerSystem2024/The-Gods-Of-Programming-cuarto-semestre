# 🚀 Script de Instalación y Prueba de Swagger
# Este script instala las dependencias y abre Swagger UI automáticamente

Write-Host "📦 Instalando dependencias de Swagger..." -ForegroundColor Cyan
Set-Location backend
npm install

Write-Host ""
Write-Host "✅ Dependencias instaladas:" -ForegroundColor Green
Write-Host "   - swagger-jsdoc@6.2.8"
Write-Host "   - swagger-ui-express@5.0.0"
Write-Host ""

Write-Host "🚀 Iniciando servidor backend..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Una vez iniciado, accede a:" -ForegroundColor White
Write-Host ""
Write-Host "   📚 Swagger UI:    http://localhost:5000/api-docs" -ForegroundColor Blue
Write-Host "   📄 JSON Spec:     http://localhost:5000/api-docs.json" -ForegroundColor Blue
Write-Host "   🏠 API Root:      http://localhost:5000/api" -ForegroundColor Blue
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""
Write-Host "🎯 Endpoints documentados: 39" -ForegroundColor Magenta
Write-Host "   • Auth:      11 endpoints"
Write-Host "   • Products:   9 endpoints"
Write-Host "   • Cart:      10 endpoints"
Write-Host "   • Orders:     9 endpoints"
Write-Host ""
Write-Host "🔐 Para probar endpoints protegidos:" -ForegroundColor Yellow
Write-Host "   1. Usa POST /api/auth/login para obtener un token"
Write-Host "   2. Clic en 'Authorize' en Swagger UI"
Write-Host "   3. Ingresa: Bearer {tu_token}"
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# Esperar 3 segundos y abrir el navegador
Start-Sleep -Seconds 3
Start-Process "http://localhost:5000/api-docs"

# Iniciar servidor
npm start
