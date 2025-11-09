import Order from '../models/order.model.js';
import User from '../models/user.model.js';

// Crear nueva orden
export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      items,
      contactInfo,
      shippingAddress,
      paymentMethod,
      notes
    } = req.body;

    // Validar que haya items
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No hay productos en la orden'
      });
    }

    // Calcular subtotales
    const itemsWithSubtotal = items.map(item => ({
      ...item,
      subtotal: item.price * item.quantity
    }));

    const subtotal = itemsWithSubtotal.reduce((sum, item) => sum + item.subtotal, 0);

    // Calcular costo de envío (ejemplo: gratis si es mayor a $50000, sino $5000)
    const shippingCost = subtotal >= 50000 ? 0 : 5000;

    const total = subtotal + shippingCost;

    // Generar número de orden único
    const orderNumber = await Order.generateOrderNumber();

    // Crear la orden
    const order = await Order.create({
      user: userId,
      orderNumber,
      items: itemsWithSubtotal,
      contactInfo,
      shippingAddress,
      paymentMethod,
      notes,
      subtotal,
      shippingCost,
      total,
      status: 'pendiente',
      paymentStatus: 'pendiente'
    });

    // Limpiar el carrito del usuario
    await User.findByIdAndUpdate(userId, { cart: [] });

    // Poblar la orden con datos del producto
    await order.populate('items.product', 'name images');

    // Obtener instrucciones de pago
    const paymentInstructions = order.getPaymentInstructions();

    res.status(201).json({
      success: true,
      message: 'Orden creada exitosamente',
      data: {
        order: {
          id: order._id,
          orderNumber: order.orderNumber,
          total: order.total,
          status: order.status,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          createdAt: order.createdAt
        },
        paymentInstructions
      }
    });

  } catch (error) {
    console.error('Error creando orden:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear la orden',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Obtener orden por ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const order = await Order.findOne({ 
      _id: id,
      user: userId 
    }).populate('items.product', 'name images');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
    }

    const paymentInstructions = order.getPaymentInstructions();

    res.json({
      success: true,
      data: {
        order,
        paymentInstructions
      }
    });

  } catch (error) {
    console.error('Error obteniendo orden:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener la orden',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Obtener todas las órdenes del usuario
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, status } = req.query;

    const query = { user: userId };
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error obteniendo órdenes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las órdenes',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Cancelar orden (solo si está pendiente)
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { reason } = req.body;

    const order = await Order.findOne({ 
      _id: id,
      user: userId 
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
    }

    // Solo se puede cancelar si está pendiente
    if (order.status !== 'pendiente') {
      return res.status(400).json({
        success: false,
        message: 'Solo se pueden cancelar órdenes pendientes'
      });
    }

    order.status = 'cancelada';
    order.cancelledAt = new Date();
    order.cancellationReason = reason || 'Cancelada por el usuario';
    await order.save();

    res.json({
      success: true,
      message: 'Orden cancelada exitosamente',
      data: { order }
    });

  } catch (error) {
    console.error('Error cancelando orden:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cancelar la orden',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Subir comprobante de pago (para transferencias)
export const uploadPaymentProof = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const order = await Order.findOne({ 
      _id: id,
      user: userId 
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
    }

    if (order.paymentMethod !== 'transferencia') {
      return res.status(400).json({
        success: false,
        message: 'Solo se puede subir comprobante para pagos por transferencia'
      });
    }

    // Aquí iría la lógica de subida de archivo
    // Por ahora, simplemente marcamos que se subió
    order.paymentProof = {
      filename: req.body.filename || 'comprobante.jpg',
      url: req.body.url || '/uploads/comprobantes/' + order.orderNumber + '.jpg',
      uploadedAt: new Date()
    };

    await order.save();

    res.json({
      success: true,
      message: 'Comprobante subido exitosamente',
      data: { order }
    });

  } catch (error) {
    console.error('Error subiendo comprobante:', error);
    res.status(500).json({
      success: false,
      message: 'Error al subir el comprobante',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ADMIN: Obtener todas las órdenes
export const getAllOrders = async (req, res) => {
  try {
    // Verificar que el usuario sea admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No autorizado'
      });
    }

    const { page = 1, limit = 20, status, paymentStatus } = req.query;

    const query = {};
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const orders = await Order.find(query)
      .populate('user', 'email name')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error obteniendo todas las órdenes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las órdenes',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ADMIN: Actualizar estado de orden
export const updateOrderStatus = async (req, res) => {
  try {
    // Verificar que el usuario sea admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No autorizado'
      });
    }

    const { id } = req.params;
    const { status, paymentStatus, trackingNumber, shippingCompany } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (shippingCompany) order.shippingCompany = shippingCompany;

    if (status === 'entregada') {
      order.deliveredAt = new Date();
    }

    await order.save();

    res.json({
      success: true,
      message: 'Orden actualizada exitosamente',
      data: { order }
    });

  } catch (error) {
    console.error('Error actualizando orden:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la orden',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
