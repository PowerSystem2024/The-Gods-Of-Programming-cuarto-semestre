import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

// Helper: Obtener emoji según categoría
const getCategoryIcon = (category) => {
  const categoryName = category?.main || category?.name || category || '';
  const icons = {
    'laptop': '💻',
    'gaming': '🎮',
    'auriculares': '🎧',
    'headphones': '🎧',
    'smartwatch': '⌚',
    'reloj': '⌚',
    'telefono': '📱',
    'phone': '📱',
    'tablet': '📱',
    'camara': '📷',
    'camera': '📷',
    'default': '📦'
  };
  
  const lowerCategory = categoryName.toLowerCase();
  for (const [key, icon] of Object.entries(icons)) {
    if (lowerCategory.includes(key)) return icon;
  }
  return icons.default;
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart, getItemQuantity } = useCart();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar producto
      const response = await productAPI.getById(id);
      setProduct(response.data.product);

      // Cargar productos relacionados (opcional)
      try {
        const relatedResponse = await productAPI.getRelated(id, 4);
        setRelatedProducts(relatedResponse.data.products || []);
      } catch (err) {
        console.warn('No se pudieron cargar productos relacionados:', err);
      }

    } catch (err) {
      console.error('Error cargando producto:', err);
      setError('No se pudo cargar el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product || product.stock === 0) return;

    setAddingToCart(true);
    try {
      await addToCart(product, quantity);
      setQuantity(1); // Reset quantity
    } catch (err) {
      console.error('Error agregando al carrito:', err);
      alert('Error al agregar al carrito');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando producto...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !product) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="error-container">
            <h2>❌ Error</h2>
            <p>{error || 'Producto no encontrado'}</p>
            <button onClick={() => navigate('/')} className="btn btn-primary">
              🏠 Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  const inCart = isInCart(product._id);
  const cartQuantity = getItemQuantity(product._id);
  const productImages = product.images || [];
  const categoryIcon = getCategoryIcon(product.category);

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Inicio</Link>
          <span>/</span>
          <Link to="/products">Productos</Link>
          <span>/</span>
          <span>{product.name}</span>
        </nav>

        {/* Product Details */}
        <div className="product-detail-container">
          {/* Gallery */}
          <div className="product-gallery">
            <div className="main-image-container">
              {productImages.length > 0 ? (
                <img 
                  src={productImages[selectedImage]} 
                  alt={product.name}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className="main-image-placeholder"
                style={{ display: productImages.length > 0 ? 'none' : 'flex' }}
              >
                {categoryIcon}
              </div>
            </div>

            {productImages.length > 1 && (
              <div className="thumbnail-container">
                {productImages.map((img, index) => (
                  <div
                    key={index}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={img} alt={`${product.name} - ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="product-detail-info">
            <div className="product-detail-header">
              <p className="product-detail-category">
                {product.category?.main || product.category?.name || 'Producto'}
              </p>
              <h1>{product.name}</h1>
              {product.sku && (
                <p style={{ color: 'var(--caramel)', fontSize: '0.9rem' }}>
                  SKU: {product.sku}
                </p>
              )}
            </div>

            <p className="product-detail-price">
              ${product.price.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </p>

            <p className="product-detail-description">
              {product.description}
            </p>

            {/* Stock Status */}
            <div 
              className={`product-detail-stock ${
                product.stock === 0 ? 'no-stock' : 
                product.stock < 10 ? 'low-stock' : ''
              }`}
            >
              {product.stock === 0 ? (
                <p><strong>❌ Sin stock</strong></p>
              ) : product.stock < 10 ? (
                <p><strong>⚠️ Últimas {product.stock} unidades</strong> - ¡Compra ahora!</p>
              ) : (
                <p><strong>✅ En stock</strong> - {product.stock} unidades disponibles</p>
              )}
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="quantity-selector">
                <label>Cantidad:</label>
                <div className="quantity-controls">
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="quantity-display">{quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Add to Cart */}
            {product.stock > 0 && (
              <button
                className="btn btn-primary add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={addingToCart}
              >
                {addingToCart ? (
                  <>⏳ Agregando...</>
                ) : inCart ? (
                  <>✅ Agregar más ({cartQuantity} en carrito)</>
                ) : (
                  <>🛒 Agregar al Carrito</>
                )}
              </button>
            )}

            {inCart && (
              <Link to="/cart" className="btn btn-secondary" style={{ width: '100%', textAlign: 'center' }}>
                👀 Ver mi carrito ({cartQuantity})
              </Link>
            )}

            {product.stock === 0 && (
              <button className="btn btn-secondary" disabled style={{ width: '100%' }}>
                ❌ Producto sin stock
              </button>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="related-products-section">
            <h2>🔗 Productos Relacionados</h2>
            <div className="product-grid">
              {relatedProducts.map(relatedProduct => (
                <ProductCard key={relatedProduct._id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
