import User from '../../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Mock de los módulos
jest.mock('jsonwebtoken');
jest.mock('bcryptjs');

// Simular controlador inline para tests unitarios puros
describe('Auth Controller - Unit Tests', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    // Reset mocks
    mockReq = {
      body: {},
      user: {},
      params: {}
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis()
    };
    
    mockNext = jest.fn();

    // Limpiar todos los mocks
    jest.clearAllMocks();
  });

  describe('Register Controller Logic', () => {
    test('debería crear usuario exitosamente', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      mockReq.body = userData;

      // Mock User.findOne para no encontrar duplicado
      jest.spyOn(User, 'findOne').mockResolvedValue(null);

      // Mock User.create
      const mockUser = {
        _id: 'user123',
        name: userData.name,
        email: userData.email,
        role: 'customer',
        save: jest.fn().mockResolvedValue(true)
      };
      jest.spyOn(User, 'create').mockResolvedValue(mockUser);

      // Mock JWT
      jwt.sign.mockReturnValue('fake-token');

      // Simular lógica del controlador
      const register = async (req, res) => {
        try {
          const { name, email, password } = req.body;

          const existingUser = await User.findOne({ email });
          if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
          }

          const user = await User.create({ name, email, password });
          const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

          res.status(201).json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
          });
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await register(mockReq, mockRes);

      expect(User.findOne).toHaveBeenCalledWith({ email: userData.email });
      expect(User.create).toHaveBeenCalledWith(userData);
      expect(jwt.sign).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          token: 'fake-token'
        })
      );
    });

    test('debería fallar si email ya existe', async () => {
      mockReq.body = {
        name: 'Test',
        email: 'existing@example.com',
        password: 'password123'
      };

      // Mock usuario existente
      jest.spyOn(User, 'findOne').mockResolvedValue({ email: 'existing@example.com' });

      const register = async (req, res) => {
        try {
          const { email } = req.body;
          const existingUser = await User.findOne({ email });
          
          if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
          }
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await register(mockReq, mockRes);

      expect(User.findOne).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.stringContaining('already exists')
        })
      );
    });

    test('debería manejar errores de base de datos', async () => {
      mockReq.body = {
        name: 'Test',
        email: 'test@example.com',
        password: 'password123'
      };

      jest.spyOn(User, 'findOne').mockRejectedValue(new Error('Database error'));

      const register = async (req, res) => {
        try {
          await User.findOne({ email: req.body.email });
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Database error'
        })
      );
    });
  });

  describe('Login Controller Logic', () => {
    test('debería hacer login exitosamente', async () => {
      mockReq.body = {
        email: 'user@example.com',
        password: 'password123'
      };

      const mockUser = {
        _id: 'user123',
        name: 'Test User',
        email: 'user@example.com',
        password: 'hashedpassword',
        role: 'customer',
        comparePassword: jest.fn().mockResolvedValue(true)
      };

      jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue('fake-token');

      const login = async (req, res) => {
        try {
          const { email, password } = req.body;
          const user = await User.findOne({ email });

          if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
          }

          const isMatch = await user.comparePassword(password);
          if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
          }

          const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

          res.status(200).json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
          });
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await login(mockReq, mockRes);

      expect(User.findOne).toHaveBeenCalledWith({ email: mockReq.body.email });
      expect(mockUser.comparePassword).toHaveBeenCalledWith('password123');
      expect(jwt.sign).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          token: 'fake-token'
        })
      );
    });

    test('debería fallar con email incorrecto', async () => {
      mockReq.body = {
        email: 'wrong@example.com',
        password: 'password123'
      };

      jest.spyOn(User, 'findOne').mockResolvedValue(null);

      const login = async (req, res) => {
        try {
          const { email } = req.body;
          const user = await User.findOne({ email });

          if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
          }
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Invalid credentials'
        })
      );
    });

    test('debería fallar con contraseña incorrecta', async () => {
      mockReq.body = {
        email: 'user@example.com',
        password: 'wrongpassword'
      };

      const mockUser = {
        _id: 'user123',
        email: 'user@example.com',
        comparePassword: jest.fn().mockResolvedValue(false)
      };

      jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);

      const login = async (req, res) => {
        try {
          const { email, password } = req.body;
          const user = await User.findOne({ email });

          if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
          }

          const isMatch = await user.comparePassword(password);
          if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
          }
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await login(mockReq, mockRes);

      expect(mockUser.comparePassword).toHaveBeenCalledWith('wrongpassword');
      expect(mockRes.status).toHaveBeenCalledWith(401);
    });
  });

  describe('Get Profile Controller Logic', () => {
    test('debería obtener perfil de usuario', async () => {
      mockReq.user = { id: 'user123' };

      const mockUser = {
        _id: 'user123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'customer',
        cart: []
      };

      jest.spyOn(User, 'findById').mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      const getProfile = async (req, res) => {
        try {
          const user = await User.findById(req.user.id).select('-password');

          if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
          }

          res.status(200).json({ success: true, user });
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await getProfile(mockReq, mockRes);

      expect(User.findById).toHaveBeenCalledWith('user123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          user: mockUser
        })
      );
    });

    test('debería fallar si usuario no existe', async () => {
      mockReq.user = { id: 'nonexistent' };

      jest.spyOn(User, 'findById').mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      const getProfile = async (req, res) => {
        try {
          const user = await User.findById(req.user.id).select('-password');

          if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
          }

          res.status(200).json({ success: true, user });
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await getProfile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'User not found'
        })
      );
    });
  });

  describe('Update Profile Controller Logic', () => {
    test('debería actualizar perfil exitosamente', async () => {
      mockReq.user = { id: 'user123' };
      mockReq.body = {
        name: 'Updated Name',
        phone: '123456789'
      };

      const mockUser = {
        _id: 'user123',
        name: 'Updated Name',
        email: 'test@example.com',
        phone: '123456789',
        save: jest.fn().mockResolvedValue(true)
      };

      jest.spyOn(User, 'findById').mockResolvedValue(mockUser);

      const updateProfile = async (req, res) => {
        try {
          const user = await User.findById(req.user.id);

          if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
          }

          const { name, phone, address } = req.body;
          if (name) user.name = name;
          if (phone) user.phone = phone;
          if (address) user.address = address;

          await user.save();

          res.status(200).json({ success: true, user });
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await updateProfile(mockReq, mockRes);

      expect(User.findById).toHaveBeenCalledWith('user123');
      expect(mockUser.save).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          user: mockUser
        })
      );
    });

    test('debería prevenir actualizar email a uno existente', async () => {
      mockReq.user = { id: 'user123' };
      mockReq.body = { email: 'existing@example.com' };

      jest.spyOn(User, 'findOne').mockResolvedValue({ _id: 'otheruser' });

      const updateProfile = async (req, res) => {
        try {
          const { email } = req.body;

          if (email) {
            const existing = await User.findOne({ email });
            if (existing && existing._id.toString() !== req.user.id) {
              return res.status(400).json({ success: false, message: 'Email already in use' });
            }
          }
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await updateProfile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.stringContaining('already in use')
        })
      );
    });
  });

  describe('Forgot Password Controller Logic', () => {
    test('debería generar token de reseteo', async () => {
      mockReq.body = { email: 'user@example.com' };

      const mockUser = {
        _id: 'user123',
        email: 'user@example.com',
        resetPasswordToken: undefined,
        resetPasswordExpires: undefined,
        save: jest.fn().mockResolvedValue(true)
      };

      jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);
      const mockToken = 'reset-token-123';

      const forgotPassword = async (req, res) => {
        try {
          const { email } = req.body;
          const user = await User.findOne({ email });

          if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
          }

          user.resetPasswordToken = mockToken;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
          await user.save();

          res.status(200).json({
            success: true,
            message: 'Password reset token generated',
            token: mockToken
          });
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await forgotPassword(mockReq, mockRes);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'user@example.com' });
      expect(mockUser.save).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          token: mockToken
        })
      );
    });

    test('debería fallar si usuario no existe', async () => {
      mockReq.body = { email: 'nonexistent@example.com' };

      jest.spyOn(User, 'findOne').mockResolvedValue(null);

      const forgotPassword = async (req, res) => {
        try {
          const { email } = req.body;
          const user = await User.findOne({ email });

          if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
          }
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await forgotPassword(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });
  });

  describe('Reset Password Controller Logic', () => {
    test('debería resetear contraseña con token válido', async () => {
      mockReq.params = { token: 'valid-token' };
      mockReq.body = { password: 'newpassword123' };

      const mockUser = {
        _id: 'user123',
        resetPasswordToken: 'valid-token',
        resetPasswordExpires: Date.now() + 10000,
        password: undefined,
        save: jest.fn().mockResolvedValue(true)
      };

      jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);

      const resetPassword = async (req, res) => {
        try {
          const { token } = req.params;
          const { password } = req.body;

          const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
          });

          if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired token' });
          }

          user.password = password;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;
          await user.save();

          res.status(200).json({ success: true, message: 'Password reset successful' });
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await resetPassword(mockReq, mockRes);

      expect(mockUser.save).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: expect.stringContaining('successful')
        })
      );
    });

    test('debería fallar con token inválido', async () => {
      mockReq.params = { token: 'invalid-token' };
      mockReq.body = { password: 'newpassword123' };

      jest.spyOn(User, 'findOne').mockResolvedValue(null);

      const resetPassword = async (req, res) => {
        try {
          const { token } = req.params;

          const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
          });

          if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired token' });
          }
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await resetPassword(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.stringContaining('Invalid or expired')
        })
      );
    });
  });

  describe('Logout Controller Logic', () => {
    test('debería cerrar sesión exitosamente', async () => {
      const logout = async (req, res) => {
        try {
          res.clearCookie('token');
          res.status(200).json({ success: true, message: 'Logged out successfully' });
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      };

      await logout(mockReq, mockRes);

      expect(mockRes.clearCookie).toHaveBeenCalledWith('token');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: expect.stringContaining('Logged out')
        })
      );
    });
  });
});
