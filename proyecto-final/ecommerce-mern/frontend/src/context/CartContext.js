import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';

// Crear el contexto del carrito
const CartContext = createContext();

// Hook personalizado para usar el contexto del carrito
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

// Estados posibles del carrito
const CART_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_CART: 'SET_CART',
  SET_ERROR: 'SET_ERROR',
  ADD_ITEM: 'ADD_ITEM',
  UPDATE_ITEM: 'UPDATE_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  CLEAR_CART: 'CLEAR_CART',
  SET_TOTAL: 'SET_TOTAL',
  INCREMENT_ITEM: 'INCREMENT_ITEM',
  DECREMENT_ITEM: 'DECREMENT_ITEM'
};

// Estado inicial del carrito
const initialCartState = {
  items: [],
  total: 0,
  itemsCount: 0,
  loading: false,
  error: null,
  lastSync: null
};

// Función para calcular totales
const calculateTotals = (items) => {
  const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  return { itemsCount, total };
};

// Reducer para manejar las acciones del carrito
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
        error: action.payload ? null : state.error
      };

    case CART_ACTIONS.SET_CART: {
      const { itemsCount, total } = calculateTotals(action.payload);
      return {
        ...state,
        items: action.payload,
        itemsCount,
        total,
        loading: false,
        error: null,
        lastSync: new Date().toISOString()
      };
    }

    case CART_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case CART_ACTIONS.ADD_ITEM: {
      const existingItemIndex = state.items.findIndex(
        item => item.product._id === action.payload.product._id
      );

      let newItems;
      if (existingItemIndex >= 0) {
        // Si el producto ya existe, incrementar cantidad
        newItems = [...state.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + action.payload.quantity
        };
      } else {
        // Si es nuevo producto, agregarlo
        newItems = [...state.items, action.payload];
      }

      const totals = calculateTotals(newItems);
      return {
        ...state,
        items: newItems,
        itemsCount: totals.itemsCount,
        total: totals.total
      };
    }

    case CART_ACTIONS.UPDATE_ITEM: {
      const newItems = state.items.map(item => 
        item.product._id === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      const totals = calculateTotals(newItems);
      return {
        ...state,
        items: newItems,
        itemsCount: totals.itemsCount,
        total: totals.total
      };
    }

    case CART_ACTIONS.INCREMENT_ITEM: {
      const newItems = state.items.map(item => 
        item.product._id === action.payload
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      const totals = calculateTotals(newItems);
      return {
        ...state,
        items: newItems,
        itemsCount: totals.itemsCount,
        total: totals.total
      };
    }

    case CART_ACTIONS.DECREMENT_ITEM: {
      const newItems = state.items.map(item => 
        item.product._id === action.payload
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      ).filter(item => item.quantity > 0);
      
      const totals = calculateTotals(newItems);
      return {
        ...state,
        items: newItems,
        itemsCount: totals.itemsCount,
        total: totals.total
      };
    }

    case CART_ACTIONS.REMOVE_ITEM: {
      const newItems = state.items.filter(
        item => item.product._id !== action.payload
      );
      const totals = calculateTotals(newItems);
      return {
        ...state,
        items: newItems,
        itemsCount: totals.itemsCount,
        total: totals.total
      };
    }

    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: [],
        itemsCount: 0,
        total: 0
      };

    default:
      return state;
  }
};

