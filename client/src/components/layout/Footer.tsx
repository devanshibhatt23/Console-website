import { Link } from 'react-router-dom';

const ORANGE = '#f2994a';

const socials = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/console.comm',
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/consolecommunity/',
  },
  {
    name: 'Whatsapp',
    href: 'https://chat.whatsapp.com/GotGfZJhP2YIVFYluAAwxS?mode=gi_t',
  },
];

const quickLinks = [
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

function hoverOrange(e: React.MouseEvent) {
  (e.currentTarget as HTMLElement).style.color = ORANGE;
}
function resetColor(e: React.MouseEvent) {
  (e.currentTarget as HTMLElement).style.color = '';
}

export default function Footer() {
  return (
    <footer className="bg-card border-t border-white/10 py-6 relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10">
          {/* Left — social links */}
          <ul className="flex flex-col gap-1.5 font-body text-sm text-white">
            {socials.map((social) => (
              <li key={social.name}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center transition-colors duration-200 uppercase font-medium"
                  onMouseEnter={hoverOrange}
                  onMouseLeave={resetColor}
                >
                  {social.name}
                </a>
              </li>
            ))}
          </ul>

          {/* Right — nav links */}
          <ul className="flex flex-col gap-1.5 font-body text-sm text-white md:text-right md:items-end">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.href}
                  onClick={(e) => {
                    if (link.href === '/') scrollHome(e);
                  }}
                  className="transition-colors duration-200 uppercase font-medium"
                  onMouseEnter={hoverOrange}
                  onMouseLeave={resetColor}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
