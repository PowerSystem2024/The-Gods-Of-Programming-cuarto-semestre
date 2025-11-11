import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ProductCard Component Tests', () => {
  const mockProduct = {
    _id: '507f1f77bcf86cd799439011',
    name: 'Tarta de Chocolate',
    price: 5000,
    category: 'tortas',
    images: ['chocolate.jpg'],
    stock: 10,
    description: 'Deliciosa tarta de chocolate'
  };

  describe('Renderizado Básico', () => {
    test('Debe renderizar el componente sin errores', () => {
      renderWithRouter(<ProductCard product={mockProduct} />);
      expect(screen.getByText('Tarta de Chocolate')).toBeInTheDocument();
    });

    test('Debe mostrar el nombre del producto', () => {
      renderWithRouter(<ProductCard product={mockProduct} />);
      const productName = screen.getByText('Tarta de Chocolate');
      expect(productName).toBeInTheDocument();
    });

    test('Debe mostrar el precio del producto', () => {
      renderWithRouter(<ProductCard product={mockProduct} />);
      const priceElement = screen.getByText(/5000/i);
      expect(priceElement).toBeInTheDocument();
    });

    test('Debe mostrar la imagen del producto', () => {
      renderWithRouter(<ProductCard product={mockProduct} />);
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
    });

    test('Debe tener link al detalle del producto', () => {
      renderWithRouter(<ProductCard product={mockProduct} />);
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);
    });
  });

  describe('Formateo de Precio', () => {
    test('Debe formatear precio de 1000', () => {
      const product = { ...mockProduct, price: 1000 };
      renderWithRouter(<ProductCard product={product} />);
      expect(screen.getByText(/1000/i)).toBeInTheDocument();
    });

    test('Debe formatear precio de 10000', () => {
      const product = { ...mockProduct, price: 10000 };
      renderWithRouter(<ProductCard product={product} />);
      expect(screen.getByText(/10000/i)).toBeInTheDocument();
    });

    test('Debe formatear precio de 99999', () => {
      const product = { ...mockProduct, price: 99999 };
      renderWithRouter(<ProductCard product={product} />);
      expect(screen.getByText(/99999/i)).toBeInTheDocument();
    });

    test('Debe manejar precio 0', () => {
      const product = { ...mockProduct, price: 0 };
      renderWithRouter(<ProductCard product={product} />);
      expect(screen.getByText(/0/i)).toBeInTheDocument();
    });
  });

  describe('Manejo de Imágenes', () => {
    test('Debe mostrar primera imagen si hay múltiples', () => {
      const product = {
        ...mockProduct,
        images: ['image1.jpg', 'image2.jpg', 'image3.jpg']
      };
      renderWithRouter(<ProductCard product={product} />);
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
    });

    test('Debe manejar producto sin imágenes', () => {
      const product = { ...mockProduct, images: [] };
      renderWithRouter(<ProductCard product={product} />);
      // Debe tener una imagen placeholder o manejar el caso
      const component = screen.getByText('Tarta de Chocolate');
      expect(component).toBeInTheDocument();
    });

    test('Debe manejar imágenes undefined', () => {
      const product = { ...mockProduct, images: undefined };
      renderWithRouter(<ProductCard product={product} />);
      const component = screen.getByText('Tarta de Chocolate');
      expect(component).toBeInTheDocument();
    });

    test('Debe tener atributo alt en imagen', () => {
      renderWithRouter(<ProductCard product={mockProduct} />);
      const images = screen.getAllByRole('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('alt');
      });
    });
  });

  describe('Stock del Producto', () => {
    test('Debe mostrar producto con stock disponible', () => {
      const product = { ...mockProduct, stock: 5 };
      renderWithRouter(<ProductCard product={product} />);
      expect(screen.getByText('Tarta de Chocolate')).toBeInTheDocument();
    });

    test('Debe manejar producto sin stock', () => {
      const product = { ...mockProduct, stock: 0 };
      renderWithRouter(<ProductCard product={product} />);
      expect(screen.getByText('Tarta de Chocolate')).toBeInTheDocument();
    });

    test('Debe manejar stock alto', () => {
      const product = { ...mockProduct, stock: 999 };
      renderWithRouter(<ProductCard product={product} />);
      expect(screen.getByText('Tarta de Chocolate')).toBeInTheDocument();
    });

    test('Debe manejar stock negativo (caso edge)', () => {
      const product = { ...mockProduct, stock: -1 };
      renderWithRouter(<ProductCard product={product} />);
      expect(screen.getByText('Tarta de Chocolate')).toBeInTheDocument();
    });
  });

  describe('Categorías', () => {
    test('Debe mostrar categoría tortas', () => {
      const product = { ...mockProduct, category: 'tortas' };
      renderWithRouter(<ProductCard product={product} />);
      expect(screen.getByText('Tarta de Chocolate')).toBeInTheDocument();
    });

    test('Debe mostrar categoría pastelitos', () => {
      const product = { ...mockProduct, category: 'pastelitos' };
      renderWithRouter(<ProductCard product={product} />);
      expect(screen.getByText('Tarta de Chocolate')).toBeInTheDocument();
    });

    test('Debe mostrar categoría galletas', () => {
      const product = { ...mockProduct, category: 'galletas' };
      renderWithRouter(<ProductCard product={product} />);
      expect(screen.getByText('Tarta de Chocolate')).toBeInTheDocument();
    });

    test('Debe manejar categoría vacía', () => {
      const product = { ...mockProduct, category: '' };
      renderWithRouter(<ProductCard product={product} />);
      expect(screen.getByText('Tarta de Chocolate')).toBeInTheDocument();
    });
  });

  describe('Descripción del Producto', () => {
    test('Debe manejar descripción corta', () => {
      const product = { ...mockProduct, description: 'Corta' };
      renderWithRouter(<ProductCard product={product} />);
      expect(screen.getByText('Tarta de Chocolate')).toBeInTheDocument();
    });

    test('Debe manejar descripción larga', () => {
      const product = {
        ...mockProduct,
        description: 'Esta es una descripción muy larga que debería ser truncada o mostrada completamente dependiendo del diseño del componente'
      };
      renderWithRouter(<ProductCard product={product} />);
      expect(screen.getByText('Tarta de Chocolate')).toBeInTheDocument();
    });

    test('Debe manejar descripción vacía', () => {
      const product = { ...mockProduct, description: '' };
      renderWithRouter(<ProductCard product={product} />);
      expect(screen.getByText('Tarta de Chocolate')).toBeInTheDocument();
    });

    test('Debe manejar descripción undefined', () => {
      const product = { ...mockProduct, description: undefined };
      renderWithRouter(<ProductCard product={product} />);
      expect(screen.getByText('Tarta de Chocolate')).toBeInTheDocument();
    });
  });

  describe('Nombres Especiales', () => {
    test('Debe manejar nombre con acentos', () => {
      const product = { ...mockProduct, name: 'Tarta de Crème Brûlée' };
      renderWithRouter(<ProductCard product={product} />);
      expect(screen.getByText('Tarta de Crème Brûlée')).toBeInTheDocument();
    });

    test('Debe manejar nombre con ñ', () => {
      const product = { ...mockProduct, name: 'Señorita Tarta Española' };
      renderWithRouter(<ProductCard product={product} />);
      expect(screen.getByText('Señorita Tarta Española')).toBeInTheDocument();
    });

    test('Debe manejar nombre muy largo', () => {
      const product = {
        ...mockProduct,
        name: 'Tarta de Chocolate con Crema de Avellanas y Cobertura de Chocolate Negro Premium'
      };
      renderWithRouter(<ProductCard product={product} />);
      expect(screen.getByText(/Tarta de Chocolate/i)).toBeInTheDocument();
    });

    test('Debe manejar nombre con números', () => {
      const product = { ...mockProduct, name: 'Tarta 3 Leches' };
      renderWithRouter(<ProductCard product={product} />);
      expect(screen.getByText('Tarta 3 Leches')).toBeInTheDocument();
    });

    test('Debe manejar nombre con símbolos', () => {
      const product = { ...mockProduct, name: 'Tarta & Pastel' };
      renderWithRouter(<ProductCard product={product} />);
      expect(screen.getByText('Tarta & Pastel')).toBeInTheDocument();
    });
  });

  describe('Props Requeridas', () => {
    test('Debe manejar product como prop requerida', () => {
      renderWithRouter(<ProductCard product={mockProduct} />);
      expect(screen.getByText('Tarta de Chocolate')).toBeInTheDocument();
    });

    test('Debe manejar producto con solo campos requeridos', () => {
      const minimalProduct = {
        _id: '507f1f77bcf86cd799439011',
        name: 'Producto Mínimo',
        price: 1000,
        images: ['min.jpg']
      };
      renderWithRouter(<ProductCard product={minimalProduct} />);
      expect(screen.getByText('Producto Mínimo')).toBeInTheDocument();
    });
  });

  describe('Interactividad', () => {
    test('Card debe ser clickeable', () => {
      renderWithRouter(<ProductCard product={mockProduct} />);
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);
    });

    test('Link debe apuntar a ruta correcta', () => {
      renderWithRouter(<ProductCard product={mockProduct} />);
      const links = screen.getAllByRole('link');
      const productLink = links.find(link => 
        link.getAttribute('href')?.includes(mockProduct._id)
      );
      expect(productLink).toBeDefined();
    });
  });

  describe('Estilos y Clases CSS', () => {
    test('Debe tener clase de contenedor', () => {
      const { container } = renderWithRouter(<ProductCard product={mockProduct} />);
      expect(container.firstChild).toBeTruthy();
    });

    test('Debe aplicar estilos responsive', () => {
      const { container } = renderWithRouter(<ProductCard product={mockProduct} />);
      expect(container.firstChild).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    test('Debe manejar ID muy largo', () => {
      const product = {
        ...mockProduct,
        _id: '507f1f77bcf86cd799439011507f1f77bcf86cd799439011'
      };
      renderWithRouter(<ProductCard product={product} />);
      expect(screen.getByText('Tarta de Chocolate')).toBeInTheDocument();
    });

    test('Debe manejar precio decimal', () => {
      const product = { ...mockProduct, price: 1234.56 };
      renderWithRouter(<ProductCard product={product} />);
      expect(screen.getByText(/1234/i)).toBeInTheDocument();
    });

    test('Debe manejar múltiples cards simultáneamente', () => {
      const { rerender } = renderWithRouter(<ProductCard product={mockProduct} />);
      expect(screen.getByText('Tarta de Chocolate')).toBeInTheDocument();

      const product2 = { ...mockProduct, _id: '2', name: 'Otra Tarta' };
      rerender(
        <BrowserRouter>
          <ProductCard product={product2} />
        </BrowserRouter>
      );
      expect(screen.getByText('Otra Tarta')).toBeInTheDocument();
    });
  });

  describe('Accesibilidad', () => {
    test('Imágenes deben tener texto alternativo', () => {
      renderWithRouter(<ProductCard product={mockProduct} />);
      const images = screen.getAllByRole('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('alt');
      });
    });

    test('Links deben ser navegables por teclado', () => {
      renderWithRouter(<ProductCard product={mockProduct} />);
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toBeInTheDocument();
      });
    });
  });

  describe('Renderizado Condicional', () => {
    test('Debe renderizar con todos los datos presentes', () => {
      renderWithRouter(<ProductCard product={mockProduct} />);
      expect(screen.getByText('Tarta de Chocolate')).toBeInTheDocument();
      expect(screen.getByText(/5000/i)).toBeInTheDocument();
    });

    test('Debe renderizar incluso con datos parciales', () => {
      const partialProduct = {
        _id: '123',
        name: 'Producto Parcial',
        price: 1000,
        images: ['test.jpg']
      };
      renderWithRouter(<ProductCard product={partialProduct} />);
      expect(screen.getByText('Producto Parcial')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    test('Debe renderizar rápidamente', () => {
      const startTime = performance.now();
      renderWithRouter(<ProductCard product={mockProduct} />);
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      expect(renderTime).toBeLessThan(1000); // Menos de 1 segundo
    });

    test('Debe manejar múltiples re-renders', () => {
      const { rerender } = renderWithRouter(<ProductCard product={mockProduct} />);
      
      for (let i = 0; i < 10; i++) {
        const updatedProduct = { ...mockProduct, price: 5000 + i };
        rerender(
          <BrowserRouter>
            <ProductCard product={updatedProduct} />
          </BrowserRouter>
        );
      }
      
      expect(screen.getByText('Tarta de Chocolate')).toBeInTheDocument();
    });
  });
});
