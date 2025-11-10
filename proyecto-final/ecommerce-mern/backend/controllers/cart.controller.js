import mongoose from 'mongoose';
const User = mongoose.model('User');
const Product = mongoose.model('Product');

/**
 * @desc    Agregar producto al carrito
 * @route   POST /api/cart/add
 * @access  Private
 */
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, variantId } = req.body;
    const userId = req.user && req.user._id;

    console.log('addToCart called', { userId: userId?.toString(), productId, quantity, variantId });

    // Validar ObjectId del producto
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'ID de producto inválido'
      });
    }

    // Verificar que el producto existe
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    // Verificar que el producto está activo (usar status en lugar de isActive)
    if (product.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Este producto no está disponible'
      });
    }

    // Verificar stock disponible usando inventory.quantity
    const availableStock = product.inventory && typeof product.inventory.quantity === 'number'
      ? product.inventory.quantity
      : 0;

    if (availableStock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Stock insuficiente. Solo hay ${availableStock} unidades disponibles`
      });
    }

    // Obtener usuario con carrito
    const user = await User.findById(userId);

    // Verificar si el producto ya está en el carrito
    const existingItemIndex = user.cart.findIndex(item => 
      item.product.toString() === productId && 
      (variantId ? item.variantId === variantId : !item.variantId)
    );

    if (existingItemIndex > -1) {
      // Producto ya existe en el carrito, actualizar cantidad
      const newQuantity = user.cart[existingItemIndex].quantity + quantity;
      
      // Verificar stock para la nueva cantidad
      if (availableStock < newQuantity) {
        return res.status(400).json({
          success: false,
          message: `No se puede agregar más cantidad. Stock máximo disponible: ${availableStock}`
        });
      }

      user.cart[existingItemIndex].quantity = newQuantity;
      user.cart[existingItemIndex].addedAt = new Date();
    } else {
      // Agregar nuevo producto al carrito
      const cartItem = {
        product: productId,
        quantity,
        variantId: variantId || null,
        addedAt: new Date()
      };

      user.cart.push(cartItem);
    }

  await user.save();

    // Poblar datos del carrito para la respuesta
    await user.populate({
      path: 'cart.product',
      select: 'name price images category inventory'
    });

    // Mapear para incluir stock
    const cartWithStock = user.cart.map(item => ({
      ...item.toObject(),
      product: {
        ...item.product.toObject(),
        stock: item.product.inventory ? item.product.inventory.quantity : 0
      }
    }));

    res.status(200).json({
      success: true,
      message: 'Producto agregado al carrito exitosamente',
      data: {
        cart: cartWithStock,
        itemsCount: user.cart.length
      }
    });
  } catch (error) {
    console.error('Error agregando al carrito:', error && error.stack ? error.stack : error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

/**
 * @desc    Obtener carrito del usuario
 * @route   GET /api/cart
 * @access  Private
 */
export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId)
      .populate({
        path: 'cart.product',
        select: 'name price images category inventory status',
        match: { status: 'active' }
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Filtrar items con productos inactivos o eliminados
    user.cart = user.cart.filter(item => item.product);

    await user.save();

    // Mapear para incluir stock
    const cartWithStock = user.cart.map(item => ({
      ...item.toObject(),
      product: {
        ...item.product.toObject(),
        stock: item.product.inventory ? item.product.inventory.quantity : 0
      }
    }));

    res.status(200).json({
      success: true,
      message: 'Carrito obtenido exitosamente',
      data: {
        cart: cartWithStock,
        itemsCount: user.cart.length
      }
    });
  } catch (error) {
    console.error('Error obteniendo carrito:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

/**
 * @desc    Actualizar cantidad de producto en el carrito
 * @route   POST /api/cart/update
 * @access  Private
 */
export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity, variantId } = req.body;
    const userId = req.user._id;

    // Validar cantidad
    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'La cantidad debe ser mayor a 0'
      });
    }

    // Validar ObjectId del producto
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'ID de producto inválido'
      });
    }

    // Verificar stock disponible
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Stock insuficiente. Solo hay ${product.stock} unidades disponibles`
      });
    }

    // Obtener usuario
    const user = await User.findById(userId);

    // Buscar el item en el carrito
    const itemIndex = user.cart.findIndex(item => 
      item.product.toString() === productId && 
      (variantId ? item.variantId === variantId : !item.variantId)
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado en el carrito'
      });
    }

    // Actualizar cantidad
    user.cart[itemIndex].quantity = quantity;
    user.cart[itemIndex].addedAt = new Date();

    await user.save();

    // Poblar datos del carrito
    await user.populate({
      path: 'cart.product',
      select: 'name price images category inventory'
    });

    // Mapear para incluir stock
    const cartWithStock = user.cart.map(item => ({
      ...item.toObject(),
      product: {
        ...item.product.toObject(),
        stock: item.product.inventory ? item.product.inventory.quantity : 0
      }
    }));

    res.status(200).json({
      success: true,
      message: 'Carrito actualizado exitosamente',
      data: {
        cart: cartWithStock,
        itemsCount: user.cart.length
      }
    });
  } catch (error) {
    console.error('Error actualizando carrito:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

/**
 * @desc    Eliminar producto del carrito
 * @route   DELETE /api/cart/remove
 * @access  Private
 */
export const removeFromCart = async (req, res) => {
  try {
    const { productId, variantId } = req.body;
    const userId = req.user._id;

    // Validar ObjectId del producto
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'ID de producto inválido'
      });
    }

    // Obtener usuario
    const user = await User.findById(userId);

    // Buscar el item en el carrito
    const itemIndex = user.cart.findIndex(item => 
      item.product.toString() === productId && 
      (variantId ? item.variantId === variantId : !item.variantId)
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado en el carrito'
      });
    }

    // Eliminar item del carrito
    user.cart.splice(itemIndex, 1);

    await user.save();

    // Poblar datos del carrito
    await user.populate({
      path: 'cart.product',
      select: 'name price images category inventory'
    });

    // Mapear para incluir stock
    const cartWithStock = user.cart.map(item => ({
      ...item.toObject(),
      product: {
        ...item.product.toObject(),
        stock: item.product.inventory ? item.product.inventory.quantity : 0
      }
    }));

    res.status(200).json({
      success: true,
      message: 'Producto eliminado del carrito exitosamente',
      data: {
        cart: cartWithStock,
        itemsCount: user.cart.length
      }
    });
  } catch (error) {
    console.error('Error eliminando del carrito:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

/**
 * @desc    Vaciar todo el carrito
 * @route   DELETE /api/cart/clear
 * @access  Private
 */
export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    // Obtener usuario
    const user = await User.findById(userId);

    // Vaciar carrito
    user.cart = [];

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Carrito vaciado exitosamente',
      data: {
        cart: user.cart,
        itemsCount: 0
      }
    });
  } catch (error) {
    console.error('Error vaciando carrito:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

/**
 * @desc    Obtener resumen del carrito (para checkout)
 * @route   GET /api/cart/summary
 * @access  Private
 */
export const getCartSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId)
      .populate({
        path: 'cart.product',
        select: 'name price images category inventory status'
      });

    // Verificar disponibilidad de productos
    const unavailableItems = [];
    const availableItems = [];

    user.cart.forEach(item => {
      const stock = item.product?.inventory ? item.product.inventory.quantity : 0;
      
      if (!item.product || item.product.status !== 'active') {
        unavailableItems.push({
          name: item.product?.name || 'Producto eliminado',
          reason: 'Producto no disponible'
        });
      } else if (stock < item.quantity) {
        unavailableItems.push({
          name: item.product.name,
          reason: `Stock insuficiente (disponible: ${stock})`
        });
      } else {
        availableItems.push(item);
      }
    });

    // Calcular totales solo con items disponibles
    const totalAmount = availableItems.reduce((sum, item) => 
      sum + (item.quantity * item.product.price), 0
    );

    const summary = {
      totalItems: availableItems.length,
      totalAmount,
      availableItems: availableItems.length,
      unavailableItems: unavailableItems.length,
      issues: unavailableItems,
      canCheckout: unavailableItems.length === 0 && availableItems.length > 0
    };

    res.status(200).json({
      success: true,
      message: 'Resumen del carrito obtenido exitosamente',
      data: { summary }
    });
  } catch (error) {
    console.error('Error obteniendo resumen del carrito:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};