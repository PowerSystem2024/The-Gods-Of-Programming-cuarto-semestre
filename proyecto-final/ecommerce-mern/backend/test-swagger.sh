#!/bin/bash

# 🚀 Script de Instalación y Prueba de Swagger
# Este script instala las dependencias y abre Swagger UI automáticamente

echo "📦 Instalando dependencias de Swagger..."
cd backend
npm install

echo ""
echo "✅ Dependencias instaladas:"
echo "   - swagger-jsdoc@6.2.8"
echo "   - swagger-ui-express@5.0.0"
echo ""

echo "🚀 Iniciando servidor backend..."
echo ""
echo "Una vez iniciado, accede a:"
echo ""
echo "   📚 Swagger UI:    http://localhost:5000/api-docs"
echo "   📄 JSON Spec:     http://localhost:5000/api-docs.json"
echo "   🏠 API Root:      http://localhost:5000/api"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎯 Endpoints documentados: 39"
echo "   • Auth:      11 endpoints"
echo "   • Products:   9 endpoints"
echo "   • Cart:      10 endpoints"
echo "   • Orders:     9 endpoints"
echo ""
echo "🔐 Para probar endpoints protegidos:"
echo "   1. Usa POST /api/auth/login para obtener un token"
echo "   2. Clic en 'Authorize' en Swagger UI"
echo "   3. Ingresa: Bearer {tu_token}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Iniciar servidor
npm start
