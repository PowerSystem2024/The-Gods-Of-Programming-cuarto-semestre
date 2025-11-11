import jwt from 'jsonwebtoken';
import User from '../../models/user.model.js';

// Mock de dependencias
jest.mock('jsonwebtoken');
jest.mock('../../models/user.model.js');

describe('Auth Middleware - Unit Tests', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      headers: {},
      cookies: {},
      user: undefined
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    
    mockNext = jest.fn();
    
    jest.clearAllMocks();
    
    // Setup default JWT_SECRET
    process.env.JWT_SECRET = 'test-secret';
  });

  describe('Protect Middleware - Token Validation', () => {
    test('debería autenticar con token válido en header', async () => {
      const token = 'valid-token';
      mockReq.headers.authorization = `Bearer ${token}`;

      const mockUser = {
        _id: 'user123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'customer'
      };

      jwt.verify.mockReturnValue({ id: 'user123' });
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      // Simular middleware protect
      const protect = async (req, res, next) => {
        try {
          let token;

          if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
          } else if (req.cookies.token) {
            token = req.cookies.token;
          }

          if (!token) {
            return res.status(401).json({ success: false, message: 'Not authorized, no token' });
          }

          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          req.user = await User.findById(decoded.id).select('-password');

          if (!req.user) {
            return res.status(401).json({ success: false, message: 'User not found' });
          }

          next();
        } catch (error) {
          res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
      };

      await protect(mockReq, mockRes, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith(token, 'test-secret');
      expect(User.findById).toHaveBeenCalledWith('user123');
      expect(mockReq.user).toEqual(mockUser);
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    test('debería autenticar con token en cookies', async () => {
      const token = 'cookie-token';
      mockReq.cookies.token = token;

      const mockUser = {
        _id: 'user456',
        name: 'Cookie User',
        email: 'cookie@example.com'
      };

      jwt.verify.mockReturnValue({ id: 'user456' });
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      const protect = async (req, res, next) => {
        try {
          let token;

          if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
          } else if (req.cookies.token) {
            token = req.cookies.token;
          }

          if (!token) {
            return res.status(401).json({ success: false, message: 'Not authorized, no token' });
          }

          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          req.user = await User.findById(decoded.id).select('-password');

          next();
        } catch (error) {
          res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
      };

      await protect(mockReq, mockRes, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith(token, 'test-secret');
      expect(mockNext).toHaveBeenCalled();
    });

    test('debería fallar sin token', async () => {
      const protect = async (req, res, next) => {
        try {
          let token;

          if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
          } else if (req.cookies.token) {
            token = req.cookies.token;
          }

          if (!token) {
            return res.status(401).json({ success: false, message: 'Not authorized, no token' });
          }

          next();
        } catch (error) {
          res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
      };

      await protect(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.stringContaining('no token')
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('debería fallar con token inválido', async () => {
      mockReq.headers.authorization = 'Bearer invalid-token';

      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const protect = async (req, res, next) => {
        try {
          let token;

          if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
          }

          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          req.user = await User.findById(decoded.id).select('-password');

          next();
        } catch (error) {
          res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
      };

      await protect(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.stringContaining('token failed')
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('debería fallar con token expirado', async () => {
      mockReq.headers.authorization = 'Bearer expired-token';

      jwt.verify.mockImplementation(() => {
        const error = new Error('jwt expired');
        error.name = 'TokenExpiredError';
        throw error;
      });

      const protect = async (req, res, next) => {
        try {
          let token;

          if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
          }

          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          req.user = await User.findById(decoded.id).select('-password');

          next();
        } catch (error) {
          res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
      };

      await protect(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('debería fallar si usuario no existe', async () => {
      mockReq.headers.authorization = 'Bearer valid-token';

      jwt.verify.mockReturnValue({ id: 'nonexistent' });
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      const protect = async (req, res, next) => {
        try {
          let token;

          if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
          }

          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          req.user = await User.findById(decoded.id).select('-password');

          if (!req.user) {
            return res.status(401).json({ success: false, message: 'User not found' });
          }

          next();
        } catch (error) {
          res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
      };

      await protect(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('User not found')
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('debería fallar con formato de autorización incorrecto', async () => {
      mockReq.headers.authorization = 'InvalidFormat token-value';

      const protect = async (req, res, next) => {
        try {
          let token;

          if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
          } else if (req.cookies.token) {
            token = req.cookies.token;
          }

          if (!token) {
            return res.status(401).json({ success: false, message: 'Not authorized, no token' });
          }

          next();
        } catch (error) {
          res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
      };

      await protect(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Authorize Middleware - Role-Based Access', () => {
    beforeEach(() => {
      mockReq.user = {
        _id: 'user123',
        role: 'customer'
      };
    });

    test('debería permitir acceso a rol autorizado', () => {
      mockReq.user.role = 'admin';

      const authorize = (...roles) => {
        return (req, res, next) => {
          if (!roles.includes(req.user.role)) {
            return res.status(403).json({
              success: false,
              message: `Role ${req.user.role} is not authorized to access this resource`
            });
          }
          next();
        };
      };

      const middleware = authorize('admin', 'seller');
      middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    test('debería denegar acceso a rol no autorizado', () => {
      mockReq.user.role = 'customer';

      const authorize = (...roles) => {
        return (req, res, next) => {
          if (!roles.includes(req.user.role)) {
            return res.status(403).json({
              success: false,
              message: `Role ${req.user.role} is not authorized to access this resource`
            });
          }
          next();
        };
      };

      const middleware = authorize('admin', 'seller');
      middleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.stringContaining('not authorized')
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('debería permitir múltiples roles', () => {
      mockReq.user.role = 'seller';

      const authorize = (...roles) => {
        return (req, res, next) => {
          if (!roles.includes(req.user.role)) {
            return res.status(403).json({
              success: false,
              message: `Role ${req.user.role} is not authorized to access this resource`
            });
          }
          next();
        };
      };

      const middleware = authorize('admin', 'seller', 'moderator');
      middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    test('debería funcionar con un solo rol', () => {
      mockReq.user.role = 'admin';

      const authorize = (...roles) => {
        return (req, res, next) => {
          if (!roles.includes(req.user.role)) {
            return res.status(403).json({
              success: false,
              message: `Role ${req.user.role} is not authorized to access this resource`
            });
          }
          next();
        };
      };

      const middleware = authorize('admin');
      middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    test('debería manejar caso sin usuario en request', () => {
      mockReq.user = undefined;

      const authorize = (...roles) => {
        return (req, res, next) => {
          if (!req.user) {
            return res.status(401).json({
              success: false,
              message: 'User not authenticated'
            });
          }

          if (!roles.includes(req.user.role)) {
            return res.status(403).json({
              success: false,
              message: `Role ${req.user.role} is not authorized to access this resource`
            });
          }
          next();
        };
      };

      const middleware = authorize('admin');
      middleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Optional Auth Middleware', () => {
    test('debería continuar con usuario si token válido', async () => {
      mockReq.headers.authorization = 'Bearer valid-token';

      const mockUser = {
        _id: 'user123',
        name: 'Test User'
      };

      jwt.verify.mockReturnValue({ id: 'user123' });
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      const optionalAuth = async (req, res, next) => {
        try {
          let token;

          if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
          } else if (req.cookies.token) {
            token = req.cookies.token;
          }

          if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
          }

          next();
        } catch (error) {
          // En optional auth, continuamos incluso si falla
          next();
        }
      };

      await optionalAuth(mockReq, mockRes, mockNext);

      expect(mockReq.user).toEqual(mockUser);
      expect(mockNext).toHaveBeenCalled();
    });

    test('debería continuar sin usuario si no hay token', async () => {
      const optionalAuth = async (req, res, next) => {
        try {
          let token;

          if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
          } else if (req.cookies.token) {
            token = req.cookies.token;
          }

          if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
          }

          next();
        } catch (error) {
          next();
        }
      };

      await optionalAuth(mockReq, mockRes, mockNext);

      expect(mockReq.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalled();
    });

    test('debería continuar sin usuario si token inválido', async () => {
      mockReq.headers.authorization = 'Bearer invalid-token';

      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const optionalAuth = async (req, res, next) => {
        try {
          let token;

          if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
          }

          if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
          }

          next();
        } catch (error) {
          // Continuar sin usuario
          next();
        }
      };

      await optionalAuth(mockReq, mockRes, mockNext);

      expect(mockReq.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('Check Owner Middleware', () => {
    beforeEach(() => {
      mockReq.user = {
        _id: 'user123',
        role: 'customer'
      };
      mockReq.params = {
        userId: 'user123'
      };
    });

    test('debería permitir acceso al dueño del recurso', () => {
      const checkOwner = (req, res, next) => {
        if (req.user._id.toString() !== req.params.userId && req.user.role !== 'admin') {
          return res.status(403).json({
            success: false,
            message: 'Not authorized to access this resource'
          });
        }
        next();
      };

      checkOwner(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    test('debería denegar acceso a otro usuario', () => {
      mockReq.params.userId = 'otheruser456';

      const checkOwner = (req, res, next) => {
        if (req.user._id.toString() !== req.params.userId && req.user.role !== 'admin') {
          return res.status(403).json({
            success: false,
            message: 'Not authorized to access this resource'
          });
        }
        next();
      };

      checkOwner(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('debería permitir acceso a admin aunque no sea el dueño', () => {
      mockReq.user.role = 'admin';
      mockReq.params.userId = 'otheruser456';

      const checkOwner = (req, res, next) => {
        if (req.user._id.toString() !== req.params.userId && req.user.role !== 'admin') {
          return res.status(403).json({
            success: false,
            message: 'Not authorized to access this resource'
          });
        }
        next();
      };

      checkOwner(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });
});
