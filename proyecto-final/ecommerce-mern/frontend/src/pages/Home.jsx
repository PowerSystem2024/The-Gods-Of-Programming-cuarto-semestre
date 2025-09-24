import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../services/api';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    sort: '-createdAt'
  });

  // Cargar productos al montar el componente
  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        search: searchTerm,
        page: 1,
        limit: 12
      };
      
      const response = await productAPI.getAll(params);
      setProducts(response.data.products || []);
      setError(null);
    } catch (err) {
      setError('Error cargando productos');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadProducts();
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  if (loading) {
    return (
      <div className="home-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Bienvenido a Nuestro E-commerce</h1>
          <p>Descubre los mejores productos con la mejor calidad y precios</p>
          <Link to="/products" className="cta-button">
            Ver Todos los Productos
          </Link>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="search-section">
        <div className="container">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button">
                Buscar
              </button>
            </div>
          </form>

          <div className="filters">
            <select 
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="filter-select"
            >
              <option value="">Todas las categorías</option>
              <option value="Electrónicos">Electrónicos</option>
              <option value="Ropa">Ropa</option>
              <option value="Hogar">Hogar</option>
              <option value="Deportes">Deportes</option>
            </select>

            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="filter-select"
            >
              <option value="-createdAt">Más recientes</option>
              <option value="price">Precio: menor a mayor</option>
              <option value="-price">Precio: mayor a menor</option>
              <option value="name">Nombre A-Z</option>
              <option value="-name">Nombre Z-A</option>
            </select>

            <div className="price-filters">
              <input
                type="number"
                placeholder="Precio mín"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="price-input"
              />
              <input
                type="number"
                placeholder="Precio máx"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="price-input"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="products-section">
        <div className="container">
          <h2>Productos Destacados</h2>
          
          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={loadProducts} className="retry-button">
                Reintentar
              </button>
            </div>
          )}

          {products.length === 0 && !loading && !error && (
            <div className="no-products">
              <p>No se encontraron productos</p>
            </div>
          )}

          <div className="products-grid">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                <Link to={`/products/${product._id}`} className="product-link">
                  <div className="product-image">
                    <img 
                      src={product.images?.[0] || '/placeholder-image.jpg'} 
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-category">{product.category}</p>
                    <p className="product-price">
                      ${product.price?.toLocaleString('es-AR')}
                    </p>
                    <div className="product-meta">
                      <span className="product-stock">
                        {product.stock > 0 ? `Stock: ${product.stock}` : 'Sin stock'}
                      </span>
                      {product.rating && (
                        <span className="product-rating">
                          ⭐ {product.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
                
                <div className="product-actions">
                  <Link 
                    to={`/products/${product._id}`} 
                    className="btn btn-primary"
                  >
                    Ver Detalles
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>¿Por qué elegirnos?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Envío Gratis</h3>
              <p>Envío gratuito en compras superiores a $10,000</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Compra Segura</h3>
              <p>Tus datos están protegidos con encriptación SSL</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎧</div>
              <h3>Soporte 24/7</h3>
              <p>Atención al cliente disponible las 24 horas</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">↩️</div>
              <h3>Devolución Fácil</h3>
              <p>30 días para devolver tu producto sin preguntas</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;