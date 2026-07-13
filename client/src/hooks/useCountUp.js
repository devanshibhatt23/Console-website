import { useEffect, useRef, useState } from 'react';

/**
 * Animates a number counting up from 0 to `value` once `start` becomes true.
 * Uses requestAnimationFrame with an ease-out curve.
 */
export const useCountUp = (value, start, duration = 1200) => {
    const [displayValue, setDisplayValue] = useState(0);
    const rafRef = useRef(null);
    const hasRun = useRef(false);

    useEffect(() => {
        const target = Number(value) || 0;

        if (!start || hasRun.current) {
            if (!start) setDisplayValue(0);
            return;
        }
        hasRun.current = true;

        const startTime = performance.now();

        const tick = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
            setDisplayValue(Math.round(eased * target));

            if (progress < 1) {
                rafRef.current = requestAnimationFrame(tick);
            } else {
                setDisplayValue(target);
            }
        };

        rafRef.current = requestAnimationFrame(tick);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [start, value]);

    return displayValue;
};
