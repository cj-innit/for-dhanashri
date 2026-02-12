import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { VALENTINE_DATA } from "@/lib/valentineData";

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
];

type LetterState = "correct" | "present" | "absent" | "empty" | "tbd";

interface GuessRow {
  letters: string[];
  states: LetterState[];
}

// Flower burst for Level 1
const fireFlowerBurst = () => {
  const colors = ["#ff6b9d", "#c44569", "#f8b500", "#ff6348", "#ff4757", "#ffa502"];
  const shapes = ["circle" as const];

  // Side bursts
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      confetti({ particleCount: 40, angle: 60, spread: 60, origin: { x: 0, y: 0.5 }, colors, shapes, scalar: 1.5 });
      confetti({ particleCount: 40, angle: 120, spread: 60, origin: { x: 1, y: 0.5 }, colors, shapes, scalar: 1.5 });
    }, i * 200);
  }

  // Rain from top
  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      confetti({
        particleCount: 25,
        angle: 270,
        spread: 120,
        origin: { x: Math.random(), y: -0.1 },
        colors,
        gravity: 0.6,
        scalar: 1.8,
        ticks: 200,
      });
    }, i * 150);
  }
};

// Cat cannon for Level 2
const CatCannon = ({ onDone }: { onDone: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onDone, 3000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <motion.div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
      <motion.div
        initial={{ x: "-100vw", y: "20vh", rotate: -30 }}
        animate={{ x: "120vw", y: "-30vh", rotate: 720 }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
        className="text-8xl sm:text-9xl"
      >
        🐱
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="absolute text-5xl sm:text-7xl font-emilys text-foreground drop-shadow-lg"
      >
        YAYYYY! 🎉
      </motion.div>
    </motion.div>
  );
};

const WordleLevel = ({
  level,
  levelIndex,
  onComplete,
}: {
  level: (typeof VALENTINE_DATA.wordleLevels)[0];
  levelIndex: number;
  onComplete: () => void;
}) => {
  const wordLength = level.word.length;
  const maxGuesses = 6;

  const [guesses, setGuesses] = useState<GuessRow[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [won, setWon] = useState(false);
  const [keyStates, setKeyStates] = useState<Record<string, LetterState>>({});
  const [shake, setShake] = useState(false);

  const evaluateGuess = useCallback(
    (guess: string): LetterState[] => {
      const answer = level.word.toUpperCase();
      const states: LetterState[] = Array(wordLength).fill("absent");
      const answerArr = answer.split("");
      const guessArr = guess.split("");

      guessArr.forEach((letter, i) => {
        if (letter === answerArr[i]) {
          states[i] = "correct";
          answerArr[i] = "#";
        }
      });

      guessArr.forEach((letter, i) => {
        if (states[i] === "correct") return;
        const idx = answerArr.indexOf(letter);
        if (idx !== -1) {
          states[i] = "present";
          answerArr[idx] = "#";
        }
      });

      return states;
    },
    [level.word, wordLength]
  );

  const submitGuess = useCallback(() => {
    if (currentGuess.length !== wordLength) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    const states = evaluateGuess(currentGuess.toUpperCase());
    const newRow: GuessRow = { letters: currentGuess.toUpperCase().split(""), states };
    const newGuesses = [...guesses, newRow];
    setGuesses(newGuesses);

    const newKeyStates = { ...keyStates };
    newRow.letters.forEach((letter, i) => {
      const state = states[i];
      const current = newKeyStates[letter];
      if (state === "correct") newKeyStates[letter] = "correct";
      else if (state === "present" && current !== "correct") newKeyStates[letter] = "present";
      else if (!current) newKeyStates[letter] = "absent";
    });
    setKeyStates(newKeyStates);
    setCurrentGuess("");

    if (currentGuess.toUpperCase() === level.word.toUpperCase()) {
      setWon(true);
      if (levelIndex === 0) {
        fireFlowerBurst();
      }
      setTimeout(onComplete, 2000);
    }
  }, [currentGuess, wordLength, evaluateGuess, guesses, keyStates, level.word, onComplete, levelIndex]);

  const handleKey = useCallback(
    (key: string) => {
      if (won || guesses.length >= maxGuesses) return;
      if (key === "ENTER") return submitGuess();
      if (key === "⌫" || key === "BACKSPACE") {
        setCurrentGuess((prev) => prev.slice(0, -1));
        return;
      }
      if (/^[A-Z]$/.test(key) && currentGuess.length < wordLength) {
        setCurrentGuess((prev) => prev + key);
      }
    },
    [won, guesses.length, maxGuesses, submitGuess, currentGuess.length, wordLength]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => handleKey(e.key.toUpperCase());
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleKey]);

  const getKeyColor = (key: string): string => {
    const state = keyStates[key];
    if (state === "correct") return "bg-wordle-correct text-white";
    if (state === "present") return "bg-wordle-present text-white";
    if (state === "absent") return "bg-wordle-absent text-white";
    return "bg-[hsl(0,0%,85%)] text-card-foreground";
  };

  const getCellColor = (state: LetterState): string => {
    if (state === "correct") return "bg-wordle-correct text-white border-wordle-correct";
    if (state === "present") return "bg-wordle-present text-white border-wordle-present";
    if (state === "absent") return "bg-wordle-absent text-white border-wordle-absent";
    return "border-[hsl(0,0%,75%)]";
  };

  const displayRows: { letters: string[]; states: LetterState[] }[] = [];
  for (let r = 0; r < maxGuesses; r++) {
    if (r < guesses.length) {
      displayRows.push(guesses[r]);
    } else if (r === guesses.length) {
      const letters = currentGuess.padEnd(wordLength, " ").split("").slice(0, wordLength);
      displayRows.push({ letters, states: Array(wordLength).fill("tbd") });
    } else {
      displayRows.push({ letters: Array(wordLength).fill(""), states: Array(wordLength).fill("empty") });
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        animate={shake ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="grid gap-1"
        style={{ gridTemplateRows: `repeat(${maxGuesses}, 1fr)` }}
      >
        {displayRows.map((row, r) => (
          <div key={r} className="flex gap-1">
            {row.letters.map((letter, c) => (
              <motion.div
                key={`${r}-${c}`}
                initial={row.states[c] !== "empty" && row.states[c] !== "tbd" ? { rotateX: 0 } : {}}
                animate={row.states[c] !== "empty" && row.states[c] !== "tbd" ? { rotateX: 360 } : {}}
                transition={{ delay: c * 0.15, duration: 0.5 }}
                className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center border-2 font-outfit font-bold text-2xl uppercase ${getCellColor(row.states[c])}`}
              >
                {letter.trim()}
              </motion.div>
            ))}
          </div>
        ))}
      </motion.div>

      {/* Hints */}
      <div className="flex flex-col items-center gap-2">
        {!won && guesses.length < maxGuesses && (
          <button
            onClick={() => setHintsRevealed((prev) => Math.min(prev + 1, level.hints.length))}
            disabled={hintsRevealed >= level.hints.length}
            className="px-4 py-2 text-sm font-outfit font-medium rounded-full glassmorphism text-white hover:bg-white/20 transition disabled:opacity-40"
          >
            Hint? ({hintsRevealed}/{level.hints.length})
          </button>
        )}
        <AnimatePresence>
          {level.hints.slice(0, hintsRevealed).map((hint, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="glassmorphism px-4 py-2 text-white/90 font-outfit text-sm text-center max-w-xs"
            >
              💡 {hint}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Keyboard */}
      <div className="flex flex-col items-center gap-1 mt-2">
        {KEYBOARD_ROWS.map((row, r) => (
          <div key={r} className="flex gap-1">
            {row.map((key) => (
              <button
                key={key}
                onClick={() => handleKey(key)}
                className={`${key.length > 1 ? "px-3 text-xs" : "w-8 sm:w-10"} h-12 sm:h-14 rounded font-outfit font-semibold text-sm transition-colors ${getKeyColor(key)}`}
              >
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

interface WordleGameProps {
  onAllComplete: () => void;
}

const WordleGame = ({ onAllComplete }: WordleGameProps) => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [showCatCannon, setShowCatCannon] = useState(false);

  const handleLevelComplete = () => {
    if (currentLevel < VALENTINE_DATA.wordleLevels.length - 1) {
      setCurrentLevel((prev) => prev + 1);
    } else {
      // Level 2 complete — fire cat cannon
      setShowCatCannon(true);
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center py-20 px-4">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="font-lifesavers text-3xl sm:text-4xl font-bold text-foreground mb-2 text-center"
      >
        The Game
      </motion.h2>
      <p className="font-outfit text-muted-foreground mb-8 text-center">
        Level {currentLevel + 1} of {VALENTINE_DATA.wordleLevels.length}
      </p>

      {!showCatCannon ? (
        <WordleLevel
          key={currentLevel}
          level={VALENTINE_DATA.wordleLevels[currentLevel]}
          levelIndex={currentLevel}
          onComplete={handleLevelComplete}
        />
      ) : (
        <CatCannon onDone={onAllComplete} />
      )}
    </section>
  );
};

export default WordleGame;
