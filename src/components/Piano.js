import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Note definitions: C4 → C6 (25 keys) ─── */
const NOTES = [
  { note: 'C4',  freq: 261.63, type: 'white', label: 'C4' },
  { note: 'C#4', freq: 277.18, type: 'black', label: 'C#' },
  { note: 'D4',  freq: 293.66, type: 'white', label: 'D4' },
  { note: 'D#4', freq: 311.13, type: 'black', label: 'D#' },
  { note: 'E4',  freq: 329.63, type: 'white', label: 'E4' },
  { note: 'F4',  freq: 349.23, type: 'white', label: 'F4' },
  { note: 'F#4', freq: 369.99, type: 'black', label: 'F#' },
  { note: 'G4',  freq: 392.00, type: 'white', label: 'G4' },
  { note: 'G#4', freq: 415.30, type: 'black', label: 'G#' },
  { note: 'A4',  freq: 440.00, type: 'white', label: 'A4' },
  { note: 'A#4', freq: 466.16, type: 'black', label: 'A#' },
  { note: 'B4',  freq: 493.88, type: 'white', label: 'B4' },
  { note: 'C5',  freq: 523.25, type: 'white', label: 'C5' },
  { note: 'C#5', freq: 554.37, type: 'black', label: 'C#' },
  { note: 'D5',  freq: 587.33, type: 'white', label: 'D5' },
  { note: 'D#5', freq: 622.25, type: 'black', label: 'D#' },
  { note: 'E5',  freq: 659.25, type: 'white', label: 'E5' },
  { note: 'F5',  freq: 698.46, type: 'white', label: 'F5' },
  { note: 'F#5', freq: 739.99, type: 'black', label: 'F#' },
  { note: 'G5',  freq: 783.99, type: 'white', label: 'G5' },
  { note: 'G#5', freq: 830.61, type: 'black', label: 'G#' },
  { note: 'A5',  freq: 880.00, type: 'white', label: 'A5' },
  { note: 'A#5', freq: 932.33, type: 'black', label: 'A#' },
  { note: 'B5',  freq: 987.77, type: 'white', label: 'B5' },
  { note: 'C6',  freq: 1046.50, type: 'white', label: 'C6' },
];

/* Keyboard mapping — two rows for two octaves */
const KEY_MAP = {
  /* Octave 1 – white keys */
  a: 'C4', s: 'D4', d: 'E4', f: 'F4', g: 'G4', h: 'A4', j: 'B4',
  /* Octave 1 – black keys */
  w: 'C#4', e: 'D#4', t: 'F#4', y: 'G#4', u: 'A#4',
  /* Octave 2 – white keys */
  k: 'C5', l: 'D5', ';': 'E5', z: 'F5', x: 'G5', c: 'A5', v: 'B5',
  /* Octave 2 – black keys */
  o: 'C#5', p: 'D#5', b: 'F#5', n: 'G#5', m: 'A#5',
  /* Top C */
  ',': 'C6',
};

/* Reverse map for showing key hints */
const NOTE_TO_KEY = Object.fromEntries(
  Object.entries(KEY_MAP).map(([k, v]) => [v, k.toUpperCase()])
);

/* ─── Audio engine ─── */
class PianoAudio {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
  }

  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.35;
    this.masterGain.connect(this.ctx.destination);
  }

  play(freq) {
    this.init();
    const now = this.ctx.currentTime;

    /* ── Two oscillators for warmth ── */
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    osc1.type = 'triangle';
    osc2.type = 'sine';
    osc1.frequency.value = freq;
    osc2.frequency.value = freq;

    /* Slight detune on the second oscillator for richness */
    osc2.detune.value = 3;

    /* ── Per-note gain with ADSR envelope ── */
    const noteGain = this.ctx.createGain();
    noteGain.gain.setValueAtTime(0, now);

    /* Attack (fast) */
    noteGain.gain.linearRampToValueAtTime(0.6, now + 0.01);
    /* Decay → Sustain */
    noteGain.gain.exponentialRampToValueAtTime(0.25, now + 0.15);
    /* Sustain hold */
    noteGain.gain.setValueAtTime(0.25, now + 0.15);
    /* Release */
    noteGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

    /* Second oscillator is quieter */
    const noteGain2 = this.ctx.createGain();
    noteGain2.gain.setValueAtTime(0, now);
    noteGain2.gain.linearRampToValueAtTime(0.3, now + 0.01);
    noteGain2.gain.exponentialRampToValueAtTime(0.12, now + 0.15);
    noteGain2.gain.setValueAtTime(0.12, now + 0.15);
    noteGain2.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

    /* Connect graph */
    osc1.connect(noteGain);
    osc2.connect(noteGain2);
    noteGain.connect(this.masterGain);
    noteGain2.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 2);
    osc2.stop(now + 2);
  }
}

