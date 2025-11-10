import express from 'express';
import {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  verifyToken,
  forgotPassword,
  resetPassword
} from '../controllers/auth.controller.js';

import {
  validateRegistration,
  validateLogin,
  validateProfileUpdate,
  validatePasswordChange,
  sanitizeInput
} from '../middleware/validation.middleware.js';

import {
  verifyJWT,
  refreshJWTIfNeeded,
  passportErrorHandler
} from '../middleware/auth.middleware.js';

const router = express.Router();

// Aplicar sanitización a todas las rutas
router.use(sanitizeInput);

// Rutas públicas de autenticación
router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Rutas protegidas (requieren autenticación)
router.use(verifyJWT); // Aplicar verificación JWT a todas las rutas siguientes
router.use(refreshJWTIfNeeded); // Refrescar token si es necesario

router.post('/logout', logout);
router.get('/profile', getProfile);
router.put('/profile', validateProfileUpdate, updateProfile);
router.put('/change-password', validatePasswordChange, changePassword);
router.get('/verify-token', verifyToken);

// Middleware para manejar errores de Passport
router.use(passportErrorHandler);

export default router;