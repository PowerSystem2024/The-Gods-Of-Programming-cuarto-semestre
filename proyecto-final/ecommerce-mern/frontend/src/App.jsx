import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthCallback from './pages/AuthCallback';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import MyProducts from './pages/MyProducts';
import ProductForm from './pages/ProductForm';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';


function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="App">
            <Routes>
            {/* Rutas públicas con layout */}
            <Route path="/" element={
              <Layout>
                <Home />
              </Layout>
            } />
            
            <Route path="/about" element={
              <Layout>
                <About />
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

            <Route path="/forgot-password" element={
              <ProtectedRoute requireAuth={false}>
                <ForgotPassword />
              </ProtectedRoute>
            } />

            <Route path="/reset-password/:token" element={
              <ProtectedRoute requireAuth={false}>
                <ResetPassword />
              </ProtectedRoute>
            } />

            {/* Callback de autenticación OAuth */}
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Rutas protegidas (requieren autenticación) */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/cart" element={
              <ProtectedRoute>
                <Layout>
                  <Cart />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/checkout" element={
              <ProtectedRoute>
                <Layout>
                  <Checkout />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/order-confirmation" element={
              <ProtectedRoute>
                <Layout>
                  <OrderConfirmation />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Página de productos */}
            <Route path="/products" element={
              <Layout>
                <Products />
              </Layout>
            } />

            {/* Rutas de vendedor (protegidas) */}
            <Route path="/seller/products" element={
              <ProtectedRoute>
                <Layout>
                  <MyProducts />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/seller/products/new" element={
              <ProtectedRoute>
                <Layout>
                  <ProductForm />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/seller/products/edit/:id" element={
              <ProtectedRoute>
                <Layout>
                  <ProductForm />
                </Layout>
              </ProtectedRoute>
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
                    <Link to="/">Volver al inicio</Link>
                  </div>
                </div>
              </Layout>
            } />
            </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
