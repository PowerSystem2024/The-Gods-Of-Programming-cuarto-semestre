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
 * Validaciones para crear producto
 */
export const validateCreateProduct = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-Z0-9\s\-\_\.\(\)\[\]]+$/)
    .withMessage('El nombre solo puede contener letras, números, espacios y algunos símbolos básicos'),

  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('La descripción debe tener entre 10 y 2000 caracteres'),

  body('price')
    .isFloat({ min: 0.01 })
    .withMessage('El precio debe ser un número positivo mayor a 0'),

  body('category')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('La categoría debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-Z\s\-\_]+$/)
    .withMessage('La categoría solo puede contener letras, espacios, guiones y guiones bajos'),

  body('subcategory')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('La subcategoría debe tener entre 2 y 50 caracteres'),

  body('brand')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('La marca debe tener entre 1 y 50 caracteres'),

  body('images')
    .optional()
    .isArray()
    .withMessage('Las imágenes deben ser un array'),

  body('images.*')
    .optional()
    .isURL()
    .withMessage('Cada imagen debe ser una URL válida'),

  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('El stock debe ser un número entero no negativo'),

  body('weight')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El peso debe ser un número positivo'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Las etiquetas deben ser un array'),

  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('Cada etiqueta debe tener entre 1 y 30 caracteres'),

  body('specifications')
    .optional()
    .isObject()
    .withMessage('Las especificaciones deben ser un objeto'),

  body('variants')
    .optional()
    .isArray()
    .withMessage('Las variantes deben ser un array'),

  body('dimensions')
    .optional()
    .isObject()
    .withMessage('Las dimensiones deben ser un objeto'),

  body('dimensions.length')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('La longitud debe ser un número positivo'),

  body('dimensions.width')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El ancho debe ser un número positivo'),

  body('dimensions.height')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('La altura debe ser un número positivo'),

  handleValidationErrors
];

/**
 * Validaciones para actualizar producto
 */
export const validateUpdateProduct = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-Z0-9\s\-\_\.\(\)\[\]]+$/)
    .withMessage('El nombre solo puede contener letras, números, espacios y algunos símbolos básicos'),

  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('La descripción debe tener entre 10 y 2000 caracteres'),

  body('price')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('El precio debe ser un número positivo mayor a 0'),

  body('category')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('La categoría debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-Z\s\-\_]+$/)
    .withMessage('La categoría solo puede contener letras, espacios, guiones y guiones bajos'),

  body('subcategory')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('La subcategoría debe tener entre 2 y 50 caracteres'),

  body('brand')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('La marca debe tener entre 1 y 50 caracteres'),

  body('images')
    .optional()
    .isArray()
    .withMessage('Las imágenes deben ser un array'),

  body('images.*')
    .optional()
    .isURL()
    .withMessage('Cada imagen debe ser una URL válida'),

  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('El stock debe ser un número entero no negativo'),

  body('weight')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El peso debe ser un número positivo'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Las etiquetas deben ser un array'),

  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('Cada etiqueta debe tener entre 1 y 30 caracteres'),

  body('specifications')
    .optional()
    .isObject()
    .withMessage('Las especificaciones deben ser un objeto'),

  body('variants')
    .optional()
    .isArray()
    .withMessage('Las variantes deben ser un array'),

  body('dimensions')
    .optional()
    .isObject()
    .withMessage('Las dimensiones deben ser un objeto'),

  body('dimensions.length')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('La longitud debe ser un número positivo'),

  body('dimensions.width')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El ancho debe ser un número positivo'),

  body('dimensions.height')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('La altura debe ser un número positivo'),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive debe ser un valor booleano'),

  handleValidationErrors
];