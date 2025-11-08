import '../styles/product.css';

const SearchFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  filters, 
  onFilterChange, 
  onSearch 
}) => {
  return (
    <div className="search-filters-section">
      <form onSubmit={onSearch} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            Buscar
          </button>
        </div>
      </form>

      <div className="filters">
        <select 
          value={filters.category}
          onChange={(e) => onFilterChange('category', e.target.value)}
          className="filter-select"
        >
          <option value="">Todas las categorías</option>
          <option value="Electrónicos">Electrónicos</option>
          <option value="Ropa">Ropa</option>
          <option value="Hogar">Hogar</option>
          <option value="Deportes">Deportes</option>
          <option value="Libros">Libros</option>
          <option value="Juguetes">Juguetes</option>
        </select>

        <select
          value={filters.sort}
          onChange={(e) => onFilterChange('sort', e.target.value)}
          className="filter-select"
        >
          <option value="-createdAt">Más recientes</option>
          <option value="price">Precio: menor a mayor</option>
          <option value="-price">Precio: mayor a menor</option>
          <option value="name">Nombre A-Z</option>
          <option value="-name">Nombre Z-A</option>
          <option value="-rating">Mejor valorados</option>
        </select>

        <div className="price-filters">
          <input
            type="number"
            placeholder="Precio mín"
            value={filters.minPrice}
            onChange={(e) => onFilterChange('minPrice', e.target.value)}
            className="price-input"
            min="0"
          />
          <input
            type="number"
            placeholder="Precio máx"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange('maxPrice', e.target.value)}
            className="price-input"
            min="0"
          />
        </div>
      </div>
    </div>
  );
};

// PropTypes removed for simplicity

export default SearchFilters;