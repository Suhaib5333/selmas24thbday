import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SoundManager from '../utils/SoundManager';

const FLOATING_EMOJIS = [
  '✨', '🦋', '🌸', '🧚', '💫', '🌙', '🌸', '💫', '💎', '🐚',
  '🎵', '🎶', '🎵', '🎶', '🎼', '🎹',
];

const PIANO_KEY_COUNT = 20;

function Entrance({ onEnter }) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    SoundManager.init();
    SoundManager.playChime();
    setClicked(true);
    setTimeout(() => onEnter(), 400);
  };

  return (
    <motion.section
      className="entrance"
      animate={clicked ? { scale: 1.1, opacity: 0 } : { scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      {/* Background orbs */}
      <div className="entrance-bg-orbs">
        <div className="orb" />
        <div className="orb" />
        <div className="orb" />
        <div className="orb" />
      </div>

      {/* Stars / sparkle background */}
      {Array.from({ length: 40 }, (_, i) => (
        <motion.div
          key={`star-${i}`}
          style={{
            position: 'absolute',
            width: `${1 + Math.random() * 3}px`,
            height: `${1 + Math.random() * 3}px`,
            borderRadius: '50%',
            background: '#fff',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: 'easeInOut',
          }}
        />
      ))}

      <div className="entrance-content">
        <motion.p
          className="entrance-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          You are cordially invited to
        </motion.p>

        <motion.h1
          className="entrance-title"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 1.2, ease: 'easeOut' }}
        >
          Selma's Enchanted Museum
        </motion.h1>

        <motion.div
          className="entrance-age"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          24
        </motion.div>

        <motion.p
          className="entrance-tagline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1 }}
        >
          A celebration crafted with love for Selma Algosaibi
          <br />
          <span style={{ fontSize: '0.75em', opacity: 0.8 }}>From Suhaib, Mirna, Dana, Taliah & Fatima</span>
        </motion.p>

        <motion.button
          className="enter-btn"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8, duration: 0.8 }}
          whileHover={{ scale: 1.08, boxShadow: '0 0 60px rgba(201, 168, 76, 0.5)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClick}
        >
          Open the Museum Doors
        </motion.button>
      </div>

      {/* Floating decorative emojis (includes music notes) */}
      {FLOATING_EMOJIS.map((emoji, i) => (
        <motion.span
          key={i}
          style={{
            position: 'absolute',
            fontSize: `${14 + (i % 4) * 4}px`,
            left: `${3 + (i * 6.1) % 92}%`,
            top: `${10 + ((i * 17) % 75)}%`,
            pointerEvents: 'none',
          }}
          animate={{
            y: [0, -25 + (i % 3) * 10, 0],
            x: [0, Math.sin(i) * 15, 0],
            opacity: [0.15, 0.45, 0.15],
            rotate: [0, 15, -15, 0],
          }}
          transition={{
            duration: 5 + i * 0.35,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {emoji}
        </motion.span>
      ))}

      {/* Piano keys animation at the bottom */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.2, duration: 1 }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 1,
          zIndex: 3,
          opacity: 0.35,
        }}
      >
        {Array.from({ length: PIANO_KEY_COUNT }, (_, k) => {
          const isBlack = [1, 3, 6, 8, 10, 13, 15, 18].includes(k);
          return (
            <motion.div
              key={k}
              animate={{
                opacity: [0.4, 0.9, 0.4],
                scaleY: [1, 1.05, 1],
              }}
              transition={{
                duration: 1.5 + (k % 5) * 0.3,
                delay: k * 0.12,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                width: isBlack ? 8 : 14,
                height: isBlack ? 30 : 42,
                background: isBlack
                  ? 'linear-gradient(180deg, #333, #111)'
                  : 'linear-gradient(180deg, #f5f0e8, #ddd5c4)',
                borderRadius: '0 0 3px 3px',
                border: '1px solid rgba(201,168,76,0.15)',
                marginLeft: isBlack ? -4 : 0,
                marginRight: isBlack ? -4 : 0,
                zIndex: isBlack ? 2 : 1,
                transformOrigin: 'top center',
              }}
            />
          );
        })}
      </motion.div>
    </motion.section>
  );
}

export default Entrance;
