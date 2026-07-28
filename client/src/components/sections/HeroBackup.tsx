import { useState, useEffect } from 'react';
import { ParticlesProvider, Particles } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { motion } from 'framer-motion';
import { Terminal, ChevronRight } from 'lucide-react';

import ConstellationDraw from './ConstellationDraw';

// ── Role cycler ──────────────────────────────────────────────────────────────
// "We are hackers" -> erase -> "dreamers" -> "innovators" -> ... looping
// typewriter, styled in the fire gradient to match the CTA accent.
const ROLE_WORDS = ['hackers', 'dreamers', 'innovators', 'builders', 'creators'];

function RoleCycler() {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState('');
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'deleting'>('typing');

  useEffect(() => {
    const currentWord = ROLE_WORDS[wordIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === 'typing') {
      if (text.length < currentWord.length) {
        timeout = setTimeout(() => setText(currentWord.slice(0, text.length + 1)), 90);
      } else {
        timeout = setTimeout(() => setPhase('deleting'), 1400);
      }
    } else {
      if (text.length > 0) {
        timeout = setTimeout(() => setText(text.slice(0, -1)), 45);
      } else {
        setWordIndex((i) => (i + 1) % ROLE_WORDS.length);
        setPhase('typing');
      }
    }

    return () => clearTimeout(timeout);
  }, [text, phase, wordIndex]);

  return (
    <span className="text-gradient-fire font-bold">
      {text}
      <span className="inline-block w-[2px] h-[0.9em] bg-primary ml-1 animate-pulse align-middle" />
    </span>
  );
}

// ── Hero Section ─────────────────────────────────────────────────────────────
export default function Hero() {
  const titleText = "CONSOLE";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden pt-32 pb-48"
    >
      {/* Grid + scanline glow — terminal/HUD-native background treatment */}


      {/* Particles — constellation network */}
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
                color: { value: '#6366F1' },
                links: {
                  color: '#06b6d4',
                  distance: 150,
                  enable: true,
                  opacity: 0.2,
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
                opacity: { value: 0.3 },
                shape: { type: 'circle' },
                size: { value: { min: 1, max: 2 } },
              },
              detectRetina: true,
            }}
            className="w-full h-full"
          />
        </ParticlesProvider>
      </div>

      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/50 to-black z-0" />

      {/* Draw-your-own-constellation — drag to trace nodes/links that match
          the ambient particle network, then hang suspended and slowly fade */}
      <ConstellationDraw />

      {/* Content — pointer-events disabled on the wrapper so drags pass
          through to the canvas above; re-enabled only on real controls */}
      <div className="relative z-10 container mx-auto px-6 text-center pointer-events-none">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 font-mono text-xs text-secondary mb-8 backdrop-blur-md mt-10"
          >
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            System initialized. Ready to build.
          </motion.div>

          {/* Group 1: Main Title Area */}
          <div className="flex flex-col items-center mb-16">
            <motion.p
              variants={itemVariants}
              className="uppercase tracking-[0.3em] md:tracking-[0.4em] text-xs md:text-sm text-white/60 font-mono mb-4 font-medium"
            >
              Building MNIT's Coding Culture
            </motion.p>

            <h1 className="text-7xl md:text-[8rem] lg:text-[10rem] xl:text-[11rem] font-black tracking-tighter flex justify-center flex-nowrap overflow-hidden leading-none pb-2 w-full">
              {titleText.split('').map((char, index) => (
                <motion.span
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 50, rotateX: -90 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      rotateX: 0,
                      transition: { duration: 0.8, ease: 'easeOut' },
                    },
                  }}
                  className={index > 3 ? 'text-gradient-fire' : 'text-white'}
                >
                  {char}
                </motion.span>
              ))}
            </h1>
          </div>

          {/* Group 2: Subtitle Area */}
          <div className="flex flex-col items-center mb-20 gap-4">
            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl lg:text-3xl font-mono font-medium text-white"
            >
              We are <RoleCycler />
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-base md:text-lg lg:text-xl font-mono text-muted-foreground/80 max-w-2xl text-center leading-relaxed"
            >
              One Terminal, Infinite Possibilities.
            </motion.p>
          </div>

          {/* Group 3: CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center gap-8 w-full sm:w-auto"
          >
            <a
              href="#community"
              data-testid="cta-join-tribe"
              className="group relative px-8 py-4 bg-primary text-white font-mono font-medium rounded overflow-hidden glow-indigo flex items-center justify-center gap-2 pointer-events-auto"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10 flex items-center gap-2">
                Join the Tribe{' '}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
            <a
              href="#about"
              data-testid="cta-explore"
              className="px-8 py-4 bg-white/5 border border-white/10 text-white font-mono font-medium rounded hover:bg-white/10 transition-colors flex items-center justify-center gap-2 pointer-events-auto"
            >
              <Terminal className="w-4 h-4 text-secondary" />
              <span>Explore Console</span>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
          Scroll
        </span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-primary/50 to-transparent" />
      </motion.div>
    </section>
  );
}
