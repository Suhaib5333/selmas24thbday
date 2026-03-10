import React from 'react';
import { motion } from 'framer-motion';
import SectionTitle from './SectionTitle';

const GEMS = [
  { emoji: '💎', name: 'Diamond', meaning: 'Unbreakable spirit, clarity of heart, and eternal brilliance' },
  { emoji: '🔮', name: 'Amethyst', meaning: 'Wisdom beyond her years, intuition that guides the way' },
  { emoji: '💚', name: 'Emerald', meaning: 'Growth, renewal, and the lush garden of her dreams' },
  { emoji: '🩷', name: 'Rose Quartz', meaning: 'Unconditional love that she gives so freely to the world' },
  { emoji: '💛', name: 'Citrine', meaning: 'Joy and sunshine that radiates from her beautiful smile' },
  { emoji: '🩵', name: 'Aquamarine', meaning: 'Courage of the sea, calm in the storm, depth of soul' },
  { emoji: '🪩', name: 'Pearl', meaning: 'Elegance born from patience, grace under pressure' },
  { emoji: '✨', name: 'Opal', meaning: 'A universe of colors within — never just one thing, always extraordinary' },
];

function TreasureRoom({ onCollectGem }) {
  return (
    <section className="treasure-section" id="treasure">
      <SectionTitle
        ornament="👑"
        title="The Treasure Room"
        subtitle="Gemstones that mirror her soul"
      />

      <div className="treasure-showcase">
        {GEMS.map((gem, index) => (
          <motion.div
            key={index}
            className="gem-card"
            initial={{ opacity: 0, rotateY: -90 }}
            whileInView={{ opacity: 1, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.8 }}
          >
            <div className="gem-card-inner">
              <div className="gem-card-front">
                <span className="gem-emoji">{gem.emoji}</span>
                <span className="gem-name">{gem.name}</span>
              </div>
              <div className="gem-card-back">
                <p className="gem-meaning">{gem.meaning}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Hidden gem */}
      <motion.span
        className="hidden-gem"
        style={{ top: '20%', left: '3%' }}
        whileHover={{ scale: 1.5 }}
        onClick={(e) => {
          e.currentTarget.classList.add('gem-collected');
          onCollectGem('treasure-gem');
        }}
      >
        👑
      </motion.span>
    </section>
  );
}

export default TreasureRoom;
