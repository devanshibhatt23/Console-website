import { useEffect, useRef, useState } from 'react';

/**
 * Animates a number counting up from 0 to `value` once `start` becomes true.
 * Uses requestAnimationFrame with an ease-out curve.
 */
export const useCountUp = (value, start, duration = 1200) => {
    const target = Number(value) || 0;
    const [displayValue, setDisplayValue] = useState(0);
    const rafRef = useRef(null);
    const hasAnimatedOnce = useRef(false);
    const prevTarget = useRef(target);

    useEffect(() => {
        if (!start) {
            setDisplayValue(0);
            return;
        }

        // Once the entrance animation has already played, any later change to
        // `value` (e.g. switching platform/year tabs) should snap or animate
        // from the *current* displayed value straight to the new target,
        // rather than being ignored — stale scores are a correctness bug.
        const targetChanged = prevTarget.current !== target;
        prevTarget.current = target;

        if (hasAnimatedOnce.current && !targetChanged) {
            return;
        }

        const from = hasAnimatedOnce.current ? displayValue : 0;
        hasAnimatedOnce.current = true;

        const startTime = performance.now();

        const tick = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
            setDisplayValue(Math.round(from + eased * (target - from)));

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
    }, [start, target]);

    return displayValue;
};
