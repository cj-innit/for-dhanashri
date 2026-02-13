import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CaptchaGate from "@/components/CaptchaGate";
import FooterBar from "@/components/FooterBar";
import { useCursor } from "@/lib/cursorContext";
import { VALENTINE_DATA } from "@/lib/valentineData";
import { preloadFilmReelImages } from "@/lib/filmReelPreload";

const VerificationPage = () => {
  const navigate = useNavigate();
  const { setVariant } = useCursor();

  useEffect(() => {
    setVariant("saturn");
    void preloadFilmReelImages(VALENTINE_DATA.memories.map((memory) => memory.url));
  }, [setVariant]);

  return (
    <div className="relative h-screen overflow-hidden">
      <div
        className="page-bg-layer"
        style={{ backgroundImage: "url('/background_images/global_bg.JPG')" }}
      />
      <div className="page-bg-overlay" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.3), rgba(0,0,0,0.62))" }} />

      <div className="page-content-layer h-full">
        <CaptchaGate onVerified={() => navigate("/gallery")} />
      </div>
      <FooterBar />
    </div>
  );
};

export default VerificationPage;
