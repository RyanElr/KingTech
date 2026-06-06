'use client';

import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';

export default function ProductFilters({ filters, onChange }) {
  const categories = [
    { value: '', label: 'Toutes les catégories' },
    { value: 'usb-c', label: 'USB-C' },
    { value: 'lightning', label: 'Lightning' },
    { value: 'hdmi', label: 'HDMI' },
    { value: 'ethernet', label: 'Ethernet' },
    { value: 'audio', label: 'Audio' },
    { value: 'charging', label: 'Alimentation / Charge' },
  ];

  const sortOptions = [
    { value: '-createdAt', label: 'Nouveautés' },
    { value: 'price', label: 'Prix : croissant' },
    { value: '-price', label: 'Prix : décroissant' },
    { value: '-rating', label: 'Meilleures notes' },
  ];

  const handleSearchChange = (e) => {
    onChange({ search: e.target.value });
  };

  const handleCategoryChange = (category) => {
    onChange({ category });
  };

  const handleSortChange = (e) => {
    onChange({ sort: e.target.value });
  };

  const handlePriceChange = (field, value) => {
    onChange({ [field]: value });
  };

  const clearFilters = () => {
    onChange({
      search: '',
      category: '',
      sort: '-createdAt',
      minPrice: '',
      maxPrice: '',
    });
  };

  return (
    <Card className="filters-card" style={{ padding: 'var(--space-6)', height: 'fit-content' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '700', margin: 0 }}>Filtres</h3>
          <button
            onClick={clearFilters}
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--primary)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '500',
            }}
          >
            Réinitialiser
          </button>
        </div>

        {/* Search */}
        <div>
          <Input
            label="Recherche"
            id="search"
            placeholder="Rechercher un câble..."
            value={filters.search || ''}
            onChange={handleSearchChange}
            style={{ margin: 0 }}
          />
        </div>

        {/* Category List */}
        <div>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
            Catégories
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategoryChange(cat.value)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-2) var(--space-3)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'left',
                  fontSize: 'var(--text-sm)',
                  backgroundColor: filters.category === cat.value ? 'rgba(0, 212, 255, 0.1)' : 'transparent',
                  border: '1px solid',
                  borderColor: filters.category === cat.value ? 'var(--primary)' : 'transparent',
                  color: filters.category === cat.value ? 'var(--primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <span>{cat.label}</span>
                {filters.category === cat.value && <span>●</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div>
          <label htmlFor="sort" style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
            Trier par
          </label>
          <select
            id="sort"
            value={filters.sort || '-createdAt'}
            onChange={handleSortChange}
            className="input-field"
            style={{
              width: '100%',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-3) var(--space-4)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
            }}
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
            Tranche de prix (€)
          </label>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={(e) => handlePriceChange('minPrice', e.target.value)}
              className="input-field"
              style={{ flex: 1, padding: 'var(--space-2) var(--space-3)', fontSize: 'var(--text-sm)' }}
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
              className="input-field"
              style={{ flex: 1, padding: 'var(--space-2) var(--space-3)', fontSize: 'var(--text-sm)' }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
