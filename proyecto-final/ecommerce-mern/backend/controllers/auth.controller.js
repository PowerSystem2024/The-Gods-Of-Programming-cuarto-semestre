import passport from 'passport';
import { generateJWT } from '../middleware/auth.middleware.js';
import User from '../models/user.model.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Configurar transporter de email (esto lo puedes configurar con variables de entorno)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'tu-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'tu-contraseña-app'
  }
});

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
      message: 'Error verificando token',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Solicitar recuperación de contraseña
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'El email es requerido'
      });
    }

    // Buscar usuario por email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Por seguridad, no revelar si el email existe o no
      return res.status(200).json({
        success: true,
        message: 'Si el email existe, recibirás un correo con instrucciones para recuperar tu contraseña'
      });
    }

    // Verificar que el usuario no use OAuth
    if (user.authProvider !== 'local') {
      return res.status(400).json({
        success: false,
        message: 'Esta cuenta usa autenticación de Google. No puedes restablecer la contraseña.'
      });
    }

    // Generar token de recuperación
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Guardar token hasheado y expiración (1 hora)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
    await user.save();

    // URL de recuperación
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

    // Mensaje del email
    const message = `
      <h2>Recuperación de Contraseña</h2>
      <p>Hola ${user.name || user.firstName || 'Usuario'},</p>
      <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #CD853F; color: white; text-decoration: none; border-radius: 5px;">Restablecer Contraseña</a>
      <p>O copia y pega este enlace en tu navegador:</p>
      <p>${resetUrl}</p>
      <p>Este enlace expirará en 1 hora.</p>
      <p>Si no solicitaste restablecer tu contraseña, ignora este correo.</p>
      <br>
      <p>Saludos,<br>El equipo de Ecommerce</p>
    `;

    try {
      // Enviar email
      await transporter.sendMail({
        from: process.env.EMAIL_USER || 'noreply@ecommerce.com',
        to: user.email,
        subject: 'Recuperación de Contraseña',
        html: message
      });

      console.log(`✅ Email de recuperación enviado a: ${user.email}`);

      res.status(200).json({
        success: true,
        message: 'Correo de recuperación enviado exitosamente'
      });

    } catch (emailError) {
      console.error('Error enviando email:', emailError);
      
      // Limpiar token si falla el envío
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      return res.status(500).json({
        success: false,
        message: 'Error enviando el correo de recuperación. Por favor intenta más tarde.'
      });
    }

  } catch (error) {
    console.error('Error en forgot password:', error);
    res.status(500).json({
      success: false,
      message: 'Error procesando la solicitud',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Restablecer contraseña con token
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'La nueva contraseña es requerida'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Hashear el token recibido para comparar
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Buscar usuario con token válido y no expirado
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    }).select('+resetPasswordToken +resetPasswordExpires');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }

    // Actualizar contraseña
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log(`✅ Contraseña restablecida para: ${user.email}`);

    // Generar nuevo JWT
    const jwtToken = generateJWT(user);

    res.status(200).json({
      success: true,
      message: 'Contraseña restablecida exitosamente',
      data: {
        user: user.toPublicJSON(),
        token: jwtToken,
        expiresIn: process.env.JWT_EXPIRE || '7d'
      }
    });

  } catch (error) {
    console.error('Error en reset password:', error);
    
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
      message: 'Error restableciendo la contraseña',
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