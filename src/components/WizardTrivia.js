import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from './Confetti';
import SoundManager from '../utils/SoundManager';

const QUESTION_POOL = [
  {
    q: "What is the name of Harry Potter's owl?",
    choices: ['Errol', 'Hedwig', 'Pigwidgeon', 'Scabbers'],
    answer: 1,
  },
  {
    q: 'Which house does the Sorting Hat place Harry in?',
    choices: ['Slytherin', 'Hufflepuff', 'Ravenclaw', 'Gryffindor'],
    answer: 3,
  },
  {
    q: 'What position does Harry play in Quidditch?',
    choices: ['Chaser', 'Beater', 'Seeker', 'Keeper'],
    answer: 2,
  },
  {
    q: 'What is the core of Harry\'s wand?',
    choices: ['Dragon heartstring', 'Unicorn hair', 'Phoenix feather', 'Thestral tail'],
    answer: 2,
  },
  {
    q: 'What does the spell "Lumos" do?',
    choices: ['Unlocks doors', 'Creates light', 'Summons objects', 'Disarms opponent'],
    answer: 1,
  },
  {
    q: 'Who is the Half-Blood Prince?',
    choices: ['Dumbledore', 'Voldemort', 'Snape', 'Sirius'],
    answer: 2,
  },
  {
    q: 'What is the name of the Weasley family home?',
    choices: ['The Burrow', 'Shell Cottage', 'Grimmauld Place', 'Godric\'s Hollow'],
    answer: 0,
  },
  {
    q: 'Which magical creature guards the Philosopher\'s Stone alongside Fluffy?',
    choices: ['Basilisk', 'Troll', 'Devil\'s Snare', 'Hippogriff'],
    answer: 2,
  },
  {
    q: 'What is Hermione\'s Patronus?',
    choices: ['Cat', 'Otter', 'Hare', 'Doe'],
    answer: 1,
  },
  {
    q: 'How many Horcruxes did Voldemort create intentionally?',
    choices: ['5', '6', '7', '8'],
    answer: 1,
  },
  {
    q: 'What subject does Professor McGonagall teach?',
    choices: ['Potions', 'Charms', 'Transfiguration', 'Defense Against the Dark Arts'],
    answer: 2,
  },
  {
    q: 'What is the name of Hagrid\'s three-headed dog?',
    choices: ['Fang', 'Fluffy', 'Norbert', 'Buckbeak'],
    answer: 1,
  },
  {
    q: 'Which Deathly Hallow did Harry possess first?',
    choices: ['Elder Wand', 'Resurrection Stone', 'Invisibility Cloak', 'None'],
    answer: 2,
  },
  {
    q: 'What does Amortentia smell like?',
    choices: ['Roses only', 'Whatever attracts the smeller', 'Chocolate', 'Fresh rain'],
    answer: 1,
  },
  {
    q: 'What is the name of the magical map the twins give Harry?',
    choices: ['The Dark Map', 'The Marauder\'s Map', 'The Hogwarts Map', 'The Sneakoscope'],
    answer: 1,
  },
  {
    q: 'Who killed Dumbledore?',
    choices: ['Draco', 'Snape', 'Bellatrix', 'Voldemort'],
    answer: 1,
  },
  {
    q: 'What type of dragon does Harry face in the Triwizard Tournament?',
    choices: ['Norwegian Ridgeback', 'Chinese Fireball', 'Hungarian Horntail', 'Swedish Short-Snout'],
    answer: 2,
  },
  {
    q: 'What potion allows the drinker to assume the appearance of someone else?',
    choices: ['Veritaserum', 'Felix Felicis', 'Polyjuice Potion', 'Wolfsbane'],
    answer: 2,
  },
  {
    q: 'What is the name of Voldemort\'s snake?',
    choices: ['Basilisk', 'Nagini', 'Aragog', 'Salazar'],
    answer: 1,
  },
  {
    q: 'Which ghost haunts the girls\' bathroom?',
    choices: ['Nearly Headless Nick', 'The Bloody Baron', 'Moaning Myrtle', 'Peeves'],
    answer: 2,
  },
  {
    q: 'What magical plant screams when uprooted?',
    choices: ['Whomping Willow', 'Mandrake', 'Gillyweed', 'Venomous Tentacula'],
    answer: 1,
  },
  {
    q: 'In which year was the Chamber of Secrets first opened by Tom Riddle?',
    choices: ['1943', '1945', '1940', '1950'],
    answer: 0,
  },
  {
    q: 'What does the spell "Expecto Patronum" produce?',
    choices: ['A shield', 'A Patronus', 'A burst of fire', 'An illusion'],
    answer: 1,
  },
  {
    q: 'What is the address of the Dursleys\' home?',
    choices: ['4 Privet Drive', '12 Grimmauld Place', '7 Godric Lane', '9 Spinner\'s End'],
    answer: 0,
  },
];

