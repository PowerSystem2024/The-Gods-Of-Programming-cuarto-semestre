# 🎨 DESIGN SYSTEM - Sistema de Diseño

> **Biblioteca completa de componentes, estilos y patrones**  
> E-Commerce de Postres Artesanales

---

## 📋 Contenido

1. [Fundamentos](#-fundamentos)
2. [Tokens de Diseño](#-tokens-de-diseño)
3. [Componentes Base](#-componentes-base)
4. [Componentes Compuestos](#-componentes-compuestos)
5. [Patrones de Diseño](#-patrones-de-diseño)
6. [Responsive Design](#-responsive-design)
7. [Accesibilidad](#-accesibilidad)
8. [Performance](#-performance)

---

## 🎯 Fundamentos

### Filosofía de Diseño

```
┌────────────────────────────────────────┐
│                                        │
│  Simple     •  Accesible  •  Hermoso  │
│                                        │
│  "Cada elemento tiene un propósito"   │
│                                        │
└────────────────────────────────────────┘
```

### Principios

1. **Consistencia:** Mismo look & feel en toda la app
2. **Claridad:** Elementos autoexplicativos
3. **Eficiencia:** Mínimo esfuerzo, máximo resultado
4. **Accesibilidad:** Usable por todos
5. **Feedback:** Respuesta inmediata a cada acción

---

## 🔧 Tokens de Diseño

### Colores (Color Tokens)

#### Primarios
```css
--color-primary-900: #3E2723;  /* Chocolate Amargo */
--color-primary-700: #6B4423;  /* Chocolate Rico */
--color-primary-500: #8B5A3C;  /* Chocolate Medio */
--color-primary-300: #D4A574;  /* Caramelo Brillante */
--color-primary-100: #F5E6D3;  /* Vainilla Suave */
--color-primary-50:  #FFF8E7;  /* Crema Pastelera */
```

#### Semánticos
```css
--color-success: #4CAF50;
--color-warning: #FF9800;
--color-error:   #F44336;
--color-info:    #2196F3;
```

#### Neutros
```css
--color-white:      #FFFFFF;
--color-gray-50:    #FAFAFA;
--color-gray-100:   #F5F5F5;
--color-gray-200:   #EEEEEE;
--color-gray-300:   #E0E0E0;
--color-gray-400:   #BDBDBD;
--color-gray-500:   #9E9E9E;
--color-gray-600:   #757575;
--color-gray-700:   #616161;
--color-gray-800:   #424242;
--color-gray-900:   #212121;
--color-black:      #000000;
```

### Espaciado (Spacing Tokens)

```css
--spacing-0:   0;
--spacing-1:   4px;   /* 0.25rem */
--spacing-2:   8px;   /* 0.5rem */
--spacing-3:   12px;  /* 0.75rem */
--spacing-4:   16px;  /* 1rem */
--spacing-5:   20px;  /* 1.25rem */
--spacing-6:   24px;  /* 1.5rem */
--spacing-8:   32px;  /* 2rem */
--spacing-10:  40px;  /* 2.5rem */
--spacing-12:  48px;  /* 3rem */
--spacing-16:  64px;  /* 4rem */
--spacing-20:  80px;  /* 5rem */
--spacing-24:  96px;  /* 6rem */
```

### Tipografía (Typography Tokens)

#### Familias
```css
--font-family-heading: 'Playfair Display', serif;
--font-family-body: 'Inter', sans-serif;
--font-family-mono: 'Fira Code', monospace;
```

#### Tamaños
```css
--font-size-xs:   0.75rem;   /* 12px */
--font-size-sm:   0.875rem;  /* 14px */
--font-size-base: 1rem;      /* 16px */
--font-size-lg:   1.125rem;  /* 18px */
--font-size-xl:   1.25rem;   /* 20px */
--font-size-2xl:  1.5rem;    /* 24px */
--font-size-3xl:  1.875rem;  /* 30px */
--font-size-4xl:  2.25rem;   /* 36px */
--font-size-5xl:  3rem;      /* 48px */
```

#### Pesos
```css
--font-weight-normal:   400;
--font-weight-medium:   500;
--font-weight-semibold: 600;
--font-weight-bold:     700;
```

#### Line Heights
```css
--line-height-tight:  1.2;
--line-height-normal: 1.5;
--line-height-relaxed: 1.75;
--line-height-loose:  2;
```

### Sombras (Shadow Tokens)

```css
--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
             0 1px 2px 0 rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
             0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
             0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
             0 10px 10px -5px rgba(0, 0, 0, 0.04);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

### Bordes (Border Tokens)

```css
--border-width-0:  0;
--border-width-1:  1px;
--border-width-2:  2px;
--border-width-4:  4px;

--border-radius-none: 0;
--border-radius-sm:   4px;
--border-radius-md:   8px;
--border-radius-lg:   12px;
--border-radius-xl:   16px;
--border-radius-full: 9999px;
```

### Z-Index (Elevation Tokens)

```css
--z-dropdown:  1000;
--z-sticky:    1020;
--z-fixed:     1030;
--z-modal-backdrop: 1040;
--z-modal:     1050;
--z-popover:   1060;
--z-tooltip:   1070;
```

### Transiciones (Transition Tokens)

```css
--transition-fast:   150ms ease-in-out;
--transition-base:   200ms ease-in-out;
--transition-slow:   300ms ease-in-out;
--transition-slower: 500ms ease-in-out;
```

---

## 🧱 Componentes Base

### Botones (Buttons)

#### Variantes

##### 1. Primary Button
```css
.btn-primary {
  background-color: var(--color-primary-300);
  color: var(--color-white);
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--border-radius-md);
  font-weight: var(--font-weight-semibold);
  transition: var(--transition-base);
}

.btn-primary:hover {
  background-color: #C99563;
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-primary:active {
  transform: translateY(0);
}
```

**Uso:** Acciones principales (Agregar al carrito, Comprar)

##### 2. Secondary Button
```css
.btn-secondary {
  background-color: transparent;
  color: var(--color-primary-700);
  border: 2px solid var(--color-primary-700);
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--border-radius-md);
}

.btn-secondary:hover {
  background-color: var(--color-primary-50);
}
```

**Uso:** Acciones secundarias (Ver detalles, Cancelar)

##### 3. Ghost Button
```css
.btn-ghost {
  background-color: transparent;
  color: var(--color-primary-700);
  padding: var(--spacing-3) var(--spacing-6);
}

.btn-ghost:hover {
  background-color: var(--color-gray-100);
  border-radius: var(--border-radius-md);
}
```

**Uso:** Acciones terciarias (Editar, Eliminar)

##### 4. Icon Button
```css
.btn-icon {
  width: 40px;
  height: 40px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-full);
}
```

**Uso:** Acciones con solo icono (Favorito, Cerrar)

#### Tamaños

```css
.btn-sm  { padding: 8px 16px;  font-size: 14px; }
.btn-md  { padding: 12px 24px; font-size: 16px; } /* Default */
.btn-lg  { padding: 16px 32px; font-size: 18px; }
```

#### Estados

```css
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.btn-loading {
  position: relative;
  color: transparent;
}

.btn-loading::after {
  content: "";
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
```

### Inputs (Form Fields)

#### Text Input
```css
.input {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  transition: var(--transition-base);
}

.input:focus {
  outline: none;
  border-color: var(--color-primary-300);
  box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.1);
}

.input:invalid {
  border-color: var(--color-error);
}

.input::placeholder {
  color: var(--color-gray-400);
}
```

#### Input con Icono
```html
<div class="input-group">
  <span class="input-icon">🔍</span>
  <input type="text" class="input input-with-icon" placeholder="Buscar...">
</div>
```

```css
.input-group {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-gray-500);
}

.input-with-icon {
  padding-left: 40px;
}
```

#### Textarea
```css
.textarea {
  min-height: 120px;
  resize: vertical;
  font-family: var(--font-family-body);
}
```

#### Select
```css
.select {
  appearance: none;
  background-image: url("data:image/svg+xml,..."); /* Chevron down */
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 40px;
}
```

#### Checkbox / Radio
```css
.checkbox,
.radio {
  width: 20px;
  height: 20px;
  accent-color: var(--color-primary-300);
}
```

### Cards

#### Product Card
```css
.product-card {
  background: var(--color-white);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  transition: var(--transition-base);
  box-shadow: var(--shadow-sm);
}

.product-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}

.product-card-image {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
}

.product-card-content {
  padding: var(--spacing-4);
}

.product-card-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary-900);
  margin-bottom: var(--spacing-2);
}

.product-card-price {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-300);
}
```

#### Info Card
```css
.info-card {
  background: var(--color-primary-50);
  border-left: 4px solid var(--color-primary-300);
  padding: var(--spacing-4);
  border-radius: var(--border-radius-md);
}
```

### Badges

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.badge-success {
  background-color: #E8F5E9;
  color: #2E7D32;
}

.badge-warning {
  background-color: #FFF3E0;
  color: #E65100;
}

.badge-error {
  background-color: #FFEBEE;
  color: #C62828;
}

.badge-info {
  background-color: #E3F2FD;
  color: #1565C0;
}
```

### Alerts

```css
.alert {
  padding: var(--spacing-4);
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: start;
  gap: var(--spacing-3);
}

.alert-success {
  background-color: #E8F5E9;
  border-left: 4px solid var(--color-success);
}

.alert-warning {
  background-color: #FFF3E0;
  border-left: 4px solid var(--color-warning);
}

.alert-error {
  background-color: #FFEBEE;
  border-left: 4px solid var(--color-error);
}

.alert-info {
  background-color: #E3F2FD;
  border-left: 4px solid var(--color-info);
}
```

### Loading States

#### Spinner
```css
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--color-gray-200);
  border-top-color: var(--color-primary-300);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

#### Skeleton
```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-gray-200) 25%,
    var(--color-gray-100) 50%,
    var(--color-gray-200) 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s ease-in-out infinite;
  border-radius: var(--border-radius-md);
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.skeleton-text {
  height: 16px;
  margin-bottom: 8px;
}

