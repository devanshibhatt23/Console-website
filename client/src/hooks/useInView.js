import { useEffect, useRef, useState } from 'react';

/**
 * Returns a ref to attach to an element, and a boolean that becomes true
 * once the element enters the viewport (fires once).
 */
export const useInView = (options = { threshold: 0.15 }) => {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setInView(true);
                observer.disconnect();
            }
        }, options);

        observer.observe(el);

        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return [ref, inView];
};
