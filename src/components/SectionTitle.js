import React from 'react';
import { motion } from 'framer-motion';

function SectionTitle({ ornament, title, subtitle }) {
  return (
    <motion.div
      className="section-title-wrapper"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8 }}
    >
      <span className="section-ornament">{ornament}</span>
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
      <div className="section-divider" />
    </motion.div>
  );
}

export default SectionTitle;
