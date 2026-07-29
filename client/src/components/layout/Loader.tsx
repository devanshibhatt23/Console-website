import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BOOT_LINES = [
  { text: 'console_os v2.0.1 - booting kernel...', delay: 0, type: 'system' },
  { text: '> Mounting file systems...', delay: 380, type: 'cmd' },
  { text: '> Loading kernel modules...', delay: 760, type: 'cmd' },
  { text: '> Establishing network tunnel...', delay: 1100, type: 'cmd' },
  { text: '> Syncing community data...', delay: 1440, type: 'cmd' },
  { text: '> Compiling runtime environment...', delay: 1760, type: 'cmd' },
  { text: '> Spawning developer processes...', delay: 2080, type: 'cmd' },
  { text: 'All systems operational.', delay: 2500, type: 'success' },
  { text: 'Welcome to CONSOLE.', delay: 2900, type: 'welcome' },
];

const TOTAL_MS = 3600; // when exit animation starts
const BAR_DURATION = 2800; // progress bar fills over this time

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [typedMap, setTypedMap] = useState<Record<number, string>>({});

  // Schedule each line to appear
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    BOOT_LINES.forEach((line, i) => {
      const t = setTimeout(() => {
        setVisibleLines((prev) => [...prev, i]);
        // Typewriter per line
        let charIdx = 0;
        const iv = setInterval(() => {
          charIdx++;
          setTypedMap((prev) => ({ ...prev, [i]: line.text.slice(0, charIdx) }));
          if (charIdx >= line.text.length) clearInterval(iv);
        }, 18);
      }, line.delay);
      timers.push(t);
    });

    // Kick off exit
    const exitTimer = setTimeout(() => {
      setExiting(true);
      setTimeout(onComplete, 900);
    }, TOTAL_MS);
    timers.push(exitTimer);

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  // Smooth progress bar
  useEffect(() => {
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, (elapsed / BAR_DURATION) * 100);
      setProgress(pct);
      if (pct < 100) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {!exiting ? (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Scanline overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)',
            }}
          />

          {/* Radial glow center */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.12)_0%,transparent_65%)] pointer-events-none" />

          {/* Terminal window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl mx-4"
          >
            {/* Window chrome */}
            <div className="bg-[#0d0d0d] border border-white/10 rounded-xl overflow-hidden shadow-[0_0_80px_rgba(99,102,241,0.15)]">
              {/* Title bar */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8 bg-white/3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="font-mono text-xs text-white/30 mx-auto">
                  console@system:~$
                </span>
                <div className="w-3 h-3 rounded-full border border-white/10" />
              </div>

              {/* Terminal body */}
              <div className="p-6 min-h-[260px] font-mono text-sm space-y-1.5">
                {BOOT_LINES.map((line, i) =>
                  visibleLines.includes(i) ? (
                    <div key={i} className="flex items-start gap-2">
                      {line.type === 'system' && (
                        <span className="text-white/20 shrink-0">$</span>
                      )}
                      {line.type === 'cmd' && (
                        <span className="text-primary/60 shrink-0">›</span>
                      )}
                      {line.type === 'success' && (
                        <span className="text-green-400/80 shrink-0">✓</span>
                      )}
                      {line.type === 'welcome' && (
                        <span className="shrink-0 w-4" />
                      )}

                      <span
                        className={
                          line.type === 'system'
                            ? 'text-white/50'
                            : line.type === 'cmd'
                            ? 'text-white/40'
                            : line.type === 'success'
                            ? 'text-green-400'
                            : 'text-gradient-fire font-bold text-base'
                        }
                      >
                        {typedMap[i] ?? ''}
                        {/* blinking cursor on last visible line */}
                        {i === visibleLines[visibleLines.length - 1] &&
                          (typedMap[i]?.length ?? 0) < line.text.length && (
                            <span className="inline-block w-[2px] h-[1em] bg-primary ml-[1px] animate-pulse align-middle" />
                          )}
                      </span>

                      {/* ✓ badge for cmd lines */}
                      {line.type === 'cmd' &&
                        (typedMap[i]?.length ?? 0) >= line.text.length && (
                          <span className="ml-auto text-green-400/70 shrink-0">✓</span>
                        )}
                    </div>
                  ) : null
                )}

                {/* Idle blinking cursor when nothing is typing */}
                {visibleLines.length === 0 && (
                  <span className="inline-block w-[2px] h-[1em] bg-primary animate-pulse align-middle" />
                )}
              </div>

              {/* Progress bar */}
              <div className="px-6 pb-6">
                <div className="flex justify-between font-mono text-xs text-white/30 mb-2">
                  <span>Loading</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-[3px] w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      width: `${progress}%`,
                      background: 'linear-gradient(90deg, #ffc22d, #ff3c5f)',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Glow under terminal */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-primary/20 blur-2xl rounded-full" />
          </motion.div>

          {/* Bottom console tag */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="absolute bottom-8 font-mono text-xs text-white/20 tracking-widest uppercase"
          >
            One Terminal. Infinite Possibilities.
          </motion.div>
        </motion.div>
      ) : (
        // Exit: split curtain wipe — top half flies up, bottom flies down
        <motion.div
          key="exit"
          className="fixed inset-0 z-[200] pointer-events-none"
        >
          {/* Top curtain */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-black"
            initial={{ y: 0 }}
            animate={{ y: '-100%' }}
            transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
          />
          {/* Bottom curtain */}
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
