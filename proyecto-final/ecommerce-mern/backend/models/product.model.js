import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'La calificación es obligatoria'],
    min: [1, 'La calificación mínima es 1'],
    max: [5, 'La calificación máxima es 5']
  },
  comment: {
    type: String,
    required: [true, 'El comentario es obligatorio'],
    maxlength: [500, 'El comentario no puede tener más de 500 caracteres']
  },
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del producto es obligatorio'],
    trim: true,
    maxlength: [200, 'El nombre no puede tener más de 200 caracteres']
  },
  description: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    maxlength: [2000, 'La descripción no puede tener más de 2000 caracteres']
  },
  shortDescription: {
    type: String,
    maxlength: [300, 'La descripción corta no puede tener más de 300 caracteres']
  },
  price: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo']
  },
  comparePrice: {
    type: Number,
    min: [0, 'El precio de comparación no puede ser negativo']
  },
  cost: {
    type: Number,
    min: [0, 'El costo no puede ser negativo']
  },
  sku: {
    type: String,
    required: [true, 'El SKU es obligatorio'],
    unique: true,
    trim: true,
    uppercase: true
  },
  barcode: {
    type: String,
    trim: true
  },
  category: {
    main: {
      type: String,
      required: [true, 'La categoría principal es obligatoria'],
      trim: true
    },
    subcategory: {
      type: String,
      trim: true
    }
  },
  brand: {
    type: String,
    trim: true,
    maxlength: [100, 'La marca no puede tener más de 100 caracteres']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  inventory: {
    quantity: {
      type: Number,
      required: [true, 'La cantidad en inventario es obligatoria'],
      min: [0, 'La cantidad no puede ser negativa'],
      default: 0
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
      min: [0, 'El umbral de stock bajo no puede ser negativo']
    },
    trackQuantity: {
      type: Boolean,
      default: true
    },
    allowBackorder: {
      type: Boolean,
      default: false
    }
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    weight: Number,
    unit: {
      type: String,
      enum: ['cm', 'in', 'mm'],
      default: 'cm'
    },
    weightUnit: {
      type: String,
      enum: ['kg', 'g', 'lb', 'oz'],
      default: 'kg'
    }
  },
  variants: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    options: [{
      value: {
        type: String,
        required: true,
        trim: true
      },
      price: {
        type: Number,
        default: 0
      },
      sku: {
        type: String,
        trim: true,
        uppercase: true
      },
      inventory: {
        type: Number,
        default: 0,
        min: 0
      }
    }]
  }],
  seo: {
    title: String,
    description: String,
    keywords: [String],
    slug: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true
    }
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'archived', 'out_of_stock'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  isDigital: {
    type: Boolean,
    default: false
  },
  reviews: [reviewSchema],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  sales: {
    totalSold: {
      type: Number,
      default: 0,
      min: 0
    },
    totalRevenue: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual para calcular el descuento
productSchema.virtual('discountPercentage').get(function() {
  if (this.comparePrice && this.comparePrice > this.price) {
    return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
  }
  return 0;
});

// Virtual para verificar si está en stock
productSchema.virtual('isInStock').get(function() {
  if (!this.inventory.trackQuantity) return true;
  return this.inventory.quantity > 0 || this.inventory.allowBackorder;
});

// Virtual para verificar stock bajo
productSchema.virtual('isLowStock').get(function() {
  if (!this.inventory.trackQuantity) return false;
  return this.inventory.quantity <= this.inventory.lowStockThreshold;
});

// Virtual para la imagen principal
productSchema.virtual('primaryImage').get(function() {
  const primaryImg = this.images.find(img => img.isPrimary);
  return primaryImg || (this.images.length > 0 ? this.images[0] : null);
});

// Índices para optimizar consultas
productSchema.index({ name: 'text', description: 'text', 'category.main': 'text' });
productSchema.index({ 'category.main': 1, 'category.subcategory': 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ featured: 1 });
productSchema.index({ status: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ createdAt: -1 });

// Middleware para generar slug automáticamente
productSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.seo.slug) {
    this.seo.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

// Middleware para actualizar el rating promedio
productSchema.methods.updateRating = function() {
  if (this.reviews.length === 0) {
    this.rating.average = 0;
    this.rating.count = 0;
  } else {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating.average = Math.round((totalRating / this.reviews.length) * 10) / 10;
    this.rating.count = this.reviews.length;
  }
  return this.save();
};

// Método para añadir una reseña
productSchema.methods.addReview = function(userId, rating, comment, isVerifiedPurchase = false) {
  // Verificar si el usuario ya dejó una reseña
  const existingReview = this.reviews.find(review => 
    review.user.toString() === userId.toString()
  );
  
  if (existingReview) {
    throw new Error('Ya has dejado una reseña para este producto');
  }
  
  this.reviews.push({
    user: userId,
    rating,
    comment,
    isVerifiedPurchase
  });
  
  return this.updateRating();
};

// Método para reducir inventario
productSchema.methods.reduceInventory = function(quantity) {
  if (this.inventory.trackQuantity) {
    if (this.inventory.quantity < quantity && !this.inventory.allowBackorder) {
      throw new Error('Stock insuficiente');
    }
    this.inventory.quantity -= quantity;
  }
  
  this.sales.totalSold += quantity;
  this.sales.totalRevenue += (this.price * quantity);
  
  return this.save();
};

// Método para aumentar inventario
productSchema.methods.increaseInventory = function(quantity) {
  if (this.inventory.trackQuantity) {
    this.inventory.quantity += quantity;
  }
  return this.save();
};

// Método para verificar disponibilidad
productSchema.methods.checkAvailability = function(requestedQuantity = 1) {
  if (this.status !== 'active') {
    return { available: false, reason: 'Producto no activo' };
  }
  
  if (!this.inventory.trackQuantity) {
    return { available: true };
  }
  
  if (this.inventory.quantity >= requestedQuantity) {
    return { available: true };
  }
  
  if (this.inventory.allowBackorder) {
    return { 
      available: true, 
      backorder: true,
      availableQuantity: this.inventory.quantity,
      backorderQuantity: requestedQuantity - this.inventory.quantity
    };
  }
  
  return { 
    available: false, 
    reason: 'Stock insuficiente',
    availableQuantity: this.inventory.quantity
  };
};

const Product = mongoose.model('Product', productSchema);
export default Product;