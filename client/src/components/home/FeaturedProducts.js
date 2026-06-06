'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import ProductCard from '@/components/products/ProductCard';
import Button from '@/components/ui/Button';

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const data = await api.getFeaturedProducts();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  return (
    <section className="section bg-grid" style={{ position: 'relative' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-10)' }}>
          <div>
            <span className="section-label">Sélection</span>
            <h2 style={{ marginTop: 'var(--space-2)' }}>Produits Vedettes</h2>
          </div>
          <Button variant="secondary" href="/products">
            Voir tout le catalogue
          </Button>
        </div>

        {/* Loading / Cards */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '420px', borderRadius: 'var(--radius-xl)' }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <h3>Aucun produit vedette</h3>
            <p>Revenez plus tard pour découvrir notre sélection.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
