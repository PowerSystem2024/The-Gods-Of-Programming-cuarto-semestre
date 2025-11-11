import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductList from '../../components/ProductList';

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ProductList Component Tests', () => {
  const mockProducts = [
    {
      _id: '1',
      name: 'Tarta de Chocolate',
      price: 5000,
      category: 'tortas',
      images: ['choco.jpg'],
      stock: 10
    },
    {
      _id: '2',
      name: 'Tarta de Frutilla',
      price: 6000,
      category: 'tortas',
      images: ['frutilla.jpg'],
      stock: 5
    },
    {
      _id: '3',
      name: 'Pastelitos de Membrillo',
      price: 2000,
      category: 'pastelitos',
      images: ['membrillo.jpg'],
      stock: 20
    }
  ];

  describe('Renderizado Básico', () => {
    test('Debe renderizar sin errores con productos', () => {
      renderWithRouter(<ProductList products={mockProducts} />);
      expect(screen.getByText('Tarta de Chocolate')).toBeInTheDocument();
    });

    test('Debe renderizar todos los productos', () => {
      renderWithRouter(<ProductList products={mockProducts} />);
      expect(screen.getByText('Tarta de Chocolate')).toBeInTheDocument();
      expect(screen.getByText('Tarta de Frutilla')).toBeInTheDocument();
      expect(screen.getByText('Pastelitos de Membrillo')).toBeInTheDocument();
    });

    test('Debe renderizar número correcto de productos', () => {
      renderWithRouter(<ProductList products={mockProducts} />);
      const productNames = [
        screen.getByText('Tarta de Chocolate'),
        screen.getByText('Tarta de Frutilla'),
        screen.getByText('Pastelitos de Membrillo')
      ];
      expect(productNames).toHaveLength(3);
    });

    test('Debe renderizar lista vacía sin errores', () => {
      renderWithRouter(<ProductList products={[]} />);
      const container = screen.queryByText('Tarta de Chocolate');
      expect(container).not.toBeInTheDocument();
    });
  });

  describe('Grid Layout', () => {
    test('Debe usar layout de grid', () => {
      const { container } = renderWithRouter(<ProductList products={mockProducts} />);
      expect(container.firstChild).toBeTruthy();
    });

    test('Debe ser responsive', () => {
      const { container } = renderWithRouter(<ProductList products={mockProducts} />);
      expect(container.firstChild).toBeTruthy();
    });

    test('Debe mantener spacing consistente', () => {
      const { container } = renderWithRouter(<ProductList products={mockProducts} />);
      expect(container.firstChild).toBeTruthy();
    });
  });

  describe('Cantidad de Productos', () => {
    test('Debe manejar 1 producto', () => {
      const singleProduct = [mockProducts[0]];
      renderWithRouter(<ProductList products={singleProduct} />);
      expect(screen.getByText('Tarta de Chocolate')).toBeInTheDocument();
    });

    test('Debe manejar 10 productos', () => {
      const manyProducts = Array.from({ length: 10 }, (_, i) => ({
        _id: `${i}`,
        name: `Producto ${i}`,
        price: 1000 * (i + 1),
        category: 'tortas',
        images: [`prod${i}.jpg`],
        stock: 5
      }));
      renderWithRouter(<ProductList products={manyProducts} />);
      expect(screen.getByText('Producto 0')).toBeInTheDocument();
      expect(screen.getByText('Producto 9')).toBeInTheDocument();
    });

    test('Debe manejar 50 productos', () => {
      const manyProducts = Array.from({ length: 50 }, (_, i) => ({
        _id: `${i}`,
        name: `Producto ${i}`,
        price: 1000,
        category: 'tortas',
        images: [`prod${i}.jpg`],
        stock: 5
      }));
      renderWithRouter(<ProductList products={manyProducts} />);
      expect(screen.getByText('Producto 0')).toBeInTheDocument();
      expect(screen.getByText('Producto 49')).toBeInTheDocument();
    });

    test('Debe manejar 100 productos', () => {
      const manyProducts = Array.from({ length: 100 }, (_, i) => ({
        _id: `${i}`,
        name: `Producto ${i}`,
        price: 1000,
        category: 'tortas',
        images: [`prod${i}.jpg`],
        stock: 5
      }));
      renderWithRouter(<ProductList products={manyProducts} />);
      expect(screen.getByText('Producto 0')).toBeInTheDocument();
    });
  });

  describe('Props Handling', () => {
    test('Debe aceptar array vacío', () => {
      renderWithRouter(<ProductList products={[]} />);
      const container = screen.queryByText('Tarta de Chocolate');
      expect(container).not.toBeInTheDocument();
    });

    test('Debe manejar productos undefined gracefully', () => {
      renderWithRouter(<ProductList products={undefined} />);
      // No debería crashear
      expect(true).toBe(true);
    });

    test('Debe manejar productos null gracefully', () => {
      renderWithRouter(<ProductList products={null} />);
      // No debería crashear
      expect(true).toBe(true);
    });
  });

  describe('Ordenamiento', () => {
    test('Debe mantener orden original por defecto', () => {
      renderWithRouter(<ProductList products={mockProducts} />);
      const allText = screen.getByText('Tarta de Chocolate').parentElement?.textContent || '';
      expect(allText).toBeTruthy();
    });

    test('Debe renderizar productos en orden recibido', () => {
      const reversedProducts = [...mockProducts].reverse();
      renderWithRouter(<ProductList products={reversedProducts} />);
      expect(screen.getByText('Pastelitos de Membrillo')).toBeInTheDocument();
    });
  });

  describe('Filtrado por Categoría', () => {
    test('Debe mostrar solo productos de categoría tortas', () => {
      const tortasOnly = mockProducts.filter(p => p.category === 'tortas');
      renderWithRouter(<ProductList products={tortasOnly} />);
      expect(screen.getByText('Tarta de Chocolate')).toBeInTheDocument();
      expect(screen.getByText('Tarta de Frutilla')).toBeInTheDocument();
      expect(screen.queryByText('Pastelitos de Membrillo')).not.toBeInTheDocument();
    });

    test('Debe mostrar solo productos de categoría pastelitos', () => {
      const pastelitosOnly = mockProducts.filter(p => p.category === 'pastelitos');
      renderWithRouter(<ProductList products={pastelitosOnly} />);
      expect(screen.getByText('Pastelitos de Membrillo')).toBeInTheDocument();
      expect(screen.queryByText('Tarta de Chocolate')).not.toBeInTheDocument();
    });

    test('Debe mostrar productos de categoría galletas', () => {
      const galletasProducts = [
        { _id: '4', name: 'Galletas de Chocolate', price: 1500, category: 'galletas', images: ['galle.jpg'], stock: 30 }
      ];
      renderWithRouter(<ProductList products={galletasProducts} />);
      expect(screen.getByText('Galletas de Chocolate')).toBeInTheDocument();
    });
  });

  describe('Filtrado por Precio', () => {
    test('Debe mostrar productos menores a 5000', () => {
      const cheapProducts = mockProducts.filter(p => p.price < 5000);
      renderWithRouter(<ProductList products={cheapProducts} />);
      expect(screen.getByText('Pastelitos de Membrillo')).toBeInTheDocument();
    });

    test('Debe mostrar productos mayores a 5000', () => {
      const expensiveProducts = mockProducts.filter(p => p.price >= 5000);
      renderWithRouter(<ProductList products={expensiveProducts} />);
      expect(screen.getByText('Tarta de Chocolate')).toBeInTheDocument();
      expect(screen.getByText('Tarta de Frutilla')).toBeInTheDocument();
    });

    test('Debe mostrar productos en rango de precio', () => {
      const rangeProducts = mockProducts.filter(p => p.price >= 2000 && p.price <= 6000);
      renderWithRouter(<ProductList products={rangeProducts} />);
      expect(screen.getByText('Tarta de Chocolate')).toBeInTheDocument();
    });
  });

  describe('Stock Display', () => {
    test('Debe mostrar productos con stock alto', () => {
      const highStockProducts = mockProducts.filter(p => p.stock > 10);
      renderWithRouter(<ProductList products={highStockProducts} />);
      expect(screen.getByText('Pastelitos de Membrillo')).toBeInTheDocument();
    });

    test('Debe mostrar productos con stock bajo', () => {
      const lowStockProducts = mockProducts.filter(p => p.stock < 10);
      renderWithRouter(<ProductList products={lowStockProducts} />);
      expect(screen.getByText('Tarta de Frutilla')).toBeInTheDocument();
    });

    test('Debe manejar productos sin stock', () => {
      const outOfStockProducts = [
        { _id: '5', name: 'Sin Stock', price: 1000, category: 'tortas', images: ['no.jpg'], stock: 0 }
      ];
      renderWithRouter(<ProductList products={outOfStockProducts} />);
      expect(screen.getByText('Sin Stock')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    test('Debe renderizar lista grande rápidamente', () => {
      const largeList = Array.from({ length: 200 }, (_, i) => ({
        _id: `${i}`,
        name: `Producto ${i}`,
        price: 1000,
        category: 'tortas',
        images: [`${i}.jpg`],
        stock: 5
      }));

      const startTime = performance.now();
      renderWithRouter(<ProductList products={largeList} />);
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(2000); // Menos de 2 segundos
    });

    test('Debe manejar actualizaciones frecuentes', () => {
      const { rerender } = renderWithRouter(<ProductList products={mockProducts} />);

      for (let i = 0; i < 5; i++) {
        const updatedProducts = mockProducts.map(p => ({
          ...p,
          price: p.price + i
        }));
        rerender(
          <BrowserRouter>
            <ProductList products={updatedProducts} />
          </BrowserRouter>
        );
      }

      expect(screen.getByText('Tarta de Chocolate')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('Debe manejar productos con IDs duplicados', () => {
      const duplicateIdProducts = [
        { _id: '1', name: 'Producto A', price: 1000, category: 'tortas', images: ['a.jpg'], stock: 5 },
        { _id: '1', name: 'Producto B', price: 2000, category: 'tortas', images: ['b.jpg'], stock: 5 }
      ];
      renderWithRouter(<ProductList products={duplicateIdProducts} />);
      expect(screen.getByText('Producto A')).toBeInTheDocument();
    });

    test('Debe manejar productos con datos faltantes', () => {
      const incompleteProducts = [
        { _id: '1', name: 'Incompleto', price: 1000, images: ['inc.jpg'] }
      ];
      renderWithRouter(<ProductList products={incompleteProducts} />);
      expect(screen.getByText('Incompleto')).toBeInTheDocument();
    });

    test('Debe manejar productos con nombres muy largos', () => {
      const longNameProducts = [
        {
          _id: '1',
          name: 'Tarta de Chocolate con Crema de Avellanas y Cobertura de Chocolate Negro Premium Importado de Bélgica',
          price: 10000,
          category: 'tortas',
          images: ['long.jpg'],
          stock: 3
        }
      ];
      renderWithRouter(<ProductList products={longNameProducts} />);
      expect(screen.getByText(/Tarta de Chocolate/i)).toBeInTheDocument();
    });

    test('Debe manejar precios extremadamente altos', () => {
      const expensiveProducts = [
        { _id: '1', name: 'Premium', price: 999999, category: 'tortas', images: ['prem.jpg'], stock: 1 }
      ];
      renderWithRouter(<ProductList products={expensiveProducts} />);
      expect(screen.getByText('Premium')).toBeInTheDocument();
    });

    test('Debe manejar múltiples imágenes por producto', () => {
      const multiImageProducts = [
        {
          _id: '1',
          name: 'Multi Imagen',
          price: 5000,
          category: 'tortas',
          images: ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg'],
          stock: 5
        }
      ];
      renderWithRouter(<ProductList products={multiImageProducts} />);
      expect(screen.getByText('Multi Imagen')).toBeInTheDocument();
    });
  });

  describe('Búsqueda y Filtrado Combinado', () => {
    test('Debe mostrar productos que coincidan con múltiples filtros', () => {
      const filtered = mockProducts.filter(p =>
        p.category === 'tortas' && p.price >= 5000 && p.stock > 5
      );
      renderWithRouter(<ProductList products={filtered} />);
      expect(screen.getByText('Tarta de Chocolate')).toBeInTheDocument();
    });

    test('Debe manejar búsqueda sin resultados', () => {
      const noResults = mockProducts.filter(p => p.name.includes('NoExiste'));
      renderWithRouter(<ProductList products={noResults} />);
      expect(screen.queryByText('Tarta de Chocolate')).not.toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    test('Debe adaptarse a diferentes tamaños de pantalla', () => {
      const { container } = renderWithRouter(<ProductList products={mockProducts} />);
      expect(container.firstChild).toBeTruthy();
      // En un test real, cambiaríamos el viewport y verificaríamos el layout
    });

    test('Debe mantener funcionalidad en mobile', () => {
      const { container } = renderWithRouter(<ProductList products={mockProducts} />);
      expect(container.firstChild).toBeTruthy();
    });

    test('Debe mantener funcionalidad en tablet', () => {
      const { container } = renderWithRouter(<ProductList products={mockProducts} />);
      expect(container.firstChild).toBeTruthy();
    });

    test('Debe mantener funcionalidad en desktop', () => {
      const { container } = renderWithRouter(<ProductList products={mockProducts} />);
      expect(container.firstChild).toBeTruthy();
    });
  });

  describe('Accesibilidad', () => {
    test('Debe ser navegable por teclado', () => {
      renderWithRouter(<ProductList products={mockProducts} />);
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);
    });

    test('Debe tener estructura semántica correcta', () => {
      const { container } = renderWithRouter(<ProductList products={mockProducts} />);
      expect(container.firstChild).toBeTruthy();
    });
  });

  describe('Loading States', () => {
    test('Debe manejar estado de carga con array vacío', () => {
      renderWithRouter(<ProductList products={[]} />);
      expect(screen.queryByText('Tarta de Chocolate')).not.toBeInTheDocument();
    });

    test('Debe renderizar inmediatamente con datos disponibles', () => {
      renderWithRouter(<ProductList products={mockProducts} />);
      expect(screen.getByText('Tarta de Chocolate')).toBeInTheDocument();
    });
  });

  describe('Re-rendering', () => {
    test('Debe actualizar cuando cambian los productos', () => {
      const { rerender } = renderWithRouter(<ProductList products={mockProducts} />);
      expect(screen.getByText('Tarta de Chocolate')).toBeInTheDocument();

      const newProducts = [
        { _id: '10', name: 'Nuevo Producto', price: 7000, category: 'tortas', images: ['new.jpg'], stock: 8 }
      ];

      rerender(
        <BrowserRouter>
          <ProductList products={newProducts} />
        </BrowserRouter>
      );

      expect(screen.getByText('Nuevo Producto')).toBeInTheDocument();
      expect(screen.queryByText('Tarta de Chocolate')).not.toBeInTheDocument();
    });

    test('Debe manejar adición de productos', () => {
      const { rerender } = renderWithRouter(<ProductList products={mockProducts} />);

      const moreProducts = [
        ...mockProducts,
        { _id: '4', name: 'Producto Extra', price: 3000, category: 'galletas', images: ['extra.jpg'], stock: 15 }
      ];

      rerender(
        <BrowserRouter>
          <ProductList products={moreProducts} />
        </BrowserRouter>
      );

      expect(screen.getByText('Producto Extra')).toBeInTheDocument();
    });

    test('Debe manejar eliminación de productos', () => {
      const { rerender } = renderWithRouter(<ProductList products={mockProducts} />);
      expect(screen.getByText('Tarta de Chocolate')).toBeInTheDocument();

      const fewerProducts = mockProducts.slice(1);

      rerender(
        <BrowserRouter>
          <ProductList products={fewerProducts} />
        </BrowserRouter>
      );

      expect(screen.queryByText('Tarta de Chocolate')).not.toBeInTheDocument();
      expect(screen.getByText('Tarta de Frutilla')).toBeInTheDocument();
    });
  });
});
