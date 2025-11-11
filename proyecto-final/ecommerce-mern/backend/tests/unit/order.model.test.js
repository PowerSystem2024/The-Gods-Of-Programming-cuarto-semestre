import Order from '../../models/order.model.js';
import User from '../../models/user.model.js';
import Product from '../../models/product.model.js';

describe('Order Model - Unit Tests', () => {
  describe('Order Creation', () => {
    test('debería crear orden con todos los campos requeridos', async () => {
      const orderData = {
        user: '507f1f77bcf86cd799439011',
        orderNumber: 'ORD-20250101-0001',
        items: [{
          product: '507f1f77bcf86cd799439012',
          name: 'Tarta de Frutilla',
          price: 2500,
          quantity: 2,
          subtotal: 5000
        }],
        contactInfo: {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan@example.com',
          phone: '1234567890',
          dni: '12345678'
        },
        shippingAddress: {
          street: 'Calle Falsa',
          number: '123',
          city: 'Buenos Aires',
          province: 'Buenos Aires',
          postalCode: '1000',
          country: 'Argentina'
        },
        paymentMethod: 'transferencia',
        subtotal: 5000,
        shippingCost: 0,
        total: 5000
      };

      const order = await Order.create(orderData);

      expect(order).toBeDefined();
      expect(order.orderNumber).toBe('ORD-20250101-0001');
      expect(order.items.length).toBe(1);
      expect(order.total).toBe(5000);
      expect(order.status).toBe('pendiente');
      expect(order.paymentStatus).toBe('pendiente');
    });

    test('debería fallar sin user', async () => {
      const orderData = {
        orderNumber: 'ORD-20250101-0001',
        items: [],
        contactInfo: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          phone: '123456',
          dni: '12345678'
        },
        shippingAddress: {
          street: 'Street',
          number: '123',
          city: 'City',
          province: 'Province',
          postalCode: '1000',
          country: 'Country'
        },
        total: 1000
      };

      await expect(Order.create(orderData)).rejects.toThrow();
    });

    test('debería fallar sin orderNumber', async () => {
      const orderData = {
        user: '507f1f77bcf86cd799439011',
        items: [],
        contactInfo: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          phone: '123456',
          dni: '12345678'
        },
        shippingAddress: {
          street: 'Street',
          number: '123',
          city: 'City',
          province: 'Province',
          postalCode: '1000',
          country: 'Country'
        },
        total: 1000
      };

      await expect(Order.create(orderData)).rejects.toThrow();
    });

    test('debería fallar sin items', async () => {
      const orderData = {
        user: '507f1f77bcf86cd799439011',
        orderNumber: 'ORD-20250101-0001',
        contactInfo: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          phone: '123456',
          dni: '12345678'
        },
        shippingAddress: {
          street: 'Street',
          number: '123',
          city: 'City',
          province: 'Province',
          postalCode: '1000',
          country: 'Country'
        },
        total: 1000
      };

      await expect(Order.create(orderData)).rejects.toThrow();
    });

    test('debería validar orderNumber único', async () => {
      const orderData = {
        user: '507f1f77bcf86cd799439011',
        orderNumber: 'ORD-UNIQUE-001',
        items: [{
          product: '507f1f77bcf86cd799439012',
          name: 'Test',
          price: 1000,
          quantity: 1,
          subtotal: 1000
        }],
        contactInfo: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          phone: '123456',
          dni: '12345678'
        },
        shippingAddress: {
          street: 'Street',
          number: '123',
          city: 'City',
          province: 'Province',
          postalCode: '1000',
          country: 'Country'
        },
        total: 1000
      };

      await Order.create(orderData);
      
      // Intentar crear otra orden con el mismo número
      await expect(Order.create(orderData)).rejects.toThrow();
    });
  });

  describe('Order Items Validation', () => {
    test('debería validar quantity mínima en items', async () => {
      const orderData = {
        user: '507f1f77bcf86cd799439011',
        orderNumber: 'ORD-20250101-0002',
        items: [{
          product: '507f1f77bcf86cd799439012',
          name: 'Test',
          price: 1000,
          quantity: 0, // inválido
          subtotal: 0
        }],
        contactInfo: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          phone: '123456',
          dni: '12345678'
        },
        shippingAddress: {
          street: 'Street',
          number: '123',
          city: 'City',
          province: 'Province',
          postalCode: '1000',
          country: 'Country'
        },
        total: 0
      };

      await expect(Order.create(orderData)).rejects.toThrow();
    });

    test('debería permitir múltiples items', async () => {
      const orderData = {
        user: '507f1f77bcf86cd799439011',
        orderNumber: 'ORD-20250101-0003',
        items: [
          {
            product: '507f1f77bcf86cd799439012',
            name: 'Item 1',
            price: 1000,
            quantity: 2,
            subtotal: 2000
          },
          {
            product: '507f1f77bcf86cd799439013',
            name: 'Item 2',
            price: 1500,
            quantity: 1,
            subtotal: 1500
          }
        ],
        contactInfo: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          phone: '123456',
          dni: '12345678'
        },
        shippingAddress: {
          street: 'Street',
          number: '123',
          city: 'City',
          province: 'Province',
          postalCode: '1000',
          country: 'Country'
        },
        subtotal: 3500,
        total: 3500
      };

      const order = await Order.create(orderData);

      expect(order.items.length).toBe(2);
      expect(order.subtotal).toBe(3500);
    });
  });

  describe('Contact Info Validation', () => {
    test('debería requerir firstName', async () => {
      const orderData = {
        user: '507f1f77bcf86cd799439011',
        orderNumber: 'ORD-20250101-0004',
        items: [{
          product: '507f1f77bcf86cd799439012',
          name: 'Test',
          price: 1000,
          quantity: 1,
          subtotal: 1000
        }],
        contactInfo: {
          // falta firstName
          lastName: 'User',
          email: 'test@example.com',
          phone: '123456',
          dni: '12345678'
        },
        shippingAddress: {
          street: 'Street',
          number: '123',
          city: 'City',
          province: 'Province',
          postalCode: '1000',
          country: 'Country'
        },
        total: 1000
      };

      await expect(Order.create(orderData)).rejects.toThrow();
    });

    test('debería convertir email a minúsculas', async () => {
      const orderData = {
        user: '507f1f77bcf86cd799439011',
        orderNumber: 'ORD-20250101-0005',
        items: [{
          product: '507f1f77bcf86cd799439012',
          name: 'Test',
          price: 1000,
          quantity: 1,
          subtotal: 1000
        }],
        contactInfo: {
          firstName: 'Test',
          lastName: 'User',
          email: 'TEST@EXAMPLE.COM',
          phone: '123456',
          dni: '12345678'
        },
        shippingAddress: {
          street: 'Street',
          number: '123',
          city: 'City',
          province: 'Province',
          postalCode: '1000',
          country: 'Country'
        },
        total: 1000
      };

      const order = await Order.create(orderData);

      expect(order.contactInfo.email).toBe('test@example.com');
    });
  });

  describe('Order Status', () => {
    test('debería tener status "pendiente" por defecto', async () => {
      const orderData = {
        user: '507f1f77bcf86cd799439011',
        orderNumber: 'ORD-20250101-0006',
        items: [{
          product: '507f1f77bcf86cd799439012',
          name: 'Test',
          price: 1000,
          quantity: 1,
          subtotal: 1000
        }],
        contactInfo: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          phone: '123456',
          dni: '12345678'
        },
        shippingAddress: {
          street: 'Street',
          number: '123',
          city: 'City',
          province: 'Province',
          postalCode: '1000',
          country: 'Country'
        },
        total: 1000
      };

      const order = await Order.create(orderData);

      expect(order.status).toBe('pendiente');
      expect(order.paymentStatus).toBe('pendiente');
    });

    test('debería aceptar status válidos', async () => {
      const validStatuses = ['pendiente', 'confirmado', 'en_preparacion', 'enviado', 'entregado', 'cancelado'];

      for (const status of validStatuses) {
        const orderData = {
          user: '507f1f77bcf86cd799439011',
          orderNumber: `ORD-STATUS-${status}`,
          items: [{
            product: '507f1f77bcf86cd799439012',
            name: 'Test',
            price: 1000,
            quantity: 1,
            subtotal: 1000
          }],
          contactInfo: {
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            phone: '123456',
            dni: '12345678'
          },
          shippingAddress: {
            street: 'Street',
            number: '123',
            city: 'City',
            province: 'Province',
            postalCode: '1000',
            country: 'Country'
          },
          status,
          total: 1000
        };

        const order = await Order.create(orderData);
        expect(order.status).toBe(status);
      }
    });
  });

  describe('Payment Methods', () => {
    test('debería aceptar métodos de pago válidos', async () => {
      const validMethods = ['transferencia', 'mercadopago', 'efectivo'];

      for (const method of validMethods) {
        const orderData = {
          user: '507f1f77bcf86cd799439011',
          orderNumber: `ORD-PAYMENT-${method}`,
          items: [{
            product: '507f1f77bcf86cd799439012',
            name: 'Test',
            price: 1000,
            quantity: 1,
            subtotal: 1000
          }],
          contactInfo: {
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            phone: '123456',
            dni: '12345678'
          },
          shippingAddress: {
            street: 'Street',
            number: '123',
            city: 'City',
            province: 'Province',
            postalCode: '1000',
            country: 'Country'
          },
          paymentMethod: method,
          total: 1000
        };

        const order = await Order.create(orderData);
        expect(order.paymentMethod).toBe(method);
      }
    });
  });

  describe('Order Queries', () => {
    beforeEach(async () => {
      await Order.create([
        {
          user: '507f1f77bcf86cd799439011',
          orderNumber: 'ORD-QUERY-001',
          items: [{
            product: '507f1f77bcf86cd799439012',
            name: 'Test',
            price: 1000,
            quantity: 1,
            subtotal: 1000
          }],
          contactInfo: {
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            phone: '123456',
            dni: '12345678'
          },
          shippingAddress: {
            street: 'Street',
            number: '123',
            city: 'City',
            province: 'Province',
            postalCode: '1000',
            country: 'Country'
          },
          status: 'pendiente',
          total: 1000
        },
        {
          user: '507f1f77bcf86cd799439011',
          orderNumber: 'ORD-QUERY-002',
          items: [{
            product: '507f1f77bcf86cd799439012',
            name: 'Test',
            price: 2000,
            quantity: 1,
            subtotal: 2000
          }],
          contactInfo: {
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            phone: '123456',
            dni: '12345678'
          },
          shippingAddress: {
            street: 'Street',
            number: '123',
            city: 'City',
            province: 'Province',
            postalCode: '1000',
            country: 'Country'
          },
          status: 'entregado',
          total: 2000
        }
      ]);
    });

    test('debería encontrar órdenes por usuario', async () => {
      const orders = await Order.find({ user: '507f1f77bcf86cd799439011' });

      expect(orders.length).toBeGreaterThanOrEqual(2);
    });

    test('debería filtrar por status', async () => {
      const orders = await Order.find({ status: 'pendiente' });

      expect(orders.length).toBeGreaterThan(0);
      expect(orders.every(o => o.status === 'pendiente')).toBe(true);
    });

    test('debería encontrar por orderNumber', async () => {
      const order = await Order.findOne({ orderNumber: 'ORD-QUERY-001' });

      expect(order).toBeDefined();
      expect(order.orderNumber).toBe('ORD-QUERY-001');
    });

    test('debería ordenar por fecha', async () => {
      const orders = await Order.find({}).sort({ createdAt: -1 });

      expect(orders.length).toBeGreaterThan(0);
      // Verificar que están ordenadas
      for (let i = 0; i < orders.length - 1; i++) {
        expect(orders[i].createdAt >= orders[i + 1].createdAt).toBe(true);
      }
    });
  });

  describe('Timestamps', () => {
    test('debería tener createdAt y updatedAt', async () => {
      const orderData = {
        user: '507f1f77bcf86cd799439011',
        orderNumber: 'ORD-TIMESTAMP-001',
        items: [{
          product: '507f1f77bcf86cd799439012',
          name: 'Test',
          price: 1000,
          quantity: 1,
          subtotal: 1000
        }],
        contactInfo: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          phone: '123456',
          dni: '12345678'
        },
        shippingAddress: {
          street: 'Street',
          number: '123',
          city: 'City',
          province: 'Province',
          postalCode: '1000',
          country: 'Country'
        },
        total: 1000
      };

      const order = await Order.create(orderData);

      expect(order.createdAt).toBeDefined();
      expect(order.updatedAt).toBeDefined();
    });

    test('debería actualizar updatedAt al modificar', async () => {
      const order = await Order.create({
        user: '507f1f77bcf86cd799439011',
        orderNumber: 'ORD-UPDATE-001',
        items: [{
          product: '507f1f77bcf86cd799439012',
          name: 'Test',
          price: 1000,
          quantity: 1,
          subtotal: 1000
        }],
        contactInfo: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          phone: '123456',
          dni: '12345678'
        },
        shippingAddress: {
          street: 'Street',
          number: '123',
          city: 'City',
          province: 'Province',
          postalCode: '1000',
          country: 'Country'
        },
        total: 1000
      });

      const originalUpdatedAt = order.updatedAt;

      // Esperar un poco y actualizar
      await new Promise(resolve => setTimeout(resolve, 10));
      order.status = 'confirmado';
      await order.save();

      expect(order.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });
});
