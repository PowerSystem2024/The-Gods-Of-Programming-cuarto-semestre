import express from 'express';
import {
  createOrder,
  getOrderById,
  getUserOrders,
  cancelOrder,
  uploadPaymentProof,
  getAllOrders,
  updateOrderStatus
} from '../controllers/order.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verifyJWT);

// Rutas de usuario
router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);
router.put('/:id/payment-proof', uploadPaymentProof);

// Rutas de administrador
router.get('/admin/all', getAllOrders);
router.put('/admin/:id/status', updateOrderStatus);

export default router;
