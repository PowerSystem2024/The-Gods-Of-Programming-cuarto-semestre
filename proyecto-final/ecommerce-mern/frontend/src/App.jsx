import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Routes>
          {/* Rutas públicas con layout */}
          <Route path="/" element={
            <Layout>
              <Home />
            </Layout>
          } />
          
          <Route path="/product/:id" element={
            <Layout>
              <ProductDetail />
            </Layout>
          } />

          {/* Rutas de autenticación (sin layout) */}
          <Route path="/login" element={
            <ProtectedRoute requireAuth={false}>
              <Login />
            </ProtectedRoute>
          } />
          
          <Route path="/register" element={
            <ProtectedRoute requireAuth={false}>
              <Register />
            </ProtectedRoute>
          } />

          {/* Rutas protegidas (requieren autenticación) */}
          <Route path="/cart" element={
            <ProtectedRoute>
              <Layout>
                <Cart />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Página de productos */}
          <Route path="/products" element={
            <Layout>
              <Products />
            </Layout>
          } />

          <Route path="/categories" element={
            <Layout>
              <div className="container">
                <h1>Categorías</h1>
                <p>Página en construcción...</p>
              </div>
            </Layout>
          } />

          <Route path="/offers" element={
            <Layout>
              <div className="container">
                <h1>Ofertas Especiales</h1>
                <p>Página en construcción...</p>
              </div>
            </Layout>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout>
                <div className="container">
                  <h1>Mi Perfil</h1>
                  <p>Página en construcción...</p>
                </div>
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/orders" element={
            <ProtectedRoute>
              <Layout>
                <div className="container">
                  <h1>Mis Pedidos</h1>
                  <p>Página en construcción...</p>
                </div>
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/wishlist" element={
            <ProtectedRoute>
              <Layout>
                <div className="container">
                  <h1>Lista de Deseos</h1>
                  <p>Página en construcción...</p>
                </div>
              </Layout>
            </ProtectedRoute>
          } />

          {/* Páginas de información */}
          <Route path="/contact" element={
            <Layout>
              <div className="container">
                <h1>Contacto</h1>
                <p>Página en construcción...</p>
              </div>
            </Layout>
          } />

          <Route path="/help" element={
            <Layout>
              <div className="container">
                <h1>Centro de Ayuda</h1>
                <p>Página en construcción...</p>
              </div>
            </Layout>
          } />

          <Route path="/shipping" element={
            <Layout>
              <div className="container">
                <h1>Información de Envíos</h1>
                <p>Página en construcción...</p>
              </div>
            </Layout>
          } />

          <Route path="/returns" element={
            <Layout>
              <div className="container">
                <h1>Política de Devoluciones</h1>
                <p>Página en construcción...</p>
              </div>
            </Layout>
          } />

          <Route path="/terms" element={
            <Layout>
              <div className="container">
                <h1>Términos y Condiciones</h1>
                <p>Página en construcción...</p>
              </div>
            </Layout>
          } />

          <Route path="/privacy" element={
            <Layout>
              <div className="container">
                <h1>Política de Privacidad</h1>
                <p>Página en construcción...</p>
              </div>
            </Layout>
          } />

          <Route path="/about" element={
            <Layout>
              <div className="container">
                <h1>Acerca de Nosotros</h1>
                <p>Página en construcción...</p>
              </div>
            </Layout>
          } />

          {/* Página 404 */}
          <Route path="*" element={
            <Layout>
              <div className="container">
                <div className="not-found">
                  <h1>404</h1>
                  <h2>Página no encontrada</h2>
                  <p>Lo sentimos, la página que buscas no existe.</p>
                  <a href="/">Volver al inicio</a>
                </div>
              </div>
            </Layout>
          } />
        </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
