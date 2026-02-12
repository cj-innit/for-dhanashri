import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

const CustomCursor = () => {
  const [visible, setVisible] = useState(false);

  const springConfig = { stiffness: 150, damping: 20 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [cursorX, cursorY, visible]);

  if (!visible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none"
      style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
    >
      <svg width="28" height="26" viewBox="0 0 28 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M14 26L11.97 24.155C4.76 17.595 0 13.235 0 7.8C0 3.44 3.44 0 7.8 0C10.22 0 12.545 1.131 14 2.907C15.455 1.131 17.78 0 20.2 0C24.56 0 28 3.44 28 7.8C28 13.235 23.24 17.595 16.03 24.155L14 26Z"
          fill="hsl(340, 82%, 76%)"
        />
      </svg>
    </motion.div>
  );
};

export default CustomCursor;
