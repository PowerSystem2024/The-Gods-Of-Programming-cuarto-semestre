import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI, cartAPI } from '../services/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  const loadProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar producto principal
      const productResponse = await productAPI.getById(id);
      setProduct(productResponse.data.product);

      // Cargar productos relacionados
      try {
        const relatedResponse = await productAPI.getRelated(id, 4);
        setRelatedProducts(relatedResponse.data.products || []);
      } catch (relatedError) {
        console.warn('Error loading related products:', relatedError);
        // No bloquear la carga del producto principal por este error
      }

    } catch (err) {
      setError('Producto no encontrado');
      console.error('Error loading product:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id, loadProduct]);

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      
      // Verificar si el usuario está autenticado
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login', { state: { from: `/products/${id}` } });
        return;
      }

      await cartAPI.add(product._id, quantity);
      
      // Mostrar mensaje de éxito (puedes implementar un toast o notificación)
      alert('Producto agregado al carrito exitosamente!');
      
    } catch (err) {
      console.error('Error adding to cart:', err);
      if (err.status === 401) {
        navigate('/login', { state: { from: `/products/${id}` } });
      } else {
        alert('Error agregando al carrito: ' + (err.message || 'Error desconocido'));
      }
    } finally {
      setAddingToCart(false);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <button onClick={() => navigate('/')} className="breadcrumb-link">
            Inicio
          </button>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">{product.name}</span>
        </nav>

        {/* Product Main Section */}
        <div className="product-main">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image">
              <img 
                src={product.images?.[selectedImage] || '/placeholder-image.jpg'} 
                alt={product.name}
                onError={(e) => {
                  e.target.src = '/placeholder-image.jpg';
                }}
              />
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="image-thumbnails">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} ${index + 1}`}
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-meta">
              <span className="product-category">
                {product.category}
                {product.subcategory && ` › ${product.subcategory}`}
              </span>
              {product.brand && (
                <span className="product-brand">Marca: {product.brand}</span>
              )}
            </div>

            <div className="product-price">
              <span className="current-price">
                ${product.price?.toLocaleString('es-AR')}
              </span>
            </div>

            <div className="product-stock">
              {product.stock > 0 ? (
                <span className="in-stock">
                  ✅ En stock ({product.stock} disponibles)
                </span>
              ) : (
                <span className="out-of-stock">❌ Sin stock</span>
              )}
            </div>

            {product.stock > 0 && (
              <div className="purchase-section">
                <div className="quantity-selector">
                  <label htmlFor="quantity">Cantidad:</label>
                  <div className="quantity-controls">
                    <button 
                      type="button"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      id="quantity"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (val >= 1 && val <= product.stock) {
                          setQuantity(val);
                        }
                      }}
                      className="quantity-input"
                    />
                    <button 
                      type="button"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart || product.stock === 0}
                  className="add-to-cart-btn"
                >
                  {addingToCart ? 'Agregando...' : 'Agregar al Carrito'}
                </button>
              </div>
            )}

            <div className="product-description">
              <h3>Descripción</h3>
              <p>{product.description}</p>
            </div>

            {/* Product Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="product-specs">
                <h3>Especificaciones</h3>
                <dl className="specs-list">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="spec-item">
                      <dt>{key.charAt(0).toUpperCase() + key.slice(1)}:</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Product Dimensions */}
            {product.dimensions && (
              <div className="product-dimensions">
                <h3>Dimensiones</h3>
                <p>
                  {product.dimensions.length}cm × {product.dimensions.width}cm × {product.dimensions.height}cm
                  {product.weight && ` • Peso: ${product.weight}kg`}
                </p>
              </div>
            )}

            {/* Product Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="product-tags">
                <h3>Etiquetas</h3>
                <div className="tags-list">
                  {product.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="related-products">
            <h2>Productos Relacionados</h2>
            <div className="products-grid">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct._id} className="product-card">
                  <button
                    onClick={() => navigate(`/products/${relatedProduct._id}`)}
                    className="product-link"
                  >
                    <div className="product-image">
                      <img 
                        src={relatedProduct.images?.[0] || '/placeholder-image.jpg'} 
                        alt={relatedProduct.name}
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                    </div>
                    <div className="product-info">
                      <h3 className="product-name">{relatedProduct.name}</h3>
                      <p className="product-price">
                        ${relatedProduct.price?.toLocaleString('es-AR')}
                      </p>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;