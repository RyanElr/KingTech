import ProductCard from './ProductCard';

export default function ProductGrid({ products, loading }) {
  if (loading) {
    return (
      <div className="product-grid stagger-children" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
        {[...Array(6)].map((_, index) => (
          <div key={index} className="skeleton" style={{ height: '400px', borderRadius: 'var(--radius-xl)' }} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🔌</div>
        <h3>Aucun produit trouvé</h3>
        <p>Essayez de modifier vos filtres ou effectuez une autre recherche.</p>
      </div>
    );
  }

  return (
    <div className="product-grid stagger-children" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
      {products.map((product) => (
        <div key={product._id} className="animate-fade-in-up">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
