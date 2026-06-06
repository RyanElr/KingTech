'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStatus({
        type: 'success',
        message: 'Félicitations ! Vous êtes inscrit aux offres exclusives KingTech.',
      });
      setEmail('');
    }, 1200);
  };

  return (
    <section className="section bg-gradient-mesh" style={{ position: 'relative' }}>
      <div className="container">
        <Card style={{ padding: 'var(--space-12) var(--space-8)', maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          {/* Subtle glow border */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, var(--primary), var(--accent), transparent)' }} />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: '600px', margin: '0 auto', alignItems: 'center' }}>
            <span className="section-label">Club Exclusif</span>
            <h2>Ne ratez aucune nouveauté</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
              Inscrivez-vous à notre newsletter pour recevoir des réductions exclusives sur nos lancements de câbles haut de gamme.
            </p>

            <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', justifyContent: 'center' }}>
              <div style={{ flexGrow: 1, minWidth: '260px' }}>
                <Input
                  type="email"
                  placeholder="Votre adresse email de confiance..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ marginBottom: 0 }}
                />
              </div>
              <Button type="submit" variant="primary" loading={loading}>
                S'abonner
              </Button>
            </form>

            {status.message && (
              <p style={{
                fontSize: 'var(--text-xs)',
                color: status.type === 'success' ? 'var(--success)' : 'var(--error)',
                marginTop: 'var(--space-2)'
              }}>
                {status.message}
              </p>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
}
