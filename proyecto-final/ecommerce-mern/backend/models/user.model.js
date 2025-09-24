import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    maxlength: [50, 'El nombre no puede tener más de 50 caracteres']
  },
  lastName: {
    type: String,
    required: [true, 'El apellido es obligatorio'],
    trim: true,
    maxlength: [50, 'El apellido no puede tener más de 50 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingresa un email válido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    select: false // No incluir en las consultas por defecto
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s-()]+$/, 'Por favor ingresa un número de teléfono válido']
  },
  address: {
    street: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    zipCode: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true,
      default: 'Argentina'
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  avatar: {
    type: String,
    default: null
  },
  lastLogin: {
    type: Date,
    default: null
  },
  cart: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'La cantidad debe ser al menos 1'],
      default: 1
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  orderHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual para el nombre completo
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual para calcular el total de items en el carrito
userSchema.virtual('cartItemsCount').get(function() {
  return this.cart.reduce((total, item) => total + item.quantity, 0);
});

// Índices para optimizar consultas
userSchema.index({ email: 1 });
userSchema.index({ firstName: 1, lastName: 1 });
userSchema.index({ role: 1 });

// Middleware para hashear la contraseña antes de guardar
userSchema.pre('save', async function(next) {
  // Solo hashear la contraseña si ha sido modificada
  if (!this.isModified('password')) return next();
  
  try {
    // Generar salt y hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Método para obtener información pública del usuario
userSchema.methods.toPublicJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

// Método para añadir producto al carrito
userSchema.methods.addToCart = function(productId, quantity = 1) {
  const existingItem = this.cart.find(item => 
    item.product.toString() === productId.toString()
  );
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.cart.push({
      product: productId,
      quantity: quantity
    });
  }
  
  return this.save();
};

// Método para remover producto del carrito
userSchema.methods.removeFromCart = function(productId) {
  this.cart = this.cart.filter(item => 
    item.product.toString() !== productId.toString()
  );
  return this.save();
};

// Método para limpiar el carrito
userSchema.methods.clearCart = function() {
  this.cart = [];
  return this.save();
};

// Método para actualizar cantidad en el carrito
userSchema.methods.updateCartQuantity = function(productId, quantity) {
  const item = this.cart.find(item => 
    item.product.toString() === productId.toString()
  );
  
  if (item) {
    if (quantity <= 0) {
      return this.removeFromCart(productId);
    } else {
      item.quantity = quantity;
      return this.save();
    }
  }
  
  return Promise.resolve(this);
};

const User = mongoose.model('User', userSchema);
export default User;