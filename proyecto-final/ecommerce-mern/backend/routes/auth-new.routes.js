import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import config from '../config/config.js';
import { transport } from '../config/mail.config.js';

const router = express.Router();

// Middleware para verificar JWT
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'No autorizado - Token no proporcionado' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Error verificando token:', error);
    return res.status(401).json({ 
      success: false,
      message: 'Token inválido o expirado' 
    });
  }
};


// 🔐 REGISTRO LOCAL (Email/Password)
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('name').notEmpty().withMessage('El nombre es obligatorio')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, name } = req.body;

      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ 
          message: 'El email ya está registrado',
          field: 'email'
        });
      }

      // Crear usuario (el modelo se encarga de hashear la contraseña automáticamente)
      const user = await User.create({
        email,
        password: password, // Sin hashear - el pre('save') del modelo lo hará
        name,
        authProvider: 'local',
        role: 'customer'
      });

      // Generar JWT
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }
);

// 🔐 LOGIN LOCAL (Email/Password)
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('❌ Errores de validación:', errors.array());
        return res.status(400).json({ errors: errors.array() });
      }

  const { email, password } = req.body;
  const normalizedEmail = email.trim().toLowerCase();
  console.log('🔍 Intentando login con email:', normalizedEmail);

  // Buscar usuario (incluir password)
  const user = await User.findOne({ email: normalizedEmail }).select('+password');
  console.log('👤 Usuario encontrado:', user ? 'SÍ' : 'NO');
      
      if (!user) {
        console.log('❌ No existe usuario con email:', email);
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      console.log('📋 authProvider del usuario:', user.authProvider);
      console.log('🔑 Usuario tiene password:', user.password ? 'SÍ' : 'NO');

      // Verificar que sea usuario local (no Google)
      if (user.authProvider === 'google') {
        console.log('❌ Usuario intenta login con Google account');
        return res.status(400).json({ 
          message: 'Esta cuenta usa Google. Por favor inicia sesión con Google.',
          useGoogle: true
        });
      }

      // Verificar password
      console.log('🔐 Verificando password...');
      console.log('🔑 Password recibido:', password);
      console.log('🔑 Hash guardado:', user.password);
      const isValidPassword = await bcrypt.compare(password, user.password);
      console.log('🔐 Resultado bcrypt.compare:', isValidPassword);
      if (!isValidPassword) {
        console.log('❌ Contraseña incorrecta para:', normalizedEmail);
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      // Actualizar último login
      user.lastLogin = new Date();
      await user.save();

      // Generar JWT
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      console.log('✅ Login exitoso, generando token...');

      res.json({
        success: true,
        message: 'Login exitoso',
        data: {
          token,
          user: {
            id: user._id,
            email: user.email,
            name: user.name || `${user.firstName} ${user.lastName}`,
            role: user.role,
            avatar: user.avatar
          }
        }
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }
);

// 🔐 GOOGLE OAUTH - Iniciar autenticación
router.get(
  '/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false
  })
);

// 🔐 GOOGLE OAUTH - Callback
router.get(
  '/google/callback',
  passport.authenticate('google', { 
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed`
  }),
  async (req, res) => {
    try {
      const user = req.user;

      // Generar JWT
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      // Redirigir al frontend con el token
      res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
    } catch (error) {
      console.error('Error en Google callback:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
    }
  }
);

// 📊 OBTENER PERFIL DEL USUARIO
router.get('/me', async (req, res) => {
  try {
    // Extraer token del header
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar usuario
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name || `${user.firstName} ${user.lastName}`,
        role: user.role,
        avatar: user.avatar,
        authProvider: user.authProvider
      }
    });
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(401).json({ message: 'Token inválido' });
  }
});

// 🚪 LOGOUT
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout exitoso' });
});

// 👤 OBTENER PERFIL (ruta /profile para compatibilidad)
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Usuario no encontrado' 
      });
    }

    res.json({
      success: true,
      message: 'Perfil obtenido exitosamente',
      data: {
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          address: user.address,
          role: user.role,
          avatar: user.avatar,
          authProvider: user.authProvider,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error obteniendo perfil' 
    });
  }
});

// ✏️ ACTUALIZAR PERFIL
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { firstName, lastName, email, phone, address } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Usuario no encontrado' 
      });
    }

    // Actualizar campos
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    
    // No permitir cambiar email si usa Google OAuth
    if (email && user.authProvider === 'local' && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: 'El email ya está en uso'
        });
      }
      user.email = email;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: {
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          address: user.address,
          role: user.role,
          authProvider: user.authProvider
        }
      }
    });
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error actualizando perfil' 
    });
  }
});

// 🔐 CAMBIAR CONTRASEÑA
router.put('/change-password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere contraseña actual y nueva contraseña'
      });
    }

    const user = await User.findById(req.userId).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar que sea usuario local
    if (user.authProvider !== 'local') {
      return res.status(400).json({
        success: false,
        message: 'No puedes cambiar la contraseña de una cuenta de Google'
      });
    }

    // Verificar contraseña actual
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña actual es incorrecta'
      });
    }

    // Actualizar contraseña (el modelo se encarga de hashear automáticamente)
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error cambiando contraseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error cambiando contraseña'
    });
  }
});

// 📧 SOLICITAR RECUPERACIÓN DE CONTRASEÑA
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'El email es requerido'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Por seguridad, no revelar si el email existe
      return res.status(200).json({
        success: true,
        message: 'Si el email existe, recibirás un correo con instrucciones'
      });
    }

    // Verificar que no use OAuth
    if (user.authProvider !== 'local') {
      return res.status(400).json({
        success: false,
        message: 'Esta cuenta usa autenticación de Google. No puedes restablecer la contraseña.'
      });
    }

    // Generar token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
    await user.save();

    // URL de recuperación
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

    // Mensaje del email
    const message = `
      <h2>Recuperación de Contraseña</h2>
      <p>Hola ${user.name || user.firstName || 'Usuario'},</p>
      <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace:</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #CD853F; color: white; text-decoration: none; border-radius: 5px;">Restablecer Contraseña</a>
      <p>O copia este enlace: ${resetUrl}</p>
      <p>Este enlace expirará en 1 hora.</p>
      <p>Si no solicitaste esto, ignora este correo.</p>
    `;

    try {
      await transport.sendMail({
        from: config.mailFrom || 'noreply@ecommerce.com',
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
      
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      return res.status(500).json({
        success: false,
        message: 'Error enviando el correo. Intenta más tarde.'
      });
    }
  } catch (error) {
    console.error('Error en forgot password:', error);
    res.status(500).json({
      success: false,
      message: 'Error procesando la solicitud'
    });
  }
});

// 🔑 RESTABLECER CONTRASEÑA
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

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

    // Actualizar contraseña (el modelo se encarga de hashear automáticamente)
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log(`✅ Contraseña restablecida para: ${user.email}`);

    // Generar nuevo JWT
    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Contraseña restablecida exitosamente',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        token: jwtToken,
        expiresIn: process.env.JWT_EXPIRE || '7d'
      }
    });
  } catch (error) {
    console.error('Error en reset password:', error);
    res.status(500).json({
      success: false,
      message: 'Error restableciendo la contraseña'
    });
  }
});

export default router;

