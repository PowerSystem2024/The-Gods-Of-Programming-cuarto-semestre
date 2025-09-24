import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cartAPI } from '../services/api';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  const loadCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await cartAPI.get();
      setCart(response.data.cart || []);
    } catch (err) {
      console.error('Error loading cart:', err);
      if (err.status === 401) {
        navigate('/login', { state: { from: '/cart' } });
      } else {
        setError('Error cargando el carrito');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    loadCart();
  }, [navigate, loadCart]);

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      setUpdating(true);
      await cartAPI.update(productId, newQuantity);
      
      // Actualizar estado local
      setCart(prevCart => 
        prevCart.map(item => 
          item.product._id === productId 
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (err) {
      console.error('Error updating quantity:', err);
      alert('Error actualizando la cantidad: ' + (err.message || 'Error desconocido'));
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (productId) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto del carrito?')) {
      return;
    }

    try {
      setUpdating(true);
      await cartAPI.remove(productId);
      
      // Actualizar estado local
      setCart(prevCart => prevCart.filter(item => item.product._id !== productId));
    } catch (err) {
      console.error('Error removing item:', err);
      alert('Error eliminando el producto: ' + (err.message || 'Error desconocido'));
    } finally {
      setUpdating(false);
    }
  };

  const clearCart = async () => {
    if (!window.confirm('¿Estás seguro de vaciar todo el carrito?')) {
      return;
    }

    try {
      setUpdating(true);
      await cartAPI.clear();
      setCart([]);
    } catch (err) {
      console.error('Error clearing cart:', err);
      alert('Error vaciando el carrito: ' + (err.message || 'Error desconocido'));
    } finally {
      setUpdating(false);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const calculateItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

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
            <button onClick={loadCart} className="btn btn-primary">
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
          {cart.length > 0 && (
            <button 
              onClick={clearCart}
              disabled={updating}
              className="btn btn-secondary clear-cart-btn"
            >
              Vaciar Carrito
            </button>
          )}
        </div>

        {cart.length === 0 ? (
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

              {cart.map((item) => (
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
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        disabled={updating || item.quantity <= 1}
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
                            updateQuantity(item.product._id, newQuantity);
                          }
                        }}
                        disabled={updating}
                        className="quantity-input"
                      />
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        disabled={updating || item.quantity >= item.product.stock}
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
                      onClick={() => removeItem(item.product._id)}
                      disabled={updating}
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
                  <span>Productos ({calculateItemsCount()}):</span>
                  <span>${calculateTotal().toLocaleString('es-AR')}</span>
                </div>

                <div className="summary-line">
                  <span>Envío:</span>
                  <span>
                    {calculateTotal() >= 10000 ? 'Gratis' : '$500'}
                  </span>
                </div>

                {calculateTotal() >= 10000 && (
                  <div className="free-shipping-notice">
                    🚚 ¡Envío gratis por compras superiores a $10,000!
                  </div>
                )}

                <hr />

                <div className="summary-total">
                  <span>Total:</span>
                  <span>
                    ${(calculateTotal() + (calculateTotal() >= 10000 ? 0 : 500)).toLocaleString('es-AR')}
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