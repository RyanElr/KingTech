'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import ProductFilters from '@/components/products/ProductFilters';
import ProductGrid from '@/components/products/ProductGrid';

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initialize filters from URL search params
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    sort: searchParams.get('sort') || '-createdAt',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load products based on filters
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        // Build query params object, filter out empty fields
        const params = {};
        Object.entries(filters).forEach(([key, val]) => {
          if (val !== '') params[key] = val;
        });

        const data = await api.getProducts(params);
        if (data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();

    // Update URL search parameters to keep filters bookmarkable
    const urlParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== '') urlParams.set(key, val);
    });
    const queryString = urlParams.toString();
    router.replace(`/products${queryString ? `?${queryString}` : ''}`, { scroll: false });
  }, [filters, router]);

  // Sync category state if URL parameter changes directly (e.g., clicking category links in Navbar)
  const categoryParam = searchParams.get('category') || '';
  useEffect(() => {
    setFilters((prev) => {
      if (prev.category !== categoryParam) {
        return { ...prev, category: categoryParam };
      }
      return prev;
    });
  }, [categoryParam]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="section" style={{ minHeight: '90vh' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 'var(--space-10)' }}>
          <span className="section-label">Catalogue</span>
          <h1 style={{ marginTop: 'var(--space-2)' }}>Tous nos câbles tech</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Filtrez et triez pour trouver le câble parfait.</p>
        </div>

        {/* Layout: Sidebar + Grid */}
        <div className="products-layout" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 'var(--space-8)', alignItems: 'flex-start' }}>
          <aside className="products-sidebar">
            <ProductFilters filters={filters} onChange={handleFilterChange} />
          </aside>

          <main className="products-main">
            <ProductGrid products={products} loading={loading} />
          </main>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 900px) {
          .products-layout {
            grid-template-columns: 1fr !important;
          }
          .products-sidebar {
            margin-bottom: var(--space-6);
          }
        }
      `}</style>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="section" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <div className="spinner spinner-lg" />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
