import { useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import FooterBar from "@/components/FooterBar";
import { useCursor } from "@/lib/cursorContext";

const hearts = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 3,
  duration: 3 + Math.random() * 4,
  size: 16 + Math.random() * 24,
}));

const FinalePage = () => {
  const { setVariant } = useCursor();

  useEffect(() => {
    setVariant("heart");
  }, [setVariant]);

  useEffect(() => {
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
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      <div
        className="page-bg-layer"
        style={{ backgroundImage: "url('/background_images/global_bg.JPG')" }}
      />
      <div className="page-bg-overlay" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.32), rgba(0,0,0,0.6))" }} />

      {/* Floating hearts background */}
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          className="absolute pointer-events-none text-primary z-[5]"
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
        className="page-content-layer flex flex-col items-center gap-8 px-6 text-center"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          className="heart-photo-frame"
        >
          <div className="heart-photo-glow heart-clip" />
          <div
            className="heart-clip pointer-events-none absolute inset-0 border-2 border-red-500 shadow-[0_0_24px_rgba(239,68,68,1)]"
            style={{ transform: "scale(1)" }}
          />
          <div className="heart-clip relative w-full h-full overflow-hidden border-2 border-red/55 shadow-[0_0_34px_rgba(225,0,0,0.85)]">
            <img
              src="/finale_image.jpg"
              alt="Finale memory"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="heart-clip pointer-events-none absolute inset-0 border border-white/65" />
        </motion.div>

        <h1 className="font-emilys text-5xl sm:text-7xl md:text-8xl text-foreground drop-shadow-lg">
          I Love You and I Love Us
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="font-lifesavers text-xl sm:text-2xl text-foreground/90 max-w-md font-bold"
        >
          You are very important to me, bae, and I believe we can get through anything together. Happy Valentine's Day!
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="font-outfit text-foreground/70 text-sm"
        >
          — Your #1 fan, supporter, and freak
        </motion.p>
      </motion.div>

      <FooterBar />
    </div>
  );
};

export default FinalePage;
