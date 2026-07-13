import { useState, useEffect, useRef, useCallback } from 'react';
import { ParticlesProvider, Particles } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';
import GridGlow from './GridGlow';
import ConstellationDraw from './ConstellationDraw';
import { useAuth } from '../../context/AuthContext';

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function useScramble(originalText: string) {
  const [displayText, setDisplayText] = useState(originalText);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isScrambling = useRef(false);

  const scramble = useCallback(() => {
    if (isScrambling.current) return;
    isScrambling.current = true;
    let iteration = 0;
    const maxIterations = originalText.length * 4;

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setDisplayText(
        originalText
          .split('')
          .map((char, i) => {
            if (i < Math.floor(iteration / 4)) return originalText[i];
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          })
          .join('')
      );
      iteration++;
      if (iteration > maxIterations) {
        clearInterval(intervalRef.current!);
        setDisplayText(originalText);
        isScrambling.current = false;
      }
    }, 28);
  }, [originalText]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { displayText, scramble };
}

export default function Hero() {
  const { user } = useAuth();
  const { displayText, scramble } = useScramble('CONSOLE');
  const [isHoveringConsole, setIsHoveringConsole] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const gradientTextStyle = {
    background: 'linear-gradient(90deg, #F2994A 0%, #F0405C 100%)',
    WebkitBackgroundClip: 'text' as const,
    WebkitTextFillColor: 'transparent' as const,
    backgroundClip: 'text' as const,
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden pt-32 pb-48"
    >
      <GridGlow />

      {/* Particles */}
      <div className="absolute inset-0 z-0">
        <ParticlesProvider init={async (engine) => await loadSlim(engine)}>
          <Particles
            id="tsparticles"
            options={{
              fullScreen: false,
              background: { color: { value: 'transparent' } },
              fpsLimit: 60,
              interactivity: {
                events: { onHover: { enable: true, mode: 'grab' } },
                modes: { grab: { distance: 140, links: { opacity: 0.5 } } },
              },
              particles: {
                color: { value: '#F2994A' },
                links: {
                  color: '#F0405C',
                  distance: 150,
                  enable: true,
                  opacity: 0.15,
                  width: 1,
                },
                move: {
                  direction: 'none',
                  enable: true,
                  outModes: { default: 'bounce' },
                  random: false,
                  speed: 0.5,
                  straight: false,
                },
                number: {
                  density: { enable: true, width: 800 },
                  value: 40,
                },
                opacity: { value: 0.25 },
                shape: { type: 'circle' },
                size: { value: { min: 1, max: 2 } },
              },
              detectRetina: true,
            }}
            className="w-full h-full"
          />
        </ParticlesProvider>
      </div>

      {/* Radial overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/50 to-black z-0" />

      <ConstellationDraw />

      <div className="relative z-10 container mx-auto px-6 text-center pointer-events-none">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto flex flex-col items-center"
        >
          {/* Welcome to — same size & gradient as CONSOLE */}
          <motion.h2
            variants={itemVariants}
            className="font-montserrat font-black tracking-tighter leading-none mb-2 mt-10 cursor-default select-none"
            style={{
              fontSize: '42px',
              ...gradientTextStyle,
            }}
          >
            Welcome to
          </motion.h2>

          {/* CONSOLE — scramble on hover + glow */}
          <div className="relative flex flex-col items-center mb-10">
            <h1
              className="font-montserrat font-black tracking-tighter leading-none pb-2 cursor-default pointer-events-auto select-none transition-all duration-300"
              style={{
                fontSize: '42px',
                ...gradientTextStyle,
                filter: isHoveringConsole
                  ? 'drop-shadow(0 0 40px rgba(242,153,74,0.7)) drop-shadow(0 0 80px rgba(240,64,92,0.5))'
                  : 'drop-shadow(0 4px 12px rgba(0,0,0,0.8))',
              }}
              onMouseEnter={() => {
                setIsHoveringConsole(true);
                scramble();
              }}
              onMouseLeave={() => setIsHoveringConsole(false)}
            >
              {displayText}
            </h1>

            {/* Glow orb behind CONSOLE on hover */}
            <div
              className="absolute inset-0 -z-10 blur-3xl rounded-full transition-opacity duration-500 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(242,153,74,0.25) 0%, rgba(240,64,92,0.15) 50%, transparent 70%)',
                opacity: isHoveringConsole ? 1 : 0,
              }}
            />
          </div>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl lg:text-2xl font-inter font-medium text-white/80 mb-20 tracking-wide"
          >
            Tech Community of MNIT
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center gap-5 w-full sm:w-auto pointer-events-auto"
          >
            {/* Join the community — hidden when logged in */}
            {!user && (
              <a
                href="#community"
                className="group relative px-6 py-3 text-white font-inter font-semibold rounded-full overflow-hidden flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, #F2994A, #F0405C)',
                  boxShadow: '0 4px 20px rgba(242,153,74,0.35)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    '0 6px 28px rgba(242,153,74,0.55)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    '0 4px 20px rgba(242,153,74,0.35)';
                }}
              >
                Join the community
              </a>
            )}

            {/* Explore Console */}
            <a
              href="#about"
              className="px-6 py-3 bg-white/5 border border-white/15 text-white font-inter font-medium rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
              style={{
                boxShadow: '0 0 0 1px rgba(255,255,255,0.08)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  '0 0 12px rgba(242,153,74,0.25), 0 0 0 1px rgba(242,153,74,0.3)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(242,153,74,0.3)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  '0 0 0 1px rgba(255,255,255,0.08)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)';
              }}
            >
              <Terminal className="w-4 h-4" style={{ color: '#F2994A' }} />
              <span>Explore Console</span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
