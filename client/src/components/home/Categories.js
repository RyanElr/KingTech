import Link from 'next/link';
import Card from '@/components/ui/Card';

export default function Categories() {
  const list = [
    {
      slug: 'usb-c',
      name: 'Gamme USB-C',
      description: 'Transfert ultra-rapide 40 Gbps & charge 240W.',
      icon: '⚡',
      accentColor: 'var(--primary)',
    },
    {
      slug: 'lightning',
      name: 'Pour iPhone / iPad',
      description: 'Certifiés MFi pour une sécurité et une longévité maximales.',
      icon: '📱',
      accentColor: 'var(--accent)',
    },
    {
      slug: 'hdmi',
      name: 'Vidéo Ultra HD / HDMI',
      description: 'Résolution 8K @ 60Hz et 4K @ 120Hz sans interférence.',
      icon: '🖥️',
      accentColor: '#34d399',
    },
    {
      slug: 'ethernet',
      name: 'Réseau / Ethernet',
      description: 'Cat 8 haut débit jusqu\'à 40 Gbps pour le gaming et serveurs.',
      icon: '🌐',
      accentColor: '#fb7185',
    },
    {
      slug: 'audio',
      name: 'Jack / Audio Premium',
      description: 'Placage or 24k pour une fidélité acoustique pure.',
      icon: '🎧',
      accentColor: '#fbbf24',
    },
    {
      slug: 'charging',
      name: 'Alimentation / Chargeur',
      description: 'Adaptateurs secteur GaN compacts et puissants.',
      icon: '🔌',
      accentColor: '#a78bfa',
    },
  ];

  return (
    <section className="section" style={{ background: 'var(--bg-secondary)', position: 'relative' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="section-label">Parcourir</span>
          <h2>Catégories Tech</h2>
          <p>Trouvez le câble parfaitement adapté à votre installation et à vos appareils.</p>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)', marginTop: 'var(--space-10)' }}>
          {list.map((cat, idx) => (
            <Link key={cat.slug} href={`/products?category=${cat.slug}`}>
              <Card style={{ padding: 'var(--space-8)', display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start', height: '100%' }}>
                {/* Icon wrapper */}
                <div style={{
                  fontSize: '2rem',
                  padding: 'var(--space-3)',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 0 15px ${cat.accentColor}0a`,
                  color: cat.accentColor
                }}>
                  {cat.icon}
                </div>

                {/* Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '600' }}>
                    {cat.name}
                  </h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>
                    {cat.description}
                  </p>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: '600', color: 'var(--primary)', marginTop: 'var(--space-2)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    Explorer la gamme <span>→</span>
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
