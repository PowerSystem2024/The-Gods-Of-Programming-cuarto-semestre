import request from 'supertest';
import express from 'express';
import productRoutes from '../../routes/product.routes.js';
import authRoutes from '../../routes/auth.routes.js';
import Product from '../../models/product.model.js';
import User from '../../models/user.model.js';

const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  return app;
};

describe('Product Routes - Integration Tests', () => {
  let app;
  let userToken;
  let adminToken;

  beforeEach(async () => {
    app = createTestApp();

    // Crear usuario normal
    await User.create({
      name: 'Normal User',
      email: 'user@example.com',
      password: 'password123',
      role: 'customer'
    });

    // Crear admin
    await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });

    // Obtener tokens
    const userLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'password123' });
    userToken = userLogin.body.token;

    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'password123' });
    adminToken = adminLogin.body.token;
  });

  describe('GET /api/products', () => {
    beforeEach(async () => {
      await Product.create([
        {
          name: 'Tarta de Frutilla',
          description: 'Deliciosa tarta',
          price: 2500,
          category: 'tartas',
          stock: 10
        },
        {
          name: 'Torta de Chocolate',
          description: 'Rica torta',
          price: 3000,
          category: 'tortas',
          stock: 5
        },
        {
          name: 'Brownie',
          description: 'Brownie casero',
          price: 800,
          category: 'brownies',
          stock: 20
        }
      ]);
    });

    test('debería obtener todos los productos', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.products).toBeDefined();
      expect(response.body.products.length).toBe(3);
    });

    test('debería filtrar por categoría', async () => {
      const response = await request(app)
        .get('/api/products?category=tartas')
        .expect(200);

      expect(response.body.products.length).toBe(1);
      expect(response.body.products[0].category).toBe('tartas');
    });

    test('debería buscar por nombre', async () => {
      const response = await request(app)
        .get('/api/products?search=chocolate')
        .expect(200);

      expect(response.body.products.length).toBe(1);
      expect(response.body.products[0].name).toContain('Chocolate');
    });

    test('debería filtrar por rango de precio', async () => {
      const response = await request(app)
        .get('/api/products?minPrice=1000&maxPrice=3000')
        .expect(200);

      expect(response.body.products.length).toBe(1);
      expect(response.body.products[0].price).toBe(2500);
    });

    test('debería ordenar productos', async () => {
      const response = await request(app)
        .get('/api/products?sort=price')
        .expect(200);

      const prices = response.body.products.map(p => p.price);
      expect(prices).toEqual([800, 2500, 3000]); // Ordenado ascendente
    });

    test('debería paginar resultados', async () => {
      const response = await request(app)
        .get('/api/products?page=1&limit=2')
        .expect(200);

      expect(response.body.products.length).toBe(2);
      expect(response.body.pagination).toBeDefined();
      expect(response.body.pagination.total).toBe(3);
    });
  });

  describe('GET /api/products/:id', () => {
    let productId;

    beforeEach(async () => {
      const product = await Product.create({
        name: 'Tarta Especial',
        description: 'Tarta única',
        price: 3500,
        category: 'tartas',
        stock: 8
      });
      productId = product._id;
    });

    test('debería obtener producto por ID', async () => {
      const response = await request(app)
        .get(`/api/products/${productId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.product).toBeDefined();
      expect(response.body.product.name).toBe('Tarta Especial');
    });

    test('debería fallar con ID inválido', async () => {
      const response = await request(app)
        .get('/api/products/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    test('debería fallar si producto no existe', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/api/products/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/products', () => {
    test('admin debería poder crear producto', async () => {
      const newProduct = {
        name: 'Nueva Tarta',
        description: 'Descripción',
        price: 2000,
        category: 'tartas',
        stock: 15
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newProduct)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.product).toBeDefined();
      expect(response.body.product.name).toBe('Nueva Tarta');
    });

    test('usuario normal no debería poder crear producto', async () => {
      const newProduct = {
        name: 'Nueva Tarta',
        description: 'Descripción',
        price: 2000,
        category: 'tartas',
        stock: 15
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newProduct)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    test('debería fallar sin autenticación', async () => {
      const response = await request(app)
        .post('/api/products')
        .send({})
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    test('debería validar campos requeridos', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    test('debería validar precio positivo', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test',
          description: 'Test',
          price: -100,
          category: 'tortas',
          stock: 10
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/products/:id', () => {
    let productId;

    beforeEach(async () => {
      const product = await Product.create({
        name: 'Producto Original',
        description: 'Descripción',
        price: 1500,
        category: 'tortas',
        stock: 10
      });
      productId = product._id;
    });

    test('admin debería poder actualizar producto', async () => {
      const response = await request(app)
        .put(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Producto Actualizado',
          price: 2000
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.product.name).toBe('Producto Actualizado');
      expect(response.body.product.price).toBe(2000);
    });

    test('usuario normal no debería poder actualizar', async () => {
      const response = await request(app)
        .put(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Intento Actualizar' })
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    test('debería fallar con ID inválido', async () => {
      const response = await request(app)
        .put('/api/products/invalid-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Test' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/products/:id', () => {
    let productId;

    beforeEach(async () => {
      const product = await Product.create({
        name: 'Producto a Eliminar',
        description: 'Test',
        price: 1000,
        category: 'tortas',
        stock: 5
      });
      productId = product._id;
    });

    test('admin debería poder eliminar producto', async () => {
      const response = await request(app)
        .delete(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verificar que fue eliminado
      const deleted = await Product.findById(productId);
      expect(deleted).toBeNull();
    });

    test('usuario normal no debería poder eliminar', async () => {
      const response = await request(app)
        .delete(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);

      // Verificar que no fue eliminado
      const product = await Product.findById(productId);
      expect(product).not.toBeNull();
    });

    test('debería fallar sin autenticación', async () => {
      const response = await request(app)
        .delete(`/api/products/${productId}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /api/products/:id/stock', () => {
    let productId;

    beforeEach(async () => {
      const product = await Product.create({
        name: 'Producto Stock',
        description: 'Test',
        price: 1000,
        category: 'tortas',
        stock: 10
      });
      productId = product._id;
    });

    test('admin debería poder actualizar stock', async () => {
      const response = await request(app)
        .patch(`/api/products/${productId}/stock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ stock: 20 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.product.stock).toBe(20);
    });

    test('no debería permitir stock negativo', async () => {
      const response = await request(app)
        .patch(`/api/products/${productId}/stock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ stock: -5 })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/products/category/:category', () => {
    beforeEach(async () => {
      await Product.create([
        { name: 'Tarta 1', description: 'Test', price: 2000, category: 'tartas', stock: 10 },
        { name: 'Tarta 2', description: 'Test', price: 2500, category: 'tartas', stock: 5 },
        { name: 'Torta 1', description: 'Test', price: 3000, category: 'tortas', stock: 8 }
      ]);
    });

    test('debería obtener productos por categoría', async () => {
      const response = await request(app)
        .get('/api/products/category/tartas')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.products.length).toBe(2);
      expect(response.body.products.every(p => p.category === 'tartas')).toBe(true);
    });

    test('debería devolver array vacío si no hay productos', async () => {
      const response = await request(app)
        .get('/api/products/category/galletas')
        .expect(200);

      expect(response.body.products.length).toBe(0);
    });
  });
});
