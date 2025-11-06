import { body, validationResult } from 'express-validator';

// Middleware para manejar errores de validación
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errorMessages
    });
  }
  
  next();
};

// Validaciones para registro de usuario
export const validateRegistration = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios'),
    
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El apellido debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El apellido solo puede contener letras y espacios'),
    
  body('email')
    .trim()
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage('El email no puede tener más de 100 caracteres'),
    
  body('password')
    .isLength({ min: 6, max: 128 })
    .withMessage('La contraseña debe tener entre 6 y 128 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener al menos: una minúscula, una mayúscula y un número'),
    
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Las contraseñas no coinciden');
      }
      return true;
    }),
    
  body('phone')
    .optional()
    .trim()
    .matches(/^\+?[\d\s\-\(\)]+$/)
    .withMessage('Número de teléfono inválido')
    .isLength({ min: 8, max: 20 })
    .withMessage('El teléfono debe tener entre 8 y 20 caracteres'),
    
  body('address.street')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('La dirección no puede tener más de 200 caracteres'),
    
  body('address.city')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('La ciudad no puede tener más de 100 caracteres'),
    
  body('address.state')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('El estado/provincia no puede tener más de 100 caracteres'),
    
  body('address.zipCode')
    .optional()
    .trim()
    .matches(/^[\d\-\s]+$/)
    .withMessage('Código postal inválido')
    .isLength({ max: 20 })
    .withMessage('El código postal no puede tener más de 20 caracteres'),
    
  body('address.country')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('El país no puede tener más de 100 caracteres'),
    
  handleValidationErrors
];

// Validaciones para login
export const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),
    
  body('password')
    .notEmpty()
    .withMessage('La contraseña es obligatoria')
    .isLength({ min: 1 })
    .withMessage('La contraseña no puede estar vacía'),
    
  handleValidationErrors
];

// Validaciones para actualizar perfil
export const validateProfileUpdate = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios'),
    
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El apellido debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El apellido solo puede contener letras y espacios'),
    
  body('phone')
    .optional()
    .trim()
    .matches(/^\+?[\d\s\-\(\)]+$/)
    .withMessage('Número de teléfono inválido')
    .isLength({ min: 8, max: 20 })
    .withMessage('El teléfono debe tener entre 8 y 20 caracteres'),
    
  body('address.street')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('La dirección no puede tener más de 200 caracteres'),
    
  body('address.city')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('La ciudad no puede tener más de 100 caracteres'),
    
  body('address.state')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('El estado/provincia no puede tener más de 100 caracteres'),
    
  body('address.zipCode')
    .optional()
    .trim()
    .matches(/^[\d\-\s]+$/)
    .withMessage('Código postal inválido')
    .isLength({ max: 20 })
    .withMessage('El código postal no puede tener más de 20 caracteres'),
    
  body('address.country')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('El país no puede tener más de 100 caracteres'),
    
  handleValidationErrors
];

// Validaciones para cambio de contraseña
export const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('La contraseña actual es obligatoria'),
    
  body('newPassword')
    .isLength({ min: 6, max: 128 })
    .withMessage('La nueva contraseña debe tener entre 6 y 128 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La nueva contraseña debe contener al menos: una minúscula, una mayúscula y un número'),
    
  body('confirmNewPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Las contraseñas nuevas no coinciden');
      }
      return true;
    }),
    
  handleValidationErrors
];

// Validación de ObjectId de MongoDB
export const validateObjectId = (paramName) => {
  return (req, res, next) => {
    const id = req.params[paramName];
    
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: `ID inválido: ${paramName}`,
        data: null
      });
    }
    
    next();
  };
};

// Middleware para sanitizar datos de entrada
export const sanitizeInput = (req, res, next) => {
  // Función para limpiar strings
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str.trim().replace(/[<>]/g, '');
  };
  
  // Función recursiva para sanitizar objetos
  const sanitizeObject = (obj) => {
    if (obj === null || obj === undefined) return obj;
    
    if (typeof obj === 'string') {
      return sanitizeString(obj);
    }
    
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }
    
    if (typeof obj === 'object') {
      const sanitized = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitizeObject(value);
      }
      return sanitized;
    }
    
    return obj;
  };
  
  // Sanitizar body, query y params
  req.body = sanitizeObject(req.body);
  req.query = sanitizeObject(req.query);
  req.params = sanitizeObject(req.params);
  
  next();
};