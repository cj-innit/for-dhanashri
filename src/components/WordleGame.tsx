// import { useState, useCallback, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { VALENTINE_DATA } from "@/lib/valentineData";

// const KEYBOARD_ROWS = [
//   ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
//   ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
//   ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
// ];

// type LetterState = "correct" | "present" | "absent" | "empty" | "tbd";

// interface GuessRow {
//   letters: string[];
//   states: LetterState[];
// }

// const getPriority = (state: LetterState | undefined) => {
//   if (state === "correct") return 3;
//   if (state === "present") return 2;
//   if (state === "absent") return 1;
//   return 0;
// };

// const WordleLevel = ({
//   level,
//   onComplete,
// }: {
//   level: (typeof VALENTINE_DATA.wordleLevels)[0];
//   onComplete: () => void;
// }) => {
//   const wordLength = level.word.length;
//   const maxGuesses = 6;

//   const [guesses, setGuesses] = useState<GuessRow[]>([]);
//   const [currentGuess, setCurrentGuess] = useState("");
//   const [hintsRevealed, setHintsRevealed] = useState(0);
//   const [won, setWon] = useState(false);
//   const [lost, setLost] = useState(false);
//   const [showLossModal, setShowLossModal] = useState(false);
//   const [winningRowIndex, setWinningRowIndex] = useState<number | null>(null);
//   const [keyStates, setKeyStates] = useState<Record<string, LetterState>>({});
//   const [shake, setShake] = useState(false);
//   const timerRefs = useRef<number[]>([]);

//   const clearTimers = useCallback(() => {
//     timerRefs.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
//     timerRefs.current = [];
//   }, []);

//   const setManagedTimeout = useCallback((callback: () => void, delay: number) => {
//     const timeoutId = window.setTimeout(() => {
//       timerRefs.current = timerRefs.current.filter((id) => id !== timeoutId);
//       callback();
//     }, delay);
//     timerRefs.current.push(timeoutId);
//     return timeoutId;
//   }, []);

//   useEffect(() => () => clearTimers(), [clearTimers]);

//   const evaluateGuess = useCallback(
//     (guess: string): LetterState[] => {
//       const answer = level.word.toUpperCase();
//       const states: LetterState[] = Array(wordLength).fill("absent");
//       const answerArr = answer.split("");
//       const guessArr = guess.split("");

//       guessArr.forEach((letter, i) => {
//         if (letter === answerArr[i]) {
//           states[i] = "correct";
//           answerArr[i] = "#";
//         }
//       });

//       guessArr.forEach((letter, i) => {
//         if (states[i] === "correct") return;
//         const idx = answerArr.indexOf(letter);
//         if (idx !== -1) {
//           states[i] = "present";
//           answerArr[idx] = "#";
//         }
//       });

//       return states;
//     },
//     [level.word, wordLength]
//   );

//   const submitGuess = useCallback(() => {
//     if (currentGuess.length !== wordLength) {
//       setShake(true);
//       setManagedTimeout(() => setShake(false), 500);
//       return;
//     }

//     const states = evaluateGuess(currentGuess.toUpperCase());
//     const newRow: GuessRow = { letters: currentGuess.toUpperCase().split(""), states };
//     const newGuesses = [...guesses, newRow];
//     setGuesses(newGuesses);

//     const newKeyStates = { ...keyStates };
//     newRow.letters.forEach((letter, i) => {
//       const nextState = states[i];
//       const currentState = newKeyStates[letter];
//       if (getPriority(nextState) > getPriority(currentState)) {
//         newKeyStates[letter] = nextState;
//       }
//     });

//     setKeyStates(newKeyStates);
//     setCurrentGuess("");

//     if (currentGuess.toUpperCase() === level.word.toUpperCase()) {
//       setWon(true);
//       setWinningRowIndex(newGuesses.length - 1);
//       setManagedTimeout(onComplete, 2000);
//       return;
//     }

//     if (newGuesses.length >= maxGuesses) {
//       setLost(true);
//       setShowLossModal(true);
//     }
//   }, [
//     currentGuess,
//     wordLength,
//     evaluateGuess,
//     guesses,
//     keyStates,
//     level.word,
//     onComplete,
//     maxGuesses,
//     setManagedTimeout,
//   ]);

//   const handleKey = useCallback(
//     (key: string) => {
//       if (won || lost || guesses.length >= maxGuesses) return;
//       if (key === "ENTER") return submitGuess();
//       if (key === "⌫" || key === "BACKSPACE") {
//         setCurrentGuess((prev) => prev.slice(0, -1));
//         return;
//       }
//       if (/^[A-Z]$/.test(key) && currentGuess.length < wordLength) {
//         setCurrentGuess((prev) => prev + key);
//       }
//     },
//     [won, lost, guesses.length, maxGuesses, submitGuess, currentGuess.length, wordLength]
//   );

