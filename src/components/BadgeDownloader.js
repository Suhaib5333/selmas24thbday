import React, { useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

const BADGE_SIZE = 500;

function drawGemBadge(ctx) {
  const w = BADGE_SIZE;
  const h = BADGE_SIZE;

  // Background gradient - deep purple to dark
  const bg = ctx.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, w / 2);
  bg.addColorStop(0, '#4a1a6b');
  bg.addColorStop(0.6, '#2d0f42');
  bg.addColorStop(1, '#1a0a2e');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Ornate border - double ring
  ctx.strokeStyle = '#c9a84c';
  ctx.lineWidth = 4;
  ctx.strokeRect(16, 16, w - 32, h - 32);
  ctx.strokeStyle = '#c9a84c88';
  ctx.lineWidth = 2;
  ctx.strokeRect(26, 26, w - 52, h - 52);

  // Corner ornaments
  const corners = [[30, 30], [w - 30, 30], [30, h - 30], [w - 30, h - 30]];
  corners.forEach(([cx, cy]) => {
    ctx.fillStyle = '#c9a84c';
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();
  });

  // Crystal shapes in background
  ctx.globalAlpha = 0.15;
  const crystalPositions = [
    [80, 120], [400, 100], [120, 380], [380, 400],
    [250, 80], [60, 250], [440, 250], [250, 430],
  ];
  crystalPositions.forEach(([cx, cy]) => {
    ctx.fillStyle = '#b8a9c9';
    ctx.beginPath();
    ctx.moveTo(cx, cy - 20);
    ctx.lineTo(cx + 12, cy);
    ctx.lineTo(cx, cy + 20);
    ctx.lineTo(cx - 12, cy);
    ctx.closePath();
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  // Central gem illustration
  const gcx = w / 2;
  const gcy = 180;
  // Gem body
  const gemGrad = ctx.createLinearGradient(gcx - 40, gcy - 40, gcx + 40, gcy + 40);
  gemGrad.addColorStop(0, '#a78bfa');
  gemGrad.addColorStop(0.5, '#7c3aed');
  gemGrad.addColorStop(1, '#4c1d95');
  ctx.fillStyle = gemGrad;
  ctx.beginPath();
  ctx.moveTo(gcx, gcy - 45);
  ctx.lineTo(gcx + 40, gcy - 15);
  ctx.lineTo(gcx + 30, gcy + 35);
  ctx.lineTo(gcx - 30, gcy + 35);
  ctx.lineTo(gcx - 40, gcy - 15);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#c9a84c';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Gem sparkle lines
  ctx.strokeStyle = '#ffd89b';
  ctx.lineWidth = 1.5;
  [[gcx - 55, gcy - 30], [gcx + 55, gcy - 30], [gcx, gcy - 65], [gcx - 50, gcy + 20], [gcx + 50, gcy + 20]].forEach(([sx, sy]) => {
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + (sx < gcx ? -8 : sx > gcx ? 8 : 0), sy + (sy < gcy ? -8 : 8));
    ctx.stroke();
  });

  // Title text
  ctx.fillStyle = '#c9a84c';
  ctx.font = 'bold 36px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('Selma the', gcx, 280);
  ctx.font = 'bold 42px Georgia, serif';
  ctx.fillText('Gem Hunter', gcx, 328);

  // Decorative line
  ctx.strokeStyle = '#c9a84c88';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(120, 350);
  ctx.lineTo(380, 350);
  ctx.stroke();

  // Subtitle
  ctx.fillStyle = '#e1bee7';
  ctx.font = 'italic 20px Georgia, serif';
  ctx.fillText('24th Birthday Museum', gcx, 390);
  ctx.font = '18px Georgia, serif';
  ctx.fillText('2026', gcx, 420);

  // Bottom ornament
  ctx.fillStyle = '#c9a84c';
  ctx.font = '28px serif';
  ctx.fillText('\u2726 \u2727 \u2726', gcx, 460);
}

function drawWizardBadge(ctx) {
  const w = BADGE_SIZE;
  const h = BADGE_SIZE;

  // Parchment background
  const bg = ctx.createRadialGradient(w / 2, h / 2, 30, w / 2, h / 2, w / 2);
  bg.addColorStop(0, '#f5e6c8');
  bg.addColorStop(0.7, '#e8d5a3');
  bg.addColorStop(1, '#d4bc82');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Parchment texture noise (subtle)
  ctx.globalAlpha = 0.05;
  for (let i = 0; i < 800; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? '#000' : '#8B4513';
    ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
  }
  ctx.globalAlpha = 1;

  // Maroon border
  ctx.strokeStyle = '#7b2d26';
  ctx.lineWidth = 5;
  ctx.strokeRect(14, 14, w - 28, h - 28);
  ctx.strokeStyle = '#7b2d2666';
  ctx.lineWidth = 2;
  ctx.strokeRect(24, 24, w - 48, h - 48);

  // Corner stars
  const corners = [[34, 34], [w - 34, 34], [34, h - 34], [w - 34, h - 34]];
  ctx.fillStyle = '#c9a84c';
  ctx.font = '16px serif';
  ctx.textAlign = 'center';
  corners.forEach(([cx, cy]) => {
    ctx.fillText('\u2605', cx, cy + 5);
  });

  // Background stars
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = '#7b2d26';
  for (let i = 0; i < 20; i++) {
    const sx = 50 + Math.random() * (w - 100);
    const sy = 50 + Math.random() * (h - 100);
    ctx.font = `${8 + Math.random() * 14}px serif`;
    ctx.fillText('\u2605', sx, sy);
  }
  ctx.globalAlpha = 1;

  // Wand illustration
  const wcx = w / 2;
  ctx.save();
  ctx.translate(wcx, 150);
  ctx.rotate(-0.3);
  // Wand body
  const wandGrad = ctx.createLinearGradient(-4, -50, 4, 50);
  wandGrad.addColorStop(0, '#8B4513');
  wandGrad.addColorStop(0.3, '#a0522d');
  wandGrad.addColorStop(1, '#654321');
  ctx.fillStyle = wandGrad;
  ctx.beginPath();
  ctx.roundRect(-4, -45, 8, 90, 3);
  ctx.fill();
  // Wand tip spark
  ctx.fillStyle = '#ffd700';
  ctx.beginPath();
  ctx.arc(0, -48, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Spark lines from wand tip
  ctx.strokeStyle = '#c9a84c';
  ctx.lineWidth = 1.5;
  const tipX = wcx - 15;
  const tipY = 100;
  [[-20, -15], [-10, -25], [5, -22], [15, -10], [-25, 0]].forEach(([dx, dy]) => {
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(tipX + dx, tipY + dy);
    ctx.stroke();
  });

  // Shield/crest shape behind text
  ctx.fillStyle = '#7b2d2615';
  ctx.beginPath();
  ctx.moveTo(wcx, 210);
  ctx.quadraticCurveTo(wcx + 100, 230, wcx + 90, 340);
  ctx.quadraticCurveTo(wcx, 390, wcx, 390);
  ctx.quadraticCurveTo(wcx, 390, wcx - 90, 340);
  ctx.quadraticCurveTo(wcx - 100, 230, wcx, 210);
  ctx.fill();

  // Title
  ctx.fillStyle = '#7b2d26';
  ctx.font = 'bold 36px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('Selma of', wcx, 270);
  ctx.font = 'bold 44px Georgia, serif';
  ctx.fillText('Hogwarts', wcx, 320);

  // Decorative line
  ctx.strokeStyle = '#7b2d2688';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(130, 340);
  ctx.lineTo(370, 340);
  ctx.stroke();

  // Subtitle
  ctx.fillStyle = '#8B4513';
  ctx.font = 'italic 22px Georgia, serif';
  ctx.fillText('Witch of the Year', wcx, 380);
  ctx.font = '20px Georgia, serif';
  ctx.fillText('2026', wcx, 412);

  // Bottom ornament
  ctx.fillStyle = '#c9a84c';
  ctx.font = '24px serif';
  ctx.fillText('\u2605 \u2726 \u2605', wcx, 458);
}

function drawPearlBadge(ctx) {
  const w = BADGE_SIZE;
  const h = BADGE_SIZE;

  // Ocean gradient background
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, '#0d4f6b');
  bg.addColorStop(0.4, '#0a6b7c');
  bg.addColorStop(0.7, '#0d8b8b');
  bg.addColorStop(1, '#064e5e');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Wave patterns
  ctx.globalAlpha = 0.1;
  ctx.strokeStyle = '#b2ebf2';
  ctx.lineWidth = 2;
  for (let row = 0; row < 8; row++) {
    const y = 50 + row * 60;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 2) {
      const wave = Math.sin((x / 60) + row) * 12;
      if (x === 0) ctx.moveTo(x, y + wave);
      else ctx.lineTo(x, y + wave);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Border
  ctx.strokeStyle = '#80deea';
  ctx.lineWidth = 4;
  ctx.strokeRect(16, 16, w - 32, h - 32);
  ctx.strokeStyle = '#80deea55';
  ctx.lineWidth = 2;
  ctx.strokeRect(26, 26, w - 52, h - 52);

  // Corner pearls
  const corners = [[34, 34], [w - 34, 34], [34, h - 34], [w - 34, h - 34]];
  corners.forEach(([cx, cy]) => {
    const pg = ctx.createRadialGradient(cx - 2, cy - 2, 1, cx, cy, 7);
    pg.addColorStop(0, '#fff');
    pg.addColorStop(0.5, '#e0f7fa');
    pg.addColorStop(1, '#80cbc4');
    ctx.fillStyle = pg;
    ctx.beginPath();
    ctx.arc(cx, cy, 7, 0, Math.PI * 2);
    ctx.fill();
  });

  // Pearl cluster in center
  const pcx = w / 2;
  const pcy = 155;
  const pearlPositions = [
    [0, 0, 22], [-30, 10, 16], [30, 10, 16],
    [-18, -22, 14], [18, -22, 14],
  ];
  pearlPositions.forEach(([dx, dy, r]) => {
    const pg = ctx.createRadialGradient(pcx + dx - 3, pcy + dy - 3, 2, pcx + dx, pcy + dy, r);
    pg.addColorStop(0, '#ffffff');
    pg.addColorStop(0.3, '#e8f5f7');
    pg.addColorStop(0.7, '#b2dfdb');
    pg.addColorStop(1, '#80cbc4');
    ctx.fillStyle = pg;
    ctx.beginPath();
    ctx.arc(pcx + dx, pcy + dy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#80deea44';
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // Shell behind pearls
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = '#f8bbd0';
  ctx.beginPath();
  ctx.ellipse(pcx, pcy + 30, 55, 25, 0, 0, Math.PI);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Title
  ctx.fillStyle = '#e0f7fa';
  ctx.font = 'bold 34px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('Selma the', pcx, 250);
  ctx.font = 'bold 42px Georgia, serif';
  ctx.fillText('Pearl Diver', pcx, 298);

  // Decorative wave line
  ctx.strokeStyle = '#80deea88';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let x = 120; x <= 380; x += 2) {
    const y = 318 + Math.sin((x - 120) / 15) * 4;
    if (x === 120) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Subtitle
  ctx.fillStyle = '#b2ebf2';
  ctx.font = 'italic 22px Georgia, serif';
  ctx.fillText('Mermaid Queen', pcx, 360);
  ctx.font = '20px Georgia, serif';
  ctx.fillText('2026', pcx, 395);

  // Bottom bubbles decoration
  const bubblePos = [[180, 435], [220, 445], [260, 430], [300, 448], [340, 438]];
  bubblePos.forEach(([bx, by]) => {
    const r = 4 + Math.random() * 4;
    ctx.strokeStyle = '#80deea66';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(bx, by, r, 0, Math.PI * 2);
    ctx.stroke();
  });

  // Bottom ornament
  ctx.fillStyle = '#80deea';
  ctx.font = '24px serif';
  ctx.fillText('\u2022 \u25C6 \u2022', pcx, 472);
}

const BADGE_CONFIGS = {
  gem: { draw: drawGemBadge, filename: 'selma-gem-hunter-badge.png' },
  wizard: { draw: drawWizardBadge, filename: 'selma-hogwarts-badge.png' },
  pearl: { draw: drawPearlBadge, filename: 'selma-pearl-diver-badge.png' },
};

function BadgeDownloader({ type, onClose }) {
  const canvasRef = useRef(null);
  const config = BADGE_CONFIGS[type];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !config) return;

    canvas.width = BADGE_SIZE;
    canvas.height = BADGE_SIZE;
    const ctx = canvas.getContext('2d');
    config.draw(ctx);
  }, [type, config]);

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !config) return;

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = config.filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [config]);

  if (!config) return null;

  return (
    <motion.div
      className="badge-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="badge-modal"
        initial={{ scale: 0.6, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 14 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="badge-modal-title">Your Badge!</h2>
        <div className="badge-canvas-wrapper">
          <canvas ref={canvasRef} className="badge-canvas" />
        </div>
        <div className="badge-modal-actions">
          <motion.button
            className="badge-download-btn"
            onClick={handleDownload}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Download Badge
          </motion.button>
          <motion.button
            className="badge-close-btn"
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Close
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default BadgeDownloader;
