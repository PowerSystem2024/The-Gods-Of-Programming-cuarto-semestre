import ProductCard from './ProductCard';
import './ProductStyles.css';

const ProductList = ({ products, loading, error, onRetry }) => {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        {onRetry && (
          <button onClick={onRetry} className="retry-button">
            Reintentar
          </button>
        )}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="no-products">
        <p>No se encontraron productos</p>
      </div>
    );
  }

  return (
    <div className="products-grid">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

// PropTypes removed for simplicity

export default ProductList;