import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// 🎨 Helper: Obtener emoji según categoría
const getCategoryIcon = (category) => {
  const categoryName = category?.main || category?.subcategory || category?.name || category || '';
  const icons = {
    'torta': '🎂',
    'tortas': '🎂',
    'cake': '�',
    'alfajor': '🥮',
    'alfajores': '🥮',
    'cookie': '🍪',
    'cookies': '�',
    'galleta': '🍪',
    'cupcake': '🧁',
    'cupcakes': '🧁',
    'brownie': '🍫',
    'brownies': '🍫',
    'chocolate': '🍫',
    'trufa': '🍬',
    'trufas': '🍬',
    'medialuna': '🥐',
    'medialunas': '🥐',
    'factura': '🥐',
    'facturas': '🥐',
    'pastelería': '🧁',
    'default': '🍰'
  };
  
  const lowerCategory = categoryName.toLowerCase();
  for (const [key, icon] of Object.entries(icons)) {
    if (lowerCategory.includes(key)) return icon;
  }
  return icons.default;
};

const ProductCard = ({ product }) => {
  const { addToCart, isInCart } = useCart();
  
  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.stock === 0) return;
    
    try {
      await addToCart(product, 1);
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  const productImage = product.images?.find(img => img.isPrimary)?.url || product.images?.[0]?.url;
  const categoryIcon = getCategoryIcon(product.category);
  const inCart = isInCart(product._id);

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} className="product-link">
        <div className="product-image">
          {productImage ? (
            <img 
              src={productImage} 
              alt={product.name}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className="placeholder-image" 
            style={{ display: productImage ? 'none' : 'flex' }}
          >
            <span className="placeholder-icon">{categoryIcon}</span>
          </div>
          {product.stock === 0 && (
            <div className="out-of-stock-overlay">
              <span>Sin Stock</span>
            </div>
          )}
          {product.featured && (
            <span className="badge featured-badge">⭐ Destacado</span>
          )}
        </div>
        
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-category">
            {product.category?.main || product.category?.name || 'Sin categoría'}
          </p>
          <p className="product-description">
            {product.description?.substring(0, 80)}
            {product.description?.length > 80 ? '...' : ''}
          </p>
          <p className="product-price">
            ${product.price?.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
          </p>
          <div className="product-meta">
            <span className={`stock-badge ${product.stock === 0 ? 'out' : product.stock < 10 ? 'low' : 'available'}`}>
              {product.stock === 0 ? '❌ Sin stock' : 
               product.stock < 10 ? `⚠️ Últimas ${product.stock}` :
               `✅ Stock: ${product.stock}`}
            </span>
          </div>
        </div>
      </Link>
      
      <div className="product-actions">
        {product.stock > 0 && !inCart && (
          <button 
            onClick={handleQuickAdd}
            className="btn btn-secondary quick-add"
            title="Agregar al carrito"
          >
            🛒 Agregar
          </button>
        )}
        {inCart && (
          <span className="in-cart-badge">✅ En carrito</span>
        )}
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