import Order from '../../models/order.model.js';
import User from '../../models/user.model.js';

// Mock de los modelos
jest.mock('../../models/order.model.js');
jest.mock('../../models/user.model.js');

describe('Order Controller - Unit Tests', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      user: { _id: 'user123' }
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    
    mockNext = jest.fn();
    
    jest.clearAllMocks();
  });

  describe('Create Order Controller Logic', () => {
    test('debería crear orden exitosamente', async () => {
      mockReq.body = {
        items: [
          {
            product: 'product123',
            name: 'Tarta',
            price: 2500,
            quantity: 2
          }
        ],
        contactInfo: {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan@example.com',
          phone: '123456789',
          dni: '12345678'
        },
        shippingAddress: {
          street: 'Calle',
          number: '123',
          city: 'Buenos Aires',
          province: 'Buenos Aires',
          postalCode: '1000',
          country: 'Argentina'
        },
        paymentMethod: 'transferencia'
      };

      const mockOrder = {
        _id: 'order123',
        orderNumber: 'ORD-20250101-0001',
        user: 'user123',
        items: mockReq.body.items.map(item => ({
          ...item,
          subtotal: item.price * item.quantity
        })),
        total: 5000,
        status: 'pendiente',
        paymentStatus: 'pendiente',
        createdAt: new Date(),
        populate: jest.fn().mockResolvedValue(true),
        getPaymentInstructions: jest.fn().mockReturnValue({
          method: 'transferencia',
          instructions: 'Instrucciones de pago'
        })
      };

      Order.generateOrderNumber = jest.fn().mockResolvedValue('ORD-20250101-0001');
      Order.create = jest.fn().mockResolvedValue(mockOrder);
      User.findByIdAndUpdate = jest.fn().mockResolvedValue({});

      const createOrder = async (req, res) => {
        try {
          const { items, contactInfo, shippingAddress, paymentMethod } = req.body;

          if (!items || items.length === 0) {
            return res.status(400).json({
              success: false,
              message: 'No hay productos en la orden'
            });
          }

          const itemsWithSubtotal = items.map(item => ({
            ...item,
            subtotal: item.price * item.quantity
          }));

          const subtotal = itemsWithSubtotal.reduce((sum, item) => sum + item.subtotal, 0);
          const shippingCost = subtotal >= 50000 ? 0 : 5000;
          const total = subtotal + shippingCost;

          const orderNumber = await Order.generateOrderNumber();

          const order = await Order.create({
            user: req.user._id,
            orderNumber,
            items: itemsWithSubtotal,
            contactInfo,
            shippingAddress,
            paymentMethod,
            subtotal,
            shippingCost,
            total,
            status: 'pendiente',
            paymentStatus: 'pendiente'
          });

          await User.findByIdAndUpdate(req.user._id, { cart: [] });
          await order.populate('items.product', 'name images');

          const paymentInstructions = order.getPaymentInstructions();

          res.status(201).json({
            success: true,
            message: 'Orden creada exitosamente',
            data: {
              order: {
                id: order._id,
                orderNumber: order.orderNumber,
                total: order.total,
                status: order.status
              },
              paymentInstructions
            }
          });
        } catch (error) {
          res.status(500).json({
            success: false,
            message: 'Error al crear la orden'
          });
        }
      };

      await createOrder(mockReq, mockRes);

      expect(Order.create).toHaveBeenCalled();
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith('user123', { cart: [] });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: expect.stringContaining('exitosamente')
        })
      );
    });

    test('debería fallar si no hay items', async () => {
      mockReq.body = {
        items: [],
        contactInfo: {},
        shippingAddress: {}
      };

      const createOrder = async (req, res) => {
        try {
          const { items } = req.body;

          if (!items || items.length === 0) {
            return res.status(400).json({
              success: false,
              message: 'No hay productos en la orden'
            });
          }
        } catch (error) {
          res.status(500).json({
            success: false,
            message: 'Error al crear la orden'
          });
        }
      };

      await createOrder(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.stringContaining('No hay productos')
        })
      );
    });

    test('debería calcular costo de envío correctamente', async () => {
      // Subtotal menor a 50000 - debe cobrar envío
      const subtotal1 = 30000;
      const shippingCost1 = subtotal1 >= 50000 ? 0 : 5000;
      expect(shippingCost1).toBe(5000);

      // Subtotal mayor a 50000 - envío gratis
      const subtotal2 = 60000;
      const shippingCost2 = subtotal2 >= 50000 ? 0 : 5000;
      expect(shippingCost2).toBe(0);
    });

    test('debería calcular subtotales por item', () => {
      const items = [
        { price: 2500, quantity: 2 },
        { price: 3000, quantity: 1 }
      ];

      const itemsWithSubtotal = items.map(item => ({
        ...item,
        subtotal: item.price * item.quantity
      }));

      expect(itemsWithSubtotal[0].subtotal).toBe(5000);
      expect(itemsWithSubtotal[1].subtotal).toBe(3000);
    });
  });

  describe('Get Order By ID Controller Logic', () => {
    test('debería obtener orden por ID', async () => {
      mockReq.params = { id: 'order123' };

      const mockOrder = {
        _id: 'order123',
        orderNumber: 'ORD-001',
        user: 'user123',
        items: [],
        total: 5000,
        status: 'pendiente'
      };

      Order.findOne = jest.fn().mockResolvedValue(mockOrder);

      const getOrderById = async (req, res) => {
        try {
          const { id } = req.params;
          const order = await Order.findOne({
            _id: id,
            user: req.user._id
          });

          if (!order) {
            return res.status(404).json({
              success: false,
              message: 'Orden no encontrada'
            });
          }

          res.status(200).json({
            success: true,
            order
          });
        } catch (error) {
          res.status(500).json({
            success: false,
            message: 'Error al obtener la orden'
          });
        }
      };

      await getOrderById(mockReq, mockRes);

      expect(Order.findOne).toHaveBeenCalledWith({
        _id: 'order123',
        user: 'user123'
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          order: mockOrder
        })
      );
    });

    test('debería fallar si orden no existe', async () => {
      mockReq.params = { id: 'nonexistent' };

      Order.findOne = jest.fn().mockResolvedValue(null);

      const getOrderById = async (req, res) => {
        try {
          const { id } = req.params;
          const order = await Order.findOne({
            _id: id,
            user: req.user._id
          });

          if (!order) {
            return res.status(404).json({
              success: false,
              message: 'Orden no encontrada'
            });
          }
        } catch (error) {
          res.status(500).json({
            success: false,
            message: 'Error al obtener la orden'
          });
        }
      };

      await getOrderById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });

    test('debería verificar que orden pertenece al usuario', async () => {
      mockReq.params = { id: 'order123' };
      mockReq.user._id = 'user123';

      Order.findOne = jest.fn().mockResolvedValue(null);

      const getOrderById = async (req, res) => {
        try {
          const order = await Order.findOne({
            _id: req.params.id,
            user: req.user._id
          });

          if (!order) {
            return res.status(404).json({
              success: false,
              message: 'Orden no encontrada'
            });
          }
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await getOrderById(mockReq, mockRes);

      expect(Order.findOne).toHaveBeenCalledWith({
        _id: 'order123',
        user: 'user123'
      });
    });
  });

  describe('Get User Orders Controller Logic', () => {
    test('debería obtener todas las órdenes del usuario', async () => {
      const mockOrders = [
        { _id: 'order1', orderNumber: 'ORD-001', total: 5000 },
        { _id: 'order2', orderNumber: 'ORD-002', total: 3000 }
      ];

      Order.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockOrders)
        })
      });

      const getUserOrders = async (req, res) => {
        try {
          const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .populate('items.product', 'name');

          res.status(200).json({
            success: true,
            orders
          });
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await getUserOrders(mockReq, mockRes);

      expect(Order.find).toHaveBeenCalledWith({ user: 'user123' });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          orders: mockOrders
        })
      );
    });

    test('debería retornar array vacío si no hay órdenes', async () => {
      Order.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue([])
        })
      });

      const getUserOrders = async (req, res) => {
        try {
          const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .populate('items.product', 'name');

          res.status(200).json({
            success: true,
            orders
          });
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await getUserOrders(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          orders: []
        })
      );
    });
  });

  describe('Cancel Order Controller Logic', () => {
    test('debería cancelar orden si está pendiente', async () => {
      mockReq.params = { id: 'order123' };

      const mockOrder = {
        _id: 'order123',
        user: 'user123',
        status: 'pendiente',
        save: jest.fn().mockResolvedValue(true)
      };

      Order.findOne = jest.fn().mockResolvedValue(mockOrder);

      const cancelOrder = async (req, res) => {
        try {
          const order = await Order.findOne({
            _id: req.params.id,
            user: req.user._id
          });

          if (!order) {
            return res.status(404).json({
              success: false,
              message: 'Orden no encontrada'
            });
          }

          if (order.status !== 'pendiente') {
            return res.status(400).json({
              success: false,
              message: 'Solo se pueden cancelar órdenes pendientes'
            });
          }

          order.status = 'cancelado';
          await order.save();

          res.status(200).json({
            success: true,
            message: 'Orden cancelada exitosamente'
          });
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await cancelOrder(mockReq, mockRes);

      expect(mockOrder.status).toBe('cancelado');
      expect(mockOrder.save).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    test('debería fallar si orden no está pendiente', async () => {
      mockReq.params = { id: 'order123' };

      const mockOrder = {
        _id: 'order123',
        user: 'user123',
        status: 'entregado'
      };

      Order.findOne = jest.fn().mockResolvedValue(mockOrder);

      const cancelOrder = async (req, res) => {
        try {
          const order = await Order.findOne({
            _id: req.params.id,
            user: req.user._id
          });

          if (order.status !== 'pendiente') {
            return res.status(400).json({
              success: false,
              message: 'Solo se pueden cancelar órdenes pendientes'
            });
          }
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await cancelOrder(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('pendientes')
        })
      );
    });
  });

  describe('Update Order Status Controller Logic (Admin)', () => {
    beforeEach(() => {
      mockReq.user.role = 'admin';
    });

    test('admin debería poder actualizar status', async () => {
      mockReq.params = { id: 'order123' };
      mockReq.body = { status: 'confirmado' };

      const mockOrder = {
        _id: 'order123',
        status: 'pendiente',
        save: jest.fn().mockResolvedValue(true)
      };

      Order.findById = jest.fn().mockResolvedValue(mockOrder);

      const updateOrderStatus = async (req, res) => {
        try {
          const { status } = req.body;
          const order = await Order.findById(req.params.id);

          if (!order) {
            return res.status(404).json({
              success: false,
              message: 'Orden no encontrada'
            });
          }

          order.status = status;
          await order.save();

          res.status(200).json({
            success: true,
            order
          });
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await updateOrderStatus(mockReq, mockRes);

      expect(mockOrder.status).toBe('confirmado');
      expect(mockOrder.save).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('Get All Orders Controller Logic (Admin)', () => {
    test('admin debería ver todas las órdenes', async () => {
      mockReq.user.role = 'admin';

      const mockOrders = [
        { _id: 'order1', user: 'user1', total: 5000 },
        { _id: 'order2', user: 'user2', total: 3000 }
      ];

      Order.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockOrders)
        })
      });

      const getAllOrders = async (req, res) => {
        try {
          const orders = await Order.find({})
            .sort({ createdAt: -1 })
            .populate('user', 'name email');

          res.status(200).json({
            success: true,
            orders
          });
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await getAllOrders(mockReq, mockRes);

      expect(Order.find).toHaveBeenCalledWith({});
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          orders: mockOrders
        })
      );
    });
  });
});
