import { body, validationResult } from 'express-validator';

/**
 * Middleware para manejar errores de validación
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));

    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: formattedErrors
    });
  }
  next();
};

/**
 * Validaciones para agregar producto al carrito
 */
export const validateAddToCart = [
  body('productId')
    .notEmpty()
    .withMessage('El ID del producto es requerido')
    .isMongoId()
    .withMessage('El ID del producto debe ser un ObjectId válido'),

  body('quantity')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('La cantidad debe ser un número entero entre 1 y 100'),

  body('variantId')
    .optional()
    .isString()
    .isLength({ min: 1, max: 50 })
    .withMessage('El ID de variante debe ser una cadena válida'),

  handleValidationErrors
];

/**
 * Validaciones para actualizar item del carrito
 */
export const validateUpdateCartItem = [
  body('productId')
    .notEmpty()
    .withMessage('El ID del producto es requerido')
    .isMongoId()
    .withMessage('El ID del producto debe ser un ObjectId válido'),

  body('quantity')
    .isInt({ min: 1, max: 100 })
    .withMessage('La cantidad debe ser un número entero entre 1 y 100'),

  body('variantId')
    .optional()
    .isString()
    .isLength({ min: 1, max: 50 })
    .withMessage('El ID de variante debe ser una cadena válida'),

  handleValidationErrors
];

/**
 * Validaciones para eliminar producto del carrito
 */
export const validateRemoveFromCart = [
  body('productId')
    .notEmpty()
    .withMessage('El ID del producto es requerido')
    .isMongoId()
    .withMessage('El ID del producto debe ser un ObjectId válido'),

  body('variantId')
    .optional()
    .isString()
    .isLength({ min: 1, max: 50 })
    .withMessage('El ID de variante debe ser una cadena válida'),

  handleValidationErrors
];