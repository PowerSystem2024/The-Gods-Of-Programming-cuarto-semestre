import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import '../styles/seller.css';

const MyProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, product: null });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Verificar que sea vendedor
      if (parsedUser.role !== 'seller' && parsedUser.role !== 'admin') {
        navigate('/');
        return;
      }
    } else {
      navigate('/login');
      return;
    }

    loadProducts();
  }, [navigate]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getMyProducts();
      setProducts(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error loading products:', err);
      setError(err.message || 'Error cargando productos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await productAPI.delete(productId);
      setProducts(products.filter(p => p._id !== productId));
      setDeleteModal({ show: false, product: null });
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Error al eliminar el producto: ' + (err.message || 'Error desconocido'));
    }
  };

  const openDeleteModal = (product) => {
    setDeleteModal({ show: true, product });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ show: false, product: null });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(price);
  };

  if (loading) {
    return (
      <div className="seller-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="seller-container">
      <div className="seller-header">
        <div>
          <h1 className="seller-title">Mis Productos</h1>
          {user && (
            <p className="seller-subtitle">
              {user.storeName || 'Mi Tienda'} - {products.length} producto{products.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        <Link to="/seller/products/new" className="btn-primary">
          <span>➕</span> Nuevo Producto
        </Link>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h2>No tienes productos publicados</h2>
          <p>Comienza a vender agregando tu primer producto</p>
          <Link to="/seller/products/new" className="btn-primary">
            Crear Producto
          </Link>
        </div>
      ) : (
        <div className="products-table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <div className="product-cell">
                      {product.images && product.images[0] && (
                        <img 
                          src={product.images[0].url} 
                          alt={product.images[0].alt || product.name}
                          className="product-thumbnail"
                        />
                      )}
                      <div>
                        <p className="product-name">{product.name}</p>
                        <p className="product-sku">{product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="category-badge">
                      {product.category?.subcategory || product.category?.main || 'Sin categoría'}
                    </span>
                  </td>
                  <td className="price-cell">{formatPrice(product.price)}</td>
                  <td>
                    <span className={`stock-badge ${product.stock < 10 ? 'stock-low' : ''}`}>
                      {product.stock} {product.unit}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-${product.status}`}>
                      {product.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link 
                        to={`/seller/products/edit/${product._id}`}
                        className="btn-action btn-edit"
                        title="Editar"
                      >
                        ✏️
                      </Link>
                      <button
                        onClick={() => openDeleteModal(product)}
                        className="btn-action btn-delete"
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                      <Link 
                        to={`/product/${product._id}`}
                        className="btn-action btn-view"
                        title="Ver"
                        target="_blank"
                      >
                        👁️
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {deleteModal.show && (
        <div className="modal-overlay" onClick={closeDeleteModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirmar Eliminación</h2>
              <button onClick={closeDeleteModal} className="modal-close">✕</button>
            </div>
            <div className="modal-body">
              <p>¿Estás seguro de que deseas eliminar este producto?</p>
              <p className="modal-product-name">{deleteModal.product?.name}</p>
              <p className="modal-warning">Esta acción no se puede deshacer.</p>
            </div>
            <div className="modal-footer">
              <button onClick={closeDeleteModal} className="btn-secondary">
                Cancelar
              </button>
              <button 
                onClick={() => handleDelete(deleteModal.product._id)}
                className="btn-danger"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProducts;
