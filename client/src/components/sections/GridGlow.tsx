import { motion } from 'framer-motion';

export default function GridGlow() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Drifting grid */}
      <motion.div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(242,153,74,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(242,153,74,0.35) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
          maskImage: 'radial-gradient(ellipse 65% 60% at 50% 45%, black 0%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 65% 60% at 50% 45%, black 0%, transparent 75%)',
        }}
        animate={{ backgroundPosition: ['0px 0px', '52px 52px'] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      />

      {/* Ambient glow — orange left */}
      <motion.div
        className="absolute -left-[10%] top-[-10%] w-[42vw] max-w-[520px] aspect-square rounded-full mix-blend-screen"
        style={{
          background: 'radial-gradient(circle, rgba(242,153,74,0.3) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Ambient glow — pink right */}
      <motion.div
        className="absolute -right-[8%] bottom-[-12%] w-[40vw] max-w-[500px] aspect-square rounded-full mix-blend-screen"
        style={{
          background: 'radial-gradient(circle, rgba(240,64,92,0.25) 0%, transparent 70%)',
          filter: 'blur(44px)',
        }}
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Scanline sweep — orange */}
      <motion.div
        className="absolute left-0 right-0 h-24"
        style={{
          background:
            'linear-gradient(to bottom, transparent, rgba(242,153,74,0.15), transparent)',
        }}
        animate={{ top: ['-10%', '110%'] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'linear', delay: 0.5 }}
      />

      {/* Scanline sweep — pink/red */}
      <motion.div
        className="absolute left-0 right-0 h-16"
        style={{
          background:
            'linear-gradient(to bottom, transparent, rgba(240,64,92,0.1), transparent)',
        }}
        animate={{ top: ['110%', '-10%'] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'linear', delay: 2.5 }}
      />

      {/* Center vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_center,rgba(0,0,0,0.45)_0%,transparent_75%)]" />

      {/* Fine scanline texture */}
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
