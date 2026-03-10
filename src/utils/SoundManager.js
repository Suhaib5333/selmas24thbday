/**
 * SoundManager — Web Audio API synthesizer for a magical birthday museum.
 * No audio files needed; every sound is built from oscillators, noise, and envelopes.
 */

class _SoundManager {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.ambientNodes = null;
    this._volume = 0.5;
  }

  /* ─── helpers ─── */

  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this._volume;
    this.masterGain.connect(this.ctx.destination);
  }

  setVolume(level) {
    this._volume = Math.max(0, Math.min(1, level));
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(this._volume, this.ctx.currentTime, 0.05);
    }
  }

  _osc(type, freq, startTime, duration, gainVal = 0.3) {
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, startTime);
    g.gain.linearRampToValueAtTime(gainVal, startTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  _noise(startTime, duration, gainVal = 0.15) {
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 3000;
    filter.Q.value = 0.8;

    const g = this.ctx.createGain();
    g.gain.setValueAtTime(gainVal, startTime);
    g.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    src.connect(filter);
    filter.connect(g);
    g.connect(this.masterGain);
    src.start(startTime);
    src.stop(startTime + duration);
  }

  /* ─── sounds ─── */

  playChime() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    // Ascending magical arpeggio: C5 E5 G5 C6
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      this._osc('sine', freq, t + i * 0.12, 0.6, 0.2);
      this._osc('triangle', freq * 2, t + i * 0.12, 0.4, 0.06); // shimmer overtone
    });
    // Final sparkle
    this._osc('sine', 1568, t + 0.55, 0.8, 0.1);
  }

  playClick() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this._osc('sine', 800, t, 0.06, 0.12);
    this._osc('triangle', 1200, t, 0.04, 0.06);
  }

  playSparkle() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const freqs = [2400, 3200, 4000, 3600, 4800];
    freqs.forEach((f, i) => {
      this._osc('sine', f, t + i * 0.05, 0.15, 0.08);
    });
    this._noise(t, 0.2, 0.04);
  }

  playSuccess() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    // Triumphant fanfare: G4 C5 E5 G5 — held longer
    const fanfare = [
      { f: 392, t: 0, d: 0.3 },
      { f: 523.25, t: 0.15, d: 0.3 },
      { f: 659.25, t: 0.3, d: 0.35 },
      { f: 783.99, t: 0.45, d: 0.5 },
      { f: 1046.5, t: 0.6, d: 0.7 },
    ];
    fanfare.forEach((n) => {
      this._osc('sine', n.f, t + n.t, n.d, 0.18);
      this._osc('triangle', n.f, t + n.t, n.d, 0.08);
    });
    // Sparkle finish
    [2000, 2600, 3200].forEach((f, i) => {
      this._osc('sine', f, t + 0.9 + i * 0.06, 0.25, 0.06);
    });
  }

  playPop() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    // Quick descending pop
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(150, t + 0.12);
    g.gain.setValueAtTime(0.25, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.15);

    this._noise(t, 0.08, 0.08);
  }

  playCorrect() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    // Two-tone ascending ding
    this._osc('sine', 880, t, 0.2, 0.2);
    this._osc('sine', 1174.66, t + 0.1, 0.3, 0.2);
    this._osc('triangle', 1174.66 * 2, t + 0.1, 0.2, 0.05);
  }

  playWrong() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    // Low descending buzz
    this._osc('sawtooth', 220, t, 0.2, 0.1);
    this._osc('sawtooth', 185, t + 0.12, 0.25, 0.1);
    this._noise(t, 0.15, 0.06);
  }

  playCollect() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    // Quick ascending twinkle
    this._osc('sine', 1200, t, 0.12, 0.18);
    this._osc('sine', 1600, t + 0.06, 0.12, 0.18);
    this._osc('sine', 2000, t + 0.12, 0.2, 0.14);
    this._noise(t + 0.05, 0.1, 0.03);
  }

  playSeal() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    // Wax seal crack + warm reveal
    this._noise(t, 0.12, 0.15); // crack
    this._osc('sine', 300, t, 0.15, 0.12); // thud
    // Warm reveal tone
    this._osc('sine', 440, t + 0.15, 0.5, 0.12);
    this._osc('triangle', 660, t + 0.25, 0.4, 0.08);
    this._osc('sine', 880, t + 0.35, 0.45, 0.06);
  }

  playBadge() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    // Celebration: quick ascending run then shimmering hold
    const run = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    run.forEach((f, i) => {
      this._osc('sine', f, t + i * 0.08, 0.25, 0.15);
    });
    // Shimmer
    [1568, 2093, 2637].forEach((f, i) => {
      this._osc('sine', f, t + 0.5 + i * 0.07, 0.5, 0.06);
      this._osc('triangle', f, t + 0.55 + i * 0.07, 0.4, 0.03);
    });
    this._noise(t + 0.5, 0.3, 0.03);
  }

  /* ─── ambient: music-box melody only (no static pad) ─── */

  startAmbient() {
    if (!this.ctx || this._ambientLoop) return;
    this._ambientLoop = true;
    this._playMusicBoxLoop();
  }

  _playMusicBoxLoop() {
    if (!this._ambientLoop || !this.ctx) return;

    const t = this.ctx.currentTime;
    // Cute, gentle pentatonic melodies — like a music box
    const melodies = [
      [523.25, 659.25, 783.99, 880.0, 783.99, 659.25, 587.33, 523.25],
      [659.25, 783.99, 880.0, 1046.5, 880.0, 783.99, 659.25, 523.25],
      [783.99, 659.25, 523.25, 587.33, 659.25, 783.99, 880.0, 783.99],
      [523.25, 587.33, 659.25, 523.25, 880.0, 783.99, 659.25, 587.33],
    ];
    const melody = melodies[Math.floor(Math.random() * melodies.length)];
    const noteSpacing = 0.5;
    const noteDuration = 0.7;

    melody.forEach((freq, i) => {
      if (!this._ambientLoop) return;
      const noteTime = t + i * noteSpacing;

      // Soft sine — music box tone
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0, noteTime);
      g.gain.linearRampToValueAtTime(0.04, noteTime + 0.015);
      g.gain.exponentialRampToValueAtTime(0.001, noteTime + noteDuration);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(noteTime);
      osc.stop(noteTime + noteDuration + 0.1);
    });

    // Schedule next loop with a nice pause between phrases
    const loopDuration = melody.length * noteSpacing + 3.5;
    this._ambientTimer = setTimeout(() => {
      this._playMusicBoxLoop();
    }, loopDuration * 1000);
  }

  stopAmbient() {
    this._ambientLoop = false;
    if (this._ambientTimer) {
      clearTimeout(this._ambientTimer);
      this._ambientTimer = null;
    }
  }
}

const SoundManager = new _SoundManager();
export default SoundManager;
