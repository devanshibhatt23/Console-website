import { Heart } from 'lucide-react';
import { FaLinkedin, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const quickLinks = [
  { label: 'about', href: '/about', isHash: false },
  { label: 'team', href: '/team', isHash: false },
  { label: 'events', href: '/events', isHash: false },
  { label: 'leaderboard', href: '/leaderboard', isHash: false },
  { label: 'resources', href: '/resources', isHash: false },
  { label: 'tech guide', href: '/tech-guide', isHash: false },
];

export default function Footer() {
  return (
    <footer className="bg-card border-t border-white/10 pt-16 pb-8 relative overflow-hidden">
      {/* Orange glow orb */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full pointer-events-none blur-[120px]"
        style={{ background: 'rgba(242,153,74,0.15)' }}
      />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <span
                className="font-mono font-bold text-lg"
                style={{
                  background: 'linear-gradient(90deg, #F2994A, #F0405C)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                &lt;/&gt;
              </span>
              <span
                className="font-montserrat font-black text-xl tracking-widest"
                style={{
                  background: 'linear-gradient(90deg, #F2994A, #F0405C)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                CONSOLE
              </span>
            </div>
            <p className="text-muted-foreground font-inter text-sm max-w-sm mb-6 leading-relaxed">
              The official tech community of MNIT. A collective of developers, hackers, and builders
              creating the future one line at a time.
            </p>
            <div className="flex gap-4 mt-5">
              {[
                { icon: FaLinkedin, href: 'https://www.linkedin.com/company/consolecommunity/', color: '#0077B5' },
                { icon: FaInstagram, href: 'https://www.instagram.com/console.comm', color: '#E1306C' },
              ].map((Social, i) => (
                <a
                  key={i}
                  href={Social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground transition-all duration-300 hover:scale-[1.05]"
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = Social.color + '80';
                    el.style.boxShadow = `0 0 12px ${Social.color}40`;
                    el.style.background = Social.color + '20';
                    el.style.color = Social.color;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = 'rgba(255,255,255,0.1)';
                    el.style.boxShadow = 'none';
                    el.style.background = 'rgba(255,255,255,0.05)';
                    el.style.color = '';
                  }}
                >
                  <Social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-montserrat font-semibold text-white mb-6 text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-3 font-inter text-sm text-muted-foreground">
              {quickLinks.map((link) =>
                link.isHash ? (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="hover:text-white transition-colors"
                      style={{ transition: 'color 0.2s' }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.color = '#F2994A';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.color = '';
                      }}
                    >
                      {link.label}
                    </a>
                  </li>
                ) : (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="hover:text-white transition-colors"
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.color = '#F2994A';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.color = '';
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-muted-foreground">
            © {new Date().getFullYear()} Console Club. All rights reserved.
          </p>
          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground group">
            Built with <Heart className="w-3 h-3 text-[#F0405C]" /> by the Console Team
            <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2" style={{ color: '#F2994A' }}>
              [exit 0]
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
