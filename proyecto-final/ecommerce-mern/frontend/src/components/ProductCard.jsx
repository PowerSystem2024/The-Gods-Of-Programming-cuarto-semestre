import { Link } from 'react-router-dom';
import './ProductStyles.css';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} className="product-link">
        <div className="product-image">
          {product.images && product.images.length > 0 && product.images[0] ? (
            <img 
              src={product.images[0]} 
              alt={product.name}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : (
            <div className="placeholder-image">
              📦
            </div>
          )}
          {product.stock === 0 && (
            <div className="out-of-stock-overlay">
              <span>Sin Stock</span>
            </div>
          )}
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-category">
            {product.category?.main || product.category || 'Sin categoría'}
          </p>
          <p className="product-price">
            ${product.price?.toLocaleString('es-AR')}
          </p>
          <div className="product-meta">
            <span className={`product-stock ${product.stock === 0 ? 'out-of-stock' : ''}`}>
              {product.stock > 0 ? `Stock: ${product.stock}` : 'Sin stock'}
            </span>
            {product.rating && product.rating > 0 && (
              <span className="product-rating">
                ⭐ {product.rating.toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </Link>
      
      <div className="product-actions">
        <Link 
          to={`/product/${product._id}`} 
          className="btn btn-primary"
        >
          Ver Detalles
        </Link>
      </div>
    </div>
  );
};

// PropTypes removed for simplicity

export default ProductCard;