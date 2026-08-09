import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ParticlesProvider, Particles } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import PuzzleBackground from '../3d/PuzzleBackground';

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

      {/* 3D Floating Puzzle Piece Background */}
      <PuzzleBackground />

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

      {/* Background Image — Ken Burns animated */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-[0.2] hero-bg-image" 
        style={{ backgroundImage: "url('/images/IMG_1590.jpg')" }} 
      />

      {/* 3D Perspective Floor Grid */}
      <div className="hero-perspective-container">
        <div className="hero-perspective-grid" />
      </div>

      {/* Dual Glowing Orbs */}
      <div className="ambient-orb-orange" />
      <div className="ambient-orb-pink" />

      {/* Radial overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/50 to-black z-0" />

      <div className="relative z-10 container mx-auto px-6 text-center pointer-events-none">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto flex flex-col items-center"
        >
          {/* Eyebrow label — bigger, clean */}
          <motion.p
            variants={itemVariants}
            className="font-mono text-lg sm:text-xl md:text-2xl tracking-[0.2em] uppercase text-white/60 mb-3 select-none"
          >
            Welcome to
          </motion.p>

          {/* CONSOLE — Montserrat bold gradient, scramble on hover + glow */}
          <div className="relative flex flex-col items-center w-full" style={{ marginTop: '12px', marginBottom: '24px' }}>
            <h1
              className="font-montserrat cursor-default pointer-events-auto select-none transition-all duration-300 w-full text-center"
              style={{
                fontSize: 'clamp(56px, 13vw, 130px)',
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 900,
                lineHeight: '0.88',
                letterSpacing: '-4px',
                margin: '0',
                padding: '0',
                ...gradientTextStyle,
                filter: isHoveringConsole
                  ? 'drop-shadow(0 0 50px rgba(242,153,74,0.75)) drop-shadow(0 0 100px rgba(240,64,92,0.5))'
                  : 'drop-shadow(0 4px 16px rgba(0,0,0,0.8))',
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
            style={{ marginBottom: '40px' }}
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
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
