import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── data ─── */
const PHOTO_EXT = { 22: 'png', 23: 'png', 24: 'png' };
const getPhoto = (id) => `/photos/image${String(id).padStart(5, '0')}.${PHOTO_EXT[id] || 'jpeg'}`;

/* Per-image style overrides for covers */
const COVER_OVERRIDES = {
  23: { objectPosition: 'center 55%' },
};

const FRAMES = [
  { id: 1, cover: 17, label: "The Mermaid's Dream", top: '4%', left: '4%', rotate: -3, scale: 0.95 },
  { id: 2, cover: 21, label: 'Fairy Hollow', top: '3%', left: '38%', rotate: 2, scale: 1 },
  { id: 3, cover: 5, label: 'Moonlit Crochet', top: '5%', left: '70%', rotate: -2, scale: 0.93 },
  { id: 4, cover: 23, label: 'Crystal Serenade', top: '48%', left: '12%', rotate: 3, scale: 0.96 },
  { id: 5, cover: 10, label: 'Enchanted Piano', top: '46%', left: '54%', rotate: -1, scale: 0.98 },
];

/* Extra decorative frames (picsum) to fill the hall — not clickable */
const DECO_FRAMES = [
  { src: 'https://picsum.photos/seed/selmaA/400/300', top: '6%', left: '22%', rotate: 1, scale: 0.72 },
  { src: 'https://picsum.photos/seed/selmaB/400/300', top: '8%', left: '56%', rotate: -2, scale: 0.68 },
  { src: 'https://picsum.photos/seed/selmaC/400/300', top: '50%', left: '36%', rotate: 2, scale: 0.7 },
  { src: 'https://picsum.photos/seed/selmaD/400/300', top: '52%', left: '74%', rotate: -1, scale: 0.65 },
  { src: 'https://picsum.photos/seed/selmaE/400/300', top: '2%', left: '88%', rotate: 3, scale: 0.6 },
  { src: 'https://picsum.photos/seed/selmaF/400/300', top: '48%', left: '88%', rotate: -2, scale: 0.62 },
];

const PORTALS = [
  {
    key: 'gem',
    label: 'The Crystal Cave',
    emoji: '\u{1F48E}',
    color: '#b388ff',
    glow: 'rgba(179, 136, 255, 0.35)',
    top: '35%',
    left: '0%',
  },
  {
    key: 'wizard',
    label: 'Hogwarts Library',
    emoji: '\u{1F4DA}\u{2728}',
    color: '#ffb74d',
    glow: 'rgba(255, 183, 77, 0.35)',
    top: '78%',
    left: '38%',
  },
  {
    key: 'pearl',
    label: 'The Mermaid Lagoon',
    emoji: '\u{1F41A}',
    color: '#80deea',
    glow: 'rgba(128, 222, 234, 0.35)',
    top: '36%',
    left: '88%',
  },
];

const MUSIC_NOTES = ['\u{1F3B5}', '\u{1F3B6}', '\u{1F3BC}', '\u{1F3B9}', '\u{1F3B5}', '\u{1F3B6}', '\u{1F3B5}', '\u{1F3BC}', '\u{1F3B6}', '\u{1F3B9}', '\u{1F3B5}', '\u{1F3B6}', '\u{1F3BC}', '\u{1F3B5}', '\u{1F3B6}', '\u{1F3B9}'];

const STUFFED_ANIMALS = [
  { emoji: '\u{1F9F8}', top: '18%', left: '30%' },
  { emoji: '\u{1F430}', top: '62%', left: '68%' },
  { emoji: '\u{1F98A}', top: '75%', left: '8%' },
  { emoji: '\u{1F431}', top: '14%', left: '62%' },
];

const YARN_DECO = [
  { emoji: '\u{1F9F6}', top: '72%', left: '22%', size: 22 },
  { emoji: '\u{2702}\u{FE0F}', top: '20%', left: '92%', size: 18 },
  { emoji: '\u{1F9F5}', top: '85%', left: '75%', size: 20 },
];

const PIANO_KEYS = 12;

