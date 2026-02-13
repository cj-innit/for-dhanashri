import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VALENTINE_DATA } from "@/lib/valentineData";

interface CaptchaGateProps {
  onVerified: () => void;
}

type CaptchaPhase = "idle" | "invalid_shake" | "scanning";

const CaptchaGate = ({ onVerified }: CaptchaGateProps) => {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [robotChecked, setRobotChecked] = useState(false);
  const [phase, setPhase] = useState<CaptchaPhase>("idle");
  const [showSelectionError, setShowSelectionError] = useState(false);
  const [scanStatus, setScanStatus] = useState("ANALYZING IRIS PATTERN");
  const [scanActive, setScanActive] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const scanTimersRef = useRef<number[]>([]);
  const errorTimerRef = useRef<number | null>(null);

  const clearScanTimers = () => {
    scanTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    scanTimersRef.current = [];
  };

  const scheduleScanStep = (callback: () => void, delay: number) => {
    const timer = window.setTimeout(callback, delay);
    scanTimersRef.current.push(timer);
  };

  useEffect(() => {
    return () => {
      clearScanTimers();
      if (errorTimerRef.current !== null) {
        window.clearTimeout(errorTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (phase !== "scanning") return;

    setScanStatus("ANALYZING IRIS PATTERN");
    setScanActive(false);
    setScanProgress(0);

    clearScanTimers();

    scheduleScanStep(() => {
      setScanActive(true);
      setScanProgress(100);
    }, 550);

    scheduleScanStep(() => {
      setScanStatus("MATCHING BIOMETRIC SIGNATURE TO DHANASHRI");
    }, 1300);

    scheduleScanStep(() => {
      setScanStatus("ACCESS GRANTED");
    }, 3500);

    scheduleScanStep(() => {
      onVerified();
    }, 4000);
  }, [phase, onVerified]);

  const toggleTile = (index: number) => {
    if (phase !== "idle") return;

    const next = new Set(selected);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    setSelected(next);
  };

  const toggleRobotCheck = () => {
    if (phase !== "idle") return;
    setRobotChecked((prev) => !prev);
  };

  const handleVerify = () => {
    if (!robotChecked || phase !== "idle") return;

    if (selected.size !== VALENTINE_DATA.captchaTiles.length) {
      setPhase("invalid_shake");
      setShowSelectionError(true);
      if (errorTimerRef.current !== null) window.clearTimeout(errorTimerRef.current);
      errorTimerRef.current = window.setTimeout(() => {
        setShowSelectionError(false);
        errorTimerRef.current = null;
      }, 1200);
      return;
    }

    setShowSelectionError(false);
    setPhase("scanning");
  };

  return (
    <section className="h-full flex items-center justify-center px-4">
      <AnimatePresence mode="wait">
        {phase !== "scanning" ? (
          <motion.div
            key="captcha-card"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              x: phase === "invalid_shake" ? [-10, 10, -8, 8, -4, 4, 0] : 0,
            }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{
              duration: phase === "invalid_shake" ? 0.42 : 0.5,
              ease: "easeOut",
            }}
            onAnimationComplete={() => {
              if (phase === "invalid_shake") {
                setSelected(new Set());
                setPhase("idle");
              }
            }}
            className="bg-card text-card-foreground rounded shadow-2xl overflow-hidden w-full max-w-[340px]"
          >
            <div className="bg-[hsl(217,89%,51%)] px-4 py-3">
              <p className="text-white font-outfit text-sm font-medium">
                Select all images of <strong>your BF</strong>.
              </p>
            </div>

            <div className="p-1 bg-card">
              <div className="grid grid-cols-3 gap-[2px]">
                {VALENTINE_DATA.captchaTiles.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => toggleTile(i)}
                    className="relative aspect-square overflow-hidden focus:outline-none disabled:cursor-not-allowed"
                    disabled={phase !== "idle"}
                  >
                    <img src={src} alt={`Tile ${i + 1}`} className="w-full h-full object-cover" />
                    {selected.has(i) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 bg-[hsl(217,89%,51%)]/40 flex items-center justify-center"
                      >
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      </motion.div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between px-4 py-3 bg-card border-t border-border">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleRobotCheck}
                  className="w-7 h-7 rounded-sm border-2 border-[hsl(0,0%,75%)] flex items-center justify-center disabled:opacity-60"
                  aria-label="I am not a robot"
                  aria-pressed={robotChecked}
                  disabled={phase !== "idle"}
                >
                  {robotChecked && (
                    <svg className="w-5 h-5 text-[hsl(145,63%,42%)]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  )}
                </button>
                <span className="text-sm font-outfit text-card-foreground">I&apos;m not a robot</span>
              </div>

              <button
                onClick={handleVerify}
                disabled={!robotChecked || phase !== "idle"}
                className="px-4 py-1.5 text-sm font-outfit font-medium rounded bg-[hsl(217,89%,51%)] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[hsl(217,89%,45%)] transition-colors"
              >
                Verify
              </button>
            </div>

            <AnimatePresence>
              {showSelectionError && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="px-4 py-2 text-xs font-outfit text-center text-red-500 bg-card border-t border-border"
                >
                  Select all images of your BF to continue.
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="retina-scan"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="tech-panel relative w-full max-w-[340px] h-[352px] overflow-hidden"
          >
            <div className="tech-grid-overlay absolute inset-0" />
            <div className={`retina-scan-line ${scanActive ? "opacity-100" : "opacity-0"}`} />

            <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
              <p className="text-[11px] font-mono tracking-[0.32em] text-cyan-100/75">SECURE AUTH</p>

              <div className="relative mt-5 mb-4">
                <div className={`retina-ring ${scanActive ? "is-active" : ""}`} />
                <div className="h-20 w-20 rounded-full border border-cyan-200/45 bg-cyan-300/10 flex items-center justify-center">
                  <div className="h-8 w-8 rounded-full border border-cyan-100/80 bg-cyan-100/20" />
                </div>
              </div>

              <h2 className="status-flicker font-outfit text-cyan-100 text-lg tracking-[0.18em]">
                SCANNING RETINA...
              </h2>
              <p aria-live="polite" className="mt-3 text-[11px] font-mono tracking-[0.18em] text-cyan-100/80">
                {scanStatus}
              </p>

              <div className="mt-6 w-full max-w-[245px] h-2 rounded-full bg-cyan-100/10 border border-cyan-200/25 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-300 via-cyan-200 to-fuchsia-300 transition-[width] ease-linear"
                  style={{ width: `${scanProgress}%`, transitionDuration: "1500ms" }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default CaptchaGate;
