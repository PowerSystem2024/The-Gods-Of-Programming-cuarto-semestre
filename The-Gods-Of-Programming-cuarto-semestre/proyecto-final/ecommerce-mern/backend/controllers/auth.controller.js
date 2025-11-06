import passport from 'passport';
import { generateJWT } from '../middleware/auth.middleware.js';
import User from '../models/user.model.js';

// Registrar nuevo usuario
export const register = async (req, res, next) => {
  passport.authenticate('local-register', { session: false }, async (err, user, info) => {
    try {
      if (err) {
        console.error('Error en registro:', err);
        return res.status(500).json({
          success: false,
          message: 'Error interno del servidor',
          error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
      }

      if (!user) {
        return res.status(400).json({
          success: false,
          message: info ? info.message : 'Error en el registro',
          data: null
        });
      }

      // Generar JWT para el usuario recién registrado
      const token = generateJWT(user);
      
      // Log de registro exitoso
      console.log(`✅ Usuario registrado exitosamente: ${user.email}`);

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: {
          user: user.toPublicJSON(),
          token: token,
          expiresIn: process.env.JWT_EXPIRE || '7d'
        }
      });

    } catch (error) {
      console.error('Error en controlador de registro:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  })(req, res, next);
};

// Iniciar sesión
export const login = async (req, res, next) => {
  passport.authenticate('local-login', { session: false }, async (err, user, info) => {
    try {
      if (err) {
        console.error('Error en login:', err);
        return res.status(500).json({
          success: false,
          message: 'Error interno del servidor',
          error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: info ? info.message : 'Credenciales inválidas',
          data: null
        });
      }

      // Generar JWT para el usuario
      const token = generateJWT(user);
      
      // Actualizar última fecha de login (opcional)
      user.lastLogin = new Date();
      await user.save();
      
      // Log de login exitoso
      console.log(`✅ Login exitoso: ${user.email}`);

      res.status(200).json({
        success: true,
        message: 'Login exitoso',
        data: {
          user: user.toPublicJSON(),
          token: token,
          expiresIn: process.env.JWT_EXPIRE || '7d'
        }
      });

    } catch (error) {
      console.error('Error en controlador de login:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  })(req, res, next);
};

// Cerrar sesión
export const logout = async (req, res) => {
  try {
    // En JWT, el logout se maneja en el frontend eliminando el token
    // Aquí podríamos implementar una lista negra de tokens si fuera necesario
    
    if (req.user) {
      console.log(`✅ Logout: ${req.user.email}`);
    }

    res.status(200).json({
      success: true,
      message: 'Sesión cerrada exitosamente',
      data: null
    });

  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      success: false,
      message: 'Error cerrando sesión',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Obtener perfil del usuario autenticado
export const getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado',
        data: null
      });
    }

    // Obtener datos completos del usuario
    const user = await User.findById(req.user._id)
      .populate('cart.product', 'name price images')
      .populate('wishlist', 'name price images')
      .populate('orderHistory');

    res.status(200).json({
      success: true,
      message: 'Perfil obtenido exitosamente',
      data: {
        user: user.toPublicJSON()
      }
    });

  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo perfil del usuario',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Actualizar perfil del usuario
export const updateProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado',
        data: null
      });
    }

    const allowedUpdates = ['firstName', 'lastName', 'phone', 'address'];
    const updates = {};
    
    // Filtrar solo los campos permitidos
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionaron campos válidos para actualizar',
        data: null
      });
    }

    // Actualizar usuario
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, 
      updates, 
      { new: true, runValidators: true }
    );

    console.log(`✅ Perfil actualizado: ${updatedUser.email}`);

    res.status(200).json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: {
        user: updatedUser.toPublicJSON()
      }
    });

  } catch (error) {
    console.error('Error actualizando perfil:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error actualizando perfil',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Cambiar contraseña
export const changePassword = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado',
        data: null
      });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere la contraseña actual y la nueva contraseña',
        data: null
      });
    }

    // Obtener usuario con contraseña
    const user = await User.findById(req.user._id).select('+password');
    
    // Verificar contraseña actual
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña actual es incorrecta',
        data: null
      });
    }

    // Actualizar contraseña
    user.password = newPassword;
    await user.save();

    console.log(`✅ Contraseña cambiada: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Contraseña actualizada exitosamente',
      data: null
    });

  } catch (error) {
    console.error('Error cambiando contraseña:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error cambiando contraseña',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Verificar token (útil para el frontend)
export const verifyToken = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido',
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: 'Token válido',
      data: {
        user: req.user.toPublicJSON()
      }
    });

  } catch (error) {
    console.error('Error verificando token:', error);
    res.status(500).json({
      success: false,
      message: 'Error verificando token',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};