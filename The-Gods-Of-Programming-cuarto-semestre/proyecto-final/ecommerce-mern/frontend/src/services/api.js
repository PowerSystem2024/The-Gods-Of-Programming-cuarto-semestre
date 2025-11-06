import axios from 'axios';

// Configuración base de Axios
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
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
  register: (userData) => API.post('/auth/register', userData),
  login: (credentials) => API.post('/auth/login', credentials),
  logout: () => API.post('/auth/logout'),
  getProfile: () => API.get('/auth/profile'),
  updateProfile: (userData) => API.put('/auth/profile', userData),
  changePassword: (passwordData) => API.put('/auth/change-password', passwordData),
  requestPasswordReset: (email) => API.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => API.post('/auth/reset-password', { token, password: newPassword }),
};

// Servicios de productos
export const productAPI = {
  getAll: (params = {}) => API.get('/products', { params }),
  getById: (id) => API.get(`/products/${id}`),
  getRelated: (id, limit = 4) => API.get(`/products/${id}/related`, { params: { limit } }),
  create: (productData) => API.post('/products', productData),
  update: (id, productData) => API.put(`/products/${id}`, productData),
  delete: (id) => API.delete(`/products/${id}`),
  search: (query, filters = {}) => API.get('/products', { 
    params: { search: query, ...filters } 
  }),
};

// Servicios del carrito
export const cartAPI = {
  get: () => API.get('/cart'),
  add: (productId, quantity = 1, variantId = null) => 
    API.post('/cart/add', { productId, quantity, variantId }),
  update: (productId, quantity, variantId = null) => 
    API.post('/cart/update', { productId, quantity, variantId }),
  remove: (productId, variantId = null) => 
    API.delete('/cart/remove', { data: { productId, variantId } }),
  clear: () => API.delete('/cart/clear'),
  getSummary: () => API.get('/cart/summary'),
};

// Servicio para verificar la salud del servidor
export const healthAPI = {
  check: () => API.get('/health'),
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