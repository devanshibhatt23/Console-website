import { useRef, useState, useCallback } from 'react';

const WORD = 'CONSOLE';
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const SCRAMBLE_MS = 500; // total scramble duration for the whole word
const TICK_MS = 45; // how often scrambling letters change

/**
 * Full-width giant "CONSOLE" wordmark rendered in the display font.
 * Hovering anywhere on the word scrambles every letter at once through
 * random characters (~500ms), coloured orange while animating, then all
 * letters resolve back to the real word. Re-hovering while active is
 * debounced via the `active` guard.
 */
export default function GiantWordmark() {
  const [display, setDisplay] = useState<string[]>(WORD.split(''));
  const [scrambling, setScrambling] = useState(false);

  const interval = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const active = useRef(false);

  const scrambleAll = useCallback(() => {
    if (active.current) return;
    active.current = true;
    setScrambling(true);

    interval.current = setInterval(() => {
      setDisplay(
        WORD.split('').map(
          () => CHARS[Math.floor(Math.random() * CHARS.length)]
        )
      );
    }, TICK_MS);

    timeout.current = setTimeout(() => {
      if (interval.current) clearInterval(interval.current);
      setDisplay(WORD.split(''));
      setScrambling(false);
      active.current = false;
    }, SCRAMBLE_MS);
  }, []);

  return (
    <div
      className="giant-wordmark"
      aria-label={WORD}
      role="img"
      onMouseEnter={scrambleAll}
    >
      {display.map((ch, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`giant-wordmark__letter${
            scrambling ? ' is-scrambling' : ''
          }`}
        >
          {ch}
        </span>
      ))}
    </div>
  );
}
