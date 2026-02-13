import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { VALENTINE_DATA } from "@/lib/valentineData";

interface FilmReelProps {
  onNext: () => void;
}

const DEFAULT_RATIO = 3 / 4;
const PX_PER_SECOND = 120;
const FLIP_DURATION_MS = 7000;
const SPROCKET_COUNT = 28;
const REEL_COLOR = "#141414";
const REEL_HEADING = "LIFE IS TRULY A MOVIE WITH YOU BAE!";
const TYPE_INTERVAL_MS = 45;

const FilmReel = ({ onNext }: FilmReelProps) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const laneRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<Animation | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const pausedRef = useRef(false);

  const [laneHeight, setLaneHeight] = useState(0);
  const [ratios, setRatios] = useState<number[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [flippedCardKey, setFlippedCardKey] = useState<number | null>(null);
  const [viewedMemories, setViewedMemories] = useState<Set<number>>(new Set());
  const [typedHeading, setTypedHeading] = useState("");
  const topMaskId = useId();
  const bottomMaskId = useId();

  const memories = VALENTINE_DATA.memories;
  const duplicatedMemories = useMemo(() => [...memories, ...memories], [memories]);

  useEffect(() => {
    pausedRef.current = isPaused;
    if (!animationRef.current) return;
    if (isPaused) animationRef.current.pause();
    else animationRef.current.play();
  }, [isPaused]);

  useEffect(() => {
    let cancelled = false;

    const preloadRatios = async () => {
      const loadedRatios = await Promise.all(
        memories.map(
          (memory) =>
            new Promise<number>((resolve) => {
              const img = new Image();
              img.onload = () => {
                const nextRatio = img.naturalWidth / Math.max(img.naturalHeight, 1);
                resolve(Number.isFinite(nextRatio) && nextRatio > 0 ? nextRatio : DEFAULT_RATIO);
              };
              img.onerror = () => resolve(DEFAULT_RATIO);
              img.src = memory.url;
            }),
        ),
      );

      if (!cancelled) setRatios(loadedRatios);
    };

    preloadRatios();

    return () => {
      cancelled = true;
    };
  }, [memories]);

  const restartAnimation = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const halfWidth = track.scrollWidth / 2;
    animationRef.current?.cancel();
    animationRef.current = null;
    track.style.transform = "translateX(0)";

    if (!Number.isFinite(halfWidth) || halfWidth <= 0) return;

    const duration = (halfWidth / PX_PER_SECOND) * 1000;
    const anim = track.animate(
      [{ transform: "translateX(0)" }, { transform: `translateX(-${halfWidth}px)` }],
      { duration, easing: "linear", iterations: Infinity },
    );

    if (pausedRef.current) anim.pause();
    animationRef.current = anim;
  }, []);

  useEffect(() => {
    restartAnimation();
  }, [restartAnimation, laneHeight, ratios]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const lane = laneRef.current;
    if (!viewport || !lane) return;

    const updateMeasurements = () => {
      setLaneHeight(lane.clientHeight);
      restartAnimation();
    };

    updateMeasurements();

    const observer = new ResizeObserver(() => updateMeasurements());
    observer.observe(viewport);
    observer.observe(lane);

    return () => observer.disconnect();
  }, [restartAnimation]);

  useEffect(() => {
    return () => {
      animationRef.current?.cancel();
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    setTypedHeading("");
    let nextIndex = 0;
    const timerId = window.setInterval(() => {
      nextIndex += 1;
      setTypedHeading(REEL_HEADING.slice(0, nextIndex));
      if (nextIndex >= REEL_HEADING.length) window.clearInterval(timerId);
    }, TYPE_INTERVAL_MS);

    return () => window.clearInterval(timerId);
  }, []);

  

  const handleCardClick = useCallback((cardKey: number, memoryIndex: number) => {
    if (flippedCardKey !== null) return;

    setIsPaused(true);
    setFlippedCardKey(cardKey);
    setViewedMemories((prev) => {
      if (prev.has(memoryIndex)) return prev;
      const next = new Set(prev);
      next.add(memoryIndex);
      return next;
    });

    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);

    timeoutRef.current = window.setTimeout(() => {
      setFlippedCardKey(null);
      setIsPaused(false);
      timeoutRef.current = null;
    }, FLIP_DURATION_MS);
  }, [flippedCardKey]);

  const sprocketHoles = Array.from({ length: SPROCKET_COUNT });

  return (
    <section className="h-screen w-full overflow-hidden flex flex-col items-center justify-center px-0">
      <h1 className="font-emilys text-4xl sm:text-6xl md:text-7xl text-foreground text-center mb-4 px-4 drop-shadow-lg">
        {typedHeading}
      </h1>

      <div ref={viewportRef} className="relative w-full" style={{ height: "45vh" }}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-8 z-20">
            <svg className="w-full h-full" viewBox="0 0 100 32" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <mask id={topMaskId}>
                  <rect x="0" y="0" width="100" height="32" fill="white" />
                  {sprocketHoles.map((_, i) => {
                    const x = ((i + 0.5) / SPROCKET_COUNT) * 100;
                    return <rect key={`top-hole-${i}`} x={x - 1.1} y={6.8} width="2.2" height="18.4" rx="0.56" fill="black" />;
                  })}
                </mask>
              </defs>
              <rect x="0" y="0" width="100" height="32" fill={REEL_COLOR} mask={`url(#${topMaskId})`} />
              <line x1="0" y1="0.5" x2="100" y2="0.5" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
              {sprocketHoles.map((_, i) => {
                const x = ((i + 0.5) / SPROCKET_COUNT) * 100;
                return <rect key={`top-hole-stroke-${i}`} x={x - 1.1} y={6.8} width="2.2" height="18.4" rx="0.56" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.24" />;
              })}
            </svg>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-8 z-20">
            <svg className="w-full h-full" viewBox="0 0 100 32" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <mask id={bottomMaskId}>
                  <rect x="0" y="0" width="100" height="32" fill="white" />
                  {sprocketHoles.map((_, i) => {
                    const x = ((i + 0.5) / SPROCKET_COUNT) * 100;
                    return <rect key={`bottom-hole-${i}`} x={x - 1.1} y={6.8} width="2.2" height="18.4" rx="0.56" fill="black" />;
                  })}
                </mask>
              </defs>
              <rect x="0" y="0" width="100" height="32" fill={REEL_COLOR} mask={`url(#${bottomMaskId})`} />
              <line x1="0" y1="31.5" x2="100" y2="31.5" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
              {sprocketHoles.map((_, i) => {
                const x = ((i + 0.5) / SPROCKET_COUNT) * 100;
                return <rect key={`bottom-hole-stroke-${i}`} x={x - 1.1} y={6.8} width="2.2" height="18.4" rx="0.56" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.24" />;
              })}
            </svg>
          </div>

          <div
            ref={laneRef}
            className="absolute top-8 bottom-8 left-0 right-0 overflow-hidden"
            style={{ backgroundColor: REEL_COLOR }}
          >
            <div ref={trackRef} className="flex h-full items-center gap-4 px-8 will-change-transform">
              {duplicatedMemories.map((memory, i) => {
                const memoryIndex = i % memories.length;
                const ratio = ratios[memoryIndex] ?? DEFAULT_RATIO;
                const computedWidth = laneHeight > 0 ? laneHeight * ratio : 220;
                const isFlipped = flippedCardKey === i;
                const isViewed = viewedMemories.has(memoryIndex);

                return (
                  <div
                    key={`${memory.url}-${i}`}
                    className="h-full flex-shrink-0 cursor-pointer"
                    style={{ width: `${computedWidth}px`, perspective: "1200px" }}
                    onClick={() => handleCardClick(i, memoryIndex)}
                  >
                    <motion.div
                      animate={{ rotateY: isFlipped ? 180 : 0 }}
                      transition={{ duration: 0.7, ease: "easeInOut" }}
                      className="relative h-full w-full"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <div
                        className="absolute inset-0 flex items-center justify-center overflow-hidden"
                        style={{ backgroundColor: REEL_COLOR, backfaceVisibility: "hidden" }}
                      >
                        <img
                          src={memory.url}
                          alt={`Memory ${memoryIndex + 1}`}
                          className="w-full h-full object-contain"
                        />
                        {!isViewed && (
                          <span className="absolute top-2 right-2 w-3 h-3 rounded-full bg-red-600 animate-pulse" />
                        )}
                      </div>

                      <div
                        className="absolute inset-0 bg-[hsl(0,0%,8%)] text-white flex items-center justify-center p-4"
                        style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
                      >
                        <p className="font-lifesavers text-center text-sm sm:text-base font-bold leading-relaxed">
                          {memory.description}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <p className="font-outfit text-foreground/75 text-sm mt-4 text-center px-4">
        Tap a memory to pause, flip, and read its note.
      </p>
      <p className="font-outfit text-foreground/75 text-sm mt-1 text-center px-4">
        {viewedMemories.size}/{memories.length} memories viewed
      </p>

      <button
        onClick={onNext}
        className="mt-4 px-8 py-3 rounded-full bg-primary text-primary-foreground font-outfit font-semibold hover:opacity-90 transition-opacity"
      >
        Next
      </button>
    </section>
  );
};

export default FilmReel;
