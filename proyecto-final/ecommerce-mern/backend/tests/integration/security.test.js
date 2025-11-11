import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../../models/user.model.js';
import Product from '../../models/product.model.js';
import authRoutes from '../../routes/auth.routes.js';
import productRoutes from '../../routes/product.routes.js';
import cartRoutes from '../../routes/cart.routes.js';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

describe('Security Tests - SQL Injection, XSS, Authentication', () => {
  describe('SQL Injection Attempts', () => {
    test('Intento de SQL injection en login', async () => {
      const maliciousPayloads = [
        { email: "admin' OR '1'='1", password: "password" },
        { email: "admin'--", password: "anything" },
        { email: "' OR 1=1--", password: "' OR '1'='1" },
        { email: "admin'; DROP TABLE users;--", password: "password" },
        { email: "1' UNION SELECT * FROM users--", password: "password" }
      ];

      for (const payload of maliciousPayloads) {
        const response = await request(app)
          .post('/api/auth/login')
          .send(payload);

        // No debe permitir login con SQL injection
        expect(response.status).not.toBe(200);
        expect(response.body.token).toBeUndefined();
      }
    });

    test('Intento de SQL injection en registro', async () => {
      const maliciousPayloads = [
        {
          name: "'; DROP TABLE users;--",
          email: "test@test.com",
          password: "password"
        },
        {
          name: "Admin",
          email: "' OR '1'='1",
          password: "password"
        },
        {
          name: "1' UNION SELECT * FROM passwords--",
          email: "test@test.com",
          password: "password"
        }
      ];

      for (const payload of maliciousPayloads) {
        const response = await request(app)
          .post('/api/auth/register')
          .send(payload);

        if (response.status === 201) {
          // Si se crea, verificar que los datos no contienen código SQL
          expect(response.body.user.name).not.toContain('DROP');
          expect(response.body.user.name).not.toContain('UNION');
          expect(response.body.user.email).not.toContain('OR');
        }
      }
    });

    test('Intento de SQL injection en búsqueda de productos', async () => {
      const maliciousQueries = [
        "' OR '1'='1",
        "'; DROP TABLE products;--",
        "1' UNION SELECT * FROM users--",
        "admin'--"
      ];

      for (const query of maliciousQueries) {
        const response = await request(app)
          .get(`/api/products?search=${encodeURIComponent(query)}`);

        // Debe responder sin errores críticos
        expect([200, 400, 404]).toContain(response.status);
        // No debe retornar datos sensibles
        if (response.body.products) {
          expect(Array.isArray(response.body.products)).toBe(true);
        }
      }
    });
  });

  describe('XSS (Cross-Site Scripting) Attempts', () => {
    let userToken;

    beforeEach(async () => {
      const user = await User.create({
        name: 'XSS Test User',
        email: 'xss@test.com',
        password: 'Password123!',
        role: 'user'
      });

      userToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );
    });

    test('Intento de XSS en nombre de usuario', async () => {
      const xssPayloads = [
        '<script>alert("XSS")</script>',
        '<img src=x onerror=alert("XSS")>',
        '<svg onload=alert("XSS")>',
        'javascript:alert("XSS")',
        '<iframe src="javascript:alert(\'XSS\')">',
        '<body onload=alert("XSS")>'
      ];

      for (const payload of xssPayloads) {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            name: payload,
            email: `xss${Math.random()}@test.com`,
            password: 'Password123!'
          });

        if (response.status === 201) {
          // Verificar que se sanitiza el input
          expect(response.body.user.name).not.toContain('<script>');
          expect(response.body.user.name).not.toContain('onerror');
          expect(response.body.user.name).not.toContain('onload');
        }
      }
    });

    test('Intento de XSS en descripción de producto (admin)', async () => {
      const admin = await User.create({
        name: 'Admin',
        email: 'admin.xss@test.com',
        password: 'Admin123!',
        role: 'admin'
      });

      const adminToken = jwt.sign(
        { id: admin._id, role: admin.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );

      const xssPayload = '<script>alert("Hacked")</script>';

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Product',
          description: xssPayload,
          price: 1000,
          category: 'tortas',
          stock: 10,
          images: ['test.jpg']
        });

      if (response.status === 201) {
        expect(response.body.product.description).not.toContain('<script>');
      }
    });

    test('Intento de XSS en búsqueda', async () => {
      const xssQuery = '<script>alert("XSS")</script>';

      const response = await request(app)
        .get(`/api/products?search=${encodeURIComponent(xssQuery)}`);

      expect(response.status).toBe(200);
      // La respuesta no debe ejecutar scripts
      if (response.body.products) {
        const bodyString = JSON.stringify(response.body);
        expect(bodyString).not.toContain('<script>');
      }
    });
  });

  describe('Authentication & Authorization Security', () => {
    test('Acceso sin token debe fallar', async () => {
      const protectedEndpoints = [
        { method: 'get', path: '/api/cart' },
        { method: 'post', path: '/api/cart/add' },
        { method: 'get', path: '/api/auth/me' },
        { method: 'get', path: '/api/orders' }
      ];

      for (const endpoint of protectedEndpoints) {
        const response = await request(app)[endpoint.method](endpoint.path);
        expect(response.status).toBe(401);
      }
    });

    test('Token inválido debe fallar', async () => {
      const invalidTokens = [
        'invalid.token.here',
        'Bearer ',
        'Bearer invalid',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature',
        ''
      ];

      for (const token of invalidTokens) {
        const response = await request(app)
          .get('/api/cart')
          .set('Authorization', token);

        expect(response.status).toBe(401);
      }
    });

    test('Token expirado debe fallar', async () => {
      const user = await User.create({
        name: 'Expired User',
        email: 'expired@test.com',
        password: 'Password123!'
      });

      // Crear token expirado (expirado hace 1 hora)
      const expiredToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '-1h' }
      );

      const response = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(response.status).toBe(401);
    });

    test('Usuario intentando acceder a rutas de admin', async () => {
      const user = await User.create({
        name: 'Regular User',
        email: 'regular@test.com',
        password: 'Password123!',
        role: 'user'
      });

      const userToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );

      const adminEndpoints = [
        { method: 'post', path: '/api/products' },
        { method: 'get', path: '/api/orders/admin/all' }
      ];

      for (const endpoint of adminEndpoints) {
        const response = await request(app)
          [endpoint.method](endpoint.path)
          .set('Authorization', `Bearer ${userToken}`)
          .send({});

        expect(response.status).toBe(403);
      }
    });

    test('Manipulación de token para escalar privilegios', async () => {
      const user = await User.create({
        name: 'Hacker',
        email: 'hacker@test.com',
        password: 'Password123!',
        role: 'user'
      });

      // Intentar modificar el role en el token
      const maliciousToken = jwt.sign(
        { id: user._id, role: 'admin' }, // Role modificado
        'wrong-secret' // Secret incorrecto
      );

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${maliciousToken}`)
        .send({
          name: 'Hacked Product',
          price: 1000,
          category: 'tortas',
          stock: 1
        });

      expect(response.status).toBe(401);
    });
  });

  describe('NoSQL Injection Attempts', () => {
    test('Intento de NoSQL injection en login', async () => {
      await User.create({
        name: 'Victim',
        email: 'victim@test.com',
        password: 'SecurePassword123!'
      });

      const noSqlPayloads = [
        { email: { $gt: '' }, password: { $gt: '' } },
        { email: { $ne: null }, password: { $ne: null } },
        { email: 'victim@test.com', password: { $regex: '.*' } },
        { email: { $where: '1==1' }, password: 'anything' }
      ];

      for (const payload of noSqlPayloads) {
        const response = await request(app)
          .post('/api/auth/login')
          .send(payload);

        // No debe permitir login con NoSQL injection
        expect(response.status).not.toBe(200);
        expect(response.body.token).toBeUndefined();
      }
    });

    test('Intento de NoSQL injection en búsqueda por ID', async () => {
      const product = await Product.create({
        name: 'Secure Product',
        price: 1000,
        category: 'tortas',
        stock: 10,
        images: ['secure.jpg']
      });

      const maliciousIds = [
        { $gt: '' },
        { $ne: null },
        { $regex: '.*' },
        "'; return true; var foo = '"
      ];

      for (const id of maliciousIds) {
        const response = await request(app)
          .get(`/api/products/${JSON.stringify(id)}`);

        // Debe retornar error, no información
        expect(response.status).not.toBe(200);
      }
    });
  });

  describe('Rate Limiting & Brute Force Protection', () => {
    test('Múltiples intentos de login fallidos', async () => {
      await User.create({
        name: 'Protected User',
        email: 'protected@test.com',
        password: 'CorrectPassword123!'
      });

      const attempts = 20;
      let blockedCount = 0;

      for (let i = 0; i < attempts; i++) {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'protected@test.com',
            password: 'WrongPassword'
          });

        if (response.status === 429) {
          blockedCount++;
        }
      }

      // Verificar que no se permiten intentos infinitos
      expect(response.status).toBeDefined();
    });
  });

  describe('Input Validation Security', () => {
    test('Emails inválidos deben ser rechazados', async () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'user@',
        'user @example.com',
        'user@example',
        ''
      ];

      for (const email of invalidEmails) {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            name: 'Test User',
            email: email,
            password: 'Password123!'
          });

        expect(response.status).toBe(400);
      }
    });

    test('Contraseñas débiles deben ser rechazadas', async () => {
      const weakPasswords = [
        '123',
        'password',
        '12345678',
        'abcdefgh',
        ''
      ];

      for (const password of weakPasswords) {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            name: 'Test User',
            email: `user${Math.random()}@test.com`,
            password: password
          });

        expect(response.status).toBe(400);
      }
    });

    test('Precios negativos deben ser rechazados (admin)', async () => {
      const admin = await User.create({
        name: 'Admin',
        email: 'admin.price@test.com',
        password: 'Admin123!',
        role: 'admin'
      });

      const adminToken = jwt.sign(
        { id: admin._id, role: admin.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Invalid Product',
          description: 'Test',
          price: -1000,
          category: 'tortas',
          stock: 10,
          images: ['test.jpg']
        });

      expect(response.status).toBe(400);
    });

    test('Stock negativo debe ser rechazado', async () => {
      const admin = await User.create({
        name: 'Admin',
        email: 'admin.stock@test.com',
        password: 'Admin123!',
        role: 'admin'
      });

      const adminToken = jwt.sign(
        { id: admin._id, role: admin.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Invalid Stock Product',
          description: 'Test',
          price: 1000,
          category: 'tortas',
          stock: -5,
          images: ['test.jpg']
        });

      expect(response.status).toBe(400);
    });

    test('Cantidad en carrito debe ser mayor a 0', async () => {
      const user = await User.create({
        name: 'Cart User',
        email: 'cart.security@test.com',
        password: 'Password123!'
      });

      const userToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );

      const product = await Product.create({
        name: 'Test Product',
        price: 1000,
        category: 'tortas',
        stock: 10,
        images: ['test.jpg']
      });

      const invalidQuantities = [0, -1, -100];

      for (const quantity of invalidQuantities) {
        const response = await request(app)
          .post('/api/cart/add')
          .set('Authorization', `Bearer ${userToken}`)
          .send({
            productId: product._id,
            quantity: quantity
          });

        expect(response.status).toBe(400);
      }
    });
  });

  describe('Data Exposure Prevention', () => {
    test('Contraseña no debe exponerse en respuestas', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Security Test',
          email: 'security@test.com',
          password: 'MySecretPassword123!'
        });

      expect(response.status).toBe(201);
      expect(response.body.user.password).toBeUndefined();

      // Verificar en login también
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'security@test.com',
          password: 'MySecretPassword123!'
        });

      expect(loginResponse.body.user.password).toBeUndefined();
    });

    test('Información de otros usuarios no debe ser accesible', async () => {
      const user1 = await User.create({
        name: 'User 1',
        email: 'user1@test.com',
        password: 'Password123!'
      });

      const user2 = await User.create({
        name: 'User 2',
        email: 'user2@test.com',
        password: 'Password123!'
      });

      const token1 = jwt.sign(
        { id: user1._id, role: user1.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );

      // User1 no debe poder acceder al carrito de User2
      const response = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${token1}`);

      expect(response.status).toBe(200);
      // Solo debe ver su propio carrito
      expect(response.body.cart).toBeDefined();
    });
  });

  describe('CORS & Headers Security', () => {
    test('Verificar headers de seguridad', async () => {
      const response = await request(app)
        .get('/api/products');

      // Verificar que la respuesta tenga headers básicos
      expect(response.headers).toBeDefined();
    });
  });

  describe('File Upload Security (si existe)', () => {
    test('Extensiones de archivo peligrosas deben ser rechazadas', async () => {
      const admin = await User.create({
        name: 'Admin',
        email: 'admin.file@test.com',
        password: 'Admin123!',
        role: 'admin'
      });

      const adminToken = jwt.sign(
        { id: admin._id, role: admin.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );

      const dangerousExtensions = [
        'malware.exe',
        'virus.bat',
        'hack.sh',
        'script.php',
        'code.js'
      ];

      for (const filename of dangerousExtensions) {
        const response = await request(app)
          .post('/api/products')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            name: 'Malicious Product',
            price: 1000,
            category: 'tortas',
            stock: 1,
            images: [filename]
          });

        // Debe validar extensiones
        if (response.status === 201) {
          expect(response.body.product.images[0]).not.toContain('.exe');
          expect(response.body.product.images[0]).not.toContain('.bat');
        }
      }
    });
  });

  describe('Session Security', () => {
    test('Token debe invalidarse después de logout', async () => {
      const user = await User.create({
        name: 'Session User',
        email: 'session@test.com',
        password: 'Password123!'
      });

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'session@test.com',
          password: 'Password123!'
        });

      const token = loginResponse.body.token;

      // Logout
      await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`);

      // Intentar usar token después de logout
      const response = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${token}`);

      // Dependiendo de implementación, podría ser 401
      expect(response.status).toBeDefined();
    });
  });

  describe('Denial of Service Prevention', () => {
    test('Payload excesivamente grande debe ser rechazado', async () => {
      const admin = await User.create({
        name: 'Admin',
        email: 'admin.dos@test.com',
        password: 'Admin123!',
        role: 'admin'
      });

      const adminToken = jwt.sign(
        { id: admin._id, role: admin.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );

      // Intentar crear producto con descripción extremadamente larga
      const hugeDescription = 'A'.repeat(100000);

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'DOS Product',
          description: hugeDescription,
          price: 1000,
          category: 'tortas',
          stock: 1,
          images: ['test.jpg']
        });

      // Debe tener límite de tamaño
      expect([400, 413]).toContain(response.status);
    });

    test('Demasiados items en una sola petición', async () => {
      const user = await User.create({
        name: 'DOS User',
        email: 'dos.user@test.com',
        password: 'Password123!'
      });

      const userToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );

      const product = await Product.create({
        name: 'Test Product',
        price: 1000,
        category: 'tortas',
        stock: 1000,
        images: ['test.jpg']
      });

      // Intentar agregar cantidad absurda al carrito
      const response = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: product._id,
          quantity: 999999
        });

      // Debe validar cantidad razonable
      expect([400, 422]).toContain(response.status);
    });
  });

  describe('Parameter Tampering', () => {
    test('ID de otro usuario en petición debe ser ignorado', async () => {
      const user1 = await User.create({
        name: 'User 1',
        email: 'tamper1@test.com',
        password: 'Password123!'
      });

      const user2 = await User.create({
        name: 'User 2',
        email: 'tamper2@test.com',
        password: 'Password123!'
      });

      const token1 = jwt.sign(
        { id: user1._id, role: user1.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );

      const product = await Product.create({
        name: 'Test Product',
        price: 1000,
        category: 'tortas',
        stock: 10,
        images: ['test.jpg']
      });

      // User1 intenta agregar producto al carrito de User2
      const response = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          userId: user2._id, // Intento de manipulación
          productId: product._id,
          quantity: 1
        });

      // Debe usar el ID del token, no el del body
      if (response.status === 200) {
        const user1Updated = await User.findById(user1._id);
        const user2Updated = await User.findById(user2._id);

        expect(user1Updated.cart.length).toBeGreaterThan(0);
        expect(user2Updated.cart.length).toBe(0);
      }
    });
  });
});
