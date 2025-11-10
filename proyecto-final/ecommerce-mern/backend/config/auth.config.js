import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/user.model.js';

// Configuración de la estrategia local para login
passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  try {
    console.log('🔍 Intentando login con:', email);
    
    // Buscar usuario por email incluyendo la contraseña
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    console.log('👤 Usuario encontrado:', user ? 'SÍ' : 'NO');
    
    if (!user) {
      console.log('❌ No existe usuario con email:', email);
      return done(null, false, { 
        message: 'No existe un usuario con este email.' 
      });
    }

    // Verificar si el usuario está activo
    if (!user.isActive) {
      console.log('❌ Usuario inactivo:', email);
      return done(null, false, { 
        message: 'Esta cuenta ha sido desactivada. Contacta al administrador.' 
      });
    }

    console.log('🔐 Verificando contraseña...');
    // Verificar contraseña
    const isPasswordValid = await user.comparePassword(password);
    
    console.log('🔐 Contraseña válida:', isPasswordValid ? 'SÍ' : 'NO');
    
    if (!isPasswordValid) {
      console.log('❌ Contraseña incorrecta para:', email);
      return done(null, false, { 
        message: 'Contraseña incorrecta.' 
      });
    }

    // Login exitoso
    console.log('✅ Login exitoso para:', email);
    return done(null, user);
  } catch (error) {
    console.error('Error en estrategia local de login:', error);
    return done(error);
  }
}));

// Configuración de la estrategia local para registro
passport.use('local-register', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
    if (existingUser) {
      return done(null, false, { 
        message: 'Ya existe un usuario con este email.' 
      });
    }

    // Crear nuevo usuario
    const userData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: email.toLowerCase(),
      password: password,
      phone: req.body.phone || undefined,
      address: req.body.address || {}
    };

    const newUser = new User(userData);
    await newUser.save();

    console.log(`✅ Nuevo usuario registrado: ${newUser.email}`);
    
    // Registro exitoso
    return done(null, newUser);
  } catch (error) {
    console.error('Error en estrategia local de registro:', error);
    
    // Manejar errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return done(null, false, { 
        message: messages.join('. ') 
      });
    }
    
    return done(error);
  }
}));

// Configuración de la estrategia JWT
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'jwt-secreto-desarrollo-123'
};

passport.use('jwt', new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    // Buscar usuario por ID del payload
    const user = await User.findById(payload.id);
    
    if (user && user.isActive) {
      return done(null, user);
    }
    
    return done(null, false);
  } catch (error) {
    console.error('Error en estrategia JWT:', error);
    return done(error, false);
  }
}));

// Serialización del usuario (para sesiones)
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialización del usuario (para sesiones)
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.error('Error deserializando usuario:', error);
    done(error, null);
  }
});

export default passport;