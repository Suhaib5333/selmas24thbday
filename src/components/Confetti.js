import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PASTEL_COLORS = [
  '#f4c2c2', '#b8a9c9', '#a8d8ea', '#ffd89b', '#c5e1a5',
  '#f5e6a3', '#e1bee7', '#80deea', '#f48fb1', '#c9a84c',
];

function Confetti({ show }) {
  const pieces = useMemo(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      color: PASTEL_COLORS[i % PASTEL_COLORS.length],
      rotation: `${360 + Math.random() * 720}deg`,
      fallDuration: `${2 + Math.random() * 3}s`,
      fallDelay: `${Math.random() * 1}s`,
      size: 6 + Math.random() * 8,
      shape: Math.random() > 0.5 ? '50%' : '2px',
    })), []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="confetti-container"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 4, duration: 1 }}
        >
          {pieces.map((p) => (
            <div
              key={p.id}
              className="confetti-piece"
              style={{
                left: p.left,
                width: `${p.size}px`,
                height: `${p.size}px`,
                background: p.color,
                borderRadius: p.shape,
                '--rotation': p.rotation,
                '--fall-duration': p.fallDuration,
                '--fall-delay': p.fallDelay,
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Confetti;
