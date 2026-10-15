import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './Button';

const NAV_LINKS = [
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/#faq', label: 'FAQ' },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`header${scrolled ? ' header--scrolled' : ''}`}>
      <div className="container">
        <div className="header__inner">
          <Link to="/" className="wordmark" aria-label="RoastMySite home">
            RoastMySite
          </Link>

          <nav className="header__nav" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="header__actions">
            <a
              href="#waitlist"
              className="btn btn--primary"
              style={{ minWidth: 140 }}
            >
              Request a review
            </a>
            <button
              type="button"
              className="header__toggle"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="header__toggle-bars" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-nav" id="mobile-nav">
          <div className="container">
            <nav aria-label="Mobile">
              <ul>
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mobile-nav__cta">
              <Button variant="primary" block onClick={() => { window.location.href = '#waitlist'; }}>
                Request a review
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}