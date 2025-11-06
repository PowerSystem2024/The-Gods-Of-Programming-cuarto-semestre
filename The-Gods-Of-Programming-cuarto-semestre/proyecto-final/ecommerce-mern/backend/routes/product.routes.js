import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getRelatedProducts
} from '../controllers/product.controller.js';
import { verifyJWT, isAdmin } from '../middleware/auth.middleware.js';
import { validateCreateProduct, validateUpdateProduct } from '../middleware/product.validation.js';

const router = express.Router();

// Rutas públicas
/**
 * @route   GET /api/products
 * @desc    Obtener todos los productos con filtros y paginación
 * @access  Public
 */
router.get('/', getAllProducts);

/**
 * @route   GET /api/products/:id
 * @desc    Obtener un producto específico por ID
 * @access  Public
 */
router.get('/:id', getProductById);

/**
 * @route   GET /api/products/:id/related
 * @desc    Obtener productos relacionados
 * @access  Public
 */
router.get('/:id/related', getRelatedProducts);

// Rutas protegidas - Solo administradores
/**
 * @route   POST /api/products
 * @desc    Crear un nuevo producto
 * @access  Private (Admin only)
 */
router.post('/', verifyJWT, isAdmin, validateCreateProduct, createProduct);

/**
 * @route   PUT /api/products/:id
 * @desc    Actualizar un producto existente
 * @access  Private (Admin only)
 */
router.put('/:id', verifyJWT, isAdmin, validateUpdateProduct, updateProduct);

/**
 * @route   DELETE /api/products/:id
 * @desc    Eliminar un producto (soft delete)
 * @access  Private (Admin only)
 */
router.delete('/:id', verifyJWT, isAdmin, deleteProduct);

export default router;