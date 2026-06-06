import Button from '@/components/ui/Button';

export default function Hero() {
  return (
    <section className="section bg-gradient-mesh bg-grid" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', padding: 'var(--space-20) 0' }}>
      {/* Glow Effects */}
      <div style={{ position: 'absolute', top: '10%', left: '15%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(0, 212, 255, 0.15) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 1, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '15%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%)', filter: 'blur(50px)', zIndex: 1, pointerEvents: 'none' }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', alignItems: 'center' }}>
          {/* Label badge */}
          <span className="section-label animate-fade-in">Technologie de Pointe</span>

          {/* Heading */}
          <h1 className="gradient-text-glow animate-fade-in-up" style={{ fontSize: 'calc(1.8rem + 3.2vw)', fontWeight: '900', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            La Vitesse Pure.<br />Sans Compromis.
          </h1>

          {/* Description */}
          <p className="animate-fade-in-up" style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', animationDelay: '100ms' }}>
            Découvrez nos câbles premium de transfert et de charge ultra-rapide. Conçus en alliage de qualité aérospatiale pour durer toute une vie.
          </p>

          {/* CTAs */}
          <div className="animate-fade-in-up" style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-4)', animationDelay: '200ms' }}>
            <Button variant="primary" size="lg" href="/products">
              Découvrir les Produits
            </Button>
            <Button variant="secondary" size="lg" href="/products?category=usb-c">
              Gamme USB-C
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