.skeleton-title {
  height: 24px;
  width: 60%;
}

.skeleton-image {
  width: 100%;
  aspect-ratio: 1 / 1;
}
```

### Modal

```css
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: var(--z-modal-backdrop);
  animation: fadeIn 0.2s ease-out;
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--color-white);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-6);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  z-index: var(--z-modal);
  animation: slideUp 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translate(-50%, -45%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}
```

### Tooltip

```css
.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip-text {
  visibility: hidden;
  position: absolute;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--color-gray-900);
  color: var(--color-white);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  white-space: nowrap;
  z-index: var(--z-tooltip);
}

.tooltip:hover .tooltip-text {
  visibility: visible;
  animation: fadeIn 0.2s;
}

.tooltip-text::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: var(--color-gray-900);
}
```

---

## 🏗️ Componentes Compuestos

### Navbar

```css
.navbar {
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  background: var(--color-white);
  border-bottom: 1px solid var(--color-gray-200);
  padding: var(--spacing-4) 0;
}

.navbar-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--spacing-6);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-logo {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-700);
}

.navbar-menu {
  display: flex;
  gap: var(--spacing-6);
  align-items: center;
}

.navbar-link {
  color: var(--color-gray-700);
  text-decoration: none;
  transition: var(--transition-base);
}

