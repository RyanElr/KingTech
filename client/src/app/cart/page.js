'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import api from '@/lib/api';

export default function CartPage() {
  const router = useRouter();
  const { cart, updateQuantity, removeItem, clearCart, fetchCart } = useCart();
  const { user, loading: authLoading } = useAuth();

  const [address, setAddress] = useState({
    street: '',
    city: '',
    zipCode: '',
    country: 'France',
  });
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);

  // Pre-fill address from user profile if available
  useEffect(() => {
    if (user && user.address) {
      setAddress({
        street: user.address.street || '',
        city: user.address.city || '',
        zipCode: user.address.zipCode || '',
        country: user.address.country || 'France',
      });
    }
  }, [user]);

  // Keep cart synced
  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  const handleQtyChange = async (productId, newQty, currentQty) => {
    if (newQty < 1) return;
    await updateQuantity(productId, newQty);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setCheckoutError('');
    setCheckoutLoading(true);

    try {
      const response = await api.createOrder(address);
      if (response.success) {
        setPlacedOrder(response.order);
        // Clear local cart
        await clearCart();
      } else {
        setCheckoutError(response.message || 'Erreur lors de la création de la commande.');
      }
    } catch (err) {
      console.error(err);
      setCheckoutError('Une erreur inattendue est survenue.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  if (authLoading) {
    return (
      <div className="section" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="spinner spinner-lg" />
      </div>
    );
  }

  // If order was successfully placed, show premium confirmation screen
  if (placedOrder) {
    return (
      <div className="section bg-gradient-mesh" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
          <Card style={{ width: '100%', maxWidth: '600px', padding: 'var(--space-10)', textAlign: 'center', border: '1px solid var(--success)' }} className="animate-scale-in">
            <span style={{ fontSize: '4rem', display: 'block', marginBottom: 'var(--space-4)', animation: 'float 3s ease-in-out infinite' }}>📦</span>
            <span className="badge badge-success" style={{ marginBottom: 'var(--space-4)' }}>Commande Confirmée !</span>
            
            <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: '800', marginBottom: 'var(--space-2)' }}>Merci pour votre achat !</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
              Votre commande <strong>#{placedOrder._id?.substring(18)}</strong> a bien été enregistrée et est en cours de préparation.
            </p>

            {/* Receipt Summary */}
            <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', textAlign: 'left', marginBottom: 'var(--space-6)', fontSize: 'var(--text-sm)', border: '1px solid var(--border-default)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Adresse de livraison :</span>
                <span style={{ fontWeight: '500' }}>{placedOrder.shippingAddress.street}, {placedOrder.shippingAddress.zipCode} {placedOrder.shippingAddress.city}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Livraison :</span>
                <span style={{ fontWeight: '500' }}>{placedOrder.shipping === 0 ? 'Offerte' : formatPrice(placedOrder.shipping)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--border-subtle)', fontSize: 'var(--text-base)', fontWeight: '700' }}>
                <span>Total payé :</span>
                <span className="gradient-text">{formatPrice(placedOrder.total)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }}>
              <Button variant="primary" href="/profile">
                Suivre mes commandes
              </Button>
              <Button variant="secondary" href="/products">
                Continuer mes achats
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Not logged in state
  if (!user) {
    return (
      <div className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="empty-state">
            <div className="empty-state-icon">🔒</div>
            <h2>Votre panier requiert une connexion</h2>
            <p>Veuillez vous connecter pour voir votre panier ou ajouter des câbles premium.</p>
            <Button variant="primary" href="/login?redirect=/cart" style={{ marginTop: 'var(--space-4)' }}>
              Se connecter maintenant
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="empty-state animate-fade-in">
            <div className="empty-state-icon">🛒</div>
            <h2>Votre panier est vide</h2>
            <p>Découvrez notre gamme de câbles de transfert haute vitesse et de chargeurs GaN.</p>
            <Button variant="primary" href="/products" style={{ marginTop: 'var(--space-4)' }}>
              Parcourir le catalogue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: '800', marginBottom: 'var(--space-8)' }}>Votre Panier</h1>

        {/* Grid layout: Cart Items + Checkout Form */}
        <div className="cart-layout" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 'var(--space-8)', alignItems: 'flex-start' }}>
          
          {/* Left: Cart Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {cart.items.map((item) => {
              if (!item.product) return null;
              const { _id, name, price, images, slug, stock } = item.product;
              const imgUrl = images && images.length > 0 ? images[0] : '/images/placeholder.jpg';

              return (
                <Card key={_id} style={{ padding: 'var(--space-4)', display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                  {/* Thumbnail */}
                  <div style={{ width: '80px', height: '80px', position: 'relative', overflow: 'hidden', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', flexShrink: 0 }}>
                    <img src={imgUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>

                  {/* Product Details */}
                  <div style={{ flexGrow: 1, minWidth: 0 }}>
                    <Link href={`/products/${slug}`} style={{ fontWeight: '600', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {name}
                    </Link>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                      Prix : {formatPrice(price)}
                    </span>
                  </div>

                  {/* Quantity Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    <div className="quantity-selector" style={{ transform: 'scale(0.9)' }}>
                      <button onClick={() => handleQtyChange(_id, item.quantity - 1, item.quantity)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleQtyChange(_id, Math.min(stock, item.quantity + 1), item.quantity)}>+</button>
                    </div>

                    {/* Subtotal & Delete */}
                    <div style={{ textAlign: 'right', minWidth: '80px' }}>
                      <p style={{ fontWeight: '700', fontSize: 'var(--text-sm)', margin: 0 }}>
                        {formatPrice(price * item.quantity)}
                      </p>
                      <button
                        onClick={() => removeItem(_id)}
                        style={{ fontSize: 'var(--text-xs)', color: 'var(--error)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px 0' }}
                      >
                        Retirer
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}

            {/* Cart Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-2)' }}>
              <Button variant="ghost" size="sm" href="/products">
                ← Continuer mes achats
              </Button>
              <button
                onClick={clearCart}
                style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Vider le panier
              </button>
            </div>
          </div>

          {/* Right: Order Checkout Form & Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            
            {/* Summary */}
            <Card style={{ padding: 'var(--space-6)' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '700', marginBottom: 'var(--space-4)' }}>Récapitulatif</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Sous-total</span>
                  <span style={{ fontWeight: '500' }}>{formatPrice(cart.subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Livraison</span>
                  <span style={{ fontWeight: '500' }}>
                    {cart.subtotal >= 50 ? (
                      <span style={{ color: 'var(--success)' }}>Gratuite</span>
                    ) : (
                      formatPrice(4.99)
                    )}
                  </span>
                </div>
                {cart.subtotal < 50 && (
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: 0 }}>
                    💡 Plus que <strong>{formatPrice(50 - cart.subtotal)}</strong> pour économiser la livraison !
                  </p>
                )}
                <div style={{ height: '1px', background: 'var(--border-subtle)', margin: 'var(--space-1) 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-base)', fontWeight: '700' }}>
                  <span>Total</span>
                  <span className="gradient-text">{formatPrice(cart.subtotal >= 50 ? cart.subtotal : cart.subtotal + 4.99)}</span>
                </div>
              </div>
            </Card>

            {/* Shipping Info Form */}
            <Card style={{ padding: 'var(--space-6)' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '700', marginBottom: 'var(--space-4)' }}>Adresse de Livraison</h3>
              
              <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <Input
                  label="Rue / Adresse"
                  id="street"
                  placeholder="12 Ruelle des Câbles"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  required
                  style={{ marginBottom: 0 }}
                />

                <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                  <Input
                    label="Code Postal"
                    id="zipCode"
                    placeholder="75001"
                    value={address.zipCode}
                    onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                    required
                    style={{ flex: 1, marginBottom: 0 }}
                  />
                  <Input
                    label="Ville"
                    id="city"
                    placeholder="Paris"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    required
                    style={{ flex: 1, marginBottom: 0 }}
                  />
                </div>

                <Input
                  label="Pays"
                  id="country"
                  placeholder="France"
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                  required
                  style={{ marginBottom: 0 }}
                />

                {checkoutError && (
                  <p style={{ color: 'var(--error)', fontSize: 'var(--text-xs)', margin: 0, textAlign: 'center' }}>
                    {checkoutError}
                  </p>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  loading={checkoutLoading}
                  style={{ width: '100%', marginTop: 'var(--space-2)' }}
                >
                  Valider & Payer la Commande
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 900px) {
          .cart-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
