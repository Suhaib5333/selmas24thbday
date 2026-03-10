import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from './Confetti';
import SoundManager from '../utils/SoundManager';

const GEMS = [
  { id: 0, emoji: '💎', name: 'Diamond', x: 12, y: 20, color: '#b8d4e3' },
  { id: 1, emoji: '💜', name: 'Amethyst', x: 78, y: 15, color: '#9b59b6' },
  { id: 2, emoji: '💚', name: 'Emerald', x: 45, y: 70, color: '#2ecc71' },
  { id: 3, emoji: '💖', name: 'Rose Quartz', x: 88, y: 55, color: '#f4a7bb' },
  { id: 4, emoji: '💛', name: 'Citrine', x: 25, y: 80, color: '#f1c40f' },
  { id: 5, emoji: '💙', name: 'Aquamarine', x: 62, y: 40, color: '#74c0fc' },
  { id: 6, emoji: '🔮', name: 'Mystic Orb', x: 35, y: 35, color: '#8e44ad' },
  { id: 7, emoji: '✨', name: 'Opal', x: 70, y: 78, color: '#ffd89b' },
];

const STALACTITES = [
  { left: '8%', height: '18%' },
  { left: '22%', height: '12%' },
  { left: '40%', height: '22%' },
  { left: '58%', height: '10%' },
  { left: '72%', height: '16%' },
  { left: '90%', height: '20%' },
];

function GemHunt({ onWin, onClose }) {
  const [found, setFound] = useState(new Set());
  const [sparkle, setSparkle] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [won, setWon] = useState(false);

  const crystalBg = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: 2 + Math.random() * 4,
      opacity: 0.1 + Math.random() * 0.3,
      delay: Math.random() * 5,
    })), []);

  const handleGemClick = useCallback((gemId) => {
    if (found.has(gemId)) return;
    SoundManager.playCollect();
    setSparkle(gemId);
    setTimeout(() => setSparkle(null), 800);

    setFound((prev) => {
      const next = new Set(prev);
      next.add(gemId);
      if (next.size === GEMS.length) {
        setTimeout(() => {
          SoundManager.playSuccess();
          setShowConfetti(true);
          setWon(true);
          setTimeout(() => setShowConfetti(false), 5000);
        }, 500);
      }
      return next;
    });
  }, [found]);

  return (
    <div className="gemhunt-wrapper">
      <Confetti show={showConfetti} />

      {/* Header */}
      <div className="gemhunt-header">
        <motion.button
          className="gemhunt-back-btn"
          onClick={onClose}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          &larr; Back to Hall
        </motion.button>
        <h2 className="gemhunt-title">The Crystal Cavern</h2>
        <div className="gemhunt-progress">
          <span className="gemhunt-progress-icon">💎</span>
          <span className="gemhunt-progress-text">{found.size} / {GEMS.length}</span>
        </div>
      </div>

      <p className="gemhunt-hint">
        Click the glowing spots to uncover hidden gems...
      </p>

      {/* Game Area */}
      <div className="gemhunt-cave">
        {/* Stalactites */}
        {STALACTITES.map((s, i) => (
          <div
            key={i}
            className="gemhunt-stalactite"
            style={{ left: s.left, height: s.height }}
          />
        ))}

        {/* Twinkling background crystals */}
        {crystalBg.map((c) => (
          <div
            key={c.id}
            className="gemhunt-bg-crystal"
            style={{
              left: c.left,
              top: c.top,
              width: `${c.size}px`,
              height: `${c.size}px`,
              opacity: c.opacity,
              animationDelay: `${c.delay}s`,
            }}
          />
        ))}

        {/* Gems */}
        {GEMS.map((gem) => {
          const isFound = found.has(gem.id);
          return (
            <motion.div
              key={gem.id}
              className={`gemhunt-gem ${isFound ? 'gemhunt-gem-found' : 'gemhunt-gem-hidden'}`}
              style={{ left: `${gem.x}%`, top: `${gem.y}%` }}
              onClick={() => handleGemClick(gem.id)}
              whileHover={!isFound ? { scale: 1.3 } : {}}
              animate={isFound ? { scale: [1, 1.4, 1], rotate: [0, 15, -15, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              <span className="gemhunt-gem-emoji">{gem.emoji}</span>
              {isFound && <span className="gemhunt-gem-label">{gem.name}</span>}

              {/* Sparkle effect */}
              <AnimatePresence>
                {sparkle === gem.id && (
                  <motion.div
                    className="gemhunt-sparkle-ring"
                    initial={{ scale: 0.3, opacity: 1 }}
                    animate={{ scale: 2.5, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{ borderColor: gem.color }}
                  />
                )}
              </AnimatePresence>

              {/* Glow for hidden gems */}
              {!isFound && (
                <div
                  className="gemhunt-glow"
                  style={{ background: `radial-gradient(circle, ${gem.color}55 0%, transparent 70%)` }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Collection tray */}
      <div className="gemhunt-tray">
        {GEMS.map((gem) => (
          <motion.div
            key={gem.id}
            className={`gemhunt-tray-slot ${found.has(gem.id) ? 'gemhunt-tray-filled' : ''}`}
            animate={found.has(gem.id) ? { scale: [0, 1.3, 1] } : {}}
            transition={{ type: 'spring', damping: 10 }}
          >
            {found.has(gem.id) ? gem.emoji : '?'}
          </motion.div>
        ))}
      </div>

      {/* Win state */}
      <AnimatePresence>
        {won && (
          <motion.div
            className="gemhunt-win-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="gemhunt-win-content"
              initial={{ scale: 0.5, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', damping: 12 }}
            >
              <span className="gemhunt-win-crown">👑</span>
              <h2 className="gemhunt-win-title">All Gems Found!</h2>
              <p className="gemhunt-win-text">
                You uncovered every crystal in the cavern!<br />
                A true gem hunter worthy of a badge.
              </p>
              <motion.button
                className="gemhunt-claim-btn"
                onClick={() => onWin && onWin('gem')}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                Claim Badge 💎
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default GemHunt;
