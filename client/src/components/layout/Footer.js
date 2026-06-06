import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerInner}`}>
        {/* Brand */}
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoIcon}>⚡</span>
            <span>King<span className={styles.logoAccent}>Tech</span></span>
          </Link>
          <p className={styles.brandDesc}>
            Des câbles et accessoires tech de qualité professionnelle.
            Performance, durabilité et design premium.
          </p>
          <div className={styles.socials}>
            <a href="#" aria-label="Instagram" className={styles.socialLink}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="#" aria-label="Twitter" className={styles.socialLink}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
            <a href="#" aria-label="YouTube" className={styles.socialLink}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
            </a>
          </div>
        </div>

        {/* Links */}
        <div className={styles.linksGroup}>
          <h4 className={styles.linksTitle}>Produits</h4>
          <Link href="/products?category=usb-c" className={styles.link}>USB-C</Link>
          <Link href="/products?category=hdmi" className={styles.link}>HDMI</Link>
          <Link href="/products?category=lightning" className={styles.link}>Lightning</Link>
          <Link href="/products?category=ethernet" className={styles.link}>Ethernet</Link>
          <Link href="/products?category=audio" className={styles.link}>Audio</Link>
          <Link href="/products?category=charging" className={styles.link}>Charge</Link>
        </div>

        <div className={styles.linksGroup}>
          <h4 className={styles.linksTitle}>Support</h4>
          <a href="#" className={styles.link}>Centre d&apos;aide</a>
          <a href="#" className={styles.link}>Suivi de commande</a>
          <a href="#" className={styles.link}>Retours & échanges</a>
          <a href="#" className={styles.link}>Garantie</a>
          <a href="#" className={styles.link}>Contact</a>
        </div>

        <div className={styles.linksGroup}>
          <h4 className={styles.linksTitle}>Entreprise</h4>
          <a href="#" className={styles.link}>À propos</a>
          <a href="#" className={styles.link}>Blog</a>
          <a href="#" className={styles.link}>Mentions légales</a>
          <a href="#" className={styles.link}>Politique de confidentialité</a>
          <a href="#" className={styles.link}>CGV</a>
        </div>
      </div>

      {/* Bottom */}
      <div className={styles.bottom}>
        <div className="container">
          <div className={styles.bottomInner}>
            <p className={styles.copyright}>
              © {new Date().getFullYear()} KingTech. Tous droits réservés.
            </p>
            <div className={styles.payments}>
              <span className={styles.paymentIcon}>💳</span>
              <span className={styles.paymentText}>Visa • Mastercard • PayPal • Apple Pay</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
