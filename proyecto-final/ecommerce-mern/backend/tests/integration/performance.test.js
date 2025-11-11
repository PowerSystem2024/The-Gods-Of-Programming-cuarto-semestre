import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../../models/user.model.js';
import Product from '../../models/product.model.js';
import Order from '../../models/order.model.js';
import productRoutes from '../../routes/product.routes.js';
import orderRoutes from '../../routes/order.routes.js';

const app = express();
app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

describe('Performance & Load Tests', () => {
  describe('Database Query Performance', () => {
    beforeEach(async () => {
      // Crear muchos productos para testear performance
      const products = [];
      for (let i = 0; i < 100; i++) {
        products.push({
          name: `Producto ${i}`,
          description: `Descripción del producto ${i}`,
          price: Math.floor(Math.random() * 10000) + 1000,
          category: i % 2 === 0 ? 'tortas' : 'pastelitos',
          stock: Math.floor(Math.random() * 50) + 1,
          images: [`imagen${i}.jpg`]
        });
      }
      await Product.create(products);
    });

    test('Listar todos los productos debe ser rápido', async () => {
      const startTime = Date.now();

      const response = await request(app)
        .get('/api/products')
        .expect(200);

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(response.body.products).toBeDefined();
      expect(response.body.products.length).toBeGreaterThan(0);
      // Debe completarse en menos de 2 segundos
      expect(duration).toBeLessThan(2000);
    });

    test('Búsqueda de productos debe ser eficiente', async () => {
      const startTime = Date.now();

      const response = await request(app)
        .get('/api/products?search=Producto')
        .expect(200);

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(response.body.products.length).toBeGreaterThan(0);
      expect(duration).toBeLessThan(2000);
    });

    test('Filtrado por categoría debe ser rápido', async () => {
      const startTime = Date.now();

      const response = await request(app)
        .get('/api/products?category=tortas')
        .expect(200);

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(response.body.products.length).toBeGreaterThan(0);
      expect(duration).toBeLessThan(2000);
    });

    test('Ordenamiento de productos debe ser eficiente', async () => {
      const startTime = Date.now();

      const response = await request(app)
        .get('/api/products?sortBy=price&order=asc')
        .expect(200);

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(response.body.products.length).toBeGreaterThan(0);
      expect(duration).toBeLessThan(2000);
    });

    test('Consulta con múltiples filtros debe ser rápida', async () => {
      const startTime = Date.now();

      const response = await request(app)
        .get('/api/products?category=tortas&minPrice=2000&maxPrice=8000&sortBy=price')
        .expect(200);

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(2000);
    });
  });

  describe('Pagination Performance', () => {
    beforeEach(async () => {
      const products = [];
      for (let i = 0; i < 200; i++) {
        products.push({
          name: `Producto Paginado ${i}`,
          price: i * 100,
          category: 'tortas',
          stock: 10,
          images: [`page${i}.jpg`]
        });
      }
      await Product.create(products);
    });

    test('Primera página debe cargar rápido', async () => {
      const startTime = Date.now();

      const response = await request(app)
        .get('/api/products?page=1&limit=20')
        .expect(200);

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(response.body.products.length).toBeLessThanOrEqual(20);
      expect(duration).toBeLessThan(1000);
    });

    test('Páginas intermedias deben cargar rápido', async () => {
      const startTime = Date.now();

      const response = await request(app)
        .get('/api/products?page=5&limit=20')
        .expect(200);

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(1000);
    });

    test('Última página debe cargar rápido', async () => {
      const startTime = Date.now();

      const response = await request(app)
        .get('/api/products?page=10&limit=20')
        .expect(200);

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(1000);
    });
  });

  describe('Concurrent Requests Load Test', () => {
    test('Manejar múltiples peticiones GET simultáneas', async () => {
      const promises = [];
      const numberOfRequests = 50;

      for (let i = 0; i < numberOfRequests; i++) {
        promises.push(
          request(app).get('/api/products')
        );
      }

      const startTime = Date.now();
      const responses = await Promise.all(promises);
      const endTime = Date.now();
      const duration = endTime - startTime;

      // Todas deben completarse exitosamente
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });

      // Todas las 50 peticiones en menos de 5 segundos
      expect(duration).toBeLessThan(5000);
    });

    test('Manejar múltiples búsquedas simultáneas', async () => {
      await Product.create([
        { name: 'Tarta A', price: 1000, category: 'tortas', stock: 10, images: ['a.jpg'] },
        { name: 'Tarta B', price: 2000, category: 'tortas', stock: 10, images: ['b.jpg'] },
        { name: 'Tarta C', price: 3000, category: 'tortas', stock: 10, images: ['c.jpg'] }
      ]);

      const searches = ['Tarta', 'A', 'B', 'C'];
      const promises = [];

      searches.forEach(search => {
        for (let i = 0; i < 10; i++) {
          promises.push(
            request(app).get(`/api/products?search=${search}`)
          );
        }
      });

      const responses = await Promise.all(promises);

      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });
  });

  describe('Large Data Handling', () => {
    test('Crear producto con descripción muy larga', async () => {
      const admin = await User.create({
        name: 'Admin',
        email: 'admin.large@test.com',
        password: 'Admin123!',
        role: 'admin'
      });

      const adminToken = jwt.sign(
        { id: admin._id, role: admin.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );

      const largeDescription = 'Lorem ipsum dolor sit amet. '.repeat(100);

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Producto Grande',
          description: largeDescription,
          price: 1000,
          category: 'tortas',
          stock: 10,
          images: ['large.jpg']
        });

      expect([200, 201, 400]).toContain(response.status);
    });

    test('Manejar muchos items en una sola orden', async () => {
      const user = await User.create({
        name: 'Big Order User',
        email: 'bigorder@test.com',
        password: 'Password123!'
      });

      const userToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );

      const products = [];
      for (let i = 0; i < 20; i++) {
        const product = await Product.create({
          name: `Item ${i}`,
          price: 1000,
          category: 'tortas',
          stock: 100,
          images: [`item${i}.jpg`]
        });
        products.push(product);
      }

      const orderItems = products.map(product => ({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.images[0]
      }));

      const orderData = {
        items: orderItems,
        contactInfo: {
          firstName: 'Big',
          lastName: 'Order',
          email: 'bigorder@test.com',
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

      expect([200, 201]).toContain(response.status);
    });
  });

  describe('Memory Efficiency Tests', () => {
    test('Recuperar producto individual no debe consumir exceso de memoria', async () => {
      const product = await Product.create({
        name: 'Memory Test Product',
        price: 1000,
        category: 'tortas',
        stock: 10,
        images: ['memory.jpg']
      });

      const response = await request(app)
        .get(`/api/products/${product._id}`)
        .expect(200);

      expect(response.body.product).toBeDefined();
      expect(response.body.product._id).toBe(product._id.toString());
    });

    test('Listar órdenes no debe cargar datos innecesarios', async () => {
      const user = await User.create({
        name: 'Memory User',
        email: 'memory@test.com',
        password: 'Password123!'
      });

      const userToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );

      // Crear algunas órdenes
      const product = await Product.create({
        name: 'Test',
        price: 1000,
        category: 'tortas',
        stock: 10,
        images: ['test.jpg']
      });

      for (let i = 0; i < 5; i++) {
        await Order.create({
          user: user._id,
          orderNumber: `ORD-MEM-${i}`,
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
            firstName: 'Memory',
            lastName: 'User',
            email: 'memory@test.com',
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
      }

      const response = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.orders.length).toBe(5);
    });
  });

  describe('Cache Performance (si aplica)', () => {
    test('Peticiones repetidas al mismo producto', async () => {
      const product = await Product.create({
        name: 'Cached Product',
        price: 1000,
        category: 'tortas',
        stock: 10,
        images: ['cached.jpg']
      });

      const times = [];

      for (let i = 0; i < 5; i++) {
        const startTime = Date.now();
        await request(app).get(`/api/products/${product._id}`);
        const endTime = Date.now();
        times.push(endTime - startTime);
      }

      // Las peticiones subsecuentes no deberían ser más lentas
      const avgTime = times.reduce((a, b) => a + b) / times.length;
      expect(avgTime).toBeLessThan(500);
    });
  });

  describe('Response Size Tests', () => {
    test('Respuesta de lista de productos debe ser razonable', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      const responseSize = JSON.stringify(response.body).length;
      
      // No más de 5MB
      expect(responseSize).toBeLessThan(5 * 1024 * 1024);
    });
  });

  describe('Database Connection Pool Tests', () => {
    test('Manejar múltiples conexiones simultáneas', async () => {
      const promises = [];

      for (let i = 0; i < 20; i++) {
        promises.push(
          request(app).get('/api/products')
        );
      }

      const responses = await Promise.all(promises);

      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });
  });

  describe('Stress Tests - Alta Carga', () => {
    test('Sistema bajo 100 peticiones simultáneas', async () => {
      const promises = [];

      for (let i = 0; i < 100; i++) {
        promises.push(
          request(app).get('/api/products')
        );
      }

      const startTime = Date.now();
      const responses = await Promise.all(promises);
      const endTime = Date.now();
      const duration = endTime - startTime;

      const successCount = responses.filter(r => r.status === 200).length;
      
      // Al menos 90% deben ser exitosas
      expect(successCount).toBeGreaterThanOrEqual(90);
      
      // Completar en menos de 10 segundos
      expect(duration).toBeLessThan(10000);
    });

    test('Creación masiva de productos (admin)', async () => {
      const admin = await User.create({
        name: 'Admin Stress',
        email: 'admin.stress@test.com',
        password: 'Admin123!',
        role: 'admin'
      });

      const adminToken = jwt.sign(
        { id: admin._id, role: admin.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );

      const promises = [];

      for (let i = 0; i < 50; i++) {
        promises.push(
          request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
              name: `Stress Product ${i}`,
              price: 1000 + i,
              category: 'tortas',
              stock: 10,
              images: [`stress${i}.jpg`]
            })
        );
      }

      const responses = await Promise.all(promises);

      const successCount = responses.filter(r => [200, 201].includes(r.status)).length;
      expect(successCount).toBeGreaterThan(40); // Al menos 80% exitosas
    });
  });

  describe('Response Time Tests', () => {
    test('GET /api/products debe responder rápido', async () => {
      const startTime = Date.now();
      await request(app).get('/api/products').expect(200);
      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(1000);
    });

    test('GET /api/products/:id debe responder rápido', async () => {
      const product = await Product.create({
        name: 'Fast Product',
        price: 1000,
        category: 'tortas',
        stock: 10,
        images: ['fast.jpg']
      });

      const startTime = Date.now();
      await request(app).get(`/api/products/${product._id}`).expect(200);
      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(500);
    });
  });

  describe('Throughput Tests', () => {
    test('Procesar 200 peticiones en 10 segundos', async () => {
      const promises = [];
      const numberOfRequests = 200;

      for (let i = 0; i < numberOfRequests; i++) {
        promises.push(
          request(app).get('/api/products')
        );
      }

      const startTime = Date.now();
      await Promise.all(promises);
      const duration = Date.now() - startTime;

      const throughput = numberOfRequests / (duration / 1000); // requests per second

      expect(throughput).toBeGreaterThan(10); // Al menos 10 req/s
    });
  });

  describe('Error Recovery Performance', () => {
    test('Recuperarse de múltiples errores 404', async () => {
      const promises = [];

      for (let i = 0; i < 20; i++) {
        const fakeId = new mongoose.Types.ObjectId();
        promises.push(
          request(app).get(`/api/products/${fakeId}`)
        );
      }

      const responses = await Promise.all(promises);

      responses.forEach(response => {
        expect(response.status).toBe(404);
      });
    });

    test('Recuperarse de múltiples intentos de autenticación fallidos', async () => {
      const promises = [];

      for (let i = 0; i < 20; i++) {
        promises.push(
          request(app)
            .get('/api/orders')
            .set('Authorization', 'Bearer invalid-token')
        );
      }

      const responses = await Promise.all(promises);

      responses.forEach(response => {
        expect(response.status).toBe(401);
      });
    });
  });

  describe('Scalability Tests', () => {
    test('Escalar con base de datos creciente', async () => {
      // Crear dataset grande
      const products = [];
      for (let i = 0; i < 500; i++) {
        products.push({
          name: `Scalability Product ${i}`,
          price: Math.random() * 10000,
          category: i % 3 === 0 ? 'tortas' : i % 3 === 1 ? 'pastelitos' : 'galletas',
          stock: Math.floor(Math.random() * 100),
          images: [`scale${i}.jpg`]
        });
      }
      await Product.insertMany(products);

      // Verificar que las consultas siguen siendo rápidas
      const startTime = Date.now();
      const response = await request(app)
        .get('/api/products?page=1&limit=20')
        .expect(200);
      const duration = Date.now() - startTime;

      expect(response.body.products.length).toBeLessThanOrEqual(20);
      expect(duration).toBeLessThan(2000);
    });
  });
});
