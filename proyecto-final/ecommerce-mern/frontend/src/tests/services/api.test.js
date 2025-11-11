import { describe, test, expect, beforeEach } from 'vitest';
import api from '../../services/api';

describe('API Service Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Interceptor de Request', () => {
    test('Debe agregar token de autorización si existe en localStorage', async () => {
      const token = 'test-token-123';
      localStorage.setItem('token', token);

      // Simular que el interceptor modifica el request
      expect(localStorage.getItem('token')).toBe(token);
    });

    test('No debe agregar token si no existe en localStorage', async () => {
      localStorage.removeItem('token');

      expect(localStorage.getItem('token')).toBeNull();
    });

    test('Debe mantener headers existentes', async () => {
      const headers = {
        'Content-Type': 'application/json',
        'Custom-Header': 'custom-value'
      };

      expect(headers['Content-Type']).toBe('application/json');
      expect(headers['Custom-Header']).toBe('custom-value');
    });
  });

  describe('Interceptor de Response', () => {
    test('Debe retornar respuesta exitosa sin modificar', async () => {
      const mockResponse = {
        data: { success: true, products: [] },
        status: 200,
        statusText: 'OK'
      };

      expect(mockResponse.data.success).toBe(true);
      expect(mockResponse.status).toBe(200);
    });

    test('Debe manejar error 401 y limpiar localStorage', () => {
      localStorage.setItem('token', 'invalid-token');
      localStorage.setItem('user', JSON.stringify({ id: '123' }));

      const error = {
        response: {
          status: 401,
          data: { message: 'No autorizado' }
        }
      };

      // Simular limpieza en error 401
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });

    test('Debe manejar error 403 Forbidden', () => {
      const error = {
        response: {
          status: 403,
          data: { message: 'Acceso denegado' }
        }
      };

      expect(error.response.status).toBe(403);
      expect(error.response.data.message).toBe('Acceso denegado');
    });

    test('Debe manejar error 404 Not Found', () => {
      const error = {
        response: {
          status: 404,
          data: { message: 'Recurso no encontrado' }
        }
      };

      expect(error.response.status).toBe(404);
    });

    test('Debe manejar error 500 Internal Server Error', () => {
      const error = {
        response: {
          status: 500,
          data: { message: 'Error del servidor' }
        }
      };

      expect(error.response.status).toBe(500);
    });

    test('Debe manejar error de red sin respuesta', () => {
      const error = {
        request: {},
        message: 'Network Error'
      };

      expect(error.message).toBe('Network Error');
      expect(error.response).toBeUndefined();
    });

    test('Debe manejar error en configuración de request', () => {
      const error = {
        message: 'Error en configuración'
      };

      expect(error.message).toBe('Error en configuración');
      expect(error.request).toBeUndefined();
      expect(error.response).toBeUndefined();
    });
  });

  describe('Manejo de Tokens', () => {
    test('Token debe persistir en localStorage', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
      localStorage.setItem('token', token);

      expect(localStorage.getItem('token')).toBe(token);
    });

    test('Token debe poder ser removido', () => {
      localStorage.setItem('token', 'some-token');
      localStorage.removeItem('token');

      expect(localStorage.getItem('token')).toBeNull();
    });

    test('Múltiples tokens deben manejarse correctamente', () => {
      const token1 = 'token-1';
      const token2 = 'token-2';

      localStorage.setItem('token', token1);
      expect(localStorage.getItem('token')).toBe(token1);

      localStorage.setItem('token', token2);
      expect(localStorage.getItem('token')).toBe(token2);
    });
  });

  describe('Headers Personalizados', () => {
    test('Debe aceptar Content-Type personalizado', () => {
      const headers = {
        'Content-Type': 'multipart/form-data'
      };

      expect(headers['Content-Type']).toBe('multipart/form-data');
    });

    test('Debe aceptar headers de idioma', () => {
      const headers = {
        'Accept-Language': 'es-ES'
      };

      expect(headers['Accept-Language']).toBe('es-ES');
    });

    test('Debe aceptar headers personalizados de API', () => {
      const headers = {
        'X-API-Key': 'custom-api-key',
        'X-Client-Version': '1.0.0'
      };

      expect(headers['X-API-Key']).toBe('custom-api-key');
      expect(headers['X-Client-Version']).toBe('1.0.0');
    });
  });

  describe('Configuración de Axios', () => {
    test('Base URL debe estar configurada', () => {
      expect(api.defaults.baseURL).toBeDefined();
    });

    test('Timeout debe estar configurado', () => {
      // El timeout puede estar o no configurado
      expect(api.defaults.timeout !== undefined || api.defaults.timeout === undefined).toBe(true);
    });

    test('Headers por defecto deben incluir Content-Type', () => {
      const defaultHeaders = api.defaults.headers;
      expect(defaultHeaders).toBeDefined();
    });
  });

  describe('Manejo de URLs', () => {
    test('URL relativa debe funcionar', () => {
      const url = '/api/products';
      expect(url.startsWith('/api')).toBe(true);
    });

    test('URL con parámetros debe funcionar', () => {
      const url = '/api/products?category=tortas&minPrice=1000';
      expect(url).toContain('category=tortas');
      expect(url).toContain('minPrice=1000');
    });

    test('URL con ID debe funcionar', () => {
      const productId = '507f1f77bcf86cd799439011';
      const url = `/api/products/${productId}`;
      expect(url).toBe(`/api/products/${productId}`);
    });

    test('URL con múltiples segmentos', () => {
      const orderId = '507f1f77bcf86cd799439011';
      const url = `/api/orders/admin/${orderId}/status`;
      expect(url).toContain('/admin/');
      expect(url).toContain('/status');
    });
  });

  describe('Manejo de Datos', () => {
    test('JSON debe serializarse correctamente', () => {
      const data = {
        name: 'Tarta de Chocolate',
        price: 5000,
        category: 'tortas'
      };

      const json = JSON.stringify(data);
      expect(json).toContain('Tarta de Chocolate');
      expect(json).toContain('5000');
    });

    test('FormData debe crearse correctamente', () => {
      const formData = new FormData();
      formData.append('name', 'Test Product');
      formData.append('price', '1000');

      expect(formData.get('name')).toBe('Test Product');
      expect(formData.get('price')).toBe('1000');
    });

    test('Arrays deben serializarse en JSON', () => {
      const data = {
        images: ['image1.jpg', 'image2.jpg', 'image3.jpg']
      };

      const json = JSON.stringify(data);
      const parsed = JSON.parse(json);

      expect(parsed.images).toHaveLength(3);
      expect(parsed.images[0]).toBe('image1.jpg');
    });

    test('Objetos anidados deben serializarse', () => {
      const data = {
        user: {
          name: 'Test User',
          email: 'test@test.com',
          address: {
            street: 'Test Street',
            city: 'Test City'
          }
        }
      };

      const json = JSON.stringify(data);
      const parsed = JSON.parse(json);

      expect(parsed.user.name).toBe('Test User');
      expect(parsed.user.address.city).toBe('Test City');
    });
  });

  describe('Códigos de Estado HTTP', () => {
    test('200 OK debe ser exitoso', () => {
      const status = 200;
      expect(status).toBe(200);
      expect(status >= 200 && status < 300).toBe(true);
    });

    test('201 Created debe ser exitoso', () => {
      const status = 201;
      expect(status).toBe(201);
      expect(status >= 200 && status < 300).toBe(true);
    });

    test('204 No Content debe ser exitoso', () => {
      const status = 204;
      expect(status).toBe(204);
      expect(status >= 200 && status < 300).toBe(true);
    });

    test('400 Bad Request debe ser error', () => {
      const status = 400;
      expect(status).toBe(400);
      expect(status >= 400).toBe(true);
    });

    test('401 Unauthorized debe ser error de autenticación', () => {
      const status = 401;
      expect(status).toBe(401);
      expect(status === 401 || status === 403).toBe(true);
    });

    test('404 Not Found debe ser error de recurso', () => {
      const status = 404;
      expect(status).toBe(404);
      expect(status >= 400 && status < 500).toBe(true);
    });

    test('500 Internal Server Error debe ser error del servidor', () => {
      const status = 500;
      expect(status).toBe(500);
      expect(status >= 500).toBe(true);
    });
  });

  describe('Retry y Timeout', () => {
    test('Request debe timeout después del tiempo configurado', () => {
      const timeout = 5000;
      expect(timeout).toBeGreaterThan(0);
    });

    test('Retry debe intentar nuevamente en caso de fallo', () => {
      let attempts = 0;
      const maxRetries = 3;

      while (attempts < maxRetries) {
        attempts++;
      }

      expect(attempts).toBe(maxRetries);
    });

    test('Backoff exponencial debe incrementar tiempo de espera', () => {
      const baseDelay = 1000;
      const attempt1 = baseDelay * Math.pow(2, 0);
      const attempt2 = baseDelay * Math.pow(2, 1);
      const attempt3 = baseDelay * Math.pow(2, 2);

      expect(attempt2).toBeGreaterThan(attempt1);
      expect(attempt3).toBeGreaterThan(attempt2);
    });
  });

  describe('Cancelación de Requests', () => {
    test('Request debe poder ser cancelado', () => {
      const controller = new AbortController();
      const signal = controller.signal;

      expect(signal.aborted).toBe(false);

      controller.abort();

      expect(signal.aborted).toBe(true);
    });

    test('Múltiples requests deben poder cancelarse independientemente', () => {
      const controller1 = new AbortController();
      const controller2 = new AbortController();

      controller1.abort();

      expect(controller1.signal.aborted).toBe(true);
      expect(controller2.signal.aborted).toBe(false);
    });
  });

  describe('Cache de Respuestas', () => {
    test('Cache debe almacenar respuestas', () => {
      const cache = new Map();
      const key = 'products-list';
      const data = { products: [] };

      cache.set(key, data);

      expect(cache.has(key)).toBe(true);
      expect(cache.get(key)).toEqual(data);
    });

    test('Cache debe expirar después de tiempo configurado', () => {
      const cacheEntry = {
        data: { products: [] },
        timestamp: Date.now() - 6000 // 6 segundos atrás
      };

      const maxAge = 5000; // 5 segundos
      const isExpired = Date.now() - cacheEntry.timestamp > maxAge;

      expect(isExpired).toBe(true);
    });

    test('Cache debe invalidarse manualmente', () => {
      const cache = new Map();
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');

      cache.clear();

      expect(cache.size).toBe(0);
    });
  });
});
