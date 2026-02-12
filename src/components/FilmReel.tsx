import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { VALENTINE_DATA } from "@/lib/valentineData";

const FilmReel = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState<Set<number>>(new Set());

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["10%", "-60%"]);

  const toggleFlip = (index: number) => {
    const next = new Set(flipped);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    setFlipped(next);
  };

  const sprocketHoles = Array.from({ length: 24 });

  return (
    <section ref={containerRef} className="relative py-20" style={{ height: "200vh" }}>
      {/* Title */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="font-emilys text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-foreground text-center mb-8 px-4 drop-shadow-lg"
        >
          HAPPY VALENTINES DAY
        </motion.h1>

        {/* Film Strip */}
        <motion.div className="relative w-full" style={{ x }}>
          <div className="bg-[hsl(0,0%,8%)] py-2">
            {/* Top sprocket holes */}
            <div className="flex gap-8 px-4 mb-2 justify-around">
              {sprocketHoles.map((_, i) => (
                <div key={`top-${i}`} className="sprocket-hole flex-shrink-0" />
              ))}
            </div>

            {/* Images */}
            <div className="flex gap-1 px-4">
              {VALENTINE_DATA.filmStripImages.map((item, i) => (
                <div
                  key={i}
                  onClick={() => toggleFlip(i)}
                  className="relative flex-shrink-0 w-[200px] sm:w-[260px] md:w-[300px] h-[150px] sm:h-[190px] md:h-[220px] cursor-pointer"
                  style={{ perspective: "600px" }}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {!flipped.has(i) ? (
                      <motion.div
                        key="front"
                        initial={{ rotateY: 90 }}
                        animate={{ rotateY: 0 }}
                        exit={{ rotateY: -90 }}
                        transition={{ duration: 0.35 }}
                        className="absolute inset-0 rounded overflow-hidden"
                      >
                        <img
                          src={item.image}
                          alt={`Memory ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="back"
                        initial={{ rotateY: 90 }}
                        animate={{ rotateY: 0 }}
                        exit={{ rotateY: -90 }}
                        transition={{ duration: 0.35 }}
                        className="absolute inset-0 rounded bg-[hsl(0,0%,12%)] flex items-center justify-center p-4"
                      >
                        <p className="font-lifesavers text-white text-center text-xs sm:text-sm font-bold leading-relaxed">
                          {item.caption}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Bottom sprocket holes */}
            <div className="flex gap-8 px-4 mt-2 justify-around">
              {sprocketHoles.map((_, i) => (
                <div key={`bot-${i}`} className="sprocket-hole flex-shrink-0" />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FilmReel;