//   useEffect(() => {
//     const handler = (e: KeyboardEvent) => handleKey(e.key.toUpperCase());
//     window.addEventListener("keydown", handler);
//     return () => window.removeEventListener("keydown", handler);
//   }, [handleKey]);

//   const getKeyColor = (key: string): string => {
//     const state = keyStates[key];
//     if (state === "correct") return "bg-[#538d4e] text-white";
//     if (state === "present") return "bg-[#b59f3b] text-white";
//     if (state === "absent") return "bg-[#3a3a3c] text-white";
//     return "bg-[#818384] text-white";
//   };

//   const getCellColor = (state: LetterState): string => {
//     if (state === "correct") return "bg-[#538d4e] text-white border-[#538d4e]";
//     if (state === "present") return "bg-[#b59f3b] text-white border-[#b59f3b]";
//     if (state === "absent") return "bg-[#3a3a3c] text-white border-[#3a3a3c]";
//     return "bg-transparent text-white border-[#3a3a3c]";
//   };

//   const displayRows: { letters: string[]; states: LetterState[] }[] = [];
//   for (let r = 0; r < maxGuesses; r++) {
//     if (r < guesses.length) {
//       displayRows.push(guesses[r]);
//     } else if (r === guesses.length) {
//       const letters = currentGuess.padEnd(wordLength, " ").split("").slice(0, wordLength);
//       displayRows.push({ letters, states: Array(wordLength).fill("tbd") });
//     } else {
//       displayRows.push({ letters: Array(wordLength).fill(""), states: Array(wordLength).fill("empty") });
//     }
//   }

//   const handleLossContinue = () => {
//     setShowLossModal(false);
//     setManagedTimeout(onComplete, 180);
//   };

//   return (
//     <div className="w-full max-w-[560px] px-2">
//       <motion.div
//         animate={shake ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
//         transition={{ duration: 0.4 }}
//         className="relative overflow-hidden rounded-2xl border border-[#3a3a3c] bg-[#121213]/95 px-3 py-4 sm:px-5 sm:py-5 shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
//       >
//         <div className="flex flex-col items-center gap-3">
//           <div className="grid gap-1.5" style={{ gridTemplateRows: `repeat(${maxGuesses}, 1fr)` }}>
//             {displayRows.map((row, r) => (
//               <div key={r} className="flex gap-1.5">
//                 {row.letters.map((letter, c) => {
//                   const hasResolvedState = row.states[c] !== "empty" && row.states[c] !== "tbd";
//                   const isWinningTile = won && winningRowIndex === r && row.states[c] === "correct";

//                   return (
//                     <motion.div
//                       key={`${r}-${c}`}
//                       initial={hasResolvedState ? { rotateX: 0, y: 0 } : {}}
//                       animate={{
//                         rotateX: hasResolvedState ? 360 : 0,
//                         y: isWinningTile ? [0, -20, 0] : 0,
//                       }}
//                       transition={{
//                         rotateX: hasResolvedState ? { delay: c * 0.15, duration: 0.5 } : { duration: 0 },
//                         y: isWinningTile
//                           ? {
//                               delay: c * 0.1,
//                               duration: 0.42,
//                               ease: ["easeOut", "easeIn"],
//                               repeat: 1,
//                               repeatDelay: 0.08,
//                             }
//                           : { duration: 0.18 },
//                       }}
//                       className={`w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center border-2 font-outfit font-bold text-xl uppercase ${getCellColor(row.states[c])}`}
//                     >
//                       {letter.trim()}
//                     </motion.div>
//                   );
//                 })}
//               </div>
//             ))}
//           </div>

//           {/* Hints */}
//           <div className="flex flex-col items-center gap-2 min-h-[88px]">
//             {!won && !lost && guesses.length < maxGuesses && (
//               <button
//                 onClick={() => setHintsRevealed((prev) => Math.min(prev + 1, level.hints.length))}
//                 disabled={hintsRevealed >= level.hints.length}
//                 className="px-4 py-1.5 text-xs font-outfit font-medium rounded-full border border-[#3a3a3c] bg-[#121213] text-white hover:bg-[#222325] transition disabled:opacity-40"
//               >
//                 Hint? ({hintsRevealed}/{level.hints.length})
//               </button>
//             )}
//             <AnimatePresence>
//               {level.hints.slice(0, hintsRevealed).map((hint, i) => (
//                 <motion.div
//                   key={i}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0 }}
//                   className="px-3 py-1.5 border border-[#3a3a3c] bg-[#121213] text-white/90 font-outfit text-xs text-center max-w-xs rounded-md"
//                 >
//                   💡 {hint}
//                 </motion.div>
//               ))}
//             </AnimatePresence>
//           </div>

