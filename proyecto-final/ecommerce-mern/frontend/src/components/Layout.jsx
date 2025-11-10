import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import '../styles/layout.css';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItems } = useCart();
  const { user, isAuthenticated, isSeller, logout } = useAuth();

  console.log('📄 Layout renderizado:', { user, isAuthenticated, isSeller });

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <Link to="/" className="logo">
              <span className="logo-icon">🧁</span>
              <span className="logo-text">Rincón de Pasteleros</span>
            </Link>

            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="¿Qué estás buscando?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" aria-label="Buscar">🔍</button>
            </form>

            <nav className="nav">
              <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
                Inicio
              </Link>
              <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>
                Acerca de
              </Link>
              <Link to="/products" className={`nav-link ${isActive('/products') ? 'active' : ''}`}>
                Productos
              </Link>
              {isSeller && (
                <Link to="/seller/products" className={`nav-link ${location.pathname.startsWith('/seller') ? 'active' : ''}`}>
                  Mis Productos
                </Link>
              )}
            </nav>

            <Link to="/cart" className="cart-button">
              <span className="cart-icon">🛒</span>
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
              <span className="cart-text">Carrito</span>
            </Link>

            {user ? (
              <div className="user-menu">
                <Link to="/profile" className="btn-profile">
                  👤 Mi Perfil
                </Link>
                <button onClick={handleLogout} className="btn-auth">Salir</button>
              </div>
            ) : (
              <div className="auth-links">
                <Link to="/login" className="btn-auth">Iniciar Sesión</Link>
                <Link to="/register" className="btn-auth btn-register">Registrarse</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="main-content">
        {children}
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-brand">
                <span className="footer-logo">🧁</span>
                <h3>Rincón de Pasteleros</h3>
                <p>Conectando el dulce talento artesanal con quienes lo valoran</p>
              </div>
            </div>
            
            <div className="footer-section">
              <h4>Navegación</h4>
              <ul>
                <li><Link to="/">Inicio</Link></li>
                <li><Link to="/products">Productos</Link></li>
                <li><Link to="/about">Acerca de</Link></li>
                <li><Link to="/cart">Carrito</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Para Vendedoras</h4>
              <ul>
                <li><Link to="/register">Registrarse</Link></li>
                <li><Link to="/seller/products">Mis Productos</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Contacto</h4>
              <p>📧 contacto@rinconpasteleros.com</p>
              <p>📍 Argentina</p>
              <div className="social-links">
                <a href="#" aria-label="Facebook">📘</a>
                <a href="#" aria-label="Instagram">📸</a>
                <a href="#" aria-label="WhatsApp">💬</a>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2025 Rincón de Pasteleros - Apoyando a Pasteleras Independientes</p>
            <p className="footer-love">Hecho con 💜 para impulsar emprendedoras</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;