import Product from '../../models/product.model.js';

describe('Product Model - Unit Tests', () => {
  
  describe('Product Creation', () => {
    test('debería crear un producto válido', async () => {
      const productData = {
        name: 'Tarta de Chocolate',
        description: 'Deliciosa tarta artesanal',
        price: 2500,
        category: 'tartas',
        stock: 10,
        image: 'chocolate-tart.jpg'
      };

      const product = new Product(productData);
      const savedProduct = await product.save();

      expect(savedProduct._id).toBeDefined();
      expect(savedProduct.name).toBe(productData.name);
      expect(savedProduct.price).toBe(productData.price);
      expect(savedProduct.stock).toBe(productData.stock);
      expect(savedProduct.isActive).toBe(true); // Valor por defecto
    });

    test('debería requerir campos obligatorios', async () => {
      const product = new Product({});

      let error;
      try {
        await product.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.name).toBeDefined();
      expect(error.errors.price).toBeDefined();
      expect(error.errors.category).toBeDefined();
    });

    test('debería validar precio positivo', async () => {
      const product = new Product({
        name: 'Test Product',
        description: 'Test',
        price: -100,
        category: 'tortas',
        stock: 10
      });

      let error;
      try {
        await product.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
    });

    test('debería validar stock no negativo', async () => {
      const product = new Product({
        name: 'Test Product',
        description: 'Test',
        price: 1000,
        category: 'tortas',
        stock: -5
      });

      let error;
      try {
        await product.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
    });

    test('debería aceptar categorías válidas', async () => {
      const categories = ['tortas', 'tartas', 'pasteles', 'galletas', 'brownies', 'alfajores'];

      for (const category of categories) {
        const product = await Product.create({
          name: `Test ${category}`,
          description: 'Test',
          price: 1000,
          category: category,
          stock: 10
        });

        expect(product.category).toBe(category);
      }
    });

    test('no debería aceptar categorías inválidas', async () => {
      const product = new Product({
        name: 'Test Product',
        description: 'Test',
        price: 1000,
        category: 'categoria-invalida',
        stock: 10
      });

      let error;
      try {
        await product.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.category).toBeDefined();
    });
  });

  describe('Product Fields', () => {
    test('debería tener valores por defecto correctos', async () => {
      const product = await Product.create({
        name: 'Test Product',
        description: 'Test description',
        price: 1500,
        category: 'tortas'
      });

      expect(product.stock).toBe(0); // Default
      expect(product.isActive).toBe(true); // Default
      expect(product.image).toBe('default-product.jpg'); // Default
    });

    test('debería almacenar múltiples imágenes', async () => {
      const images = ['image1.jpg', 'image2.jpg', 'image3.jpg'];
      
      const product = await Product.create({
        name: 'Multi Image Product',
        description: 'Test',
        price: 2000,
        category: 'tortas',
        images: images
      });

      expect(product.images).toBeDefined();
      expect(Array.isArray(product.images)).toBe(true);
      expect(product.images.length).toBe(3);
      expect(product.images).toEqual(images);
    });

    test('debería almacenar seller si está presente', async () => {
      const product = await Product.create({
        name: 'Seller Product',
        description: 'Test',
        price: 1000,
        category: 'tortas',
        seller: '507f1f77bcf86cd799439011' // Mock ObjectId
      });

      expect(product.seller).toBeDefined();
    });
  });

  describe('Product Updates', () => {
    test('debería actualizar precio del producto', async () => {
      const product = await Product.create({
        name: 'Price Test',
        description: 'Test',
        price: 1000,
        category: 'tortas',
        stock: 10
      });

      product.price = 1500;
      await product.save();

      const updated = await Product.findById(product._id);
      expect(updated.price).toBe(1500);
    });

    test('debería actualizar stock del producto', async () => {
      const product = await Product.create({
        name: 'Stock Test',
        description: 'Test',
        price: 1000,
        category: 'tortas',
        stock: 10
      });

      product.stock = 5;
      await product.save();

      const updated = await Product.findById(product._id);
      expect(updated.stock).toBe(5);
    });

    test('debería poder desactivar producto', async () => {
      const product = await Product.create({
        name: 'Active Test',
        description: 'Test',
        price: 1000,
        category: 'tortas',
        stock: 10
      });

      product.isActive = false;
      await product.save();

      const updated = await Product.findById(product._id);
      expect(updated.isActive).toBe(false);
    });

    test('debería actualizar múltiples campos', async () => {
      const product = await Product.create({
        name: 'Multi Update',
        description: 'Original',
        price: 1000,
        category: 'tortas',
        stock: 10
      });

      product.name = 'Updated Name';
      product.description = 'Updated Description';
      product.price = 2000;
      product.stock = 20;
      await product.save();

      const updated = await Product.findById(product._id);
      expect(updated.name).toBe('Updated Name');
      expect(updated.description).toBe('Updated Description');
      expect(updated.price).toBe(2000);
      expect(updated.stock).toBe(20);
    });
  });

  describe('Product Deletion', () => {
    test('debería eliminar un producto', async () => {
      const product = await Product.create({
        name: 'To Delete',
        description: 'Test',
        price: 1000,
        category: 'tortas',
        stock: 10
      });

      await Product.findByIdAndDelete(product._id);

      const deleted = await Product.findById(product._id);
      expect(deleted).toBeNull();
    });

    test('debería eliminar múltiples productos', async () => {
      await Product.create([
        { name: 'Delete 1', description: 'Test', price: 1000, category: 'tortas' },
        { name: 'Delete 2', description: 'Test', price: 1000, category: 'tortas' },
        { name: 'Delete 3', description: 'Test', price: 1000, category: 'tortas' }
      ]);

      await Product.deleteMany({ name: { $regex: /^Delete/ } });

      const remaining = await Product.find({ name: { $regex: /^Delete/ } });
      expect(remaining.length).toBe(0);
    });
  });

  describe('Product Queries', () => {
    beforeEach(async () => {
      await Product.create([
        { name: 'Tarta de Manzana', description: 'Tarta', price: 2000, category: 'tartas', stock: 10 },
        { name: 'Torta de Chocolate', description: 'Torta', price: 3000, category: 'tortas', stock: 5 },
        { name: 'Galletas de Avena', description: 'Galletas', price: 500, category: 'galletas', stock: 20 },
        { name: 'Brownie Especial', description: 'Brownie', price: 800, category: 'brownies', stock: 0 },
        { name: 'Alfajor de Maicena', description: 'Alfajor', price: 400, category: 'alfajores', stock: 15 }
      ]);
    });

    test('debería encontrar productos por categoría', async () => {
      const tartas = await Product.find({ category: 'tartas' });
      expect(tartas.length).toBe(1);
      expect(tartas[0].name).toBe('Tarta de Manzana');
    });

    test('debería encontrar productos con stock', async () => {
      const inStock = await Product.find({ stock: { $gt: 0 } });
      expect(inStock.length).toBe(4);
    });

    test('debería encontrar productos sin stock', async () => {
      const outOfStock = await Product.find({ stock: 0 });
      expect(outOfStock.length).toBe(1);
      expect(outOfStock[0].name).toBe('Brownie Especial');
    });

    test('debería buscar productos por nombre', async () => {
      const products = await Product.find({ name: { $regex: /chocolate/i } });
      expect(products.length).toBe(1);
      expect(products[0].name).toBe('Torta de Chocolate');
    });

    test('debería ordenar productos por precio', async () => {
      const products = await Product.find().sort({ price: 1 });
      expect(products[0].price).toBe(400); // El más barato
      expect(products[products.length - 1].price).toBe(3000); // El más caro
    });

    test('debería contar productos', async () => {
      const count = await Product.countDocuments();
      expect(count).toBe(5);
    });

    test('debería limitar resultados', async () => {
      const products = await Product.find().limit(2);
      expect(products.length).toBe(2);
    });

    test('debería encontrar productos en rango de precio', async () => {
      const products = await Product.find({
        price: { $gte: 500, $lte: 2000 }
      });
      expect(products.length).toBe(2);
    });
  });

  describe('Product Virtuals and Methods', () => {
    test('debería tener timestamp de creación', async () => {
      const product = await Product.create({
        name: 'Timestamp Test',
        description: 'Test',
        price: 1000,
        category: 'tortas'
      });

      expect(product.createdAt).toBeDefined();
      expect(product.createdAt).toBeInstanceOf(Date);
    });

    test('debería tener timestamp de actualización', async () => {
      const product = await Product.create({
        name: 'Update Timestamp',
        description: 'Test',
        price: 1000,
        category: 'tortas'
      });

      const originalUpdatedAt = product.updatedAt;

      // Esperar un momento y actualizar
      await new Promise(resolve => setTimeout(resolve, 100));
      
      product.price = 1500;
      await product.save();

      expect(product.updatedAt).toBeDefined();
      expect(product.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });
});