.navbar-link:hover,
.navbar-link.active {
  color: var(--color-primary-700);
}
```

### Footer

```css
.footer {
  background: var(--color-primary-900);
  color: var(--color-white);
  padding: var(--spacing-12) 0 var(--spacing-6);
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-8);
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--spacing-6);
}

.footer-section-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-4);
}

.footer-link {
  color: var(--color-gray-300);
  text-decoration: none;
  display: block;
  margin-bottom: var(--spacing-2);
}

.footer-link:hover {
  color: var(--color-primary-300);
}

.footer-bottom {
  text-align: center;
  padding-top: var(--spacing-8);
  margin-top: var(--spacing-8);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--color-gray-400);
}
```

### Product Grid

```css
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-6);
  padding: var(--spacing-6);
}

@media (min-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}
```

### Breadcrumbs

```css
.breadcrumbs {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  margin-bottom: var(--spacing-4);
}

.breadcrumb-separator {
  color: var(--color-gray-400);
}

.breadcrumb-link {
  color: var(--color-primary-700);
  text-decoration: none;
}

.breadcrumb-link:hover {
  text-decoration: underline;
}

.breadcrumb-current {
  color: var(--color-gray-900);
  font-weight: var(--font-weight-medium);
}
```

### Pagination

```css
.pagination {
  display: flex;
  gap: var(--spacing-2);
  justify-content: center;
  margin-top: var(--spacing-8);
}

.pagination-button {
  min-width: 40px;
  height: 40px;
  padding: 0 var(--spacing-3);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-md);
  background: var(--color-white);
  color: var(--color-gray-700);
  cursor: pointer;
}

.pagination-button:hover {
  background: var(--color-gray-100);
}

