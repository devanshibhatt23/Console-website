import { useEffect, useRef, useState } from 'react';

/**
 * Animates a number counting up to `value` once `start` becomes true.
 * Uses requestAnimationFrame with an ease-out curve.
 *
 * The animation's starting point is tracked in a ref (not derived from
 * refs mutated only on a "first run" flag) so the effect is safe under
 * React 18 StrictMode's dev-only double-invoke: if the first invocation's
 * animation frame is cancelled before it ever paints, the second
 * invocation still sees the true last-painted value and schedules a fresh
 * frame — it can never get stuck at a stale 0.
 */
export const useCountUp = (value, start, duration = 1200) => {
    const target = Number(value) || 0;
    const [displayValue, setDisplayValue] = useState(0);
    const displayValueRef = useRef(0);
    const rafRef = useRef(null);

    useEffect(() => {
        if (!start) {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            displayValueRef.current = 0;
            setDisplayValue(0);
            return;
        }

        const from = displayValueRef.current;

        if (from === target) {
            return;
        }

        const startTime = performance.now();

        const tick = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
            const next = Math.round(from + eased * (target - from));
            displayValueRef.current = next;
            setDisplayValue(next);

            if (progress < 1) {
                rafRef.current = requestAnimationFrame(tick);
            } else {
                displayValueRef.current = target;
                setDisplayValue(target);
            }
        };

        rafRef.current = requestAnimationFrame(tick);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [start, target, duration]);

    return displayValue;
};
