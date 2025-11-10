import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productAPI } from '../services/api';
import '../styles/seller.css';

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(isEditing);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    description: '',
    price: '',
    comparePrice: '',
    sku: '',
    category: {
      main: '',
      subcategory: ''
    },
    brand: '',
    stock: '',
    unit: 'unidad',
    weight: '',
    images: [{ url: '', alt: '', isPrimary: true }],
    featured: false,
    status: 'active',
    tags: ''
  });

  const categories = {
    'Pastelería': ['Alfajores', 'Facturas', 'Tortas', 'Cupcakes', 'Cookies', 'Brownies', 'Chocolates']
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'seller' && parsedUser.role !== 'admin') {
      navigate('/');
      return;
    }

    // Establecer brand del usuario
    if (parsedUser.storeName) {
      setFormData(prev => ({ ...prev, brand: parsedUser.storeName }));
    }

    // Cargar producto si estamos editando
    if (isEditing) {
      const loadProduct = async () => {
        try {
          setLoadingProduct(true);
          const response = await productAPI.getById(id);
          const product = response.data;

          setFormData({
            name: product.name || '',
            shortDescription: product.shortDescription || '',
            description: product.description || '',
            price: product.price || '',
            comparePrice: product.comparePrice || '',
            sku: product.sku || '',
            category: {
              main: product.category?.main || '',
              subcategory: product.category?.subcategory || ''
            },
            brand: product.brand || '',
            stock: product.stock || '',
            unit: product.unit || 'unidad',
            weight: product.weight || '',
            images: product.images?.length > 0 ? product.images : [{ url: '', alt: '', isPrimary: true }],
            featured: product.featured || false,
            status: product.status || 'active',
            tags: Array.isArray(product.tags) ? product.tags.join(', ') : ''
          });
        } catch (err) {
          console.error('Error loading product:', err);
          alert('Error cargando el producto');
          navigate('/seller/products');
        } finally {
          setLoadingProduct(false);
        }
      };

      loadProduct();
    }
  }, [navigate, isEditing, id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('category.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        category: {
          ...prev.category,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (index, field, value) => {
    const newImages = [...formData.images];
    newImages[index] = {
      ...newImages[index],
      [field]: value
    };

    // Si se marca como primaria, desmarcar las demás
    if (field === 'isPrimary' && value === true) {
      newImages.forEach((img, i) => {
        if (i !== index) img.isPrimary = false;
      });
    }

    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, { url: '', alt: '', isPrimary: false }]
    }));
  };

  const removeImage = (index) => {
    if (formData.images.length === 1) {
      alert('Debe haber al menos una imagen');
      return;
    }

    const newImages = formData.images.filter((_, i) => i !== index);
    
    // Si se elimina la imagen primaria, hacer primaria la primera
    if (formData.images[index].isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true;
    }

    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';
    if (!formData.price || formData.price <= 0) newErrors.price = 'El precio debe ser mayor a 0';
    if (!formData.sku.trim()) newErrors.sku = 'El SKU es requerido';
    if (!formData.category.main) newErrors.categoryMain = 'La categoría principal es requerida';
    if (!formData.stock || formData.stock < 0) newErrors.stock = 'El stock no puede ser negativo';
    
    // Validar que al menos una imagen tenga URL
    const hasValidImage = formData.images.some(img => img.url.trim());
    if (!hasValidImage) {
      newErrors.images = 'Debe agregar al menos una imagen';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      setLoading(true);

      // Preparar datos
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : undefined,
        stock: parseInt(formData.stock),
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        images: formData.images.filter(img => img.url.trim())
      };

      if (isEditing) {
        await productAPI.update(id, productData);
      } else {
        await productAPI.create(productData);
      }

      navigate('/seller/products');
    } catch (err) {
      console.error('Error saving product:', err);
      setErrors({ submit: err.message || 'Error al guardar el producto' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  if (loadingProduct) {
    return (
      <div className="seller-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando producto...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="seller-container">
      <div className="form-header">
        <h1 className="form-title">
          {isEditing ? '✏️ Editar Producto' : '➕ Nuevo Producto'}
        </h1>
        <button onClick={() => navigate('/seller/products')} className="btn-secondary">
          ← Volver
        </button>
      </div>

      {errors.submit && (
        <div className="alert alert-error">
          <span>⚠️</span>
          <p>{errors.submit}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="product-form">
        {/* Información Básica */}
        <div className="form-section">
          <h2 className="section-title">📝 Información Básica</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">
                Nombre del Producto <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Ej: Alfajores de Maicena x 12"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="sku">
                SKU <span className="required">*</span>
              </label>
              <input
                type="text"
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className={`form-input ${errors.sku ? 'error' : ''}`}
                placeholder="Ej: ALFAJOR-MAICENA-12"
              />
              {errors.sku && <span className="error-message">{errors.sku}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="shortDescription">Descripción Corta</label>
            <input
              type="text"
              id="shortDescription"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              className="form-input"
              placeholder="Descripción breve para mostrar en listados"
              maxLength="150"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">
              Descripción Completa <span className="required">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`form-textarea ${errors.description ? 'error' : ''}`}
              placeholder="Descripción detallada del producto..."
              rows="6"
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>
        </div>

        {/* Precios e Inventario */}
        <div className="form-section">
          <h2 className="section-title">💰 Precios e Inventario</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">
                Precio <span className="required">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={`form-input ${errors.price ? 'error' : ''}`}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
              {errors.price && <span className="error-message">{errors.price}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="comparePrice">Precio Comparación (Opcional)</label>
              <input
                type="number"
                id="comparePrice"
                name="comparePrice"
                value={formData.comparePrice}
                onChange={handleChange}
                className="form-input"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
              <small className="form-hint">Precio anterior para mostrar descuento</small>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="stock">
                Stock <span className="required">*</span>
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className={`form-input ${errors.stock ? 'error' : ''}`}
                placeholder="0"
                min="0"
              />
              {errors.stock && <span className="error-message">{errors.stock}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="unit">Unidad</label>
              <select
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="form-select"
              >
                <option value="unidad">Unidad</option>
                <option value="docena">Docena</option>
                <option value="kg">Kilogramo</option>
                <option value="g">Gramos</option>
                <option value="pack">Pack</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="weight">Peso (g)</label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="form-input"
                placeholder="0"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Categorización */}
        <div className="form-section">
          <h2 className="section-title">🏷️ Categorización</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category.main">
                Categoría Principal <span className="required">*</span>
              </label>
              <select
                id="category.main"
                name="category.main"
                value={formData.category.main}
                onChange={handleChange}
                className={`form-select ${errors.categoryMain ? 'error' : ''}`}
              >
                <option value="">Seleccionar categoría</option>
                {Object.keys(categories).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.categoryMain && <span className="error-message">{errors.categoryMain}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="category.subcategory">Subcategoría</label>
              <select
                id="category.subcategory"
                name="category.subcategory"
                value={formData.category.subcategory}
                onChange={handleChange}
                className="form-select"
                disabled={!formData.category.main}
              >
                <option value="">Seleccionar subcategoría</option>
                {formData.category.main && categories[formData.category.main]?.map(subcat => (
                  <option key={subcat} value={subcat}>{subcat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="brand">Marca</label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="form-input"
                placeholder="Nombre de la marca"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="tags">Etiquetas (separadas por comas)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="form-input"
              placeholder="Ej: alfajores, maicena, dulce de leche, artesanal"
            />
            <small className="form-hint">Ayudan a los clientes a encontrar tu producto</small>
          </div>
        </div>

        {/* Imágenes */}
        <div className="form-section">
          <h2 className="section-title">📸 Imágenes</h2>
          {errors.images && <span className="error-message">{errors.images}</span>}
          
          {formData.images.map((image, index) => (
            <div key={index} className="image-input-group">
              <div className="image-input-header">
                <h3>Imagen {index + 1}</h3>
                {formData.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="btn-remove-image"
                  >
                    ✕ Eliminar
                  </button>
                )}
              </div>

              <div className="form-row">
                <div className="form-group flex-2">
                  <label htmlFor={`image-url-${index}`}>
                    URL de la Imagen {index === 0 && <span className="required">*</span>}
                  </label>
                  <input
                    type="url"
                    id={`image-url-${index}`}
                    value={image.url}
                    onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                    className="form-input"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>

                <div className="form-group flex-1">
                  <label htmlFor={`image-alt-${index}`}>Texto Alternativo</label>
                  <input
                    type="text"
                    id={`image-alt-${index}`}
                    value={image.alt}
                    onChange={(e) => handleImageChange(index, 'alt', e.target.value)}
                    className="form-input"
                    placeholder="Descripción"
                  />
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={image.isPrimary}
                      onChange={(e) => handleImageChange(index, 'isPrimary', e.target.checked)}
                    />
                    <span>Principal</span>
                  </label>
                </div>
              </div>

              {image.url && (
                <div className="image-preview">
                  <img src={image.url} alt={image.alt || 'Preview'} />
                </div>
              )}
            </div>
          ))}

          <button type="button" onClick={addImage} className="btn-add-image">
            ➕ Agregar Otra Imagen
          </button>
        </div>

        {/* Opciones Adicionales */}
        <div className="form-section">
          <h2 className="section-title">⚙️ Opciones Adicionales</h2>
          
          <div className="form-row">
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                />
                <span>Producto Destacado</span>
              </label>
              <small className="form-hint">Se mostrará en la página principal</small>
            </div>

            <div className="form-group">
              <label htmlFor="status">Estado</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/seller/products')}
            className="btn-secondary"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-small"></span>
                Guardando...
              </>
            ) : (
              <>
                {isEditing ? '💾 Guardar Cambios' : '➕ Crear Producto'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
