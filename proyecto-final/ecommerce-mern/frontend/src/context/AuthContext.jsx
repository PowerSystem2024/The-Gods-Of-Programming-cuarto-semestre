import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar datos del usuario al iniciar
  useEffect(() => {
    console.log('🔄🔄🔄 ================================');
    console.log('🔄 AuthContext: useEffect INICIANDO');
    console.log('🔄 Timestamp:', new Date().toISOString());
    
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    console.log('📦 Token en localStorage:', storedToken ? `SÍ (${storedToken.substring(0, 20)}...)` : 'NO');
    console.log('📦 User en localStorage:', storedUser ? `SÍ (${storedUser.substring(0, 50)}...)` : 'NO');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('🔄 Parseando usuario...');
        console.log('✅ Usuario parseado:', parsedUser);
        
        setToken(storedToken);
        setUser(parsedUser);
        console.log('✅ Estado actualizado en contexto');
      } catch (error) {
        console.error('❌ Error parseando usuario:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        console.error('❌ localStorage limpiado por error de parseo');
      }
    } else {
      console.log('⚠️ No hay token/user en localStorage al montar AuthContext');
    }
    
    setLoading(false);
    console.log('✅ AuthContext: setLoading(false)');
    console.log('🔄🔄🔄 ================================');
    
    // Cleanup function para detectar cuando el componente se desmonta
    return () => {
      console.log('🔴🔴🔴 AuthContext: DESMONTANDO (esto NO debería pasar)');
    };
  }, []);

  // Login: guardar token y usuario
  const login = (userData, userToken) => {
    console.log('🔐 AuthContext.login llamado con:', { userData, userToken });
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    console.log('✅ Usuario guardado en contexto:', userData);
    console.log('✅ Token guardado:', userToken);
  };

  // Logout: limpiar todo
  const logout = () => {
    console.log('🚪🚪🚪 LOGOUT LLAMADO - Limpiando autenticación');
    console.trace('Stack trace del logout:');
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('✅ localStorage limpiado');
  };

  // Verificar si el usuario está autenticado
  const isAuthenticated = !!token && !!user;

  // Verificar si el usuario es vendedor
  const isSeller = user?.role === 'seller' || user?.role === 'admin';

  // Verificar si el usuario es admin
  const isAdmin = user?.role === 'admin';

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    isSeller,
    isAdmin,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
