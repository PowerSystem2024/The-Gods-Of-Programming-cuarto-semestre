import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getRelatedProducts,
  getMyProducts
} from '../controllers/product.controller.js';
import { verifyJWT, isAdmin } from '../middleware/auth.middleware.js';
import { validateCreateProduct, validateUpdateProduct } from '../middleware/product.validation.js';

const router = express.Router();

// Rutas protegidas - Vendedores y administradores (DEBEN IR PRIMERO)
/**
 * @route   GET /api/products/seller/my-products
 * @desc    Obtener mis productos (vendedor autenticado)
 * @access  Private (Seller/Admin)
 */
router.get('/seller/my-products', verifyJWT, getMyProducts);

// Rutas públicas
/**
 * @route   GET /api/products
 * @desc    Obtener todos los productos con filtros y paginación
 * @access  Public
 */
router.get('/', getAllProducts);

/**
 * @route   GET /api/products/:id/related
 * @desc    Obtener productos relacionados
 * @access  Public
 */
router.get('/:id/related', getRelatedProducts);

/**
 * @route   GET /api/products/:id
 * @desc    Obtener un producto específico por ID
 * @access  Public
 */
router.get('/:id', getProductById);

/**
 * @route   POST /api/products
 * @desc    Crear un nuevo producto
 * @access  Private (Seller/Admin)
 */
router.post('/', verifyJWT, validateCreateProduct, createProduct);

/**
 * @route   PUT /api/products/:id
 * @desc    Actualizar un producto existente
 * @access  Private (Seller/Admin - solo propietario o admin)
 */
router.put('/:id', verifyJWT, validateUpdateProduct, updateProduct);

/**
 * @route   DELETE /api/products/:id
 * @desc    Eliminar un producto (soft delete)
 * @access  Private (Seller/Admin - solo propietario o admin)
 */
router.delete('/:id', verifyJWT, deleteProduct);

export default router;