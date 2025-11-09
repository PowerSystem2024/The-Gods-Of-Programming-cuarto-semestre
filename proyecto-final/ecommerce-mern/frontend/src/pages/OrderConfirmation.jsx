import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import '../styles/order-confirmation.css';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order, paymentInstructions } = location.state || {};

  useEffect(() => {
    // Si no hay datos de orden, redirigir al inicio
    if (!order) {
      navigate('/');
    }
  }, [order, navigate]);

  if (!order) {
    return null;
  }

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentMethodName = (method) => {
    const methods = {
      transferencia: 'Transferencia Bancaria',
      efectivo: 'Efectivo Contra Entrega',
      pago_facil: 'Pago Fácil'
    };
    return methods[method] || method;
  };

  const getStatusBadge = (status) => {
    const badges = {
      pendiente: { text: 'Pendiente', className: 'badge-warning' },
      confirmada: { text: 'Confirmada', className: 'badge-success' },
      en_preparacion: { text: 'En Preparación', className: 'badge-info' },
      enviada: { text: 'Enviada', className: 'badge-primary' },
      entregada: { text: 'Entregada', className: 'badge-success' },
      cancelada: { text: 'Cancelada', className: 'badge-danger' }
    };
    return badges[status] || badges.pendiente;
  };

  return (
    <div className="order-confirmation-container">
      <div className="confirmation-header">
        <div className="success-icon">✓</div>
        <h1>¡Pedido Realizado con Éxito!</h1>
        <p className="confirmation-message">
          Gracias por tu compra. Tu pedido ha sido registrado correctamente.
        </p>
      </div>

      <div className="order-details-card">
        <div className="card-header">
          <div>
            <h2>Número de Orden</h2>
            <p className="order-number">{order.orderNumber}</p>
          </div>
          <div className="order-status">
            <span className={`badge ${getStatusBadge(order.status).className}`}>
              {getStatusBadge(order.status).text}
            </span>
          </div>
        </div>

        <div className="order-info">
          <div className="info-row">
            <span className="label">Fecha:</span>
            <span className="value">{formatDate(order.createdAt)}</span>
          </div>
          <div className="info-row">
            <span className="label">Método de Pago:</span>
            <span className="value">{getPaymentMethodName(order.paymentMethod)}</span>
          </div>
          <div className="info-row">
            <span className="label">Total:</span>
            <span className="value total-amount">${order.total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Instrucciones de Pago */}
      {paymentInstructions && (
        <div className="payment-instructions-card">
          <h2>{paymentInstructions.title}</h2>
          <p className="instructions-description">{paymentInstructions.description}</p>

          {paymentInstructions.details && (
            <div className="payment-details">
              {paymentInstructions.details.map((detail, index) => (
                <div key={index} className="detail-row">
                  <span className="detail-label">{detail.label}:</span>
                  <span className="detail-value">{detail.value}</span>
                  {detail.copyable && (
                    <button
                      className="btn-copy"
                      onClick={() => {
                        navigator.clipboard.writeText(detail.value);
                        alert('Copiado al portapapeles');
                      }}
                    >
                      📋 Copiar
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {paymentInstructions.instructions && (
            <div className="instructions-list">
              <h3>Instrucciones:</h3>
              <ol>
                {paymentInstructions.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>
          )}

          {order.paymentMethod === 'transferencia' && (
            <div className="alert-info">
              <strong>⚠️ Importante:</strong> Una vez realizada la transferencia, 
              podrás subir el comprobante desde la sección "Mis Pedidos" para 
              acelerar la confirmación de tu orden.
            </div>
          )}

          {order.paymentMethod === 'efectivo' && (
            <div className="alert-warning">
              <strong>💵 Importante:</strong> Asegúrate de tener el monto exacto 
              preparado al momento de la entrega. Se aplicó un recargo del 5% sobre 
              el total del pedido.
            </div>
          )}

          {order.paymentMethod === 'pago_facil' && (
            <div className="alert-info">
              <strong>🏪 Importante:</strong> Lleva este código de pago a cualquier 
              sucursal de Pago Fácil. El pago puede demorar hasta 48hs en acreditarse.
            </div>
          )}
        </div>
      )}

      {/* Próximos Pasos */}
      <div className="next-steps-card">
        <h2>¿Qué Sigue?</h2>
        <div className="steps-timeline">
          <div className="timeline-step">
            <div className="step-icon">1</div>
            <div className="step-content">
              <h3>Pago</h3>
              <p>
                {order.paymentMethod === 'transferencia' && 
                  'Realiza la transferencia bancaria y sube el comprobante'}
                {order.paymentMethod === 'efectivo' && 
                  'Ten el efectivo listo para cuando recibas tu pedido'}
                {order.paymentMethod === 'pago_facil' && 
                  'Dirígete a cualquier sucursal de Pago Fácil con el código proporcionado'}
              </p>
            </div>
          </div>

          <div className="timeline-step">
            <div className="step-icon">2</div>
            <div className="step-content">
              <h3>Confirmación</h3>
              <p>Verificaremos tu pago y confirmaremos tu pedido (24-48hs)</p>
            </div>
          </div>

          <div className="timeline-step">
            <div className="step-icon">3</div>
            <div className="step-content">
              <h3>Preparación</h3>
              <p>Prepararemos cuidadosamente tu pedido para el envío</p>
            </div>
          </div>

          <div className="timeline-step">
            <div className="step-icon">4</div>
            <div className="step-content">
              <h3>Envío</h3>
              <p>Te enviaremos el número de seguimiento cuando tu pedido sea despachado</p>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="confirmation-actions">
        <button className="btn-print" onClick={handlePrint}>
          🖨️ Imprimir Comprobante
        </button>
        <Link to="/orders" className="btn-view-orders">
          📦 Ver Mis Pedidos
        </Link>
        <Link to="/products" className="btn-continue">
          🛍️ Seguir Comprando
        </Link>
      </div>

      {/* Información de Contacto */}
      <div className="contact-info">
        <p>¿Tienes alguna pregunta sobre tu pedido?</p>
        <p>
          Contáctanos: <a href="mailto:soporte@ecommerce.com">soporte@ecommerce.com</a> | 
          WhatsApp: <a href="tel:+5491112345678">+54 9 11 1234-5678</a>
        </p>
      </div>
    </div>
  );
};

export default OrderConfirmation;
