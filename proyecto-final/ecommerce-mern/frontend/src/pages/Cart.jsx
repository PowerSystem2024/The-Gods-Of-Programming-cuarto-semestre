import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// Helper: Obtener emoji según categoría
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

const Cart = () => {
  const navigate = useNavigate();
  const {
    items,
    loading,
    error,
    total,
    itemsCount,
    updateQuantity,
    removeFromCart,
    clearCart,
    incrementItem,
    decrementItem
  } = useCart();
  
  const [updatingItems, setUpdatingItems] = useState(new Set());

  const handleIncrement = async (productId) => {
    setUpdatingItems(prev => new Set([...prev, productId]));
    await incrementItem(productId);
    setUpdatingItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
  };

  const handleDecrement = async (productId) => {
    setUpdatingItems(prev => new Set([...prev, productId]));
    await decrementItem(productId);
    setUpdatingItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
  };

  const handleRemove = async (productId, productName) => {
    if (window.confirm(`¿Eliminar "${productName}" del carrito?`)) {
      setUpdatingItems(prev => new Set([...prev, productId]));
      await removeFromCart(productId);
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('¿Estás seguro de vaciar todo el carrito?')) {
      await clearCart();
    }
  };

  const handleCheckout = () => {
    // Verificar si está autenticado
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para finalizar la compra');
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    
    // Verificar que hay productos en el carrito
    if (items.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }
    
    // Redirigir a checkout
    navigate('/checkout');
  };

  // Loading State
  if (loading) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-loading">
            <div className="loading-spinner"></div>
            <p>Cargando carrito...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-error">
            <h2>❌ Error</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="btn btn-primary">
              🔄 Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty Cart
  if (!items || items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Tu carrito está vacío</h2>
            <p>Descubre nuestros increíbles productos y empieza a comprar</p>
            <Link to="/products" className="btn btn-primary">
              🛍️ Explorar Productos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const shippingCost = total > 50000 ? 0 : 5000;
  const finalTotal = total + shippingCost;

  return (
    <div className="cart-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Inicio</Link>
          <span>/</span>
          <span>Carrito</span>
        </nav>

        {/* Header */}
        <div className="cart-header-actions">
          <h1>🛒 Mi Carrito ({itemsCount} {itemsCount === 1 ? 'producto' : 'productos'})</h1>
          <button 
            onClick={handleClearCart}
            className="clear-cart-btn"
          >
            🗑️ Vaciar Carrito
          </button>
        </div>

        {/* Cart Layout */}
        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            {items.map(item => {
              const product = item.product;
              const isUpdating = updatingItems.has(product._id);
              const productImage = product.images?.[0];
              const categoryIcon = getCategoryIcon(product.category);
              const itemSubtotal = product.price * item.quantity;

              return (
                <div 
                  key={product._id} 
                  className="cart-item"
                  style={{ opacity: isUpdating ? 0.6 : 1 }}
                >
                  {/* Image */}
                  <div className="cart-item-image">
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
                      className="cart-item-placeholder"
                      style={{ display: productImage ? 'none' : 'flex' }}
                    >
                      {categoryIcon}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="cart-item-info">
                    <h3 className="cart-item-name">
                      <Link to={`/product/${product._id}`}>
                        {product.name}
                      </Link>
                    </h3>
                    <p className="cart-item-price">
                      ${product.price.toLocaleString('es-AR', { minimumFractionDigits: 2 })} c/u
                    </p>
                    <p className="cart-item-stock">
                      {product.stock > item.quantity ? 
                        `✅ Disponible (${product.stock} en stock)` :
                        `⚠️ Stock limitado`
                      }
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="cart-item-actions">
                    <div className="cart-quantity-controls">
                      <button
                        className="cart-quantity-btn"
                        onClick={() => handleDecrement(product._id)}
                        disabled={isUpdating || item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="cart-quantity-display">{item.quantity}</span>
                      <button
                        className="cart-quantity-btn"
                        onClick={() => handleIncrement(product._id)}
                        disabled={isUpdating || item.quantity >= product.stock}
                      >
                        +
                      </button>
                    </div>

                    <p className="cart-item-subtotal">
                      ${itemSubtotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </p>

                    <button
                      className="cart-remove-btn"
                      onClick={() => handleRemove(product._id, product.name)}
                      disabled={isUpdating}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <aside className="cart-summary">
            <h2>💰 Resumen</h2>
            
            <div className="cart-summary-row subtotal">
              <span>Subtotal ({itemsCount} {itemsCount === 1 ? 'producto' : 'productos'}):</span>
              <strong>${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</strong>
            </div>

            <div className="cart-summary-row shipping">
              <span>Envío:</span>
              <strong>
                {shippingCost === 0 ? (
                  <span style={{ color: 'var(--success)' }}>✅ GRATIS</span>
                ) : (
                  `$${shippingCost.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`
                )}
              </strong>
            </div>

            {total < 50000 && (
              <p style={{ fontSize: '0.9rem', color: 'var(--caramel)', marginBottom: '1rem' }}>
                💡 Te faltan ${(50000 - total).toLocaleString('es-AR')} para envío gratis
              </p>
            )}

            <div className="cart-summary-row total">
              <span>Total:</span>
              <strong>${finalTotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</strong>
            </div>

            <div className="cart-summary-actions">
              <button 
                className="btn btn-primary checkout-btn"
                onClick={handleCheckout}
              >
                💳 Finalizar Compra
              </button>
              <Link 
                to="/products" 
                className="btn btn-secondary continue-shopping-btn"
              >
                ⬅️ Seguir Comprando
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Cart;
