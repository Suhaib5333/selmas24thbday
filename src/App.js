import React, { useState, useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './styles/App.css';
import Entrance from './components/Entrance';
import MuseumHall from './components/MuseumHall';
import FloatingParticles from './components/FloatingParticles';
import StampLetter from './components/StampLetter';
import CursorTrail from './components/CursorTrail';
import Confetti from './components/Confetti';
import GemHunt from './components/GemHunt';
import WizardTrivia from './components/WizardTrivia';
import PearlDive from './components/PearlDive';
import BadgeDownloader from './components/BadgeDownloader';
import Piano from './components/Piano';
import SoundManager from './utils/SoundManager';

/* ── Gallery frames — each frame holds a group of photos ── */
const GALLERY_FRAMES = [
  { id: 1, label: "The Mermaid's Dream", images: [17, 3, 22, 9, 14] },
  { id: 2, label: 'Fairy Hollow',        images: [21, 19, 1, 24, 11] },
  { id: 3, label: 'Moonlit Crochet',     images: [5, 16, 8, 12, 7] },
  { id: 4, label: 'Crystal Serenade',    images: [23, 4, 13, 18, 15] },
  { id: 5, label: 'Enchanted Piano',     images: [10, 20, 6, 2] },
];

/* Images 1-21 are .jpeg, 22-24 are .png */
const PHOTO_EXT = { 22: 'png', 23: 'png', 24: 'png' };
const getPhoto = (id) => `/photos/image${String(id).padStart(5, '0')}.${PHOTO_EXT[id] || 'jpeg'}`;

/* Per-image style overrides for proper framing */
const PHOTO_OVERRIDES = {
  16: { transform: 'rotate(-90deg) scale(0.75)', objectPosition: 'center center' },   // Moonlit Crochet pic 2 — rotate left 90°, zoom out
  14: { transform: 'rotate(-90deg) scale(0.75)', objectPosition: 'center center' },   // Mermaid's Dream last pic — rotate left 90°, zoom out
  7:  { objectPosition: 'center 60%' },   // Moonlit Crochet last — shift down to show bodies
  22: { objectPosition: 'center 45%' },   // Mermaid's Dream pic 3 — centered
  23: { objectPosition: 'center 55%' },   // Crystal Serenade pic 1 — faces + text below
  24: { objectPosition: 'center 65%' },   // Fairy Hollow pic 4 — shift down, show full bodies
};

function Lightbox({ frameData, onClose }) {
  const [currentIdx, setCurrentIdx] = React.useState(0);

  // Reset index when frame changes
  React.useEffect(() => { setCurrentIdx(0); }, [frameData]);

  if (!frameData) return null;

  const { label, images } = frameData;

  const hasPrev = currentIdx > 0;
  const hasNext = currentIdx < images.length - 1;

  const goPrev = (e) => { e.stopPropagation(); if (hasPrev) setCurrentIdx((i) => i - 1); };
  const goNext = (e) => { e.stopPropagation(); if (hasNext) setCurrentIdx((i) => i + 1); };

  // Touch swipe support (left to right only)
  let touchStartX = 0;
  const handleTouchStart = (e) => { touchStartX = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 50 && hasNext) setCurrentIdx((i) => i + 1);
    else if (diff < -50 && hasPrev) setCurrentIdx((i) => i - 1);
  };

  const photoId = images[currentIdx];

  return (
    <motion.div
      className="lightbox-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="lightbox-content"
        initial={{ scale: 0.8, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 30 }}
        transition={{ type: 'spring', damping: 18 }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <button className="lightbox-close" onClick={onClose}>
          &times;
        </button>

        {/* Prev arrow */}
        {hasPrev && (
          <button onClick={goPrev} style={{
            position: 'absolute', left: -50, top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(13,10,26,0.7)', border: '1px solid rgba(201,168,76,0.4)',
            color: '#c9a84c', width: 40, height: 40, borderRadius: '50%',
            cursor: 'pointer', fontSize: '1.2rem', display: 'flex',
            alignItems: 'center', justifyContent: 'center', zIndex: 10,
          }}>&#8249;</button>
        )}

        {/* Next arrow */}
        {hasNext && (
          <button onClick={goNext} style={{
            position: 'absolute', right: -50, top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(13,10,26,0.7)', border: '1px solid rgba(201,168,76,0.4)',
            color: '#c9a84c', width: 40, height: 40, borderRadius: '50%',
            cursor: 'pointer', fontSize: '1.2rem', display: 'flex',
            alignItems: 'center', justifyContent: 'center', zIndex: 10,
          }}>&#8250;</button>
        )}

        <div style={{
          position: 'relative',
          width: 'min(85vw, 900px)',
          aspectRatio: '4 / 3',
        }}>
          {/* Ornate frame overlay */}
          <img
            src="/frame.png"
            alt=""
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'fill',
              zIndex: 2,
              pointerEvents: 'none',
              filter: 'drop-shadow(0 4px 30px rgba(201,168,76,0.3))',
            }}
          />
          {/* Photo inside — clipped to sit within the ornate border */}
          <div style={{
            position: 'absolute',
            top: '24%',
            left: '20%',
            right: '20%',
            bottom: '24%',
            overflow: 'hidden',
            zIndex: 1,
          }}>
            <img
              src={getPhoto(photoId)}
              alt={label}
              style={{
                width: PHOTO_OVERRIDES[photoId]?.transform ? '140%' : '100%',
                height: PHOTO_OVERRIDES[photoId]?.transform ? '140%' : '100%',
                objectFit: 'cover',
                objectPosition: PHOTO_OVERRIDES[photoId]?.objectPosition || 'center 30%',
                display: 'block',
                ...(PHOTO_OVERRIDES[photoId]?.transform ? {
                  transform: PHOTO_OVERRIDES[photoId].transform,
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-70%',
                  marginLeft: '-70%',
                } : {}),
              }}
            />
          </div>
        </div>
        <p className="lightbox-label">{label}</p>

        {/* Dot indicators */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 10 }}>
          {images.map((imgId, i) => (
            <span
              key={imgId}
              onClick={(e) => { e.stopPropagation(); setCurrentIdx(i); }}
              style={{
                width: i === currentIdx ? 16 : 8,
                height: 8,
                borderRadius: 4,
                background: i === currentIdx ? '#c9a84c' : 'rgba(201,168,76,0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   APP
   ══════════════════════════════════════════ */
const MUSEUM_PASSWORD = 'hogwarts123';

function PasswordGate({ onUnlock }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pw === MUSEUM_PASSWORD) {
      localStorage.setItem('selma24_unlocked', 'true');
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 1500);
    }
  };

  return (
    <motion.div
      className="password-gate"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: 'radial-gradient(ellipse at center, #1a0a2e 0%, #0d0518 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Cormorant Garamond', serif",
      }}
    >
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        style={{ textAlign: 'center' }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔮</div>
        <h2 style={{
          fontFamily: "'Cinzel Decorative', cursive",
          color: '#c9a84c',
          fontSize: 'clamp(1.4rem, 4vw, 2rem)',
          marginBottom: '0.5rem',
        }}>
          The Museum Awaits
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', marginBottom: '2rem' }}>
          Speak the secret word to enter
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <motion.input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Enter password..."
            animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
            style={{
              width: 'min(280px, 80vw)',
              padding: '0.8rem 1.2rem',
              borderRadius: '12px',
              border: error ? '2px solid #e74c3c' : '2px solid rgba(201,168,76,0.4)',
              background: 'rgba(255,255,255,0.05)',
              color: '#f5f0e8',
              fontSize: '1.1rem',
              textAlign: 'center',
              outline: 'none',
              fontFamily: "'Cormorant Garamond', serif",
            }}
            autoFocus
          />
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ color: '#e74c3c', fontSize: '0.9rem', margin: 0 }}
            >
              Wrong password, try again!
            </motion.p>
          )}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(201,168,76,0.4)' }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '0.7rem 2.5rem',
              borderRadius: '30px',
              border: '2px solid #c9a84c',
              background: 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.05))',
              color: '#c9a84c',
              fontSize: '1.1rem',
              cursor: 'pointer',
              fontFamily: "'Cinzel Decorative', cursive",
            }}
          >
            Enter
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}

