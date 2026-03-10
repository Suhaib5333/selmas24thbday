import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import SectionTitle from './SectionTitle';

const FAIRY_ITEMS = [
  { emoji: '🧚', label: 'Fairy Magic' },
  { emoji: '🦋', label: 'Butterflies' },
  { emoji: '🌸', label: 'Blossoms' },
  { emoji: '🍄', label: 'Mushroom Ring' },
  { emoji: '🌙', label: 'Moonlight' },
  { emoji: '🪻', label: 'Lavender' },
  { emoji: '🫧', label: 'Bubbles' },
  { emoji: '🌿', label: 'Ferns' },
];

function FairyGarden({ onCollectGem }) {
  const fireflies = useMemo(() =>
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      size: `${3 + Math.random() * 5}px`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: `${4 + Math.random() * 6}s`,
      delay: `${Math.random() * 5}s`,
      tx: `${-30 + Math.random() * 60}px`,
      ty: `${-30 + Math.random() * 60}px`,
      tx2: `${-30 + Math.random() * 60}px`,
      ty2: `${-30 + Math.random() * 60}px`,
      tx3: `${-30 + Math.random() * 60}px`,
      ty3: `${-30 + Math.random() * 60}px`,
    })), []);

  return (
    <section className="fairy-section" id="fairy">
      <div className="fairy-bg">
        {fireflies.map((f) => (
          <div
            key={f.id}
            className="firefly"
            style={{
              '--size': f.size,
              left: f.left,
              top: f.top,
              '--duration': f.duration,
              '--delay': f.delay,
              '--tx': f.tx, '--ty': f.ty,
              '--tx2': f.tx2, '--ty2': f.ty2,
              '--tx3': f.tx3, '--ty3': f.ty3,
            }}
          />
        ))}
      </div>

      <div className="fairy-content">
        <SectionTitle
          ornament="🧚"
          title="The Fairy Garden"
          subtitle="A whimsical world where magic blooms"
        />

        <div className="fairy-grid">
          {FAIRY_ITEMS.map((item, index) => (
            <motion.div
              key={index}
              className="fairy-item"
              style={{ '--rotate': `${-5 + Math.random() * 10}deg` }}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.1,
                duration: 0.6,
                type: 'spring',
                damping: 15,
              }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9, rotate: 15 }}
            >
              <span className="fairy-item-emoji">{item.emoji}</span>
              <span className="fairy-item-label">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Hidden gem */}
      <motion.span
        className="hidden-gem"
        style={{ bottom: '10%', right: '8%' }}
        whileHover={{ scale: 1.5 }}
        onClick={(e) => {
          e.currentTarget.classList.add('gem-collected');
          onCollectGem('fairy-gem');
        }}
      >
        🧿
      </motion.span>
    </section>
  );
}

export default FairyGarden;
