import { useEffect, useRef } from 'react';

/**
 * Global spotlight cursor effect — fixed overlay that follows the mouse
 * with an orange→pink radial glow. Works on every page.
 */
export default function SpotlightCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (ref.current) {
          ref.current.style.setProperty('--sx', `${e.clientX}px`);
          ref.current.style.setProperty('--sy', `${e.clientY}px`);
        }
        rafRef.current = null;
      });
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="global-spotlight"
    />
  );
}
