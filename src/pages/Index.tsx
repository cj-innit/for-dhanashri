import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import FooterBar from "@/components/FooterBar";
import { useCursor } from "@/lib/cursorContext";

const Index = () => {
  const navigate = useNavigate();
  const { setVariant } = useCursor();

  useEffect(() => {
    setVariant("heart");
  }, [setVariant]);

  return (
    <div className="relative h-screen overflow-hidden flex items-center justify-center px-4">
      <div
        className="page-bg-layer"
        style={{ backgroundImage: "url('/background_images/start_bg.png')" }}
      />
      <div className="page-bg-blur" />
      <div className="page-bg-overlay" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.24), rgba(0,0,0,0.8))" }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="page-content-layer text-center max-w-2xl"
      >
        <h1 className="font-emilys text-5xl sm:text-7xl md:text-8xl text-foreground drop-shadow-lg">
          Happy Valentines Day my lovely Bae
        </h1>
        <p className="mt-4 font-outfit text-foreground/90 text-base sm:text-lg">
          I built a little journey for you. Hope you enjoy!
        </p>
        <button
          onClick={() => navigate("/verify")}
          className="mt-8 px-8 py-3 rounded-full bg-primary text-primary-foreground font-outfit font-semibold hover:opacity-90 transition-opacity"
        >
          Start
        </button>
      </motion.div>
      <FooterBar />
    </div>
  );
};

export default Index;
