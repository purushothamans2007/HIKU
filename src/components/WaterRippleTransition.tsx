import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface WaterRippleTransitionProps {
  screenKey: string;
}

interface RippleWave {
  id: number;
  timestamp: number;
}

export const WaterRippleTransition: React.FC<WaterRippleTransitionProps> = ({ screenKey }) => {
  const [waves, setWaves] = useState<RippleWave[]>([]);

  useEffect(() => {
    // Generate a fresh ripple event when screenKey changes
    const newWave: RippleWave = {
      id: Date.now(),
      timestamp: Date.now()
    };
    
    setWaves((prev) => [...prev.slice(-2), newWave]);

    const timer = setTimeout(() => {
      setWaves((prev) => prev.filter((w) => w.id !== newWave.id));
    }, 1100);

    return () => clearTimeout(timer);
  }, [screenKey]);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden flex items-center justify-center">
      {/* SVG Liquid Refraction Filter Definition */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="water-screen-refraction" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015 0.02"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="12"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <AnimatePresence>
        {waves.map((wave) => (
          <div key={wave.id} className="absolute inset-0 flex items-center justify-center">
            {/* Primary Center Liquid Flash */}
            <motion.div
              initial={{ scale: 0.1, opacity: 0.8 }}
              animate={{ scale: 3.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="w-72 h-72 rounded-full bg-gradient-to-r from-white/30 via-emerald-400/20 to-transparent blur-2xl"
            />

            {/* Concentric Water Wave Ring 1 */}
            <motion.div
              initial={{ scale: 0.1, opacity: 0.9, borderWidth: '3px' }}
              animate={{ scale: 4.8, opacity: 0, borderWidth: '1px' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
              className="absolute w-64 h-64 rounded-full border border-white/80 shadow-[0_0_30px_rgba(255,255,255,0.6)]"
            />

            {/* Concentric Water Wave Ring 2 (Delayed Secondary Harmonic Wave) */}
            <motion.div
              initial={{ scale: 0.1, opacity: 0.7, borderWidth: '2px' }}
              animate={{ scale: 4.2, opacity: 0, borderWidth: '1px' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.05, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="absolute w-64 h-64 rounded-full border border-emerald-400/60 shadow-[0_0_25px_rgba(52,211,153,0.4)]"
            />

            {/* Concentric Water Wave Ring 3 (Outer Caustic Surge) */}
            <motion.div
              initial={{ scale: 0.1, opacity: 0.55, borderWidth: '2px' }}
              animate={{ scale: 5.4, opacity: 0, borderWidth: '0.5px' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.15, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="absolute w-64 h-64 rounded-full border border-white/50 shadow-[0_0_40px_rgba(255,255,255,0.3)]"
            />

            {/* Shimmering Caustic Light Radial Sweep */}
            <motion.div
              initial={{ scale: 0.3, opacity: 0.6, rotate: 0 }}
              animate={{ scale: 4.0, opacity: 0, rotate: 45 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.0, ease: 'easeOut' }}
              className="absolute w-96 h-96 rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.22)_0%,_rgba(52,211,153,0.1)_40%,_transparent_70%)] blur-xl"
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};
