import axios from 'axios';

// Configuración base de Axios
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autenticación automáticamente
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
API.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.data); // Debug
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    console.error('Error Response:', error.response);
    console.error('Error Request:', error.request);
    
    // Manejar errores de autenticación
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Manejar otros errores
    const errorMessage = error.response?.data?.message || error.message || 'Error desconocido';
    
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      errors: error.response?.data?.errors,
      originalError: error
    });
  }
);

// Servicios de autenticación
export const authAPI = {
  register: (userData) => API.post('/api/auth/register', userData),
  login: (credentials) => API.post('/api/auth/login', credentials),
  logout: () => API.post('/api/auth/logout'),
  getProfile: () => API.get('/api/auth/profile'),
  updateProfile: (userData) => API.put('/api/auth/profile', userData),
  changePassword: (passwordData) => API.put('/api/auth/change-password', passwordData),
  requestPasswordReset: (email) => API.post('/api/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => API.post('/api/auth/reset-password', { token, password: newPassword }),
};

// Servicios de productos
export const productAPI = {
  getAll: (params = {}) => API.get('/api/products', { params }),
  getById: (id) => API.get(`/api/products/${id}`),
  getRelated: (id, limit = 4) => API.get(`/api/products/${id}/related`, { params: { limit } }),
  create: (productData) => API.post('/api/products', productData),
  update: (id, productData) => API.put(`/api/products/${id}`, productData),
  delete: (id) => API.delete(`/api/products/${id}`),
  search: (query, filters = {}) => API.get('/api/products', { 
    params: { search: query, ...filters } 
  }),
};

// Servicios del carrito
export const cartAPI = {
  get: () => API.get('/api/cart'),
  add: (productId, quantity = 1, variantId = null) => 
    API.post('/api/cart/add', { productId, quantity, variantId }),
  update: (productId, quantity, variantId = null) => 
    API.post('/api/cart/update', { productId, quantity, variantId }),
  remove: (productId, variantId = null) => 
    API.delete('/api/cart/remove', { data: { productId, variantId } }),
  clear: () => API.delete('/api/cart/clear'),
  getSummary: () => API.get('/api/cart/summary'),
};

// Servicios de órdenes
export const orderAPI = {
  create: (orderData) => API.post('/api/orders', orderData),
  getAll: (params = {}) => API.get('/api/orders', { params }),
  getById: (id) => API.get(`/api/orders/${id}`),
  cancel: (id, reason) => API.put(`/api/orders/${id}/cancel`, { reason }),
  uploadPaymentProof: (id, formData) => 
    API.put(`/api/orders/${id}/payment-proof`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  // Admin
  getAllAdmin: (params = {}) => API.get('/api/orders/admin/all', { params }),
  updateStatus: (id, statusData) => API.put(`/api/orders/admin/${id}/status`, statusData),
};

// Servicio para verificar la salud del servidor
export const healthAPI = {
  check: () => API.get('/api/health'),
};

// Utilidades
export const apiUtils = {
  // Formatear errores para mostrar en la UI
  formatError: (error) => {
    if (typeof error === 'string') return error;
    if (error.errors && Array.isArray(error.errors)) {
      return error.errors.map(err => err.message).join(', ');
    }
    return error.message || 'Error desconocido';
  },

  // Construir parámetros de consulta para filtros
  buildQueryParams: (filters) => {
    const params = {};
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        params[key] = filters[key];
      }
    });
    return params;
  },

  // Formatear precio
  formatPrice: (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(price);
  },

  // Formatear fecha
  formatDate: (date) => {
    return new Intl.DateTimeFormat('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  },
};

export default API;