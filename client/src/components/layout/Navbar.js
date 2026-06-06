'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileOpen]);

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.navContainer}`}>
        {/* Logo */}
        <Link href="/" className={styles.logo} onClick={() => setMobileOpen(false)}>
          <span className={styles.logoIcon}>⚡</span>
          <span className={styles.logoText}>King<span className={styles.logoAccent}>Tech</span></span>
        </Link>

        {/* Desktop Nav */}
        <div className={styles.navLinks}>
          <Link href="/products" className={styles.navLink}>Produits</Link>
          <Link href="/products?category=usb-c" className={styles.navLink}>USB-C</Link>
          <Link href="/products?category=hdmi" className={styles.navLink}>HDMI</Link>
          <Link href="/products?category=ethernet" className={styles.navLink}>Ethernet</Link>
          <Link href="/products?category=audio" className={styles.navLink}>Audio</Link>
        </div>

        {/* Right Actions */}
        <div className={styles.navActions}>
          {/* Cart */}
          <Link href="/cart" className={styles.cartBtn}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {cart.itemCount > 0 && (
              <span className={styles.cartBadge}>{cart.itemCount}</span>
            )}
          </Link>

          {/* User */}
          {user ? (
            <div className={styles.userMenu}>
              <button
                className={styles.userBtn}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <span className={styles.avatar}>
                  {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                </span>
              </button>
              {userMenuOpen && (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownHeader}>
                    <p className={styles.dropdownName}>{user.firstName} {user.lastName}</p>
                    <p className={styles.dropdownEmail}>{user.email}</p>
                  </div>
                  <div className={styles.dropdownDivider} />
                  <Link href="/profile" className={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}>
                    👤 Mon Profil
                  </Link>
                  <Link href="/profile" className={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}>
                    📦 Mes Commandes
                  </Link>
                  <div className={styles.dropdownDivider} />
                  <button className={styles.dropdownItem} onClick={handleLogout} style={{ color: 'var(--error)' }}>
                    🚪 Déconnexion
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="btn btn-primary btn-sm">
              Connexion
            </Link>
          )}

          {/* Mobile Toggle */}
          <button
            className={`${styles.mobileToggle} ${mobileOpen ? styles.active : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          <Link href="/products" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>
            Tous les Produits
          </Link>
          <Link href="/products?category=usb-c" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>
            USB-C
          </Link>
          <Link href="/products?category=hdmi" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>
            HDMI
          </Link>
          <Link href="/products?category=ethernet" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>
            Ethernet
          </Link>
          <Link href="/products?category=audio" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>
            Audio
          </Link>
          <Link href="/products?category=lightning" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>
            Lightning
          </Link>
          <Link href="/products?category=charging" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>
            Charge
          </Link>
        </div>
      )}
    </nav>
  );
}