/* ─── Component ─── */
export default function Piano({ isOpen, onClose }) {
  const [activeNotes, setActiveNotes] = useState(new Set());
  const audioRef = useRef(null);

  /* Lazy-init audio engine */
  const getAudio = useCallback(() => {
    if (!audioRef.current) audioRef.current = new PianoAudio();
    return audioRef.current;
  }, []);

  const playNote = useCallback((note) => {
    const n = NOTES.find((n) => n.note === note);
    if (!n) return;
    getAudio().play(n.freq);
    setActiveNotes((prev) => new Set(prev).add(note));
    setTimeout(() => {
      setActiveNotes((prev) => {
        const next = new Set(prev);
        next.delete(note);
        return next;
      });
    }, 300);
  }, [getAudio]);

  /* Keyboard listeners */
  useEffect(() => {
    if (!isOpen) return;
    const held = new Set();

    const handleDown = (e) => {
      if (e.repeat) return;
      const key = e.key.toLowerCase();
      if (KEY_MAP[key] && !held.has(key)) {
        held.add(key);
        playNote(KEY_MAP[key]);
      }
      if (e.key === 'Escape') onClose();
    };

    const handleUp = (e) => {
      held.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
    };
  }, [isOpen, playNote, onClose]);

  /* ─── Render helpers ─── */
  const whiteKeys = NOTES.filter((n) => n.type === 'white');
  const blackKeys = NOTES.filter((n) => n.type === 'black');

  /* Map each black key to its position among white keys — percentage-based */
  const whiteCount = whiteKeys.length;
  const blackKeyPositions = blackKeys.map((bk) => {
    const idx = NOTES.indexOf(bk);
    const whitesBefore = NOTES.slice(0, idx).filter((n) => n.type === 'white').length;
    // Position between the white key before and after
    const leftPercent = ((whitesBefore - 0.5) / whiteCount) * 100;
    return { ...bk, leftPercent };
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="piano-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            className="piano-modal"
            initial={{ scale: 0.85, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 40 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          >
            {/* Close button */}
            <motion.button
              className="piano-close"
              onClick={onClose}
              whileHover={{ scale: 1.15, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              &times;
            </motion.button>

            <h2 className="piano-title">Enchanted Piano</h2>
            <p className="piano-subtitle">
              Click the keys or use your keyboard to play
            </p>

            {/* Keyboard */}
            <div className="piano-keyboard">
              {/* White keys */}
              {whiteKeys.map((key) => {
                const isActive = activeNotes.has(key.note);
                return (
                  <motion.div
                    key={key.note}
                    className={`piano-key piano-key--white ${isActive ? 'piano-key--active' : ''}`}
                    onPointerDown={() => playNote(key.note)}
                    whileTap={{ scale: 0.97 }}
                    initial={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.3), inset 0 -3px 4px rgba(0,0,0,0.05)',
                    }}
                    animate={isActive ? {
                      backgroundColor: 'rgba(201, 168, 76, 0.25)',
                      boxShadow: '0 0 20px rgba(201, 168, 76, 0.6), inset 0 -4px 8px rgba(201, 168, 76, 0.2)',
                    } : {
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.3), inset 0 -3px 4px rgba(0,0,0,0.05)',
                    }}
                    transition={{ duration: 0.15 }}
                  >
                    <span className="piano-key-label">{key.label}</span>
                    {NOTE_TO_KEY[key.note] && (
                      <span className="piano-key-hint">{NOTE_TO_KEY[key.note]}</span>
                    )}
                  </motion.div>
                );
              })}

              {/* Black keys — absolutely positioned */}
              {blackKeyPositions.map((key) => {
                const isActive = activeNotes.has(key.note);

                return (
                  <motion.div
                    key={key.note}
                    className={`piano-key piano-key--black ${isActive ? 'piano-key--active' : ''}`}
                    style={{ left: `${key.leftPercent}%` }}
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      playNote(key.note);
                    }}
                    whileTap={{ scale: 0.95 }}
                    initial={{
                      backgroundColor: '#1a1520',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.6), inset 0 -2px 3px rgba(255,255,255,0.05)',
                    }}
                    animate={isActive ? {
                      backgroundColor: '#c9a84c',
                      boxShadow: '0 0 18px rgba(201, 168, 76, 0.8), 0 2px 8px rgba(0,0,0,0.5)',
                    } : {
                      backgroundColor: '#1a1520',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.6), inset 0 -2px 3px rgba(255,255,255,0.05)',
                    }}
                    transition={{ duration: 0.12 }}
                  >
                    <span className="piano-key-label">{key.label}</span>
                    {NOTE_TO_KEY[key.note] && (
                      <span className="piano-key-hint">{NOTE_TO_KEY[key.note]}</span>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <p className="piano-hint-text">
              Keys: A-J (octave 1) &middot; K-L ; Z-V (octave 2) &middot; Sharps: W E T Y U O P B N M
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
