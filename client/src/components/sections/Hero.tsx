import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import GlitterWrap from '@/components/originkit/ui/glitterwrap';
import { useAuth } from '../../context/AuthContext';

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
    hidden: { opacity: 0, x: -24 },
    visible: {
      opacity: 1,
      x: 0,
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
      className="relative min-h-screen w-full flex items-center overflow-hidden pt-32 pb-48"
      style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(242,100,60,0.18) 0%, rgba(240,64,92,0.10) 40%, #050505 75%)',
      }}
    >
      {/* Background GlitterWrap component */}
      <div className="absolute inset-0 z-0 opacity-85">
        <GlitterWrap 
          speed={5} 
          starSize={8} 
          glitterIntensity={6} 
          brightness={80} 
          particleCount={120} 
          color1="#F2994A" 
          color2="#F0405C" 
          color3="#ffffff" 
        />
      </div>

      {/* Light overlay — only darkens right edge to keep text legible */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.05) 100%)' }} />

      <div className="relative z-10 container mx-auto px-12 md:px-24 text-left pointer-events-none mt-18">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl flex flex-col items-start"
        >
          {/* Welcome to — Montserrat bold white */}
          <motion.h2
            variants={itemVariants}
            className="font-montserrat cursor-default select-none text-left"
            style={{
              fontSize: 'clamp(32px, 8vw, 79px)',
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: '1.0',
              letterSpacing: '-2px',
              margin: '0',
              padding: '0',
            }}
          >
            Welcome to
          </motion.h2>

          {/* CONSOLE — Montserrat bold gradient, scramble on hover + glow */}
          <div className="relative flex flex-col items-start w-full" style={{ marginTop: '4px', marginBottom: '16px' }}>
            <h1
              className="font-montserrat cursor-default pointer-events-auto select-none transition-all duration-300 text-left"
              style={{
                fontSize: 'clamp(48px, 11vw, 120px)',
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 900,
                lineHeight: '1.0',
                letterSpacing: '-3px',
                margin: '0',
                padding: '0',
                ...gradientTextStyle,
                filter: isHoveringConsole
                  ? 'drop-shadow(0 0 30px rgba(242,153,74,0.6))'
                  : 'none',
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
          </div>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-base md:text-[13px] font-minecraft text-gray-400 tracking-wide mb-8 max-w-lg"
          >
            Your coding arc begins here
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-start gap-4 w-full sm:w-auto pointer-events-auto"
          >
            {/* Join the community — hidden when logged in */}
            {!user && (
              <Link
                to="/login"
                className="group relative px-4 py-2.5 text-sm text-white font-inter font-medium rounded overflow-hidden flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] mt-3"
                style={{
                  background: 'linear-gradient(135deg, #F2994A, #F0405C)',
                  boxShadow: '0 4px 14px rgba(242,153,74,0.25)',
                  borderRadius: '6px',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    '0 6px 20px rgba(242,153,74,0.4)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    '0 4px 14px rgba(242,153,74,0.25)';
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
