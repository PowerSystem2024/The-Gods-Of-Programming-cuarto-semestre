import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

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
    } else if (formData.name.length > 50) {
      newErrors.name = 'El nombre no puede exceder 50 caracteres';
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
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'La contraseña debe contener al menos: 1 mayúscula, 1 minúscula y 1 número';
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

      // Preparar datos para enviar (sin confirmPassword)
      // eslint-disable-next-line no-unused-vars
      const { confirmPassword, ...registerData } = formData;

      const response = await authAPI.register(registerData);
      
      // Guardar token y datos del usuario
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Redirigir al usuario
      navigate('/', { replace: true });
      
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

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '' };
    
    let strength = 0;
    const checks = [
      password.length >= 6,
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /\d/.test(password),
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
    ];
    
    strength = checks.filter(Boolean).length;
    
    const labels = ['Muy débil', 'Débil', 'Regular', 'Buena', 'Muy fuerte'];
    const colors = ['#ff4444', '#ff8800', '#ffaa00', '#88cc00', '#00cc44'];
    
    return {
      strength: (strength / 5) * 100,
      label: labels[Math.max(0, strength - 1)] || '',
      color: colors[Math.max(0, strength - 1)] || '#ddd'
    };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="register-page">
      <div className="container">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h1>Crear Cuenta</h1>
              <p>Únete a nosotros y disfruta de todos los beneficios</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {errors.general && (
                <div className="error-alert">
                  {errors.general}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="name">Nombre completo</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="Tu nombre completo"
                  disabled={loading}
                />
                {errors.name && (
                  <span className="error-message">{errors.name}</span>
                )}
              </div>

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
                    placeholder="Crea una contraseña segura"
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
                
                {formData.password && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div 
                        className="strength-fill"
                        style={{ 
                          width: `${passwordStrength.strength}%`,
                          backgroundColor: passwordStrength.color
                        }}
                      ></div>
                    </div>
                    <span 
                      className="strength-label"
                      style={{ color: passwordStrength.color }}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                )}
                
                {errors.password && (
                  <span className="error-message">{errors.password}</span>
                )}
                
                <div className="password-requirements">
                  <p>La contraseña debe contener:</p>
                  <ul>
                    <li className={formData.password.length >= 6 ? 'valid' : ''}>
                      Al menos 6 caracteres
                    </li>
                    <li className={/[a-z]/.test(formData.password) ? 'valid' : ''}>
                      Una letra minúscula
                    </li>
                    <li className={/[A-Z]/.test(formData.password) ? 'valid' : ''}>
                      Una letra mayúscula
                    </li>
                    <li className={/\d/.test(formData.password) ? 'valid' : ''}>
                      Un número
                    </li>
                  </ul>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar contraseña</label>
                <div className="password-input-container">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                    placeholder="Confirma tu contraseña"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="password-toggle"
                    disabled={loading}
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="error-message">{errors.confirmPassword}</span>
                )}
              </div>

              <div className="form-group">
                <label className="checkbox-label">
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
                  <span>
                    Acepto los{' '}
                    <Link to="/terms" target="_blank" className="terms-link">
                      términos y condiciones
                    </Link>
                    {' '}y la{' '}
                    <Link to="/privacy" target="_blank" className="terms-link">
                      política de privacidad
                    </Link>
                  </span>
                </label>
                {errors.terms && (
                  <span className="error-message">{errors.terms}</span>
                )}
              </div>

              <button
                type="submit"
                className="auth-button"
                disabled={loading}
              >
                {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                ¿Ya tienes una cuenta?{' '}
                <Link to="/login" className="auth-link">
                  Inicia sesión aquí
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
                onClick={() => alert('Próximamente: Registro con Google')}
              >
                <span>🔍</span>
                Continuar con Google
              </button>
              <button 
                type="button" 
                className="social-button facebook"
                onClick={() => alert('Próximamente: Registro con Facebook')}
              >
                <span>📘</span>
                Continuar con Facebook
              </button>
            </div>
          </div>

          <div className="auth-benefits">
            <h3>¿Por qué crear una cuenta?</h3>
            <ul>
              <li>
                <span className="benefit-icon">🎁</span>
                <div>
                  <strong>Ofertas exclusivas</strong>
                  <p>Recibe descuentos especiales solo para miembros</p>
                </div>
              </li>
              <li>
                <span className="benefit-icon">⚡</span>
                <div>
                  <strong>Compra más rápida</strong>
                  <p>Checkout express con un solo clic</p>
                </div>
              </li>
              <li>
                <span className="benefit-icon">📱</span>
                <div>
                  <strong>Notificaciones</strong>
                  <p>Mantente al día con tus pedidos y ofertas</p>
                </div>
              </li>
              <li>
                <span className="benefit-icon">🏆</span>
                <div>
                  <strong>Programa de puntos</strong>
                  <p>Gana puntos con cada compra y canjéalos</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;