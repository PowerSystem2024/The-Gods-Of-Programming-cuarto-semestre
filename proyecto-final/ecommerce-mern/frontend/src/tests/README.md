# Tests del Frontend 🧪

## Configuración de Testing

Este proyecto utiliza **Vitest** como framework de testing junto con **React Testing Library** para probar los componentes de React.

### Stack de Testing

- **Vitest**: Framework de testing rápido y moderno
- **@testing-library/react**: Utilidades para testing de componentes React
- **@testing-library/jest-dom**: Matchers personalizados para DOM
- **@testing-library/user-event**: Simulación de interacciones de usuario
- **jsdom**: Implementación de DOM para Node.js
- **@vitest/ui**: Interfaz visual para ver los tests
- **@vitest/coverage-v8**: Generador de reportes de cobertura

## Estructura de Tests

```
frontend/src/tests/
├── setup.js                 # Configuración global de tests
├── services/
│   └── api.test.js         # Tests del servicio API
├── utils/
│   └── helpers.test.js     # Tests de funciones helper
├── components/             # Tests de componentes (próximo commit)
└── pages/                  # Tests de páginas (próximo commit)
```

## Scripts Disponibles

```bash
# Ejecutar tests en modo watch
npm test

# Ejecutar tests una sola vez
npm run test:run

# Ejecutar tests con interfaz visual
npm run test:ui

# Generar reporte de cobertura
npm run test:coverage
```

## Instalación de Dependencias

```bash
cd frontend
npm install
```

Esto instalará automáticamente todas las dependencias de testing definidas en `package.json`.

## Tests Actuales

### 🔌 API Service Tests (`api.test.js`)

Tests del servicio de API que maneja todas las peticiones HTTP:

- ✅ Interceptores de Request (agregar token de autorización)
- ✅ Interceptores de Response (manejo de errores)
- ✅ Manejo de Tokens (persistencia en localStorage)
- ✅ Headers Personalizados
- ✅ Configuración de Axios
- ✅ Manejo de URLs (relativas, con parámetros, con IDs)
- ✅ Serialización de Datos (JSON, FormData)
- ✅ Códigos de Estado HTTP (200, 201, 400, 401, 404, 500)
- ✅ Retry y Timeout
- ✅ Cancelación de Requests
- ✅ Cache de Respuestas

**Total: 70+ tests**

### 🛠️ Helper Functions Tests (`helpers.test.js`)

Tests de funciones utilitarias y helpers:

- ✅ Formateo de Precios (formato argentino ARS)
- ✅ Formateo de Fechas (formato DD/MM/YYYY)
- ✅ Validación de Email (regex completo)
- ✅ Truncado de Texto
- ✅ Capitalización de Strings
- ✅ Generación de Slugs
- ✅ Cálculo de Descuentos
- ✅ Utilidades de Arrays (remover duplicados)
- ✅ Utilidades de Objetos (isEmpty)
- ✅ Utilidades de Números (isEven, isOdd)
- ✅ Utilidades de Strings (reverse)
- ✅ Debounce
- ✅ Query String Parsing
- ✅ Deep Clone

**Total: 80+ tests**

## Cobertura Actual

Los tests actuales cubren:
- Servicios HTTP y API
- Funciones utilitarias
- Validaciones
- Formateo de datos

## Próximos Tests (siguiente commit)

- 🔜 Tests de Componentes React
- 🔜 Tests de Context API (CartContext)
- 🔜 Tests de Páginas (Login, Register, Products, Cart)
- 🔜 Tests de Integración E2E
- 🔜 Tests de Performance

## Convenciones de Testing

1. **Nombres descriptivos**: Usar `describe` para agrupar tests relacionados
2. **AAA Pattern**: Arrange, Act, Assert
3. **Un concepto por test**: Cada test debe probar una sola cosa
4. **Mocks cuando sea necesario**: Usar `vi.mock()` para dependencias externas
5. **Cleanup**: Los tests deben ser independientes y limpiarse automáticamente

## Ejemplo de Test

```javascript
import { describe, test, expect } from 'vitest';

describe('MiComponente', () => {
  test('Debe renderizar correctamente', () => {
    // Arrange: Preparar datos
    const props = { title: 'Test' };
    
    // Act: Ejecutar acción
    render(<MiComponente {...props} />);
    
    // Assert: Verificar resultado
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

## Configuración Personalizada

La configuración de Vitest se encuentra en `vitest.config.js` e incluye:

- Entorno jsdom para simular el navegador
- Globals habilitados (no necesitas importar `describe`, `test`, `expect`)
- Setup automático antes de cada test
- Aliases de paths (@/ para src/)
- Configuración de coverage

## Notas

- Los tests NO se ejecutan automáticamente en cada cambio de código
- Debes ejecutarlos manualmente con `npm test`
- El modo watch solo está activo cuando ejecutas `npm test`
- Los reportes de cobertura se generan en `coverage/`

## Recursos

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)
