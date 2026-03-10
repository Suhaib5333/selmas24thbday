import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SectionTitle from './SectionTitle';
import SoundManager from '../utils/SoundManager';

function StampLetter() {
  const [sealBroken, setSealBroken] = useState(false);

  const letterLines = [
    "Dearest Selma,",
    "",
    "On this most magical of days, as you turn twenty-four,",
    "we wanted to create something as extraordinary as you.",
    "",
    "You are the fairy dust in our lives,",
    "the pearl in an ocean of ordinary,",
    "the rarest gem in any treasure room.",
    "",
    "Your curls hold galaxies,",
    "your laughter moves mountains,",
    "and your heart — oh, your heart —",
    "it's the most beautiful museum piece of all.",
    "",
    "Here's to more books, more adventures,",
    "more mermaid dreams and fairy tales.",
    "Here's to YOU, in all your magnificent glory.",
    "",
    "Happy 24th Birthday, our dearest Selma.",
    "The world is better because you're in it.",
  ];

  return (
    <section className="letter-section" id="letter">
      <motion.div
        className="letter-envelope"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <SectionTitle
          ornament="💌"
          title="A Letter For You"
          subtitle="Sealed with love"
        />

        <div className="envelope-outer">
          <div className="envelope-inner">
            <div className="stamp">🧚</div>

            <p className="letter-date">March 2026</p>

            {sealBroken ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                <div className="letter-body">
                  {letterLines.map((line, i) => (
                    <motion.span
                      key={i}
                      style={{ display: 'block' }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.12, duration: 0.5 }}
                    >
                      {line || <br />}
                    </motion.span>
                  ))}
                </div>
                <motion.div
                  className="letter-signature"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: letterLines.length * 0.12 + 0.5 }}
                >
                  With all our love, always & forever 💛
                  <br />
                  — Suhaib, Mirna, Dana, Taliah & Fatima
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                style={{ textAlign: 'center', padding: '3rem 0' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p style={{
                  fontFamily: "'Dancing Script', cursive",
                  fontSize: '1.2rem',
                  color: '#8b7355',
                  marginBottom: '2rem',
                }}>
                  Break the seal to read your letter...
                </p>
              </motion.div>
            )}

            <motion.div
              className="wax-seal"
              whileHover={{ scale: 1.15, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => { SoundManager.playSeal(); setSealBroken(true); }}
              style={{ cursor: 'pointer' }}
            >
              S
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default StampLetter;
