import { motion } from 'framer-motion';
import { FaLinkedin, FaInstagram } from 'react-icons/fa';

const socials = [
  {
    name: 'LinkedIn',
    icon: FaLinkedin,
    href: '#',
    color: '#0A66C2',
  },
  {
    name: 'Instagram',
    icon: FaInstagram,
    href: '#',
    color: '#E1306C',
  },
];

export default function Community() {
  return (
    <section id="community" className="py-32 relative overflow-hidden bg-card/50 border-t border-white/5">
      {/* Subtle background mesh */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <linearGradient id="mesh-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F2994A" />
              <stop offset="100%" stopColor="#F0405C" />
            </linearGradient>
          </defs>
          <path d="M0,50 Q25,25 50,50 T100,50" fill="none" stroke="url(#mesh-grad)" strokeWidth="0.5" className="animate-pulse" />
          <path d="M0,70 Q25,95 50,70 T100,70" fill="none" stroke="url(#mesh-grad)" strokeWidth="0.3" opacity="0.5" />
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
          {/* Title — same size/style as Meet Our Team */}
          <h2
            className="text-4xl md:text-5xl font-black font-montserrat tracking-tight mb-4"
            style={{
              background: 'linear-gradient(90deg, #F2994A, #F0405C)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Let's Connect
          </h2>
          <p className="text-lg text-muted-foreground font-inter mb-20">
            Follow us and stay in the loop with everything happening at Console.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            {socials.map((social, i) => (
              <motion.a
                key={i}
                href={social.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="group flex flex-col items-center gap-5 px-14 py-10 rounded-2xl border border-white/10 bg-white/5 transition-all duration-300 hover:scale-[1.02] min-w-[200px]"
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'rgba(242,153,74,0.6)';
                  el.style.borderRadius = '1.5rem';
                  el.style.boxShadow = '0 0 28px rgba(242,153,74,0.35), 0 0 60px rgba(242,153,74,0.12)';
                  el.style.background = 'rgba(242,153,74,0.07)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'rgba(255,255,255,0.1)';
                  el.style.borderRadius = '1rem';
                  el.style.boxShadow = 'none';
                  el.style.background = 'rgba(255,255,255,0.05)';
                }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{ background: social.color + '25' }}
                >
                  <social.icon className="w-9 h-9" style={{ color: social.color, filter: 'brightness(1.3)' }} />
                </div>
                <h3 className="text-white font-semibold font-montserrat text-lg">{social.name}</h3>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
