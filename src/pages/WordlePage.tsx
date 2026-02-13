import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WordleGame from "@/components/WordleGame";
import FooterBar from "@/components/FooterBar";
import { useCursor } from "@/lib/cursorContext";

const WordlePage = () => {
  const navigate = useNavigate();
  const { setVariant } = useCursor();

  useEffect(() => {
    setVariant("handcuff");
  }, [setVariant]);

  return (
    <div className="relative h-screen overflow-hidden flex flex-col items-center justify-center">
      <div
        className="page-bg-layer"
        style={{ backgroundImage: "url('/background_images/global_bg.JPG')" }}
      />
      <div className="page-bg-overlay" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.38), rgba(0,0,0,0.58))" }} />

      <div className="page-content-layer h-full w-full">
        <WordleGame onAllComplete={() => navigate("/finale")} />
      </div>
      <FooterBar />
    </div>
  );
};

export default WordlePage;
