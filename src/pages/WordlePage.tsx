import { useNavigate } from "react-router-dom";
import CustomCursor from "@/components/CustomCursor";
import WordleGame from "@/components/WordleGame";
import FooterBar from "@/components/FooterBar";

const WordlePage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      <CustomCursor />
      <WordleGame onAllComplete={() => navigate("/finale")} />
      <FooterBar />
    </div>
  );
};

export default WordlePage;
