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

describe('Miscellaneous Integration Tests', () => {
  describe('HTTP Methods Compliance', () => {
    test('GET requests no deben modificar datos', async () => {
      const initialCount = await Product.countDocuments();

      await request(app).get('/api/products');

      const finalCount = await Product.countDocuments();
      expect(finalCount).toBe(initialCount);
    });

    test('POST debe crear recursos', async () => {
      const admin = await User.create({
        name: 'Admin',
        email: 'admin.http@test.com',
        password: 'Admin123!',
        role: 'admin'
      });

      const adminToken = jwt.sign(
        { id: admin._id, role: admin.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );

      const initialCount = await Product.countDocuments();

      await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'New Product',
          price: 1000,
          category: 'tortas',
          stock: 10,
          images: ['new.jpg']
        });

      const finalCount = await Product.countDocuments();
      expect(finalCount).toBe(initialCount + 1);
    });

    test('PUT debe actualizar recursos existentes', async () => {
      const admin = await User.create({
        name: 'Admin',
        email: 'admin.put@test.com',
        password: 'Admin123!',
        role: 'admin'
      });

      const adminToken = jwt.sign(
        { id: admin._id, role: admin.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );

      const product = await Product.create({
        name: 'Update Test',
        price: 1000,
        category: 'tortas',
        stock: 10,
        images: ['update.jpg']
      });

      await request(app)
        .put(`/api/products/${product._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: 2000 });

      const updated = await Product.findById(product._id);
      expect(updated.price).toBe(2000);
    });

    test('DELETE debe eliminar recursos', async () => {
      const admin = await User.create({
        name: 'Admin',
        email: 'admin.delete@test.com',
        password: 'Admin123!',
        role: 'admin'
      });

      const adminToken = jwt.sign(
        { id: admin._id, role: admin.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );

      const product = await Product.create({
        name: 'Delete Test',
        price: 1000,
        category: 'tortas',
        stock: 10,
        images: ['delete.jpg']
      });

      await request(app)
        .delete(`/api/products/${product._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      const deleted = await Product.findById(product._id);
      expect(deleted).toBeNull();
    });
  });

  describe('Error Responses Format', () => {
    test('Error 400 debe tener formato consistente', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: '',
          email: 'invalid',
          password: '123'
        })
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    test('Error 401 debe tener formato consistente', async () => {
      const response = await request(app)
        .get('/api/cart')
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    test('Error 403 debe tener formato consistente', async () => {
      const user = await User.create({
        name: 'User',
        email: 'error403@test.com',
        password: 'Password123!',
        role: 'user'
      });

      const userToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Forbidden',
          price: 1000,
          category: 'tortas',
          stock: 10,
          images: ['forbidden.jpg']
        })
        .expect(403);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    test('Error 404 debe tener formato consistente', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/products/${fakeId}`)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    test('Error 500 debe manejarse apropiadamente', async () => {
      // Intentar operación que podría causar error 500
      const response = await request(app)
        .get('/api/products/invalid-mongodb-id');

      expect([400, 500]).toContain(response.status);
      if (response.status === 500) {
        expect(response.body).toHaveProperty('success', false);
      }
    });
  });

  describe('Success Responses Format', () => {
    test('Respuesta exitosa debe tener success: true', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
    });

    test('Creación exitosa debe retornar 201', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Success User',
          email: 'success@test.com',
          password: 'Password123!'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
    });

    test('Actualización exitosa debe retornar 200', async () => {
      const admin = await User.create({
        name: 'Admin',
        email: 'admin.200@test.com',
        password: 'Admin123!',
        role: 'admin'
      });

      const adminToken = jwt.sign(
        { id: admin._id, role: admin.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );

      const product = await Product.create({
        name: 'Success Product',
        price: 1000,
        category: 'tortas',
        stock: 10,
        images: ['success.jpg']
      });

      const response = await request(app)
        .put(`/api/products/${product._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: 2000 });

      expect(response.status).toBe(200);
    });
  });

  describe('Content-Type Headers', () => {
    test('Respuesta debe ser JSON', async () => {
      const response = await request(app)
        .get('/api/products');

      expect(response.headers['content-type']).toContain('application/json');
    });

    test('POST debe aceptar JSON', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .set('Content-Type', 'application/json')
        .send({
          name: 'JSON User',
          email: 'json@test.com',
          password: 'Password123!'
        });

      expect([200, 201, 400]).toContain(response.status);
    });
  });

  describe('Idempotency Tests', () => {
    test('Múltiples GET deben retornar mismo resultado', async () => {
      const product = await Product.create({
        name: 'Idempotent Product',
        price: 1000,
        category: 'tortas',
        stock: 10,
        images: ['idem.jpg']
      });

      const response1 = await request(app).get(`/api/products/${product._id}`);
      const response2 = await request(app).get(`/api/products/${product._id}`);
      const response3 = await request(app).get(`/api/products/${product._id}`);

      expect(response1.body).toEqual(response2.body);
      expect(response2.body).toEqual(response3.body);
    });

    test('Múltiples DELETE del mismo recurso', async () => {
      const admin = await User.create({
        name: 'Admin',
        email: 'admin.idem@test.com',
        password: 'Admin123!',
        role: 'admin'
      });

      const adminToken = jwt.sign(
        { id: admin._id, role: admin.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );

      const product = await Product.create({
        name: 'Delete Twice',
        price: 1000,
        category: 'tortas',
        stock: 10,
        images: ['twice.jpg']
      });

      // Primera eliminación
      const response1 = await request(app)
        .delete(`/api/products/${product._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response1.status).toBe(200);

      // Segunda eliminación del mismo producto
      const response2 = await request(app)
        .delete(`/api/products/${product._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response2.status).toBe(404);
    });
  });

  describe('Query Parameters Handling', () => {
    beforeEach(async () => {
      await Product.create([
        { name: 'Producto A', price: 1000, category: 'tortas', stock: 10, images: ['a.jpg'] },
        { name: 'Producto B', price: 2000, category: 'pastelitos', stock: 5, images: ['b.jpg'] },
        { name: 'Producto C', price: 3000, category: 'tortas', stock: 8, images: ['c.jpg'] }
      ]);
    });

    test('Query string vacío debe retornar todos', async () => {
      const response = await request(app)
        .get('/api/products?')
        .expect(200);

      expect(response.body.products.length).toBeGreaterThan(0);
    });

    test('Parámetros desconocidos deben ser ignorados', async () => {
      const response = await request(app)
        .get('/api/products?unknownParam=value')
        .expect(200);

      expect(response.body.products).toBeDefined();
    });

    test('Múltiples filtros deben combinarse', async () => {
      const response = await request(app)
        .get('/api/products?category=tortas&minPrice=2000')
        .expect(200);

      response.body.products.forEach(product => {
        expect(product.category).toBe('tortas');
        expect(product.price).toBeGreaterThanOrEqual(2000);
      });
    });

    test('Valores numéricos en query string', async () => {
      const response = await request(app)
        .get('/api/products?page=1&limit=10')
        .expect(200);

      expect(response.body.products.length).toBeLessThanOrEqual(10);
    });

    test('Valores booleanos en query string', async () => {
      const response = await request(app)
        .get('/api/products?inStock=true')
        .expect(200);

      expect(response.body.products).toBeDefined();
    });
  });

  describe('URL Encoding Tests', () => {
    test('Caracteres especiales en búsqueda', async () => {
      await Product.create({
        name: 'Tarta @Special',
        price: 1000,
        category: 'tortas',
        stock: 10,
        images: ['special.jpg']
      });

      const response = await request(app)
        .get('/api/products?search=' + encodeURIComponent('@Special'))
        .expect(200);

      expect(response.body.products).toBeDefined();
    });

    test('Espacios en búsqueda', async () => {
      await Product.create({
        name: 'Tarta De Chocolate',
        price: 1000,
        category: 'tortas',
        stock: 10,
        images: ['chocolate.jpg']
      });

      const response = await request(app)
        .get('/api/products?search=' + encodeURIComponent('Tarta De'))
        .expect(200);

      expect(response.body.products).toBeDefined();
    });
  });

  describe('Pagination Edge Cases', () => {
    beforeEach(async () => {
      const products = [];
      for (let i = 0; i < 30; i++) {
        products.push({
          name: `Pagination Product ${i}`,
          price: i * 100,
          category: 'tortas',
          stock: 10,
          images: [`page${i}.jpg`]
        });
      }
      await Product.create(products);
    });

    test('Página 0 debe retornar primera página', async () => {
      const response = await request(app)
        .get('/api/products?page=0&limit=10')
        .expect(200);

      expect(response.body.products.length).toBeGreaterThan(0);
    });

    test('Página negativa debe manejarse', async () => {
      const response = await request(app)
        .get('/api/products?page=-1&limit=10')
        .expect(200);

      expect(response.body.products).toBeDefined();
    });

    test('Límite 0 debe manejarse', async () => {
      const response = await request(app)
        .get('/api/products?page=1&limit=0')
        .expect(200);

      expect(response.body.products).toBeDefined();
    });

    test('Límite muy grande debe limitarse', async () => {
      const response = await request(app)
        .get('/api/products?page=1&limit=10000')
        .expect(200);

      expect(response.body.products.length).toBeLessThan(10000);
    });

    test('Página más allá del final', async () => {
      const response = await request(app)
        .get('/api/products?page=999&limit=10')
        .expect(200);

      expect(response.body.products).toBeDefined();
    });
  });

  describe('Timestamps Tests', () => {
    test('Producto debe tener createdAt', async () => {
      const admin = await User.create({
        name: 'Admin',
        email: 'admin.timestamp@test.com',
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
          name: 'Timestamp Product',
          price: 1000,
          category: 'tortas',
          stock: 10,
          images: ['time.jpg']
        });

      const product = await Product.findById(response.body.product._id);
      expect(product.createdAt).toBeDefined();
    });

    test('Producto debe tener updatedAt', async () => {
      const admin = await User.create({
        name: 'Admin',
        email: 'admin.updated@test.com',
        password: 'Admin123!',
        role: 'admin'
      });

      const adminToken = jwt.sign(
        { id: admin._id, role: admin.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );

      const product = await Product.create({
        name: 'Update Time',
        price: 1000,
        category: 'tortas',
        stock: 10,
        images: ['update.jpg']
      });

      await new Promise(resolve => setTimeout(resolve, 100));

      await request(app)
        .put(`/api/products/${product._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: 2000 });

      const updated = await Product.findById(product._id);
      expect(updated.updatedAt.getTime()).toBeGreaterThan(updated.createdAt.getTime());
    });

    test('Orden debe tener timestamps', async () => {
      const user = await User.create({
        name: 'Order Time User',
        email: 'ordertime@test.com',
        password: 'Password123!'
      });

      const userToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );

      const product = await Product.create({
        name: 'Time Product',
        price: 10000,
        category: 'tortas',
        stock: 10,
        images: ['time.jpg']
      });

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          items: [
            {
              product: product._id,
              name: product.name,
              price: product.price,
              quantity: 1
            }
          ],
          contactInfo: {
            firstName: 'Time',
            lastName: 'User',
            email: 'time@test.com',
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
        });

      const order = await Order.findById(response.body.data.order.id);
      expect(order.createdAt).toBeDefined();
      expect(order.updatedAt).toBeDefined();
    });
  });

  describe('Data Consistency Tests', () => {
    test('Crear producto y verificar en BD', async () => {
      const admin = await User.create({
        name: 'Admin',
        email: 'admin.consistency@test.com',
        password: 'Admin123!',
        role: 'admin'
      });

      const adminToken = jwt.sign(
        { id: admin._id, role: admin.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );

      const productData = {
        name: 'Consistency Test',
        price: 1234,
        category: 'tortas',
        stock: 7,
        images: ['consist.jpg']
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(productData);

      const product = await Product.findById(response.body.product._id);

      expect(product.name).toBe(productData.name);
      expect(product.price).toBe(productData.price);
      expect(product.stock).toBe(productData.stock);
    });

    test('Actualizar y verificar cambios persistentes', async () => {
      const admin = await User.create({
        name: 'Admin',
        email: 'admin.persist@test.com',
        password: 'Admin123!',
        role: 'admin'
      });

      const adminToken = jwt.sign(
        { id: admin._id, role: admin.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );

      const product = await Product.create({
        name: 'Persist Test',
        price: 1000,
        category: 'tortas',
        stock: 10,
        images: ['persist.jpg']
      });

      await request(app)
        .put(`/api/products/${product._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          price: 5000,
          stock: 3
        });

      const updated = await Product.findById(product._id);
      expect(updated.price).toBe(5000);
      expect(updated.stock).toBe(3);
    });
  });

  describe('Concurrent Operations Tests', () => {
    test('Múltiples usuarios registrándose simultáneamente', async () => {
      const promises = [];

      for (let i = 0; i < 10; i++) {
        promises.push(
          request(app)
            .post('/api/auth/register')
            .send({
              name: `User ${i}`,
              email: `concurrent${i}@test.com`,
              password: 'Password123!'
            })
        );
      }

      const responses = await Promise.all(promises);

      const successCount = responses.filter(r => r.status === 201).length;
      expect(successCount).toBe(10);
    });

    test('Múltiples búsquedas simultáneas diferentes', async () => {
      await Product.create([
        { name: 'Alpha', price: 1000, category: 'tortas', stock: 10, images: ['a.jpg'] },
        { name: 'Beta', price: 2000, category: 'pastelitos', stock: 5, images: ['b.jpg'] },
        { name: 'Gamma', price: 3000, category: 'galletas', stock: 8, images: ['g.jpg'] }
      ]);

      const promises = [
        request(app).get('/api/products?search=Alpha'),
        request(app).get('/api/products?search=Beta'),
        request(app).get('/api/products?search=Gamma'),
        request(app).get('/api/products?category=tortas'),
        request(app).get('/api/products?minPrice=2000')
      ];

      const responses = await Promise.all(promises);

      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.products).toBeDefined();
      });
    });
  });

  describe('Special Characters Handling', () => {
    test('Nombre con acentos', async () => {
      const admin = await User.create({
        name: 'Admin',
        email: 'admin.accents@test.com',
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
          name: 'Tarta áéíóú ñ',
          price: 1000,
          category: 'tortas',
          stock: 10,
          images: ['accents.jpg']
        });

      expect([200, 201]).toContain(response.status);
    });

    test('Nombre con símbolos', async () => {
      const admin = await User.create({
        name: 'Admin',
        email: 'admin.symbols@test.com',
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
          name: 'Tarta & Pastel',
          price: 1000,
          category: 'tortas',
          stock: 10,
          images: ['symbols.jpg']
        });

      expect([200, 201]).toContain(response.status);
    });
  });

  describe('Empty Database Tests', () => {
    test('Listar productos en BD vacía', async () => {
      await Product.deleteMany({});

      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body.products).toBeDefined();
      expect(response.body.products.length).toBe(0);
    });

    test('Buscar en BD vacía', async () => {
      await Product.deleteMany({});

      const response = await request(app)
        .get('/api/products?search=anything')
        .expect(200);

      expect(response.body.products.length).toBe(0);
    });

    test('Obtener órdenes en BD vacía', async () => {
      const user = await User.create({
        name: 'Empty User',
        email: 'empty@test.com',
        password: 'Password123!'
      });

      const userToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );

      const response = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.orders.length).toBe(0);
    });
  });

  describe('Large Dataset Tests', () => {
    test('Manejar 1000 productos', async () => {
      const products = [];
      for (let i = 0; i < 1000; i++) {
        products.push({
          name: `Large Dataset Product ${i}`,
          price: Math.floor(Math.random() * 10000) + 1000,
          category: i % 2 === 0 ? 'tortas' : 'pastelitos',
          stock: Math.floor(Math.random() * 50) + 1,
          images: [`large${i}.jpg`]
        });
      }
      await Product.insertMany(products);

      const response = await request(app)
        .get('/api/products?page=1&limit=50')
        .expect(200);

      expect(response.body.products.length).toBeLessThanOrEqual(50);
    });
  });

  describe('Authentication Flow Tests', () => {
    test('Flujo completo: Registro → Login → Acceso Protegido', async () => {
      // Registro
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Flow User',
          email: 'flow@test.com',
          password: 'Password123!'
        })
        .expect(201);

      expect(registerResponse.body.token).toBeDefined();

      // Login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'flow@test.com',
          password: 'Password123!'
        })
        .expect(200);

      const token = loginResponse.body.token;

      // Acceder a ruta protegida
      const protectedResponse = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(protectedResponse.body.cart).toBeDefined();
    });

    test('Login con credenciales incorrectas', async () => {
      await User.create({
        name: 'Wrong Creds',
        email: 'wrong@test.com',
        password: 'CorrectPassword123!'
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@test.com',
          password: 'WrongPassword'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('Order Status Flow Tests', () => {
    test('Orden debe pasar por estados correctos', async () => {
      const admin = await User.create({
        name: 'Admin Flow',
        email: 'admin.flow@test.com',
        password: 'Admin123!',
        role: 'admin'
      });

      const adminToken = jwt.sign(
        { id: admin._id, role: admin.role },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );

      const user = await User.create({
        name: 'User Flow',
        email: 'user.flow@test.com',
        password: 'User123!'
      });

      const product = await Product.create({
        name: 'Flow Product',
        price: 10000,
        category: 'tortas',
        stock: 10,
        images: ['flow.jpg']
      });

      const order = await Order.create({
        user: user._id,
        orderNumber: 'ORD-FLOW-001',
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
          lastName: 'Flow',
          email: 'user.flow@test.com',
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

      const statuses = ['confirmado', 'en_preparacion', 'enviado', 'entregado'];

      for (const status of statuses) {
        await request(app)
          .put(`/api/orders/admin/${order._id}/status`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ status })
          .expect(200);

        const updated = await Order.findById(order._id);
        expect(updated.status).toBe(status);
      }
    });
  });
});
