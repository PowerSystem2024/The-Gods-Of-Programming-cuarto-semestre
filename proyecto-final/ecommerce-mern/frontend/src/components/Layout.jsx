import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Layout.css';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItems } = useCart();

  useEffect(() => {
    // Verificar si hay usuario logueado
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/', { replace: true });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="layout">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            {/* Logo */}
            <Link to="/" className="logo">
              <span className="logo-icon">🛍️</span>
              <span className="logo-text">MiTienda</span>
            </Link>

            {/* Búsqueda - Desktop */}
            <form onSubmit={handleSearch} className="search-form desktop-only">
              <input
                type="text"
                placeholder="¿Qué estás buscando?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button">
                🔍
              </button>
            </form>

            {/* Navegación - Desktop */}
            <nav className="nav desktop-only">
              <Link 
                to="/" 
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
              >
                Inicio
              </Link>
              <Link 
                to="/products" 
                className={`nav-link ${isActive('/products') ? 'active' : ''}`}
              >
                Productos
              </Link>
              <Link 
                to="/categories" 
                className={`nav-link ${isActive('/categories') ? 'active' : ''}`}
              >
                Categorías
              </Link>
              <Link 
                to="/offers" 
                className={`nav-link ${isActive('/offers') ? 'active' : ''}`}
              >
                Ofertas
              </Link>
            </nav>

            {/* Acciones del usuario */}
            <div className="header-actions">
              {/* Carrito */}
              <Link to="/cart" className="cart-button">
                <span className="cart-icon">🛒</span>
                {totalItems > 0 && (
                  <span className="cart-badge">{totalItems}</span>
                )}
                <span className="cart-text desktop-only">Carrito</span>
              </Link>

              {/* Usuario */}
              {user ? (
                <div className="user-menu">
                  <button className="user-button">
                    <span className="user-avatar">👤</span>
                    <span className="user-name desktop-only">{user.name}</span>
                    <span className="dropdown-arrow desktop-only">▼</span>
                  </button>
                  <div className="user-dropdown">
                    <Link to="/profile" className="dropdown-link">
                      Mi Perfil
                    </Link>
                    <Link to="/orders" className="dropdown-link">
                      Mis Pedidos
                    </Link>
                    <Link to="/wishlist" className="dropdown-link">
                      Lista de Deseos
                    </Link>
                    <hr />
                    <button onClick={handleLogout} className="dropdown-link logout">
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              ) : (
                <div className="auth-buttons desktop-only">
                  <Link to="/login" className="auth-button login">
                    Iniciar Sesión
                  </Link>
                  <Link to="/register" className="auth-button register">
                    Registrarse
                  </Link>
                </div>
              )}

              {/* Menú móvil */}
              <button 
                className="mobile-menu-toggle mobile-only"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </button>
            </div>
          </div>

          {/* Menú móvil */}
          <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
            {/* Búsqueda móvil */}
            <form onSubmit={handleSearch} className="mobile-search">
              <input
                type="text"
                placeholder="¿Qué estás buscando?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button">
                🔍
              </button>
            </form>

            {/* Navegación móvil */}
            <nav className="mobile-nav">
              <Link 
                to="/" 
                className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>🏠</span>
                Inicio
              </Link>
              <Link 
                to="/products" 
                className={`mobile-nav-link ${isActive('/products') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>📦</span>
                Productos
              </Link>
              <Link 
                to="/categories" 
                className={`mobile-nav-link ${isActive('/categories') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>📂</span>
                Categorías
              </Link>
              <Link 
                to="/offers" 
                className={`mobile-nav-link ${isActive('/offers') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>🎁</span>
                Ofertas
              </Link>
            </nav>

            {/* Usuario móvil */}
            {user ? (
              <div className="mobile-user">
                <div className="mobile-user-info">
                  <span className="user-avatar">👤</span>
                  <span className="user-name">{user.name}</span>
                </div>
                <div className="mobile-user-links">
                  <Link 
                    to="/profile" 
                    className="mobile-nav-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>👤</span>
                    Mi Perfil
                  </Link>
                  <Link 
                    to="/orders" 
                    className="mobile-nav-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>📋</span>
                    Mis Pedidos
                  </Link>
                  <Link 
                    to="/wishlist" 
                    className="mobile-nav-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>❤️</span>
                    Lista de Deseos
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="mobile-nav-link logout"
                  >
                    <span>🚪</span>
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            ) : (
              <div className="mobile-auth">
                <Link 
                  to="/login" 
                  className="mobile-auth-button login"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  to="/register" 
                  className="mobile-auth-button register"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="main">
        {children}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            {/* Información de la empresa */}
            <div className="footer-section">
              <h3>MiTienda</h3>
              <p>Tu tienda online de confianza. Encuentra los mejores productos al mejor precio.</p>
              <div className="social-links">
                <a href="#" aria-label="Facebook">📘</a>
                <a href="#" aria-label="Instagram">📷</a>
                <a href="#" aria-label="Twitter">🐦</a>
                <a href="#" aria-label="YouTube">📺</a>
              </div>
            </div>

            {/* Enlaces rápidos */}
            <div className="footer-section">
              <h4>Enlaces Rápidos</h4>
              <ul>
                <li><Link to="/">Inicio</Link></li>
                <li><Link to="/products">Productos</Link></li>
                <li><Link to="/categories">Categorías</Link></li>
                <li><Link to="/offers">Ofertas</Link></li>
                <li><Link to="/contact">Contacto</Link></li>
              </ul>
            </div>

            {/* Atención al cliente */}
            <div className="footer-section">
              <h4>Atención al Cliente</h4>
              <ul>
                <li><Link to="/help">Centro de Ayuda</Link></li>
                <li><Link to="/shipping">Envíos</Link></li>
                <li><Link to="/returns">Devoluciones</Link></li>
                <li><Link to="/warranty">Garantías</Link></li>
                <li><Link to="/faq">Preguntas Frecuentes</Link></li>
              </ul>
            </div>

            {/* Información legal */}
            <div className="footer-section">
              <h4>Información Legal</h4>
              <ul>
                <li><Link to="/terms">Términos y Condiciones</Link></li>
                <li><Link to="/privacy">Política de Privacidad</Link></li>
                <li><Link to="/cookies">Política de Cookies</Link></li>
                <li><Link to="/about">Acerca de Nosotros</Link></li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p>&copy; 2024 MiTienda. Todos los derechos reservados.</p>
              <div className="payment-methods">
                <span>💳</span>
                <span>💰</span>
                <span>🏦</span>
                <span>📱</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;