// Proveedor del contexto del carrito
export const CartProvider = ({ children }) => {
  const [cartState, dispatch] = useReducer(cartReducer, initialCartState);

  // Función para cargar el carrito desde el servidor
  const loadCart = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      const response = await cartAPI.getCart();
      dispatch({ type: CART_ACTIONS.SET_CART, payload: response.data.items || [] });
    } catch (error) {
      console.error('Error cargando carrito:', error);
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Error al cargar el carrito' });
      // En caso de error, intentar cargar desde localStorage como respaldo
      const localCart = localStorage.getItem('cart');
      if (localCart) {
        try {
          const parsedCart = JSON.parse(localCart);
          dispatch({ type: CART_ACTIONS.SET_CART, payload: parsedCart });
        } catch (parseError) {
          console.error('Error parsing local cart:', parseError);
        }
      }
    }
  }, []);



  // Función para agregar un producto al carrito
  const addToCart = useCallback(async (product, quantity = 1) => {
    try {
      // Actualizar estado local inmediatamente para mejor UX
      dispatch({ 
        type: CART_ACTIONS.ADD_ITEM, 
        payload: { product, quantity } 
      });

      // Sincronizar con servidor en background
      const token = localStorage.getItem('token');
      if (token) {
        await cartAPI.addToCart({ productId: product._id, quantity });
      } else {
        // Guardar en localStorage si no hay usuario logueado
        const newItems = [...cartState.items];
        const existingIndex = newItems.findIndex(item => item.product._id === product._id);
        
        if (existingIndex >= 0) {
          newItems[existingIndex].quantity += quantity;
        } else {
          newItems.push({ product, quantity });
        }
        
        localStorage.setItem('cart', JSON.stringify(newItems));
      }

      return true;
    } catch (error) {
      console.error('Error agregando al carrito:', error);
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Error al agregar producto al carrito' });
      return false;
    }
  }, [cartState.items]);

  // Función para actualizar la cantidad de un producto
  const updateQuantity = useCallback(async (productId, quantity) => {
    if (quantity < 1) {
      return removeFromCart(productId);
    }

    try {
      // Actualizar estado local inmediatamente
      dispatch({ 
        type: CART_ACTIONS.UPDATE_ITEM, 
        payload: { productId, quantity } 
      });

      // Sincronizar con servidor
      const token = localStorage.getItem('token');
      if (token) {
        await cartAPI.updateCartItem(productId, { quantity });
      } else {
        // Actualizar localStorage
        const localCart = cartState.items.map(item =>
          item.product._id === productId ? { ...item, quantity } : item
        );
        localStorage.setItem('cart', JSON.stringify(localCart));
      }

      return true;
    } catch (error) {
      console.error('Error actualizando cantidad:', error);
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Error al actualizar cantidad' });
      return false;
    }
  }, [cartState.items]);

  // Función para incrementar cantidad
  const incrementItem = useCallback(async (productId) => {
    try {
      const currentItem = cartState.items.find(item => item.product._id === productId);
      if (!currentItem) return false;

      dispatch({ type: CART_ACTIONS.INCREMENT_ITEM, payload: productId });
      
      const token = localStorage.getItem('token');
      if (token) {
        await cartAPI.updateCartItem(productId, { quantity: currentItem.quantity + 1 });
      } else {
        // Actualizar localStorage
        const localCart = cartState.items.map(item =>
          item.product._id === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
        localStorage.setItem('cart', JSON.stringify(localCart));
      }
      
      return true;
    } catch (error) {
      console.error('Error incrementando item:', error);
      return false;
    }
  }, [cartState.items]);

  // Función para decrementar cantidad
  const decrementItem = useCallback(async (productId) => {
    try {
      const currentItem = cartState.items.find(item => item.product._id === productId);
      if (currentItem && currentItem.quantity <= 1) {
        // Eliminar directamente si la cantidad es 1
        dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: productId });
        
        const token = localStorage.getItem('token');
        if (token) {
          await cartAPI.removeFromCart(productId);
        } else {
          const localCart = cartState.items.filter(item => item.product._id !== productId);
          localStorage.setItem('cart', JSON.stringify(localCart));
        }
        return true;
      }

      dispatch({ type: CART_ACTIONS.DECREMENT_ITEM, payload: productId });
      
      const token = localStorage.getItem('token');
      if (token && currentItem) {
        await cartAPI.updateCartItem(productId, { quantity: currentItem.quantity - 1 });
      }
      
      return true;
    } catch (error) {
      console.error('Error decrementando item:', error);
      return false;
    }
  }, [cartState.items]);

  // Función para eliminar un producto del carrito
  const removeFromCart = useCallback(async (productId) => {
    try {
      // Actualizar estado local inmediatamente
      dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: productId });

      // Sincronizar con servidor
      const token = localStorage.getItem('token');
      if (token) {
        await cartAPI.removeFromCart(productId);
      } else {
        // Actualizar localStorage
        const localCart = cartState.items.filter(item => item.product._id !== productId);
        localStorage.setItem('cart', JSON.stringify(localCart));
      }

      return true;
    } catch (error) {
      console.error('Error eliminando del carrito:', error);
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Error al eliminar producto del carrito' });
      return false;
    }
  }, [cartState.items]);

  // Función para limpiar todo el carrito
  const clearCart = useCallback(async () => {
    try {
      dispatch({ type: CART_ACTIONS.CLEAR_CART });

      // Limpiar servidor y localStorage
      const token = localStorage.getItem('token');
      if (token) {
        await cartAPI.clearCart();
      }
      localStorage.removeItem('cart');

      return true;
    } catch (error) {
      console.error('Error limpiando carrito:', error);
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Error al limpiar carrito' });
      return false;
    }
  }, []);

  // Función para obtener la cantidad de un producto específico en el carrito
  const getItemQuantity = useCallback((productId) => {
    const item = cartState.items.find(item => item.product._id === productId);
    return item ? item.quantity : 0;
  }, [cartState.items]);

  // Función para verificar si un producto está en el carrito
  const isInCart = useCallback((productId) => {
    return cartState.items.some(item => item.product._id === productId);
  }, [cartState.items]);

  // Cargar carrito al montar el componente
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Sincronizar carrito cuando cambia el usuario
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadCart();
    } else {
      // Si no hay usuario, cargar desde localStorage
      const localCart = localStorage.getItem('cart');
      if (localCart) {
        try {
          const parsedCart = JSON.parse(localCart);
          dispatch({ type: CART_ACTIONS.SET_CART, payload: parsedCart });
        } catch (error) {
          console.error('Error parsing local cart:', error);
          localStorage.removeItem('cart');
        }
      }
    }
  }, [loadCart]);

  // Valor del contexto
  const contextValue = {
    // Estado
    ...cartState,
    
    // Funciones principales
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    
    // Funciones de utilidad
    incrementItem,
    decrementItem,
    getItemQuantity,
    isInCart,
    loadCart,
    
    // Información calculada
    isEmpty: cartState.items.length === 0,
    totalItems: cartState.itemsCount,
    totalPrice: cartState.total,
    
    // Control de errores
    clearError: () => dispatch({ type: CART_ACTIONS.SET_ERROR, payload: null })
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;