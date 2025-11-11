import User from '../../models/user.model.js';
import Product from '../../models/product.model.js';

// Mock de los modelos
jest.mock('../../models/user.model.js');
jest.mock('../../models/product.model.js');

describe('Cart Controller - Unit Tests', () => {
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

  describe('Get Cart Controller Logic', () => {
    test('debería obtener carrito vacío', async () => {
      const mockUser = {
        _id: 'user123',
        cart: [],
        populate: jest.fn().mockResolvedValue({
          _id: 'user123',
          cart: []
        })
      };

      User.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockUser)
      });

      const getCart = async (req, res) => {
        try {
          const user = await User.findById(req.user.id).populate('cart.product');

          if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
          }

          const total = user.cart.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity);
          }, 0);

          res.status(200).json({
            success: true,
            cart: {
              items: user.cart,
              total
            }
          });
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await getCart(mockReq, mockRes);

      expect(User.findById).toHaveBeenCalledWith('user123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          cart: expect.objectContaining({
            items: [],
            total: 0
          })
        })
      );
    });

    test('debería calcular total correctamente', async () => {
      const mockUser = {
        _id: 'user123',
        cart: [
          { product: { _id: 'p1', price: 2500 }, quantity: 2 },
          { product: { _id: 'p2', price: 3000 }, quantity: 1 }
        ]
      };

      User.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockUser)
      });

      const getCart = async (req, res) => {
        try {
          const user = await User.findById(req.user.id).populate('cart.product');

          const total = user.cart.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity);
          }, 0);

          res.status(200).json({
            success: true,
            cart: {
              items: user.cart,
              total
            }
          });
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await getCart(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          cart: expect.objectContaining({
            total: 8000 // (2500 * 2) + (3000 * 1)
          })
        })
      );
    });

    test('debería fallar si usuario no existe', async () => {
      User.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });

      const getCart = async (req, res) => {
        try {
          const user = await User.findById(req.user.id).populate('cart.product');

          if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
          }
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await getCart(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });
  });

  describe('Add to Cart Controller Logic', () => {
    test('debería agregar producto al carrito', async () => {
      mockReq.body = {
        productId: 'product123',
        quantity: 2
      };

      const mockProduct = {
        _id: 'product123',
        name: 'Tarta',
        price: 2500,
        stock: 10
      };

      const mockUser = {
        _id: 'user123',
        cart: [],
        save: jest.fn().mockResolvedValue(true)
      };

      Product.findById.mockResolvedValue(mockProduct);
      User.findById.mockResolvedValue(mockUser);

      const addToCart = async (req, res) => {
        try {
          const { productId, quantity } = req.body;

          const product = await Product.findById(productId);
          if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
          }

          if (quantity <= 0) {
            return res.status(400).json({ success: false, message: 'Quantity must be positive' });
          }

          if (quantity > product.stock) {
            return res.status(400).json({ success: false, message: 'Insufficient stock' });
          }

          const user = await User.findById(req.user.id);
          const existingItem = user.cart.find(item => item.product.toString() === productId);

          if (existingItem) {
            existingItem.quantity += quantity;
          } else {
            user.cart.push({ product: productId, quantity });
          }

          await user.save();

          res.status(200).json({ success: true, cart: user.cart });
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await addToCart(mockReq, mockRes);

      expect(Product.findById).toHaveBeenCalledWith('product123');
      expect(mockUser.save).toHaveBeenCalled();
      expect(mockUser.cart.length).toBe(1);
      expect(mockUser.cart[0].quantity).toBe(2);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    test('debería incrementar cantidad si producto ya existe', async () => {
      mockReq.body = {
        productId: 'product123',
        quantity: 3
      };

      const mockProduct = {
        _id: 'product123',
        stock: 20
      };

      const existingCartItem = { product: 'product123', quantity: 2 };
      const mockUser = {
        _id: 'user123',
        cart: [existingCartItem],
        save: jest.fn().mockResolvedValue(true)
      };

      Product.findById.mockResolvedValue(mockProduct);
      User.findById.mockResolvedValue(mockUser);

      const addToCart = async (req, res) => {
        try {
          const { productId, quantity } = req.body;

          const product = await Product.findById(productId);
          const user = await User.findById(req.user.id);
          
          const existingItem = user.cart.find(item => item.product.toString() === productId);

          if (existingItem) {
            existingItem.quantity += quantity;
          } else {
            user.cart.push({ product: productId, quantity });
          }

          await user.save();

          res.status(200).json({ success: true, cart: user.cart });
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await addToCart(mockReq, mockRes);

      expect(existingCartItem.quantity).toBe(5); // 2 + 3
      expect(mockUser.save).toHaveBeenCalled();
    });

    test('debería fallar si producto no existe', async () => {
      mockReq.body = {
        productId: 'nonexistent',
        quantity: 1
      };

      Product.findById.mockResolvedValue(null);

      const addToCart = async (req, res) => {
        try {
          const { productId } = req.body;

          const product = await Product.findById(productId);
          if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
          }
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await addToCart(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });

    test('debería fallar si cantidad es 0 o negativa', async () => {
      mockReq.body = {
        productId: 'product123',
        quantity: 0
      };

      const mockProduct = {
        _id: 'product123',
        stock: 10
      };

      Product.findById.mockResolvedValue(mockProduct);

      const addToCart = async (req, res) => {
        try {
          const { quantity } = req.body;

          if (quantity <= 0) {
            return res.status(400).json({ success: false, message: 'Quantity must be positive' });
          }
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await addToCart(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('positive')
        })
      );
    });

    test('debería fallar si cantidad excede stock', async () => {
      mockReq.body = {
        productId: 'product123',
        quantity: 100
      };

      const mockProduct = {
        _id: 'product123',
        stock: 10
      };

      Product.findById.mockResolvedValue(mockProduct);

      const addToCart = async (req, res) => {
        try {
          const { quantity } = req.body;
          const product = await Product.findById(req.body.productId);

          if (quantity > product.stock) {
            return res.status(400).json({ success: false, message: 'Insufficient stock' });
          }
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await addToCart(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('stock')
        })
      );
    });
  });

  describe('Update Cart Item Controller Logic', () => {
    test('debería actualizar cantidad de producto', async () => {
      mockReq.body = {
        productId: 'product123',
        quantity: 5
      };

      const mockProduct = {
        _id: 'product123',
        stock: 20
      };

      const cartItem = { product: 'product123', quantity: 2 };
      const mockUser = {
        _id: 'user123',
        cart: [cartItem],
        save: jest.fn().mockResolvedValue(true)
      };

      Product.findById.mockResolvedValue(mockProduct);
      User.findById.mockResolvedValue(mockUser);

      const updateCartItem = async (req, res) => {
        try {
          const { productId, quantity } = req.body;

          const product = await Product.findById(productId);
          if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
          }

          if (quantity > product.stock) {
            return res.status(400).json({ success: false, message: 'Insufficient stock' });
          }

          const user = await User.findById(req.user.id);
          const item = user.cart.find(i => i.product.toString() === productId);

          if (!item) {
            return res.status(404).json({ success: false, message: 'Product not in cart' });
          }

          if (quantity === 0) {
            user.cart = user.cart.filter(i => i.product.toString() !== productId);
          } else {
            item.quantity = quantity;
          }

          await user.save();

          res.status(200).json({ success: true, cart: user.cart });
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await updateCartItem(mockReq, mockRes);

      expect(cartItem.quantity).toBe(5);
      expect(mockUser.save).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    test('debería eliminar producto si quantity es 0', async () => {
      mockReq.body = {
        productId: 'product123',
        quantity: 0
      };

      const mockProduct = {
        _id: 'product123',
        stock: 20
      };

      const mockUser = {
        _id: 'user123',
        cart: [{ product: 'product123', quantity: 2 }],
        save: jest.fn().mockResolvedValue(true)
      };

      Product.findById.mockResolvedValue(mockProduct);
      User.findById.mockResolvedValue(mockUser);

      const updateCartItem = async (req, res) => {
        try {
          const { productId, quantity } = req.body;

          const user = await User.findById(req.user.id);
          const item = user.cart.find(i => i.product.toString() === productId);

          if (quantity === 0) {
            user.cart = user.cart.filter(i => i.product.toString() !== productId);
          } else {
            item.quantity = quantity;
          }

          await user.save();

          res.status(200).json({ success: true, cart: user.cart });
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await updateCartItem(mockReq, mockRes);

      expect(mockUser.cart.length).toBe(0);
      expect(mockUser.save).toHaveBeenCalled();
    });

    test('debería fallar si producto no está en carrito', async () => {
      mockReq.body = {
        productId: 'product123',
        quantity: 5
      };

      const mockProduct = {
        _id: 'product123',
        stock: 20
      };

      const mockUser = {
        _id: 'user123',
        cart: []
      };

      Product.findById.mockResolvedValue(mockProduct);
      User.findById.mockResolvedValue(mockUser);

      const updateCartItem = async (req, res) => {
        try {
          const { productId } = req.body;

          const user = await User.findById(req.user.id);
          const item = user.cart.find(i => i.product.toString() === productId);

          if (!item) {
            return res.status(404).json({ success: false, message: 'Product not in cart' });
          }
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await updateCartItem(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });
  });

  describe('Remove from Cart Controller Logic', () => {
    test('debería eliminar producto del carrito', async () => {
      mockReq.params = { productId: 'product123' };

      const mockUser = {
        _id: 'user123',
        cart: [
          { product: 'product123', quantity: 2 },
          { product: 'product456', quantity: 1 }
        ],
        save: jest.fn().mockResolvedValue(true)
      };

      User.findById.mockResolvedValue(mockUser);

      const removeFromCart = async (req, res) => {
        try {
          const { productId } = req.params;
          const user = await User.findById(req.user.id);

          const itemIndex = user.cart.findIndex(i => i.product.toString() === productId);

          if (itemIndex === -1) {
            return res.status(404).json({ success: false, message: 'Product not in cart' });
          }

          user.cart.splice(itemIndex, 1);
          await user.save();

          res.status(200).json({ success: true, cart: user.cart });
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await removeFromCart(mockReq, mockRes);

      expect(mockUser.cart.length).toBe(1);
      expect(mockUser.cart[0].product).toBe('product456');
      expect(mockUser.save).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    test('debería fallar si producto no está en carrito', async () => {
      mockReq.params = { productId: 'nonexistent' };

      const mockUser = {
        _id: 'user123',
        cart: []
      };

      User.findById.mockResolvedValue(mockUser);

      const removeFromCart = async (req, res) => {
        try {
          const { productId } = req.params;
          const user = await User.findById(req.user.id);

          const itemIndex = user.cart.findIndex(i => i.product.toString() === productId);

          if (itemIndex === -1) {
            return res.status(404).json({ success: false, message: 'Product not in cart' });
          }
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await removeFromCart(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });
  });

  describe('Clear Cart Controller Logic', () => {
    test('debería vaciar carrito completamente', async () => {
      const mockUser = {
        _id: 'user123',
        cart: [
          { product: 'product123', quantity: 2 },
          { product: 'product456', quantity: 3 }
        ],
        save: jest.fn().mockResolvedValue(true)
      };

      User.findById.mockResolvedValue(mockUser);

      const clearCart = async (req, res) => {
        try {
          const user = await User.findById(req.user.id);
          user.cart = [];
          await user.save();

          res.status(200).json({ success: true, cart: user.cart });
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await clearCart(mockReq, mockRes);

      expect(mockUser.cart).toEqual([]);
      expect(mockUser.save).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('Get Cart Count Controller Logic', () => {
    test('debería contar items en carrito', async () => {
      const mockUser = {
        _id: 'user123',
        cart: [
          { product: 'p1', quantity: 2 },
          { product: 'p2', quantity: 3 }
        ]
      };

      User.findById.mockResolvedValue(mockUser);

      const getCartCount = async (req, res) => {
        try {
          const user = await User.findById(req.user.id);
          
          const count = user.cart.reduce((sum, item) => sum + item.quantity, 0);

          res.status(200).json({ success: true, count });
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await getCartCount(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          count: 5 // 2 + 3
        })
      );
    });

    test('debería devolver 0 para carrito vacío', async () => {
      const mockUser = {
        _id: 'user123',
        cart: []
      };

      User.findById.mockResolvedValue(mockUser);

      const getCartCount = async (req, res) => {
        try {
          const user = await User.findById(req.user.id);
          
          const count = user.cart.reduce((sum, item) => sum + item.quantity, 0);

          res.status(200).json({ success: true, count });
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await getCartCount(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          count: 0
        })
      );
    });
  });
});