.pagination-button.active {
  background: var(--color-primary-300);
  color: var(--color-white);
  border-color: var(--color-primary-300);
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

---

## 📐 Patrones de Diseño

### Container

```css
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--spacing-6);
}

.container-sm {
  max-width: 640px;
}

.container-md {
  max-width: 896px;
}

.container-lg {
  max-width: 1024px;
}

.container-xl {
  max-width: 1280px;
}

.container-full {
  max-width: 100%;
}
```

### Section

```css
.section {
  padding: var(--spacing-12) 0;
}

.section-sm {
  padding: var(--spacing-8) 0;
}

.section-lg {
  padding: var(--spacing-16) 0;
}

.section-hero {
  padding: var(--spacing-20) 0;
  background: linear-gradient(135deg, #FFF8E7 0%, #F5E6D3 100%);
}
```

### Grid System

```css
.grid {
  display: grid;
  gap: var(--spacing-6);
}

.grid-cols-1  { grid-template-columns: repeat(1, 1fr); }
.grid-cols-2  { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3  { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4  { grid-template-columns: repeat(4, 1fr); }

.col-span-1  { grid-column: span 1; }
.col-span-2  { grid-column: span 2; }
.col-span-3  { grid-column: span 3; }
.col-span-4  { grid-column: span 4; }
```

### Flex Utilities

```css
.flex          { display: flex; }
.inline-flex   { display: inline-flex; }

.flex-row      { flex-direction: row; }
.flex-col      { flex-direction: column; }

.items-start   { align-items: flex-start; }
.items-center  { align-items: center; }
.items-end     { align-items: flex-end; }

.justify-start { justify-content: flex-start; }
.justify-center { justify-content: center; }
.justify-end   { justify-content: flex-end; }
.justify-between { justify-content: space-between; }

.gap-1  { gap: var(--spacing-1); }
.gap-2  { gap: var(--spacing-2); }
.gap-4  { gap: var(--spacing-4); }
.gap-6  { gap: var(--spacing-6); }
```

---

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile First Approach */
--breakpoint-sm: 640px;   /* Tablet */
--breakpoint-md: 768px;   /* Tablet landscape */
--breakpoint-lg: 1024px;  /* Desktop */
--breakpoint-xl: 1280px;  /* Large desktop */
--breakpoint-2xl: 1536px; /* Extra large */
```

### Media Queries

```css
/* Mobile: Default (< 640px) */

/* Tablet */
@media (min-width: 640px) {
  .sm\:text-lg { font-size: var(--font-size-lg); }
}

/* Tablet Landscape */
@media (min-width: 768px) {
  .md\:grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop */
@media (min-width: 1024px) {
  .lg\:grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
}

/* Large Desktop */
@media (min-width: 1280px) {
  .xl\:grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
}
```

### Responsive Typography

```css
.responsive-text {
  font-size: clamp(1rem, 2vw + 0.5rem, 1.5rem);
}

.responsive-heading {
  font-size: clamp(1.5rem, 4vw + 1rem, 3rem);
}
```

---

## ♿ Accesibilidad

### Contraste de Colores

Todos los textos cumplen **WCAG AA**:
- Texto normal: Ratio mínimo 4.5:1
- Texto grande: Ratio mínimo 3:1

### Focus States

```css
*:focus-visible {
  outline: 2px solid var(--color-primary-300);
  outline-offset: 2px;
}

.btn:focus-visible,
.input:focus-visible {
  box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.2);
}
```

### Screen Reader Only

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### Aria Labels

```html
<!-- Botones con solo icono -->
<button aria-label="Agregar al carrito">
  <span aria-hidden="true">🛒</span>
</button>

<!-- Estados de loading -->
<button aria-busy="true" aria-live="polite">
  <span class="sr-only">Cargando...</span>
</button>
```

---

## ⚡ Performance

### Optimización de Imágenes

```css
.image-responsive {
  width: 100%;
  height: auto;
  object-fit: cover;
  loading: lazy;
}
```

### Font Loading

```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter.woff2') format('woff2');
  font-display: swap;
}
```

### Critical CSS

Inlinar estilos críticos en `<head>`:
- Layout
- Above the fold content
- Colores principales

### Lazy Loading

```html
<!-- Imágenes -->
<img loading="lazy" src="..." alt="...">

<!-- Componentes React -->
const ProductDetail = lazy(() => import('./ProductDetail'));
```

---

## 📊 Métricas de Calidad

### Performance Goals

- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1

### Bundle Size

- CSS: < 50KB (gzipped)
- Fonts: < 100KB total
- Icons: Usar sprites SVG

---

## 🔄 Versionado

**Versión actual:** 1.0.0  
**Última actualización:** Noviembre 2025

### Changelog

#### v1.0.0 (Noviembre 2025)
- ✅ Sistema de tokens completo
- ✅ Componentes base
- ✅ Patrones responsive
- ✅ Guías de accesibilidad

---

<p align="center">
  <strong>Design System v1.0</strong><br>
  The Gods of Programming © 2024<br>
  <br>
  <em>Construido con amor y CSS 💙</em>
</p>
