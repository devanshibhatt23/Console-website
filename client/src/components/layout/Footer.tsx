import { Heart } from 'lucide-react';
import { FaLinkedin, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ORANGE = '#f2994a';

const socials = [
  {
    name: 'LinkedIn',
    icon: FaLinkedin,
    href: 'https://www.linkedin.com/company/consolecommunity/',
  },
  {
    name: 'Instagram',
    icon: FaInstagram,
    href: 'https://www.instagram.com/console.comm',
  },
];

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Team', href: '/team' },
  { label: 'Events', href: '/events' },
  { label: 'Leaderboard', href: '/leaderboard' },
  { label: 'Resources', href: '/resources' },
  { label: 'Tech Guide', href: '/tech-guide' },
];

function scrollHome(e: React.MouseEvent) {
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

export default function Footer() {
  return (
    <footer className="bg-card border-t border-white/10 pt-14 pb-6 relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-10 md:gap-8 mb-10">
          {/* Brand */}
          <div>
            <Link
              to="/"
              onClick={scrollHome}
              aria-label="Go to home"
              className="inline-block mb-5 hover:opacity-90 transition-opacity duration-200"
            >
              <img
                src="/logo.png"
                alt="CONSOLE Logo"
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-muted-foreground font-body text-sm max-w-sm leading-relaxed">
              The official tech community of MNIT — developers, hackers, and
              builders shipping the future one line at a time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-extrabold text-foreground mb-5 text-xs uppercase tracking-[0.18em]">
              Quick Links
            </h4>
            <ul className="space-y-3 font-body text-sm text-muted-foreground">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    onClick={(e) => {
                      if (link.href === '/') scrollHome(e);
                    }}
                    className="transition-colors duration-200"
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = ORANGE;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = '';
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-display font-extrabold text-foreground mb-5 text-xs uppercase tracking-[0.18em]">
              Connect
            </h4>
            <div className="flex items-center gap-3">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="group flex items-center justify-center h-11 w-11 rounded-lg border border-white/10 bg-white/5 transition-all duration-300"
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = 'rgba(242,153,74,0.5)';
                    el.style.boxShadow = '0 0 16px rgba(242,153,74,0.28)';
                    el.style.background = 'rgba(242,153,74,0.10)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = 'rgba(255,255,255,0.1)';
                    el.style.boxShadow = 'none';
                    el.style.background = 'rgba(255,255,255,0.05)';
                  }}
                >
                  <social.icon
                    className="w-5 h-5 transition-colors duration-300"
                    style={{ color: ORANGE }}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-muted-foreground">
            © {new Date().getFullYear()} CONSOLE Club. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 font-body text-xs text-muted-foreground">
            Built with{' '}
            <Heart className="w-3 h-3" style={{ color: ORANGE }} /> by the
            CONSOLE team
          </p>
        </div>
      </div>
    </footer>
  );
}
