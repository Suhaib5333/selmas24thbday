import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { id: 'gallery', label: 'Gallery', icon: '🏛️' },
  { id: 'mermaid', label: 'Lagoon', icon: '🧜‍♀️' },
  { id: 'fairy', label: 'Garden', icon: '🧚' },
  { id: 'treasure', label: 'Treasure', icon: '💎' },
  { id: 'library', label: 'Library', icon: '📚' },
  { id: 'cozy', label: 'Cozy', icon: '🧸' },
  { id: 'letter', label: 'Letter', icon: '💌' },
];

function Navbar({ activeSection, gemsCollected, totalGems }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileOpen(false);
    }
  };

  return (
    <motion.nav
      className={`museum-nav ${scrolled ? 'nav-scrolled' : ''}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
    >
      <div className="nav-inner">
        {/* Logo / Title */}
        <div className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="nav-logo-icon">✨</span>
          <span className="nav-logo-text">Selma's Museum</span>
        </div>

        {/* Desktop Nav Links */}
        <div className={`nav-links ${mobileOpen ? 'nav-links-open' : ''}`}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`nav-link ${activeSection === item.id ? 'nav-link-active' : ''}`}
              onClick={() => scrollTo(item.id)}
            >
              <span className="nav-link-icon">{item.icon}</span>
              <span className="nav-link-label">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Gem Counter */}
        <div className="nav-gems">
          <span className="nav-gem-icon">💎</span>
          <span className="nav-gem-count">{gemsCollected}/{totalGems}</span>
        </div>

        {/* Mobile Hamburger */}
        <button
          className={`nav-hamburger ${mobileOpen ? 'nav-hamburger-open' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </motion.nav>
  );
}

export default Navbar;