//           {/* Keyboard */}
//           <div className="flex flex-col items-center gap-1 mt-1">
//             {KEYBOARD_ROWS.map((row, r) => (
//               <div key={r} className="flex gap-1">
//                 {row.map((key) => (
//                   <button
//                     key={key}
//                     onClick={() => handleKey(key)}
//                     className={`${key.length > 1 ? "px-2.5 text-[10px]" : "w-8 sm:w-9"} h-10 sm:h-11 rounded font-outfit font-semibold text-xs transition-colors ${getKeyColor(key)}`}
//                   >
//                     {key}
//                   </button>
//                 ))}
//               </div>
//             ))}
//           </div>
//         </div>

//         <AnimatePresence>
//           {won && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ delay: 0.18, duration: 0.16, ease: "easeOut" }}
//               className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center"
//             >
//               <motion.div
//                 initial={{ opacity: 0, y: 6, scale: 0.97 }}
//                 animate={{ opacity: 1, y: 0, scale: 1 }}
//                 exit={{ opacity: 0, y: 4, scale: 0.98 }}
//                 transition={{ delay: 0.2, duration: 0.18, ease: "easeOut" }}
//                 className="rounded-sm border border-black/20 bg-white px-4 py-1.5 font-outfit text-sm font-semibold text-black shadow-[0_3px_10px_rgba(0,0,0,0.16)]"
//               >
//                 Correct
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.div>

//       <AnimatePresence>
//         {showLossModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
//           >
//             <motion.div
//               initial={{ scale: 0.9, y: 16 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.96, y: 8 }}
//               className="relative w-full max-w-sm rounded-xl border border-[#3a3a3c] bg-[#121213] p-5 text-center"
//             >
//               <button
//                 onClick={handleLossContinue}
//                 className="absolute right-3 top-2 text-[#818384] hover:text-white transition-colors"
//                 aria-label="Close"
//               >
//                 ×
//               </button>
//               <h3 className="font-outfit text-white text-lg font-semibold">Not this time</h3>
//               <p className="mt-2 font-outfit text-[#d7dadc] text-sm">
//                 The word was <span className="font-bold text-white">{level.word.toUpperCase()}</span>.
//               </p>
//               <button
//                 onClick={handleLossContinue}
//                 className="mt-4 px-4 py-2 rounded-md bg-[#3a3a3c] text-white text-sm font-outfit hover:bg-[#4a4a4c] transition-colors"
//               >
//                 Continue
//               </button>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// interface WordleGameProps {
//   onAllComplete: () => void;
// }

// const WordleGame = ({ onAllComplete }: WordleGameProps) => {
//   const [currentLevel, setCurrentLevel] = useState(0);

//   const handleLevelComplete = () => {
//     if (currentLevel < VALENTINE_DATA.wordleLevels.length - 1) {
//       setCurrentLevel((prev) => prev + 1);
//     } else {
//       setTimeout(onAllComplete, 900);
//     }
//   };

//   return (
//     <section className="h-screen w-full overflow-hidden flex flex-col items-center justify-center px-3">
//       <motion.h2
//         initial={{ opacity: 0 }}
//         whileInView={{ opacity: 1 }}
//         viewport={{ once: true }}
//         className="font-lifesavers text-3xl sm:text-4xl font-bold text-white mb-1 text-center"
//       >
//         RELATIONSHIP WORDLE
//       </motion.h2>
//       <p className="font-outfit text-white mb-4 text-sm text-center">
//         Level {currentLevel + 1} of {VALENTINE_DATA.wordleLevels.length}
//       </p>

//       <WordleLevel
//         key={currentLevel}
//         level={VALENTINE_DATA.wordleLevels[currentLevel]}
//         onComplete={handleLevelComplete}
//       />
//     </section>
//   );
// };

// export default WordleGame;


import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

const getPriority = (state: LetterState | undefined) => {
  if (state === "correct") return 3;
  if (state === "present") return 2;
  if (state === "absent") return 1;
  return 0;
};

