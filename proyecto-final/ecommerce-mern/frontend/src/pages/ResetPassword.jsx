import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/auth.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(`/api/auth/reset-password/${token}`, {
        password: formData.password
      });
      
      if (response.success) {
        setSuccess('¡Contraseña restablecida exitosamente!');
        
        // Guardar token si viene en la respuesta
        if (response.data?.token) {
          localStorage.setItem('token', response.data.token);
        }

        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          navigate('/login', { 
            state: { message: 'Contraseña restablecida. Inicia sesión con tu nueva contraseña.' }
          });
        }, 2000);
      }
    } catch (err) {
      setError(err.message || 'Error restableciendo la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Restablecer Contraseña</h1>
          <p>Ingresa tu nueva contraseña</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="password">🔒 Nueva Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
              disabled={loading || success}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">🔒 Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repite la contraseña"
              required
              disabled={loading || success}
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary btn-block"
            disabled={loading || success}
          >
            {loading ? '🔄 Restableciendo...' : '✅ Restablecer Contraseña'}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/login" className="link">
            ← Volver al login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
