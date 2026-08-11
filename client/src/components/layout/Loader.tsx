import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../sections/ConsoleTerminal.css';

interface LoaderProps {
  onComplete: () => void;
}

const TOTAL_MS = 3000;
const BAR_DURATION = 2400;

export default function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setExiting(true);
      setTimeout(onComplete, 900);
    }, TOTAL_MS);

    return () => clearTimeout(exitTimer);
  }, [onComplete]);

  useEffect(() => {
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const elapsed = now - start;
      const nextProgress = Math.min(100, (elapsed / BAR_DURATION) * 100);
      setProgress(nextProgress);
      if (nextProgress < 100) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {!exiting ? (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[200] console-terminal-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="console-terminal-shell">
            <div className="console-terminal-titlebar">
              <div className="console-terminal-title">
                <span className="console-terminal-prompt" aria-hidden="true">&gt;</span>
                <span>console &gt; {'{ ! }'}</span>
              </div>
              <div className="console-terminal-controls" aria-hidden="true">
                <span>−</span>
                <span>□</span>
                <span>×</span>
              </div>
            </div>

            <div className="console-terminal-content">
              <h1>Welcome to CONSOLE</h1>
              <p>Technical Community of MNIT</p>
            </div>
          </div>
          <div className="console-terminal-loading" aria-label={`Loading ${Math.round(progress)} percent`}>
            loading..{Math.round(progress)}%
          </div>
        </motion.div>
      ) : (
        <motion.div key="exit" className="fixed inset-0 z-[200] pointer-events-none">
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-black"
            initial={{ y: 0 }}
            animate={{ y: '-100%' }}
            transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-black"
            initial={{ y: 0 }}
            animate={{ y: '100%' }}
            transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}