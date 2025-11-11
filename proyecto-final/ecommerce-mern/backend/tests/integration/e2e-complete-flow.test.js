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

// Crear app de prueba completa
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

describe('E2E Complete User Flow Tests', () => {
  describe('Complete Purchase Flow - Happy Path', () => {
    let userToken;
    let userId;
    let productId;
    let orderId;

    test('PASO 1: Usuario se registra en la plataforma', async () => {
      const registerData = {
        name: 'Juan Pérez',
        email: 'juan.perez@example.com',
        password: 'SecurePass123!'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(registerData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(registerData.email);
      expect(response.body.user.name).toBe(registerData.name);
      userId = response.body.user._id;
    });

    test('PASO 2: Usuario inicia sesión', async () => {
      const loginData = {
        email: 'juan.perez@example.com',
        password: 'SecurePass123!'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      userToken = response.body.token;
    });

    test('PASO 3: Usuario obtiene su perfil', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user.email).toBe('juan.perez@example.com');
    });

    test('PASO 4: Usuario busca productos disponibles', async () => {
      // Crear productos de prueba
      const products = await Product.create([
        {
          name: 'Tarta de Frutilla',
          description: 'Deliciosa tarta de frutilla fresca',
          price: 3500,
          category: 'tortas',
          stock: 10,
          images: ['frutilla.jpg']
        },
        {
          name: 'Tarta de Chocolate',
          description: 'Tarta de chocolate intenso',
          price: 4000,
          category: 'tortas',
          stock: 5,
          images: ['chocolate.jpg']
        },
        {
          name: 'Tarta de Limón',
          description: 'Tarta de limón con merengue',
          price: 3200,
          category: 'tortas',
          stock: 8,
          images: ['limon.jpg']
        }
      ]);

      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.products.length).toBeGreaterThanOrEqual(3);
      productId = products[0]._id;
    });

    test('PASO 5: Usuario ve detalle de un producto', async () => {
      const response = await request(app)
        .get(`/api/products/${productId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.product.name).toBe('Tarta de Frutilla');
      expect(response.body.product.price).toBe(3500);
    });

    test('PASO 6: Usuario agrega producto al carrito', async () => {
      const response = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: productId,
          quantity: 2
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.cart.length).toBe(1);
      expect(response.body.cart[0].quantity).toBe(2);
    });

    test('PASO 7: Usuario agrega otro producto al carrito', async () => {
      const products = await Product.find({});
      const secondProduct = products[1];

      const response = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: secondProduct._id,
          quantity: 1
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.cart.length).toBe(2);
    });

    test('PASO 8: Usuario consulta su carrito', async () => {
      const response = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.cart.length).toBe(2);
      expect(response.body.total).toBeGreaterThan(0);
    });

    test('PASO 9: Usuario actualiza cantidad en el carrito', async () => {
      const response = await request(app)
        .put('/api/cart/update')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: productId,
          quantity: 3
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      const updatedItem = response.body.cart.find(
        item => item.product._id.toString() === productId.toString()
      );
      expect(updatedItem.quantity).toBe(3);
    });

    test('PASO 10: Usuario procede al checkout', async () => {
      const user = await User.findById(userId);
      const cartItems = user.cart;

      const orderData = {
        items: await Promise.all(cartItems.map(async (item) => {
          const product = await Product.findById(item.product);
          return {
            product: product._id,
            name: product.name,
            price: product.price,
            quantity: item.quantity,
            image: product.images[0]
          };
        })),
        contactInfo: {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@example.com',
          phone: '1234567890',
          dni: '12345678'
        },
        shippingAddress: {
          street: 'Av. Corrientes',
          number: '1234',
          floor: '5',
          apartment: 'A',
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
      expect(response.body.data.order).toBeDefined();
      expect(response.body.data.order.orderNumber).toBeDefined();
      expect(response.body.data.paymentInstructions).toBeDefined();
      orderId = response.body.data.order.id;
    });

    test('PASO 11: Carrito se vació después de crear orden', async () => {
      const response = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.cart.length).toBe(0);
    });

    test('PASO 12: Usuario consulta su orden creada', async () => {
      const response = await request(app)
        .get(`/api/orders/${orderId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.order.status).toBe('pendiente');
    });

    test('PASO 13: Usuario consulta historial de órdenes', async () => {
      const response = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.orders.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Complete Purchase Flow - Multiple Items', () => {
    let userToken;
    let products;

    beforeEach(async () => {
      // Crear usuario
      const user = await User.create({
        name: 'María González',
        email: 'maria.gonzalez@example.com',
        password: 'Password123!',
        role: 'user'
      });

      userToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );

      // Crear múltiples productos
      products = await Product.create([
        {
          name: 'Tarta Oreo',
          description: 'Tarta de Oreo',
          price: 4500,
          category: 'tortas',
          stock: 15,
          images: ['oreo.jpg']
        },
        {
          name: 'Tarta Cheesecake',
          description: 'Cheesecake clásico',
          price: 5000,
          category: 'tortas',
          stock: 10,
          images: ['cheesecake.jpg']
        },
        {
          name: 'Tarta Red Velvet',
          description: 'Red Velvet Premium',
          price: 5500,
          category: 'tortas',
          stock: 8,
          images: ['redvelvet.jpg']
        },
        {
          name: 'Tarta Carrot Cake',
          description: 'Carrot Cake con nueces',
          price: 4800,
          category: 'tortas',
          stock: 12,
          images: ['carrot.jpg']
        }
      ]);
    });

    test('Usuario agrega múltiples productos al carrito de una vez', async () => {
      for (const product of products) {
        await request(app)
          .post('/api/cart/add')
          .set('Authorization', `Bearer ${userToken}`)
          .send({
            productId: product._id,
            quantity: Math.floor(Math.random() * 3) + 1
          })
          .expect(200);
      }

      const response = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.cart.length).toBe(products.length);
    });

    test('Usuario crea orden grande con envío gratis', async () => {
      // Agregar productos para superar $50000
      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: products[0]._id,
          quantity: 5
        });

      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: products[1]._id,
          quantity: 5
        });

      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: products[2]._id,
          quantity: 3
        });

      const user = await User.findOne({ email: 'maria.gonzalez@example.com' });
      const cartItems = user.cart;

      const orderData = {
        items: await Promise.all(cartItems.map(async (item) => {
          const product = await Product.findById(item.product);
          return {
            product: product._id,
            name: product.name,
            price: product.price,
            quantity: item.quantity,
            image: product.images[0]
          };
        })),
        contactInfo: {
          firstName: 'María',
          lastName: 'González',
          email: 'maria.gonzalez@example.com',
          phone: '0987654321',
          dni: '87654321'
        },
        shippingAddress: {
          street: 'Calle Florida',
          number: '500',
          city: 'Buenos Aires',
          province: 'Buenos Aires',
          postalCode: '1005',
          country: 'Argentina'
        },
        paymentMethod: 'mercadopago'
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData)
        .expect(201);

      const order = await Order.findById(response.body.data.order.id);
      expect(order.shippingCost).toBe(0); // Envío gratis
      expect(order.total).toBeGreaterThanOrEqual(50000);
    });
  });

  describe('Complete Admin Flow', () => {
    let adminToken;
    let userToken;
    let normalUserId;
    let orderId;

    beforeEach(async () => {
      // Crear admin
      const admin = await User.create({
        name: 'Admin User',
        email: 'admin@ecommerce.com',
        password: 'AdminPass123!',
        role: 'admin'
      });

      adminToken = jwt.sign(
        { id: admin._id, role: admin.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );

      // Crear usuario normal
      const user = await User.create({
        name: 'Usuario Normal',
        email: 'user@example.com',
        password: 'UserPass123!',
        role: 'user'
      });

      normalUserId = user._id;

      userToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );

      // Crear producto
      const product = await Product.create({
        name: 'Tarta Admin Test',
        description: 'Producto de prueba',
        price: 3000,
        category: 'tortas',
        stock: 5,
        images: ['test.jpg']
      });

      // Crear orden
      const order = await Order.create({
        user: normalUserId,
        orderNumber: 'ORD-ADMIN-TEST-001',
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
          firstName: 'Usuario',
          lastName: 'Normal',
          email: 'user@example.com',
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
        status: 'pendiente'
      });

      orderId = order._id;
    });

    test('ADMIN PASO 1: Admin crea nuevo producto', async () => {
      const productData = {
        name: 'Tarta Nueva Premium',
        description: 'Nueva tarta exclusiva',
        price: 6000,
        category: 'tortas',
        stock: 20,
        images: ['nueva-premium.jpg']
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(productData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.product.name).toBe(productData.name);
    });

    test('ADMIN PASO 2: Admin actualiza producto existente', async () => {
      const product = await Product.findOne({ name: 'Tarta Admin Test' });

      const updateData = {
        price: 3500,
        stock: 10
      };

      const response = await request(app)
        .put(`/api/products/${product._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.product.price).toBe(3500);
    });

    test('ADMIN PASO 3: Admin ve todas las órdenes', async () => {
      const response = await request(app)
        .get('/api/orders/admin/all')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.orders)).toBe(true);
    });

    test('ADMIN PASO 4: Admin actualiza estado de orden', async () => {
      const response = await request(app)
        .put(`/api/orders/admin/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'confirmado' })
        .expect(200);

      expect(response.body.success).toBe(true);

      const updatedOrder = await Order.findById(orderId);
      expect(updatedOrder.status).toBe('confirmado');
    });

    test('ADMIN PASO 5: Admin elimina producto', async () => {
      const product = await Product.findOne({ name: 'Tarta Admin Test' });

      const response = await request(app)
        .delete(`/api/products/${product._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      const deletedProduct = await Product.findById(product._id);
      expect(deletedProduct).toBeNull();
    });

    test('Usuario normal NO puede crear productos', async () => {
      const productData = {
        name: 'Intento de Hack',
        price: 1000,
        category: 'tortas',
        stock: 1
      };

      await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send(productData)
        .expect(403);
    });

    test('Usuario normal NO puede ver todas las órdenes', async () => {
      await request(app)
        .get('/api/orders/admin/all')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });
  });

  describe('Cart Management Complete Flow', () => {
    let userToken;
    let products;

    beforeEach(async () => {
      const user = await User.create({
        name: 'Cart Test User',
        email: 'cart@example.com',
        password: 'Password123!',
        role: 'user'
      });

      userToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );

      products = await Product.create([
        {
          name: 'Producto 1',
          price: 1000,
          category: 'tortas',
          stock: 10,
          images: ['p1.jpg']
        },
        {
          name: 'Producto 2',
          price: 2000,
          category: 'tortas',
          stock: 10,
          images: ['p2.jpg']
        },
        {
          name: 'Producto 3',
          price: 3000,
          category: 'tortas',
          stock: 10,
          images: ['p3.jpg']
        }
      ]);
    });

    test('Agregar, actualizar y eliminar items del carrito', async () => {
      // Agregar item 1
      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId: products[0]._id, quantity: 2 })
        .expect(200);

      // Agregar item 2
      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId: products[1]._id, quantity: 1 })
        .expect(200);

      // Verificar 2 items
      let response = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);
      expect(response.body.cart.length).toBe(2);

      // Actualizar cantidad item 1
      await request(app)
        .put('/api/cart/update')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId: products[0]._id, quantity: 5 })
        .expect(200);

      // Eliminar item 2
      await request(app)
        .delete('/api/cart/remove')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId: products[1]._id })
        .expect(200);

      // Verificar solo 1 item con cantidad 5
      response = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);
      expect(response.body.cart.length).toBe(1);
      expect(response.body.cart[0].quantity).toBe(5);
    });

    test('Limpiar carrito completamente', async () => {
      // Agregar múltiples items
      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId: products[0]._id, quantity: 1 });

      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId: products[1]._id, quantity: 1 });

      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId: products[2]._id, quantity: 1 });

      // Limpiar carrito
      const response = await request(app)
        .delete('/api/cart/clear')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.cart.length).toBe(0);
    });
  });

  describe('Product Search and Filtering Flow', () => {
    beforeEach(async () => {
      await Product.create([
        {
          name: 'Tarta de Chocolate Premium',
          description: 'Chocolate belga',
          price: 5000,
          category: 'tortas',
          stock: 10,
          images: ['choco1.jpg']
        },
        {
          name: 'Tarta de Chocolate Simple',
          description: 'Chocolate clásico',
          price: 3000,
          category: 'tortas',
          stock: 15,
          images: ['choco2.jpg']
        },
        {
          name: 'Pastelito de Chocolate',
          description: 'Mini chocolate',
          price: 500,
          category: 'pastelitos',
          stock: 50,
          images: ['mini.jpg']
        },
        {
          name: 'Tarta de Frutilla Orgánica',
          description: 'Frutillas frescas',
          price: 4500,
          category: 'tortas',
          stock: 8,
          images: ['fruti.jpg']
        }
      ]);
    });

    test('Buscar productos por nombre', async () => {
      const response = await request(app)
        .get('/api/products?search=chocolate')
        .expect(200);

      expect(response.body.products.length).toBeGreaterThanOrEqual(2);
      response.body.products.forEach(product => {
        expect(
          product.name.toLowerCase().includes('chocolate') ||
          product.description.toLowerCase().includes('chocolate')
        ).toBe(true);
      });
    });

    test('Filtrar productos por categoría', async () => {
      const response = await request(app)
        .get('/api/products?category=tortas')
        .expect(200);

      expect(response.body.products.length).toBeGreaterThanOrEqual(3);
      response.body.products.forEach(product => {
        expect(product.category).toBe('tortas');
      });
    });

    test('Filtrar productos por rango de precio', async () => {
      const response = await request(app)
        .get('/api/products?minPrice=3000&maxPrice=5000')
        .expect(200);

      response.body.products.forEach(product => {
        expect(product.price).toBeGreaterThanOrEqual(3000);
        expect(product.price).toBeLessThanOrEqual(5000);
      });
    });

    test('Ordenar productos por precio ascendente', async () => {
      const response = await request(app)
        .get('/api/products?sortBy=price&order=asc')
        .expect(200);

      for (let i = 1; i < response.body.products.length; i++) {
        expect(response.body.products[i].price).toBeGreaterThanOrEqual(
          response.body.products[i - 1].price
        );
      }
    });

    test('Ordenar productos por precio descendente', async () => {
      const response = await request(app)
        .get('/api/products?sortBy=price&order=desc')
        .expect(200);

      for (let i = 1; i < response.body.products.length; i++) {
        expect(response.body.products[i].price).toBeLessThanOrEqual(
          response.body.products[i - 1].price
        );
      }
    });

    test('Combinar múltiples filtros', async () => {
      const response = await request(app)
        .get('/api/products?category=tortas&minPrice=4000&search=chocolate')
        .expect(200);

      response.body.products.forEach(product => {
        expect(product.category).toBe('tortas');
        expect(product.price).toBeGreaterThanOrEqual(4000);
        expect(
          product.name.toLowerCase().includes('chocolate') ||
          product.description.toLowerCase().includes('chocolate')
        ).toBe(true);
      });
    });
  });

  describe('User Account Management Flow', () => {
    let userToken;
    let userId;

    test('Usuario se registra, actualiza perfil y cambia contraseña', async () => {
      // Registro
      let response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test Profile User',
          email: 'profile@example.com',
          password: 'OldPassword123!'
        })
        .expect(201);

      userId = response.body.user._id;

      // Login
      response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'profile@example.com',
          password: 'OldPassword123!'
        })
        .expect(200);

      userToken = response.body.token;

      // Actualizar perfil
      response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Updated Name',
          phone: '1234567890'
        })
        .expect(200);

      expect(response.body.user.name).toBe('Updated Name');

      // Cambiar contraseña
      response = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          currentPassword: 'OldPassword123!',
          newPassword: 'NewPassword456!'
        })
        .expect(200);

      // Login con nueva contraseña
      response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'profile@example.com',
          password: 'NewPassword456!'
        })
        .expect(200);

      expect(response.body.token).toBeDefined();
    });
  });

  describe('Order Status Lifecycle Flow', () => {
    let adminToken;
    let userToken;
    let orderId;

    beforeEach(async () => {
      const admin = await User.create({
        name: 'Admin',
        email: 'admin.lifecycle@test.com',
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
        email: 'user.lifecycle@test.com',
        password: 'User123!',
        role: 'user'
      });

      userToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );

      const product = await Product.create({
        name: 'Product Lifecycle',
        price: 1000,
        category: 'tortas',
        stock: 10,
        images: ['lifecycle.jpg']
      });

      const order = await Order.create({
        user: user._id,
        orderNumber: 'ORD-LIFECYCLE-001',
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
          email: 'user.lifecycle@test.com',
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
        status: 'pendiente'
      });

      orderId = order._id;
    });

    test('Orden pasa por todos los estados del ciclo de vida', async () => {
      const statuses = ['confirmado', 'en_preparacion', 'enviado', 'entregado'];

      for (const status of statuses) {
        const response = await request(app)
          .put(`/api/orders/admin/${orderId}/status`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ status })
          .expect(200);

        expect(response.body.success).toBe(true);

        const order = await Order.findById(orderId);
        expect(order.status).toBe(status);
      }
    });

    test('Usuario puede cancelar orden solo si está pendiente', async () => {
      // Cancelar cuando está pendiente - OK
      let response = await request(app)
        .put(`/api/orders/${orderId}/cancel`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Intentar cancelar cuando ya está cancelada - FAIL
      response = await request(app)
        .put(`/api/orders/${orderId}/cancel`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
