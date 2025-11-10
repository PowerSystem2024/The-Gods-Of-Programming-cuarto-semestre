import '../styles/filters.css';

const SearchFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  filters, 
  onFilterChange, 
  onSearch 
}) => {
  return (
    <div className="search-filters-section">
      <form onSubmit={onSearch} className="search-form-filters">
        <div className="search-input-group">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar tortas, cupcakes, brownies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-main"
          />
          <button 
            type="submit" 
            className="btn-search"
            style={{
              background: 'linear-gradient(135deg, #CD853F 0%, #d4a574 100%)',
              color: 'white',
              border: 'none',
              padding: '0.85rem 2.5rem',
              borderRadius: '50px',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(205, 133, 63, 0.3)',
              display: 'block'
            }}
          >
            Buscar
          </button>
        </div>
      </form>

      <div className="filters-container">
        <select 
          value={filters.category}
          onChange={(e) => onFilterChange('category', e.target.value)}
          className="filter-select"
        >
          <option value="">🎂 Todas las categorías</option>
          <option value="Tortas">🎂 Tortas</option>
          <option value="Cupcakes">🧁 Cupcakes</option>
          <option value="Brownies">🍫 Brownies</option>
          <option value="Cookies">🍪 Cookies</option>
          <option value="Macarons">🌈 Macarons</option>
          <option value="Cheesecakes">🍰 Cheesecakes</option>
          <option value="Alfajores">🥮 Alfajores</option>
          <option value="Postres">🍮 Postres</option>
          <option value="Galletas">🍪 Galletas Decoradas</option>
        </select>

        <select
          value={filters.sort}
          onChange={(e) => onFilterChange('sort', e.target.value)}
          className="filter-select"
        >
          <option value="-createdAt">⏰ Más recientes</option>
          <option value="price">💵 Precio: menor a mayor</option>
          <option value="-price">💰 Precio: mayor a menor</option>
          <option value="name">🔤 Nombre A-Z</option>
          <option value="-name">🔠 Nombre Z-A</option>
          <option value="-rating.average">⭐ Mejor valorados</option>
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
          <span className="price-separator">-</span>
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

export default SearchFilters;