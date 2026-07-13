import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Globe, Cpu, Shield, GitBranch, Terminal, Database } from 'lucide-react';

const domains = [
  { name: 'Web Dev', icon: Globe, color: 'text-primary', glow: 'group-hover:glow-indigo' },
  { name: 'AI / ML', icon: Cpu, color: 'text-secondary', glow: 'group-hover:glow-cyan' },
  { name: 'Comp Prog', icon: Terminal, color: 'text-accent', glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(255,194,45,0.5)]' },
  { name: 'Cybersec', icon: Shield, color: 'text-destructive', glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(255,60,95,0.5)]' },
  { name: 'Open Source', icon: GitBranch, color: 'text-white/80', glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.5)]' },
  { name: 'DevOps', icon: Database, color: 'text-secondary', glow: 'group-hover:glow-cyan' }
];

export default function Domains() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { type: 'spring' as const, stiffness: 100 } }
  };

  return (
    <section id="domains" className="py-32 border-y border-white/5 bg-zinc-950/50 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold font-mono mb-4 uppercase tracking-tighter">
            &gt; Tech_Stack
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-mono">
            Choose your weapon. We run specialized wings for different tech domains.
          </p>
        </div>

        <motion.div 
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 max-w-6xl mx-auto"
        >
          {domains.map((domain, i) => (
            <motion.div key={i} variants={itemVariants}>
              <div className={`group flex flex-col items-center justify-center p-8 rounded-xl bg-card border border-white/5 transition-all duration-300 hover:-translate-y-2 cursor-pointer ${domain.glow}`}>
                <domain.icon className={`w-12 h-12 mb-4 ${domain.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
                <span className="font-mono text-sm font-semibold text-center group-hover:text-white transition-colors">
                  {domain.name}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
