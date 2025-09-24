import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Ruta a la que redirigir después del login
  const from = location.state?.from || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error específico cuando el usuario comience a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar email
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar formulario
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      const response = await authAPI.login(formData);
      
      // Guardar token y datos del usuario
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Redirigir al usuario
      navigate(from, { replace: true });
      
    } catch (err) {
      console.error('Error en login:', err);
      
      if (err.errors && Array.isArray(err.errors)) {
        // Errores de validación del servidor
        const serverErrors = {};
        err.errors.forEach(error => {
          serverErrors[error.field] = error.message;
        });
        setErrors(serverErrors);
      } else {
        // Error general
        setErrors({ general: err.message || 'Error en el login' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h1>Iniciar Sesión</h1>
              <p>Ingresa a tu cuenta para continuar</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {errors.general && (
                <div className="error-alert">
                  {errors.general}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="tu@email.com"
                  disabled={loading}
                />
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="Tu contraseña"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                    disabled={loading}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.password && (
                  <span className="error-message">{errors.password}</span>
                )}
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span>Recordarme</span>
                </label>
                <Link to="/forgot-password" className="forgot-link">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <button
                type="submit"
                className="auth-button"
                disabled={loading}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                ¿No tienes una cuenta?{' '}
                <Link to="/register" className="auth-link">
                  Regístrate aquí
                </Link>
              </p>
            </div>

            <div className="auth-divider">
              <span>o</span>
            </div>

            <div className="social-login">
              <button 
                type="button" 
                className="social-button google"
                onClick={() => alert('Próximamente: Login con Google')}
              >
                <span>🔍</span>
                Continuar con Google
              </button>
              <button 
                type="button" 
                className="social-button facebook"
                onClick={() => alert('Próximamente: Login con Facebook')}
              >
                <span>📘</span>
                Continuar con Facebook
              </button>
            </div>
          </div>

          <div className="auth-benefits">
            <h3>Beneficios de tener una cuenta</h3>
            <ul>
              <li>
                <span className="benefit-icon">🛒</span>
                <div>
                  <strong>Carrito guardado</strong>
                  <p>Tus productos se guardan automáticamente</p>
                </div>
              </li>
              <li>
                <span className="benefit-icon">📦</span>
                <div>
                  <strong>Historial de pedidos</strong>
                  <p>Revisa todos tus pedidos anteriores</p>
                </div>
              </li>
              <li>
                <span className="benefit-icon">❤️</span>
                <div>
                  <strong>Lista de deseos</strong>
                  <p>Guarda productos para comprar después</p>
                </div>
              </li>
              <li>
                <span className="benefit-icon">🚚</span>
                <div>
                  <strong>Envíos rápidos</strong>
                  <p>Direcciones guardadas para envíos más rápidos</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;