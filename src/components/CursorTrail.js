import { useEffect, useCallback, useRef } from 'react';

const TRAIL_EMOJIS = ['✨', '💫', '🌟', '⭐', '✨'];

function CursorTrail() {
  const lastTime = useRef(0);

  const handleMouseMove = useCallback((e) => {
    const now = Date.now();
    if (now - lastTime.current < 80) return;
    lastTime.current = now;

    const particle = document.createElement('span');
    particle.className = 'cursor-particle';
    particle.textContent = TRAIL_EMOJIS[Math.floor(Math.random() * TRAIL_EMOJIS.length)];

    const tx = -30 + Math.random() * 60;
    const ty = -50 + Math.random() * -30;

    particle.style.left = `${e.clientX}px`;
    particle.style.top = `${e.clientY}px`;
    particle.style.setProperty('--tx', `${tx}px`);
    particle.style.setProperty('--ty', `${ty}px`);

    document.body.appendChild(particle);

    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 1500);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return null;
}

export default CursorTrail;
