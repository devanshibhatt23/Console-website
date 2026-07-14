import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ParticlesProvider, Particles } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';
import GridGlow from './GridGlow';
import ConstellationDraw from './ConstellationDraw';
import { useAuth } from '../../context/AuthContext';

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
// Fixed wall-clock duration for the whole scramble — driven by requestAnimationFrame and
// elapsed time (not tick count), so the perceived speed stays constant even if the main
// thread is briefly busy (e.g. particles rendering) and a few frames get skipped.
const SCRAMBLE_DURATION_MS = 600;

function useScramble(originalText: string) {
  const [displayText, setDisplayText] = useState(originalText);
  const rafRef = useRef<number | null>(null);
  const isScrambling = useRef(false);

  const scramble = useCallback(() => {
    if (isScrambling.current) return;
    isScrambling.current = true;
    const startTime = performance.now();
    const length = originalText.length;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / SCRAMBLE_DURATION_MS);
      const revealedCount = Math.floor(progress * length);

      setDisplayText(
        originalText
          .split('')
          .map((char, i) => {
            if (i < revealedCount) return originalText[i];
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          })
          .join('')
      );

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplayText(originalText);
        isScrambling.current = false;
        rafRef.current = null;
      }
    };

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, [originalText]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
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
          {/* Welcome to — Montserrat bold white */}
          <motion.h2
            variants={itemVariants}
            className="font-montserrat cursor-default select-none w-full text-center"
            style={{
              fontSize: '90px',
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: '0.85',
              letterSpacing: '-3px',
              margin: '0',
              padding: '0',
              marginTop: '40px',
            }}
          >
            Welcome to
          </motion.h2>

          {/* CONSOLE — Montserrat bold gradient, scramble on hover + glow */}
          <div className="relative flex flex-col items-center w-full" style={{ marginTop: '12px', marginBottom: '24px' }}>
            <h1
              className="font-montserrat cursor-default pointer-events-auto select-none transition-all duration-300 w-full text-center"
              style={{
                fontSize: '110px',
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 900,
                lineHeight: '0.9',
                letterSpacing: '-3px',
                margin: '0',
                padding: '0',
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
            className="text-lg md:text-xl lg:text-2xl font-inter font-medium text-white/80 tracking-wide"
            style={{ marginBottom: '48px' }}
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
              <Link
                to="/login"
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
              </Link>
            )}

            {/* Explore Console */}
            <a
              href="#about"
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
              <span>Explore Console</span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
