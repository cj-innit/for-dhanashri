import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FilmReel from "@/components/FilmReel";
import FooterBar from "@/components/FooterBar";
import { useCursor } from "@/lib/cursorContext";

const GalleryPage = () => {
  const navigate = useNavigate();
  const { setVariant } = useCursor();

  useEffect(() => {
    setVariant("camera");
  }, [setVariant]);

  return (
    <div className="relative h-screen overflow-hidden">
      <div
        className="page-bg-layer"
        style={{ backgroundImage: "url('/background_images/film_reel_bg.jpg')" }}
      />
      <div className="page-bg-overlay" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.36), rgba(0,0,0,0.66))" }} />

      <div className="page-content-layer h-full">
        <FilmReel onNext={() => navigate("/wordle")} />
      </div>
      <FooterBar />
    </div>
  );
};

export default GalleryPage;
