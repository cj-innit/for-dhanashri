import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type CursorVariant = "heart" | "saturn" | "camera" | "handcuff";

interface CursorContextValue {
  variant: CursorVariant;
  setVariant: (next: CursorVariant) => void;
}

const CursorContext = createContext<CursorContextValue | null>(null);

export const CursorProvider = ({ children }: { children: ReactNode }) => {
  const [variant, setVariantState] = useState<CursorVariant>("heart");

  const setVariant = useCallback((next: CursorVariant) => {
    setVariantState(next);
  }, []);

  const value = useMemo<CursorContextValue>(
    () => ({
      variant,
      setVariant,
    }),
    [variant, setVariant],
  );

  return <CursorContext.Provider value={value}>{children}</CursorContext.Provider>;
};

export const useCursor = () => {
  const context = useContext(CursorContext);
  if (!context) {
    throw new Error("useCursor must be used within CursorProvider");
  }
  return context;
};

