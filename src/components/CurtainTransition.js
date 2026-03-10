import React from 'react';
import { motion } from 'framer-motion';

function CurtainTransition({ isOpen }) {
  return (
    <div className="curtain-overlay">
      <motion.div
        className="curtain-left"
        initial={{ x: 0 }}
        animate={{ x: isOpen ? '-100%' : 0 }}
        transition={{ duration: 1.8, ease: [0.65, 0, 0.35, 1] }}
      />
      <motion.div
        className="curtain-right"
        initial={{ x: 0 }}
        animate={{ x: isOpen ? '100%' : 0 }}
        transition={{ duration: 1.8, ease: [0.65, 0, 0.35, 1] }}
      />
    </div>
  );
}

export default CurtainTransition;
