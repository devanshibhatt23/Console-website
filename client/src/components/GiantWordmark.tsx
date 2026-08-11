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
  const [isHovered, setIsHovered] = useState(false);
  const [scrambling, setScrambling] = useState(false);

  const interval = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    setScrambling(true);

    if (interval.current) clearInterval(interval.current);
    if (timeout.current) clearTimeout(timeout.current);

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
    }, SCRAMBLE_MS);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <div
      className="giant-wordmark"
      aria-label={WORD}
      role="img"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {display.map((ch, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`giant-wordmark__letter${
            isHovered || scrambling ? ' is-scrambling' : ''
          }`}
        >
          {ch}
        </span>
      ))}
    </div>
  );
}
