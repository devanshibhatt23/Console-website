import { motion } from 'framer-motion';

// ── Technologies We Love ─────────────────────────────────────────────────────
// Two rows of tech pills scrolling infinitely in opposite directions, edges
// faded via a mask so the reel feels endless rather than clipped.
const TECHS = [
  'React', 'Next.js', 'TypeScript', 'Node.js', 'GraphQL', 'PostgreSQL',
  'Redis', 'Solidity', 'WASM', 'Python', 'Rust', 'Go', 'TensorFlow',
  'Docker', 'Kubernetes',
];

const maskStyle = {
  maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
  WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
};

interface RowProps {
  items: string[];
  direction: 'left' | 'right';
  duration: number;
}

function Row({ items, direction, duration }: RowProps) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden" style={maskStyle}>
      <motion.div
        className="flex gap-4 w-max"
        animate={{ x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'] }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
      >
        {doubled.map((tech, i) => (
          <span
            key={`${tech}-${i}`}
            className="shrink-0 px-5 py-2.5 rounded-lg border border-white/10 bg-white/[0.03] font-mono text-sm text-white/70 hover:text-white hover:border-primary/40 hover:bg-white/[0.06] transition-colors whitespace-nowrap"
          >
            {tech}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function TechMarquee() {
  return (
    <section className="relative py-16 border-y border-white/5 overflow-hidden">
      <p className="text-center font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-10">
        Technologies We Love
      </p>
      <div className="space-y-4">
        <Row items={TECHS} direction="left" duration={38} />
        <Row items={[...TECHS].reverse()} direction="right" duration={44} />
      </div>
    </section>
  );
}
