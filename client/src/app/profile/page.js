'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import api from '@/lib/api';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, updateUser } = useAuth();

  // Profile fields state
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    zipCode: '',
    country: 'France',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password fields state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Sync state with user context
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login?redirect=/profile');
      } else {
        setProfileData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phone: user.phone || '',
          street: user.address?.street || '',
          city: user.address?.city || '',
          zipCode: user.address?.zipCode || '',
          country: user.address?.country || 'France',
        });
      }
    }
  }, [user, authLoading, router]);

  // Load orders
  useEffect(() => {
    async function loadOrders() {
      if (!user) return;
      try {
        const response = await api.getMyOrders();
        if (response.success) {
          setOrders(response.orders || []);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setOrdersLoading(false);
      }
    }
    loadOrders();
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');
    setProfileLoading(true);

    try {
      const payload = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        address: {
          street: profileData.street,
          city: profileData.city,
          zipCode: profileData.zipCode,
          country: profileData.country,
        },
      };

      const response = await api.updateProfile(payload);
      if (response.success) {
        updateUser(response.user);
        setProfileSuccess('Profil mis à jour avec succès.');
        setTimeout(() => setProfileSuccess(''), 4000);
      } else {
        setProfileError(response.message || 'Erreur lors de la mise à jour.');
      }
    } catch (err) {
      console.error(err);
      setProfileError('Une erreur est survenue.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas.');
      return;
    }

    setPasswordLoading(true);

    try {
      const response = await api.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.success) {
        setPasswordSuccess('Mot de passe mis à jour avec succès.');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setPasswordSuccess(''), 4000);
      } else {
        setPasswordError(response.message || 'Erreur lors de la mise à jour.');
      }
    } catch (err) {
      console.error(err);
      setPasswordError('Une erreur est survenue.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return <Badge variant="success">Livré</Badge>;
      case 'shipped':
        return <Badge variant="primary">Expédié</Badge>;
      case 'processing':
        return <Badge variant="warning">En préparation</Badge>;
      case 'cancelled':
        return <Badge variant="error">Annulé</Badge>;
      default:
        return <Badge variant="accent">En attente</Badge>;
    }
  };

  if (authLoading || !user) {
    return (
      <div className="section" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="spinner spinner-lg" />
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <span className="section-label">Espace Client</span>
          <h1 style={{ marginTop: 'var(--space-2)' }}>Mon Compte</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Gérez vos informations de livraison et accédez à vos commandes.</p>
        </div>

        {/* Profile Grid */}
        <div className="profile-layout" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'var(--space-8)', alignItems: 'flex-start' }}>
          
          {/* Left Column: Profile Info & Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* Info form */}
            <Card style={{ padding: 'var(--space-6)' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '700', marginBottom: 'var(--space-4)' }}>Coordonnées de Livraison</h3>
              
              <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                  <Input
                    label="Prénom"
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    required
                    style={{ flex: 1, marginBottom: 0 }}
                  />
                  <Input
                    label="Nom"
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    required
                    style={{ flex: 1, marginBottom: 0 }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                  <Input
                    label="Email (non modifiable)"
                    id="email"
                    type="email"
                    value={profileData.email}
                    disabled
                    style={{ flex: 1, marginBottom: 0 }}
                  />
                  <Input
                    label="Téléphone"
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    placeholder="0612345678"
                    style={{ flex: 1, marginBottom: 0 }}
                  />
                </div>

                <Input
                  label="Rue / Adresse"
                  id="street"
                  value={profileData.street}
                  onChange={(e) => setProfileData({ ...profileData, street: e.target.value })}
                  placeholder="12 Ruelle des Câbles"
                  style={{ marginBottom: 0 }}
                />

                <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                  <Input
                    label="Code Postal"
                    id="zipCode"
                    value={profileData.zipCode}
                    onChange={(e) => setProfileData({ ...profileData, zipCode: e.target.value })}
                    placeholder="75001"
                    style={{ flex: 1, marginBottom: 0 }}
                  />
                  <Input
                    label="Ville"
                    id="city"
                    value={profileData.city}
                    onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                    placeholder="Paris"
                    style={{ flex: 1, marginBottom: 0 }}
                  />
                </div>

                <Input
                  label="Pays"
                  id="country"
                  value={profileData.country}
                  onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                  style={{ marginBottom: 0 }}
                />

                {profileSuccess && <p style={{ color: 'var(--success)', fontSize: 'var(--text-xs)', margin: 0 }}>{profileSuccess}</p>}
                {profileError && <p style={{ color: 'var(--error)', fontSize: 'var(--text-xs)', margin: 0 }}>{profileError}</p>}

                <Button type="submit" variant="primary" loading={profileLoading} style={{ alignSelf: 'flex-start' }}>
                  Enregistrer les modifications
                </Button>
              </form>
            </Card>

            {/* Password form */}
            <Card style={{ padding: 'var(--space-6)' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '700', marginBottom: 'var(--space-4)' }}>Sécurité du Compte</h3>
              
              <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <Input
                  label="Mot de passe actuel"
                  id="currentPassword"
                  type="password"
                  placeholder="••••••••••••"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  required
                  style={{ marginBottom: 0 }}
                />

                <Input
                  label="Nouveau mot de passe"
                  id="newPassword"
                  type="password"
                  placeholder="Min. 6 caractères"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                  style={{ marginBottom: 0 }}
                />

                <Input
                  label="Confirmer le nouveau mot de passe"
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••••••"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                  style={{ marginBottom: 0 }}
                />

                {passwordSuccess && <p style={{ color: 'var(--success)', fontSize: 'var(--text-xs)', margin: 0 }}>{passwordSuccess}</p>}
                {passwordError && <p style={{ color: 'var(--error)', fontSize: 'var(--text-xs)', margin: 0 }}>{passwordError}</p>}

                <Button type="submit" variant="secondary" loading={passwordLoading} style={{ alignSelf: 'flex-start' }}>
                  Modifier le mot de passe
                </Button>
              </form>
            </Card>
          </div>

          {/* Right Column: Order History */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <Card style={{ padding: 'var(--space-6)' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '700', marginBottom: 'var(--space-4)' }}>Historique des Commandes</h3>
              
              {ordersLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-8)' }}>
                  <div className="spinner" />
                </div>
              ) : orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>Aucune commande effectuée pour le moment.</p>
                  <Button variant="primary" size="sm" href="/products">
                    Visiter la boutique
                  </Button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {orders.map((ord) => (
                    <div
                      key={ord._id}
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-default)',
                        borderRadius: 'var(--radius-md)',
                        padding: 'var(--space-4)',
                        fontSize: 'var(--text-sm)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                        <span style={{ fontWeight: '600' }}>#{ord._id.substring(18)}</span>
                        {getStatusBadge(ord.status)}
                      </div>
                      
                      <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)', display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                        <span>Le {new Date(ord.createdAt).toLocaleDateString('fr-FR')}</span>
                        <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{formatPrice(ord.total)}</span>
                      </div>

                      {/* Items Mini List */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-2)' }}>
                        {ord.items.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                            <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '80%' }}>
                              {item.name} <strong style={{ color: 'var(--text-primary)' }}>x{item.quantity}</strong>
                            </span>
                            <span>{formatPrice(item.price)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 900px) {
          .profile-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
