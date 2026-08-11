import { motion } from 'framer-motion';

/**
 * Thin full-width divider with a glowing centered dot.
 * Draws in from the center outward (scaleX 0 → 1) when scrolled into view.
 */
export default function SectionDivider() {
  return (
    <div
      className="relative w-full flex items-center justify-center py-2"
      aria-hidden="true"
    >
      <motion.div
        className="relative w-full max-w-6xl mx-auto px-6"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ transformOrigin: 'center' }}
      >
        <div
          className="h-px w-full"
          style={{ background: 'rgba(242, 153, 74, 0.4)' }}
        />
      </motion.div>
    </div>
  );
}
