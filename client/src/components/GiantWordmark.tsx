import { useRef, useState, useCallback } from 'react';

const WORD = 'CONSOLE';
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const SCRAMBLE_MS = 360; // total scramble duration per letter
const TICK_MS = 40; // how often a scrambling letter changes

interface LetterState {
  display: string;
  scrambling: boolean;
}

/**
 * Full-width giant "CONSOLE" wordmark rendered in the display font.
 * Hovering a letter scrambles it through random characters (~360ms),
 * coloured orange while animating, then resolves back to the real letter.
 * Rapid re-hovering is debounced per letter via an "active" guard.
 */
export default function GiantWordmark() {
  const [letters, setLetters] = useState<LetterState[]>(
    WORD.split('').map((ch) => ({ display: ch, scrambling: false }))
  );

  // Per-letter timers so we can guard against overlapping scrambles.
  const intervals = useRef<Record<number, ReturnType<typeof setInterval>>>({});
  const timeouts = useRef<Record<number, ReturnType<typeof setTimeout>>>({});
  const active = useRef<Record<number, boolean>>({});

  const scramble = useCallback((index: number) => {
    const finalChar = WORD[index];
    // Debounce: ignore re-hover while this letter is still animating.
    if (active.current[index]) return;
    active.current[index] = true;

    const start = Date.now();

    intervals.current[index] = setInterval(() => {
      setLetters((prev) => {
        const next = [...prev];
        next[index] = {
          display: CHARS[Math.floor(Math.random() * CHARS.length)],
          scrambling: true,
        };
        return next;
      });
    }, TICK_MS);

    timeouts.current[index] = setTimeout(() => {
      clearInterval(intervals.current[index]);
      setLetters((prev) => {
        const next = [...prev];
        next[index] = { display: finalChar, scrambling: false };
        return next;
      });
      active.current[index] = false;
    }, Math.max(SCRAMBLE_MS, Date.now() - start));
  }, []);

  return (
    <div className="giant-wordmark" aria-label={WORD} role="img">
      {letters.map((letter, i) => (
        <span
          key={i}
          aria-hidden="true"
          onMouseEnter={() => scramble(i)}
          className={`giant-wordmark__letter${
            letter.scrambling ? ' is-scrambling' : ''
          }`}
        >
          {letter.display}
        </span>
      ))}
    </div>
  );
}
