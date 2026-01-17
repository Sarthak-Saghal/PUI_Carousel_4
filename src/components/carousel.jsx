import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";

const ITEMS = [
  { id: 1, title: "NIGHTCRAWLER", img: "https://i.pinimg.com/736x/26/52/73/265273b1dd2e1d8dc5ae43ffbc5a1da2.jpg" },
  { id: 2, title: "CYBERPUNK", img: "https://i.pinimg.com/736x/ec/22/47/ec2247e1ca377e13d3377378306117f1.jpg" },
  { id: 3, title: "GLITCH-ART", img: "https://i.pinimg.com/736x/b3/eb/42/b3eb4209902e0ddce1ab99dc1b991566.jpg" },
  { id: 4, title: "NEON-DREAM", img: "https://i.pinimg.com/1200x/25/1f/96/251f96a26ee054232c1971340ff63369.jpg" },
  { id: 5, title: "VOID-SPACE", img: "https://i.pinimg.com/736x/92/b3/69/92b3694f4804446940dd9a732ec28f6d.jpg" },
];

const DistributedCosmos = () => {
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Handle Responsive Check
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const next = useCallback(() => {
    setIndex((prev) => (prev + 1) % ITEMS.length);
  }, []);

  const prev = () => setIndex((prev) => (prev - 1 + ITEMS.length) % ITEMS.length);

  useEffect(() => {
    const timer = setInterval(next, 4500); // Slightly slower for better UX
    return () => clearInterval(timer);
  }, [next]);

  const getPointStyle = (i) => {
    let rel = i - index;
    if (rel < -2) rel += ITEMS.length;
    if (rel > 2) rel -= ITEMS.length;

    // Responsive multipliers
    const xMult = isMobile ? 0.35 : 1;
    const yMult = isMobile ? 0.6 : 1;
    const zMult = isMobile ? 0.5 : 1;

    const points = {
      "0":  { x: 0,    y: 0,    z: 100 * zMult,  rot: 0,   scale: 1,   blur: 0, opacity: 1 },
      "1":  { x: 450 * xMult,  y: -120 * yMult, z: -300 * zMult, rot: 25,  scale: 0.8, blur: 4, opacity: 0.6 },
      "2":  { x: -200 * xMult, y: -350 * yMult, z: -600 * zMult, rot: -15, scale: 0.6, blur: 8, opacity: 0.3 },
      "-1": { x: -450 * xMult, y: 150 * yMult,  z: -300 * zMult, rot: -25, scale: 0.8, blur: 4, opacity: 0.6 },
      "-2": { x: 200 * xMult,  y: 350 * yMult,  z: -600 * zMult, rot: 15,  scale: 0.6, blur: 8, opacity: 0.3 },
    };

    return points[rel] || { x: 0, y: 0, z: -1000, opacity: 0 };
  };

  // Handle Swipe Gesture for Mobile
  const handleDragEnd = (e, info) => {
    if (info.offset.x > 50) prev();
    else if (info.offset.x < -50) next();
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-zinc-950 font-sans text-white touch-none">
      
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:30px_30px] md:bg-[size:40px_40px]" />
      
      {/* 3D Scene */}
      <div className="relative z-10 flex h-full w-full items-center justify-center" style={{ perspective: isMobile ? "1200px" : "2000px" }}>
        <AnimatePresence mode="popLayout">
          {ITEMS.map((item, i) => {
            const point = getPointStyle(i);
            const isActive = i === index;

            return (
              <motion.div
                key={item.id}
                drag={isActive ? "x" : false} // Only active card can be dragged
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
                animate={{
                  x: point.x,
                  y: point.y,
                  z: point.z,
                  rotateY: point.rot,
                  scale: point.scale,
                  opacity: point.opacity,
                  filter: `blur(${point.blur}px)`,
                }}
                transition={{
                  type: "spring",
                  stiffness: 60,
                  damping: 20,
                }}
                // RESPONSIVE SIZING: 
                // Mobile: 75vw, Desktop: 340px
                className="absolute h-[60vh] max-h-[500px] w-[75vw] max-w-[340px] cursor-grab active:cursor-grabbing"
                style={{ transformStyle: "preserve-3d" }}
                onClick={() => setIndex(i)}
              >
                {/* Card Body */}
                <div className="relative h-full w-full overflow-hidden rounded-[30px] md:rounded-[40px] border border-white/10 bg-zinc-900 shadow-2xl">
                  
                  <motion.img
                    src={item.img}
                    animate={{ 
                      scale: [1, 1.1, 1],
                      x: [0, -5, 5, 0],
                    }}
                    transition={{ 
                      duration: 20, 
                      repeat: Infinity, 
                      ease: "linear" 
                    }}
                    className="h-full w-full object-cover opacity-60"
                  />

                  {/* Text Overlay */}
                  <div className={`absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-transparent p-6 md:p-10 transition-opacity duration-700 ${isActive ? "opacity-100" : "opacity-0"}`}>
                    <motion.span 
                      animate={isActive ? { x: 0, opacity: 0.5 } : { x: -20, opacity: 0 }}
                      className="text-[8px] md:text-[10px] font-bold tracking-[0.4em] md:tracking-[0.5em] text-white"
                    >
                      COLLECTION 2025
                    </motion.span>
                    <motion.h2 
                      animate={isActive ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                      className="mt-1 md:mt-2 text-2xl md:text-4xl font-black italic tracking-tighter"
                    >
                      {item.title}
                    </motion.h2>
                  </div>
                </div>

                {/* Glow */}
                <div className="absolute -inset-4 z-[-1] rounded-[50px] bg-white/5 blur-2xl" />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Floating Controls - Scaled for Mobile */}
      <div className="absolute bottom-8 md:bottom-12 left-1/2 z-50 flex -translate-x-1/2 items-center gap-6 md:gap-10 rounded-full border border-white/5 bg-black/40 p-1.5 md:p-2 backdrop-blur-xl">
        <button onClick={prev} className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full hover:bg-white hover:text-black transition-colors">
          <ArrowLeft size={18} />
        </button>

        <div className="flex gap-1.5 md:gap-2">
          {ITEMS.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 transition-all duration-500 ${index === i ? "w-6 md:w-8 bg-white" : "w-1.5 md:w-2 bg-white/20"}`} 
            />
          ))}
        </div>

        <button onClick={next} className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full hover:bg-white hover:text-black transition-colors">
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Static Vignette */}
      <div className="pointer-events-none absolute inset-0 z-40 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] md:bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
    </div>
  );
};

export default DistributedCosmos;