import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from './Confetti';
import SoundManager from '../utils/SoundManager';

const GAME_DURATION = 120;
const WIN_TARGET = 15;
const SPAWN_INTERVAL_START = 1200;
const SPAWN_INTERVAL_MIN = 700;
const RISE_DURATION_START = 10;
const RISE_DURATION_MIN = 6;

const PEARL_EMOJIS = ['🤍', '💖', '💙', '💜', '🤍'];
const BUBBLE_SIZES = [52, 58, 64, 70];

let bubbleIdCounter = 0;

function PearlDive({ onWin, onClose }) {
  const [gameState, setGameState] = useState('ready'); // ready | playing | won | lost
  const [pearls, setPearls] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [bubbles, setBubbles] = useState([]);
  const [pops, setPops] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const gameRef = useRef(null);
  const spawnRef = useRef(null);
  const timerRef = useRef(null);
  const elapsedRef = useRef(0);

  const seaweed = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: `${5 + i * 12 + Math.random() * 5}%`,
      height: 60 + Math.random() * 80,
      delay: Math.random() * 3,
      hue: 100 + Math.random() * 60,
    })), []);

  const bgBubbles = useMemo(() =>
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 4 + Math.random() * 12,
      duration: 6 + Math.random() * 8,
      delay: Math.random() * 6,
    })), []);

  const getDifficulty = useCallback(() => {
    const elapsed = elapsedRef.current;
    const progress = Math.min(elapsed / GAME_DURATION, 1);
    const spawnInterval = SPAWN_INTERVAL_START - progress * (SPAWN_INTERVAL_START - SPAWN_INTERVAL_MIN);
    const riseDuration = RISE_DURATION_START - progress * (RISE_DURATION_START - RISE_DURATION_MIN);
    return { spawnInterval, riseDuration };
  }, []);

  const spawnBubble = useCallback(() => {
    const { riseDuration } = getDifficulty();
    const id = ++bubbleIdCounter;
    const size = BUBBLE_SIZES[Math.floor(Math.random() * BUBBLE_SIZES.length)];
    const left = 5 + Math.random() * 85;
    const emoji = PEARL_EMOJIS[Math.floor(Math.random() * PEARL_EMOJIS.length)];

    const bubble = { id, left, size, emoji, riseDuration, createdAt: Date.now() };
    setBubbles((prev) => [...prev, bubble]);

    // Auto-remove after it floats off screen
    setTimeout(() => {
      setBubbles((prev) => prev.filter((b) => b.id !== id));
    }, riseDuration * 1000 + 200);
  }, [getDifficulty]);

  const popBubble = useCallback((e, bubble) => {
    e.stopPropagation();
    SoundManager.playPop();
    setBubbles((prev) => prev.filter((b) => b.id !== bubble.id));

    // Pop animation particle
    setPops((prev) => [...prev, { id: bubble.id, x: bubble.left, y: e.clientY }]);
    setTimeout(() => {
      setPops((prev) => prev.filter((p) => p.id !== bubble.id));
    }, 600);

    setPearls((prev) => {
      const next = prev + 1;
      if (next >= WIN_TARGET) {
        endGame(true);
      }
      return next;
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const startGame = useCallback(() => {
    setGameState('playing');
    setPearls(0);
    setTimeLeft(GAME_DURATION);
    setBubbles([]);
    setPops([]);
    elapsedRef.current = 0;
    bubbleIdCounter = 0;
  }, []);

  const endGame = useCallback((won) => {
    clearInterval(timerRef.current);
    clearInterval(spawnRef.current);
    setGameState(won ? 'won' : 'lost');
    if (won) {
      SoundManager.playSuccess();
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, []);

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    timerRef.current = setInterval(() => {
      elapsedRef.current += 1;
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [gameState, endGame]);

  // Spawner
  useEffect(() => {
    if (gameState !== 'playing') return;

    const scheduleSpawn = () => {
      const { spawnInterval } = getDifficulty();
      spawnRef.current = setTimeout(() => {
        spawnBubble();
        scheduleSpawn();
      }, spawnInterval);
    };

    scheduleSpawn();
    return () => clearTimeout(spawnRef.current);
  }, [gameState, getDifficulty, spawnBubble]);

  const progressPct = Math.min((pearls / WIN_TARGET) * 100, 100);

  return (
    <div className="pearl-wrapper">
      <Confetti show={showConfetti} />

      {/* Header */}
      <div className="pearl-header">
        <motion.button
          className="pearl-back-btn"
          onClick={onClose}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          &larr; Back to Hall
        </motion.button>
        <h2 className="pearl-title">Mermaid's Pearl Dive</h2>
        <div className="pearl-stats">
          <span className="pearl-stat-item">
            <span className="pearl-stat-icon">&#128368;</span> {timeLeft}s
          </span>
          <span className="pearl-stat-item">
            <span className="pearl-stat-icon">&#129522;</span> {pearls}/{WIN_TARGET}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      {gameState === 'playing' && (
        <div className="pearl-progress-bar">
          <motion.div
            className="pearl-progress-fill"
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {/* Game area */}
      <div className="pearl-ocean" ref={gameRef}>
        {/* Seaweed */}
        {seaweed.map((sw) => (
          <div
            key={sw.id}
            className="pearl-seaweed"
            style={{
              left: sw.left,
              height: `${sw.height}px`,
              animationDelay: `${sw.delay}s`,
              '--sw-hue': sw.hue,
            }}
          />
        ))}

        {/* Background bubbles */}
        {bgBubbles.map((b) => (
          <div
            key={b.id}
            className="pearl-bg-bubble"
            style={{
              left: b.left,
              width: `${b.size}px`,
              height: `${b.size}px`,
              '--bg-dur': `${b.duration}s`,
              '--bg-delay': `${b.delay}s`,
            }}
          />
        ))}

        {/* Ready screen */}
        {gameState === 'ready' && (
          <motion.div
            className="pearl-start-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="pearl-start-content">
              <span className="pearl-start-icon">&#129500;&#8205;&#9792;&#65039;</span>
              <h3 className="pearl-start-title">Mermaid's Pearl Dive</h3>
              <p className="pearl-start-desc">
                Pop the bubbles to collect pearls!<br />
                Catch <strong>{WIN_TARGET}</strong> pearls in <strong>{GAME_DURATION}</strong> seconds to win.
              </p>
              <motion.button
                className="pearl-start-btn"
                onClick={startGame}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                Dive In!
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Bubbles */}
        <AnimatePresence>
          {bubbles.map((bubble) => (
            <motion.div
              key={bubble.id}
              className="pearl-bubble"
              style={{
                left: `${bubble.left}%`,
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
              }}
              initial={{ bottom: -80, opacity: 0.7, scale: 0.5 }}
              animate={{
                bottom: '110%',
                opacity: [0.7, 1, 1, 0.6],
                scale: [0.5, 1, 1, 0.9],
              }}
              transition={{ duration: bubble.riseDuration, ease: 'linear' }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={(e) => popBubble(e, bubble)}
              whileHover={{ scale: 1.15 }}
            >
              <span className="pearl-bubble-emoji">{bubble.emoji}</span>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Pop particles */}
        {pops.map((pop) => (
          <div
            key={pop.id}
            className="pearl-pop-burst"
            style={{ left: `${pop.x}%`, top: `50%` }}
          >
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <span key={i} className="pearl-pop-particle" style={{ '--p-angle': `${i * 60}deg` }} />
            ))}
          </div>
        ))}

        {/* Floor decoration */}
        <div className="pearl-ocean-floor">
          <span className="pearl-floor-item" style={{ left: '10%' }}>&#127802;</span>
          <span className="pearl-floor-item" style={{ left: '30%' }}>&#129422;</span>
          <span className="pearl-floor-item" style={{ left: '55%' }}>&#127802;</span>
          <span className="pearl-floor-item" style={{ left: '75%' }}>&#11088;</span>
          <span className="pearl-floor-item" style={{ left: '90%' }}>&#129422;</span>
        </div>
      </div>

      {/* Win/Lose overlay */}
      <AnimatePresence>
        {(gameState === 'won' || gameState === 'lost') && (
          <motion.div
            className="pearl-result-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="pearl-result-card"
              initial={{ scale: 0.5, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', damping: 12 }}
            >
              {gameState === 'won' ? (
                <>
                  <span className="pearl-result-icon">&#129500;&#8205;&#9792;&#65039;</span>
                  <h2 className="pearl-result-title">Magnificent Dive!</h2>
                  <p className="pearl-result-text">
                    You collected <strong>{pearls}</strong> pearls!<br />
                    The ocean crowns you Mermaid Queen!
                  </p>
                  <motion.button
                    className="pearl-claim-btn"
                    onClick={() => onWin && onWin('pearl')}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Claim Badge &#129522;
                  </motion.button>
                </>
              ) : (
                <>
                  <span className="pearl-result-icon">&#127754;</span>
                  <h2 className="pearl-result-title">The Tide Swept Away...</h2>
                  <p className="pearl-result-text">
                    You collected <strong>{pearls}/{WIN_TARGET}</strong> pearls.<br />
                    Dive again and claim those pearls!
                  </p>
                  <motion.button
                    className="pearl-retry-btn"
                    onClick={startGame}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Dive Again
                  </motion.button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PearlDive;
