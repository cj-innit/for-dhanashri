import { useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import CustomCursor from "@/components/CustomCursor";
import FooterBar from "@/components/FooterBar";

const hearts = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 3,
  duration: 3 + Math.random() * 4,
  size: 16 + Math.random() * 24,
}));

const FinalePage = () => {
  useEffect(() => {
    // Fire celebratory confetti
    const end = Date.now() + 3000;
    const colors = ["#e91e63", "#ff5252", "#ff80ab", "#f8bbd0", "#ffffff"];
    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <CustomCursor />

      {/* Floating hearts background */}
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          className="absolute pointer-events-none text-primary"
          style={{ left: `${h.x}%`, fontSize: h.size }}
          initial={{ y: "110vh", opacity: 0.6 }}
          animate={{ y: "-10vh", opacity: [0.6, 1, 0.6] }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          ♥
        </motion.div>
      ))}

      {/* Main content */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 150, damping: 15, delay: 0.3 }}
        className="relative z-10 flex flex-col items-center gap-8 px-6 text-center"
      >
        {/* Pulsing heart */}
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          className="text-9xl"
        >
          💕
        </motion.div>

        <h1 className="font-emilys text-5xl sm:text-7xl md:text-8xl text-foreground drop-shadow-lg">
          I Love You
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="font-lifesavers text-xl sm:text-2xl text-foreground/90 max-w-md font-bold"
        >
          You make every day feel like Valentine's Day 💝
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="font-outfit text-foreground/70 text-sm"
        >
          — forever yours 🧁
        </motion.p>
      </motion.div>

      <FooterBar />
    </div>
  );
};

export default FinalePage;
