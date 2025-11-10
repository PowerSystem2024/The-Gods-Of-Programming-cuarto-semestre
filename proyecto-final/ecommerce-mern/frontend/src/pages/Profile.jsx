import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Argentina'
    }
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/auth/profile');
      
      if (response.success) {
        setUser(response.data.user);
        setFormData({
          firstName: response.data.user.firstName || '',
          lastName: response.data.user.lastName || '',
          email: response.data.user.email || '',
          phone: response.data.user.phone || '',
          address: {
            street: response.data.user.address?.street || '',
            city: response.data.user.address?.city || '',
            state: response.data.user.address?.state || '',
            zipCode: response.data.user.address?.zipCode || '',
            country: response.data.user.address?.country || 'Argentina'
          }
        });
      }
    } catch (err) {
      setError(err.message || 'Error cargando el perfil');
      if (err.message.includes('sesión')) {
        setTimeout(() => navigate('/login'), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await api.put('/api/auth/profile', formData);
      
      if (response.success) {
        setSuccess('Perfil actualizado exitosamente');
        setUser(response.data.user);
        setIsEditing(false);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.message || 'Error actualizando el perfil');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      const response = await api.put('/api/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      if (response.success) {
        setSuccess('Contraseña cambiada exitosamente');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setShowPasswordForm(false);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.message || 'Error cambiando la contraseña');
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Cargando perfil...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-container">
        <div className="error-message">No se pudo cargar el perfil</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Mi Perfil</h1>
        {user.authProvider === 'google' && (
          <span className="oauth-badge">🔗 Conectado con Google</span>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="profile-content">
        {/* Información Personal */}
        <div className="profile-section">
          <div className="section-header">
            <h2>Información Personal</h2>
            {!isEditing && (
              <button 
                className="btn-edit"
                onClick={() => setIsEditing(true)}
              >
                ✏️ Editar
              </button>
            )}
          </div>

          {!isEditing ? (
            <div className="profile-info">
              <div className="info-row">
                <span className="label">Nombre:</span>
                <span className="value">{user.firstName || 'No especificado'}</span>
              </div>
              <div className="info-row">
                <span className="label">Apellido:</span>
                <span className="value">{user.lastName || 'No especificado'}</span>
              </div>
              <div className="info-row">
                <span className="label">Email:</span>
                <span className="value">{user.email}</span>
              </div>
              <div className="info-row">
                <span className="label">Teléfono:</span>
                <span className="value">{user.phone || 'No especificado'}</span>
              </div>
              <div className="info-row">
                <span className="label">Rol:</span>
                <span className="value role-badge">{user.role}</span>
              </div>
              <div className="info-row">
                <span className="label">Miembro desde:</span>
                <span className="value">
                  {new Date(user.createdAt).toLocaleDateString('es-AR')}
                </span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="profile-form">
              <div className="form-group">
                <label htmlFor="firstName">Nombre</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Tu nombre"
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Apellido</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Tu apellido"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={user.authProvider === 'google'}
                  placeholder="tu@email.com"
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Teléfono</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+54 9 11 1234-5678"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-save">
                  💾 Guardar Cambios
                </button>
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => {
                    setIsEditing(false);
                    fetchProfile();
                  }}
                >
                  ❌ Cancelar
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Dirección */}
        <div className="profile-section">
          <h2>Dirección de Envío</h2>
          {!isEditing ? (
            <div className="profile-info">
              <div className="info-row">
                <span className="label">Calle:</span>
                <span className="value">{user.address?.street || 'No especificada'}</span>
              </div>
              <div className="info-row">
                <span className="label">Ciudad:</span>
                <span className="value">{user.address?.city || 'No especificada'}</span>
              </div>
              <div className="info-row">
                <span className="label">Provincia:</span>
                <span className="value">{user.address?.state || 'No especificada'}</span>
              </div>
              <div className="info-row">
                <span className="label">Código Postal:</span>
                <span className="value">{user.address?.zipCode || 'No especificado'}</span>
              </div>
              <div className="info-row">
                <span className="label">País:</span>
                <span className="value">{user.address?.country || 'Argentina'}</span>
              </div>
            </div>
          ) : (
            <div className="address-form">
              <div className="form-group">
                <label htmlFor="address.street">Calle y Número</label>
                <input
                  type="text"
                  id="address.street"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleInputChange}
                  placeholder="Av. Ejemplo 1234"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="address.city">Ciudad</label>
                  <input
                    type="text"
                    id="address.city"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleInputChange}
                    placeholder="Buenos Aires"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address.state">Provincia</label>
                  <input
                    type="text"
                    id="address.state"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleInputChange}
                    placeholder="CABA"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="address.zipCode">Código Postal</label>
                  <input
                    type="text"
                    id="address.zipCode"
                    name="address.zipCode"
                    value={formData.address.zipCode}
                    onChange={handleInputChange}
                    placeholder="C1234ABC"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address.country">País</label>
                  <input
                    type="text"
                    id="address.country"
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleInputChange}
                    placeholder="Argentina"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Cambiar Contraseña - Solo para usuarios locales */}
        {user.authProvider === 'local' && (
          <div className="profile-section">
            <div className="section-header">
              <h2>Seguridad</h2>
              {!showPasswordForm && (
                <button 
                  className="btn-edit"
                  onClick={() => setShowPasswordForm(true)}
                >
                  🔒 Cambiar Contraseña
                </button>
              )}
            </div>

            {showPasswordForm && (
              <form onSubmit={handleChangePassword} className="password-form">
                <div className="form-group">
                  <label htmlFor="currentPassword">Contraseña Actual</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    placeholder="Tu contraseña actual"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="newPassword">Nueva Contraseña</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength={6}
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    placeholder="Repite la nueva contraseña"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-save">
                    🔐 Cambiar Contraseña
                  </button>
                  <button 
                    type="button" 
                    className="btn-cancel"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      });
                    }}
                  >
                    ❌ Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
