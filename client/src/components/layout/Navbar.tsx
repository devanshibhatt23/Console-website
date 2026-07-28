import { useState, useEffect, MouseEvent } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Team', href: '/team' },
  { name: 'Events', href: '/events' },
  { name: 'Leaderboard', href: '/leaderboard' },
  { name: 'POTD', href: '/problem-of-the-day' },
  { name: 'Resources', href: '/resources' },
  { name: 'Tech Guide', href: '/tech-guide' },
];

const SECTION_IDS = ['hero', 'about', 'gallery', 'faq'];

const HASH_TO_SECTION: Record<string, string> = {
  '/#hero': 'hero',
  '/#about': 'about',
};

// Maps active section ID → nav link href (for non-hash route links)
const SECTION_TO_NAV_HREF: Record<string, string> = {
  'team': '/team',
  'previous-events': '/events',
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll spy using IntersectionObserver
  useEffect(() => {
    if (window.location.pathname !== '/') return;
    const observers: IntersectionObserver[] = [];

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.3 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === '/' || href === '/#hero') {
      e.preventDefault();
      setMobileMenuOpen(false);
      if (window.location.pathname !== '/') {
        navigate('/');
      } else {
        const lenis = (window as any).__lenis;
        if (lenis) {
          lenis.scrollTo(0, { immediate: false });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        window.history.pushState(null, '', '/');
      }
      return;
    }
    if (href.startsWith('/#')) {
      e.preventDefault();
      if (window.location.pathname === '/') {
        const targetId = href.substring(2);
        const el = document.getElementById(targetId);
        if (el) {
          const lenis = (window as any).__lenis;
          if (lenis) {
            lenis.scrollTo(el, { offset: -100, immediate: false });
          } else {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }
        window.history.pushState(null, '', href);
      } else {
        navigate(href);
      }
    }
    setMobileMenuOpen(false);
  };

  const isActive = (link: { name: string; href: string }) => {
    if (link.href === '/') {
      return window.location.pathname === '/';
    }
    if (window.location.pathname !== '/') {
      // On a dedicated route page (e.g. /team, /events): highlight the matching nav link directly.
      return window.location.pathname === link.href;
    }
    // Hash links: check activeSection via map
    const sectionId = HASH_TO_SECTION[link.href];
    if (sectionId) return activeSection === sectionId;
    // Route links: check if activeSection maps to this href
    return SECTION_TO_NAV_HREF[activeSection] === link.href;
  };

  const gradientText = {
    background: 'linear-gradient(90deg, #F2994A, #F0405C)',
    WebkitBackgroundClip: 'text' as const,
    WebkitTextFillColor: 'transparent' as const,
    backgroundClip: 'text' as const,
  };

  const renderNavItem = (link: { name: string; href: string }, mobile = false) => {
    const active = isActive(link);
    const isHashLink = link.href.startsWith('/#');

    if (mobile) {
      const baseClass = 'text-left font-montserrat text-white hover:text-white text-base py-2 transition-colors';
      return isHashLink ? (
        <a key={link.name} href={link.href} onClick={(e) => handleNavClick(e, link.href)} className={baseClass}>
          &gt; {link.name}
        </a>
      ) : (
        <Link key={link.name} to={link.href} onClick={() => setMobileMenuOpen(false)} className={baseClass}>
          &gt; {link.name}
        </Link>
      );
    }

    if (isHashLink) {
      return (
        <a
          key={link.name}
          href={link.href}
          onClick={(e) => handleNavClick(e, link.href)}
          className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
            active ? 'nav-link-active' : 'text-white hover:scale-[1.02] nav-link-hover'
          }`}
        >
          <span className="nav-link-text font-montserrat">{link.name}</span>
        </a>
      );
    }

    return (
      <Link
        key={link.name}
        to={link.href}
        className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
          active ? 'nav-link-active' : 'text-white hover:scale-[1.02] nav-link-hover'
        }`}
      >
        <span className="nav-link-text font-montserrat">{link.name}</span>
      </Link>
    );
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto pl-2 md:pl-4 pr-6 md:pr-10 flex items-center justify-between">
        {/* Logo */}
        {window.location.pathname === '/' ? (
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              window.history.pushState(null, '', '/');
            }}
            aria-label="Go to top"
            className="flex items-center shrink-0 cursor-pointer bg-transparent border-0 outline-none group hover:scale-[1.02] transition-transform duration-200"
          >
            <img
              src="/images/console_logo.png"
              alt="Console Logo"
              className="h-14 w-auto object-contain"
            />
          </button>
        ) : (
          <Link
            to="/"
            aria-label="Go to home"
            className="flex items-center shrink-0 group hover:scale-[1.02] transition-transform duration-200"
          >
            <img
              src="/images/console_logo.png"
              alt="Console Logo"
              className="h-14 w-auto object-contain"
            />
          </Link>
        )}

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 nav-group-hover" aria-label="Main navigation">
          {navLinks
            .filter((link) => user || link.href !== '/problem-of-the-day')
            .map((link) => renderNavItem(link))}

          {/* CTA Button */}
          {user ? (
            <Link
              to="/profile"
              className="ml-3 px-5 py-2 rounded-full font-mono text-sm tracking-wider text-white transition-all duration-200 hover:scale-[1.02] flex items-center gap-2 nav-cta-btn"
              style={{
                background: 'linear-gradient(90deg, #F2994A, #F0405C)',
                boxShadow: '0 0 0 1px rgba(242,153,74,0.4)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  '0 0 12px rgba(242,153,74,0.6), 0 0 0 1px rgba(242,153,74,0.6)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  '0 0 0 1px rgba(242,153,74,0.4)';
              }}
            >
              Profile
            </Link>
          ) : (
            <Link
              to="/login"
              className="ml-3 px-5 py-2 rounded-full font-mono text-sm tracking-wider text-white transition-all duration-200 hover:scale-[1.02] nav-cta-btn"
              style={{
                background: 'linear-gradient(90deg, #F2994A, #F0405C)',
                boxShadow: '0 0 0 1px rgba(242,153,74,0.4)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  '0 0 12px rgba(242,153,74,0.6), 0 0 0 1px rgba(242,153,74,0.6)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  '0 0 0 1px rgba(242,153,74,0.4)';
              }}
            >
              Login
            </Link>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white p-2 cursor-pointer bg-transparent border-0 outline-none"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="absolute top-full left-0 right-0 bg-black/98 backdrop-blur-xl border-b border-white/10 p-6 md:hidden flex flex-col gap-2"
          >
            {navLinks
              .filter((link) => user || link.href !== '/problem-of-the-day')
              .map((link) => renderNavItem(link, true))}

            {user ? (
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="px-6 py-3 rounded-full font-mono text-center mt-3 tracking-wider text-white"
                style={{ background: 'linear-gradient(90deg, #F2994A, #F0405C)' }}
              >
                Profile
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-6 py-3 rounded-full font-mono text-center mt-3 tracking-wider text-white"
                style={{ background: 'linear-gradient(90deg, #F2994A, #F0405C)' }}
              >
                Login
              </Link>
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
