'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

export default function ProductDetailPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const slug = params.slug;

  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const fetchProductDetails = async () => {
    try {
      const data = await api.getProductBySlug(slug);
      if (data.success) {
        setProduct(data.product);
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error('Error fetching product detail:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [slug]);

  if (loading) {
    return (
      <div className="section" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="spinner spinner-lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: 'var(--space-20) 0', textAlign: 'center' }}>
        <h2>Produit introuvable</h2>
        <p>Le produit recherché n'existe pas ou a été retiré.</p>
        <Button variant="primary" href="/products" style={{ marginTop: 'var(--space-4)' }}>
          Retourner au catalogue
        </Button>
      </div>
    );
  }

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const handleAddToCart = async () => {
    setAdding(true);
    await addToCart(product._id, quantity);
    setAdding(false);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      setReviewError('Le commentaire ne peut pas être vide.');
      return;
    }
    setSubmittingReview(true);
    setReviewError('');
    try {
      // We can use a direct call to the review API, but since api.js doesn't have it defined,
      // let's make a direct request or use our api.request wrapper.
      const response = await api.request(`/products/${product._id}/reviews`, {
        method: 'POST',
        body: JSON.stringify({ rating: newRating, comment: newComment }),
      });

      if (response.success) {
        setNewComment('');
        setNewRating(5);
        // Refresh product and reviews
        fetchProductDetails();
      } else {
        setReviewError(response.message || 'Erreur lors de la soumission de l\'avis.');
      }
    } catch (error) {
      console.error(error);
      setReviewError('Une erreur est survenue.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const isSale = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercentage = isSale
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const renderStars = (score) => {
    const stars = [];
    const fullStars = Math.floor(score || 0);
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<span key={i} style={{ color: '#fbbf24' }}>★</span>);
      } else {
        stars.push(<span key={i} style={{ color: 'var(--text-muted)' }}>★</span>);
      }
    }
    return stars;
  };

  const imagesList = product.images && product.images.length > 0 ? product.images : ['/images/placeholder.jpg'];

  return (
    <div className="section">
      <div className="container">
        {/* Back Link */}
        <Link href="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: 'var(--space-8)', fontSize: 'var(--text-sm)' }}>
          ← Retourner au catalogue
        </Link>

        {/* Product Layout */}
        <div className="detail-layout" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'var(--space-12)', marginBottom: 'var(--space-16)' }}>
          {/* Left: Gallery */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {/* Active Image */}
            <div style={{ position: 'relative', width: '100%', paddingBottom: '80%', overflow: 'hidden', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-default)' }}>
              <img
                src={imagesList[selectedImage]}
                alt={product.name}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {isSale && (
                <Badge variant="sale" style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 10 }}>
                  -{discountPercentage}%
                </Badge>
              )}
            </div>

            {/* Thumbnail Selection */}
            {imagesList.length > 1 && (
              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                {imagesList.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    style={{
                      width: '80px',
                      height: '80px',
                      border: idx === selectedImage ? '2px solid var(--primary)' : '1px solid var(--border-default)',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      background: 'var(--bg-secondary)',
                      padding: 0
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <div>
              <Badge variant="primary" style={{ textTransform: 'uppercase', marginBottom: 'var(--space-3)' }}>
                {product.category}
              </Badge>
              <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: '800', lineHeight: '1.2', margin: '0 0 var(--space-2) 0' }}>
                {product.name}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div className="stars" style={{ fontSize: 'var(--text-base)' }}>{renderStars(product.rating)}</div>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                  {product.rating ? product.rating.toFixed(1) : '0.0'} ({product.reviewCount || 0} avis)
                </span>
              </div>
            </div>

            {/* Pricing Card */}
            <Card style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div className="price" style={{ gap: 'var(--space-3)' }}>
                <span className="price-current" style={{ fontSize: 'var(--text-3xl)' }}>{formatPrice(product.price)}</span>
                {isSale && (
                  <span className="price-compare" style={{ fontSize: 'var(--text-lg)' }}>{formatPrice(product.compareAtPrice)}</span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: product.stock > 0 ? 'var(--success)' : 'var(--error)'
                }} />
                <span style={{ fontSize: 'var(--text-sm)', color: product.stock > 0 ? 'var(--success)' : 'var(--error)' }}>
                  {product.stock > 0 ? `En stock (plus que ${product.stock} disponibles)` : 'Rupture de stock'}
                </span>
              </div>

              {product.stock > 0 && (
                <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
                  {/* Quantity Selector */}
                  <div className="quantity-selector">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                    <span>{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
                  </div>

                  <Button
                    variant="primary"
                    onClick={handleAddToCart}
                    loading={adding}
                    style={{ flexGrow: 1 }}
                  >
                    Ajouter au Panier
                  </Button>
                </div>
              )}
            </Card>

            {/* Description */}
            <div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '700', marginBottom: 'var(--space-2)' }}>Description</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: '1.6' }}>
                {product.description}
              </p>
            </div>

            {/* Specs Table */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '700', marginBottom: 'var(--space-3)' }}>Spécifications Techniques</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                  <tbody>
                    {Object.entries(product.specifications).map(([key, val]) => (
                      <tr key={key} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: 'var(--space-2) 0', color: 'var(--text-secondary)', textTransform: 'capitalize', fontWeight: '500', width: '40%' }}>
                          {key.replace(/([A-Z])/g, ' $1')}
                        </td>
                        <td style={{ padding: 'var(--space-2) 0', color: 'var(--text-primary)', fontWeight: '600' }}>
                          {val}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section: Reviews */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-12)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'var(--space-12)' }}>
            {/* Left: Reviews List */}
            <div>
              <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-6)' }}>Avis clients ({reviews.length})</h2>
              {reviews.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Aucun avis pour ce produit. Soyez le premier à donner votre avis !</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {reviews.map((rev) => (
                    <Card key={rev._id} style={{ padding: 'var(--space-4)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
                        <div>
                          <strong style={{ display: 'block', fontSize: 'var(--text-sm)' }}>
                            {rev.userId?.firstName} {rev.userId?.lastName?.charAt(0)}.
                          </strong>
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                            {new Date(rev.createdAt).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <div className="stars">{renderStars(rev.rating)}</div>
                      </div>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>
                        {rev.comment}
                      </p>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Review Form */}
            <div>
              <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-6)' }}>Écrire un avis</h2>
              {user ? (
                <Card style={{ padding: 'var(--space-6)' }}>
                  <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: '500', marginBottom: '8px' }}>
                        Note
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {[1, 2, 3, 4, 5].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setNewRating(val)}
                            style={{
                              fontSize: '24px',
                              color: val <= newRating ? '#fbbf24' : 'var(--text-muted)',
                              cursor: 'pointer',
                              background: 'transparent',
                              border: 'none',
                              padding: 0
                            }}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="comment" style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: '500', marginBottom: '8px' }}>
                        Commentaire
                      </label>
                      <textarea
                        id="comment"
                        rows="4"
                        placeholder="Qu'avez-vous pensé de la qualité et des performances de ce câble ?"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="input-field"
                        style={{ width: '100%', resize: 'vertical' }}
                        required
                      />
                    </div>

                    {reviewError && (
                      <p style={{ color: 'var(--error)', fontSize: 'var(--text-xs)', margin: 0 }}>
                        {reviewError}
                      </p>
                    )}

                    <Button type="submit" variant="primary" loading={submittingReview}>
                      Soumettre l'avis
                    </Button>
                  </form>
                </Card>
              ) : (
                <Card style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
                    Vous devez être connecté pour laisser un avis.
                  </p>
                  <Button variant="secondary" href="/login">
                    Se Connecter
                  </Button>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 900px) {
          .detail-layout {
            grid-template-columns: 1fr !important;
            gap: var(--space-6) !important;
          }
        }
      `}</style>
    </div>
  );
}
