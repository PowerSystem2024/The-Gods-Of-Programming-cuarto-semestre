import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import ProductList from '../components/ProductList';
import SearchFilters from '../components/SearchFilters';

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
    console.log('Home component mounted, loading products...');
    console.log('API Base URL:', import.meta.env.VITE_API_URL);
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      console.log('Home - API Response:', response); // Debug
      console.log('Products array:', response.data?.products); // Debug
      setProducts(response.data?.products || []);
      setError(null);
    } catch (err) {
      console.error('Error loading products:', err);
      console.error('Error details:', err.message, err.status);
      
      let errorMsg = 'Error cargando productos';
      if (err.message && err.message !== 'Error desconocido') {
        errorMsg = err.message;
      } else if (err.originalError?.code === 'ERR_NETWORK') {
        errorMsg = 'Error de conexión - Verifica que el servidor esté funcionando';
      }
      
      setError(errorMsg);
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
        <div className="container">
          <div className="hero-content">
            <h1>¡Bienvenido a Rincón de Pasteleros! 🧁</h1>
            <p>El marketplace donde pasteleras independientes comparten su talento. Descubre deliciosos postres artesanales, compara precios y apoya a emprendedoras locales que están creciendo.</p>
            <Link to="/products" className="btn btn-primary">
              Explorar Delicias
            </Link>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="search-section">
        <div className="container">
          <SearchFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
          />
        </div>
      </section>

      {/* Products Grid */}
      <section className="products-section">
        <div className="container">
          <h2>✨ Delicias Artesanales Destacadas</h2>
          <ProductList 
            products={products}
            loading={loading}
            error={error}
            onRetry={loadProducts}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>¿Por qué Rincón de Pasteleros?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">�‍🍳</div>
              <h3>Apoya lo Local</h3>
              <p>Conecta con pasteleras independientes y emprendedoras de tu comunidad</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">�</div>
              <h3>Compara Precios</h3>
              <p>Encuentra las mejores ofertas comparando entre múltiples vendedoras</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">�</div>
              <h3>Productos Únicos</h3>
              <p>Descubre recetas artesanales y postres hechos con amor</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Impulsa Negocios</h3>
              <p>Ayuda a pasteleras en crecimiento a darse a conocer y expandirse</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;