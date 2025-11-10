import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { isAuthenticated, loading, isSeller } = useAuth();
  const location = useLocation();

  // Log para depuración
  console.log('🔒 ProtectedRoute:', { 
    path: location.pathname, 
    requireAuth, 
    isAuthenticated, 
    loading,
    isSeller
  });

  if (loading) {
    console.log('⏳ ProtectedRoute: Auth state is loading...');
    // Es crucial mostrar algo (incluso nulo o un spinner) mientras se carga.
    // Devolver null o un componente de carga evita renderizar el resto de la lógica prematuramente.
    return <div>Verificando sesión...</div>;
  }

  // --- Lógica para rutas que REQUIEREN autenticación ---
  if (requireAuth) {
    // Si no está autenticado, redirigir a login
    if (!isAuthenticated) {
      console.log(`🛑 ProtectedRoute: Acceso denegado a '${location.pathname}'. No autenticado. Redirigiendo a /login.`);
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    // Si la ruta es para vendedores y el usuario no lo es, redirigir al inicio
    if (location.pathname.startsWith('/seller') && !isSeller) {
      console.log(`🛑 ProtectedRoute: Acceso denegado a '${location.pathname}'. El usuario no es vendedor. Redirigiendo a /.`);
      return <Navigate to="/" replace />;
    }

    // Si cumple todas las condiciones, permitir acceso
    console.log(`✅ ProtectedRoute: Acceso permitido a '${location.pathname}'.`);
    return children;
  }

  // --- Lógica para rutas que NO requieren autenticación (públicas o solo para no logueados como /login) ---
  else {
    // Si el usuario ya está autenticado, no debería ver páginas como /login o /register
    if (isAuthenticated) {
      console.log(`↩️ ProtectedRoute: Usuario ya autenticado intenta acceder a '${location.pathname}'. Redirigiendo a /.`);
      return <Navigate to="/" replace />;
    }

    // Si no requiere autenticación y el usuario no está logueado, permitir acceso
    console.log(`✅ ProtectedRoute: Acceso permitido a ruta pública '${location.pathname}'.`);
    return children;
  }
};

export default ProtectedRoute;