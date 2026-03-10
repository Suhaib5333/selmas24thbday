import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionTitle from './SectionTitle';

const GALLERY_ITEMS = [
  { id: 1, label: 'The Dreamer', caption: 'Exhibit I' },
  { id: 2, label: 'The Explorer', caption: 'Exhibit II' },
  { id: 3, label: 'The Enchantress', caption: 'Exhibit III' },
  { id: 4, label: 'The Scholar', caption: 'Exhibit IV' },
  { id: 5, label: 'The Mermaid', caption: 'Exhibit V' },
  { id: 6, label: 'The Fairy Queen', caption: 'Exhibit VI' },
];

// Use picsum for beautiful sample images — will be replaced with real photos
const getImage = (id) => `https://picsum.photos/seed/selma${id}/400/533`;

function Gallery({ onCollectGem }) {
  const [lightbox, setLightbox] = useState(null);

  return (
    <section className="gallery-section" id="gallery">
      <SectionTitle
        ornament="🏛️"
        title="The Grand Gallery"
        subtitle="A curated collection of moments most precious"
      />

      <div className="gallery-grid">
        {GALLERY_ITEMS.map((item, index) => (
          <motion.div
            key={item.id}
            className="gallery-frame"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: index * 0.15, duration: 0.8, ease: 'easeOut' }}
            onClick={() => setLightbox(item)}
            whileHover={{ scale: 1.03, y: -5 }}
          >
            <div className="frame-glow" />
            <div className="frame-outer">
              <div className="frame-corner tl" />
              <div className="frame-corner tr" />
              <div className="frame-corner bl" />
              <div className="frame-corner br" />
              <div className="frame-inner">
                <div className="frame-mat">
                  <div className="frame-image-wrapper">
                    <img src={getImage(item.id)} alt={item.label} loading="lazy" />
                  </div>
                  <div className="frame-label">{item.label}</div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Hidden gem in gallery */}
      <motion.span
        className="hidden-gem"
        style={{ bottom: '30px', right: '10%' }}
        whileHover={{ scale: 1.5 }}
        onClick={(e) => {
          e.currentTarget.classList.add('gem-collected');
          onCollectGem('gallery-gem');
        }}
      >
        💎
      </motion.span>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              className="lightbox-content"
              initial={{ scale: 0.5, opacity: 0, rotateX: 15 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', damping: 22 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
              <div className="lightbox-frame">
                <div className="lightbox-mat">
                  <img src={getImage(lightbox.id)} alt={lightbox.label} />
                </div>
              </div>
              <div className="lightbox-label">{lightbox.label}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default Gallery;
