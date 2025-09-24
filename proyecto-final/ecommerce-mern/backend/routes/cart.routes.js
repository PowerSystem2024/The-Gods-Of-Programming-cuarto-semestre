import express from 'express';
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartSummary
} from '../controllers/cart.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { validateAddToCart, validateUpdateCartItem, validateRemoveFromCart } from '../middleware/cart.validation.js';

const router = express.Router();

// Todas las rutas del carrito requieren autenticación
router.use(verifyJWT);

/**
 * @route   POST /api/cart/add
 * @desc    Agregar producto al carrito
 * @access  Private
 */
router.post('/add', validateAddToCart, addToCart);

/**
 * @route   GET /api/cart
 * @desc    Obtener carrito del usuario autenticado
 * @access  Private
 */
router.get('/', getCart);

/**
 * @route   POST /api/cart/update
 * @desc    Actualizar cantidad de producto en el carrito
 * @access  Private
 */
router.post('/update', validateUpdateCartItem, updateCartItem);

/**
 * @route   DELETE /api/cart/remove
 * @desc    Eliminar producto específico del carrito
 * @access  Private
 */
router.delete('/remove', validateRemoveFromCart, removeFromCart);

/**
 * @route   DELETE /api/cart/clear
 * @desc    Vaciar completamente el carrito
 * @access  Private
 */
router.delete('/clear', clearCart);

/**
 * @route   GET /api/cart/summary
 * @desc    Obtener resumen del carrito para checkout
 * @access  Private
 */
router.get('/summary', getCartSummary);

export default router;