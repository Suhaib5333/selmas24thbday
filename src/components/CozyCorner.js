import React from 'react';
import { motion } from 'framer-motion';
import SectionTitle from './SectionTitle';

const COZY_ITEMS = [
  { emoji: '🧸', label: 'Teddy', rotate: '-5deg' },
  { emoji: '🧶', label: 'Crochet', rotate: '3deg' },
  { emoji: '🐰', label: 'Bunny', rotate: '-3deg' },
  { emoji: '🧵', label: 'Threads', rotate: '5deg' },
  { emoji: '🎀', label: 'Ribbon', rotate: '-4deg' },
  { emoji: '🪆', label: 'Dolls', rotate: '6deg' },
  { emoji: '🍵', label: 'Warm Tea', rotate: '-2deg' },
  { emoji: '🕯️', label: 'Candles', rotate: '4deg' },
  { emoji: '🧁', label: 'Cupcake', rotate: '-6deg' },
  { emoji: '🪄', label: 'Magic', rotate: '3deg' },
];

function CozyCorner({ onCollectGem }) {
  return (
    <section className="cozy-section" id="cozy">
      <SectionTitle
        ornament="🧸"
        title="The Cozy Corner"
        subtitle="Soft things for the softest soul"
      />

      <div className="cozy-items">
        {COZY_ITEMS.map((item, index) => (
          <motion.div
            key={index}
            className="cozy-item"
            style={{ '--rotate': item.rotate }}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              delay: index * 0.08,
              type: 'spring',
              damping: 12,
              stiffness: 200,
            }}
            whileHover={{ scale: 1.2, rotate: parseInt(item.rotate) }}
            whileTap={{ scale: 0.8 }}
            drag
            dragConstraints={{ left: -20, right: 20, top: -20, bottom: 20 }}
            dragElastic={0.3}
          >
            <span className="cozy-emoji">{item.emoji}</span>
            <span className="cozy-label">{item.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Hidden gem */}
      <motion.span
        className="hidden-gem"
        style={{ top: '20%', right: '5%' }}
        whileHover={{ scale: 1.5 }}
        onClick={(e) => {
          e.currentTarget.classList.add('gem-collected');
          onCollectGem('cozy-gem');
        }}
      >
        🧸
      </motion.span>
    </section>
  );
}

export default CozyCorner;
