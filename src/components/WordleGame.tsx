import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VALENTINE_DATA } from "@/lib/valentineData";

const KEYBOARD_ROWS = [
["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
["A", "S", "D", "F", "G", "H", "J", "K", "L"],
["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"]];


type LetterState = "correct" | "present" | "absent" | "empty" | "tbd";

interface GuessRow {
  letters: string[];
  states: LetterState[];
}

const WordleLevel = ({
  level,
  onComplete



}: {level: (typeof VALENTINE_DATA.wordleLevels)[0];onComplete: () => void;}) => {
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

      // First pass: correct positions
      guessArr.forEach((letter, i) => {
        if (letter === answerArr[i]) {
          states[i] = "correct";
          answerArr[i] = "#";
        }
      });

      // Second pass: present letters
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

    // Update key states
    const newKeyStates = { ...keyStates };
    newRow.letters.forEach((letter, i) => {
      const state = states[i];
      const current = newKeyStates[letter];
      if (state === "correct") newKeyStates[letter] = "correct";else
      if (state === "present" && current !== "correct") newKeyStates[letter] = "present";else
      if (!current) newKeyStates[letter] = "absent";
    });
    setKeyStates(newKeyStates);

    setCurrentGuess("");

    if (currentGuess.toUpperCase() === level.word.toUpperCase()) {
      setWon(true);
      setTimeout(onComplete, 1500);
    }
  }, [currentGuess, wordLength, evaluateGuess, guesses, keyStates, level.word, onComplete]);

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
    const handler = (e: KeyboardEvent) => {
      handleKey(e.key.toUpperCase());
    };
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

  // Build display rows
  const displayRows: {letters: string[];states: LetterState[];}[] = [];
  for (let r = 0; r < maxGuesses; r++) {
    if (r < guesses.length) {
      displayRows.push(guesses[r]);
    } else if (r === guesses.length) {
      const letters = currentGuess.padEnd(wordLength, " ").split("").slice(0, wordLength);
      displayRows.push({ letters, states: Array(wordLength).fill("tbd") });
    } else {
      displayRows.push({
        letters: Array(wordLength).fill(""),
        states: Array(wordLength).fill("empty")
      });
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Grid */}
      <motion.div
        animate={shake ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="grid gap-1"
        style={{ gridTemplateRows: `repeat(${maxGuesses}, 1fr)` }}>

        {displayRows.map((row, r) =>
        <div key={r} className="flex gap-1">
            {row.letters.map((letter, c) =>
          <motion.div
            key={`${r}-${c}`}
            initial={row.states[c] !== "empty" && row.states[c] !== "tbd" ? { rotateX: 0 } : {}}
            animate={row.states[c] !== "empty" && row.states[c] !== "tbd" ? { rotateX: 360 } : {}}
            transition={{ delay: c * 0.15, duration: 0.5 }}
            className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center border-2 font-outfit font-bold text-2xl uppercase ${getCellColor(row.states[c])}`}>

                {letter.trim()}
              </motion.div>
          )}
          </div>
        )}
      </motion.div>

      {/* Hints */}
      <div className="flex flex-col items-center gap-2">
        {!won && guesses.length < maxGuesses &&
        <button
          onClick={() => setHintsRevealed((prev) => Math.min(prev + 1, level.hints.length))}
          disabled={hintsRevealed >= level.hints.length}
          className="px-4 py-2 text-sm font-outfit font-medium rounded-full glassmorphism text-white hover:bg-white/20 transition disabled:opacity-40">

            Hint? ({hintsRevealed}/{level.hints.length})
          </button>
        }

        <AnimatePresence>
          {level.hints.slice(0, hintsRevealed).map((hint, i) =>
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glassmorphism px-4 py-2 text-white/90 font-outfit text-sm text-center max-w-xs">

              💡 {hint}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Keyboard */}
      <div className="flex flex-col items-center gap-1 mt-2">
        {KEYBOARD_ROWS.map((row, r) =>
        <div key={r} className="flex gap-1">
            {row.map((key) =>
          <button
            key={key}
            onClick={() => handleKey(key)}
            className={`${
            key.length > 1 ? "px-3 text-xs" : "w-8 sm:w-10"} h-12 sm:h-14 rounded font-outfit font-semibold text-sm transition-colors ${
            getKeyColor(key)}`}>

                {key}
              </button>
          )}
          </div>
        )}
      </div>
    </div>);

};

const WordleGame = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [allComplete, setAllComplete] = useState(false);

  const handleLevelComplete = () => {
    if (currentLevel < VALENTINE_DATA.wordleLevels.length - 1) {
      setCurrentLevel((prev) => prev + 1);
    } else {
      setAllComplete(true);
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center py-20 px-4">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="font-lifesavers text-3xl sm:text-4xl font-bold text-foreground mb-2 text-center">

        The Game
      </motion.h2>
      <p className="font-outfit text-muted-foreground mb-8 text-center">
        Level {currentLevel + 1} of {VALENTINE_DATA.wordleLevels.length}
      </p>

      {!allComplete ?
      <WordleLevel
        key={currentLevel}
        level={VALENTINE_DATA.wordleLevels[currentLevel]}
        onComplete={handleLevelComplete} /> :


      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="flex flex-col items-center gap-6">

          <div className="text-8xl">🕺</div>
          <div className="text-6xl">🧁</div>
          <h3 className="font-lifesavers text-3xl font-bold text-foreground text-center">
            You did it! 🎉
          </h3>
          <p className="font-outfit text-foreground/80 text-center">You know us well!!

        </p>
        </motion.div>
      }
    </section>);

};

export default WordleGame;