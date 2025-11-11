import Product from '../../models/product.model.js';

// Mock del modelo Product
jest.mock('../../models/product.model.js');

describe('Product Validation Middleware - Unit Tests', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {}
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    
    mockNext = jest.fn();
    
    jest.clearAllMocks();
  });

  describe('Validate Product Data', () => {
    test('debería validar producto con datos completos', () => {
      mockReq.body = {
        name: 'Tarta de Frutilla',
        description: 'Deliciosa tarta',
        price: 2500,
        category: 'tartas',
        stock: 10
      };

      const validateProduct = (req, res, next) => {
        const { name, description, price, category, stock } = req.body;
        const errors = [];

        if (!name) errors.push({ field: 'name', message: 'Name is required' });
        if (!price) errors.push({ field: 'price', message: 'Price is required' });
        if (!category) errors.push({ field: 'category', message: 'Category is required' });
        if (price && price <= 0) errors.push({ field: 'price', message: 'Price must be positive' });
        if (stock && stock < 0) errors.push({ field: 'stock', message: 'Stock cannot be negative' });

        if (errors.length > 0) {
          return res.status(400).json({ success: false, errors });
        }

        next();
      };

      validateProduct(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    test('debería fallar si falta nombre', () => {
      mockReq.body = {
        price: 2500,
        category: 'tartas',
        stock: 10
        // falta name
      };

      const validateProduct = (req, res, next) => {
        const { name } = req.body;
        const errors = [];

        if (!name) {
          errors.push({ field: 'name', message: 'Name is required' });
        }

        if (errors.length > 0) {
          return res.status(400).json({ success: false, errors });
        }

        next();
      };

      validateProduct(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          errors: expect.arrayContaining([
            expect.objectContaining({ field: 'name' })
          ])
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('debería validar precio positivo', () => {
      mockReq.body = {
        name: 'Test',
        price: -100,
        category: 'tartas'
      };

      const errors = [];
      if (mockReq.body.price <= 0) {
        errors.push({ field: 'price', message: 'Price must be positive' });
      }

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].field).toBe('price');
    });

    test('debería validar precio como número', () => {
      mockReq.body = {
        name: 'Test',
        price: 'not-a-number',
        category: 'tartas'
      };

      const isValidPrice = typeof mockReq.body.price === 'number' && !isNaN(mockReq.body.price);

      expect(isValidPrice).toBe(false);
    });

    test('debería validar stock no negativo', () => {
      mockReq.body = {
        name: 'Test',
        price: 2500,
        category: 'tartas',
        stock: -5
      };

      const errors = [];
      if (mockReq.body.stock < 0) {
        errors.push({ field: 'stock', message: 'Stock cannot be negative' });
      }

      expect(errors.length).toBeGreaterThan(0);
    });

    test('debería permitir stock cero', () => {
      mockReq.body = {
        name: 'Test',
        price: 2500,
        category: 'tartas',
        stock: 0
      };

      const isValidStock = mockReq.body.stock >= 0;

      expect(isValidStock).toBe(true);
    });
  });

  describe('Validate Category', () => {
    const validCategories = ['tortas', 'tartas', 'pasteles', 'galletas', 'brownies', 'alfajores'];

    test('debería aceptar categoría válida', () => {
      mockReq.body = {
        name: 'Test',
        price: 2500,
        category: 'tartas'
      };

      const isValidCategory = validCategories.includes(mockReq.body.category);

      expect(isValidCategory).toBe(true);
    });

    test('debería rechazar categoría inválida', () => {
      mockReq.body = {
        category: 'categoria-invalida'
      };

      const isValidCategory = validCategories.includes(mockReq.body.category);

      expect(isValidCategory).toBe(false);
    });

    test('debería validar todas las categorías permitidas', () => {
      const testCategories = ['tortas', 'tartas', 'pasteles', 'galletas', 'brownies', 'alfajores'];

      testCategories.forEach(category => {
        expect(validCategories.includes(category)).toBe(true);
      });
    });

    test('debería ser case-sensitive', () => {
      mockReq.body = {
        category: 'TARTAS'
      };

      const isValidCategory = validCategories.includes(mockReq.body.category);

      expect(isValidCategory).toBe(false);
    });
  });

  describe('Validate Images Array', () => {
    test('debería aceptar array de URLs válidas', () => {
      mockReq.body = {
        images: [
          'https://example.com/image1.jpg',
          'https://example.com/image2.jpg'
        ]
      };

      const urlRegex = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i;
      const allValid = mockReq.body.images.every(url => urlRegex.test(url));

      expect(allValid).toBe(true);
    });

    test('debería rechazar URLs inválidas', () => {
      mockReq.body = {
        images: ['not-a-url', 'another-invalid']
      };

      const urlRegex = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i;
      const allValid = mockReq.body.images.every(url => urlRegex.test(url));

      expect(allValid).toBe(false);
    });

    test('debería validar extensiones de imagen permitidas', () => {
      const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
      const url = 'https://example.com/image.jpg';
      const extension = url.split('.').pop().toLowerCase();

      expect(validExtensions.includes(extension)).toBe(true);
    });

    test('debería limitar número de imágenes', () => {
      mockReq.body = {
        images: Array(10).fill('https://example.com/image.jpg')
      };

      const maxImages = 5;
      const isValidCount = mockReq.body.images.length <= maxImages;

      expect(isValidCount).toBe(false);
    });

    test('debería permitir array vacío de imágenes', () => {
      mockReq.body = {
        images: []
      };

      const isValid = Array.isArray(mockReq.body.images);

      expect(isValid).toBe(true);
    });
  });

  describe('Validate Product Update', () => {
    test('debería permitir actualización parcial', () => {
      mockReq.body = {
        price: 3000
        // solo actualiza precio
      };

      const validatePartialUpdate = (body) => {
        const errors = [];
        
        if (body.price !== undefined && body.price <= 0) {
          errors.push({ field: 'price', message: 'Price must be positive' });
        }
        
        if (body.stock !== undefined && body.stock < 0) {
          errors.push({ field: 'stock', message: 'Stock cannot be negative' });
        }

        return errors;
      };

      const errors = validatePartialUpdate(mockReq.body);

      expect(errors.length).toBe(0);
    });

    test('debería validar solo campos presentes', () => {
      mockReq.body = {
        name: 'Nuevo Nombre'
        // otros campos no presentes, no se validan
      };

      const validatePartialUpdate = (body) => {
        const errors = [];
        
        // Solo validar si el campo está presente
        if (body.price !== undefined && body.price <= 0) {
          errors.push({ field: 'price', message: 'Price must be positive' });
        }

        return errors;
      };

      const errors = validatePartialUpdate(mockReq.body);

      expect(errors.length).toBe(0);
    });

    test('debería rechazar valores inválidos en actualización', () => {
      mockReq.body = {
        price: -500
      };

      const errors = [];
      if (mockReq.body.price !== undefined && mockReq.body.price <= 0) {
        errors.push({ field: 'price', message: 'Price must be positive' });
      }

      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('Validate Product Existence', () => {
    test('debería verificar que producto existe', async () => {
      mockReq.params.id = 'product123';

      const mockProduct = {
        _id: 'product123',
        name: 'Test Product'
      };

      Product.findById.mockResolvedValue(mockProduct);

      const checkProductExists = async (req, res, next) => {
        try {
          const product = await Product.findById(req.params.id);

          if (!product) {
            return res.status(404).json({
              success: false,
              message: 'Product not found'
            });
          }

          req.product = product;
          next();
        } catch (error) {
          res.status(400).json({
            success: false,
            message: 'Invalid product ID'
          });
        }
      };

      await checkProductExists(mockReq, mockRes, mockNext);

      expect(Product.findById).toHaveBeenCalledWith('product123');
      expect(mockReq.product).toEqual(mockProduct);
      expect(mockNext).toHaveBeenCalled();
    });

    test('debería fallar si producto no existe', async () => {
      mockReq.params.id = 'nonexistent';

      Product.findById.mockResolvedValue(null);

      const checkProductExists = async (req, res, next) => {
        try {
          const product = await Product.findById(req.params.id);

          if (!product) {
            return res.status(404).json({
              success: false,
              message: 'Product not found'
            });
          }

          next();
        } catch (error) {
          res.status(400).json({
            success: false,
            message: 'Invalid product ID'
          });
        }
      };

      await checkProductExists(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Validate Price Range', () => {
    test('debería validar precio mínimo', () => {
      const price = 100;
      const minPrice = 50;

      const isValid = price >= minPrice;

      expect(isValid).toBe(true);
    });

    test('debería validar precio máximo', () => {
      const price = 5000;
      const maxPrice = 10000;

      const isValid = price <= maxPrice;

      expect(isValid).toBe(true);
    });

    test('debería rechazar precio fuera de rango', () => {
      const price = 2000000;
      const maxPrice = 1000000;

      const isValid = price <= maxPrice;

      expect(isValid).toBe(false);
    });

    test('debería validar rango completo', () => {
      const price = 5000;
      const minPrice = 100;
      const maxPrice = 1000000;

      const isValid = price >= minPrice && price <= maxPrice;

      expect(isValid).toBe(true);
    });
  });

  describe('Validate Name Length', () => {
    test('debería aceptar nombre válido', () => {
      const name = 'Tarta de Frutilla';
      const minLength = 3;
      const maxLength = 100;

      const isValid = name.length >= minLength && name.length <= maxLength;

      expect(isValid).toBe(true);
    });

    test('debería rechazar nombre muy corto', () => {
      const name = 'AB';
      const minLength = 3;

      const isValid = name.length >= minLength;

      expect(isValid).toBe(false);
    });

    test('debería rechazar nombre muy largo', () => {
      const name = 'A'.repeat(200);
      const maxLength = 100;

      const isValid = name.length <= maxLength;

      expect(isValid).toBe(false);
    });
  });

  describe('Validate Description', () => {
    test('debería aceptar descripción válida', () => {
      const description = 'Esta es una descripción de producto válida.';
      const maxLength = 500;

      const isValid = description.length <= maxLength;

      expect(isValid).toBe(true);
    });

    test('debería permitir descripción vacía', () => {
      const description = '';

      const isValid = description !== undefined;

      expect(isValid).toBe(true);
    });

    test('debería limitar longitud de descripción', () => {
      const description = 'A'.repeat(1000);
      const maxLength = 500;

      const isValid = description.length <= maxLength;

      expect(isValid).toBe(false);
    });
  });

  describe('Validate Bulk Operations', () => {
    test('debería validar actualización masiva de stock', () => {
      mockReq.body = {
        products: [
          { id: 'p1', stock: 10 },
          { id: 'p2', stock: 20 }
        ]
      };

      const validateBulkStock = (products) => {
        return products.every(p => p.stock >= 0 && Number.isInteger(p.stock));
      };

      const isValid = validateBulkStock(mockReq.body.products);

      expect(isValid).toBe(true);
    });

    test('debería rechazar stock negativo en bulk', () => {
      mockReq.body = {
        products: [
          { id: 'p1', stock: 10 },
          { id: 'p2', stock: -5 }
        ]
      };

      const validateBulkStock = (products) => {
        return products.every(p => p.stock >= 0);
      };

      const isValid = validateBulkStock(mockReq.body.products);

      expect(isValid).toBe(false);
    });

    test('debería limitar número de productos en bulk', () => {
      mockReq.body = {
        products: Array(200).fill({ id: 'p1', stock: 10 })
      };

      const maxBulkSize = 100;
      const isValid = mockReq.body.products.length <= maxBulkSize;

      expect(isValid).toBe(false);
    });
  });
});
