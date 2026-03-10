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

/* ── Lightbox ── */
const FRAME_LABELS = {
  1: "The Mermaid's Dream",
  2: 'Fairy Hollow',
  3: 'Moonlit Crochet',
  4: 'Crystal Serenade',
  5: 'The Enchanted Piano',
  6: 'Stardust Library',
  7: 'The Pearl Garden',
  8: 'Whimsical Dreams',
};

const ALL_FRAME_IDS = Object.keys(FRAME_LABELS).map(Number);

function Lightbox({ imageId, onClose, onNavigate }) {
  if (!imageId) return null;

  const currentIdx = ALL_FRAME_IDS.indexOf(imageId);
  const hasPrev = currentIdx > 0;
  const hasNext = currentIdx < ALL_FRAME_IDS.length - 1;

  const goPrev = (e) => { e.stopPropagation(); onNavigate(ALL_FRAME_IDS[currentIdx - 1]); };
  const goNext = (e) => { e.stopPropagation(); onNavigate(ALL_FRAME_IDS[currentIdx + 1]); };

  // Touch swipe support
  let touchStartX = 0;
  const handleTouchStart = (e) => { touchStartX = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 50 && hasNext) onNavigate(ALL_FRAME_IDS[currentIdx + 1]);
    else if (diff < -50 && hasPrev) onNavigate(ALL_FRAME_IDS[currentIdx - 1]);
  };

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
          width: 'min(60vw, 580px)',
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
            top: '16%',
            left: '14%',
            right: '14%',
            bottom: '16%',
            overflow: 'hidden',
            zIndex: 1,
          }}>
            <img
              src={`https://picsum.photos/seed/selma${imageId}/800/600`}
              alt={FRAME_LABELS[imageId] || 'Gallery'}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        </div>
        <p className="lightbox-label">{FRAME_LABELS[imageId] || ''}</p>

        {/* Dot indicators */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 10 }}>
          {ALL_FRAME_IDS.map((id) => (
            <span
              key={id}
              onClick={(e) => { e.stopPropagation(); onNavigate(id); }}
              style={{
                width: id === imageId ? 16 : 8,
                height: 8,
                borderRadius: 4,
                background: id === imageId ? '#c9a84c' : 'rgba(201,168,76,0.3)',
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
function App() {
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
  const [lightboxImage, setLightboxImage] = useState(null);
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
  const handleOpenLightbox = useCallback((id) => {
    setLightboxImage(id);
  }, []);

  const handleCloseLightbox = useCallback(() => {
    setLightboxImage(null);
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
            {lightboxImage && (
              <Lightbox key="lightbox" imageId={lightboxImage} onClose={handleCloseLightbox} onNavigate={setLightboxImage} />
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
