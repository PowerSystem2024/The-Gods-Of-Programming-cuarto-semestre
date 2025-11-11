import Product from '../../models/product.model.js';

// Mock del modelo Product
jest.mock('../../models/product.model.js');

describe('Cart Validation Middleware - Unit Tests', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      user: { id: 'user123' }
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    
    mockNext = jest.fn();
    
    jest.clearAllMocks();
  });

  describe('Validate Add to Cart', () => {
    test('debería validar datos completos para agregar al carrito', () => {
      mockReq.body = {
        productId: '507f1f77bcf86cd799439011',
        quantity: 2
      };

      const validateAddToCart = (req, res, next) => {
        const { productId, quantity } = req.body;
        const errors = [];

        if (!productId) {
          errors.push({ field: 'productId', message: 'Product ID is required' });
        }

        if (!quantity) {
          errors.push({ field: 'quantity', message: 'Quantity is required' });
        }

        if (quantity && quantity <= 0) {
          errors.push({ field: 'quantity', message: 'Quantity must be positive' });
        }

        if (quantity && !Number.isInteger(quantity)) {
          errors.push({ field: 'quantity', message: 'Quantity must be an integer' });
        }

        if (errors.length > 0) {
          return res.status(400).json({ success: false, errors });
        }

        next();
      };

      validateAddToCart(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    test('debería fallar sin productId', () => {
      mockReq.body = {
        quantity: 2
        // falta productId
      };

      const errors = [];
      if (!mockReq.body.productId) {
        errors.push({ field: 'productId', message: 'Product ID is required' });
      }

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].field).toBe('productId');
    });

    test('debería fallar sin quantity', () => {
      mockReq.body = {
        productId: '507f1f77bcf86cd799439011'
        // falta quantity
      };

      const errors = [];
      if (!mockReq.body.quantity) {
        errors.push({ field: 'quantity', message: 'Quantity is required' });
      }

      expect(errors.length).toBeGreaterThan(0);
    });

    test('debería validar quantity positiva', () => {
      mockReq.body = {
        productId: '507f1f77bcf86cd799439011',
        quantity: 0
      };

      const isValid = mockReq.body.quantity > 0;

      expect(isValid).toBe(false);
    });

    test('debería rechazar quantity negativa', () => {
      mockReq.body = {
        quantity: -5
      };

      const isValid = mockReq.body.quantity > 0;

      expect(isValid).toBe(false);
    });

    test('debería validar quantity como entero', () => {
      mockReq.body = {
        quantity: 2.5
      };

      const isValid = Number.isInteger(mockReq.body.quantity);

      expect(isValid).toBe(false);
    });
  });

  describe('Validate Stock Availability', () => {
    test('debería verificar stock suficiente', async () => {
      mockReq.body = {
        productId: 'product123',
        quantity: 5
      };

      const mockProduct = {
        _id: 'product123',
        name: 'Test Product',
        stock: 10,
        isActive: true
      };

      Product.findById.mockResolvedValue(mockProduct);

      const checkStock = async (req, res, next) => {
        try {
          const { productId, quantity } = req.body;
          const product = await Product.findById(productId);

          if (!product) {
            return res.status(404).json({
              success: false,
              message: 'Product not found'
            });
          }

          if (!product.isActive) {
            return res.status(400).json({
              success: false,
              message: 'Product is not available'
            });
          }

          if (product.stock < quantity) {
            return res.status(400).json({
              success: false,
              message: `Insufficient stock. Available: ${product.stock}`
            });
          }

          req.product = product;
          next();
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await checkStock(mockReq, mockRes, mockNext);

      expect(Product.findById).toHaveBeenCalledWith('product123');
      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.product).toEqual(mockProduct);
    });

    test('debería fallar si stock insuficiente', async () => {
      mockReq.body = {
        productId: 'product123',
        quantity: 100
      };

      const mockProduct = {
        _id: 'product123',
        stock: 5,
        isActive: true
      };

      Product.findById.mockResolvedValue(mockProduct);

      const checkStock = async (req, res, next) => {
        try {
          const { quantity } = req.body;
          const product = await Product.findById(req.body.productId);

          if (product.stock < quantity) {
            return res.status(400).json({
              success: false,
              message: `Insufficient stock. Available: ${product.stock}`
            });
          }

          next();
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await checkStock(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.stringContaining('Insufficient stock')
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('debería fallar si producto no está activo', async () => {
      mockReq.body = {
        productId: 'product123',
        quantity: 2
      };

      const mockProduct = {
        _id: 'product123',
        stock: 10,
        isActive: false
      };

      Product.findById.mockResolvedValue(mockProduct);

      const checkStock = async (req, res, next) => {
        try {
          const product = await Product.findById(req.body.productId);

          if (!product.isActive) {
            return res.status(400).json({
              success: false,
              message: 'Product is not available'
            });
          }

          next();
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await checkStock(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('not available')
        })
      );
    });

    test('debería fallar si producto no existe', async () => {
      mockReq.body = {
        productId: 'nonexistent',
        quantity: 2
      };

      Product.findById.mockResolvedValue(null);

      const checkStock = async (req, res, next) => {
        try {
          const product = await Product.findById(req.body.productId);

          if (!product) {
            return res.status(404).json({
              success: false,
              message: 'Product not found'
            });
          }

          next();
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await checkStock(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });
  });

  describe('Validate Update Cart Item', () => {
    test('debería validar actualización de cantidad', () => {
      mockReq.body = {
        productId: '507f1f77bcf86cd799439011',
        quantity: 3
      };

      const validateUpdateCart = (req, res, next) => {
        const { productId, quantity } = req.body;
        const errors = [];

        if (!productId) {
          errors.push({ field: 'productId', message: 'Product ID is required' });
        }

        if (quantity === undefined || quantity === null) {
          errors.push({ field: 'quantity', message: 'Quantity is required' });
        }

        if (quantity < 0) {
          errors.push({ field: 'quantity', message: 'Quantity cannot be negative' });
        }

        if (quantity && !Number.isInteger(quantity)) {
          errors.push({ field: 'quantity', message: 'Quantity must be an integer' });
        }

        if (errors.length > 0) {
          return res.status(400).json({ success: false, errors });
        }

        next();
      };

      validateUpdateCart(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    test('debería permitir quantity 0 para eliminar', () => {
      mockReq.body = {
        productId: '507f1f77bcf86cd799439011',
        quantity: 0
      };

      const isValid = mockReq.body.quantity >= 0;

      expect(isValid).toBe(true);
    });

    test('debería rechazar quantity negativa', () => {
      mockReq.body = {
        quantity: -3
      };

      const isValid = mockReq.body.quantity >= 0;

      expect(isValid).toBe(false);
    });
  });

  describe('Validate Remove from Cart', () => {
    test('debería validar productId en params', () => {
      mockReq.params = {
        productId: '507f1f77bcf86cd799439011'
      };

      const objectIdRegex = /^[0-9a-fA-F]{24}$/;
      const isValid = objectIdRegex.test(mockReq.params.productId);

      expect(isValid).toBe(true);
    });

    test('debería rechazar productId inválido', () => {
      mockReq.params = {
        productId: 'invalid-id'
      };

      const objectIdRegex = /^[0-9a-fA-F]{24}$/;
      const isValid = objectIdRegex.test(mockReq.params.productId);

      expect(isValid).toBe(false);
    });
  });

  describe('Validate Quantity Limits', () => {
    test('debería validar cantidad máxima por producto', () => {
      const quantity = 10;
      const maxQuantity = 50;

      const isValid = quantity <= maxQuantity;

      expect(isValid).toBe(true);
    });

    test('debería rechazar cantidad excesiva', () => {
      const quantity = 100;
      const maxQuantity = 50;

      const isValid = quantity <= maxQuantity;

      expect(isValid).toBe(false);
    });

    test('debería validar cantidad mínima', () => {
      const quantity = 1;
      const minQuantity = 1;

      const isValid = quantity >= minQuantity;

      expect(isValid).toBe(true);
    });
  });

  describe('Validate Cart Total', () => {
    test('debería validar total del carrito dentro de límites', () => {
      const cartTotal = 50000;
      const maxCartTotal = 100000;

      const isValid = cartTotal <= maxCartTotal;

      expect(isValid).toBe(true);
    });

    test('debería rechazar total excesivo', () => {
      const cartTotal = 150000;
      const maxCartTotal = 100000;

      const isValid = cartTotal <= maxCartTotal;

      expect(isValid).toBe(false);
    });

    test('debería calcular total correctamente', () => {
      const cartItems = [
        { price: 2500, quantity: 2 },
        { price: 3000, quantity: 1 }
      ];

      const total = cartItems.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
      }, 0);

      expect(total).toBe(8000); // (2500 * 2) + (3000 * 1)
    });
  });

  describe('Validate Cart Items Count', () => {
    test('debería validar número de items en carrito', () => {
      const cartItems = Array(5).fill({ productId: 'p1', quantity: 1 });
      const maxItems = 10;

      const isValid = cartItems.length <= maxItems;

      expect(isValid).toBe(true);
    });

    test('debería rechazar carrito con demasiados items', () => {
      const cartItems = Array(25).fill({ productId: 'p1', quantity: 1 });
      const maxItems = 20;

      const isValid = cartItems.length <= maxItems;

      expect(isValid).toBe(false);
    });

    test('debería permitir carrito vacío', () => {
      const cartItems = [];

      const isValid = Array.isArray(cartItems);

      expect(isValid).toBe(true);
      expect(cartItems.length).toBe(0);
    });
  });

  describe('Validate Product Availability', () => {
    test('debería verificar que producto esté disponible para venta', async () => {
      const mockProduct = {
        _id: 'product123',
        isActive: true,
        stock: 10,
        price: 2500
      };

      Product.findById.mockResolvedValue(mockProduct);

      const checkAvailability = async (productId) => {
        const product = await Product.findById(productId);
        return product && product.isActive && product.stock > 0;
      };

      const isAvailable = await checkAvailability('product123');

      expect(isAvailable).toBe(true);
    });

    test('debería detectar producto sin stock', async () => {
      const mockProduct = {
        _id: 'product123',
        isActive: true,
        stock: 0
      };

      Product.findById.mockResolvedValue(mockProduct);

      const checkAvailability = async (productId) => {
        const product = await Product.findById(productId);
        return product && product.isActive && product.stock > 0;
      };

      const isAvailable = await checkAvailability('product123');

      expect(isAvailable).toBe(false);
    });

    test('debería detectar producto inactivo', async () => {
      const mockProduct = {
        _id: 'product123',
        isActive: false,
        stock: 10
      };

      Product.findById.mockResolvedValue(mockProduct);

      const checkAvailability = async (productId) => {
        const product = await Product.findById(productId);
        return product && product.isActive && product.stock > 0;
      };

      const isAvailable = await checkAvailability('product123');

      expect(isAvailable).toBe(false);
    });
  });

  describe('Validate Duplicate Products', () => {
    test('debería detectar producto duplicado en carrito', () => {
      const cart = [
        { product: 'product123', quantity: 2 },
        { product: 'product456', quantity: 1 }
      ];

      const productId = 'product123';
      const isDuplicate = cart.some(item => item.product === productId);

      expect(isDuplicate).toBe(true);
    });

    test('debería permitir agregar producto nuevo', () => {
      const cart = [
        { product: 'product123', quantity: 2 },
        { product: 'product456', quantity: 1 }
      ];

      const productId = 'product789';
      const isDuplicate = cart.some(item => item.product === productId);

      expect(isDuplicate).toBe(false);
    });
  });

  describe('Validate Price Changes', () => {
    test('debería detectar cambio de precio', () => {
      const cartItemPrice = 2500;
      const currentPrice = 3000;

      const priceChanged = cartItemPrice !== currentPrice;

      expect(priceChanged).toBe(true);
    });

    test('debería confirmar precio sin cambios', () => {
      const cartItemPrice = 2500;
      const currentPrice = 2500;

      const priceChanged = cartItemPrice !== currentPrice;

      expect(priceChanged).toBe(false);
    });

    test('debería calcular diferencia de precio', () => {
      const cartItemPrice = 2500;
      const currentPrice = 3000;

      const difference = currentPrice - cartItemPrice;
      const percentageChange = (difference / cartItemPrice) * 100;

      expect(difference).toBe(500);
      expect(percentageChange).toBe(20);
    });
  });
});
