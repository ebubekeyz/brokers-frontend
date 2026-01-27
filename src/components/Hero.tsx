import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Slide = {
  id: string;
  image: string;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
};

interface HeroSliderProps {
  slides: Slide[];
  autoplay?: boolean;
  delay?: number;
}

const Hero: React.FC<HeroSliderProps> = ({
  slides,
  autoplay = true,
  delay = 5000,
}) => {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const next = () => {
    setDir(1);
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const prev = () => {
    setDir(-1);
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goTo = (i: number) => {
    setDir(i > index ? 1 : -1);
    setIndex(i);
  };

  useEffect(() => {
    if (!autoplay) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(next, delay);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [index, autoplay, delay]);

  return (
    <div className="relative w-full h-[500px] overflow-hidden bg-gray-900 text-white">
      <AnimatePresence custom={dir}>
        <motion.div
          key={slides[index].id}
          custom={dir}
          initial={{ x: dir > 0 ? "100%" : "-100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: dir > 0 ? "-100%" : "100%", opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Background image */}
          <img
            src={slides[index].image}
            alt={slides[index].title}
            className="w-full h-full object-cover"
          />

          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.7) 100%)",
            }}
          />

          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center text-center p-6">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                {slides[index].title}
              </h1>
              <p className="text-gray-200 mb-6">{slides[index].description}</p>
              {slides[index].ctaLabel && (
                <a
                  href={slides[index].ctaHref || "#"}
                  className="inline-block px-6 py-3 bg-yellow-500 text-black font-semibold rounded hover:bg-yellow-400"
                >
                  {slides[index].ctaLabel}
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 p-2 rounded-full hover:bg-black/60"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 p-2 rounded-full hover:bg-black/60"
      >
        ›
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-3 h-3 rounded-full ${
              i === index ? "bg-yellow-500" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
