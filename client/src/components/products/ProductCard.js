'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

  const {
    _id,
    name,
    slug,
    price,
    compareAtPrice,
    category,
    images,
    rating,
    reviewCount,
    stock,
  } = product;

  // Formatting currency
  const formatPrice = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const handleAdd = async (e) => {
    e.preventDefault(); // Prevent navigating to product details page
    setAdding(true);
    await addToCart(_id, 1);
    setAdding(false);
  };

  const isSale = compareAtPrice && compareAtPrice > price;
  const discountPercentage = isSale
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  // Helper to render stars
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalf = (rating || 0) % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<span key={i}>★</span>);
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(<span key={i}>★</span>); // Can use simple symbols or custom style
      } else {
        stars.push(<span key={i} className="star-empty">★</span>);
      }
    }
    return stars;
  };

  // Image source fallback
  const imgUrl = images && images.length > 0 ? images[0] : '/images/placeholder.jpg';

  return (
    <Card className="product-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', padding: 0 }}>
      <Link href={`/products/${slug}`} className="product-link" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        {/* Product Image Wrapper */}
        <div className="product-image-container" style={{ position: 'relative', width: '100%', paddingBottom: '100%', overflow: 'hidden', background: 'var(--bg-secondary)' }}>
          {isSale && (
            <Badge variant="sale" style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10 }}>
              -{discountPercentage}%
            </Badge>
          )}
          {stock === 0 && (
            <Badge variant="error" style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10 }}>
              Rupture
            </Badge>
          )}
          {!isSale && stock > 0 && category && (
            <Badge variant="primary" style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10, textTransform: 'uppercase' }}>
              {category}
            </Badge>
          )}
          
          <img
            src={imgUrl}
            alt={name}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform var(--transition-slow)',
            }}
            className="product-img"
          />
        </div>

        {/* Product Details */}
        <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 'var(--space-2)' }}>
          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: '600', color: 'var(--text-primary)', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '2.8em', margin: 0 }}>
            {name}
          </h3>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <div className="stars">{renderStars()}</div>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>({reviewCount || 0})</span>
          </div>

          {/* Price and Stock */}
          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="price">
              <span className="price-current">{formatPrice(price)}</span>
              {isSale && <span className="price-compare">{formatPrice(compareAtPrice)}</span>}
            </div>
          </div>
        </div>
      </Link>

      {/* Footer / Action */}
      <div style={{ padding: '0 var(--space-4) var(--space-4) var(--space-4)' }}>
        <Button
          variant="primary"
          onClick={handleAdd}
          loading={adding}
          disabled={stock === 0}
          style={{ width: '100%' }}
        >
          {stock === 0 ? 'En Rupture' : 'Ajouter au Panier'}
        </Button>
      </div>

      <style jsx global>{`
        .product-card {
          border: 1px solid var(--border-default);
        }
        .product-card:hover .product-img {
          transform: scale(1.05);
        }
      `}</style>
    </Card>
  );
}
