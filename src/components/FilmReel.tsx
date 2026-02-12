import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VALENTINE_DATA } from "@/lib/valentineData";

interface FilmReelProps {
  onAllViewed: () => void;
}

const ITEM_COUNT = VALENTINE_DATA.filmStripImages.length;
const AUTO_SPEED = 0.5; // px per frame
const FLIP_DURATION = 7000; // ms

const FilmReel = ({ onAllViewed }: FilmReelProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const [viewed, setViewed] = useState<Set<number>>(new Set());
  const [transitioned, setTransitioned] = useState(false);
  const animRef = useRef<number>(0);
  const pausedRef = useRef(false);

  // Keep ref in sync
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  // Auto-scroll loop
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const tick = () => {
      if (!pausedRef.current && el) {
        el.scrollLeft += AUTO_SPEED;
        // Infinite loop: reset when halfway through duplicated content
        const halfWidth = el.scrollWidth / 2;
        if (el.scrollLeft >= halfWidth) {
          el.scrollLeft -= halfWidth;
        }
      }
      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const handleImageClick = useCallback((index: number) => {
    if (flippedIndex !== null) return;

    setPaused(true);
    setFlippedIndex(index);

    const newViewed = new Set(viewed);
    newViewed.add(index);
    setViewed(newViewed);

    // Auto flip back after 7 seconds
    setTimeout(() => {
      setFlippedIndex(null);
      setPaused(false);

      // Check if all viewed
      if (newViewed.size >= ITEM_COUNT && !transitioned) {
        setTransitioned(true);
        setTimeout(() => onAllViewed(), 1000);
      }
    }, FLIP_DURATION);
  }, [flippedIndex, viewed, onAllViewed, transitioned]);

  const sprocketHoles = Array.from({ length: 30 });

  // Duplicate images for infinite loop
  const images = [...VALENTINE_DATA.filmStripImages, ...VALENTINE_DATA.filmStripImages];

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-0">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="font-emilys text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-foreground text-center mb-8 px-4 drop-shadow-lg">
        HAPPY  VALENTINES DAY BAE!

      </motion.h1>

      {/* Film Strip Container */}
      <div className="relative w-full" style={{ height: "40vh" }}>
        {/* Top sprocket holes - transparent cutouts */}
        <div className="absolute top-0 left-0 right-0 h-6 bg-[hsl(0,0%,0%)] z-10 flex items-center justify-around px-2">
          {sprocketHoles.map((_, i) =>
          <div
            key={`top-${i}`}
            className="w-4 h-5 rounded-sm flex-shrink-0"
            style={{
              background: "hsl(var(--background))",
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5)"
            }} />

          )}
        </div>

        {/* Bottom sprocket holes */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-[hsl(0,0%,0%)] z-10 flex items-center justify-around px-2">
          {sprocketHoles.map((_, i) =>
          <div
            key={`bot-${i}`}
            className="w-4 h-5 rounded-sm flex-shrink-0"
            style={{
              background: "hsl(var(--background))",
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5)"
            }} />

          )}
        </div>

        {/* Black film borders */}
        <div className="absolute inset-0 border-y-[24px] border-[hsl(0,0%,0%)] pointer-events-none z-[5]" />

        {/* Scrolling content */}
        <div
          ref={scrollRef}
          className="absolute inset-0 overflow-x-hidden overflow-y-hidden bg-[hsl(0,0%,0%)]"
          style={{ scrollbarWidth: "none" }}>

          <div className="flex h-full items-center gap-1 px-1 py-7">
            {images.map((item, i) => {
              const realIndex = i % ITEM_COUNT;
              const isFlipped = flippedIndex === realIndex;

              return (
                <div
                  key={i}
                  onClick={() => handleImageClick(realIndex)}
                  className="relative flex-shrink-0 h-[calc(100%-8px)] cursor-pointer"
                  style={{
                    aspectRatio: "9/16",
                    perspective: "800px"
                  }}>

                  <AnimatePresence mode="wait" initial={false}>
                    {!isFlipped ?
                    <motion.div
                      key="front"
                      initial={{ rotateY: 90 }}
                      animate={{ rotateY: 0 }}
                      exit={{ rotateY: -90 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 rounded-sm overflow-hidden">

                        <img
                        src={item.image}
                        alt={`Memory ${realIndex + 1}`}
                        className="w-full h-full object-cover" />

                        {!viewed.has(realIndex) &&
                      <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary animate-pulse" />
                      }
                      </motion.div> :

                    <motion.div
                      key="back"
                      initial={{ rotateY: 90 }}
                      animate={{ rotateY: 0 }}
                      exit={{ rotateY: -90 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 rounded-sm bg-[hsl(0,0%,8%)] flex items-center justify-center p-3">

                        <p className="font-lifesavers text-white text-center text-xs sm:text-sm font-bold leading-relaxed">
                          {item.caption}
                        </p>
                      </motion.div>
                    }
                  </AnimatePresence>
                </div>);

            })}
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <p className="font-outfit text-foreground/70 text-sm mt-4">
        {viewed.size}/{ITEM_COUNT} memories viewed — click each photo to reveal its story
      </p>
    </section>);

};

export default FilmReel;