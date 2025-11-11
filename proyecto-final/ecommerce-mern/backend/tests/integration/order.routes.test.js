import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Order from '../../models/order.model.js';
import User from '../../models/user.model.js';
import Product from '../../models/product.model.js';
import orderRoutes from '../../routes/order.routes.js';

// Crear app de prueba
const app = express();
app.use(express.json());
app.use('/api/orders', orderRoutes);

describe('Order Routes - Integration Tests', () => {
  let userToken;
  let adminToken;
  let testUser;
  let testAdmin;
  let testProduct;
  let testOrder;

  beforeEach(async () => {
    // Crear usuario de prueba
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'user'
    });

    // Crear admin de prueba
    testAdmin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });

    // Crear producto de prueba
    testProduct = await Product.create({
      name: 'Tarta de Frutilla',
      description: 'Deliciosa tarta',
      price: 2500,
      category: 'tortas',
      stock: 10,
      images: ['image.jpg']
    });

    // Generar tokens
    userToken = jwt.sign(
      { id: testUser._id, role: testUser.role },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );

    adminToken = jwt.sign(
      { id: testAdmin._id, role: testAdmin.role },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
  });

  describe('POST /api/orders - Create Order', () => {
    test('debería crear orden exitosamente', async () => {
      const orderData = {
        items: [
          {
            product: testProduct._id,
            name: testProduct.name,
            price: testProduct.price,
            quantity: 2,
            image: testProduct.images[0]
          }
        ],
        contactInfo: {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan@example.com',
          phone: '1234567890',
          dni: '12345678'
        },
        shippingAddress: {
          street: 'Av. Corrientes',
          number: '1234',
          city: 'Buenos Aires',
          province: 'Buenos Aires',
          postalCode: '1000',
          country: 'Argentina'
        },
        paymentMethod: 'transferencia'
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('exitosamente');
      expect(response.body.data.order).toBeDefined();
      expect(response.body.data.order.orderNumber).toBeDefined();
      expect(response.body.data.paymentInstructions).toBeDefined();

      // Verificar que se creó en la BD
      const createdOrder = await Order.findOne({
        orderNumber: response.body.data.order.orderNumber
      });
      expect(createdOrder).toBeDefined();
      expect(createdOrder.user.toString()).toBe(testUser._id.toString());
    });

    test('debería calcular total correctamente con envío', async () => {
      const orderData = {
        items: [
          {
            product: testProduct._id,
            name: testProduct.name,
            price: 2500,
            quantity: 1 // Total: 2500 (< 50000, debe cobrar envío)
          }
        ],
        contactInfo: {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan@example.com',
          phone: '1234567890',
          dni: '12345678'
        },
        shippingAddress: {
          street: 'Calle',
          number: '123',
          city: 'CABA',
          province: 'Buenos Aires',
          postalCode: '1000',
          country: 'Argentina'
        },
        paymentMethod: 'mercadopago'
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData)
        .expect(201);

      const order = await Order.findOne({
        orderNumber: response.body.data.order.orderNumber
      });

      expect(order.subtotal).toBe(2500);
      expect(order.shippingCost).toBe(5000); // Debe cobrar envío
      expect(order.total).toBe(7500);
    });

    test('debería tener envío gratis si total >= 50000', async () => {
      // Crear producto caro
      const expensiveProduct = await Product.create({
        name: 'Torta Premium',
        description: 'Torta cara',
        price: 60000,
        category: 'tortas',
        stock: 5,
        images: ['premium.jpg']
      });

      const orderData = {
        items: [
          {
            product: expensiveProduct._id,
            name: expensiveProduct.name,
            price: expensiveProduct.price,
            quantity: 1
          }
        ],
        contactInfo: {
          firstName: 'María',
          lastName: 'González',
          email: 'maria@example.com',
          phone: '0987654321',
          dni: '87654321'
        },
        shippingAddress: {
          street: 'Av. Santa Fe',
          number: '4567',
          city: 'Buenos Aires',
          province: 'Buenos Aires',
          postalCode: '1425',
          country: 'Argentina'
        },
        paymentMethod: 'efectivo'
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData)
        .expect(201);

      const order = await Order.findOne({
        orderNumber: response.body.data.order.orderNumber
      });

      expect(order.subtotal).toBe(60000);
      expect(order.shippingCost).toBe(0); // Envío gratis
      expect(order.total).toBe(60000);
    });

    test('debería fallar sin autenticación', async () => {
      const orderData = {
        items: [
          {
            product: testProduct._id,
            name: testProduct.name,
            price: testProduct.price,
            quantity: 1
          }
        ]
      };

      await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(401);
    });

    test('debería fallar con items vacíos', async () => {
      const orderData = {
        items: [],
        contactInfo: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@test.com',
          phone: '123',
          dni: '123'
        },
        shippingAddress: {
          street: 'Street',
          number: '1',
          city: 'City',
          province: 'Province',
          postalCode: '1000',
          country: 'Country'
        },
        paymentMethod: 'transferencia'
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('productos');
    });

    test('debería limpiar carrito del usuario', async () => {
      // Agregar items al carrito
      testUser.cart = [
        {
          product: testProduct._id,
          quantity: 2
        }
      ];
      await testUser.save();

      const orderData = {
        items: [
          {
            product: testProduct._id,
            name: testProduct.name,
            price: testProduct.price,
            quantity: 2
          }
        ],
        contactInfo: {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan@example.com',
          phone: '123',
          dni: '123'
        },
        shippingAddress: {
          street: 'Street',
          number: '1',
          city: 'City',
          province: 'Province',
          postalCode: '1000',
          country: 'Argentina'
        },
        paymentMethod: 'transferencia'
      };

      await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData)
        .expect(201);

      // Verificar que el carrito se vació
      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser.cart).toHaveLength(0);
    });
  });

  describe('GET /api/orders - Get User Orders', () => {
    beforeEach(async () => {
      // Crear orden de prueba
      testOrder = await Order.create({
        user: testUser._id,
        orderNumber: 'ORD-TEST-001',
        items: [
          {
            product: testProduct._id,
            name: testProduct.name,
            price: testProduct.price,
            quantity: 1,
            subtotal: testProduct.price
          }
        ],
        contactInfo: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@test.com',
          phone: '123',
          dni: '123'
        },
        shippingAddress: {
          street: 'Street',
          number: '1',
          city: 'City',
          province: 'Province',
          postalCode: '1000',
          country: 'Argentina'
        },
        paymentMethod: 'transferencia',
        subtotal: testProduct.price,
        shippingCost: 5000,
        total: testProduct.price + 5000,
        status: 'pendiente',
        paymentStatus: 'pendiente'
      });
    });

    test('debería obtener órdenes del usuario autenticado', async () => {
      const response = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.orders).toBeDefined();
      expect(Array.isArray(response.body.orders)).toBe(true);
      expect(response.body.orders.length).toBeGreaterThan(0);
    });

    test('no debería mostrar órdenes de otros usuarios', async () => {
      // Crear orden de otro usuario
      const otherUser = await User.create({
        name: 'Other User',
        email: 'other@example.com',
        password: 'password123'
      });

      await Order.create({
        user: otherUser._id,
        orderNumber: 'ORD-OTHER-001',
        items: [
          {
            product: testProduct._id,
            name: testProduct.name,
            price: testProduct.price,
            quantity: 1,
            subtotal: testProduct.price
          }
        ],
        contactInfo: {
          firstName: 'Other',
          lastName: 'User',
          email: 'other@test.com',
          phone: '456',
          dni: '456'
        },
        shippingAddress: {
          street: 'Other Street',
          number: '2',
          city: 'Other City',
          province: 'Other Province',
          postalCode: '2000',
          country: 'Argentina'
        },
        paymentMethod: 'mercadopago',
        subtotal: testProduct.price,
        shippingCost: 0,
        total: testProduct.price
      });

      const response = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      // Solo debe haber 1 orden (la del testUser)
      const userOrders = response.body.orders.filter(
        order => order.user.toString() === testUser._id.toString()
      );
      expect(userOrders.length).toBeGreaterThan(0);
    });

    test('debería fallar sin autenticación', async () => {
      await request(app)
        .get('/api/orders')
        .expect(401);
    });
  });

  describe('GET /api/orders/:id - Get Order By ID', () => {
    beforeEach(async () => {
      testOrder = await Order.create({
        user: testUser._id,
        orderNumber: 'ORD-DETAIL-001',
        items: [
          {
            product: testProduct._id,
            name: testProduct.name,
            price: testProduct.price,
            quantity: 2,
            subtotal: testProduct.price * 2
          }
        ],
        contactInfo: {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan@test.com',
          phone: '123',
          dni: '123'
        },
        shippingAddress: {
          street: 'Street',
          number: '1',
          city: 'City',
          province: 'Province',
          postalCode: '1000',
          country: 'Argentina'
        },
        paymentMethod: 'transferencia',
        subtotal: testProduct.price * 2,
        shippingCost: 5000,
        total: (testProduct.price * 2) + 5000
      });
    });

    test('debería obtener detalle de orden', async () => {
      const response = await request(app)
        .get(`/api/orders/${testOrder._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.order).toBeDefined();
      expect(response.body.order.orderNumber).toBe('ORD-DETAIL-001');
      expect(response.body.order.items).toHaveLength(1);
    });

    test('debería fallar si orden no existe', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/orders/${fakeId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('no encontrada');
    });

    test('debería fallar si usuario intenta ver orden de otro', async () => {
      // Crear otro usuario
      const otherUser = await User.create({
        name: 'Other User',
        email: 'other2@example.com',
        password: 'password123'
      });

      const otherToken = jwt.sign(
        { id: otherUser._id, role: 'user' },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );

      // Intentar acceder a orden de testUser con token de otherUser
      const response = await request(app)
        .get(`/api/orders/${testOrder._id}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    test('debería fallar sin autenticación', async () => {
      await request(app)
        .get(`/api/orders/${testOrder._id}`)
        .expect(401);
    });
  });

  describe('PUT /api/orders/:id/cancel - Cancel Order', () => {
    beforeEach(async () => {
      testOrder = await Order.create({
        user: testUser._id,
        orderNumber: 'ORD-CANCEL-001',
        items: [
          {
            product: testProduct._id,
            name: testProduct.name,
            price: testProduct.price,
            quantity: 1,
            subtotal: testProduct.price
          }
        ],
        contactInfo: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@test.com',
          phone: '123',
          dni: '123'
        },
        shippingAddress: {
          street: 'Street',
          number: '1',
          city: 'City',
          province: 'Province',
          postalCode: '1000',
          country: 'Argentina'
        },
        paymentMethod: 'transferencia',
        subtotal: testProduct.price,
        shippingCost: 0,
        total: testProduct.price,
        status: 'pendiente'
      });
    });

    test('debería cancelar orden pendiente', async () => {
      const response = await request(app)
        .put(`/api/orders/${testOrder._id}/cancel`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('cancelada');

      // Verificar en BD
      const canceledOrder = await Order.findById(testOrder._id);
      expect(canceledOrder.status).toBe('cancelado');
    });

    test('debería fallar si orden ya fue procesada', async () => {
      // Cambiar status a confirmado
      testOrder.status = 'confirmado';
      await testOrder.save();

      const response = await request(app)
        .put(`/api/orders/${testOrder._id}/cancel`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('pendientes');
    });

    test('debería fallar si orden no pertenece al usuario', async () => {
      const otherUser = await User.create({
        name: 'Other User',
        email: 'other3@example.com',
        password: 'password123'
      });

      const otherToken = jwt.sign(
        { id: otherUser._id, role: 'user' },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );

      await request(app)
        .put(`/api/orders/${testOrder._id}/cancel`)
        .set('Authorization', `Bearer ${otherToken}`)
        .expect(404);
    });

    test('debería fallar sin autenticación', async () => {
      await request(app)
        .put(`/api/orders/${testOrder._id}/cancel`)
        .expect(401);
    });
  });

  describe('GET /api/orders/admin/all - Get All Orders (Admin)', () => {
    beforeEach(async () => {
      // Crear múltiples órdenes de diferentes usuarios
      await Order.create({
        user: testUser._id,
        orderNumber: 'ORD-ADMIN-001',
        items: [
          {
            product: testProduct._id,
            name: testProduct.name,
            price: testProduct.price,
            quantity: 1,
            subtotal: testProduct.price
          }
        ],
        contactInfo: {
          firstName: 'User',
          lastName: '1',
          email: 'user1@test.com',
          phone: '123',
          dni: '123'
        },
        shippingAddress: {
          street: 'Street',
          number: '1',
          city: 'City',
          province: 'Province',
          postalCode: '1000',
          country: 'Argentina'
        },
        paymentMethod: 'transferencia',
        subtotal: testProduct.price,
        shippingCost: 0,
        total: testProduct.price
      });

      await Order.create({
        user: testAdmin._id,
        orderNumber: 'ORD-ADMIN-002',
        items: [
          {
            product: testProduct._id,
            name: testProduct.name,
            price: testProduct.price,
            quantity: 2,
            subtotal: testProduct.price * 2
          }
        ],
        contactInfo: {
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@test.com',
          phone: '456',
          dni: '456'
        },
        shippingAddress: {
          street: 'Admin Street',
          number: '2',
          city: 'Admin City',
          province: 'Admin Province',
          postalCode: '2000',
          country: 'Argentina'
        },
        paymentMethod: 'mercadopago',
        subtotal: testProduct.price * 2,
        shippingCost: 5000,
        total: (testProduct.price * 2) + 5000
      });
    });

    test('admin debería ver todas las órdenes', async () => {
      const response = await request(app)
        .get('/api/orders/admin/all')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.orders).toBeDefined();
      expect(Array.isArray(response.body.orders)).toBe(true);
      expect(response.body.orders.length).toBeGreaterThanOrEqual(2);
    });

    test('usuario regular no debería acceder', async () => {
      await request(app)
        .get('/api/orders/admin/all')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    test('debería fallar sin autenticación', async () => {
      await request(app)
        .get('/api/orders/admin/all')
        .expect(401);
    });
  });

  describe('PUT /api/orders/admin/:id/status - Update Order Status (Admin)', () => {
    beforeEach(async () => {
      testOrder = await Order.create({
        user: testUser._id,
        orderNumber: 'ORD-STATUS-001',
        items: [
          {
            product: testProduct._id,
            name: testProduct.name,
            price: testProduct.price,
            quantity: 1,
            subtotal: testProduct.price
          }
        ],
        contactInfo: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@test.com',
          phone: '123',
          dni: '123'
        },
        shippingAddress: {
          street: 'Street',
          number: '1',
          city: 'City',
          province: 'Province',
          postalCode: '1000',
          country: 'Argentina'
        },
        paymentMethod: 'transferencia',
        subtotal: testProduct.price,
        shippingCost: 0,
        total: testProduct.price,
        status: 'pendiente'
      });
    });

    test('admin debería actualizar status de orden', async () => {
      const response = await request(app)
        .put(`/api/orders/admin/${testOrder._id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'confirmado' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.order).toBeDefined();

      // Verificar en BD
      const updatedOrder = await Order.findById(testOrder._id);
      expect(updatedOrder.status).toBe('confirmado');
    });

    test('debería actualizar a diferentes estados', async () => {
      const statuses = ['confirmado', 'en_preparacion', 'enviado', 'entregado'];

      for (const status of statuses) {
        const response = await request(app)
          .put(`/api/orders/admin/${testOrder._id}/status`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ status })
          .expect(200);

        expect(response.body.success).toBe(true);

        const updatedOrder = await Order.findById(testOrder._id);
        expect(updatedOrder.status).toBe(status);
      }
    });

    test('usuario regular no debería poder actualizar', async () => {
      await request(app)
        .put(`/api/orders/admin/${testOrder._id}/status`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ status: 'confirmado' })
        .expect(403);
    });

    test('debería fallar sin autenticación', async () => {
      await request(app)
        .put(`/api/orders/admin/${testOrder._id}/status`)
        .send({ status: 'confirmado' })
        .expect(401);
    });

    test('debería fallar con status inválido', async () => {
      const response = await request(app)
        .put(`/api/orders/admin/${testOrder._id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'estado_invalido' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