function App() {
  const [unlocked, setUnlocked] = useState(() => {
    try { return localStorage.getItem('selma24_unlocked') === 'true'; } catch { return false; }
  });
  const [entered, setEntered] = useState(() => {
    try { return JSON.parse(localStorage.getItem('selma24_entered')) || false; } catch { return false; }
  });
  const [showHall, setShowHall] = useState(() => {
    try { return JSON.parse(localStorage.getItem('selma24_entered')) || false; } catch { return false; }
  });
  const [currentRoom, setCurrentRoom] = useState('hall'); // 'hall' | 'gem' | 'wizard' | 'pearl' | 'letter'
  const [badges, setBadges] = useState(() => {
    try { return JSON.parse(localStorage.getItem('selma24_badges')) || { gem: false, wizard: false, pearl: false }; } catch { return { gem: false, wizard: false, pearl: false }; }
  });
  const [showBadgeModal, setShowBadgeModal] = useState(null); // null | 'gem' | 'wizard' | 'pearl'
  const [lightboxFrame, setLightboxFrame] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showPiano, setShowPiano] = useState(false);
  const appRef = useRef(null);

  /* Parse all emoji text into Twemoji images (Apple-style) */
  useEffect(() => {
    if (!window.twemoji) return;
    const parse = () => {
      if (appRef.current) {
        window.twemoji.parse(appRef.current, {
          folder: 'svg',
          ext: '.svg',
          className: 'twemoji',
        });
      }
    };
    parse();
    const observer = new MutationObserver(parse);
    if (appRef.current) {
      observer.observe(appRef.current, { childList: true, subtree: true });
    }
    return () => observer.disconnect();
  });

  /* Persist to localStorage */
  useEffect(() => {
    localStorage.setItem('selma24_badges', JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    if (entered) localStorage.setItem('selma24_entered', JSON.stringify(true));
  }, [entered]);

  /* Start ambient music on reload if already entered */
  useEffect(() => {
    if (entered && showHall) {
      SoundManager.init();
      SoundManager.startAmbient();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* Reset everything */
  const handleReset = useCallback(() => {
    localStorage.removeItem('selma24_badges');
    localStorage.removeItem('selma24_entered');
    localStorage.removeItem('selma24_unlocked');
    SoundManager.stopAmbient();
    window.location.reload();
  }, []);

  /* entrance → hall */
  const handleEnter = useCallback(() => {
    SoundManager.init();
    SoundManager.playChime();
    setEntered(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
    setTimeout(() => {
      setShowHall(true);
      SoundManager.startAmbient();
    }, 600);
  }, []);

  /* portal clicks */
  const handleOpenGame = useCallback((gameType) => {
    setCurrentRoom(gameType);
  }, []);

  /* game win */
  const handleGameWin = useCallback(
    (gameType) => {
      setBadges((prev) => ({ ...prev, [gameType]: true }));
      setCurrentRoom('hall');
      setShowBadgeModal(gameType);
      setShowConfetti(true);
      SoundManager.playBadge();
      setTimeout(() => setShowConfetti(false), 5000);
    },
    []
  );

  /* close game without winning */
  const handleCloseGame = useCallback(() => {
    setCurrentRoom('hall');
  }, []);

  /* letter */
  const handleOpenLetter = useCallback(() => {
    setCurrentRoom('letter');
  }, []);

  /* lightbox */
  const handleOpenLightbox = useCallback((frameId) => {
    const frame = GALLERY_FRAMES.find((f) => f.id === frameId);
    if (frame) setLightboxFrame(frame);
  }, []);

  const handleCloseLightbox = useCallback(() => {
    setLightboxFrame(null);
  }, []);

  /* piano */
  const handleOpenPiano = useCallback(() => {
    SoundManager.stopAmbient();
    setShowPiano(true);
  }, []);

  const handleClosePiano = useCallback(() => {
    setShowPiano(false);
    SoundManager.startAmbient();
  }, []);

  /* badge modal close */
  const handleCloseBadgeModal = useCallback(() => {
    setShowBadgeModal(null);
  }, []);

  if (!unlocked) {
    return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <div className="App" ref={appRef}>
      <CursorTrail />
      <Confetti show={showConfetti} />

      {/* ── Entrance ── */}
      <AnimatePresence>
        {!entered && (
          <motion.div
            key="entrance-wrapper"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            style={{ position: 'fixed', inset: 0, zIndex: 9999 }}
          >
            <Entrance onEnter={handleEnter} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Museum content ── */}
      {showHall && (
        <>
          <FloatingParticles />

          {/* The Hall is always rendered underneath game overlays */}
          <MuseumHall
            onOpenGame={handleOpenGame}
            onOpenLetter={handleOpenLetter}
            onOpenLightbox={handleOpenLightbox}
            onOpenPiano={handleOpenPiano}
            badges={badges}
          />

          {/* ── Game overlays ── */}
          <AnimatePresence>
            {currentRoom === 'gem' && (
              <motion.div
                key="gem-game"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <GemHunt onWin={() => handleGameWin('gem')} onClose={handleCloseGame} />
              </motion.div>
            )}

            {currentRoom === 'wizard' && (
              <motion.div
                key="wizard-game"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <WizardTrivia onWin={() => handleGameWin('wizard')} onClose={handleCloseGame} />
              </motion.div>
            )}

            {currentRoom === 'pearl' && (
              <motion.div
                key="pearl-game"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <PearlDive onWin={() => handleGameWin('pearl')} onClose={handleCloseGame} />
              </motion.div>
            )}

            {currentRoom === 'letter' && (
              <motion.div
                key="letter-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 3000,
                  background: 'rgba(13,10,26,0.92)',
                  backdropFilter: 'blur(16px)',
                  overflowY: 'auto',
                }}
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={handleCloseGame}
                  style={{
                    position: 'fixed',
                    top: 20,
                    right: 24,
                    zIndex: 3100,
                    background: 'none',
                    border: '1.5px solid rgba(201,168,76,0.4)',
                    color: '#c9a84c',
                    borderRadius: 30,
                    padding: '8px 20px',
                    fontFamily: "'Cinzel Decorative', cursive",
                    fontSize: '0.7rem',
                    letterSpacing: 2,
                    cursor: 'pointer',
                  }}
                >
                  Return to Hall
                </motion.button>
                <StampLetter />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Lightbox ── */}
          <AnimatePresence>
            {lightboxFrame && (
              <Lightbox key="lightbox" frameData={lightboxFrame} onClose={handleCloseLightbox} />
            )}
          </AnimatePresence>

          {/* ── Piano overlay ── */}
          <AnimatePresence>
            {showPiano && (
              <motion.div
                key="piano-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Piano isOpen={showPiano} onClose={handleClosePiano} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Badge modal ── */}
          <AnimatePresence>
            {showBadgeModal && (
              <motion.div
                key="badge-modal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <BadgeDownloader type={showBadgeModal} onClose={handleCloseBadgeModal} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Reset button ── */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            whileHover={{ opacity: 1, scale: 1.05 }}
            onClick={handleReset}
            style={{
              position: 'fixed',
              top: 16,
              right: 16,
              zIndex: 100,
              background: 'rgba(13,10,26,0.7)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(201,168,76,0.25)',
              color: '#c9a84c',
              borderRadius: 20,
              padding: '6px 14px',
              fontFamily: "'Cinzel Decorative', cursive",
              fontSize: '0.55rem',
              letterSpacing: 1.5,
              cursor: 'pointer',
            }}
          >
            Reset
          </motion.button>
        </>
      )}
    </div>
  );
}

export default App;
