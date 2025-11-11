# 🧩 UI COMPONENTS - Biblioteca de Componentes

> **Catálogo completo de componentes de interfaz**  
> E-Commerce de Postres Artesanales

---

## 📋 Contenido

1. [Introducción](#-introducción)
2. [Componentes de Navegación](#-componentes-de-navegación)
3. [Componentes de Formulario](#-componentes-de-formulario)
4. [Componentes de Contenido](#-componentes-de-contenido)
5. [Componentes de Feedback](#-componentes-de-feedback)
6. [Componentes de Overlay](#-componentes-de-overlay)
7. [Componentes de Datos](#-componentes-de-datos)
8. [Componentes Específicos](#-componentes-específicos)

---

## 🎯 Introducción

### Propósito

Este documento cataloga todos los componentes UI reutilizables del sistema, con:
- Código HTML/CSS/React
- Estados y variantes
- Ejemplos de uso
- Casos de uso recomendados
- Mejores prácticas

### Nomenclatura

```
Componente Base > Variante > Modificador > Estado

Ejemplo:
Button > Primary > Large > Disabled
```

---

## 🧭 Componentes de Navegación

### 1. Navbar

#### Navbar Principal

**Código React:**
```jsx
const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🍰 Postres Artesanales
        </Link>
        
        <div className="navbar-menu">
          <NavLink to="/productos" className="navbar-link">
            Productos
          </NavLink>
          <NavLink to="/carrito" className="navbar-link">
            🛒 Carrito (3)
          </NavLink>
          <NavLink to="/perfil" className="navbar-link">
            👤 Perfil
          </NavLink>
        </div>
      </div>
    </nav>
  );
};
```

**Estados:**
- Default: Normal
- Scrolled: Con sombra cuando se hace scroll
- Mobile: Menú hamburguesa

**Variantes:**
- Transparent: Para hero sections
- Fixed: Siempre visible
- Sticky: Se oculta al hacer scroll down

### 2. Breadcrumbs

```jsx
const Breadcrumbs = ({ items }) => {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="breadcrumb-separator">/</span>}
          {item.href ? (
            <Link to={item.href} className="breadcrumb-link">
              {item.label}
            </Link>
          ) : (
            <span className="breadcrumb-current">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
```

**Ejemplo de uso:**
```jsx
<Breadcrumbs items={[
  { label: 'Inicio', href: '/' },
  { label: 'Productos', href: '/productos' },
  { label: 'Tortas', href: '/productos/tortas' },
  { label: 'Torta de Chocolate' }
]} />
```

### 3. Tabs

```jsx
const Tabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="tabs">
      <div className="tab-list" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="tab-content">
        {tabs.find(t => t.id === activeTab)?.content}
      </div>
    </div>
  );
};
```

### 4. Pagination

```jsx
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="pagination">
      <button
        className="pagination-button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Página anterior"
      >
        ←
      </button>
      
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          className={`pagination-button ${currentPage === page ? 'active' : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      
      <button
        className="pagination-button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Página siguiente"
      >
        →
      </button>
    </div>
  );
};
```

---

## 📝 Componentes de Formulario

### 1. Input

#### Text Input

```jsx
const Input = ({ 
  label, 
  error, 
  icon, 
  ...props 
}) => {
  return (
    <div className="input-wrapper">
      {label && <label className="input-label">{label}</label>}
      
      <div className="input-group">
        {icon && <span className="input-icon">{icon}</span>}
        <input 
          className={`input ${icon ? 'input-with-icon' : ''} ${error ? 'input-error' : ''}`}
          {...props}
        />
      </div>
      
      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
};
```

**Variantes:**
- Text
- Email
- Password (con toggle show/hide)
- Number
- Tel
- URL

**Estados:**
- Default
- Focus
- Filled
- Error
- Disabled
- Loading

#### Search Input

```jsx
const SearchInput = ({ value, onChange, onSearch, placeholder }) => {
  return (
    <div className="search-input">
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="search-input-field"
      />
      <button 
        onClick={onSearch}
        className="search-input-button"
        aria-label="Buscar"
      >
        🔍
      </button>
    </div>
  );
};
```

### 2. Textarea

```jsx
const Textarea = ({ label, error, rows = 4, ...props }) => {
  return (
    <div className="textarea-wrapper">
      {label && <label className="textarea-label">{label}</label>}
      <textarea 
        className={`textarea ${error ? 'textarea-error' : ''}`}
        rows={rows}
        {...props}
      />
      {error && <span className="textarea-error-message">{error}</span>}
    </div>
  );
};
```

### 3. Select

```jsx
const Select = ({ label, options, error, ...props }) => {
  return (
    <div className="select-wrapper">
      {label && <label className="select-label">{label}</label>}
      <select 
        className={`select ${error ? 'select-error' : ''}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="select-error-message">{error}</span>}
    </div>
  );
};
```

### 4. Checkbox

```jsx
const Checkbox = ({ label, checked, onChange, ...props }) => {
  return (
    <label className="checkbox-wrapper">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="checkbox"
        {...props}
      />
      <span className="checkbox-label">{label}</span>
    </label>
  );
};
```

### 5. Radio Group

```jsx
const RadioGroup = ({ label, options, value, onChange, name }) => {
  return (
    <fieldset className="radio-group">
      {label && <legend className="radio-group-label">{label}</legend>}
      {options.map((option) => (
        <label key={option.value} className="radio-wrapper">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="radio"
          />
          <span className="radio-label">{option.label}</span>
        </label>
      ))}
    </fieldset>
  );
};
```

### 6. File Upload

```jsx
const FileUpload = ({ label, accept, onChange, multiple }) => {
  const [fileName, setFileName] = useState('');
  
  const handleChange = (e) => {
    const files = e.target.files;
    setFileName(files.length > 1 
      ? `${files.length} archivos seleccionados`
      : files[0]?.name || ''
    );
    onChange(e);
  };
  
  return (
    <div className="file-upload">
      {label && <label className="file-upload-label">{label}</label>}
      <label className="file-upload-button">
        📁 Seleccionar archivo{multiple ? 's' : ''}
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          multiple={multiple}
          className="file-upload-input"
        />
      </label>
      {fileName && <span className="file-upload-name">{fileName}</span>}
    </div>
  );
};
```

---

## 📦 Componentes de Contenido

### 1. Card

#### Basic Card

```jsx
const Card = ({ children, className, ...props }) => {
  return (
    <div className={`card ${className || ''}`} {...props}>
      {children}
    </div>
  );
};
```

#### Product Card

```jsx
const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="product-card">
      <div className="product-card-image-wrapper">
        <img 
          src={product.image} 
          alt={product.name}
          className="product-card-image"
          loading="lazy"
        />
        {product.stock === 0 && (
          <span className="product-card-badge">Agotado</span>
        )}
      </div>
      
      <div className="product-card-content">
        <h3 className="product-card-title">{product.name}</h3>
        <p className="product-card-description">{product.description}</p>
        
        <div className="product-card-footer">
          <span className="product-card-price">${product.price}</span>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
};
```

#### Info Card

```jsx
const InfoCard = ({ title, description, icon, variant = 'default' }) => {
  return (
    <div className={`info-card info-card-${variant}`}>
      {icon && <span className="info-card-icon">{icon}</span>}
      <div className="info-card-content">
        <h4 className="info-card-title">{title}</h4>
        <p className="info-card-description">{description}</p>
      </div>
    </div>
  );
};
```

### 2. Avatar

```jsx
const Avatar = ({ src, alt, size = 'md', fallback }) => {
  return (
    <div className={`avatar avatar-${size}`}>
      {src ? (
        <img src={src} alt={alt} className="avatar-image" />
      ) : (
        <span className="avatar-fallback">{fallback}</span>
      )}
    </div>
  );
};
```

**Tamaños:**
- xs: 24px
- sm: 32px
- md: 40px
- lg: 56px
- xl: 80px

### 3. Badge

```jsx
const Badge = ({ children, variant = 'default', size = 'md' }) => {
  return (
    <span className={`badge badge-${variant} badge-${size}`}>
      {children}
    </span>
  );
};
```

**Variantes:**
- default
- success
- warning
- error
- info

### 4. Divider

```jsx
const Divider = ({ label, orientation = 'horizontal' }) => {
  return (
    <div className={`divider divider-${orientation}`}>
      {label && <span className="divider-label">{label}</span>}
    </div>
  );
};
```

---

## 💬 Componentes de Feedback

### 1. Alert

```jsx
const Alert = ({ 
  type = 'info', 
  title, 
  message, 
  onClose, 
  closable = true 
}) => {
  return (
    <div className={`alert alert-${type}`} role="alert">
      <div className="alert-icon">
        {type === 'success' && '✅'}
        {type === 'warning' && '⚠️'}
        {type === 'error' && '❌'}
        {type === 'info' && 'ℹ️'}
      </div>
      
      <div className="alert-content">
        {title && <h4 className="alert-title">{title}</h4>}
        <p className="alert-message">{message}</p>
      </div>
      
      {closable && (
        <button 
          className="alert-close"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ✕
        </button>
      )}
    </div>
  );
};
```

### 2. Toast Notification

```jsx
const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  
  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-icon">
        {type === 'success' && '✅'}
        {type === 'error' && '❌'}
        {type === 'info' && 'ℹ️'}
      </span>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose}>✕</button>
    </div>
  );
};
```

### 3. Progress Bar

```jsx
const ProgressBar = ({ value, max = 100, label, showPercentage = true }) => {
  const percentage = (value / max) * 100;
  
  return (
    <div className="progress-bar-wrapper">
      {label && <label className="progress-bar-label">{label}</label>}
      <div className="progress-bar">
        <div 
          className="progress-bar-fill"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin="0"
          aria-valuemax={max}
        />
      </div>
      {showPercentage && (
        <span className="progress-bar-percentage">{Math.round(percentage)}%</span>
      )}
    </div>
  );
};
```

### 4. Spinner / Loader

```jsx
const Spinner = ({ size = 'md', color = 'primary' }) => {
  return (
    <div 
      className={`spinner spinner-${size} spinner-${color}`}
      role="status"
      aria-label="Cargando"
    >
      <span className="sr-only">Cargando...</span>
    </div>
  );
};
```

### 5. Skeleton

```jsx
const Skeleton = ({ variant = 'text', width, height, count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`skeleton skeleton-${variant}`}
          style={{ width, height }}
        />
      ))}
    </>
  );
};
```

**Variantes:**
- text
- title
- image
- card
- circle

---

## 🔝 Componentes de Overlay

### 1. Modal

```jsx
const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  size = 'md' 
}) => {
  if (!isOpen) return null;
  
  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className={`modal modal-${size}`} role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button 
            className="modal-close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
        
        <div className="modal-body">
          {children}
        </div>
        
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </>
  );
};
```

### 2. Drawer

```jsx
const Drawer = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  position = 'right' 
}) => {
  return (
    <>
      {isOpen && <div className="drawer-backdrop" onClick={onClose} />}
      <div className={`drawer drawer-${position} ${isOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h2 className="drawer-title">{title}</h2>
          <button className="drawer-close" onClick={onClose}>✕</button>
        </div>
        <div className="drawer-body">
          {children}
        </div>
      </div>
    </>
  );
};
```

### 3. Tooltip

```jsx
const Tooltip = ({ content, children, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <div 
      className="tooltip-wrapper"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`tooltip tooltip-${position}`}>
          {content}
        </div>
      )}
    </div>
  );
};
```

### 4. Popover

```jsx
const Popover = ({ trigger, content, position = 'bottom' }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="popover-wrapper">
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      {isOpen && (
        <>
          <div className="popover-backdrop" onClick={() => setIsOpen(false)} />
          <div className={`popover popover-${position}`}>
            {content}
          </div>
        </>
      )}
    </div>
  );
};
```

### 5. Dropdown Menu

```jsx
const Dropdown = ({ trigger, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="dropdown">
      <button 
        className="dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        {trigger}
      </button>
      
      {isOpen && (
        <>
          <div 
            className="dropdown-backdrop" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="dropdown-menu">
            {items.map((item, index) => (
              <button
                key={index}
                className="dropdown-item"
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
              >
                {item.icon && <span className="dropdown-item-icon">{item.icon}</span>}
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
```

---

## 📊 Componentes de Datos

### 1. Table

```jsx
const Table = ({ columns, data, onRowClick }) => {
  return (
    <div className="table-wrapper">
      <table className="table">
        <thead className="table-header">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="table-header-cell">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="table-body">
          {data.map((row, rowIndex) => (
            <tr 
              key={rowIndex}
              className="table-row"
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col) => (
                <td key={col.key} className="table-cell">
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

### 2. Empty State

```jsx
const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action 
}) => {
  return (
    <div className="empty-state">
      {icon && <div className="empty-state-icon">{icon}</div>}
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-description">{description}</p>}
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
};
```

### 3. Stat Card

```jsx
const StatCard = ({ label, value, trend, icon }) => {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-card-label">{label}</span>
        {icon && <span className="stat-card-icon">{icon}</span>}
      </div>
      <div className="stat-card-value">{value}</div>
      {trend && (
        <div className={`stat-card-trend ${trend > 0 ? 'positive' : 'negative'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </div>
      )}
    </div>
  );
};
```

---

## 🛍️ Componentes Específicos

### 1. Cart Item

```jsx
const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="cart-item">
      <img 
        src={item.image} 
        alt={item.name}
        className="cart-item-image"
      />
      
      <div className="cart-item-details">
        <h4 className="cart-item-name">{item.name}</h4>
        <p className="cart-item-price">${item.price}</p>
      </div>
      
      <div className="cart-item-quantity">
        <button 
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          disabled={item.quantity === 1}
        >
          −
        </button>
        <span>{item.quantity}</span>
        <button 
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          disabled={item.quantity >= item.stock}
        >
          +
        </button>
      </div>
      
      <div className="cart-item-subtotal">
        ${item.price * item.quantity}
      </div>
      
      <button 
        className="cart-item-remove"
        onClick={() => onRemove(item.id)}
        aria-label="Eliminar"
      >
        🗑️
      </button>
    </div>
  );
};
```

### 2. Product Filter

```jsx
const ProductFilter = ({ filters, onFilterChange }) => {
  return (
    <div className="product-filter">
      <h3 className="product-filter-title">Filtros</h3>
      
      <div className="product-filter-section">
        <h4>Categoría</h4>
        <RadioGroup
          options={[
            { value: 'all', label: 'Todos' },
            { value: 'tortas', label: 'Tortas' },
            { value: 'pastelitos', label: 'Pastelitos' },
            { value: 'galletas', label: 'Galletas' }
          ]}
          value={filters.category}
          onChange={(val) => onFilterChange('category', val)}
        />
      </div>
      
      <div className="product-filter-section">
        <h4>Rango de Precio</h4>
        <div className="price-range">
          <input 
            type="number"
            placeholder="Mínimo"
            value={filters.minPrice}
            onChange={(e) => onFilterChange('minPrice', e.target.value)}
          />
          <span>-</span>
          <input 
            type="number"
            placeholder="Máximo"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange('maxPrice', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
```

### 3. Order Summary

```jsx
const OrderSummary = ({ items, shipping, total }) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  return (
    <div className="order-summary">
      <h3 className="order-summary-title">Resumen de Compra</h3>
      
      <div className="order-summary-items">
        {items.map((item) => (
          <div key={item.id} className="order-summary-item">
            <span>{item.name} (x{item.quantity})</span>
            <span>${item.price * item.quantity}</span>
          </div>
        ))}
      </div>
      
      <div className="order-summary-totals">
        <div className="order-summary-row">
          <span>Subtotal</span>
          <span>${subtotal}</span>
        </div>
        <div className="order-summary-row">
          <span>Envío</span>
          <span>${shipping}</span>
        </div>
        <div className="order-summary-row order-summary-total">
          <span>Total</span>
          <span>${total}</span>
        </div>
      </div>
    </div>
  );
};
```

---

## ✅ Checklist de Componentes

Antes de crear un nuevo componente, verifica:

- [ ] ¿Es realmente reutilizable?
- [ ] ¿Sigue el sistema de diseño?
- [ ] ¿Tiene estados definidos?
- [ ] ¿Es accesible (ARIA, keyboard)?
- [ ] ¿Está documentado?
- [ ] ¿Tiene ejemplos de uso?
- [ ] ¿Es responsive?
- [ ] ¿Tiene variantes necesarias?

---

## 📚 Mejores Prácticas

### Composición

```jsx
// ✅ Bueno: Componentes componibles
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
  </CardHeader>
  <CardBody>
    Contenido
  </CardBody>
</Card>

// ❌ Malo: Un componente gigante
<Card 
  title="Título" 
  body="Contenido" 
  hasHeader 
  hasFooter 
/>
```

### Props Naming

```jsx
// ✅ Bueno: Props descriptivos
<Button onClick={handleClick} disabled={isLoading}>
  Guardar
</Button>

// ❌ Malo: Props ambiguos
<Button click={handleClick} dis={isLoading}>
  Guardar
</Button>
```

### Accesibilidad

```jsx
// ✅ Bueno: ARIA labels
<button aria-label="Cerrar modal" onClick={onClose}>
  ✕
</button>

// ❌ Malo: Sin contexto
<button onClick={onClose}>
  ✕
</button>
```

---

<p align="center">
  <strong>UI Components Library v1.0</strong><br>
  The Gods of Programming © 2024<br>
  <br>
  <em>67 componentes y contando... 🎨</em>
</p>
