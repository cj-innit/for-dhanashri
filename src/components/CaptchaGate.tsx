import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { VALENTINE_DATA } from "@/lib/valentineData";

interface CaptchaGateProps {
  onVerified: () => void;
}

const CaptchaGate = ({ onVerified }: CaptchaGateProps) => {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [verified, setVerified] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const toggleTile = (index: number) => {
    const next = new Set(selected);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    setSelected(next);
  };

  const handleVerify = () => {
    setVerified(true);
    setShowModal(true);

    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#e91e63", "#ff5252", "#ff80ab", "#f8bbd0", "#ffffff"],
    });

    setTimeout(() => {
      setShowModal(false);
      onVerified();
    }, 2500);
  };

  return (
    <section className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-card text-card-foreground rounded shadow-2xl overflow-hidden w-full max-w-[340px]"
      >
        {/* Blue header */}
        <div className="bg-[hsl(217,89%,51%)] px-4 py-3">
          <p className="text-white font-outfit text-sm font-medium">
            Select all images of <strong>your BF</strong>.
          </p>
        </div>

        {/* 3x3 grid */}
        <div className="p-1 bg-card">
          <div className="grid grid-cols-3 gap-[2px]">
            {VALENTINE_DATA.captchaTiles.map((src, i) => (
              <button
                key={i}
                onClick={() => !verified && toggleTile(i)}
                className="relative aspect-square overflow-hidden focus:outline-none"
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

        {/* Bottom bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-card border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-sm border-2 border-[hsl(0,0%,75%)] flex items-center justify-center">
              {verified && (
                <svg className="w-5 h-5 text-[hsl(145,63%,42%)]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              )}
            </div>
            <span className="text-sm font-outfit text-card-foreground">I'm not a robot</span>
          </div>

          <button
            onClick={handleVerify}
            disabled={selected.size < 3 || verified}
            className="px-4 py-1.5 text-sm font-outfit font-medium rounded bg-[hsl(217,89%,51%)] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[hsl(217,89%,45%)] transition-colors"
          >
            Verify
          </button>
        </div>
      </motion.div>

      {/* Success Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative glassmorphism px-8 py-6 text-center">
              <div className="text-5xl mb-3">✅</div>
              <h2 className="text-2xl font-lifesavers font-bold text-white">Verification Successful</h2>
              <p className="text-white/80 font-outfit mt-1 text-sm">Welcome, lover 💕</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default CaptchaGate;
