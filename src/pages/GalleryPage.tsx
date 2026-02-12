import { useNavigate } from "react-router-dom";
import CustomCursor from "@/components/CustomCursor";
import FilmReel from "@/components/FilmReel";
import FooterBar from "@/components/FooterBar";

const GalleryPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen">
      <CustomCursor />
      <FilmReel onAllViewed={() => navigate("/wordle")} />
      <FooterBar />
    </div>
  );
};

export default GalleryPage;
