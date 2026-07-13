import { motion } from 'framer-motion';

// ── Grid + Scanline Background ───────────────────────────────────────────────
// Replaces the liquid-morph blobs with a terminal-native treatment: a drifting
// perspective-less grid (like a CRT/HUD readout), two glowing scanlines that
// sweep top-to-bottom on independent timers, and a couple of static ambient
// glows to carry the indigo/fire palette without competing with the title.
export default function GridGlow() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Drifting grid */}
      <motion.div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
          maskImage: 'radial-gradient(ellipse 65% 60% at 50% 45%, black 0%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 65% 60% at 50% 45%, black 0%, transparent 75%)',
        }}
        animate={{ backgroundPosition: ['0px 0px', '52px 52px'] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      />

      {/* Ambient static glows — carry the palette, no morphing */}
      <motion.div
        className="absolute -left-[10%] top-[-10%] w-[42vw] max-w-[520px] aspect-square rounded-full mix-blend-screen"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-[8%] bottom-[-12%] w-[40vw] max-w-[500px] aspect-square rounded-full mix-blend-screen"
        style={{
          background: 'radial-gradient(circle, rgba(255,60,95,0.3) 0%, transparent 70%)',
          filter: 'blur(44px)',
        }}
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Scanline sweep — indigo */}
      <motion.div
        className="absolute left-0 right-0 h-24"
        style={{
          background:
            'linear-gradient(to bottom, transparent, rgba(99,102,241,0.18), transparent)',
        }}
        animate={{ top: ['-10%', '110%'] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'linear', delay: 0.5 }}
      />

      {/* Scanline sweep — fire, offset timing/direction for a HUD feel */}
      <motion.div
        className="absolute left-0 right-0 h-16"
        style={{
          background:
            'linear-gradient(to bottom, transparent, rgba(255,60,95,0.12), transparent)',
        }}
        animate={{ top: ['110%', '-10%'] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'linear', delay: 2.5 }}
      />

      {/* Center vignette — keeps the title/CTA zone dark and legible */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_center,rgba(0,0,0,0.45)_0%,transparent_75%)]" />

      {/* Fine grain/noise-like scanline texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.4) 2px, rgba(255,255,255,0.4) 3px)',
        }}
      />
    </div>
  );
}