/* ─── helpers ─── */
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ─── component ─── */
function MuseumHall({ onOpenGame, onOpenLetter, onOpenLightbox, onOpenPiano, badges }) {
  const [hoveredPortal, setHoveredPortal] = useState(null);

  /* stable random positions for music notes */
  const notePositions = useMemo(() => {
    const rng = seededRandom(42);
    return MUSIC_NOTES.map((n, i) => ({
      emoji: n,
      left: `${5 + rng() * 90}%`,
      top: `${5 + rng() * 85}%`,
      size: 14 + Math.floor(rng() * 14),
      duration: 6 + rng() * 8,
      delay: rng() * 5,
      xDrift: -30 + rng() * 60,
      yDrift: -40 + rng() * 20,
    }));
  }, []);

  /* fairy dust particles */
  const dustParticles = useMemo(() => {
    const rng = seededRandom(99);
    return Array.from({ length: 30 }, (_, i) => ({
      left: `${rng() * 100}%`,
      top: `${rng() * 100}%`,
      size: 2 + rng() * 4,
      duration: 3 + rng() * 5,
      delay: rng() * 4,
    }));
  }, []);

  return (
    <motion.div
      className="museum-hall"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 40%, #1a0f2e 0%, #0d0a1a 70%)',
      }}
    >
      {/* ── Fairy dust particles ── */}
      {dustParticles.map((p, i) => (
        <motion.div
          key={`dust-${i}`}
          style={{
            position: 'absolute',
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,246,189,0.9), rgba(255,215,0,0.2))',
            boxShadow: '0 0 6px rgba(255,215,0,0.4)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
          animate={{
            opacity: [0, 0.8, 0],
            y: [0, -20 - Math.random() * 30, 0],
            x: [0, -10 + Math.random() * 20, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* ── Floating music notes ── */}
      {notePositions.map((n, i) => (
        <motion.span
          key={`note-${i}`}
          style={{
            position: 'absolute',
            left: n.left,
            top: n.top,
            fontSize: n.size,
            pointerEvents: 'none',
            zIndex: 2,
            opacity: 0.18,
          }}
          animate={{
            y: [0, n.yDrift, 0],
            x: [0, n.xDrift, 0],
            rotate: [0, 15, -10, 0],
            opacity: [0.12, 0.3, 0.12],
          }}
          transition={{
            duration: n.duration,
            delay: n.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {n.emoji}
        </motion.span>
      ))}

      {/* ── Scattered Frames with frame.png ── */}
      {FRAMES.map((frame, idx) => (
        <motion.div
          key={frame.id}
          initial={{ opacity: 0, y: 40, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: frame.scale }}
          transition={{ delay: 0.2 + idx * 0.15, duration: 0.7, type: 'spring', damping: 18 }}
          whileHover={{
            scale: frame.scale * 1.08,
            y: -8,
            filter: 'drop-shadow(0 0 24px rgba(201,168,76,0.5))',
          }}
          onClick={() => onOpenLightbox(frame.id)}
          style={{
            position: 'absolute',
            top: frame.top,
            left: frame.left,
            transform: `rotate(${frame.rotate}deg)`,
            cursor: 'pointer',
            zIndex: 10,
            width: 'clamp(200px, 24vw, 320px)',
          }}
        >
          {/* frame.png with photo inside */}
          <div style={{ position: 'relative', width: '100%', aspectRatio: '1.33/1' }}>
            <img
              src="/frame.png"
              alt=""
              draggable={false}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'fill',
                zIndex: 2,
                pointerEvents: 'none',
                filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.6))',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '24%',
                left: '20%',
                right: '20%',
                bottom: '24%',
                overflow: 'hidden',
                zIndex: 1,
                background: '#2a1f3d',
              }}
            >
              <img
                src={getPhoto(frame.cover)}
                alt={frame.label}
                draggable={false}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: COVER_OVERRIDES[frame.cover]?.objectPosition || 'center 30%', display: 'block' }}
                loading="lazy"
              />
            </div>
          </div>
        </motion.div>
      ))}

      {/* ── Decorative filler frames (not clickable) ── */}
      {DECO_FRAMES.map((deco, idx) => (
        <motion.div
          key={`deco-${idx}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 0.55, y: 0, scale: deco.scale }}
          transition={{ delay: 0.8 + idx * 0.12, duration: 0.6 }}
          style={{
            position: 'absolute',
            top: deco.top,
            left: deco.left,
            transform: `rotate(${deco.rotate}deg)`,
            pointerEvents: 'none',
            zIndex: 5,
            width: 'clamp(100px, 12vw, 160px)',
          }}
        >
          <div style={{ position: 'relative', width: '100%', aspectRatio: '1.33/1' }}>
            <img
              src="/frame.png"
              alt=""
              draggable={false}
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                objectFit: 'fill', zIndex: 2, pointerEvents: 'none',
                filter: 'drop-shadow(0 3px 12px rgba(0,0,0,0.5))',
              }}
            />
            <div style={{
              position: 'absolute', top: '24%', left: '20%', right: '20%', bottom: '24%',
              overflow: 'hidden', zIndex: 1, background: '#2a1f3d',
            }}>
              <img
                src={deco.src}
                alt=""
                draggable={false}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', display: 'block' }}
                loading="lazy"
              />
            </div>
          </div>
        </motion.div>
      ))}

      {/* ── Room Portals ── */}
      {PORTALS.map((portal, idx) => (
        <motion.div
          key={portal.key}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 + idx * 0.2, duration: 0.6, type: 'spring' }}
          onHoverStart={() => setHoveredPortal(portal.key)}
          onHoverEnd={() => setHoveredPortal(null)}
          onClick={() => onOpenGame(portal.key)}
          style={{
            position: 'absolute',
            top: portal.top,
            left: portal.left,
            zIndex: 15,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* archway shape */}
          <motion.div
            animate={{
              boxShadow: [
                `0 0 20px ${portal.glow}, inset 0 0 15px ${portal.glow}`,
                `0 0 35px ${portal.glow}, inset 0 0 25px ${portal.glow}`,
                `0 0 20px ${portal.glow}, inset 0 0 15px ${portal.glow}`,
              ],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.12 }}
            style={{
              width: 'clamp(60px, 7vw, 90px)',
              height: 'clamp(80px, 9vw, 115px)',
              borderRadius: '50% 50% 0 0',
              background: `linear-gradient(180deg, ${portal.color}22 0%, ${portal.color}08 100%)`,
              border: `2px solid ${portal.color}66`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
              position: 'relative',
            }}
          >
            {portal.emoji}
          </motion.div>
          {/* label on hover */}
          <AnimatePresence>
            {hoveredPortal === portal.key && (
              <motion.span
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.25 }}
                style={{
                  marginTop: 6,
                  fontFamily: "'Cinzel Decorative', cursive",
                  fontSize: 'clamp(0.55rem, 0.75vw, 0.7rem)',
                  color: portal.color,
                  letterSpacing: 1.5,
                  whiteSpace: 'nowrap',
                  textShadow: `0 0 10px ${portal.glow}`,
                }}
              >
                {portal.label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      ))}

      {/* ── Stuffed animals peeking ── */}
      {STUFFED_ANIMALS.map((a, i) => (
        <motion.span
          key={`animal-${i}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.55, y: 0 }}
          transition={{ delay: 1.5 + i * 0.15 }}
          whileHover={{ scale: 1.4, opacity: 1, rotate: [-5, 5, 0] }}
          style={{
            position: 'absolute',
            top: a.top,
            left: a.left,
            fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
            cursor: 'default',
            zIndex: 6,
            filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.4))',
          }}
        >
          {a.emoji}
        </motion.span>
      ))}

      {/* ── Yarn / crochet decorations ── */}
      {YARN_DECO.map((y, i) => (
        <motion.span
          key={`yarn-${i}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1.8 + i * 0.2 }}
          whileHover={{ scale: 1.3, rotate: 15, opacity: 0.9 }}
          style={{
            position: 'absolute',
            top: y.top,
            left: y.left,
            fontSize: y.size,
            pointerEvents: 'auto',
            cursor: 'default',
            zIndex: 4,
          }}
        >
          {y.emoji}
        </motion.span>
      ))}

      {/* ── Mini piano (clickable to open full piano) ── */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2, duration: 0.6 }}
        onClick={() => onOpenPiano && onOpenPiano()}
        whileHover={{ scale: 1.08 }}
        style={{
          position: 'absolute',
          bottom: '8%',
          right: '4%',
          zIndex: 12,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          cursor: 'pointer',
        }}
      >
        <span style={{ fontSize: '1.3rem', marginBottom: 4, opacity: 0.7 }}>{'\u{1F3B9}'}</span>
        <div style={{ display: 'flex', gap: 1 }}>
          {Array.from({ length: PIANO_KEYS }, (_, k) => {
            const isBlack = [1, 3, 6, 8, 10].includes(k);
            return (
              <motion.div
                key={k}
                animate={{
                  opacity: [0.6, 1, 0.6],
                  scaleY: [1, 1.04, 1],
                }}
                transition={{
                  duration: 1.5 + (k % 5) * 0.3,
                  delay: k * 0.1,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  width: isBlack ? 6 : 10,
                  height: isBlack ? 22 : 30,
                  borderRadius: '0 0 2px 2px',
                  border: '1px solid rgba(201,168,76,0.25)',
                  background: isBlack ? '#222' : '#f5f0e8',
                  zIndex: isBlack ? 2 : 1,
                  marginLeft: isBlack ? -3 : 0,
                  marginRight: isBlack ? -3 : 0,
                  transformOrigin: 'top center',
                }}
              />
            );
          })}
        </div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 2.5 }}
          style={{
            marginTop: 4,
            fontFamily: "'Dancing Script', cursive",
            fontSize: 'clamp(0.5rem, 0.7vw, 0.6rem)',
            color: '#c9a84c',
            letterSpacing: 1,
          }}
        >
          Play Me
        </motion.span>
      </motion.div>

      {/* ── Birthday Letter Portal (golden door) ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.6, type: 'spring', damping: 14 }}
        whileHover={{ scale: 1.1 }}
        onClick={onOpenLetter}
        style={{
          position: 'absolute',
          bottom: '6%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20,
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <motion.div
          animate={{
            boxShadow: [
              '0 0 20px rgba(201,168,76,0.3), inset 0 0 12px rgba(201,168,76,0.2)',
              '0 0 40px rgba(201,168,76,0.5), inset 0 0 20px rgba(201,168,76,0.35)',
              '0 0 20px rgba(201,168,76,0.3), inset 0 0 12px rgba(201,168,76,0.2)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: 'clamp(56px, 6vw, 78px)',
            height: 'clamp(74px, 8vw, 100px)',
            borderRadius: '50% 50% 0 0',
            background: 'linear-gradient(180deg, rgba(201,168,76,0.2) 0%, rgba(201,168,76,0.05) 100%)',
            border: '2px solid rgba(201,168,76,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'clamp(1.4rem, 2vw, 1.8rem)',
          }}
        >
          {'\u{1F48C}'}
        </motion.div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 2.2 }}
          style={{
            marginTop: 6,
            fontFamily: "'Dancing Script', cursive",
            fontSize: 'clamp(0.65rem, 0.9vw, 0.8rem)',
            color: '#c9a84c',
            letterSpacing: 1,
          }}
        >
          A Letter for Selma
        </motion.span>
      </motion.div>

      {/* ── Badge Shelf (fixed bottom-left) ── */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2.2, duration: 0.5 }}
        style={{
          position: 'fixed',
          bottom: 20,
          left: 20,
          zIndex: 50,
          display: 'flex',
          gap: 10,
          background: 'rgba(13,10,26,0.7)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(201,168,76,0.2)',
          borderRadius: 30,
          padding: '8px 16px',
        }}
      >
        {[
          { key: 'gem', emoji: '\u{1F48E}', color: '#b388ff', label: 'Crystal' },
          { key: 'wizard', emoji: '\u{1F9D9}', color: '#ffb74d', label: 'Wizard' },
          { key: 'pearl', emoji: '\u{1F9AA}', color: '#80deea', label: 'Pearl' },
        ].map((b) => (
          <motion.div
            key={b.key}
            whileHover={{ scale: 1.15 }}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: `2px solid ${badges[b.key] ? b.color : 'rgba(255,255,255,0.15)'}`,
              background: badges[b.key]
                ? `radial-gradient(circle, ${b.color}33, ${b.color}11)`
                : 'rgba(255,255,255,0.03)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: badges[b.key] ? '1.1rem' : '0.8rem',
              opacity: badges[b.key] ? 1 : 0.35,
              transition: 'all 0.4s ease',
            }}
            title={b.label}
          >
            {badges[b.key] ? b.emoji : '\u25CB'}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default MuseumHall;
