import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await api.post('/api/auth/forgot-password', { email });
      
      if (response.success) {
        setSuccess(response.message || 'Correo de recuperación enviado exitosamente');
        setEmail('');
      }
    } catch (err) {
      // Si es timeout, mostrar mensaje personalizado
      if (err.code === 'ECONNABORTED' || (err.message && err.message.includes('timeout'))) {
        setError('El servidor está tardando en responder. Si el email existe, recibirás las instrucciones en unos minutos. Por favor revisa tu bandeja de entrada y spam.');
      } else {
        setError(err.message || 'Error enviando el correo de recuperación');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>¿Olvidaste tu contraseña?</h1>
          <p>Ingresa tu email y te enviaremos instrucciones para recuperarla</p>
        </div>

        <div style={{ background: '#fffbe6', color: '#b8860b', border: '1px solid #ffe58f', borderRadius: 6, padding: '10px 16px', marginBottom: 16, fontSize: '0.95rem' }}>
          <b>Nota:</b> El backend está desplegado en Render, que <b>bloquea el envío de correos por Gmail</b>. Si no recibes el email, es por esta limitación del hosting gratuito. Puedes probar localmente o consultar al administrador.
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && (
          <div className="success-message">
            <p>{success}</p>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
              Revisa tu bandeja de entrada y carpeta de spam
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">📧 Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary btn-block"
            disabled={loading}
          >
            {loading ? '🔄 Enviando...' : '📮 Enviar Instrucciones'}
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

export default ForgotPassword;