const TIMER_SECONDS = 15;
const QUESTIONS_PER_GAME = 10;
const WIN_THRESHOLD = 7;

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function WizardTrivia({ onWin, onClose }) {
  const [gameQuestions, setGameQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [phase, setPhase] = useState('playing'); // playing | reveal | finished
  const [showConfetti, setShowConfetti] = useState(false);
  const timerRef = useRef(null);

  // Initialize game questions
  useMemo(() => {
    const shuffled = shuffleArray(QUESTION_POOL).slice(0, QUESTIONS_PER_GAME);
    setGameQuestions(shuffled);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Timer countdown
  useEffect(() => {
    if (phase !== 'playing' || gameQuestions.length === 0) return;
    setTimeLeft(TIMER_SECONDS);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [current, phase, gameQuestions.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTimeout = useCallback(() => {
    setPhase('reveal');
    setSelected(-1); // no selection
    setTimeout(() => advanceQuestion(0), 1500);
  }, [current, gameQuestions.length, score]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnswer = useCallback((choiceIndex) => {
    if (phase !== 'playing' || selected !== null) return;
    clearInterval(timerRef.current);

    const correct = choiceIndex === gameQuestions[current].answer;
    if (correct) SoundManager.playCorrect();
    else SoundManager.playWrong();
    setSelected(choiceIndex);
    setPhase('reveal');

    const pointsGained = correct ? 1 : 0;
    const newScore = score + pointsGained;
    if (correct) setScore(newScore);

    setTimeout(() => advanceQuestion(newScore), 1200);
  }, [phase, selected, gameQuestions, current, score]); // eslint-disable-line react-hooks/exhaustive-deps

  const advanceQuestion = useCallback((newScore) => {
    if (current + 1 >= QUESTIONS_PER_GAME) {
      setPhase('finished');
      if (newScore >= WIN_THRESHOLD) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    } else {
      setCurrent((prev) => prev + 1);
      setSelected(null);
      setPhase('playing');
    }
  }, [current]);

  const resetGame = useCallback(() => {
    const shuffled = shuffleArray(QUESTION_POOL).slice(0, QUESTIONS_PER_GAME);
    setGameQuestions(shuffled);
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setPhase('playing');
    setShowConfetti(false);
  }, []);

  const question = gameQuestions[current];
  const hasWon = phase === 'finished' && score >= WIN_THRESHOLD;

  if (gameQuestions.length === 0) return null;

  return (
    <div className="wizard-wrapper">
      <Confetti show={showConfetti} />

      {/* Header */}
      <div className="wizard-header">
        <motion.button
          className="wizard-back-btn"
          onClick={onClose}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          &larr; Back to Hall
        </motion.button>
        <h2 className="wizard-title">Hogwarts Entrance Exam</h2>
        <div className="wizard-score-display">
          <span className="wizard-star">&#9733;</span> {score} / {QUESTIONS_PER_GAME}
        </div>
      </div>

      {phase !== 'finished' && question && (
        <div className="wizard-game-area">
          {/* Progress dots */}
          <div className="wizard-progress-dots">
            {Array.from({ length: QUESTIONS_PER_GAME }, (_, i) => (
              <div
                key={i}
                className={`wizard-dot ${
                  i < current ? 'wizard-dot-done' : i === current ? 'wizard-dot-active' : ''
                }`}
              />
            ))}
          </div>

          {/* Timer */}
          <div className="wizard-timer-bar">
            <motion.div
              className="wizard-timer-fill"
              initial={{ width: '100%' }}
              animate={{ width: `${(timeLeft / TIMER_SECONDS) * 100}%` }}
              transition={{ duration: 0.3 }}
              style={{
                background: timeLeft <= 5 ? '#e74c3c' : timeLeft <= 10 ? '#f39c12' : '#7d5a3c',
              }}
            />
            <span className="wizard-timer-text">{timeLeft}s</span>
          </div>

          {/* Question card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              className="wizard-parchment"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.35 }}
            >
              <p className="wizard-question-number">
                Question {current + 1} of {QUESTIONS_PER_GAME}
              </p>
              <h3 className="wizard-question-text">{question.q}</h3>

              <div className="wizard-choices">
                {question.choices.map((choice, i) => {
                  let className = 'wizard-choice';
                  if (phase === 'reveal') {
                    if (i === question.answer) className += ' wizard-choice-correct';
                    else if (i === selected) className += ' wizard-choice-wrong';
                  }
                  if (selected === i && phase === 'playing') className += ' wizard-choice-selected';

                  return (
                    <motion.button
                      key={i}
                      className={className}
                      onClick={() => handleAnswer(i)}
                      whileHover={phase === 'playing' ? { scale: 1.02 } : {}}
                      whileTap={phase === 'playing' ? { scale: 0.98 } : {}}
                      disabled={phase !== 'playing'}
                    >
                      <span className="wizard-choice-letter">
                        {String.fromCharCode(65 + i)}
                      </span>
                      {choice}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Finished state */}
      <AnimatePresence>
        {phase === 'finished' && (
          <motion.div
            className="wizard-result-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="wizard-result-card"
              initial={{ scale: 0.5, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', damping: 12 }}
            >
              {hasWon ? (
                <>
                  <span className="wizard-result-icon">&#9733;</span>
                  <h2 className="wizard-result-title">Outstanding!</h2>
                  <p className="wizard-result-text">
                    You scored <strong>{score}/{QUESTIONS_PER_GAME}</strong>!<br />
                    Selma has been accepted to Hogwarts!
                  </p>
                  <motion.button
                    className="wizard-claim-btn"
                    onClick={() => onWin && onWin('wizard')}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Claim Badge &#9733;
                  </motion.button>
                </>
              ) : (
                <>
                  <span className="wizard-result-icon">&#128148;</span>
                  <h2 className="wizard-result-title">Not Quite...</h2>
                  <p className="wizard-result-text">
                    You scored <strong>{score}/{QUESTIONS_PER_GAME}</strong>.<br />
                    You need {WIN_THRESHOLD} correct to pass. Try again!
                  </p>
                  <motion.button
                    className="wizard-retry-btn"
                    onClick={resetGame}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Retry Exam
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

export default WizardTrivia;
