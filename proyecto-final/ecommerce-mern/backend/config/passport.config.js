import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.model.js';

export default function configureGoogleStrategy(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        scope: ['profile', 'email']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Buscar si el usuario ya existe con este Google ID
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            // Usuario existente, actualizar última conexión
            user.lastLogin = new Date();
            await user.save();
            return done(null, user);
          }

          // Buscar por email para vincular cuentas
          user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            // Usuario existe pero sin Google ID, vincular cuenta
            user.googleId = profile.id;
            user.avatar = user.avatar || profile.photos[0]?.value;
            user.lastLogin = new Date();
            await user.save();
            return done(null, user);
          }

          // Crear nuevo usuario
          user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            avatar: profile.photos[0]?.value,
            role: 'customer',
            isEmailVerified: true, // Google ya verificó el email
            authProvider: 'google',
            lastLogin: new Date()
          });

          return done(null, user);
        } catch (error) {
          console.error('Error en Google OAuth:', error);
          return done(error, null);
        }
      }
    )
  );

  // Serializar usuario para la sesión
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserializar usuario desde la sesión
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
}
