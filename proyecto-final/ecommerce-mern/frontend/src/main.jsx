// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// ✨ Importar todos los estilos globales
import './styles/colors.css';
import './styles/global.css';
import './styles/layout.css';
import './styles/filters.css';
import './styles/product-new.css';
import './styles/cart.css';
import './styles/home.css';
import './styles/auth.css';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // Strict Mode desactivado temporalmente para evitar doble montaje en desarrollo
  // <StrictMode>
    <App />
  // </StrictMode>,
)