const WordleLevel = ({
  level,
  onComplete,
  winAdvanceDelayMs,
}: {
  level: (typeof VALENTINE_DATA.wordleLevels)[0];
  onComplete: () => void;
  winAdvanceDelayMs: number;
}) => {
  const wordLength = level.word.length;
  const maxGuesses = 6;

  const [guesses, setGuesses] = useState<GuessRow[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const [showLossModal, setShowLossModal] = useState(false);
  const [winningRowIndex, setWinningRowIndex] = useState<number | null>(null);
  const [keyStates, setKeyStates] = useState<Record<string, LetterState>>({});
  const [shake, setShake] = useState(false);
  const timerRefs = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timerRefs.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    timerRefs.current = [];
  }, []);

  const setManagedTimeout = useCallback((callback: () => void, delay: number) => {
    const timeoutId = window.setTimeout(() => {
      timerRefs.current = timerRefs.current.filter((id) => id !== timeoutId);
      callback();
    }, delay);
    timerRefs.current.push(timeoutId);
    return timeoutId;
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

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
      setManagedTimeout(() => setShake(false), 500);
      return;
    }

    const states = evaluateGuess(currentGuess.toUpperCase());
    const newRow: GuessRow = { letters: currentGuess.toUpperCase().split(""), states };
    const newGuesses = [...guesses, newRow];
    setGuesses(newGuesses);

    const newKeyStates = { ...keyStates };
    newRow.letters.forEach((letter, i) => {
      const nextState = states[i];
      const currentState = newKeyStates[letter];
      if (getPriority(nextState) > getPriority(currentState)) {
        newKeyStates[letter] = nextState;
      }
    });

    setKeyStates(newKeyStates);
    setCurrentGuess("");

    if (currentGuess.toUpperCase() === level.word.toUpperCase()) {
      setWon(true);
      setWinningRowIndex(newGuesses.length - 1);
      if (winAdvanceDelayMs > 0) {
        setManagedTimeout(onComplete, winAdvanceDelayMs);
      } else {
        onComplete();
      }
      return;
    }

    if (newGuesses.length >= maxGuesses) {
      setLost(true);
      setShowLossModal(true);
    }
  }, [
    currentGuess,
    wordLength,
    evaluateGuess,
    guesses,
    keyStates,
    level.word,
    onComplete,
    winAdvanceDelayMs,
    maxGuesses,
    setManagedTimeout,
  ]);

  const handleKey = useCallback(
    (key: string) => {
      if (won || lost || guesses.length >= maxGuesses) return;
      if (key === "ENTER") return submitGuess();
      if (key === "⌫" || key === "BACKSPACE") {
        setCurrentGuess((prev) => prev.slice(0, -1));
        return;
      }
      if (/^[A-Z]$/.test(key) && currentGuess.length < wordLength) {
        setCurrentGuess((prev) => prev + key);
      }
    },
    [won, lost, guesses.length, maxGuesses, submitGuess, currentGuess.length, wordLength]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => handleKey(e.key.toUpperCase());
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleKey]);

  const getKeyColor = (key: string): string => {
    const state = keyStates[key];
    if (state === "correct") return "bg-[#538d4e] text-white";
    if (state === "present") return "bg-[#b59f3b] text-white";
    if (state === "absent") return "bg-[#3a3a3c] text-white";
    return "bg-[#818384] text-white";
  };

  const getCellColor = (state: LetterState): string => {
    if (state === "correct") return "bg-[#538d4e] text-white border-[#538d4e]";
    if (state === "present") return "bg-[#b59f3b] text-white border-[#b59f3b]";
    if (state === "absent") return "bg-[#3a3a3c] text-white border-[#3a3a3c]";
    return "bg-transparent text-white border-[#3a3a3c]";
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

  const handleLossContinue = () => {
    setShowLossModal(false);
    setManagedTimeout(onComplete, 180);
  };

  // Start domino jump only after the full winning-row flip sequence completes.
  const winningJumpStartDelay = (wordLength - 1) * 0.15 + 0.58;

  return (
    <div className="w-full max-w-[560px] px-2">
      <motion.div
        animate={shake ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl border border-[#3a3a3c] bg-[#121213]/95 px-3 py-4 sm:px-5 sm:py-5 shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="grid gap-1.5" style={{ gridTemplateRows: `repeat(${maxGuesses}, 1fr)` }}>
            {displayRows.map((row, r) => (
              <div key={r} className="flex gap-1.5">
                {row.letters.map((letter, c) => {
                  const hasResolvedState = row.states[c] !== "empty" && row.states[c] !== "tbd";
                  const isWinningTile = won && winningRowIndex === r && row.states[c] === "correct";

                  return (
                    <motion.div
                      key={`${r}-${c}`}
                      initial={hasResolvedState ? { rotateX: 0, y: 0 } : {}}
                      animate={{
                        rotateX: hasResolvedState ? 360 : 0,
                        y: isWinningTile ? [0, -20, 0] : 0,
                      }}
                      transition={{
                        rotateX: hasResolvedState ? { delay: c * 0.15, duration: 0.5 } : { duration: 0 },
                        y: isWinningTile
                          ? {
                              delay: winningJumpStartDelay + c * 0.1,
                              duration: 0.42,
                              ease: ["easeOut", "easeIn"],
                              repeat: 0,
                            }
                          : { duration: 0.15 },
                      }}
                      className={`w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center border-2 font-outfit font-bold text-xl uppercase ${getCellColor(row.states[c])}`}
                    >
                      {letter.trim()}
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Hints */}
          <div className="flex flex-col items-center gap-2 min-h-[88px]">
            {!won && !lost && guesses.length < maxGuesses && (
              <button
                onClick={() => setHintsRevealed((prev) => Math.min(prev + 1, level.hints.length))}
                disabled={hintsRevealed >= level.hints.length}
                className="px-4 py-1.5 text-xs font-outfit font-medium rounded-full border border-[#3a3a3c] bg-[#121213] text-white hover:bg-[#222325] transition disabled:opacity-40"
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
                  className="px-3 py-1.5 border border-[#3a3a3c] bg-[#121213] text-white/90 font-outfit text-xs text-center max-w-xs rounded-md"
                >
                  💡 {hint}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Keyboard */}
          <div className="flex flex-col items-center gap-1 mt-1">
            {KEYBOARD_ROWS.map((row, r) => (
              <div key={r} className="flex gap-1">
                {row.map((key) => (
                  <button
                    key={key}
                    onClick={() => handleKey(key)}
                    className={`${key.length > 1 ? "px-2.5 text-[10px]" : "w-8 sm:w-9"} h-10 sm:h-11 rounded font-outfit font-semibold text-xs transition-colors ${getKeyColor(key)}`}
                  >
                    {key}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {won && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: winningJumpStartDelay + 0.12, duration: 0.18, ease: "easeOut" }}
              className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ delay: winningJumpStartDelay + 0.14, duration: 0.2, ease: "easeOut" }}
                className="rounded-sm border border-black/25 bg-white px-8 py-3 font-outfit text-xl font-semibold text-black shadow-[0_4px_12px_rgba(0,0,0,0.16)]"
              >
                Correct
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {showLossModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 8 }}
              className="relative w-full max-w-sm rounded-xl border border-[#3a3a3c] bg-[#121213] p-5 text-center"
            >
              <button
                onClick={handleLossContinue}
                className="absolute right-3 top-2 text-[#818384] hover:text-white transition-colors"
                aria-label="Close"
              >
                ×
              </button>
              <h3 className="font-outfit text-white text-lg font-semibold">Not this time</h3>
              <p className="mt-2 font-outfit text-[#d7dadc] text-sm">
                The word was <span className="font-bold text-white">{level.word.toUpperCase()}</span>.
              </p>
              <button
                onClick={handleLossContinue}
                className="mt-4 px-4 py-2 rounded-md bg-[#3a3a3c] text-white text-sm font-outfit hover:bg-[#4a4a4c] transition-colors"
              >
                Continue
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface WordleGameProps {
  onAllComplete: () => void;
}

const WordleGame = ({ onAllComplete }: WordleGameProps) => {
  const [currentLevel, setCurrentLevel] = useState(0);

  const handleLevelComplete = () => {
    if (currentLevel < VALENTINE_DATA.wordleLevels.length - 1) {
      setCurrentLevel((prev) => prev + 1);
    } else {
      onAllComplete();
    }
  };

  return (
    <section className="h-screen w-full overflow-hidden flex flex-col items-center justify-center px-3">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="font-lifesavers text-3xl sm:text-4xl font-bold text-white mb-1 text-center"
      >
        RELATIONSHIP WORDLE
      </motion.h2>
      <p className="font-outfit text-white mb-4 text-sm text-center">
        Level {currentLevel + 1} of {VALENTINE_DATA.wordleLevels.length}
      </p>

      <WordleLevel
        key={currentLevel}
        level={VALENTINE_DATA.wordleLevels[currentLevel]}
        onComplete={handleLevelComplete}
        winAdvanceDelayMs={2500}
      />
    </section>
  );
};

export default WordleGame;
