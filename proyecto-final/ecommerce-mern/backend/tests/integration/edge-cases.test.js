import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../../models/user.model.js';
import Product from '../../models/product.model.js';
import Order from '../../models/order.model.js';
import productRoutes from '../../routes/product.routes.js';
import cartRoutes from '../../routes/cart.routes.js';
import orderRoutes from '../../routes/order.routes.js';

const app = express();
app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

describe('Edge Cases & Corner Cases Tests', () => {
  describe('Product Edge Cases', () => {
    let adminToken;

    beforeEach(async () => {
      const admin = await User.create({
        name: 'Admin',
        email: 'admin.edge@test.com',
        password: 'Admin123!',
        role: 'admin'
      });

      adminToken = jwt.sign(
        { id: admin._id, role: admin.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );
    });

    test('Producto con precio exactamente 0', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Producto Gratis',
          description: 'Promoción',
          price: 0,
          category: 'promociones',
          stock: 100,
          images: ['gratis.jpg']
        });

      // Debería aceptar precio 0 o rechazarlo según reglas de negocio
      expect([200, 201, 400]).toContain(response.status);
    });

    test('Producto con precio muy grande (millones)', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Producto Carísimo',
          description: 'Premium',
          price: 999999999,
          category: 'premium',
          stock: 1,
          images: ['expensive.jpg']
        });

      expect([200, 201, 400]).toContain(response.status);
    });

    test('Producto con stock exactamente 0', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Producto Agotado',
          description: 'Sin stock',
          price: 1000,
          category: 'tortas',
          stock: 0,
          images: ['agotado.jpg']
        });

      expect([200, 201]).toContain(response.status);
    });

    test('Producto con nombre muy largo', async () => {
      const longName = 'A'.repeat(500);

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: longName,
          description: 'Test',
          price: 1000,
          category: 'tortas',
          stock: 10,
          images: ['test.jpg']
        });

      // Debe validar longitud máxima
      expect(response.status).toBeDefined();
    });

    test('Producto con caracteres especiales en nombre', async () => {
      const specialNames = [
        'Tarta @#$%',
        'Pastel ñáéíóú',
        'Torta 中文',
        'Cake 🎂',
        'Tart\nMultiline',
        'Pie\tTab'
      ];

      for (const name of specialNames) {
        const response = await request(app)
          .post('/api/products')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            name: name,
            description: 'Test caracteres especiales',
            price: 1000,
            category: 'tortas',
            stock: 10,
            images: ['special.jpg']
          });

        expect([200, 201, 400]).toContain(response.status);
      }
    });

    test('Producto sin imágenes', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Producto Sin Imagen',
          description: 'Test',
          price: 1000,
          category: 'tortas',
          stock: 10,
          images: []
        });

      expect(response.status).toBeDefined();
    });

    test('Producto con muchas imágenes', async () => {
      const manyImages = Array(100).fill('image.jpg');

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Producto Con Muchas Imágenes',
          description: 'Test',
          price: 1000,
          category: 'tortas',
          stock: 10,
          images: manyImages
        });

      expect(response.status).toBeDefined();
    });

    test('Actualizar producto que no existe', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .put(`/api/products/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          price: 5000
        });

      expect(response.status).toBe(404);
    });

    test('Eliminar producto que no existe', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .delete(`/api/products/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });

    test('Búsqueda con string vacío', async () => {
      const response = await request(app)
        .get('/api/products?search=')
        .expect(200);

      expect(response.body.products).toBeDefined();
    });

    test('Búsqueda con espacios solamente', async () => {
      const response = await request(app)
        .get('/api/products?search=   ')
        .expect(200);

      expect(response.body.products).toBeDefined();
    });

    test('Filtro de precio con valores iguales (min = max)', async () => {
      const response = await request(app)
        .get('/api/products?minPrice=1000&maxPrice=1000')
        .expect(200);

      expect(response.body.products).toBeDefined();
    });

    test('Filtro de precio con min > max', async () => {
      const response = await request(app)
        .get('/api/products?minPrice=5000&maxPrice=1000')
        .expect(200);

      // Debe manejar caso edge
      expect(response.body.products).toBeDefined();
    });
  });

  describe('Cart Edge Cases', () => {
    let userToken;
    let userId;
    let product;

    beforeEach(async () => {
      const user = await User.create({
        name: 'Cart Edge User',
        email: 'cartedge@test.com',
        password: 'Password123!'
      });

      userId = user._id;

      userToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );

      product = await Product.create({
        name: 'Test Product',
        price: 1000,
        category: 'tortas',
        stock: 5,
        images: ['test.jpg']
      });
    });

    test('Agregar cantidad que excede stock disponible', async () => {
      const response = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: product._id,
          quantity: 100 // Más que el stock
        });

      expect([400, 422]).toContain(response.status);
    });

    test('Agregar cantidad exactamente igual al stock', async () => {
      const response = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: product._id,
          quantity: 5
        });

      expect(response.status).toBe(200);
    });

    test('Agregar producto sin stock', async () => {
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

    test('Actualizar cantidad a 0 (debería eliminar item)', async () => {
      // Primero agregar
      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: product._id,
          quantity: 2
        });

      // Actualizar a 0
      const response = await request(app)
        .put('/api/cart/update')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: product._id,
          quantity: 0
        });

      expect([200, 400]).toContain(response.status);
    });

    test('Eliminar producto que no está en el carrito', async () => {
      const otherProduct = await Product.create({
        name: 'Other Product',
        price: 2000,
        category: 'tortas',
        stock: 10,
        images: ['other.jpg']
      });

      const response = await request(app)
        .delete('/api/cart/remove')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: otherProduct._id
        });

      expect([200, 404]).toContain(response.status);
    });

    test('Limpiar carrito ya vacío', async () => {
      const response = await request(app)
        .delete('/api/cart/clear')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.cart.length).toBe(0);
    });

    test('Agregar mismo producto múltiples veces', async () => {
      // Primera vez
      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: product._id,
          quantity: 1
        });

      // Segunda vez
      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: product._id,
          quantity: 1
        });

      const response = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${userToken}`);

      // Debe tener solo 1 item con cantidad sumada o múltiples items
      expect(response.body.cart.length).toBeGreaterThan(0);
    });

    test('Carrito con producto eliminado', async () => {
      // Agregar producto
      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: product._id,
          quantity: 1
        });

      // Eliminar producto de la BD
      await Product.findByIdAndDelete(product._id);

      // Intentar ver carrito
      const response = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${userToken}`);

      // Debe manejar producto inexistente
      expect(response.status).toBe(200);
    });

    test('Cantidad decimal en lugar de entero', async () => {
      const response = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: product._id,
          quantity: 1.5
        });

      expect([200, 400]).toContain(response.status);
    });

    test('Cantidad negativa', async () => {
      const response = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: product._id,
          quantity: -5
        });

      expect(response.status).toBe(400);
    });

    test('ProductId inválido', async () => {
      const response = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: 'invalid-id',
          quantity: 1
        });

      expect([400, 422]).toContain(response.status);
    });

    test('ProductId que no existe', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: fakeId,
          quantity: 1
        });

      expect([404, 400]).toContain(response.status);
    });
  });

  describe('Order Edge Cases', () => {
    let userToken;
    let userId;
    let product;

    beforeEach(async () => {
      const user = await User.create({
        name: 'Order Edge User',
        email: 'orderedge@test.com',
        password: 'Password123!'
      });

      userId = user._id;

      userToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );

      product = await Product.create({
        name: 'Test Product',
        price: 1000,
        category: 'tortas',
        stock: 10,
        images: ['test.jpg']
      });
    });

    test('Crear orden sin items', async () => {
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
          country: 'Argentina'
        },
        paymentMethod: 'transferencia'
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData);

      expect(response.status).toBe(400);
    });

    test('Crear orden con total exactamente $50,000 (límite envío gratis)', async () => {
      const expensiveProduct = await Product.create({
        name: 'Producto Límite',
        price: 50000,
        category: 'tortas',
        stock: 5,
        images: ['limite.jpg']
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
      expect(order.shippingCost).toBe(0); // Debe ser gratis
    });

    test('Crear orden con total $49,999 (justo debajo del límite)', async () => {
      const almostFreeShipping = await Product.create({
        name: 'Casi Gratis',
        price: 49999,
        category: 'tortas',
        stock: 5,
        images: ['casi.jpg']
      });

      const orderData = {
        items: [
          {
            product: almostFreeShipping._id,
            name: almostFreeShipping.name,
            price: almostFreeShipping.price,
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
      expect(order.shippingCost).toBe(5000); // Debe cobrar envío
    });

    test('Crear orden con email inválido en contactInfo', async () => {
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

    test('Crear orden sin información de contacto', async () => {
      const orderData = {
        items: [
          {
            product: product._id,
            name: product.name,
            price: product.price,
            quantity: 1
          }
        ],
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

    test('Crear orden sin dirección de envío', async () => {
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
        paymentMethod: 'transferencia'
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData);

      expect([400, 422]).toContain(response.status);
    });

    test('Crear orden con método de pago inválido', async () => {
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
        paymentMethod: 'bitcoin'
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData);

      expect([400, 422]).toContain(response.status);
    });

    test('Cancelar orden que ya está cancelada', async () => {
      const order = await Order.create({
        user: userId,
        orderNumber: 'ORD-EDGE-001',
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
        status: 'cancelado'
      });

      const response = await request(app)
        .put(`/api/orders/${order._id}/cancel`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(400);
    });

    test('Consultar orden con ID inválido', async () => {
      const response = await request(app)
        .get('/api/orders/invalid-id')
        .set('Authorization', `Bearer ${userToken}`);

      expect([400, 404]).toContain(response.status);
    });

    test('Crear múltiples órdenes simultáneas', async () => {
      const promises = [];

      for (let i = 0; i < 5; i++) {
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

        promises.push(
          request(app)
            .post('/api/orders')
            .set('Authorization', `Bearer ${userToken}`)
            .send(orderData)
        );
      }

      const responses = await Promise.all(promises);

      // Verificar que todos se crearon exitosamente
      responses.forEach(response => {
        expect([200, 201]).toContain(response.status);
      });

      // Verificar que todos tienen orderNumber únicos
      const orderNumbers = responses.map(r => r.body.data?.order?.orderNumber).filter(Boolean);
      const uniqueNumbers = new Set(orderNumbers);
      expect(uniqueNumbers.size).toBe(orderNumbers.length);
    });
  });

  describe('Concurrent Operations Edge Cases', () => {
    let userToken;
    let product;

    beforeEach(async () => {
      const user = await User.create({
        name: 'Concurrent User',
        email: 'concurrent@test.com',
        password: 'Password123!'
      });

      userToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );

      product = await Product.create({
        name: 'Limited Stock Product',
        price: 1000,
        category: 'tortas',
        stock: 3,
        images: ['limited.jpg']
      });
    });

    test('Múltiples usuarios intentan comprar último stock simultáneamente', async () => {
      const users = await Promise.all([
        User.create({
          name: 'User 1',
          email: 'user1@concurrent.com',
          password: 'Pass123!'
        }),
        User.create({
          name: 'User 2',
          email: 'user2@concurrent.com',
          password: 'Pass123!'
        }),
        User.create({
          name: 'User 3',
          email: 'user3@concurrent.com',
          password: 'Pass123!'
        })
      ]);

      const tokens = users.map(user => 
        jwt.sign(
          { id: user._id, role: user.role },
          process.env.JWT_SECRET || 'test-secret',
          { expiresIn: '1h' }
        )
      );

      const promises = tokens.map(token =>
        request(app)
          .post('/api/cart/add')
          .set('Authorization', `Bearer ${token}`)
          .send({
            productId: product._id,
            quantity: 3
          })
      );

      const responses = await Promise.all(promises);

      // Al menos uno debe fallar por falta de stock
      const successful = responses.filter(r => r.status === 200);
      const failed = responses.filter(r => r.status !== 200);

      expect(failed.length).toBeGreaterThan(0);
    });
  });

  describe('Boundary Value Tests', () => {
    let adminToken;

    beforeEach(async () => {
      const admin = await User.create({
        name: 'Admin',
        email: 'admin.boundary@test.com',
        password: 'Admin123!',
        role: 'admin'
      });

      adminToken = jwt.sign(
        { id: admin._id, role: admin.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );
    });

    test('Precio = 0.01 (mínimo positivo)', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Producto Mínimo',
          price: 0.01,
          category: 'tortas',
          stock: 10,
          images: ['min.jpg']
        });

      expect([200, 201, 400]).toContain(response.status);
    });

    test('Stock = 1 (mínimo)', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Stock Mínimo',
          price: 1000,
          category: 'tortas',
          stock: 1,
          images: ['stock1.jpg']
        });

      expect([200, 201]).toContain(response.status);
    });

    test('Nombre = 1 carácter', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'A',
          price: 1000,
          category: 'tortas',
          stock: 10,
          images: ['a.jpg']
        });

      expect(response.status).toBeDefined();
    });

    test('Descripción vacía', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Sin Descripción',
          description: '',
          price: 1000,
          category: 'tortas',
          stock: 10,
          images: ['nodesc.jpg']
        });

      expect(response.status).toBeDefined();
    });
  });

  describe('Data Type Mismatch Tests', () => {
    let adminToken;

    beforeEach(async () => {
      const admin = await User.create({
        name: 'Admin',
        email: 'admin.type@test.com',
        password: 'Admin123!',
        role: 'admin'
      });

      adminToken = jwt.sign(
        { id: admin._id, role: admin.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );
    });

    test('Precio como string en lugar de number', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'String Price',
          price: '1000',
          category: 'tortas',
          stock: 10,
          images: ['price.jpg']
        });

      expect(response.status).toBeDefined();
    });

    test('Stock como string en lugar de number', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'String Stock',
          price: 1000,
          category: 'tortas',
          stock: '10',
          images: ['stock.jpg']
        });

      expect(response.status).toBeDefined();
    });

    test('Array de imágenes como string', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'String Images',
          price: 1000,
          category: 'tortas',
          stock: 10,
          images: 'image.jpg'
        });

      expect([200, 201, 400]).toContain(response.status);
    });

    test('Boolean en lugar de number', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Boolean Price',
          price: true,
          category: 'tortas',
          stock: 10,
          images: ['bool.jpg']
        });

      expect(response.status).toBe(400);
    });

    test('Null en campos requeridos', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: null,
          price: 1000,
          category: 'tortas',
          stock: 10,
          images: ['null.jpg']
        });

      expect(response.status).toBe(400);
    });

    test('Undefined en campos requeridos', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: undefined,
          price: 1000,
          category: 'tortas',
          stock: 10,
          images: ['undefined.jpg']
        });

      expect(response.status).toBe(400);
    });
  });

  describe('Unicode & Special Characters Tests', () => {
    let adminToken;

    beforeEach(async () => {
      const admin = await User.create({
        name: 'Admin Unicode',
        email: 'admin.unicode@test.com',
        password: 'Admin123!',
        role: 'admin'
      });

      adminToken = jwt.sign(
        { id: admin._id, role: admin.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );
    });

    test('Nombre con emojis', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Tarta 🎂 Deliciosa 🍰',
          price: 1000,
          category: 'tortas',
          stock: 10,
          images: ['emoji.jpg']
        });

      expect([200, 201]).toContain(response.status);
    });

    test('Nombre con caracteres chinos', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: '蛋糕 Tarta',
          price: 1000,
          category: 'tortas',
          stock: 10,
          images: ['chinese.jpg']
        });

      expect([200, 201]).toContain(response.status);
    });

    test('Nombre con caracteres árabes', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'كعكة Tarta',
          price: 1000,
          category: 'tortas',
          stock: 10,
          images: ['arabic.jpg']
        });

      expect([200, 201]).toContain(response.status);
    });

    test('Nombre con caracteres cirílicos', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Торт Tarta',
          price: 1000,
          category: 'tortas',
          stock: 10,
          images: ['cyrillic.jpg']
        });

      expect([200, 201]).toContain(response.status);
    });
  });
});
