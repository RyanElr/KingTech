'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, user, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectUrl = searchParams.get('redirect') || '/';

  // If already logged in, redirect immediately
  useEffect(() => {
    if (!authLoading && user) {
      router.push(redirectUrl);
    }
  }, [user, authLoading, router, redirectUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validations
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setLoading(true);

    try {
      const result = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        router.push(redirectUrl);
      } else {
        setError(result.message || "Erreur lors de l'inscription.");
      }
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '450px' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <Card style={{ width: '100%', maxWidth: '500px', padding: 'var(--space-8)' }} className="animate-scale-in">
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
        <span style={{ fontSize: '2.5rem' }}>⚡</span>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: '800', marginTop: 'var(--space-2)' }}>Rejoindre KingTech</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>Créez votre compte client premium en quelques secondes.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
          <Input
            label="Prénom"
            id="firstName"
            name="firstName"
            placeholder="Jean"
            value={formData.firstName}
            onChange={handleChange}
            required
            style={{ flex: 1, marginBottom: 0 }}
          />
          <Input
            label="Nom"
            id="lastName"
            name="lastName"
            placeholder="Dupont"
            value={formData.lastName}
            onChange={handleChange}
            required
            style={{ flex: 1, marginBottom: 0 }}
          />
        </div>

        <Input
          label="Adresse Email"
          id="email"
          name="email"
          type="email"
          placeholder="jean.dupont@exemple.com"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <Input
          label="Mot de Passe"
          id="password"
          name="password"
          type="password"
          placeholder="Min. 6 caractères"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <Input
          label="Confirmer le Mot de Passe"
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="••••••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        {error && (
          <p style={{ color: 'var(--error)', fontSize: 'var(--text-xs)', margin: 0, textAlign: 'center' }}>
            {error}
          </p>
        )}

        <Button type="submit" variant="primary" loading={loading} style={{ width: '100%', marginTop: 'var(--space-2)' }}>
          Créer mon compte
        </Button>
      </form>

      <div style={{ marginTop: 'var(--space-6)', textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
        Déjà inscrit ?{' '}
        <Link href={`/login${redirectUrl !== '/' ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`} style={{ color: 'var(--primary)', fontWeight: '600' }}>
          Se connecter
        </Link>
      </div>
    </Card>
  );
}

export default function RegisterPage() {
  return (
    <div className="section bg-gradient-mesh" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
        <Suspense fallback={
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '450px' }}>
            <div className="spinner" />
          </div>
        }>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
