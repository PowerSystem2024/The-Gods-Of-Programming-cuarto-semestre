import request from 'supertest';
import express from 'express';
import cartRoutes from '../../routes/cart.routes.js';
import authRoutes from '../../routes/auth.routes.js';
import Product from '../../models/product.model.js';
import User from '../../models/user.model.js';

const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/auth', authRoutes);
  app.use('/api/cart', cartRoutes);
  return app;
};

describe('Cart Routes - Integration Tests', () => {
  let app;
  let userToken;
  let userId;
  let product1;
  let product2;

  beforeEach(async () => {
    app = createTestApp();

    // Crear usuario
    const user = await User.create({
      name: 'Test User',
      email: 'user@example.com',
      password: 'password123',
      role: 'customer'
    });
    userId = user._id;

    // Obtener token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'password123' });
    userToken = loginResponse.body.token;

    // Crear productos de prueba
    product1 = await Product.create({
      name: 'Tarta de Frutilla',
      description: 'Deliciosa tarta',
      price: 2500,
      category: 'tartas',
      stock: 10
    });

    product2 = await Product.create({
      name: 'Torta de Chocolate',
      description: 'Rica torta',
      price: 3000,
      category: 'tortas',
      stock: 5
    });
  });

  describe('GET /api/cart', () => {
    test('debería obtener carrito vacío inicialmente', async () => {
      const response = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.cart).toBeDefined();
      expect(response.body.cart.items).toEqual([]);
      expect(response.body.cart.total).toBe(0);
    });

    test('debería fallar sin autenticación', async () => {
      const response = await request(app)
        .get('/api/cart')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/cart/add', () => {
    test('debería agregar producto al carrito', async () => {
      const response = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: product1._id.toString(),
          quantity: 2
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.cart.items.length).toBe(1);
      expect(response.body.cart.items[0].product.toString()).toBe(product1._id.toString());
      expect(response.body.cart.items[0].quantity).toBe(2);
      expect(response.body.cart.total).toBe(5000); // 2500 * 2
    });

    test('debería incrementar cantidad si producto ya existe', async () => {
      // Agregar primera vez
      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId: product1._id.toString(), quantity: 2 });

      // Agregar segunda vez
      const response = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId: product1._id.toString(), quantity: 3 })
        .expect(200);

      expect(response.body.cart.items.length).toBe(1);
      expect(response.body.cart.items[0].quantity).toBe(5); // 2 + 3
      expect(response.body.cart.total).toBe(12500); // 2500 * 5
    });

    test('debería permitir múltiples productos diferentes', async () => {
      // Agregar producto 1
      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId: product1._id.toString(), quantity: 2 });

      // Agregar producto 2
      const response = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId: product2._id.toString(), quantity: 1 })
        .expect(200);

      expect(response.body.cart.items.length).toBe(2);
      expect(response.body.cart.total).toBe(8000); // (2500*2) + (3000*1)
    });

    test('debería fallar con productId inválido', async () => {
      const response = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId: 'invalid-id', quantity: 1 })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    test('debería fallar si producto no existe', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId: fakeId, quantity: 1 })
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    test('debería fallar si cantidad es 0 o negativa', async () => {
      const response = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId: product1._id.toString(), quantity: 0 })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    test('debería fallar si cantidad excede stock', async () => {
      const response = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId: product1._id.toString(), quantity: 100 })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('stock');
    });

    test('debería fallar sin autenticación', async () => {
      const response = await request(app)
        .post('/api/cart/add')
        .send({ productId: product1._id.toString(), quantity: 1 })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/cart/update', () => {
    beforeEach(async () => {
      // Agregar producto al carrito
      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId: product1._id.toString(), quantity: 3 });
    });

    test('debería actualizar cantidad de producto', async () => {
      const response = await request(app)
        .put('/api/cart/update')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: product1._id.toString(),
          quantity: 5
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.cart.items[0].quantity).toBe(5);
      expect(response.body.cart.total).toBe(12500); // 2500 * 5
    });

    test('debería eliminar producto si quantity es 0', async () => {
      const response = await request(app)
        .put('/api/cart/update')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: product1._id.toString(),
          quantity: 0
        })
        .expect(200);

      expect(response.body.cart.items.length).toBe(0);
      expect(response.body.cart.total).toBe(0);
    });

    test('debería fallar si producto no está en carrito', async () => {
      const response = await request(app)
        .put('/api/cart/update')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: product2._id.toString(),
          quantity: 2
        })
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    test('debería fallar si cantidad excede stock', async () => {
      const response = await request(app)
        .put('/api/cart/update')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: product1._id.toString(),
          quantity: 100
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/cart/remove/:productId', () => {
    beforeEach(async () => {
      // Agregar productos al carrito
      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId: product1._id.toString(), quantity: 2 });

      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId: product2._id.toString(), quantity: 1 });
    });

    test('debería eliminar producto del carrito', async () => {
      const response = await request(app)
        .delete(`/api/cart/remove/${product1._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.cart.items.length).toBe(1);
      expect(response.body.cart.items[0].product.toString()).toBe(product2._id.toString());
      expect(response.body.cart.total).toBe(3000);
    });

    test('debería fallar si producto no está en carrito', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .delete(`/api/cart/remove/${fakeId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    test('debería fallar con ID inválido', async () => {
      const response = await request(app)
        .delete('/api/cart/remove/invalid-id')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/cart/clear', () => {
    beforeEach(async () => {
      // Agregar múltiples productos
      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId: product1._id.toString(), quantity: 2 });

      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId: product2._id.toString(), quantity: 3 });
    });

    test('debería vaciar el carrito completamente', async () => {
      const response = await request(app)
        .delete('/api/cart/clear')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.cart.items).toEqual([]);
      expect(response.body.cart.total).toBe(0);
    });

    test('debería funcionar con carrito ya vacío', async () => {
      // Vaciar primero
      await request(app)
        .delete('/api/cart/clear')
        .set('Authorization', `Bearer ${userToken}`);

      // Vaciar de nuevo
      const response = await request(app)
        .delete('/api/cart/clear')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/cart/count', () => {
    test('debería devolver 0 para carrito vacío', async () => {
      const response = await request(app)
        .get('/api/cart/count')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(0);
    });

    test('debería contar items en carrito', async () => {
      // Agregar productos
      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId: product1._id.toString(), quantity: 2 });

      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId: product2._id.toString(), quantity: 3 });

      const response = await request(app)
        .get('/api/cart/count')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.count).toBe(5); // 2 + 3
    });
  });

  describe('Validaciones de stock en tiempo real', () => {
    test('debería fallar si stock cambia después de agregar', async () => {
      // Agregar al carrito
      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId: product1._id.toString(), quantity: 5 });

      // Simular que se vendió stock
      await Product.findByIdAndUpdate(product1._id, { stock: 3 });

      // Intentar actualizar a más de lo disponible
      const response = await request(app)
        .put('/api/cart/update')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId: product1._id.toString(), quantity: 8 })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('stock');
    });

    test('debería validar stock al obtener carrito', async () => {
      // Agregar productos
      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId: product1._id.toString(), quantity: 5 });

      // Reducir stock disponible
      await Product.findByIdAndUpdate(product1._id, { stock: 2 });

      const response = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      // Debería indicar problema de stock
      expect(response.body.stockIssues).toBeDefined();
    });
  });
});
