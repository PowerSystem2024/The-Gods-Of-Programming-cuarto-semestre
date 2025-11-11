import { describe, test, expect } from 'vitest';

describe('Helper Functions Tests', () => {
  describe('Formateo de Precios', () => {
    const formatPrice = (price) => {
      return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(price);
    };

    test('Debe formatear precio simple', () => {
      const formatted = formatPrice(1000);
      expect(formatted).toContain('1');
      expect(formatted).toContain('000');
    });

    test('Debe formatear precio con miles', () => {
      const formatted = formatPrice(15000);
      expect(formatted).toContain('15');
    });

    test('Debe formatear precio grande', () => {
      const formatted = formatPrice(999999);
      expect(formatted).toBeDefined();
    });

    test('Debe manejar precio 0', () => {
      const formatted = formatPrice(0);
      expect(formatted).toBeDefined();
    });

    test('Debe manejar decimales', () => {
      const formatted = formatPrice(1234.56);
      expect(formatted).toBeDefined();
    });
  });

  describe('Formateo de Fechas', () => {
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    };

    test('Debe formatear fecha actual', () => {
      const formatted = formatDate(new Date());
      expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    test('Debe formatear fecha específica', () => {
      const formatted = formatDate('2024-01-15');
      expect(formatted).toContain('/');
    });

    test('Debe formatear timestamp', () => {
      const formatted = formatDate(1609459200000); // 2021-01-01
      expect(formatted).toBeDefined();
    });

    test('Debe manejar fecha ISO string', () => {
      const formatted = formatDate('2024-11-11T10:30:00Z');
      expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });
  });

  describe('Validación de Email', () => {
    const isValidEmail = (email) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    };

    test('Email válido debe pasar', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
    });

    test('Email con subdomain debe pasar', () => {
      expect(isValidEmail('user@mail.example.com')).toBe(true);
    });

    test('Email sin @ debe fallar', () => {
      expect(isValidEmail('invalid.email.com')).toBe(false);
    });

    test('Email sin dominio debe fallar', () => {
      expect(isValidEmail('test@')).toBe(false);
    });

    test('Email sin usuario debe fallar', () => {
      expect(isValidEmail('@example.com')).toBe(false);
    });

    test('Email vacío debe fallar', () => {
      expect(isValidEmail('')).toBe(false);
    });

    test('Email con espacios debe fallar', () => {
      expect(isValidEmail('test @example.com')).toBe(false);
    });

    test('Email con caracteres especiales válidos', () => {
      expect(isValidEmail('user+tag@example.com')).toBe(true);
    });

    test('Email con guiones', () => {
      expect(isValidEmail('test-user@example-domain.com')).toBe(true);
    });

    test('Email con números', () => {
      expect(isValidEmail('user123@example456.com')).toBe(true);
    });
  });

  describe('Truncado de Texto', () => {
    const truncateText = (text, maxLength) => {
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + '...';
    };

    test('Texto corto no debe truncarse', () => {
      const text = 'Texto corto';
      expect(truncateText(text, 20)).toBe(text);
    });

    test('Texto largo debe truncarse', () => {
      const text = 'Este es un texto muy largo que debe ser truncado';
      const result = truncateText(text, 20);
      expect(result.length).toBe(23); // 20 + '...'
      expect(result.endsWith('...')).toBe(true);
    });

    test('Texto vacío debe manejarse', () => {
      expect(truncateText('', 10)).toBe('');
    });

    test('Longitud exacta no debe truncarse', () => {
      const text = '12345';
      expect(truncateText(text, 5)).toBe(text);
    });
  });

  describe('Capitalización', () => {
    const capitalize = (str) => {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    test('Primera letra debe capitalizarse', () => {
      expect(capitalize('hola')).toBe('Hola');
    });

    test('Todo mayúsculas debe convertirse', () => {
      expect(capitalize('HOLA')).toBe('Hola');
    });

    test('Texto mixto debe normalizarse', () => {
      expect(capitalize('hOlA')).toBe('Hola');
    });

    test('String vacío debe manejarse', () => {
      expect(capitalize('')).toBe('');
    });

    test('Una sola letra debe capitalizarse', () => {
      expect(capitalize('a')).toBe('A');
    });
  });

  describe('Slug Generation', () => {
    const generateSlug = (text) => {
      return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    };

    test('Texto simple debe convertirse a slug', () => {
      expect(generateSlug('Hola Mundo')).toBe('hola-mundo');
    });

    test('Acentos deben removerse', () => {
      expect(generateSlug('Tarta de Crème Brûlée')).toBe('tarta-de-creme-brulee');
    });

    test('Caracteres especiales deben reemplazarse', () => {
      expect(generateSlug('Precio: $5000')).toContain('-');
    });

    test('Espacios múltiples deben convertirse a un guion', () => {
      const slug = generateSlug('Hola   Mundo');
      expect(slug).not.toContain('--');
    });

    test('Guiones al inicio y final deben removerse', () => {
      const slug = generateSlug('-texto-');
      expect(slug).toBe('texto');
    });
  });

  describe('Cálculo de Descuento', () => {
    const calculateDiscount = (originalPrice, discountPercent) => {
      return originalPrice - (originalPrice * discountPercent / 100);
    };

    test('10% de descuento', () => {
      expect(calculateDiscount(1000, 10)).toBe(900);
    });

    test('50% de descuento', () => {
      expect(calculateDiscount(2000, 50)).toBe(1000);
    });

    test('0% de descuento', () => {
      expect(calculateDiscount(1000, 0)).toBe(1000);
    });

    test('100% de descuento', () => {
      expect(calculateDiscount(1000, 100)).toBe(0);
    });

    test('Descuento con decimales', () => {
      expect(calculateDiscount(1000, 15.5)).toBe(845);
    });
  });

  describe('Array Utilities', () => {
    const removeDuplicates = (arr) => {
      return [...new Set(arr)];
    };

    test('Debe remover duplicados', () => {
      const arr = [1, 2, 2, 3, 3, 3, 4];
      expect(removeDuplicates(arr)).toEqual([1, 2, 3, 4]);
    });

    test('Array sin duplicados debe mantenerse igual', () => {
      const arr = [1, 2, 3, 4];
      expect(removeDuplicates(arr)).toEqual(arr);
    });

    test('Array vacío debe mantenerse vacío', () => {
      expect(removeDuplicates([])).toEqual([]);
    });

    test('Strings duplicados deben removerse', () => {
      const arr = ['a', 'b', 'a', 'c', 'b'];
      expect(removeDuplicates(arr)).toEqual(['a', 'b', 'c']);
    });
  });

  describe('Object Utilities', () => {
    const isEmpty = (obj) => {
      return Object.keys(obj).length === 0;
    };

    test('Objeto vacío debe retornar true', () => {
      expect(isEmpty({})).toBe(true);
    });

    test('Objeto con propiedades debe retornar false', () => {
      expect(isEmpty({ a: 1 })).toBe(false);
    });

    test('Objeto con null values debe retornar false', () => {
      expect(isEmpty({ a: null })).toBe(false);
    });
  });

  describe('Number Utilities', () => {
    const isEven = (num) => num % 2 === 0;
    const isOdd = (num) => num % 2 !== 0;

    test('Números pares deben identificarse', () => {
      expect(isEven(2)).toBe(true);
      expect(isEven(4)).toBe(true);
      expect(isEven(100)).toBe(true);
    });

    test('Números impares deben identificarse', () => {
      expect(isOdd(1)).toBe(true);
      expect(isOdd(3)).toBe(true);
      expect(isOdd(99)).toBe(true);
    });

    test('Cero debe ser par', () => {
      expect(isEven(0)).toBe(true);
    });

    test('Números negativos pares', () => {
      expect(isEven(-2)).toBe(true);
    });

    test('Números negativos impares', () => {
      expect(isOdd(-1)).toBe(true);
    });
  });

  describe('String Utilities', () => {
    const reverseString = (str) => str.split('').reverse().join('');

    test('String debe invertirse', () => {
      expect(reverseString('hola')).toBe('aloh');
    });

    test('String vacío debe mantenerse vacío', () => {
      expect(reverseString('')).toBe('');
    });

    test('Palíndromo debe reconocerse', () => {
      const str = 'oso';
      expect(reverseString(str)).toBe(str);
    });

    test('String con espacios', () => {
      expect(reverseString('hola mundo')).toBe('odnum aloh');
    });
  });

  describe('Debounce Utility', () => {
    test('Debounce debe retrasar ejecución', (done) => {
      let counter = 0;
      const debounce = (fn, delay) => {
        let timeoutId;
        return (...args) => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => fn(...args), delay);
        };
      };

      const debouncedFn = debounce(() => {
        counter++;
      }, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      expect(counter).toBe(0);

      setTimeout(() => {
        expect(counter).toBe(1);
        done();
      }, 150);
    });
  });

  describe('Query String Utilities', () => {
    const parseQueryString = (queryString) => {
      const params = new URLSearchParams(queryString);
      const result = {};
      for (const [key, value] of params) {
        result[key] = value;
      }
      return result;
    };

    test('Query string simple debe parsearse', () => {
      const result = parseQueryString('name=test&age=25');
      expect(result.name).toBe('test');
      expect(result.age).toBe('25');
    });

    test('Query string vacío', () => {
      const result = parseQueryString('');
      expect(Object.keys(result).length).toBe(0);
    });

    test('Query string con caracteres especiales', () => {
      const result = parseQueryString('search=test%20product');
      expect(result.search).toBe('test product');
    });
  });

  describe('Deep Clone Utility', () => {
    const deepClone = (obj) => {
      return JSON.parse(JSON.stringify(obj));
    };

    test('Objeto simple debe clonarse', () => {
      const obj = { a: 1, b: 2 };
      const clone = deepClone(obj);
      expect(clone).toEqual(obj);
      expect(clone).not.toBe(obj);
    });

    test('Objeto anidado debe clonarse', () => {
      const obj = { a: { b: { c: 1 } } };
      const clone = deepClone(obj);
      expect(clone).toEqual(obj);
      clone.a.b.c = 2;
      expect(obj.a.b.c).toBe(1);
    });

    test('Array debe clonarse', () => {
      const arr = [1, 2, [3, 4]];
      const clone = deepClone(arr);
      expect(clone).toEqual(arr);
      expect(clone).not.toBe(arr);
    });
  });
});
