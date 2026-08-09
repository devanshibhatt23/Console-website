import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ParticlesProvider, Particles } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import PuzzleImageBackground from '../3d/PuzzleBackground';

const CONSOLE_TEXT = 'CONSOLE';

export default function Hero() {
  const { user } = useAuth();
  const [isHoveringConsole, setIsHoveringConsole] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [typingDone, setTypingDone] = useState(false);

  useEffect(() => {
    let i = 0;
    setDisplayText('');
    setTypingDone(false);
    const interval = setInterval(() => {
      i++;
      setDisplayText(CONSOLE_TEXT.slice(0, i));
      if (i >= CONSOLE_TEXT.length) {
        clearInterval(interval);
        setTypingDone(true);
      }
    }, 110);
    return () => clearInterval(interval);
  }, []);

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

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden pt-32 pb-48 bg-[#06060c]"
    >
      {/* ✨ 3D Floating Puzzle Image Assembly Stage */}
      <PuzzleImageBackground />

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
                  opacity: 0.18,
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
                  value: 45,
                },
                opacity: { value: 0.3 },
                shape: { type: 'circle' },
                size: { value: { min: 1, max: 2.5 } },
              },
              detectRetina: true,
            }}
            className="w-full h-full"
          />
        </ParticlesProvider>
      </div>

      {/* 3D Perspective Floor Grid */}
      <div className="hero-perspective-container opacity-40">
        <div className="hero-perspective-grid" />
      </div>

      {/* Dual Glowing Ambient Orbs */}
      <div className="ambient-orb-orange" />
      <div className="ambient-orb-pink" />

      {/* High-Contrast Backdrop Scrim for 100% Pristine Text Visibility */}
      <div className="absolute inset-0 z-[5] pointer-events-none flex items-center justify-center">
        <div className="w-full max-w-4xl h-[450px] bg-radial from-black/80 via-black/50 to-transparent blur-2xl opacity-90" />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center pointer-events-none">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          {/* Eyebrow Label — Glass Badge Pill */}
          <motion.div variants={itemVariants} className="mb-4">
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/[0.07] border border-white/15 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.6)] select-none">
              <span className="w-2 h-2 rounded-full bg-[#F2994A] animate-pulse shadow-[0_0_10px_#F2994A]" />
              <span className="font-mono text-xs sm:text-sm tracking-[0.28em] uppercase text-white/95 font-bold">
                WELCOME TO
              </span>
            </div>
          </motion.div>

          {/* CONSOLE — Montserrat Bold High-Contrast Title */}
          <div className="relative flex flex-col items-center w-full my-2">
            <h1
              className="font-montserrat cursor-default pointer-events-auto select-none transition-all duration-300 w-full text-center tracking-tighter"
              style={{
                fontSize: 'clamp(64px, 14vw, 140px)',
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 900,
                lineHeight: '0.88',
                letterSpacing: '-4px',
                margin: '0',
                padding: '0',
                background: 'linear-gradient(135deg, #FFFFFF 0%, #F2994A 55%, #F0405C 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: isHoveringConsole
                  ? 'drop-shadow(0 10px 40px rgba(0,0,0,0.95)) drop-shadow(0 0 60px rgba(242,153,74,0.85)) drop-shadow(0 0 100px rgba(240,64,92,0.6))'
                  : 'drop-shadow(0 12px 30px rgba(0,0,0,0.95)) drop-shadow(0 0 40px rgba(242,153,74,0.35))',
              }}
              onMouseEnter={() => setIsHoveringConsole(true)}
              onMouseLeave={() => setIsHoveringConsole(false)}
            >
              {displayText}
              {!typingDone && (
                <span
                  className="console-cursor"
                  style={{
                    WebkitTextFillColor: '#F2994A',
                    color: '#F2994A',
                    fontWeight: 900,
                    animation: 'cursorBlink 0.7s step-end infinite',
                  }}
                >
                  |
                </span>
              )}
            </h1>

            {/* Glowing Aura Behind Text */}
            <div
              className="absolute inset-0 -z-10 blur-3xl rounded-full transition-opacity duration-500 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(242,153,74,0.3) 0%, rgba(240,64,92,0.2) 50%, transparent 75%)',
                opacity: isHoveringConsole ? 1 : 0.4,
              }}
            />
          </div>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl md:text-2xl font-inter font-semibold text-white/95 tracking-wide drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] mt-2 mb-10"
          >
            Tech Community of MNIT
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center gap-5 w-full sm:w-auto pointer-events-auto"
          >
            {!user && (
              <Link
                to="/login"
                className="group relative px-8 py-3.5 text-white font-inter font-semibold rounded-full overflow-hidden flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.03]"
                style={{
                  background: 'linear-gradient(135deg, #F2994A, #F0405C)',
                  boxShadow: '0 6px 28px rgba(242,153,74,0.45), 0 0 20px rgba(240,64,92,0.2)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    '0 8px 36px rgba(242,153,74,0.65), 0 0 30px rgba(240,64,92,0.4)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    '0 6px 28px rgba(242,153,74,0.45), 0 0 20px rgba(240,64,92,0.2)';
                }}
              >
                Join the community &rarr;
              </Link>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
