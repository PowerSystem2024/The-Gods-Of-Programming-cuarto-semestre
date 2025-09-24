import { useState, useEffect } from 'react';
import { productAPI } from '../services/api';
import ProductList from '../components/ProductList';
import SearchFilters from '../components/SearchFilters';

const Products = () => {
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
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  // Cargar productos al montar el componente
  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.page]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        search: searchTerm,
        page: pagination.page,
        limit: pagination.limit
      };
      
      const response = await productAPI.getAll(params);
      console.log('API Response:', response); // Debug
      console.log('Products array:', response.data?.products); // Debug
      
      setProducts(response.data?.products || []);
      setPagination(prev => ({
        ...prev,
        total: response.data?.pagination?.total || 0,
        pages: response.data?.pagination?.pages || 1
      }));
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
    setPagination(prev => ({ ...prev, page: 1 }));
    loadProducts();
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  if (loading) {
    return (
      <div className="products-page">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando productos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="container">
        <h1>Todos los Productos</h1>
        
        {/* Search and Filters */}
        <SearchFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
        />

        {/* Products List */}
        <ProductList 
          products={products}
          loading={loading}
          error={error}
          onRetry={loadProducts}
        />

        {/* Products Grid and Pagination */}
        {products.length > 0 && (
          <>
            {/* Pagination is now handled by the parent component */}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="pagination">
                <button 
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="pagination-btn"
                >
                  Anterior
                </button>
                
                <div className="pagination-info">
                  Página {pagination.page} de {pagination.pages} 
                  ({pagination.total} productos)
                </div>
                
                <button 
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="pagination-btn"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;