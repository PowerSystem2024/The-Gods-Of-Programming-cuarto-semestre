import User from '../../models/user.model.js';
import bcrypt from 'bcryptjs';

describe('User Model - Unit Tests', () => {
  
  describe('User Creation', () => {
    test('debería crear un usuario válido', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.name).toBe(userData.name);
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.password).not.toBe(userData.password); // Debe estar hasheada
      expect(savedUser.role).toBe('customer'); // Valor por defecto
    });

    test('debería requerir campos obligatorios', async () => {
      const user = new User({});

      let error;
      try {
        await user.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.name).toBeDefined();
      expect(error.errors.email).toBeDefined();
      expect(error.errors.password).toBeDefined();
    });

    test('debería validar formato de email', async () => {
      const user = new User({
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123'
      });

      let error;
      try {
        await user.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.email).toBeDefined();
    });

    test('no debería permitir emails duplicados', async () => {
      const userData = {
        name: 'Test User',
        email: 'duplicate@example.com',
        password: 'password123'
      };

      await User.create(userData);

      let error;
      try {
        await User.create(userData);
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.code).toBe(11000); // Código de error de duplicación en MongoDB
    });

    test('debería hashear la contraseña antes de guardar', async () => {
      const plainPassword = 'password123';
      const user = new User({
        name: 'Test User',
        email: 'hash@example.com',
        password: plainPassword
      });

      await user.save();

      expect(user.password).not.toBe(plainPassword);
      expect(user.password.length).toBeGreaterThan(plainPassword.length);
      
      // Verificar que el hash es válido
      const isValid = await bcrypt.compare(plainPassword, user.password);
      expect(isValid).toBe(true);
    });
  });

  describe('User Methods', () => {
    test('comparePassword debería validar contraseña correcta', async () => {
      const plainPassword = 'password123';
      const user = await User.create({
        name: 'Test User',
        email: 'method@example.com',
        password: plainPassword
      });

      const isMatch = await user.comparePassword(plainPassword);
      expect(isMatch).toBe(true);
    });

    test('comparePassword debería rechazar contraseña incorrecta', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'method2@example.com',
        password: 'password123'
      });

      const isMatch = await user.comparePassword('wrongpassword');
      expect(isMatch).toBe(false);
    });
  });

  describe('User Fields', () => {
    test('debería tener cart vacío por defecto', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'cart@example.com',
        password: 'password123'
      });

      expect(user.cart).toBeDefined();
      expect(Array.isArray(user.cart)).toBe(true);
      expect(user.cart.length).toBe(0);
    });

    test('debería aceptar diferentes roles', async () => {
      const admin = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin'
      });

      const seller = await User.create({
        name: 'Seller User',
        email: 'seller@example.com',
        password: 'password123',
        role: 'seller'
      });

      expect(admin.role).toBe('admin');
      expect(seller.role).toBe('seller');
    });

    test('debería almacenar dirección de envío', async () => {
      const address = {
        street: 'Calle Falsa 123',
        city: 'Resistencia',
        state: 'Chaco',
        zipCode: '3500',
        country: 'Argentina'
      };

      const user = await User.create({
        name: 'Test User',
        email: 'address@example.com',
        password: 'password123',
        shippingAddress: address
      });

      expect(user.shippingAddress).toBeDefined();
      expect(user.shippingAddress.street).toBe(address.street);
      expect(user.shippingAddress.city).toBe(address.city);
    });

    test('debería almacenar teléfono', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'phone@example.com',
        password: 'password123',
        phone: '+54 362 1234567'
      });

      expect(user.phone).toBe('+54 362 1234567');
    });
  });

  describe('User OAuth', () => {
    test('debería crear usuario con Google OAuth', async () => {
      const user = await User.create({
        name: 'Google User',
        email: 'google@example.com',
        password: 'dummy-password',
        googleId: '1234567890',
        authProvider: 'google'
      });

      expect(user.googleId).toBe('1234567890');
      expect(user.authProvider).toBe('google');
    });
  });

  describe('User Updates', () => {
    test('debería actualizar información del usuario', async () => {
      const user = await User.create({
        name: 'Original Name',
        email: 'update@example.com',
        password: 'password123'
      });

      user.name = 'Updated Name';
      user.phone = '+54 362 999999';
      await user.save();

      const updatedUser = await User.findById(user._id);
      expect(updatedUser.name).toBe('Updated Name');
      expect(updatedUser.phone).toBe('+54 362 999999');
    });

    test('debería actualizar contraseña y hashearla', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'password-update@example.com',
        password: 'oldpassword'
      });

      const newPassword = 'newpassword123';
      user.password = newPassword;
      await user.save();

      expect(user.password).not.toBe(newPassword);
      const isValid = await user.comparePassword(newPassword);
      expect(isValid).toBe(true);
    });
  });

  describe('User Deletion', () => {
    test('debería eliminar un usuario', async () => {
      const user = await User.create({
        name: 'To Delete',
        email: 'delete@example.com',
        password: 'password123'
      });

      await User.findByIdAndDelete(user._id);

      const deletedUser = await User.findById(user._id);
      expect(deletedUser).toBeNull();
    });
  });

  describe('User Queries', () => {
    beforeEach(async () => {
      // Crear varios usuarios para testing
      await User.create([
        { name: 'User 1', email: 'user1@example.com', password: 'pass123', role: 'customer' },
        { name: 'User 2', email: 'user2@example.com', password: 'pass123', role: 'customer' },
        { name: 'Admin User', email: 'admin@example.com', password: 'pass123', role: 'admin' },
        { name: 'Seller User', email: 'seller@example.com', password: 'pass123', role: 'seller' }
      ]);
    });

    test('debería encontrar usuario por email', async () => {
      const user = await User.findOne({ email: 'user1@example.com' });
      expect(user).toBeDefined();
      expect(user.name).toBe('User 1');
    });

    test('debería encontrar usuarios por rol', async () => {
      const customers = await User.find({ role: 'customer' });
      expect(customers.length).toBe(2);
    });

    test('debería contar usuarios', async () => {
      const count = await User.countDocuments();
      expect(count).toBe(4);
    });
  });
});
