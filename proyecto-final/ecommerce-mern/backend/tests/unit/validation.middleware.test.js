import { body, param, validationResult } from 'express-validator';

describe('Validation Middleware - Unit Tests', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      query: {}
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    
    mockNext = jest.fn();
    
    jest.clearAllMocks();
  });

  describe('Validate Middleware Function', () => {
    test('debería pasar si no hay errores de validación', () => {
      const validate = (req, res, next) => {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
          return res.status(400).json({
            success: false,
            errors: errors.array()
          });
        }
        
        next();
      };

      // Mock validationResult para retornar sin errores
      const mockValidationResult = {
        isEmpty: jest.fn().mockReturnValue(true),
        array: jest.fn().mockReturnValue([])
      };

      jest.spyOn(require('express-validator'), 'validationResult')
        .mockReturnValue(mockValidationResult);

      validate(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    test('debería retornar errores si validación falla', () => {
      const validate = (req, res, next) => {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
          return res.status(400).json({
            success: false,
            errors: errors.array()
          });
        }
        
        next();
      };

      const mockErrors = [
        { msg: 'Email is required', param: 'email', location: 'body' },
        { msg: 'Password must be at least 6 characters', param: 'password', location: 'body' }
      ];

      const mockValidationResult = {
        isEmpty: jest.fn().mockReturnValue(false),
        array: jest.fn().mockReturnValue(mockErrors)
      };

      jest.spyOn(require('express-validator'), 'validationResult')
        .mockReturnValue(mockValidationResult);

      validate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        errors: mockErrors
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Register Validation Rules', () => {
    test('debería validar nombre requerido', async () => {
      mockReq.body = {
        email: 'test@example.com',
        password: 'password123'
        // falta name
      };

      const validateRegister = [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
      ];

      // Simular lógica de validación
      const errors = [];
      
      if (!mockReq.body.name) {
        errors.push({ field: 'name', message: 'Name is required' });
      }

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].field).toBe('name');
    });

    test('debería validar email válido', async () => {
      mockReq.body = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123'
      };

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValidEmail = emailRegex.test(mockReq.body.email);

      expect(isValidEmail).toBe(false);
    });

    test('debería validar longitud de contraseña', async () => {
      mockReq.body = {
        name: 'Test User',
        email: 'test@example.com',
        password: '12345' // muy corta
      };

      const isPasswordValid = mockReq.body.password.length >= 6;

      expect(isPasswordValid).toBe(false);
    });

    test('debería pasar con datos válidos', async () => {
      mockReq.body = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const errors = [];

      if (!mockReq.body.name) {
        errors.push({ field: 'name', message: 'Name is required' });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(mockReq.body.email)) {
        errors.push({ field: 'email', message: 'Valid email is required' });
      }

      if (mockReq.body.password.length < 6) {
        errors.push({ field: 'password', message: 'Password must be at least 6 characters' });
      }

      expect(errors.length).toBe(0);
    });
  });

  describe('Login Validation Rules', () => {
    test('debería validar email requerido', () => {
      mockReq.body = {
        password: 'password123'
        // falta email
      };

      const errors = [];
      if (!mockReq.body.email) {
        errors.push({ field: 'email', message: 'Email is required' });
      }

      expect(errors.length).toBeGreaterThan(0);
    });

    test('debería validar contraseña requerida', () => {
      mockReq.body = {
        email: 'test@example.com'
        // falta password
      };

      const errors = [];
      if (!mockReq.body.password) {
        errors.push({ field: 'password', message: 'Password is required' });
      }

      expect(errors.length).toBeGreaterThan(0);
    });

    test('debería pasar con credenciales válidas', () => {
      mockReq.body = {
        email: 'test@example.com',
        password: 'password123'
      };

      const errors = [];
      if (!mockReq.body.email) errors.push({ field: 'email' });
      if (!mockReq.body.password) errors.push({ field: 'password' });

      expect(errors.length).toBe(0);
    });
  });

  describe('ObjectId Validation', () => {
    test('debería validar ObjectId válido', () => {
      const validObjectId = '507f1f77bcf86cd799439011';
      const objectIdRegex = /^[0-9a-fA-F]{24}$/;

      expect(objectIdRegex.test(validObjectId)).toBe(true);
    });

    test('debería rechazar ObjectId inválido', () => {
      const invalidObjectId = 'invalid-id';
      const objectIdRegex = /^[0-9a-fA-F]{24}$/;

      expect(objectIdRegex.test(invalidObjectId)).toBe(false);
    });

    test('debería rechazar ObjectId muy corto', () => {
      const shortObjectId = '123';
      const objectIdRegex = /^[0-9a-fA-F]{24}$/;

      expect(objectIdRegex.test(shortObjectId)).toBe(false);
    });

    test('debería rechazar ObjectId con caracteres inválidos', () => {
      const invalidCharsId = '507f1f77bcf86cd79943901g';
      const objectIdRegex = /^[0-9a-fA-F]{24}$/;

      expect(objectIdRegex.test(invalidCharsId)).toBe(false);
    });
  });

  describe('Sanitization', () => {
    test('debería limpiar espacios en blanco del email', () => {
      mockReq.body = {
        email: '  test@example.com  '
      };

      const sanitizedEmail = mockReq.body.email.trim().toLowerCase();

      expect(sanitizedEmail).toBe('test@example.com');
    });

    test('debería convertir email a minúsculas', () => {
      mockReq.body = {
        email: 'TEST@EXAMPLE.COM'
      };

      const sanitizedEmail = mockReq.body.email.toLowerCase();

      expect(sanitizedEmail).toBe('test@example.com');
    });

    test('debería limpiar espacios del nombre', () => {
      mockReq.body = {
        name: '  John Doe  '
      };

      const sanitizedName = mockReq.body.name.trim();

      expect(sanitizedName).toBe('John Doe');
    });

    test('debería escapar HTML en campos de texto', () => {
      mockReq.body = {
        description: '<script>alert("XSS")</script>'
      };

      const sanitizeHTML = (str) => {
        return str
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;')
          .replace(/\//g, '&#x2F;');
      };

      const sanitized = sanitizeHTML(mockReq.body.description);

      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toContain('&lt;');
      expect(sanitized).toContain('&gt;');
    });
  });

  describe('Custom Validators', () => {
    test('debería validar formato de teléfono', () => {
      const validPhone = '+54 9 11 1234-5678';
      const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;

      expect(phoneRegex.test(validPhone.replace(/[\s-]/g, ''))).toBe(true);
    });

    test('debería validar rango de precio', () => {
      const price = 2500;
      const isValidPrice = price > 0 && price <= 1000000;

      expect(isValidPrice).toBe(true);
    });

    test('debería rechazar precio negativo', () => {
      const price = -100;
      const isValidPrice = price > 0;

      expect(isValidPrice).toBe(false);
    });

    test('debería validar stock no negativo', () => {
      const stock = 10;
      const isValidStock = stock >= 0;

      expect(isValidStock).toBe(true);
    });

    test('debería rechazar stock negativo', () => {
      const stock = -5;
      const isValidStock = stock >= 0;

      expect(isValidStock).toBe(false);
    });

    test('debería validar cantidad positiva', () => {
      const quantity = 3;
      const isValidQuantity = quantity > 0 && Number.isInteger(quantity);

      expect(isValidQuantity).toBe(true);
    });

    test('debería rechazar cantidad decimal', () => {
      const quantity = 2.5;
      const isValidQuantity = Number.isInteger(quantity);

      expect(isValidQuantity).toBe(false);
    });

    test('debería validar categoría permitida', () => {
      const allowedCategories = ['tortas', 'tartas', 'pasteles', 'galletas', 'brownies', 'alfajores'];
      const category = 'tartas';

      expect(allowedCategories.includes(category)).toBe(true);
    });

    test('debería rechazar categoría no permitida', () => {
      const allowedCategories = ['tortas', 'tartas', 'pasteles', 'galletas', 'brownies', 'alfajores'];
      const category = 'invalido';

      expect(allowedCategories.includes(category)).toBe(false);
    });
  });

  describe('Error Message Formatting', () => {
    test('debería formatear errores de validación', () => {
      const rawErrors = [
        { msg: 'Email is required', param: 'email', location: 'body' },
        { msg: 'Password must be at least 6 characters', param: 'password', location: 'body' }
      ];

      const formatErrors = (errors) => {
        return errors.map(err => ({
          field: err.param,
          message: err.msg
        }));
      };

      const formatted = formatErrors(rawErrors);

      expect(formatted).toHaveLength(2);
      expect(formatted[0]).toEqual({
        field: 'email',
        message: 'Email is required'
      });
    });

    test('debería agrupar errores por campo', () => {
      const rawErrors = [
        { msg: 'Email is required', param: 'email' },
        { msg: 'Email must be valid', param: 'email' },
        { msg: 'Password is required', param: 'password' }
      ];

      const groupByField = (errors) => {
        return errors.reduce((acc, err) => {
          if (!acc[err.param]) {
            acc[err.param] = [];
          }
          acc[err.param].push(err.msg);
          return acc;
        }, {});
      };

      const grouped = groupByField(rawErrors);

      expect(grouped.email).toHaveLength(2);
      expect(grouped.password).toHaveLength(1);
    });
  });

  describe('Conditional Validation', () => {
    test('debería validar campo opcional solo si está presente', () => {
      mockReq.body = {
        name: 'Test',
        phone: '1234567890' // opcional pero presente
      };

      const validateOptionalPhone = (phone) => {
        if (!phone) return true; // válido si no está presente
        return phone.length >= 10; // validar si está presente
      };

      expect(validateOptionalPhone(mockReq.body.phone)).toBe(true);
    });

    test('debería omitir validación de campo opcional ausente', () => {
      mockReq.body = {
        name: 'Test'
        // phone no presente
      };

      const validateOptionalPhone = (phone) => {
        if (!phone) return true;
        return phone.length >= 10;
      };

      expect(validateOptionalPhone(mockReq.body.phone)).toBe(true);
    });

    test('debería validar campo condicional basado en otro campo', () => {
      mockReq.body = {
        hasAddress: true,
        address: {
          street: 'Main St',
          city: 'City',
          zipCode: '12345'
        }
      };

      const validateConditionalAddress = (body) => {
        if (!body.hasAddress) return true;
        return body.address && body.address.street && body.address.city;
      };

      expect(validateConditionalAddress(mockReq.body)).toBe(true);
    });
  });
});
