import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CustomCursor from "@/components/CustomCursor";
import { CursorProvider, useCursor } from "@/lib/cursorContext";
import Index from "./pages/Index";
import VerificationPage from "./pages/VerificationPage";
import GalleryPage from "./pages/GalleryPage";
import WordlePage from "./pages/WordlePage";
import FinalePage from "./pages/FinalePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { variant } = useCursor();

  return (
    <>
      <CustomCursor variant={variant} />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/verify" element={<VerificationPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/wordle" element={<WordlePage />} />
        <Route path="/finale" element={<FinalePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CursorProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </CursorProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
