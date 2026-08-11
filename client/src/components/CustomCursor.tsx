import { useEffect, useRef } from 'react';

// Selector for elements that should trigger the enlarged / intensified cursor.
const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, textarea, select, label, summary, [data-cursor-hover]';

/**
 * Global custom cursor.
 * - A small solid dot that tracks the pointer tightly.
 * - A soft radial glow that lerps toward the pointer for a smooth trail.
 * Skipped entirely on touch devices and when the user prefers reduced motion,
 * in which case the native cursor is left untouched.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  // Target (real pointer) and eased (rendered) positions.
  const target = useRef({ x: -100, y: -100 });
  const glowPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isTouch =
      window.matchMedia('(hover: none), (pointer: coarse)').matches ||
      'ontouchstart' in window;
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // No custom cursor for touch or reduced-motion users.
    if (isTouch || prefersReduced) return;

    const root = document.documentElement;
    const dot = dotRef.current;
    const glow = glowRef.current;
    if (!dot || !glow) return;

    root.classList.add('custom-cursor-active');

    const handleMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      // The dot snaps to the pointer immediately for precision.
      dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };

    const handleOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      const interactive = !!el?.closest?.(INTERACTIVE_SELECTOR);
      dot.classList.toggle('is-hovering', interactive);
      glow.classList.toggle('is-hovering', interactive);
    };

    const handleLeave = () => {
      dot.style.opacity = '0';
      glow.style.opacity = '0';
    };
    const handleEnter = () => {
      dot.style.opacity = '1';
      glow.style.opacity = '1';
    };

    // Smoothly ease the glow toward the pointer (lerp) at 60fps.
    const tick = () => {
      glowPos.current.x += (target.current.x - glowPos.current.x) * 0.15;
      glowPos.current.y += (target.current.y - glowPos.current.y) * 0.15;
      glow.style.transform = `translate3d(${glowPos.current.x}px, ${glowPos.current.y}px, 0)`;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('mouseover', handleOver, { passive: true });
    document.addEventListener('mouseleave', handleLeave);
    document.addEventListener('mouseenter', handleEnter);

    return () => {
      root.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseleave', handleLeave);
      document.removeEventListener('mouseenter', handleEnter);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="custom-cursor" aria-hidden="true">
      <div ref={glowRef} className="custom-cursor__glow" />
      <div ref={dotRef} className="custom-cursor__dot" />
    </div>
  );
}
