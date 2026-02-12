import { useState } from "react";
import CustomCursor from "@/components/CustomCursor";
import CaptchaGate from "@/components/CaptchaGate";
import FilmReel from "@/components/FilmReel";
import WordleGame from "@/components/WordleGame";
import FooterBar from "@/components/FooterBar";

const Index = () => {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <div className={`relative min-h-screen ${!unlocked ? "overflow-hidden h-screen" : ""}`}>
      <CustomCursor />

      {/* Captcha Gate */}
      <CaptchaGate onVerified={() => setUnlocked(true)} />

      {/* Unlocked content */}
      {unlocked && (
        <>
          <FilmReel />
          <WordleGame />
        </>
      )}

      <FooterBar />
    </div>
  );
};

export default Index;
