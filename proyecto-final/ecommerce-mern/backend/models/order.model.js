import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  // Usuario que realizó la orden
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Número de orden único
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },

  // Productos en la orden
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    image: String,
    subtotal: {
      type: Number,
      required: true
    }
  }],

  // Información de contacto
  contactInfo: {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    dni: {
      type: String,
      required: true,
      trim: true
    }
  },

  // Dirección de envío
  shippingAddress: {
    street: {
      type: String,
      required: true,
      trim: true
    },
    number: {
      type: String,
      required: true,
      trim: true
    },
    floor: {
      type: String,
      trim: true
    },
    apartment: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    province: {
      type: String,
      required: true,
      trim: true
    },
    postalCode: {
      type: String,
      required: true,
      trim: true
    },
    additionalInfo: {
      type: String,
      trim: true
    }
  },

  // Método de pago
  paymentMethod: {
    type: String,
    enum: ['transferencia', 'efectivo', 'pago_facil'],
    required: true
  },

  // Estado del pago
  paymentStatus: {
    type: String,
    enum: ['pendiente', 'confirmado', 'rechazado'],
    default: 'pendiente'
  },

  // Comprobante de pago (para transferencias)
  paymentProof: {
    filename: String,
    url: String,
    uploadedAt: Date
  },

  // Totales
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  shippingCost: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },

  // Estado de la orden
  status: {
    type: String,
    enum: ['pendiente', 'confirmada', 'en_preparacion', 'enviada', 'entregada', 'cancelada'],
    default: 'pendiente'
  },

  // Notas adicionales
  notes: {
    type: String,
    trim: true
  },

  // Información de envío
  trackingNumber: {
    type: String,
    trim: true
  },
  shippingCompany: {
    type: String,
    trim: true
  },

  // Fechas importantes
  estimatedDeliveryDate: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  cancellationReason: String

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual para el nombre completo del cliente
orderSchema.virtual('customerFullName').get(function() {
  return `${this.contactInfo.firstName} ${this.contactInfo.lastName}`;
});

// Virtual para la dirección completa
orderSchema.virtual('fullAddress').get(function() {
  const addr = this.shippingAddress;
  let address = `${addr.street} ${addr.number}`;
  if (addr.floor) address += `, Piso ${addr.floor}`;
  if (addr.apartment) address += `, Depto ${addr.apartment}`;
  address += `, ${addr.city}, ${addr.province}, CP ${addr.postalCode}`;
  return address;
});

// Índices para búsquedas eficientes
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ 'contactInfo.email': 1 });

// Método estático para generar número de orden único
orderSchema.statics.generateOrderNumber = async function() {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  // Contar órdenes del día para generar secuencial
  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
  
  const count = await this.countDocuments({
    createdAt: { $gte: startOfDay, $lt: endOfDay }
  });
  
  const sequence = String(count + 1).padStart(4, '0');
  
  return `ORD-${year}${month}${day}-${sequence}`;
};

// Método para calcular el total
orderSchema.methods.calculateTotal = function() {
  this.subtotal = this.items.reduce((sum, item) => sum + item.subtotal, 0);
  this.total = this.subtotal + this.shippingCost;
  return this.total;
};

// Método para obtener información de pago según el método
orderSchema.methods.getPaymentInstructions = function() {
  const instructions = {
    transferencia: {
      title: 'Transferencia Bancaria',
      description: 'Realiza la transferencia a la siguiente cuenta:',
      details: {
        banco: 'Banco Nación Argentina',
        titular: 'E-Commerce MERN S.A.',
        cbu: '0110599520000001234567',
        alias: 'ECOMMERCE.MERN',
        cuit: '30-12345678-9'
      },
      instructions: [
        'Realiza la transferencia por el monto total',
        'Guarda el comprobante de la transferencia',
        'Envía el comprobante a pagos@ecommerce.com',
        'Tu pedido será procesado una vez confirmado el pago'
      ]
    },
    efectivo: {
      title: 'Pago en Efectivo',
      description: 'Paga en efectivo al momento de recibir tu pedido',
      details: {
        metodo: 'Efectivo contra entrega',
        importante: 'Ten el monto exacto preparado'
      },
      instructions: [
        'El pago se realizará al momento de la entrega',
        'Ten preparado el monto exacto de $' + this.total.toFixed(2),
        'El delivery aceptará billetes de hasta $2000',
        'Recibirás tu comprobante fiscal al pagar'
      ]
    },
    pago_facil: {
      title: 'Pago Fácil / RapiPago',
      description: 'Paga en cualquier sucursal de Pago Fácil o RapiPago',
      details: {
        empresa: 'E-COMMERCE MERN',
        codigoEmpresa: '12345',
        numeroCliente: this.orderNumber,
        importe: '$' + this.total.toFixed(2)
      },
      instructions: [
        'Acércate a cualquier sucursal de Pago Fácil o RapiPago',
        'Indica que quieres pagar a "E-COMMERCE MERN"',
        `Proporciona el código de pago: ${this.orderNumber}`,
        'Guarda el comprobante de pago',
        'Tu pedido será procesado en 24-48hs hábiles'
      ]
    }
  };

  return instructions[this.paymentMethod] || null;
};

const Order = mongoose.model('Order', orderSchema);

export default Order;
