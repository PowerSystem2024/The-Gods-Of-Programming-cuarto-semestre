import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('token');

  if (requireAuth && !isAuthenticated) {
    // Redirigir a login guardando la ruta actual
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    // Si el usuario ya está autenticado y trata de acceder a login/register
    // redirigir a la página de origen o home
    const from = location.state?.from || '/';
    return <Navigate to={from} replace />;
  }

  return children;
};

export default ProtectedRoute;