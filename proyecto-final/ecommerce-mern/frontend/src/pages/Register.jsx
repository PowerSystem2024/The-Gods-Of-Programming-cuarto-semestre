import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import '../styles/auth-new.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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

    // Validar nombre
    if (!formData.name) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

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

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Validar términos y condiciones
    if (!acceptTerms) {
      newErrors.terms = 'Debes aceptar los términos y condiciones';
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
      setSuccessMessage("");
      // eslint-disable-next-line no-unused-vars
      const { confirmPassword, ...registerData } = formData;
      await authAPI.register(registerData);
      setSuccessMessage("¡Registro exitoso! Ahora puedes iniciar sesión.");
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1800);
    } catch (err) {
      console.error('Error en registro:', err);
      if (err.errors && Array.isArray(err.errors)) {
        // Errores de validación del servidor
        const serverErrors = {};
        err.errors.forEach(error => {
          serverErrors[error.field] = error.message;
        });
        setErrors(serverErrors);
      } else {
        // Error general
        setErrors({ general: err.message || 'Error en el registro' });
      }
    } finally {
      setLoading(false);
    }
  };

  // Manejar login con Google
  const handleGoogleLogin = () => {
    // Redirigir a la ruta de autenticación de Google en el backend
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    window.location.href = `${API_URL}/api/auth/google`;
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          {/* Header */}
          <div className="auth-header">
            <div className="auth-icon">✨</div>
            <h1>Crear cuenta</h1>
            <p>Únete y comienza tu experiencia de compra</p>
          </div>

          {/* Mensaje de éxito */}
          {successMessage && (
            <div className="alert alert-success">
              <span className="alert-icon">✅</span>
              {successMessage}
            </div>
          )}
          {/* Error general */}
          {errors.general && (
            <div className="alert alert-error">
              <span className="alert-icon">⚠️</span>
              {errors.general}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">
                <span className="label-icon">👤</span>
                Nombre completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`form-input ${errors.name ? 'input-error' : ''}`}
                placeholder="Tu nombre completo"
                disabled={loading}
                autoComplete="name"
              />
              {errors.name && (
                <span className="error-message">
                  <span className="error-icon">⚠</span>
                  {errors.name}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <span className="label-icon">📧</span>
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'input-error' : ''}`}
                placeholder="tu@email.com"
                disabled={loading}
                autoComplete="email"
              />
              {errors.email && (
                <span className="error-message">
                  <span className="error-icon">⚠</span>
                  {errors.email}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <span className="label-icon">🔒</span>
                Contraseña
              </label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input ${errors.password ? 'input-error' : ''}`}
                  placeholder="Crea una contraseña segura"
                  disabled={loading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-password"
                  disabled={loading}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && (
                <span className="error-message">
                  <span className="error-icon">⚠</span>
                  {errors.password}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                <span className="label-icon">🔐</span>
                Confirmar contraseña
              </label>
              <div className="input-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                  placeholder="Confirma tu contraseña"
                  disabled={loading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="toggle-password"
                  disabled={loading}
                  aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="error-message">
                  <span className="error-icon">⚠</span>
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="checkbox-container">
                <input 
                  type="checkbox" 
                  checked={acceptTerms}
                  onChange={(e) => {
                    setAcceptTerms(e.target.checked);
                    if (errors.terms) {
                      setErrors(prev => ({ ...prev, terms: '' }));
                    }
                  }}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">
                  Acepto los{' '}
                  <Link to="/terms" className="link-primary">
                    términos y condiciones
                  </Link>
                </span>
              </label>
              {errors.terms && (
                <span className="error-message">
                  <span className="error-icon">⚠</span>
                  {errors.terms}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Creando cuenta...
                </>
              ) : (
                <>
                  <span>🚀</span>
                  Crear cuenta
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="divider">
            <span>O regístrate con</span>
          </div>

          {/* Social Login */}
          <div className="social-buttons">
            <button 
              type="button" 
              className="btn btn-google"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <svg className="social-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar con Google
            </button>
          </div>

          {/* Footer */}
          <div className="auth-footer">
            <p>
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="link-primary link-bold">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>

        {/* Benefits Sidebar */}
        <div className="auth-benefits">
          <h3>Beneficios de registrarte</h3>
          <div className="benefits-list">
            <div className="benefit-item">
              <div className="benefit-icon">🎯</div>
              <div className="benefit-content">
                <h4>Proceso rápido</h4>
                <p>Registro en menos de 1 minuto</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">�</div>
              <div className="benefit-content">
                <h4>Datos seguros</h4>
                <p>Protección de tu información</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">💎</div>
              <div className="benefit-content">
                <h4>Ofertas exclusivas</h4>
                <p>Acceso a descuentos especiales</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">📱</div>
              <div className="benefit-content">
                <h4>Compra desde cualquier lugar</h4>
                <p>Accede desde todos tus dispositivos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;