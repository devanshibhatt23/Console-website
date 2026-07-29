import { Heart } from 'lucide-react';
import { FaLinkedin, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const socials = [
  { name: 'LinkedIn', icon: FaLinkedin, href: 'https://www.linkedin.com/company/consolecommunity/', color: '#0A66C2' },
  { name: 'Instagram', icon: FaInstagram, href: 'https://www.instagram.com/console.comm', color: '#E1306C' },
];

const quickLinks = [
  { label: 'Home', href: '/', isHash: false },
  { label: 'Team', href: '/team', isHash: false },
  { label: 'Events', href: '/events', isHash: false },
  { label: 'Leaderboard', href: '/leaderboard', isHash: false },
  { label: 'Resources', href: '/resources', isHash: false },
  { label: 'Tech Guide', href: '/tech-guide', isHash: false },
];

export default function Footer() {
  return (
    <footer className="bg-card border-t border-white/10 pt-12 pb-5 relative overflow-hidden">
      {/* Orange glow orb */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full pointer-events-none blur-[120px]"
        style={{ background: 'rgba(242,153,74,0.15)' }}
      />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-6">
          {/* Brand — spans 2 cols */}
          <div className="md:col-span-2">
            <Link
              to="/"
              onClick={(e) => {
                if (window.location.pathname === '/') {
                  e.preventDefault();
                  const lenis = (window as any).__lenis;
                  if (lenis) {
                    lenis.scrollTo(0, { immediate: false });
                  } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                  window.history.pushState(null, '', '/');
                }
              }}
              aria-label="Go to home"
              className="inline-block mb-6 group hover:scale-[1.02] transition-transform duration-200"
            >
              <img
                src="/images/console_logo.png"
                alt="CONSOLE Logo"
                className="h-14 w-auto object-contain"
              />
            </Link>
            <p className="text-muted-foreground font-inter text-sm max-w-sm mb-0 leading-relaxed">
              The official tech community of MNIT. A collective of developers, hackers, and builders
              creating the future one line at a time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-montserrat font-semibold text-white mb-5 text-sm uppercase tracking-wider">
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
                      onClick={(e) => {
                        if (link.href === '/') {
                          if (window.location.pathname === '/') {
                            e.preventDefault();
                            const lenis = (window as any).__lenis;
                            if (lenis) {
                              lenis.scrollTo(0, { immediate: false });
                            } else {
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                            window.history.pushState(null, '', '/');
                          }
                        }
                      }}
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

          {/* Connect */}
          <div>
            <h4 className="font-montserrat font-semibold text-white mb-5 text-sm uppercase tracking-wider">
              Connect
            </h4>
            <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-2 px-4 py-4 rounded-xl border border-white/10 bg-white/5 transition-all duration-300 hover:scale-[1.03] min-w-[90px]"
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = social.color + '80';
                    el.style.boxShadow = `0 0 18px ${social.color}40`;
                    el.style.background = social.color + '15';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = 'rgba(255,255,255,0.1)';
                    el.style.boxShadow = 'none';
                    el.style.background = 'rgba(255,255,255,0.05)';
                  }}
                >
                  <social.icon
                    className="w-6 h-6"
                    style={{ color: social.color, filter: 'brightness(1.2)' }}
                  />
                  <span className="font-inter text-xs font-medium text-white">{social.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-muted-foreground">
            © {new Date().getFullYear()} CONSOLE Club. All rights reserved.
          </p>
          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground group">
            Built with <Heart className="w-3 h-3 text-[#F0405C]" /> by the CONSOLE Team
            <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2" style={{ color: '#F2994A' }}>
              [exit 0]
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
