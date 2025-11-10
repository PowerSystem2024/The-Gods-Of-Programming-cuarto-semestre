import mongoose from 'mongoose';
const Product = mongoose.model('Product');

/**
 * @desc    Obtener todos los productos con filtros y paginación
 * @route   GET /api/products
 * @access  Public
 */
export const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      minPrice,
      maxPrice,
      search,
      sort = '-createdAt'
    } = req.query;

    // Construir filtro de búsqueda
    const filter = { status: 'active' };

    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    // Calcular skip para paginación
    const skip = (page - 1) * limit;

    // Ejecutar consulta con paginación
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate('reviews.user', 'firstName lastName');

    // Contar total de documentos
    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Productos obtenidos exitosamente',
      data: {
        products,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

/**
 * @desc    Obtener un producto por ID
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de producto inválido'
      });
    }

    const product = await Product.findById(id)
      .populate('reviews.user', 'firstName lastName');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    // Incrementar vistas del producto
    await Product.findByIdAndUpdate(id, { $inc: { views: 1 } });

    res.status(200).json({
      success: true,
      message: 'Producto obtenido exitosamente',
      data: { product }
    });
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

/**
 * @desc    Crear un nuevo producto
 * @route   POST /api/products
 * @access  Private (Seller/Admin)
 */
export const createProduct = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      name,
      description,
      price,
      category,
      subcategory,
      brand,
      images,
      specifications,
      variants,
      stock,
      dimensions,
      weight,
      tags,
      sku
    } = req.body;

    // Verificar si el SKU ya existe
    if (sku) {
      const existingSku = await Product.findOne({ sku });
      if (existingSku) {
        return res.status(400).json({
          success: false,
          message: 'El SKU ya existe'
        });
      }
    }

    // Crear nuevo producto con el seller
    const product = new Product({
      seller: userId,
      name,
      description,
      price,
      category,
      subcategory,
      brand,
      images: images || [],
      specifications: specifications || {},
      variants: variants || [],
      stock: stock || 0,
      dimensions: dimensions || {},
      weight,
      tags: tags || [],
      sku: sku || `SKU-${Date.now()}`,
      createdBy: req.user._id
    });

    const savedProduct = await product.save();
    await savedProduct.populate('seller', 'name email storeName');

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: { product: savedProduct }
    });
  } catch (error) {
    console.error('Error creando producto:', error);
    
    // Manejar errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message,
        value: err.value
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

/**
 * @desc    Actualizar un producto existente
 * @route   PUT /api/products/:id
 * @access  Private (Seller/Admin - solo propietario o admin)
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de producto inválido'
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    // Verificar que el usuario sea el vendedor del producto o admin
    if (userRole !== 'admin' && product.seller.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para editar este producto'
      });
    }

    // Actualizar campos permitidos (no permitir cambiar seller)
    const allowedUpdates = [
      'name', 'description', 'price', 'category', 'subcategory',
      'brand', 'images', 'specifications', 'variants', 'stock',
      'dimensions', 'weight', 'tags', 'isActive', 'sku', 'status',
      'unit', 'shortDescription', 'featured'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    product.updatedAt = Date.now();
    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: { product: updatedProduct }
    });
  } catch (error) {
    console.error('Error actualizando producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

/**
 * @desc    Eliminar un producto (soft delete)
 * @route   DELETE /api/products/:id
 * @access  Private (Seller/Admin - solo propietario o admin)
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de producto inválido'
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    // Verificar que el usuario sea el vendedor del producto o admin
    if (userRole !== 'admin' && product.seller.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para eliminar este producto'
      });
    }

    // Soft delete - marcar como inactivo
    product.status = 'inactive';
    product.isActive = false;
    product.updatedAt = Date.now();
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Producto eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

/**
 * @desc    Obtener productos relacionados
 * @route   GET /api/products/:id/related
 * @access  Public
 */
export const getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const limit = req.query.limit || 4;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    // Buscar productos relacionados por categoría
    const relatedProducts = await Product.find({
      _id: { $ne: id },
      category: product.category,
      isActive: true
    })
      .limit(Number(limit))
      .sort('-rating');

    res.status(200).json({
      success: true,
      message: 'Productos relacionados obtenidos exitosamente',
      data: { products: relatedProducts }
    });
  } catch (error) {
    console.error('Error obteniendo productos relacionados:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

/**
 * @desc    Obtener productos del vendedor autenticado
 * @route   GET /api/products/seller/my-products
 * @access  Private (Seller/Admin)
 */
export const getMyProducts = async (req, res) => {
  try {
    const userId = req.user.id;

    // Buscar todos los productos del vendedor
    const products = await Product.find({ seller: userId })
      .sort('-createdAt')
      .populate('seller', 'firstName lastName email storeName storeDescription');

    res.status(200).json({
      success: true,
      message: 'Productos obtenidos exitosamente',
      data: products
    });
  } catch (error) {
    console.error('Error obteniendo productos del vendedor:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};
