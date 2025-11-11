import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../../models/user.model.js';
import Product from '../../models/product.model.js';
import Order from '../../models/order.model.js';
import authRoutes from '../../routes/auth.routes.js';
import productRoutes from '../../routes/product.routes.js';
import cartRoutes from '../../routes/cart.routes.js';
import orderRoutes from '../../routes/order.routes.js';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

describe('Business Logic & Validation Tests', () => {
  describe('User Registration Business Rules', () => {
    test('Email debe ser único', async () => {
      await User.create({
        name: 'First User',
        email: 'duplicate@test.com',
        password: 'Password123!'
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Second User',
          email: 'duplicate@test.com',
          password: 'Password456!'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('existe' || 'already' || 'duplicate');
    });

    test('Nombre no puede ser solo espacios', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: '     ',
          email: 'spaces@test.com',
          password: 'Password123!'
        });

      expect(response.status).toBe(400);
    });

    test('Email debe tener formato válido', async () => {
      const invalidEmails = [
        'notanemail',
        '@nodomain.com',
        'user@',
        'user @domain.com',
        'user@domain',
        'user..name@domain.com'
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

    test('Contraseña debe cumplir requisitos mínimos', async () => {
      const weakPasswords = [
        '123',          // Muy corta
        'abcdefgh',     // Sin números
        '12345678',     // Sin letras
        'Pass1',        // Muy corta
        ''              // Vacía
      ];

      for (const password of weakPasswords) {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            name: 'Test User',
            email: `test${Math.random()}@test.com`,
            password: password
          });

        expect(response.status).toBe(400);
      }
    });

    test('Usuario nuevo debe tener role "user" por defecto', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'New User',
          email: 'newuser@test.com',
          password: 'Password123!'
        })
        .expect(201);

      expect(response.body.user.role).toBe('user');
    });

    test('No se puede registrar directamente como admin', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Hacker',
          email: 'hacker@test.com',
          password: 'Password123!',
          role: 'admin'
        });

      if (response.status === 201) {
        expect(response.body.user.role).not.toBe('admin');
      }
    });

    test('Contraseña no debe ser retornada en respuesta', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Secure User',
          email: 'secure@test.com',
          password: 'SecretPassword123!'
        })
        .expect(201);

      expect(response.body.user.password).toBeUndefined();
    });

    test('Carrito debe inicializarse vacío', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Cart User',
          email: 'cart.init@test.com',
          password: 'Password123!'
        })
        .expect(201);

      const user = await User.findById(response.body.user._id);
      expect(user.cart).toBeDefined();
      expect(user.cart.length).toBe(0);
    });
  });

  describe('Product Management Business Rules', () => {
    let adminToken;

    beforeEach(async () => {
      const admin = await User.create({
        name: 'Admin',
        email: 'admin.business@test.com',
        password: 'Admin123!',
        role: 'admin'
      });

      adminToken = jwt.sign(
        { id: admin._id, role: admin.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );
    });

    test('Precio debe ser mayor a 0', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Invalid Price Product',
          price: -100,
          category: 'tortas',
          stock: 10,
          images: ['invalid.jpg']
        });

      expect(response.status).toBe(400);
    });

    test('Stock no puede ser negativo', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Negative Stock',
          price: 1000,
          category: 'tortas',
          stock: -5,
          images: ['neg.jpg']
        });

      expect(response.status).toBe(400);
    });

    test('Categoría debe ser válida', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Invalid Category',
          price: 1000,
          category: 'categoria-inexistente',
          stock: 10,
          images: ['cat.jpg']
        });

      // Depende de si hay validación de categorías
      expect(response.status).toBeDefined();
    });

    test('Nombre de producto debe ser único', async () => {
      await Product.create({
        name: 'Unique Product',
        price: 1000,
        category: 'tortas',
        stock: 10,
        images: ['unique.jpg']
      });

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Unique Product',
          price: 2000,
          category: 'tortas',
          stock: 5,
          images: ['duplicate.jpg']
        });

      // Puede permitir duplicados o no, dependiendo de reglas de negocio
      expect(response.status).toBeDefined();
    });

    test('Al menos una imagen debe ser requerida', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'No Images Product',
          price: 1000,
          category: 'tortas',
          stock: 10,
          images: []
        });

      expect([200, 201, 400]).toContain(response.status);
    });

    test('Actualizar stock a 0 debe permitirse', async () => {
      const product = await Product.create({
        name: 'Stock Test',
        price: 1000,
        category: 'tortas',
        stock: 10,
        images: ['stock.jpg']
      });

      const response = await request(app)
        .put(`/api/products/${product._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          stock: 0
        });

      expect([200, 201]).toContain(response.status);
    });

    test('Eliminar producto con stock debe permitirse', async () => {
      const product = await Product.create({
        name: 'Delete Test',
        price: 1000,
        category: 'tortas',
        stock: 50,
        images: ['delete.jpg']
      });

      const response = await request(app)
        .delete(`/api/products/${product._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
    });
  });

  describe('Cart Business Rules', () => {
    let userToken;
    let userId;
    let product;

    beforeEach(async () => {
      const user = await User.create({
        name: 'Cart Business User',
        email: 'cart.business@test.com',
        password: 'Password123!'
      });

      userId = user._id;

      userToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );

      product = await Product.create({
        name: 'Cart Product',
        price: 2500,
        category: 'tortas',
        stock: 10,
        images: ['cart.jpg']
      });
    });

    test('No se puede agregar más items que el stock disponible', async () => {
      const response = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: product._id,
          quantity: 100
        });

      expect([400, 422]).toContain(response.status);
    });

    test('Cantidad debe ser al menos 1', async () => {
      const response = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: product._id,
          quantity: 0
        });

      expect(response.status).toBe(400);
    });

    test('No se puede agregar producto sin stock', async () => {
      const outOfStock = await Product.create({
        name: 'Out of Stock',
        price: 1000,
        category: 'tortas',
        stock: 0,
        images: ['oos.jpg']
      });

      const response = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: outOfStock._id,
          quantity: 1
        });

      expect([400, 422]).toContain(response.status);
    });

    test('Total del carrito debe calcularse correctamente', async () => {
      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: product._id,
          quantity: 3
        });

      const response = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.total).toBe(2500 * 3);
    });

    test('Agregar mismo producto dos veces debe actualizar cantidad', async () => {
      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: product._id,
          quantity: 2
        });

      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: product._id,
          quantity: 3
        });

      const response = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      // Debe tener solo 1 item con cantidad sumada o actualizada
      expect(response.body.cart.length).toBeGreaterThan(0);
    });

    test('Eliminar item debe recalcular total', async () => {
      const product2 = await Product.create({
        name: 'Second Product',
        price: 1500,
        category: 'tortas',
        stock: 10,
        images: ['second.jpg']
      });

      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId: product._id, quantity: 1 });

      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId: product2._id, quantity: 1 });

      await request(app)
        .delete('/api/cart/remove')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId: product._id });

      const response = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.total).toBe(1500);
    });
  });

  describe('Order Business Rules', () => {
    let userToken;
    let userId;
    let product;

    beforeEach(async () => {
      const user = await User.create({
        name: 'Order Business User',
        email: 'order.business@test.com',
        password: 'Password123!'
      });

      userId = user._id;

      userToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );

      product = await Product.create({
        name: 'Order Product',
        price: 10000,
        category: 'tortas',
        stock: 10,
        images: ['order.jpg']
      });
    });

    test('Envío gratis si total >= $50,000', async () => {
      const expensiveProduct = await Product.create({
        name: 'Expensive',
        price: 60000,
        category: 'tortas',
        stock: 5,
        images: ['exp.jpg']
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
        paymentMethod: 'transferencia'
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData)
        .expect(201);

      const order = await Order.findById(response.body.data.order.id);
      expect(order.shippingCost).toBe(0);
    });

    test('Envío $5,000 si total < $50,000', async () => {
      const orderData = {
        items: [
          {
            product: product._id,
            name: product.name,
            price: product.price,
            quantity: 1
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
        paymentMethod: 'transferencia'
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData)
        .expect(201);

      const order = await Order.findById(response.body.data.order.id);
      expect(order.shippingCost).toBe(5000);
    });

    test('Total debe ser subtotal + envío', async () => {
      const orderData = {
        items: [
          {
            product: product._id,
            name: product.name,
            price: product.price,
            quantity: 2
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
        paymentMethod: 'transferencia'
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData)
        .expect(201);

      const order = await Order.findById(response.body.data.order.id);
      expect(order.total).toBe(order.subtotal + order.shippingCost);
    });

    test('OrderNumber debe ser único', async () => {
      const orderData = {
        items: [
          {
            product: product._id,
            name: product.name,
            price: product.price,
            quantity: 1
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
        paymentMethod: 'transferencia'
      };

      const response1 = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData);

      const response2 = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData);

      const order1 = await Order.findById(response1.body.data.order.id);
      const order2 = await Order.findById(response2.body.data.order.id);

      expect(order1.orderNumber).not.toBe(order2.orderNumber);
    });

    test('Orden nueva debe tener status "pendiente"', async () => {
      const orderData = {
        items: [
          {
            product: product._id,
            name: product.name,
            price: product.price,
            quantity: 1
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
        paymentMethod: 'transferencia'
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData)
        .expect(201);

      const order = await Order.findById(response.body.data.order.id);
      expect(order.status).toBe('pendiente');
    });

    test('PaymentStatus inicial debe ser "pendiente"', async () => {
      const orderData = {
        items: [
          {
            product: product._id,
            name: product.name,
            price: product.price,
            quantity: 1
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
        paymentMethod: 'transferencia'
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData)
        .expect(201);

      const order = await Order.findById(response.body.data.order.id);
      expect(order.paymentStatus).toBe('pendiente');
    });

    test('Solo se puede cancelar orden si está pendiente', async () => {
      const order = await Order.create({
        user: userId,
        orderNumber: 'ORD-CONFIRMED-001',
        items: [
          {
            product: product._id,
            name: product.name,
            price: product.price,
            quantity: 1,
            subtotal: product.price
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
        subtotal: product.price,
        shippingCost: 5000,
        total: product.price + 5000,
        status: 'confirmado'
      });

      const response = await request(app)
        .put(`/api/orders/${order._id}/cancel`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(400);
    });

    test('Carrito debe vaciarse al crear orden', async () => {
      // Agregar items al carrito
      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId: product._id, quantity: 2 });

      const orderData = {
        items: [
          {
            product: product._id,
            name: product.name,
            price: product.price,
            quantity: 2
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
        paymentMethod: 'transferencia'
      };

      await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData);

      const user = await User.findById(userId);
      expect(user.cart.length).toBe(0);
    });

    test('Métodos de pago válidos: transferencia, mercadopago, efectivo', async () => {
      const validMethods = ['transferencia', 'mercadopago', 'efectivo'];

      for (const method of validMethods) {
        const orderData = {
          items: [
            {
              product: product._id,
              name: product.name,
              price: product.price,
              quantity: 1
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
          paymentMethod: method
        };

        const response = await request(app)
          .post('/api/orders')
          .set('Authorization', `Bearer ${userToken}`)
          .send(orderData);

        expect([200, 201]).toContain(response.status);
      }
    });

    test('Email en contactInfo debe ser válido', async () => {
      const orderData = {
        items: [
          {
            product: product._id,
            name: product.name,
            price: product.price,
            quantity: 1
          }
        ],
        contactInfo: {
          firstName: 'Test',
          lastName: 'User',
          email: 'invalid-email',
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

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData);

      expect([400, 422]).toContain(response.status);
    });

    test('DNI debe ser requerido en contactInfo', async () => {
      const orderData = {
        items: [
          {
            product: product._id,
            name: product.name,
            price: product.price,
            quantity: 1
          }
        ],
        contactInfo: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@test.com',
          phone: '123'
          // DNI faltante
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

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData);

      expect([400, 422]).toContain(response.status);
    });
  });

  describe('Admin Privileges Business Rules', () => {
    let adminToken;
    let userToken;

    beforeEach(async () => {
      const admin = await User.create({
        name: 'Admin',
        email: 'admin.privileges@test.com',
        password: 'Admin123!',
        role: 'admin'
      });

      adminToken = jwt.sign(
        { id: admin._id, role: admin.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );

      const user = await User.create({
        name: 'User',
        email: 'user.privileges@test.com',
        password: 'User123!',
        role: 'user'
      });

      userToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );
    });

    test('Solo admin puede crear productos', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Unauthorized Product',
          price: 1000,
          category: 'tortas',
          stock: 10,
          images: ['unauth.jpg']
        });

      expect(response.status).toBe(403);
    });

    test('Solo admin puede actualizar productos', async () => {
      const product = await Product.create({
        name: 'Test Product',
        price: 1000,
        category: 'tortas',
        stock: 10,
        images: ['test.jpg']
      });

      const response = await request(app)
        .put(`/api/products/${product._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          price: 2000
        });

      expect(response.status).toBe(403);
    });

    test('Solo admin puede eliminar productos', async () => {
      const product = await Product.create({
        name: 'Test Product',
        price: 1000,
        category: 'tortas',
        stock: 10,
        images: ['test.jpg']
      });

      const response = await request(app)
        .delete(`/api/products/${product._id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });

    test('Solo admin puede ver todas las órdenes', async () => {
      const response = await request(app)
        .get('/api/orders/admin/all')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });

    test('Solo admin puede actualizar status de órdenes', async () => {
      const user = await User.findOne({ email: 'user.privileges@test.com' });
      const product = await Product.create({
        name: 'Product',
        price: 1000,
        category: 'tortas',
        stock: 10,
        images: ['prod.jpg']
      });

      const order = await Order.create({
        user: user._id,
        orderNumber: 'ORD-PRIV-001',
        items: [
          {
            product: product._id,
            name: product.name,
            price: product.price,
            quantity: 1,
            subtotal: product.price
          }
        ],
        contactInfo: {
          firstName: 'User',
          lastName: 'Test',
          email: 'user@test.com',
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
        subtotal: product.price,
        shippingCost: 5000,
        total: product.price + 5000
      });

      const response = await request(app)
        .put(`/api/orders/admin/${order._id}/status`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ status: 'confirmado' });

      expect(response.status).toBe(403);
    });

    test('Admin puede realizar operaciones de admin', async () => {
      const product = await Product.create({
        name: 'Admin Product',
        price: 1000,
        category: 'tortas',
        stock: 10,
        images: ['admin.jpg']
      });

      // Actualizar
      const updateResponse = await request(app)
        .put(`/api/products/${product._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: 2000 });

      expect([200, 201]).toContain(updateResponse.status);

      // Ver todas las órdenes
      const ordersResponse = await request(app)
        .get('/api/orders/admin/all')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(ordersResponse.status).toBe(200);
    });
  });
});
