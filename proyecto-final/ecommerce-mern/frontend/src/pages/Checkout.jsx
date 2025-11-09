import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';
import '../styles/checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { items: cart, total, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    // Información de contacto
    contactInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dni: ''
    },
    // Dirección de envío
    shippingAddress: {
      street: '',
      number: '',
      floor: '',
      apartment: '',
      city: '',
      province: '',
      postalCode: '',
      additionalInfo: ''
    },
    // Método de pago
    paymentMethod: 'transferencia',
    // Notas adicionales
    notes: ''
  });

  // Verificar que el carrito no esté vacío
  useEffect(() => {
    if (!cart || cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  // Manejar cambios en los inputs
  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    // Limpiar error del campo
    if (errors[`${section}.${field}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${section}.${field}`];
        return newErrors;
      });
    }
  };

  const handlePaymentMethodChange = (method) => {
    setFormData(prev => ({
      ...prev,
      paymentMethod: method
    }));
  };

  // Validar paso actual
  const validateStep = (stepNumber) => {
    const newErrors = {};

    if (stepNumber === 1) {
      // Validar información de contacto
      const { firstName, lastName, email, phone, dni } = formData.contactInfo;
      
      if (!firstName.trim()) newErrors['contactInfo.firstName'] = 'El nombre es requerido';
      if (!lastName.trim()) newErrors['contactInfo.lastName'] = 'El apellido es requerido';
      if (!email.trim()) {
        newErrors['contactInfo.email'] = 'El email es requerido';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors['contactInfo.email'] = 'Email inválido';
      }
      if (!phone.trim()) {
        newErrors['contactInfo.phone'] = 'El teléfono es requerido';
      } else if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
        newErrors['contactInfo.phone'] = 'Teléfono inválido (10 dígitos)';
      }
      if (!dni.trim()) {
        newErrors['contactInfo.dni'] = 'El DNI es requerido';
      } else if (!/^\d{7,8}$/.test(dni)) {
        newErrors['contactInfo.dni'] = 'DNI inválido (7-8 dígitos)';
      }
    }

    if (stepNumber === 2) {
      // Validar dirección de envío
      const { street, number, city, province, postalCode } = formData.shippingAddress;
      
      if (!street.trim()) newErrors['shippingAddress.street'] = 'La calle es requerida';
      if (!number.trim()) newErrors['shippingAddress.number'] = 'El número es requerido';
      if (!city.trim()) newErrors['shippingAddress.city'] = 'La ciudad es requerida';
      if (!province.trim()) newErrors['shippingAddress.province'] = 'La provincia es requerida';
      if (!postalCode.trim()) {
        newErrors['shippingAddress.postalCode'] = 'El código postal es requerido';
      } else if (!/^\d{4}$/.test(postalCode)) {
        newErrors['shippingAddress.postalCode'] = 'Código postal inválido (4 dígitos)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Avanzar al siguiente paso
  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 4));
    }
  };

  // Retroceder al paso anterior
  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  // Calcular costo de envío
  const shippingCost = total >= 50000 ? 0 : 5000;
  const finalTotal = total + shippingCost;

  // Enviar orden
  const handleSubmit = async () => {
    if (!validateStep(2)) return;

    setLoading(true);
    try {
      // Preparar datos de la orden
      const orderData = {
        items: cart.map(item => ({
          product: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.images?.[0]
        })),
        contactInfo: formData.contactInfo,
        shippingAddress: formData.shippingAddress,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes
      };

      // Crear la orden
      const response = await orderAPI.create(orderData);

      if (response.success) {
        // Limpiar el carrito
        clearCart();
        
        // Redirigir a la página de confirmación con los datos de la orden
        navigate('/order-confirmation', {
          state: {
            order: response.data.order,
            paymentInstructions: response.data.paymentInstructions
          }
        });
      }
    } catch (error) {
      console.error('Error al crear la orden:', error);
      setErrors({ submit: error.message || 'Error al procesar la orden' });
    } finally {
      setLoading(false);
    }
  };

  // Renderizar formulario de información de contacto
  const renderContactForm = () => (
    <div className="checkout-section">
      <h2>Información de Contacto</h2>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="firstName">Nombre *</label>
          <input
            type="text"
            id="firstName"
            value={formData.contactInfo.firstName}
            onChange={(e) => handleInputChange('contactInfo', 'firstName', e.target.value)}
            className={errors['contactInfo.firstName'] ? 'error' : ''}
          />
          {errors['contactInfo.firstName'] && (
            <span className="error-message">{errors['contactInfo.firstName']}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Apellido *</label>
          <input
            type="text"
            id="lastName"
            value={formData.contactInfo.lastName}
            onChange={(e) => handleInputChange('contactInfo', 'lastName', e.target.value)}
            className={errors['contactInfo.lastName'] ? 'error' : ''}
          />
          {errors['contactInfo.lastName'] && (
            <span className="error-message">{errors['contactInfo.lastName']}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            value={formData.contactInfo.email}
            onChange={(e) => handleInputChange('contactInfo', 'email', e.target.value)}
            className={errors['contactInfo.email'] ? 'error' : ''}
          />
          {errors['contactInfo.email'] && (
            <span className="error-message">{errors['contactInfo.email']}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Teléfono *</label>
          <input
            type="tel"
            id="phone"
            placeholder="11 1234 5678"
            value={formData.contactInfo.phone}
            onChange={(e) => handleInputChange('contactInfo', 'phone', e.target.value)}
            className={errors['contactInfo.phone'] ? 'error' : ''}
          />
          {errors['contactInfo.phone'] && (
            <span className="error-message">{errors['contactInfo.phone']}</span>
          )}
        </div>

        <div className="form-group full-width">
          <label htmlFor="dni">DNI *</label>
          <input
            type="text"
            id="dni"
            placeholder="12345678"
            value={formData.contactInfo.dni}
            onChange={(e) => handleInputChange('contactInfo', 'dni', e.target.value)}
            className={errors['contactInfo.dni'] ? 'error' : ''}
          />
          {errors['contactInfo.dni'] && (
            <span className="error-message">{errors['contactInfo.dni']}</span>
          )}
        </div>
      </div>
    </div>
  );

  // Renderizar formulario de dirección de envío
  const renderShippingForm = () => (
    <div className="checkout-section">
      <h2>Dirección de Envío</h2>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="street">Calle *</label>
          <input
            type="text"
            id="street"
            value={formData.shippingAddress.street}
            onChange={(e) => handleInputChange('shippingAddress', 'street', e.target.value)}
            className={errors['shippingAddress.street'] ? 'error' : ''}
          />
          {errors['shippingAddress.street'] && (
            <span className="error-message">{errors['shippingAddress.street']}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="number">Número *</label>
          <input
            type="text"
            id="number"
            value={formData.shippingAddress.number}
            onChange={(e) => handleInputChange('shippingAddress', 'number', e.target.value)}
            className={errors['shippingAddress.number'] ? 'error' : ''}
          />
          {errors['shippingAddress.number'] && (
            <span className="error-message">{errors['shippingAddress.number']}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="floor">Piso</label>
          <input
            type="text"
            id="floor"
            value={formData.shippingAddress.floor}
            onChange={(e) => handleInputChange('shippingAddress', 'floor', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="apartment">Departamento</label>
          <input
            type="text"
            id="apartment"
            value={formData.shippingAddress.apartment}
            onChange={(e) => handleInputChange('shippingAddress', 'apartment', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="city">Ciudad *</label>
          <input
            type="text"
            id="city"
            value={formData.shippingAddress.city}
            onChange={(e) => handleInputChange('shippingAddress', 'city', e.target.value)}
            className={errors['shippingAddress.city'] ? 'error' : ''}
          />
          {errors['shippingAddress.city'] && (
            <span className="error-message">{errors['shippingAddress.city']}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="province">Provincia *</label>
          <select
            id="province"
            value={formData.shippingAddress.province}
            onChange={(e) => handleInputChange('shippingAddress', 'province', e.target.value)}
            className={errors['shippingAddress.province'] ? 'error' : ''}
          >
            <option value="">Seleccionar provincia</option>
            <option value="Buenos Aires">Buenos Aires</option>
            <option value="CABA">CABA</option>
            <option value="Catamarca">Catamarca</option>
            <option value="Chaco">Chaco</option>
            <option value="Chubut">Chubut</option>
            <option value="Córdoba">Córdoba</option>
            <option value="Corrientes">Corrientes</option>
            <option value="Entre Ríos">Entre Ríos</option>
            <option value="Formosa">Formosa</option>
            <option value="Jujuy">Jujuy</option>
            <option value="La Pampa">La Pampa</option>
            <option value="La Rioja">La Rioja</option>
            <option value="Mendoza">Mendoza</option>
            <option value="Misiones">Misiones</option>
            <option value="Neuquén">Neuquén</option>
            <option value="Río Negro">Río Negro</option>
            <option value="Salta">Salta</option>
            <option value="San Juan">San Juan</option>
            <option value="San Luis">San Luis</option>
            <option value="Santa Cruz">Santa Cruz</option>
            <option value="Santa Fe">Santa Fe</option>
            <option value="Santiago del Estero">Santiago del Estero</option>
            <option value="Tierra del Fuego">Tierra del Fuego</option>
            <option value="Tucumán">Tucumán</option>
          </select>
          {errors['shippingAddress.province'] && (
            <span className="error-message">{errors['shippingAddress.province']}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="postalCode">Código Postal *</label>
          <input
            type="text"
            id="postalCode"
            placeholder="1234"
            value={formData.shippingAddress.postalCode}
            onChange={(e) => handleInputChange('shippingAddress', 'postalCode', e.target.value)}
            className={errors['shippingAddress.postalCode'] ? 'error' : ''}
          />
          {errors['shippingAddress.postalCode'] && (
            <span className="error-message">{errors['shippingAddress.postalCode']}</span>
          )}
        </div>

        <div className="form-group full-width">
          <label htmlFor="additionalInfo">Información Adicional</label>
          <textarea
            id="additionalInfo"
            rows="3"
            placeholder="Referencias adicionales para la entrega..."
            value={formData.shippingAddress.additionalInfo}
            onChange={(e) => handleInputChange('shippingAddress', 'additionalInfo', e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  // Renderizar selección de método de pago
  const renderPaymentMethod = () => (
    <div className="checkout-section">
      <h2>Método de Pago</h2>
      <div className="payment-methods">
        <div
          className={`payment-card ${formData.paymentMethod === 'transferencia' ? 'selected' : ''}`}
          onClick={() => handlePaymentMethodChange('transferencia')}
        >
          <div className="payment-icon">💳</div>
          <h3>Transferencia Bancaria</h3>
          <p>Realiza una transferencia a nuestra cuenta bancaria</p>
          <ul>
            <li>Sin comisiones adicionales</li>
            <li>Confirmación en 24-48hs</li>
            <li>Envío de comprobante requerido</li>
          </ul>
        </div>

        <div
          className={`payment-card ${formData.paymentMethod === 'efectivo' ? 'selected' : ''}`}
          onClick={() => handlePaymentMethodChange('efectivo')}
        >
          <div className="payment-icon">💵</div>
          <h3>Efectivo Contra Entrega</h3>
          <p>Paga en efectivo al recibir tu pedido</p>
          <ul>
            <li>Pago en el momento de la entrega</li>
            <li>Recargo del 5% sobre el total</li>
            <li>Solo disponible en CABA y GBA</li>
          </ul>
        </div>

        <div
          className={`payment-card ${formData.paymentMethod === 'pago_facil' ? 'selected' : ''}`}
          onClick={() => handlePaymentMethodChange('pago_facil')}
        >
          <div className="payment-icon">🏪</div>
          <h3>Pago Fácil</h3>
          <p>Paga en cualquier sucursal de Pago Fácil</p>
          <ul>
            <li>Paga en efectivo o débito</li>
            <li>Más de 5000 sucursales</li>
            <li>Confirmación en 24-48hs</li>
          </ul>
        </div>
      </div>

      <div className="form-group full-width">
        <label htmlFor="notes">Notas Adicionales</label>
        <textarea
          id="notes"
          rows="3"
          placeholder="¿Alguna instrucción especial para tu pedido?"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
        />
      </div>
    </div>
  );

  // Renderizar resumen de la orden
  const renderOrderSummary = () => (
    <div className="checkout-section">
      <h2>Resumen de la Orden</h2>
      
      {/* Información de contacto */}
      <div className="summary-section">
        <h3>Información de Contacto</h3>
        <p><strong>Nombre:</strong> {formData.contactInfo.firstName} {formData.contactInfo.lastName}</p>
        <p><strong>Email:</strong> {formData.contactInfo.email}</p>
        <p><strong>Teléfono:</strong> {formData.contactInfo.phone}</p>
        <p><strong>DNI:</strong> {formData.contactInfo.dni}</p>
        <button className="btn-edit" onClick={() => setStep(1)}>Editar</button>
      </div>

      {/* Dirección de envío */}
      <div className="summary-section">
        <h3>Dirección de Envío</h3>
        <p>
          {formData.shippingAddress.street} {formData.shippingAddress.number}
          {formData.shippingAddress.floor && `, Piso ${formData.shippingAddress.floor}`}
          {formData.shippingAddress.apartment && ` Dto. ${formData.shippingAddress.apartment}`}
        </p>
        <p>{formData.shippingAddress.city}, {formData.shippingAddress.province}</p>
        <p>CP: {formData.shippingAddress.postalCode}</p>
        <button className="btn-edit" onClick={() => setStep(2)}>Editar</button>
      </div>

      {/* Método de pago */}
      <div className="summary-section">
        <h3>Método de Pago</h3>
        <p className="payment-selected">
          {formData.paymentMethod === 'transferencia' && '💳 Transferencia Bancaria'}
          {formData.paymentMethod === 'efectivo' && '💵 Efectivo Contra Entrega'}
          {formData.paymentMethod === 'pago_facil' && '🏪 Pago Fácil'}
        </p>
        <button className="btn-edit" onClick={() => setStep(3)}>Editar</button>
      </div>

      {/* Productos */}
      <div className="summary-section">
        <h3>Productos ({cart.length})</h3>
        <div className="order-items">
          {cart.map((item, index) => (
            <div key={index} className="order-item">
              <img src={item.product.images?.[0] || '/placeholder.jpg'} alt={item.product.name} />
              <div className="item-info">
                <p className="item-name">{item.product.name}</p>
                <p className="item-quantity">Cantidad: {item.quantity}</p>
              </div>
              <p className="item-price">${(item.product.price * item.quantity).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      {errors.submit && (
        <div className="error-banner">{errors.submit}</div>
      )}
    </div>
  );

  // Renderizar sidebar con totales
  const renderSidebar = () => (
    <div className="checkout-sidebar">
      <div className="sidebar-card">
        <h3>Resumen del Pedido</h3>
        
        <div className="summary-row">
          <span>Subtotal ({cart.length} {cart.length === 1 ? 'producto' : 'productos'})</span>
          <span>${total.toLocaleString()}</span>
        </div>

        <div className="summary-row">
          <span>Envío</span>
          <span>{shippingCost === 0 ? 'GRATIS' : `$${shippingCost.toLocaleString()}`}</span>
        </div>

        {shippingCost === 0 && (
          <div className="free-shipping-notice">
            ¡Envío gratis en compras mayores a $50.000!
          </div>
        )}

        {formData.paymentMethod === 'efectivo' && (
          <div className="summary-row">
            <span>Recargo efectivo (5%)</span>
            <span>${(finalTotal * 0.05).toLocaleString()}</span>
          </div>
        )}

        <div className="summary-divider"></div>

        <div className="summary-row total">
          <span>Total</span>
          <span>${(formData.paymentMethod === 'efectivo' ? finalTotal * 1.05 : finalTotal).toLocaleString()}</span>
        </div>

        <div className="sidebar-actions">
          {step < 4 ? (
            <button className="btn-next" onClick={nextStep} disabled={loading}>
              {step === 3 ? 'Revisar Pedido' : 'Continuar'}
            </button>
          ) : (
            <button className="btn-submit" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Procesando...' : 'Confirmar Pedido'}
            </button>
          )}

          {step > 1 && (
            <button className="btn-back" onClick={prevStep} disabled={loading}>
              Volver
            </button>
          )}
        </div>

        <div className="security-badges">
          <div className="badge">🔒 Pago Seguro</div>
          <div className="badge">📦 Envíos a Todo el País</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>Finalizar Compra</h1>
        <div className="checkout-steps">
          <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <span>Contacto</span>
          </div>
          <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <span>Envío</span>
          </div>
          <div className={`step ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
            <div className="step-number">3</div>
            <span>Pago</span>
          </div>
          <div className={`step ${step >= 4 ? 'active' : ''}`}>
            <div className="step-number">4</div>
            <span>Confirmar</span>
          </div>
        </div>
      </div>

      <div className="checkout-content">
        <div className="checkout-main">
          {step === 1 && renderContactForm()}
          {step === 2 && renderShippingForm()}
          {step === 3 && renderPaymentMethod()}
          {step === 4 && renderOrderSummary()}
        </div>

        {renderSidebar()}
      </div>
    </div>
  );
};

export default Checkout;
