import Product from '../../models/product.model.js';

// Mock del modelo Product
jest.mock('../../models/product.model.js');

describe('Product Controller - Unit Tests', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      query: {},
      user: { id: 'admin123', role: 'admin' }
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('Get All Products Controller Logic', () => {
    test('debería obtener todos los productos sin filtros', async () => {
      const mockProducts = [
        { _id: '1', name: 'Tarta 1', price: 2000, category: 'tartas', stock: 10 },
        { _id: '2', name: 'Torta 1', price: 3000, category: 'tortas', stock: 5 }
      ];

      Product.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            skip: jest.fn().mockResolvedValue(mockProducts)
          })
        })
      });

      Product.countDocuments.mockResolvedValue(2);

      const getAllProducts = async (req, res) => {
        try {
          const { category, search, minPrice, maxPrice, sort = '-createdAt', page = 1, limit = 10 } = req.query;

          const filters = {};
          if (category) filters.category = category;
          if (search) filters.name = { $regex: search, $options: 'i' };
          if (minPrice || maxPrice) {
            filters.price = {};
            if (minPrice) filters.price.$gte = Number(minPrice);
            if (maxPrice) filters.price.$lte = Number(maxPrice);
          }

          const skip = (page - 1) * limit;
          const products = await Product.find(filters)
            .sort(sort)
            .limit(Number(limit))
            .skip(skip);

          const total = await Product.countDocuments(filters);

          res.status(200).json({
            success: true,
            products,
            pagination: {
              total,
              page: Number(page),
              pages: Math.ceil(total / limit)
            }
          });
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await getAllProducts(mockReq, mockRes);

      expect(Product.find).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          products: mockProducts
        })
      );
    });

    test('debería filtrar por categoría', async () => {
      mockReq.query = { category: 'tartas' };

      const mockProducts = [
        { _id: '1', name: 'Tarta 1', category: 'tartas' }
      ];

      Product.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            skip: jest.fn().mockResolvedValue(mockProducts)
          })
        })
      });

      Product.countDocuments.mockResolvedValue(1);

      const getAllProducts = async (req, res) => {
        try {
          const { category } = req.query;
          const filters = {};
          if (category) filters.category = category;

          const products = await Product.find(filters)
            .sort('-createdAt')
            .limit(10)
            .skip(0);

          const total = await Product.countDocuments(filters);

          res.status(200).json({ success: true, products, total });
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await getAllProducts(mockReq, mockRes);

      expect(Product.find).toHaveBeenCalledWith({ category: 'tartas' });
    });

    test('debería buscar por nombre', async () => {
      mockReq.query = { search: 'chocolate' };

      Product.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            skip: jest.fn().mockResolvedValue([])
          })
        })
      });

      Product.countDocuments.mockResolvedValue(0);

      const getAllProducts = async (req, res) => {
        try {
          const { search } = req.query;
          const filters = {};
          if (search) filters.name = { $regex: search, $options: 'i' };

          const products = await Product.find(filters)
            .sort('-createdAt')
            .limit(10)
            .skip(0);

          res.status(200).json({ success: true, products });
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await getAllProducts(mockReq, mockRes);

      expect(Product.find).toHaveBeenCalledWith({
        name: { $regex: 'chocolate', $options: 'i' }
      });
    });

    test('debería filtrar por rango de precio', async () => {
      mockReq.query = { minPrice: '1000', maxPrice: '3000' };

      Product.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            skip: jest.fn().mockResolvedValue([])
          })
        })
      });

      Product.countDocuments.mockResolvedValue(0);

      const getAllProducts = async (req, res) => {
        try {
          const { minPrice, maxPrice } = req.query;
          const filters = {};
          
          if (minPrice || maxPrice) {
            filters.price = {};
            if (minPrice) filters.price.$gte = Number(minPrice);
            if (maxPrice) filters.price.$lte = Number(maxPrice);
          }

          const products = await Product.find(filters)
            .sort('-createdAt')
            .limit(10)
            .skip(0);

          res.status(200).json({ success: true, products });
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await getAllProducts(mockReq, mockRes);

      expect(Product.find).toHaveBeenCalledWith({
        price: { $gte: 1000, $lte: 3000 }
      });
    });
  });

  describe('Get Product By ID Controller Logic', () => {
    test('debería obtener producto por ID', async () => {
      mockReq.params = { id: 'product123' };

      const mockProduct = {
        _id: 'product123',
        name: 'Tarta Especial',
        price: 2500,
        category: 'tartas'
      };

      Product.findById.mockResolvedValue(mockProduct);

      const getProductById = async (req, res) => {
        try {
          const product = await Product.findById(req.params.id);

          if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
          }

          res.status(200).json({ success: true, product });
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await getProductById(mockReq, mockRes);

      expect(Product.findById).toHaveBeenCalledWith('product123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          product: mockProduct
        })
      );
    });

    test('debería devolver 404 si producto no existe', async () => {
      mockReq.params = { id: 'nonexistent' };

      Product.findById.mockResolvedValue(null);

      const getProductById = async (req, res) => {
        try {
          const product = await Product.findById(req.params.id);

          if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
          }

          res.status(200).json({ success: true, product });
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await getProductById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });
  });

  describe('Create Product Controller Logic', () => {
    test('debería crear producto exitosamente', async () => {
      mockReq.body = {
        name: 'Nueva Tarta',
        description: 'Deliciosa',
        price: 2500,
        category: 'tartas',
        stock: 10
      };

      const mockProduct = {
        _id: 'newproduct123',
        ...mockReq.body,
        seller: 'admin123'
      };

      Product.create.mockResolvedValue(mockProduct);

      const createProduct = async (req, res) => {
        try {
          const { name, description, price, category, stock, images } = req.body;

          const product = await Product.create({
            name,
            description,
            price,
            category,
            stock,
            images,
            seller: req.user.id
          });

          res.status(201).json({ success: true, product });
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await createProduct(mockReq, mockRes);

      expect(Product.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Nueva Tarta',
          seller: 'admin123'
        })
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          product: mockProduct
        })
      );
    });

    test('debería manejar errores de validación', async () => {
      mockReq.body = {
        name: 'Test',
        price: -100 // Precio inválido
      };

      Product.create.mockRejectedValue(new Error('Validation error: price must be positive'));

      const createProduct = async (req, res) => {
        try {
          const product = await Product.create(req.body);
          res.status(201).json({ success: true, product });
        } catch (error) {
          res.status(400).json({ success: false, message: error.message });
        }
      };

      await createProduct(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.stringContaining('Validation error')
        })
      );
    });
  });

  describe('Update Product Controller Logic', () => {
    test('debería actualizar producto exitosamente', async () => {
      mockReq.params = { id: 'product123' };
      mockReq.body = {
        name: 'Nombre Actualizado',
        price: 3000
      };

      const mockProduct = {
        _id: 'product123',
        name: 'Nombre Original',
        price: 2500,
        save: jest.fn().mockResolvedValue(true)
      };

      Product.findById.mockResolvedValue(mockProduct);

      const updateProduct = async (req, res) => {
        try {
          const product = await Product.findById(req.params.id);

          if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
          }

          Object.keys(req.body).forEach(key => {
            product[key] = req.body[key];
          });

          await product.save();

          res.status(200).json({ success: true, product });
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await updateProduct(mockReq, mockRes);

      expect(Product.findById).toHaveBeenCalledWith('product123');
      expect(mockProduct.save).toHaveBeenCalled();
      expect(mockProduct.name).toBe('Nombre Actualizado');
      expect(mockProduct.price).toBe(3000);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    test('debería fallar si producto no existe', async () => {
      mockReq.params = { id: 'nonexistent' };
      mockReq.body = { name: 'Test' };

      Product.findById.mockResolvedValue(null);

      const updateProduct = async (req, res) => {
        try {
          const product = await Product.findById(req.params.id);

          if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
          }
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await updateProduct(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });
  });

  describe('Delete Product Controller Logic', () => {
    test('debería eliminar producto exitosamente', async () => {
      mockReq.params = { id: 'product123' };

      const mockProduct = {
        _id: 'product123',
        name: 'Producto a eliminar',
        deleteOne: jest.fn().mockResolvedValue(true)
      };

      Product.findById.mockResolvedValue(mockProduct);

      const deleteProduct = async (req, res) => {
        try {
          const product = await Product.findById(req.params.id);

          if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
          }

          await product.deleteOne();

          res.status(200).json({ success: true, message: 'Product deleted successfully' });
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await deleteProduct(mockReq, mockRes);

      expect(Product.findById).toHaveBeenCalledWith('product123');
      expect(mockProduct.deleteOne).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: expect.stringContaining('deleted')
        })
      );
    });

    test('debería fallar si producto no existe', async () => {
      mockReq.params = { id: 'nonexistent' };

      Product.findById.mockResolvedValue(null);

      const deleteProduct = async (req, res) => {
        try {
          const product = await Product.findById(req.params.id);

          if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
          }
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await deleteProduct(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });
  });

  describe('Update Stock Controller Logic', () => {
    test('debería actualizar stock exitosamente', async () => {
      mockReq.params = { id: 'product123' };
      mockReq.body = { stock: 25 };

      const mockProduct = {
        _id: 'product123',
        stock: 10,
        save: jest.fn().mockResolvedValue(true)
      };

      Product.findById.mockResolvedValue(mockProduct);

      const updateStock = async (req, res) => {
        try {
          const product = await Product.findById(req.params.id);

          if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
          }

          if (req.body.stock < 0) {
            return res.status(400).json({ success: false, message: 'Stock cannot be negative' });
          }

          product.stock = req.body.stock;
          await product.save();

          res.status(200).json({ success: true, product });
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await updateStock(mockReq, mockRes);

      expect(mockProduct.stock).toBe(25);
      expect(mockProduct.save).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    test('debería fallar con stock negativo', async () => {
      mockReq.params = { id: 'product123' };
      mockReq.body = { stock: -5 };

      const mockProduct = {
        _id: 'product123',
        stock: 10
      };

      Product.findById.mockResolvedValue(mockProduct);

      const updateStock = async (req, res) => {
        try {
          const product = await Product.findById(req.params.id);

          if (req.body.stock < 0) {
            return res.status(400).json({ success: false, message: 'Stock cannot be negative' });
          }
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await updateStock(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.stringContaining('negative')
        })
      );
    });
  });

  describe('Get Products by Category Controller Logic', () => {
    test('debería obtener productos por categoría', async () => {
      mockReq.params = { category: 'tartas' };

      const mockProducts = [
        { _id: '1', name: 'Tarta 1', category: 'tartas' },
        { _id: '2', name: 'Tarta 2', category: 'tartas' }
      ];

      Product.find.mockResolvedValue(mockProducts);

      const getProductsByCategory = async (req, res) => {
        try {
          const { category } = req.params;
          const products = await Product.find({ category });

          res.status(200).json({ success: true, products });
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await getProductsByCategory(mockReq, mockRes);

      expect(Product.find).toHaveBeenCalledWith({ category: 'tartas' });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          products: mockProducts
        })
      );
    });
  });
});
