import React, { useMemo } from 'react';

const PARTICLES = ['✨', '🌟', '💎', '🦋', '🌸', '💫', '💫', '🔮', '🌸', '🌙', '🐚', '📿'];

function FloatingParticles() {
  const particles = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      emoji: PARTICLES[i % PARTICLES.length],
      left: `${Math.random() * 100}%`,
      size: `${10 + Math.random() * 14}px`,
      duration: `${12 + Math.random() * 20}s`,
      delay: `${Math.random() * 15}s`,
    }));
  }, []);

  return (
    <div className="particles-container">
      {particles.map((p) => (
        <span
          key={p.id}
          className="floating-particle"
          style={{
            left: p.left,
            '--size': p.size,
            '--duration': p.duration,
            '--delay': p.delay,
            fontSize: p.size,
            bottom: '-20px',
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}

export default FloatingParticles;
