import React, { useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import SectionTitle from './SectionTitle';

const CARDS = [
  {
    icon: '🧜‍♀️',
    title: 'Ocean Soul',
    text: 'She carries the depth of the ocean in her spirit — mysterious, beautiful, and endlessly captivating.',
  },
  {
    icon: '🐚',
    title: 'Pearl Heart',
    text: 'Like a pearl formed with patience, her kindness is rare and luminous, born from layers of grace.',
  },
  {
    icon: '🌊',
    title: 'Tidal Strength',
    text: 'Her resilience flows like the tide — gentle yet powerful, always returning, never giving up.',
  },
];

function MermaidLagoon({ onCollectGem }) {
  const bubbles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      size: `${6 + Math.random() * 20}px`,
      left: `${Math.random() * 100}%`,
      bottom: `${Math.random() * -20}%`,
      duration: `${6 + Math.random() * 10}s`,
      delay: `${Math.random() * 8}s`,
    })), []);

  const waves = useMemo(() =>
    Array.from({ length: 4 }, (_, i) => ({
      id: i,
      top: `${20 + i * 20}%`,
      duration: `${8 + i * 3}s`,
    })), []);

  const handleMouseMove = useCallback((e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  }, []);

  return (
    <section className="mermaid-section" id="mermaid">
      <div className="mermaid-bg">
        {waves.map((w) => (
          <div
            key={w.id}
            className="wave"
            style={{ top: w.top, '--wave-duration': w.duration }}
          />
        ))}
        {bubbles.map((b) => (
          <div
            key={b.id}
            className="bubble"
            style={{
              '--size': b.size,
              left: b.left,
              bottom: b.bottom,
              '--duration': b.duration,
              '--delay': b.delay,
            }}
          />
        ))}
      </div>

      <div className="mermaid-content">
        <SectionTitle
          ornament="🧜‍♀️"
          title="The Mermaid Lagoon"
          subtitle="Where the ocean whispers her name"
        />

        <div className="mermaid-cards">
          {CARDS.map((card, index) => (
            <motion.div
              key={index}
              className="mermaid-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.7 }}
              whileHover={{ y: -5 }}
              onMouseMove={handleMouseMove}
            >
              <div className="mermaid-card-icon">{card.icon}</div>
              <h3 className="mermaid-card-title">{card.title}</h3>
              <p className="mermaid-card-text">{card.text}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Hidden gem */}
      <motion.span
        className="hidden-gem"
        style={{ top: '15%', left: '5%' }}
        whileHover={{ scale: 1.5 }}
        onClick={(e) => {
          e.currentTarget.classList.add('gem-collected');
          onCollectGem('mermaid-gem');
        }}
      >
        🦪
      </motion.span>
    </section>
  );
}

export default MermaidLagoon;
