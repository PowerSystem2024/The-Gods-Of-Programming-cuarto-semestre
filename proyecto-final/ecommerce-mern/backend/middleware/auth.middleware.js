import passport from 'passport';
import jwt from 'jsonwebtoken';

// Middleware para verificar autenticación con sesión
export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  
  return res.status(401).json({
    success: false,
    message: 'Debes iniciar sesión para acceder a este recurso'
  });
};

// Middleware para verificar autenticación con JWT
export const verifyJWT = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error de autenticación',
        error: err.message
      });
    }
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }
    
    req.user = user;
    next();
  })(req, res, next);
};

// Middleware para verificar rol de administrador
export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Autenticación requerida'
    });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requieren permisos de administrador'
    });
  }
  
  next();
};

// Middleware para verificar que el usuario es el propietario del recurso o admin
export const isOwnerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Autenticación requerida'
    });
  }
  
  const userId = req.params.userId || req.params.id;
  
  if (req.user.role === 'admin' || req.user._id.toString() === userId) {
    return next();
  }
  
  return res.status(403).json({
    success: false,
    message: 'Acceso denegado. Solo puedes acceder a tus propios recursos'
  });
};

// Middleware para generar JWT
export const generateJWT = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
    fullName: user.fullName
  };
  
  return jwt.sign(
    payload, 
    process.env.JWT_SECRET || 'jwt-secreto-desarrollo-123',
    { 
      expiresIn: process.env.JWT_EXPIRE || '7d',
      issuer: 'ecommerce-api',
      audience: 'ecommerce-users'
    }
  );
};

// Middleware para refrescar JWT si está próximo a expirar
export const refreshJWTIfNeeded = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.decode(token);
      const now = Date.now() / 1000;
      
      // Si el token expira en menos de 1 día, generar uno nuevo
      if (decoded.exp - now < 86400) {
        const newToken = generateJWT(req.user);
        res.setHeader('New-Token', newToken);
      }
    } catch (error) {
      console.log('No se pudo decodificar el token para refresh:', error.message);
    }
  }
  
  next();
};

// Middleware de manejo de errores para Passport
export const passportErrorHandler = (err, req, res, next) => {
  if (err.name === 'AuthenticationError') {
    return res.status(401).json({
      success: false,
      message: 'Error de autenticación',
      error: err.message
    });
  }
  
  next(err);
};