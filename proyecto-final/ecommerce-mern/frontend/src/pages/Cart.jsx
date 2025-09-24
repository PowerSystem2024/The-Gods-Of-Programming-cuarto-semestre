import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  // const navigate = useNavigate(); // Comentado hasta que se use
  const {
    items,
    loading,
    error,
    totalPrice,
    totalItems,
    isEmpty,
    updateQuantity,
    removeFromCart,
    clearCart,
    incrementItem,
    decrementItem
  } = useCart();
  const [updatingItems, setUpdatingItems] = useState(new Set());

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    setUpdatingItems(prev => new Set([...prev, productId]));
    
    const success = await updateQuantity(productId, newQuantity);
    if (!success) {
      alert('Error actualizando la cantidad. Inténtalo de nuevo.');
    }
    
    setUpdatingItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
  };

  const handleRemoveItem = async (productId) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto del carrito?')) {
      return;
    }

    setUpdatingItems(prev => new Set([...prev, productId]));
    
    const success = await removeFromCart(productId);
    if (!success) {
      alert('Error eliminando el producto. Inténtalo de nuevo.');
    }
    
    setUpdatingItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
  };

  const handleClearCart = async () => {
    if (!window.confirm('¿Estás seguro de vaciar todo el carrito?')) {
      return;
    }

    const success = await clearCart();
    if (!success) {
      alert('Error vaciando el carrito. Inténtalo de nuevo.');
    }
  };

  const handleIncrementItem = async (productId) => {
    setUpdatingItems(prev => new Set([...prev, productId]));
    
    const success = await incrementItem(productId);
    if (!success) {
      alert('Error actualizando la cantidad. Inténtalo de nuevo.');
    }
    
    setUpdatingItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
  };

  const handleDecrementItem = async (productId) => {
    setUpdatingItems(prev => new Set([...prev, productId]));
    
    const success = await decrementItem(productId);
    if (!success) {
      alert('Error actualizando la cantidad. Inténtalo de nuevo.');
    }
    
    setUpdatingItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
  };

  // Los cálculos se realizan en el contexto (totalPrice, totalItems)

  if (loading) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando carrito...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="error-container">
            <h2>Error</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="btn btn-primary">
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Mi Carrito</h1>
          {!isEmpty && (
            <button 
              onClick={handleClearCart}
              disabled={loading}
              className="btn btn-secondary clear-cart-btn"
            >
              Vaciar Carrito
            </button>
          )}
        </div>

        {isEmpty ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Tu carrito está vacío</h2>
            <p>Agrega algunos productos para comenzar a comprar</p>
            <Link to="/" className="btn btn-primary">
              Continuar Comprando
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              <div className="cart-items-header">
                <span>Producto</span>
                <span>Precio</span>
                <span>Cantidad</span>
                <span>Subtotal</span>
                <span>Acciones</span>
              </div>

              {items.map((item) => (
                <div key={`${item.product._id}-${item.variantId || 'default'}`} className="cart-item">
                  <div className="item-info">
                    <Link to={`/products/${item.product._id}`} className="item-image">
                      <img 
                        src={item.product.images?.[0] || '/placeholder-image.jpg'} 
                        alt={item.product.name}
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                    </Link>
                    <div className="item-details">
                      <Link 
                        to={`/products/${item.product._id}`}
                        className="item-name"
                      >
                        {item.product.name}
                      </Link>
                      <p className="item-category">{item.product.category}</p>
                      {item.variantId && (
                        <p className="item-variant">Variante: {item.variantId}</p>
                      )}
                    </div>
                  </div>

                  <div className="item-price">
                    ${item.product.price?.toLocaleString('es-AR')}
                  </div>

                  <div className="item-quantity">
                    <div className="quantity-controls">
                      <button
                        type="button"
                        onClick={() => handleDecrementItem(item.product._id)}
                        disabled={updatingItems.has(item.product._id) || item.quantity <= 1}
                        className="quantity-btn"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={item.product.stock}
                        value={item.quantity}
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value) || 1;
                          if (newQuantity >= 1 && newQuantity <= item.product.stock) {
                            handleUpdateQuantity(item.product._id, newQuantity);
                          }
                        }}
                        disabled={updatingItems.has(item.product._id)}
                        className="quantity-input"
                      />
                      <button
                        type="button"
                        onClick={() => handleIncrementItem(item.product._id)}
                        disabled={updatingItems.has(item.product._id) || item.quantity >= item.product.stock}
                        className="quantity-btn"
                      >
                        +
                      </button>
                    </div>
                    
                    {item.product.stock < 10 && (
                      <p className="stock-warning">
                        Solo {item.product.stock} disponibles
                      </p>
                    )}
                  </div>

                  <div className="item-subtotal">
                    ${(item.product.price * item.quantity).toLocaleString('es-AR')}
                  </div>

                  <div className="item-actions">
                    <button
                      onClick={() => handleRemoveItem(item.product._id)}
                      disabled={updatingItems.has(item.product._id)}
                      className="btn btn-danger remove-btn"
                      title="Eliminar producto"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-card">
                <h3>Resumen del Pedido</h3>
                
                <div className="summary-line">
                  <span>Productos ({totalItems}):</span>
                  <span>${totalPrice.toLocaleString('es-AR')}</span>
                </div>

                <div className="summary-line">
                  <span>Envío:</span>
                  <span>
                    {totalPrice >= 10000 ? 'Gratis' : '$500'}
                  </span>
                </div>

                {totalPrice >= 10000 && (
                  <div className="free-shipping-notice">
                    🚚 ¡Envío gratis por compras superiores a $10,000!
                  </div>
                )}

                <hr />

                <div className="summary-total">
                  <span>Total:</span>
                  <span>
                    ${(totalPrice + (totalPrice >= 10000 ? 0 : 500)).toLocaleString('es-AR')}
                  </span>
                </div>

                <div className="checkout-actions">
                  <Link to="/" className="btn btn-secondary continue-shopping">
                    Continuar Comprando
                  </Link>
                  
                  <button 
                    className="btn btn-primary checkout-btn"
                    onClick={() => alert('Funcionalidad de checkout próximamente')}
                  >
                    Proceder al Pago
                  </button>
                </div>
              </div>

              <div className="cart-benefits">
                <h4>Beneficios de tu compra:</h4>
                <ul>
                  <li>✅ Garantía de 12 meses</li>
                  <li>✅ Devolución gratuita en 30 días</li>
                  <li>✅ Soporte técnico especializado</li>
                  <li>✅ Pago seguro encriptado</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;