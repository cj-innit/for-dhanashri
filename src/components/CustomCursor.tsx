import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import type { CursorVariant } from "@/lib/cursorContext";

interface CustomCursorProps {
  variant?: CursorVariant;
}

const CURSOR_STICKER_SRC: Record<Exclude<CursorVariant, "heart">, string> = {
  saturn: "/cursors/saturn.png",
  camera: "/cursors/camera.png",
  handcuff: "/cursors/handcuffs.png",
};

const HeartIcon = () => (
  <svg width="28" height="26" viewBox="0 0 28 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14 26L11.97 24.155C4.76 17.595 0 13.235 0 7.8C0 3.44 3.44 0 7.8 0C10.22 0 12.545 1.131 14 2.907C15.455 1.131 17.78 0 20.2 0C24.56 0 28 3.44 28 7.8C28 13.235 23.24 17.595 16.03 24.155L14 26Z"
      fill="hsl(340, 82%, 76%)"
    />
  </svg>
);

const CustomCursor = ({ variant = "heart" }: CustomCursorProps) => {
  const [visible, setVisible] = useState(false);

  // Browsers can't read OS mouse-sensitivity settings directly.
  // Tune spring for faster, tighter tracking to feel more responsive.
  const springConfig = { stiffness: 270, damping: 22, mass: 0.45 };
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const cursorX = useSpring(rawX, springConfig);
  const cursorY = useSpring(rawY, springConfig);
  const transform = useMotionTemplate`translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!visible) {
        rawX.jump(e.clientX);
        rawY.jump(e.clientY);
        setVisible(true);
        return;
      }
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [rawX, rawY, visible]);

  const icon =
    variant === "heart" ? (
      <HeartIcon />
    ) : (
      <img
        src={CURSOR_STICKER_SRC[variant]}
        alt={`${variant} cursor sticker`}
        className="pointer-events-none select-none"
        style={{ width: "40px", height: "auto" }}
        draggable={false}
      />
    );

  if (!visible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none"
      style={{ transform, willChange: "transform" }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={variant}
          initial={{ opacity: 0, scale: 0.82 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.82 }}
          transition={{ duration: 0.16, ease: "easeOut" }}
          className="pointer-events-none"
        >
          {icon}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default CustomCursor;
