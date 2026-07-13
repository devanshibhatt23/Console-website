import { motion } from 'framer-motion';
import { FaDiscord, FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Community() {
  const socials = [
    { name: 'Discord', icon: FaDiscord, color: 'hover:bg-[#5865F2] hover:text-white', href: '#' },
    { name: 'GitHub', icon: FaGithub, color: 'hover:bg-[#333] hover:text-white', href: '#' },
    { name: 'LinkedIn', icon: FaLinkedin, color: 'hover:bg-[#0077B5] hover:text-white', href: '#' },
    { name: 'Instagram', icon: FaInstagram, color: 'hover:bg-[#E1306C] hover:text-white', href: '#' }
  ];

  return (
    <section id="community" className="py-32 relative overflow-hidden bg-card/50 border-t border-white/5">
      {/* Abstract mesh background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
          <path d="M0,50 Q25,25 50,50 T100,50" fill="none" stroke="url(#grad1)" strokeWidth="0.5" className="animate-pulse" />
          <path d="M0,70 Q25,95 50,70 T100,70" fill="none" stroke="url(#grad2)" strokeWidth="0.2" />
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffc22d" />
              <stop offset="100%" stopColor="#ff3c5f" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            Join the <span className="text-gradient-fire">Console</span>
          </h2>
          <p className="text-xl text-muted-foreground font-mono mb-12">
            Connect with peers, find teammates for the next hackathon, or just hang out. The community is open.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {socials.map((social, i) => (
              <a
                key={i}
                href={social.href}
                className={`group flex items-center gap-3 px-6 py-4 rounded-xl bg-white/5 border border-white/10 transition-all duration-300 ${social.color}`}
              >
                <social.icon className="w-6 h-6 text-white/70 group-hover:text-white transition-colors" />
                <span className="font-mono font-medium">{social.name}</span>
              </a>
            ))}
          </div>

          <div className="max-w-md mx-auto p-1 rounded-xl bg-gradient-to-r from-primary/30 to-secondary/30 relative">
            <div className="absolute -top-3 -right-3 text-xs font-mono bg-primary text-white px-2 py-1 rounded shadow-lg transform rotate-6">
              Stay Updated
            </div>
            <div className="flex items-center gap-2 p-2 bg-black rounded-lg">
              <input 
                type="email" 
                placeholder="root@localhost ~" 
                className="w-full bg-transparent border-none outline-none font-mono text-white placeholder:text-white/30 px-4 py-2"
              />
              <button className="px-6 py-2 bg-white text-black font-mono font-bold rounded hover:bg-white/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
