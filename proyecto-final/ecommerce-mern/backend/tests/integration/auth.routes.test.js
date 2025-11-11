import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import authRoutes from '../../routes/auth.routes.js';
import User from '../../models/user.model.js';

// Crear app de Express para testing
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/auth', authRoutes);
  return app;
};

describe('Auth Routes - Integration Tests', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
  });

  describe('POST /api/auth/register', () => {
    test('debería registrar un nuevo usuario correctamente', async () => {
      const newUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('registrado');
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(newUser.email);
      expect(response.body.user.password).toBeUndefined(); // No debe devolver password
      expect(response.body.token).toBeDefined();
    });

    test('debería fallar con email duplicado', async () => {
      const userData = {
        name: 'Duplicate User',
        email: 'duplicate@example.com',
        password: 'password123'
      };

      // Crear primer usuario
      await User.create(userData);

      // Intentar crear duplicado
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('existe');
    });

    test('debería validar campos requeridos', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    test('debería validar formato de email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'invalid-email',
          password: 'password123'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    test('debería validar longitud mínima de contraseña', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: '123'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Crear usuario de prueba
      await User.create({
        name: 'Login Test',
        email: 'login@example.com',
        password: 'password123'
      });
    });

    test('debería hacer login correctamente', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe('login@example.com');
      expect(response.body.user.password).toBeUndefined();
    });

    test('debería fallar con email incorrecto', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'password123'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('credenciales');
    });

    test('debería fallar con contraseña incorrecta', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    test('debería validar campos requeridos en login', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/profile', () => {
    let token;
    let userId;

    beforeEach(async () => {
      // Crear usuario y obtener token
      const user = await User.create({
        name: 'Profile Test',
        email: 'profile@example.com',
        password: 'password123'
      });

      userId = user._id;

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'profile@example.com',
          password: 'password123'
        });

      token = loginResponse.body.token;
    });

    test('debería obtener perfil con token válido', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe('profile@example.com');
      expect(response.body.user.password).toBeUndefined();
    });

    test('debería fallar sin token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    test('debería fallar con token inválido', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/auth/profile', () => {
    let token;

    beforeEach(async () => {
      await User.create({
        name: 'Update Test',
        email: 'update@example.com',
        password: 'password123'
      });

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'update@example.com',
          password: 'password123'
        });

      token = loginResponse.body.token;
    });

    test('debería actualizar perfil correctamente', async () => {
      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated Name',
          phone: '+54 362 123456'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user.name).toBe('Updated Name');
      expect(response.body.user.phone).toBe('+54 362 123456');
    });

    test('no debería permitir cambiar email a uno existente', async () => {
      // Crear otro usuario
      await User.create({
        name: 'Other User',
        email: 'other@example.com',
        password: 'password123'
      });

      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          email: 'other@example.com'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    beforeEach(async () => {
      await User.create({
        name: 'Forgot Password Test',
        email: 'forgot@example.com',
        password: 'password123'
      });
    });

    test('debería generar token de recuperación', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: 'forgot@example.com'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('correo');

      // Verificar que se generó el token en la DB
      const user = await User.findOne({ email: 'forgot@example.com' });
      expect(user.resetPasswordToken).toBeDefined();
      expect(user.resetPasswordExpires).toBeDefined();
    });

    test('debería fallar con email no registrado', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: 'nonexistent@example.com'
        })
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/reset-password', () => {
    let resetToken;

    beforeEach(async () => {
      const user = await User.create({
        name: 'Reset Password Test',
        email: 'reset@example.com',
        password: 'oldpassword'
      });

      // Simular generación de token
      const crypto = await import('crypto');
      resetToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
      await user.save();
    });

    test('debería resetear contraseña con token válido', async () => {
      const response = await request(app)
        .post(`/api/auth/reset-password/${resetToken}`)
        .send({
          password: 'newpassword123'
        })
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verificar que puede hacer login con nueva contraseña
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'reset@example.com',
          password: 'newpassword123'
        })
        .expect(200);

      expect(loginResponse.body.success).toBe(true);
    });

    test('debería fallar con token inválido', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password/invalid-token')
        .send({
          password: 'newpassword123'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/logout', () => {
    let token;

    beforeEach(async () => {
      await User.create({
        name: 'Logout Test',
        email: 'logout@example.com',
        password: 'password123'
      });

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'logout@example.com',
          password: 'password123'
        });

      token = loginResponse.body.token;
    });

    test('debería hacer logout correctamente', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('sesión cerrada');
    });
  });
});
